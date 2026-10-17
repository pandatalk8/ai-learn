Title: Quantifying generalization in reinforcement learning

URL Source: http://openai.com/blog/quantifying-generalization-in-reinforcement-learning/

Markdown Content:
[Skip to main content](http://openai.com/blog/quantifying-generalization-in-reinforcement-learning/#main)

[](http://openai.com/)

*   [Research](http://openai.com/research/index/)
*   Products
*   [Business](http://openai.com/business/)
*   [Developers](http://openai.com/api/)
*   [Company](http://openai.com/about/)
*   [Foundation(opens in a new window)](https://openaifoundation.org/)

Log in[Try ChatGPT(opens in a new window)](https://chatgpt.com/)

*   Research
*   Products
*   Business
*   Developers
*   Company
*   [Foundation(opens in a new window)](https://openaifoundation.org/)

[Try ChatGPT(opens in a new window)](https://chatgpt.com/)Login

OpenAI

December 6, 2018

[Publication](http://openai.com/research/index/publication/)

# Quantifying generalization in reinforcement learning

[Read paper(opens in a new window)](https://arxiv.org/abs/1812.02341)[View code(opens in a new window)](https://github.com/openai/coinrun)

![Image 1: Quantifying Generalization In Reinforcement Learning](https://images.ctfassets.net/kftzwdyauwt9/5a6c4c0f-07eb-45c5-4963d069efe1/d9951a41be142b36cf85e87fdec086f8/Group_2147220970.png?w=3840&q=90&fm=webp)

Loading…

[Audio 2](http://openai.com/blog/quantifying-generalization-in-reinforcement-learning/)

Share

The generalization challenge

*   [The generalization challenge](http://openai.com/blog/quantifying-generalization-in-reinforcement-learning/#the-generalization-challenge)
*   [Rules of the game](http://openai.com/blog/quantifying-generalization-in-reinforcement-learning/#rules-of-the-game)
*   [Evaluating generalization](http://openai.com/blog/quantifying-generalization-in-reinforcement-learning/#evaluating-generalization)
*   [Improving generalization performance](http://openai.com/blog/quantifying-generalization-in-reinforcement-learning/#improving-generalization-performance)
*   [Additional environments](http://openai.com/blog/quantifying-generalization-in-reinforcement-learning/#additional-environments)
*   [Next steps](http://openai.com/blog/quantifying-generalization-in-reinforcement-learning/#next-steps)

*   [The generalization challenge](http://openai.com/blog/quantifying-generalization-in-reinforcement-learning/#the-generalization-challenge)
*   [Rules of the game](http://openai.com/blog/quantifying-generalization-in-reinforcement-learning/#rules-of-the-game)
*   [Evaluating generalization](http://openai.com/blog/quantifying-generalization-in-reinforcement-learning/#evaluating-generalization)
*   [Improving generalization performance](http://openai.com/blog/quantifying-generalization-in-reinforcement-learning/#improving-generalization-performance)
*   [Additional environments](http://openai.com/blog/quantifying-generalization-in-reinforcement-learning/#additional-environments)
*   [Next steps](http://openai.com/blog/quantifying-generalization-in-reinforcement-learning/#next-steps)

We’re releasing CoinRun, a training environment which provides a metric for an agent’s ability to transfer its experience to novel situations and has already helped clarify a[longstanding⁠(opens in a new window)](https://arxiv.org/pdf/1810.12282.pdf)[puzzle⁠(opens in a new window)](https://arxiv.org/pdf/1810.00123.pdf)in reinforcement learning. CoinRun strikes a desirable balance in complexity: the environment is simpler than traditional platformer games like Sonic the Hedgehog but still poses a worthy generalization challenge for state of the art algorithms.

Loading...

## The generalization challenge

Generalizing between tasks remains difficult for state of the art deep reinforcement learning[A](http://openai.com/blog/quantifying-generalization-in-reinforcement-learning/#citation-bottom-A) (RL) algorithms. Although trained agents can solve complex tasks, they struggle to transfer their experience to new environments. Even though people know that RL agents tend to overfit — that is, to latch onto the specifics of their environment rather than learn generalizable skills — RL agents are still benchmarked by evaluating on the environments they trained on. This would be like testing on your training set in supervised learning!

Previous work has used the[Sonic benchmark⁠(opens in a new window)](https://arxiv.org/abs/1804.03720),[procedurally generated gridworld mazes⁠(opens in a new window)](https://arxiv.org/abs/1804.06893), and the[General Video Game AI framework⁠(opens in a new window)](https://arxiv.org/abs/1806.10729)to address this problem. In all cases, generalization is measured by training and testing agents on different sets of levels. Agents trained on our Sonic benchmark were great at the training levels but performed poorly on the test levels without any fine-tuning. In a similar displays of overfitting, agents trained on procedurally generated mazes learned to memorize a large number of training levels, and GVG-AI agents performed poorly under difficulty settings that weren’t seen during training.

## Rules of the game

CoinRun was designed to be tractable for existing algorithms and mimics the style of platformer games like Sonic. The levels of CoinRun are[procedurally generated⁠(opens in a new window)](https://en.wikipedia.org/wiki/Procedural_generation), providing agents access to a large and easily quantifiable supply of training data. The goal of each CoinRun level is simple: collect the single coin that lies at the end of the level. Several obstacles, both stationary and non-stationary, lie between the agent and the coin. A collision with an obstacle results in the agent’s immediate death. The only reward in the environment is obtained by collecting the coin, and this reward is a ﬁxed positive constant. The level terminates when the agent dies, the coin is collected, or after 1000 time steps.

![Image 2: Side-by-side comparison of regular and increased Coinrun difficulty](https://images.ctfassets.net/kftzwdyauwt9/2e622741-17af-413b-9308e9313f3f/879743a321fb67262aa090fb4ffeeb14/coinrun-plus-difficulty.jpg?w=3840&q=90&fm=webp)

## Evaluating generalization

We trained 9 agents to play CoinRun, each with a different number of available training levels. The ﬁrst 8 agents trained on sets ranging from of 100 to 16,000 levels. We trained the ﬁnal agent on an unrestricted set of levels, so this agent never sees the same level twice. We trained our agents with policies using a[common⁠(opens in a new window)](https://www.nature.com/articles/nature14236)3-layer[convolutional architecture⁠(opens in a new window)](https://en.wikipedia.org/wiki/Convolutional_neural_network), which we call Nature-CNN. Our agents trained with[Proximal Policy Optimization⁠(opens in a new window)](https://arxiv.org/abs/1707.06347)([PPO⁠(opens in a new window)](https://blog.openai.com/openai-baselines-ppo/#ppo)) for a total of 256M timesteps. Since an epsiode lasts 100 timesteps on average, agents with fixed training sets will see each training level thousands to millions of times. The final agent, trained with the unrestricted set, will see roughly 2 million distinct levels — each of them exactly once.

We collected each data point in the following graphs by averaging the ﬁnal agent’s performance across 10,000 episodes. At test time, the agent is evaluated on never-before-seen levels. We discovered substantial overﬁtting occurs when there are less than 4,000 training levels.**In fact, we still see overfitting even with 16,000 training levels!**Unsurprisingly, agents trained with the unrestricted set of levels performed best, as these agents had access to the most data. These agents are represented by the dotted line in the following graphs.

We compared our Nature-CNN baseline against the convolutional architecture used in[IMPALA⁠(opens in a new window)](https://arxiv.org/abs/1802.01561)and found the IMPALA-CNN agents generalized _much better_ with any training set as seen below.

![Image 3: Nat Vs Imp Generalization 1](https://images.ctfassets.net/kftzwdyauwt9/0ee1e4de-768a-457b-b94954a1e1d8/f416bb87c216d27476bfc66393e78348/nat-vs-imp_generalization-1.svg?w=3840&q=90)

Left: Final train and test performance of**Nature-CNN agents**after 256M timesteps, as a function of the number of training levels.

Right: Final train and test performance of**IMPALA-CNN agents**after 256M timesteps, as a function of number of training levels.

## Improving generalization performance

In our next experiments, we used a fixed training set of 500 CoinRun levels. Our baseline agents struggle to generalize with so few levels, making this an ideal training set for a benchmark. We encourage others to evaluate their own methods by training on the same 500 levels, directly comparing test time performance. Using this training set, we investigated the impact of several regularization techniques:

*   **Dropout and L2 regularization**: Both noticeably reduce the generalization gap, though L2 regularization has a bigger impact.
*   **Data augmentation**(modified[Cutout⁠(opens in a new window)](https://arxiv.org/abs/1708.04552)) and[**batch normalization**⁠(opens in a new window)](https://arxiv.org/abs/1502.03167): Both data augmentation and batch normalization significantly improve generalization.
*   **Environmental stochasticity**: Training with stochasticity improves generalization to a greater extent than any of the previously mentioned techniques (see the[paper⁠(opens in a new window)](https://arxiv.org/abs/1812.02341)for details).

![Image 4: Misc Gen 500](https://images.ctfassets.net/kftzwdyauwt9/896f6e54-6655-44d5-3a836f3b36bc/22e93e3839cd76b31a13c367282352b5/misc_gen_500.svg?w=3840&q=90)

## Additional environments

We also developed two additional environments to investigate overﬁtting: a CoinRun variant called**CoinRun-Platforms**and a simple maze navigation environment called**RandomMazes**. In these experiments, we used the original IMPALA-CNN architecture followed by a[LSTM⁠(opens in a new window)](http://colah.github.io/posts/2015-08-Understanding-LSTMs/), since memory is necessary to perform well in these environments.

Loading...

In CoinRun-Platforms, there are several coins the agent attempts to collect within the 1000 step time-limit. Coins are randomly scattered across platforms in the level. Levels are a larger, ﬁxed size in CoinRun-Platforms, so the agent must more actively explore, occasionally retracing its steps.

![Image 5: Plat Gen 1](https://images.ctfassets.net/kftzwdyauwt9/e0b6b5be-ff9d-45d3-1f7dee44fdba/a2df8498123b6d21f9bf390f7a05f790/plat_gen-1.svg?w=3840&q=90)

Final train and test performance in**CoinRun-Platforms**after 2B timesteps, as a function of the number of training levels.

When we ran both CoinRun-Platforms and RandomMazes through our baseline experiment, our agents strongly overfit in all cases. We observe particularly strong overﬁtting in the case of RandomMazes, as a sizeable generalization gap remains even when using 20,000 training levels.

![Image 6: Random Mazes Generalization 2](https://images.ctfassets.net/kftzwdyauwt9/ba4f735f-8111-4b84-4193217a818e/50e057a7436c9c84b00aac0839abeae8/random_mazes_generalization-2.svg?w=3840&q=90)

## Next steps

Our results provide insight into the challenges underlying generalization in RL. Using the procedurally generated CoinRun environment, we can precisely quantify such overﬁtting. With this metric, we can better evaluate key architectural and algorithmic decisions. We believe that the lessons learned from this environment will apply in more complex settings, and we hope to use this benchmark, and others like it, to iterate towards more generalizable agents.

We suggest the following for future research:

*   Investigate the relationship between environment complexity and the number of levels required for good generalization
*   Investigate whether different recurrent architectures are better suited for generalization in these environments
*   Explore ways to effectively combine different regularization methods

If you are interested in this line of research, consider[working at OpenAI⁠](http://openai.com/careers/)!

*   [Exploration & Games](http://openai.com/research/index/?tags=exploration-game)
*   [Learning Paradigms](http://openai.com/research/index/?tags=learning-paradigms)
*   [Simulated Environments](http://openai.com/research/index/?tags=simulated-environments)

## Footnotes

1.   A Even[impressive⁠(opens in a new window)](https://deepmind.com/blog/capture-the-flag/)RL policies are often trained without supervised learning techniques such as dropout and batch normalization. In the CoinRun generalization regime, however, we find that these methods do have a positive impact and that our previous RL policies were overfitting to particular MDPs. 

## Author

Karl Cobbe

## Acknowledgments

Thanks to the many people who contributed to this paper and blog post:

Oleg Klimov, Chris Hesse, Taehoon Kim, John Schulman, Mira Murati, Jack Clark, Ashley Pilipiszyn, Matthias Plappert, Ilya Sutskever, Greg Brockman

External reviewers:

Jon Walsh, Caleb Kruse, Nikhil Mishra

## Assets

[Kenney⁠(opens in a new window)](https://www.kenney.nl/)

## Related articles

[View all](http://openai.com/news/)

![Image 7: Scaling Laws For Reward Model Overoptimization](https://images.ctfassets.net/kftzwdyauwt9/a8801fe6-8892-472b-f746d1d9fb2d/547c46ed9a8a71e89efbb7a7963a8932/image-6.webp?w=3840&q=90&fm=webp)

[Scaling laws for reward model overoptimization Publication Oct 19, 2022](http://openai.com/index/scaling-laws-for-reward-model-overoptimization/)

![Image 8: Screenshot of a scene from Minecraft](https://images.ctfassets.net/kftzwdyauwt9/ef9fc360-1a5a-4ca3-5c25b83b3564/50c07940455cc86ef84d91526d9cf3e0/vpt.jpg?w=3840&q=90&fm=webp)

[Learning to play Minecraft with Video PreTraining Conclusion Jun 23, 2022](http://openai.com/index/vpt/)

![Image 9: Group of people posing behind a panel](https://images.ctfassets.net/kftzwdyauwt9/e7b99f23-347e-4bc9-9e110180fdae/7ae5d14a2436edfbb925876fccae36ca/dota-2-with-large-scale-deep-reinforcement-learning.jpg?w=3840&q=90&fm=webp)

[Dota 2 with large scale deep reinforcement learning Publication Dec 13, 2019](http://openai.com/index/dota-2-with-large-scale-deep-reinforcement-learning/)

Research
*   [Research Index](http://openai.com/research/index/)
*   [Research Overview](http://openai.com/research/)
*   [Economic Research](http://openai.com/signals/)

Latest Advancements
*   [GPT-5.6](http://openai.com/index/gpt-5-6/)
*   [GPT-5.5](http://openai.com/index/introducing-gpt-5-5/)
*   [GPT-5.4](http://openai.com/index/introducing-gpt-5-4/)

Safety
*   [Safety Approach](http://openai.com/safety/)
*   [Deployment Safety(opens in a new window)](https://deploymentsafety.openai.com/)
*   [Security & Privacy](http://openai.com/security-and-privacy/)
*   [Trust & Transparency](http://openai.com/trust-and-transparency/)

Products
*   [ChatGPT(opens in a new window)](https://chatgpt.com/)
*   [ChatGPT Business(opens in a new window)](https://chatgpt.com/business/)
*   [ChatGPT Enterprise(opens in a new window)](https://chatgpt.com/business/enterprise/)
*   [ChatGPT for Education(opens in a new window)](https://chatgpt.com/business/education/)
*   [Codex](http://openai.com/codex/)
*   [Release Notes](http://openai.com/products/release-notes/)

API Platform
*   [Overview](http://openai.com/api/)
*   [API Log In(opens in a new window)](https://platform.openai.com/login)
*   [Docs(opens in a new window)](https://developers.openai.com/api/docs)

Business
*   [Overview](http://openai.com/business/)
*   [Solutions](http://openai.com/solutions/)
*   [Resources](http://openai.com/business/learn/)
*   [Customer Stories](http://openai.com/business/customer-stories/)
*   [Partner Network](http://openai.com/business/partners/)
*   [Contact Sales](http://openai.com/contact-sales/)

Developers
*   [Apps SDK(opens in a new window)](https://developers.openai.com/apps-sdk)
*   [Open Models](http://openai.com/open-models/)
*   [Docs(opens in a new window)](https://developers.openai.com/)
*   [Resources(opens in a new window)](https://developers.openai.com/learn)
*   [Developer Forum(opens in a new window)](https://community.openai.com/)

Company
*   [About Us](http://openai.com/about/)
*   [Our Charter](http://openai.com/charter/)
*   [Careers](http://openai.com/careers/)
*   [News](http://openai.com/news/)

Support
*   [Help Center(opens in a new window)](https://help.openai.com/)

More
*   [Stories](http://openai.com/stories/)
*   [Academy](http://openai.com/academy/)
*   [Supply Co.](http://openai.com/supply/)
*   [Livestreams](http://openai.com/live/)
*   [Podcast](http://openai.com/podcast/)
*   [RSS](https://openai.com/news/rss.xml)

Terms & Policies
*   [Terms of Use](http://openai.com/policies/terms-of-use/)
*   [Privacy Policy](http://openai.com/policies/privacy-policy/)
*   [Other Policies](http://openai.com/policies/)

[(opens in a new window)](https://x.com/OpenAI)[(opens in a new window)](https://www.youtube.com/OpenAI)[(opens in a new window)](https://www.linkedin.com/company/openai)[(opens in a new window)](https://github.com/openai)[(opens in a new window)](https://www.instagram.com/openai/)[(opens in a new window)](https://www.tiktok.com/@openai)[(opens in a new window)](https://discord.gg/openai)

OpenAI © 2015–2026 Your privacy choices

English United States
