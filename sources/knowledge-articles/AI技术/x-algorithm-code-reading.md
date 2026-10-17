# X 推荐算法源码解读：真正决定推荐的，不是某一个互动数，而是“预测你会产生什么行为”

结论先说：从 `xai-org/x-algorithm` 这份代码看，X 的 For You 推荐不是简单按点赞数、转发数、作者粉丝数或时间新鲜度排序。真正起决定作用的是 Phoenix 模型对“你看到这条内容后可能产生哪些行为”的预测，再把这些行为概率按业务权重合成最终分数。更具体地说，被推荐内容通常会在这些维度上表现突出：

1. 和你的历史行为序列相似。你最近喜欢、回复、转发、停留、观看的视频，会被编码成用户表示，召回阶段优先找向量上接近的内容。
2. Phoenix 预测你会产生正向行为。包括 favorite、reply、retweet、quote、click、profile click、video quality view、share、dwell、follow author 等。
3. Phoenix 预测你不会产生强负反馈。not interested、block author、mute author、report、not dwelled 这类预测会被作为负项压低分数。
4. 内容本身能通过过滤器。重复、太旧、已看过、已服务过、自己发的、被屏蔽/静音关系、不可见/安全风险、话题不匹配等都会被提前或最终剔除。
5. 排序后还要服从供给和体验约束。作者多样性会衰减同一作者的连续占位，out-of-network 内容会被乘上权重因子，广告、Who to Follow、prompt、push-to-home 还会在外层 feed 混排。

换句话说，一条内容能不能被 X 推荐，核心不在“它现在有多少公开互动”，而在“系统预测你会不会对它做出有价值的动作，并且它能不能在安全、社交关系、去重、时效、多样性和广告混排规则下留下来”。公开互动数在代码中会作为候选特征存在，但主排序不是手写规则堆出来的热度公式，而是 Phoenix/Grok 风格 Transformer 输出多目标行为概率，再由业务权重和约束层加工。

## 一、全局架构：两层 pipeline，内层排帖子，外层组 feed

仓库的 README 把系统分成四块：`home-mixer`、`thunder`、`phoenix` 和 `candidate-pipeline`。源码里可以看到它们的职责边界很清楚。

`candidate-pipeline` 是通用执行框架。它定义了 `QueryHydrator`、`Source`、`Hydrator`、`Filter`、`Scorer`、`Selector`、`SideEffect` 几类组件，并在 `CandidatePipeline::execute` 中固定执行顺序：

```text
query hydration
→ dependent query hydration
→ candidate sources
→ candidate hydration
→ pre-scoring filters
→ scorers
→ selector
→ post-selection hydrators
→ post-selection filters
→ side effects
```

这里有几个重要设计。Query hydrator、source、hydrator 会并行执行，适合同时请求多个外部服务；filter 和 scorer 则顺序执行，因为它们通常依赖前一阶段的结果。Hydrator 不能丢候选，只能补字段；是否删除候选必须交给 Filter。这个约束让 pipeline 的行为更可观测，也让每个阶段职责清晰。

`home-mixer` 里有两条 pipeline：

第一条是 `PhoenixCandidatePipeline`，它负责产出排好序的 `PostCandidate`。这是 For You 推荐的主体链路。

第二条是 `ForYouCandidatePipeline`，它调用 `ScoredPostsSource` 获取已经排序的帖子，再加入广告、Who to Follow、prompts、push-to-home 等非帖子模块，最后用 `BlenderSelector` 混成客户端真正看到的 feed item。

所以全局上可以理解为：

```text
用户请求
→ 构造 ScoredPostsQuery
→ PhoenixCandidatePipeline 召回、过滤、打分、选 TopK 帖子
→ ScoredPostsServer 转成 ScoredPost
→ ForYouCandidatePipeline 加广告/关注推荐/prompt/push-to-home
→ BlenderSelector 混排
→ URT timeline response
```

## 二、Query Hydration：先把“你是谁、最近做了什么”补齐

排序不是只看候选帖子，还强依赖请求上下文。`ScoredPostsQuery` 里包含 user id、客户端、语言国家、seen ids、served ids、是否只看关注流、话题请求、排除话题、新用户话题、IP、设备、订阅等级、用户画像、已服务历史等字段。

`PhoenixCandidatePipeline` 装配了大量 query hydrator，其中最关键的是两条用户行为序列：

`ScoringSequenceQueryHydrator` 从 User Action Aggregation 服务取 scoring sequence，用于 Phoenix ranker。它会读取 `MaxSeqLengthScoring`、`PhoenixAggregationType`、`IncludeRealtimeActions` 等参数，并把结果写入 `query.scoring_sequence` 和 `query.columnar_scoring_sequence`。

`RetrievalSequenceQueryHydrator` 取 retrieval sequence，用于 Phoenix retrieval。它和 scoring sequence 分开，是因为召回与精排可以使用不同的序列长度和聚合方式。

另外还有社交关系和上下文 hydrator：blocked users、muted users、followed users、subscribed users、mutual follow、cached posts、followed Grok topics、starter packs、inferred Grok topics、impression bloom filter、IP location、用户性别/年龄画像等。这些信息一部分进模型，一部分进过滤和业务规则。

关键点是：推荐请求到达时，系统先把用户历史和上下文补成一个较完整的 query，然后才开始召回候选。

## 三、候选召回：关注关系靠 Thunder，圈外内容靠 Phoenix Retrieval

候选来源在 `PhoenixCandidatePipeline` 中装配，主要包括：

```text
ThunderSource
TweetMixerSource
PhoenixSource
PhoenixTopicsSource
PhoenixMOESource
CachedPostsSource
```

### 1. Thunder：关注关系内的实时候选

`ThunderSource` 调用 Thunder 的 `GetInNetworkPosts` gRPC 服务，传入关注列表、最大结果数、已看过的 tweet id 和算法参数。它返回的是 in-network 内容，也就是你关注的人最近发的内容。

Thunder 自己维护一个内存 post store。`PostStore` 用 DashMap 按作者维护三类队列：

1. 原创帖子队列。
2. 回复和转推等 secondary 队列。
3. 视频帖子队列。

Kafka listener 消费发帖/删帖事件，把 `LightPost` 写入 store；删除事件会移除 post 并记录 deleted 标记。查询时，Thunder 按关注用户列表从每个作者的队列逆序扫描最新帖子，排除 seen ids，限制每个作者最大扫描量和返回量，最后 `score_recent` 按 `created_at` 倒序取 max results。

这说明 Thunder 的职责不是最终精排，而是低延迟提供“你关注的人最近发了什么”。它偏实时、偏召回，最后仍会进入 Phoenix 打分和统一过滤。

### 2. PhoenixSource：圈外内容的向量召回

`PhoenixSource` 在不是纯关注流、不是已命中缓存、且不是普通单话题请求时启用。它要求 query 中已有 `retrieval_sequence`，然后调用 `phoenix_retrieval_client.retrieve`。

它传给 retrieval 服务的核心内容包括：

1. user id。
2. 用户 retrieval action sequence。
3. columnar sequence。
4. `PhoenixMaxResults`。
5. client context 和 user context。
6. 可选 topic 约束。

返回结果里的 `TweetInfo` 被转换成 `PostCandidate`，并标记 `ServedType::ForYouPhoenixRetrieval`。

### 3. PhoenixTopicsSource 和 PhoenixMOESource：话题和专家化召回

`PhoenixTopicsSource` 处理话题请求或新用户话题召回。它会把 topic id 扩展成 entity id，并传给 Phoenix retrieval，同时根据 `TopicFilteringId` 和 override map 决定话题过滤模式。

`PhoenixMOESource` 是可开关的 Mixture-of-Experts 风格召回源，受 `EnablePhoenixMOESource` 控制，使用单独的 cluster 和 max results 参数，返回 `ForYouPhoenixRetrievalMoe`。

召回阶段的核心思想是多源并行：关注内用 Thunder 兜住新鲜内容，关注外用 Phoenix 向量模型从全局语料找相似内容，话题/新用户/实验源用不同 cluster 和参数补充供给。

## 四、候选 Hydration：给候选补足排序和过滤需要的字段

候选被召回后通常只有 tweet id、author id、reply/retweet 等少量字段。`PhoenixCandidatePipeline` 接着运行一组 candidate hydrator：

```text
InNetworkCandidateHydrator
CoreDataCandidateHydrator
QuoteHydrator
VideoDurationCandidateHydrator
HasMediaHydrator
SubscriptionHydrator
GizmoduckCandidateHydrator
BlockedByHydrator
FilteredTopicsHydrator
LanguageCodeHydrator
```

这些 hydrator 会补文本、作者信息、引用帖、视频时长、是否有媒体、订阅权限、作者粉丝数和 screen name、作者是否屏蔽 viewer、话题过滤信息、语言等。这里补出的字段，一部分直接给 Phoenix request，一部分给 filter，一部分给最终 response。

`PostCandidate` 的字段很能说明系统关心什么：它保存 tweet id、author id、文本、回复/转推/引用关系、Phoenix 多目标分数、weighted score、final score、served type、in-network 标记、conversation ancestors、视频时长、作者粉丝数、可见性原因、订阅作者、媒体/语言、互动计数、mutual follow jaccard、brand safety verdict、安全标签等。

这不是一个只服务模型的结构，而是推荐、过滤、安全、广告、客户端展示共同使用的候选对象。

## 五、过滤：模型打分前后都有硬约束

预打分过滤器包括：

```text
DropDuplicatesFilter
CoreDataHydrationFilter
AgeFilter
SelfTweetFilter
RetweetDeduplicationFilter
IneligibleSubscriptionFilter
PreviouslySeenPostsFilter
PreviouslySeenPostsBackupFilter
PreviouslyServedPostsFilter
MutedKeywordFilter
AuthorSocialgraphFilter
VideoFilter
TopicIdsFilter
NewUserTopicIdsFilter
```

几个例子能看出它们的性质：

`DropDuplicatesFilter` 用 HashSet 按 tweet id 去重，保留第一次出现的候选。

`AgeFilter` 从 snowflake/tweet id 推导创建时间，只保留在 `MAX_POST_AGE` 内的内容。

`AuthorSocialgraphFilter` 会移除作者被 viewer 屏蔽/静音、作者屏蔽 viewer、引用作者屏蔽 viewer、viewer 屏蔽引用作者或转推原作者的候选。

`VFFilter` 属于 post-selection filter。它在候选已经被选出来后，根据 visibility filtering 的 `FilteredReason` 判断是否要 drop。只要 safety result action 是 Drop，或者存在其他过滤原因，就会移除。

这意味着模型分数不是通行证。即使 Phoenix 预测你会喜欢，如果内容违反可见性、社交关系、订阅、话题、去重或历史曝光约束，也不会进入最终 feed。

## 六、Phoenix Scorer：Grok 风格 Transformer 预测多种行为概率

`PhoenixScorer` 是模型打分入口。它先根据 query 参数和 decider 选择 Phoenix cluster；如果用户历史行为数量低于新用户阈值，会切到新用户 ranker cluster。然后它调用 `build_prediction_request` 构造模型请求，并使用 Phoenix prediction client 或 egress sidecar 获取预测。

预测结果按候选原始 tweet id 写回 `candidate.phoenix_scores`。这些分数字段包括：

```text
favorite
reply
retweet
photo_expand
click
profile_click
vqv
share
share_via_dm
share_via_copy_link
dwell
quote
quoted_click
quoted_vqv
follow_author
not_interested
block_author
mute_author
report
not_dwelled
dwell_time
click_dwell_time
```

Phoenix 模型本体在 `phoenix/recsys_model.py`。它的输入不是原始文本，而是已经查表后的 hash embedding：

1. user hashes → user embedding。
2. history post hashes + author hashes + action embedding + product surface + dwell/time 等连续值 → history sequence embedding。
3. candidate post hashes + author hashes + product surface + post age bucket → candidate embedding。

这些 embedding 被拼成：

```text
[user token] + [history sequence] + [candidate sequence]
```

然后送入从 Grok-1 改造来的 Transformer。模型输出候选位置的 embedding，再通过 unembedding 矩阵得到 `[batch, candidates, actions]` 形状的 logits，最后变成各行为概率；连续头则预测 dwell time 等连续目标。

## 七、最关键的模型细节：Candidate Isolation

Phoenix ranker 的一个关键设计是 candidate isolation。`grok.py` 中的 `make_recsys_attn_mask` 会构造特殊 attention mask：

1. 用户 token 和历史 token 使用 causal mask。
2. 候选 token 可以看用户和历史。
3. 候选 token 只能看自己，不能看其他候选。

代码上，它先构造完整 causal mask，然后把 candidate-to-candidate 的右下角 block 清零，再把候选自己的对角线加回来。

这个设计很重要。它保证某条候选的分数只依赖“用户上下文 + 候选自身”，而不依赖同 batch 里还放了哪些其他候选。好处是分数更稳定，也更容易缓存和解释：同一用户上下文下，候选 A 不会因为旁边换成候选 B 或 C 而改变模型输出。

## 八、Phoenix Retrieval：两塔模型先从大语料中缩小范围

精排 Transformer 很强，但不能直接对全量帖子逐条打分。所以 `phoenix/recsys_retrieval_model.py` 提供两塔召回：

User Tower 用和 ranker 相同风格的 Transformer 编码 user + history，输出 L2 normalized user representation。

Candidate Tower 把 post embedding 和 author embedding 拼接后，通过两层 MLP + SiLU 投影到同一向量空间，再 L2 normalize。

召回时做：

```text
scores = user_representation @ corpus_embeddings.T
top_k = top scores
```

发布的 `run_pipeline.py` 演示了完整流程：加载 retrieval 和 ranker checkpoint，读取 example sequence，先对 sports corpus 做 dot product 取 top-K，再把这些候选分批送入 ranker，最后按示例权重把 favorite、reply、retweet、dwell 合成展示分数。

生产的 Rust `home-mixer` 不直接跑这个 Python 脚本，而是通过 Phoenix retrieval/prediction 服务调用模型。但 Python 代码说明了模型结构和推理方式。

## 九、RankingScorer：多目标预测如何变成最终排序分

`RankingScorer` 是推荐分数合成的核心。它从 feature switch 参数读取权重：

```text
FavoriteWeight
ReplyWeight
RetweetWeight
PhotoExpandWeight
ClickWeight
ProfileClickWeight
VqvWeight
ShareWeight
ShareViaDmWeight
ShareViaCopyLinkWeight
DwellWeight
QuoteWeight
QuotedClickWeight
QuotedVqvWeight
ContDwellTimeWeight
ContClickDwellTimeWeight
FollowAuthorWeight
NotInterestedWeight
BlockAuthorWeight
MuteAuthorWeight
ReportWeight
NotDwelledWeight
```

然后计算：

```text
combined_score = Σ action_probability_or_value × action_weight
```

这里有几个细节：

第一，视频相关权重不是无条件生效。`vqv_weight` 会根据 query、候选、最小时长参数判断候选是否有资格获得视频观看权重。引用视频也有单独的 quoted vqv 权重和时长检查。

第二，负反馈是分数公式的一部分。not interested、block、mute、report、not dwelled 不是过滤器才处理的东西，它们也会在排序分里把候选压低。

第三，`offset_score` 会把负区间做偏移和缩放。正分会加 `NEGATIVE_SCORES_OFFSET`，负分则按 negative sum 和 total sum 映射，避免分数体系在正负权重混合时不稳定。

第四，分数还会经过 `normalize_score`。从调用点看，系统在原始加权分之外还有候选级归一化，用来把不同类型候选的分数放进更稳定的排序区间。

第五，作者多样性直接改变最终分。`apply_author_diversity` 会先按 weighted score 降序遍历候选，对同一 author 的第 2、3、4 条内容乘以衰减系数：

```text
multiplier = (1 - floor) * decay_factor^position + floor
```

这说明“同一作者连续多条高分内容”会被压低，而不是纯粹按模型分一路排到底。

第六，out-of-network 内容会被额外乘权。`effective_oon_weight` 在普通 For You、话题请求、新用户场景下返回不同的 OON factor。最终：

```text
if candidate.in_network == false:
    final_score = after_diversity * effective_oon
else:
    final_score = after_diversity
```

所以最终排序分大致是：

```text
Phoenix 多行为预测
→ 行为权重加权
→ 分数归一化/偏移
→ 作者多样性衰减
→ OON 权重调整
→ optional VMRanker 重排
```

如果 `EnableVMRanker` 打开，`VMRanker` 还会把候选、Phoenix scores、in_network、是否转推/回复、作者粉丝数、VQV eligibility、DPP 参数等发给 value model ranker 服务，由它返回新的 score。这是一个可选的重排层。

## 十、Selector 与后处理：先选 TopK，再做最终可见性过滤

`TopKScoreSelector` 很直接：按 `candidate.score` 降序排序，选 `TOP_K_CANDIDATES_TO_SELECT`。

但选出来之后还会跑 post-selection hydrator 和 filter：

```text
VFCandidateHydrator
AdsBrandSafetyHydrator
AdsBrandSafetyVfHydrator
TweetTypeMetricsHydrator
FollowingRepliedUsersHydrator
MutualFollowJaccardHydrator

VFFilter
AncillaryVFFilter
DedupConversationFilter
```

这一步补充安全、广告品牌安全、tweet 类型指标、关注用户回复、共同关注等信息，然后做可见性过滤和会话去重。最终 `ScoredPostsServer` 把 `PostCandidate` 转成 `ScoredPost`，包括 tweet id、author id、score、served type、in_network、ancestors、visibility reason、tweet type metrics、brand safety verdict、安全标签和文本等。

## 十一、外层混排：For You 不是只有帖子

帖子排完后，`ForYouCandidatePipeline` 会把 `ScoredPostsSource` 的帖子和其他来源合并：

```text
ScoredPostsSource
AdsSource
WhoToFollowSource
PromptsSource
PushToHomeSource
```

`BlenderSelector` 先把 FeedItem 分区成 posts、ads、who-to-follow、prompts、push-to-home。广告混排可选 `safe_gap` 或默认 partition organic blender。`SafeGapAdsBlender` 会先找安全插入间隙，再按广告期望位置和 spacing 选择最接近的 gap。Prompt 会插入固定位置，Who to Follow 插入固定位置，Push to Home 会 pin 到最前面。

这解释了一个常见现象：用户看到的 feed 顺序不完全等于帖子模型分排序。帖子排序只是 organic posts 的主序，最终 feed 还要叠加广告和产品模块。

## 十二、Grox：内容理解是推荐供给的上游基础设施

这次仓库还加入了 `grox/`。它不是 For You 排序链路里的一个 scorer，而是内容理解/标注服务。`Dispatcher` 从不同 stream generator 取任务，`Engine` 执行任务，`PlanMaster` 并行跑多个 plan：

```text
PlanInitialBanger
PlanPostSafety
PlanSpamComment
PlanPostEmbeddingWithSummary
PlanPostEmbeddingWithSummaryForReply
PlanPostEmbeddingV5
PlanPostEmbeddingV5ForReply
PlanReplyRanking
PlanSafetyPtos
```

这些 plan 对应 spam、post safety、PTOS、安全分类、多模态 post embedding、reply ranking 等任务。它们的输出会成为候选索引、内容安全、embedding、过滤和排序的上游信号。

## 十三、这份开源代码的边界

需要注意三点。

第一，README 明确说 Phoenix Python 代码是 representative sample，生产系统有更大的模型和特定扩展优化；开源包里提供的是 mini/frozen checkpoint 和 demo corpus。

第二，很多 Rust 侧依赖是公司内部 crate 或 proto，例如 feature switches、clients、visibility filtering、social graph、TES、Gizmoduck、Strato、VMRanker 等。我们能看到 pipeline 如何装配和调用，但看不到所有服务内部实现和线上参数值。

第三，权重不是硬编码在这份主链路里，而是通过 `query.params.get(...)` 从 feature switch 参数读取。因此不能从源码静态得出“点赞权重一定是多少、回复一定是多少”。可以确定的是：最终分数是多行为预测 × 可配置权重，并带有负反馈、作者多样性、OON、新用户、话题、视频资格等调整。

## 总结

X For You 的实现可以概括为一条现代推荐系统链路：

```text
用户上下文 hydration
→ 多源候选召回
→ 候选特征 hydration
→ 硬过滤
→ Phoenix 多目标行为预测
→ 权重合成与多样性/OON 调整
→ TopK 选择
→ 安全和会话后过滤
→ 广告和产品模块混排
→ 返回 feed
```

决定一条内容能否被推荐的首要维度，不是单一热度，而是“在你的历史行为上下文中，模型预测它会触发多少正向价值行为、触发多少负反馈，以及它是否满足各种可见性和体验约束”。这也是 Phoenix 架构取代大量手写特征的核心意图：把相关性判断交给 Transformer 从用户行为序列中学习，把硬约束、业务权重和混排策略留在可配置的服务层。

## 参考源码

- 项目主页：https://github.com/xai-org/x-algorithm
- README：https://github.com/xai-org/x-algorithm/blob/main/README.md
- Phoenix README：https://github.com/xai-org/x-algorithm/blob/main/phoenix/README.md
- Pipeline 框架：https://github.com/xai-org/x-algorithm/blob/main/candidate-pipeline/candidate_pipeline.rs
- Home Mixer Phoenix pipeline：https://github.com/xai-org/x-algorithm/blob/main/home-mixer/candidate_pipeline/phoenix_candidate_pipeline.rs
- Phoenix ranker：https://github.com/xai-org/x-algorithm/blob/main/phoenix/recsys_model.py
- Phoenix retrieval：https://github.com/xai-org/x-algorithm/blob/main/phoenix/recsys_retrieval_model.py
- Grok Transformer mask：https://github.com/xai-org/x-algorithm/blob/main/phoenix/grok.py
- Thunder post store：https://github.com/xai-org/x-algorithm/blob/main/thunder/posts/post_store.rs
