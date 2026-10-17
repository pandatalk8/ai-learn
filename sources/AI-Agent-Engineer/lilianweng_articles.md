# Lil'Log 文章标题与描述

> 来源：[Lil'Log](https://lilianweng.github.io/)；范围为站点 sitemap 中的全部文章页面（`/posts/YYYY-MM-DD-.../`）。
> 抓取日期：2026-07-24；共 52 篇。

## 文章目录

1. [Harness Engineering for Self-Improvement](#1-harness-engineering-for-self-improvement)
2. [Scaling Laws, Carefully](#2-scaling-laws-carefully)
3. [Why We Think](#3-why-we-think)
4. [Reward Hacking in Reinforcement Learning](#4-reward-hacking-in-reinforcement-learning)
5. [Extrinsic Hallucinations in LLMs](#5-extrinsic-hallucinations-in-llms)
6. [Diffusion Models for Video Generation](#6-diffusion-models-for-video-generation)
7. [Thinking about High-Quality Human Data](#7-thinking-about-high-quality-human-data)
8. [Adversarial Attacks on LLMs](#8-adversarial-attacks-on-llms)
9. [LLM Powered Autonomous Agents](#9-llm-powered-autonomous-agents)
10. [Prompt Engineering](#10-prompt-engineering)
11. [The Transformer Family Version 2.0](#11-the-transformer-family-version-2-0)
12. [Large Transformer Model Inference Optimization](#12-large-transformer-model-inference-optimization)
13. [Some Math behind Neural Tangent Kernel](#13-some-math-behind-neural-tangent-kernel)
14. [Generalized Visual Language Models](#14-generalized-visual-language-models)
15. [Learning with not Enough Data Part 3: Data Generation](#15-learning-with-not-enough-data-part-3-data-generation)
16. [Learning with not Enough Data Part 2: Active Learning](#16-learning-with-not-enough-data-part-2-active-learning)
17. [Learning with not Enough Data Part 1: Semi-Supervised Learning](#17-learning-with-not-enough-data-part-1-semi-supervised-learning)
18. [How to Train Really Large Models on Many GPUs?](#18-how-to-train-really-large-models-on-many-gpus)
19. [What are Diffusion Models?](#19-what-are-diffusion-models)
20. [Contrastive Representation Learning](#20-contrastive-representation-learning)
21. [Reducing Toxicity in Language Models](#21-reducing-toxicity-in-language-models)
22. [Controllable Neural Text Generation](#22-controllable-neural-text-generation)
23. [How to Build an Open-Domain Question Answering System?](#23-how-to-build-an-open-domain-question-answering-system)
24. [Neural Architecture Search](#24-neural-architecture-search)
25. [Exploration Strategies in Deep Reinforcement Learning](#25-exploration-strategies-in-deep-reinforcement-learning)
26. [The Transformer Family](#26-the-transformer-family)
27. [Curriculum for Reinforcement Learning](#27-curriculum-for-reinforcement-learning)
28. [Self-Supervised Representation Learning](#28-self-supervised-representation-learning)
29. [Evolution Strategies](#29-evolution-strategies)
30. [Meta Reinforcement Learning](#30-meta-reinforcement-learning)
31. [Domain Randomization for Sim2Real Transfer](#31-domain-randomization-for-sim2real-transfer)
32. [Are Deep Neural Networks Dramatically Overfitted?](#32-are-deep-neural-networks-dramatically-overfitted)
33. [Generalized Language Models](#33-generalized-language-models)
34. [Object Detection Part 4: Fast Detection Models](#34-object-detection-part-4-fast-detection-models)
35. [Meta-Learning: Learning to Learn Fast](#35-meta-learning-learning-to-learn-fast)
36. [Flow-based Deep Generative Models](#36-flow-based-deep-generative-models)
37. [From Autoencoder to Beta-VAE](#37-from-autoencoder-to-beta-vae)
38. [Attention? Attention!](#38-attention-attention)
39. [Implementing Deep Reinforcement Learning Models with Tensorflow + OpenAI Gym](#39-implementing-deep-reinforcement-learning-models-with-tensorflow-openai-gym)
40. [Policy Gradient Algorithms](#40-policy-gradient-algorithms)
41. [A (Long) Peek into Reinforcement Learning](#41-a-long-peek-into-reinforcement-learning)
42. [The Multi-Armed Bandit Problem and Its Solutions](#42-the-multi-armed-bandit-problem-and-its-solutions)
43. [Object Detection for Dummies Part 3: R-CNN Family](#43-object-detection-for-dummies-part-3-r-cnn-family)
44. [Object Detection for Dummies Part 2: CNN, DPM and Overfeat](#44-object-detection-for-dummies-part-2-cnn-dpm-and-overfeat)
45. [Object Detection for Dummies Part 1: Gradient Vector, HOG, and SS](#45-object-detection-for-dummies-part-1-gradient-vector-hog-and-ss)
46. [Learning Word Embedding](#46-learning-word-embedding)
47. [Anatomize Deep Learning with Information Theory](#47-anatomize-deep-learning-with-information-theory)
48. [From GAN to WGAN](#48-from-gan-to-wgan)
49. [How to Explain the Prediction of a Machine Learning Model?](#49-how-to-explain-the-prediction-of-a-machine-learning-model)
50. [Predict Stock Prices Using RNN: Part 2](#50-predict-stock-prices-using-rnn-part-2)
51. [Predict Stock Prices Using RNN: Part 1](#51-predict-stock-prices-using-rnn-part-1)
52. [An Overview of Deep Learning for Curious People](#52-an-overview-of-deep-learning-for-curious-people)

---

## 1. [Harness Engineering for Self-Improvement](https://lilianweng.github.io/posts/2026-07-04-harness/)

发布日期：2026-07-04

The concept of recursive self-improvement (RSI) dates back to I. J. Good (1965), where he defined an “ultraintelligent machine” as a system that can surpass humans in all intellectual activities and design better machines to improve itself. Yudkowsky (2008) used the phrase “recursive self-improvement” for a specific feedback loop: an AI uses its current intelligence to improve the cognitive machinery that produces its intelligence. This feedback loop in modern AI may indicate the model rewriting its own weights directly, or more broadly the model improves the training pipeline and the deployment system, which in turn enables a better successor model with improved performance across economically valuable tasks. The speed of research development in AI has been shown to drastically accelerated in frontier labs (Anthropic; OpenAI).

## 2. [Scaling Laws, Carefully](https://lilianweng.github.io/posts/2026-06-24-scaling-laws/)

发布日期：2026-06-24

Scaling laws are one of the most critical empirical findings in deep learning. The observation is simple in form: the training loss $L$ decreases predictably as we scale up model size $N$, dataset size $D$, and compute $C$, following a power-law curve, which appears as a straight line on a log-log plot. We can view scaling laws as a framework for describing the relationship between compute, loss, model size and data; at its core, it is about how to allocate precious compute optimally between $N$ and $D$.

## 3. [Why We Think](https://lilianweng.github.io/posts/2025-05-01-thinking/)

发布日期：2025-05-01

Special thanks to John Schulman for a lot of super valuable feedback and direct edits on this post. Test time compute (Graves et al. 2016, Ling, et al. 2017, Cobbe et al. 2021) and Chain-of-thought (CoT) (Wei et al. 2022, Nye et al. 2021), have led to significant improvements in model performance, while raising many research questions. This post aims to review recent developments in how to effectively use test-time compute (i.e. “thinking time”) and why it helps.

## 4. [Reward Hacking in Reinforcement Learning](https://lilianweng.github.io/posts/2024-11-28-reward-hacking/)

发布日期：2024-11-28

Reward hacking occurs when a reinforcement learning (RL) agent exploits flaws or ambiguities in the reward function to achieve high rewards, without genuinely learning or completing the intended task. Reward hacking exists because RL environments are often imperfect, and it is fundamentally challenging to accurately specify a reward function. With the rise of language models generalizing to a broad spectrum of tasks and RLHF becomes a de facto method for alignment training, reward hacking in RL training of language models has become a critical practical challenge. Instances where the model learns to modify unit tests to pass coding tasks, or where responses contain biases that mimic a user’s preference, are pretty concerning and are likely one of the major blockers for real-world deployment of more autonomous use cases of AI models.

## 5. [Extrinsic Hallucinations in LLMs](https://lilianweng.github.io/posts/2024-07-07-hallucination/)

发布日期：2024-07-07

Hallucination in large language models usually refers to the model generating unfaithful, fabricated, inconsistent, or nonsensical content. As a term, hallucination has been somewhat generalized to cases when the model makes mistakes. Here, I would like to narrow down the problem of hallucination to cases where the model output is fabricated and not grounded by either the provided context or world knowledge. There are two types of hallucination: In-context hallucination: The model output should be consistent with the source content in context. Extrinsic hallucination: The model output should be grounded by the pre-training dataset. However, given the size of the pre-training dataset, it is too expensive to retrieve and identify conflicts per generation. If we consider the pre-training data corpus as a proxy for world knowledge, we essentially try to ensure the model output is factual and verifiable by external world knowledge. Equally importantly, when the model does not know about a fact, it should say so. This post focuses on extrinsic hallucination. To avoid hallucination, LLMs need to be (1) factual and (2) acknowledge not knowing the answer when applicable.

## 6. [Diffusion Models for Video Generation](https://lilianweng.github.io/posts/2024-04-12-diffusion-video/)

发布日期：2024-04-12

Diffusion models have demonstrated strong results on image synthesis in past years. Now the research community has started working on a harder task—using it for video generation. The task itself is a superset of the image case, since an image is a video of 1 frame, and it is much more challenging because: It has extra requirements on temporal consistency across frames in time, which naturally demands more world knowledge to be encoded into the model. In comparison to text or images, it is more difficult to collect large amounts of high-quality, high-dimensional video data, let along text-video pairs. 🥑 Required Pre-read: Please make sure you have read the previous blog on “What are Diffusion Models?” for image generation before continue here.

## 7. [Thinking about High-Quality Human Data](https://lilianweng.github.io/posts/2024-02-05-human-data-quality/)

发布日期：2024-02-05

[Special thank you to Ian Kivlichan for many useful pointers (E.g. the 100+ year old Nature paper “Vox populi”) and nice feedback. 🙏 ] High-quality data is the fuel for modern data deep learning model training. Most of the task-specific labeled data comes from human annotation, such as classification task or RLHF labeling (which can be constructed as classification format) for LLM alignment training. Lots of ML techniques in the post can help with data quality, but fundamentally human data collection involves attention to details and careful execution. The community knows the value of high quality data, but somehow we have this subtle impression that “Everyone wants to do the model work, not the data work” (Sambasivan et al. 2021).

## 8. [Adversarial Attacks on LLMs](https://lilianweng.github.io/posts/2023-10-25-adv-attack-llm/)

发布日期：2023-10-25

The use of large language models in the real world has strongly accelerated by the launch of ChatGPT. We (including my team at OpenAI, shoutout to them) have invested a lot of effort to build default safe behavior into the model during the alignment process (e.g. via RLHF). However, adversarial attacks or jailbreak prompts could potentially trigger the model to output something undesired. A large body of ground work on adversarial attacks is on images, and differently it operates in the continuous, high-dimensional space. Attacks for discrete data like text have been considered to be a lot more challenging, due to lack of direct gradient signals. My past post on Controllable Text Generation is quite relevant to this topic, as attacking LLMs is essentially to control the model to output a certain type of (unsafe) content.

## 9. [LLM Powered Autonomous Agents](https://lilianweng.github.io/posts/2023-06-23-agent/)

发布日期：2023-06-23

Building agents with LLM (large language model) as its core controller is a cool concept. Several proof-of-concepts demos, such as AutoGPT, GPT-Engineer and BabyAGI, serve as inspiring examples. The potentiality of LLM extends beyond generating well-written copies, stories, essays and programs; it can be framed as a powerful general problem solver. Agent System Overview In a LLM-powered autonomous agent system, LLM functions as the agent’s brain, complemented by several key components: Planning Subgoal and decomposition: The agent breaks down large tasks into smaller, manageable subgoals, enabling efficient handling of complex tasks. Reflection and refinement: The agent can do self-criticism and self-reflection over past actions, learn from mistakes and refine them for future steps, thereby improving the quality of final results. Memory Short-term memory: I would consider all the in-context learning (See Prompt Engineering) as utilizing short-term memory of the model to learn. Long-term memory: This provides the agent with the capability to retain and recall (infinite) information over extended periods, often by leveraging an external vector store and fast retrieval. Tool use The agent learns to call external APIs for extra information that is missing from the model weights (often hard to change after pre-training), including current information, code execution capability, access to proprietary information sources and more. Overview of a LLM-powered autonomous agent system. Component One: Planning A complicated task usually involves many steps. An agent needs to know what they are and plan ahead.

## 10. [Prompt Engineering](https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/)

发布日期：2023-03-15

Prompt Engineering, also known as In-Context Prompting, refers to methods for how to communicate with LLM to steer its behavior for desired outcomes without updating the model weights. It is an empirical science and the effect of prompt engineering methods can vary a lot among models, thus requiring heavy experimentation and heuristics. This post only focuses on prompt engineering for autoregressive language models, so nothing with Cloze tests, image generation or multimodality models. At its core, the goal of prompt engineering is about alignment and model steerability. Check my previous post on controllable text generation.

## 11. [The Transformer Family Version 2.0](https://lilianweng.github.io/posts/2023-01-27-the-transformer-family-v2/)

发布日期：2023-01-27

Many new Transformer architecture improvements have been proposed since my last post on “The Transformer Family” about three years ago. Here I did a big refactoring and enrichment of that 2020 post — restructure the hierarchy of sections and improve many sections with more recent papers. Version 2.0 is a superset of the old version, about twice the length. Notations Symbol Meaning $d$ The model size / hidden state dimension / positional encoding size. $h$ The number of heads in multi-head attention layer. $L$ The segment length of input sequence. $N$ The total number of attention layers in the model; not considering MoE. $\mathbf{X} \in \mathbb{R}^{L \times d}$ The input sequence where each element has been mapped into an embedding vector of shape $d$, same as the model size. $\mathbf{W}^k \in \mathbb{R}^{d \times d_k}$ The key weight matrix. $\mathbf{W}^q \in \mathbb{R}^{d \times d_k}$ The query weight matrix. $\mathbf{W}^v \in \mathbb{R}^{d \times d_v}$ The value weight matrix. Often we have $d_k = d_v = d$. $\mathbf{W}^k_i, \mathbf{W}^q_i \in \mathbb{R}^{d \times d_k/h}; \mathbf{W}^v_i \in \mathbb{R}^{d \times d_v/h}$ The weight matrices per head. $\mathbf{W}^o \in \mathbb{R}^{d_v \times d}$ The output weight matrix. $\mathbf{Q} = \mathbf{X}\mathbf{W}^q \in \mathbb{R}^{L \times d_k}$ The query embedding inputs. $\mathbf{K} = \mathbf{X}\mathbf{W}^k \in \mathbb{R}^{L \times d_k}$ The key embedding inputs. $\mathbf{V} = \mathbf{X}\mathbf{W}^v \in \mathbb{R}^{L \times d_v}$ The value embedding inputs. $\mathbf{q}_i, \mathbf{k}_i \in \mathbb{R}^{d_k}, \mathbf{v}_i \in \mathbb{R}^{d_v}$ Row vectors in query, key, value matrices, $\mathbf{Q}$, $\mathbf{K}$ and $\mathbf{V}$. $S_i$ A collection of key positions for the $i$-th query $\mathbf{q}_i$ to attend to. $\mathbf{A} \in \mathbb{R}^{L \times L}$ The self-attention matrix between a input sequence of lenght $L$ and itself. $\mathbf{A} = \text{softmax}(\mathbf{Q}\mathbf{K}^\top / \sqrt{d_k})$. $a_{ij} \in \mathbf{A}$ The scalar attention score between query $\mathbf{q}_i$ and key $\mathbf{k}_j$. $\mathbf{P} \in \mathbb{R}^{L \times d}$ position encoding matrix, where the $i$-th row $\mathbf{p}_i$ is the positional encoding for input $\mathbf{x}_i$. Transformer Basics The Transformer (which will be referred to as “vanilla Transformer” to distinguish it from other enhanced versions; Vaswani, et al., 2017) model has an encoder-decoder architecture, as commonly used in many NMT models. Later simplified Transformer was shown to achieve great performance in language modeling tasks, like in encoder-only BERT or decoder-only GPT.

## 12. [Large Transformer Model Inference Optimization](https://lilianweng.github.io/posts/2023-01-10-inference-optimization/)

发布日期：2023-01-10

[Updated on 2023-01-24: add a small section on Distillation.] Large transformer models are mainstream nowadays, creating SoTA results for a variety of tasks. They are powerful but very expensive to train and use. The extremely high inference cost, in both time and memory, is a big bottleneck for adopting a powerful transformer for solving real-world tasks at scale. Why is it hard to run inference for large transformer models? Besides the increasing size of SoTA models, there are two main factors contributing to the inference challenge (Pope et al. 2022):

## 13. [Some Math behind Neural Tangent Kernel](https://lilianweng.github.io/posts/2022-09-08-ntk/)

发布日期：2022-09-08

Neural networks are well known to be over-parameterized and can often easily fit data with near-zero training loss with decent generalization performance on test dataset. Although all these parameters are initialized at random, the optimization process can consistently lead to similarly good outcomes. And this is true even when the number of model parameters exceeds the number of training data points. Neural tangent kernel (NTK) (Jacot et al. 2018) is a kernel to explain the evolution of neural networks during training via gradient descent. It leads to great insights into why neural networks with enough width can consistently converge to a global minimum when trained to minimize an empirical loss. In the post, we will do a deep dive into the motivation and definition of NTK, as well as the proof of a deterministic convergence at different initializations of neural networks with infinite width by characterizing NTK in such a setting.

## 14. [Generalized Visual Language Models](https://lilianweng.github.io/posts/2022-06-09-vlm/)

发布日期：2022-06-09

Processing images to generate text, such as image captioning and visual question-answering, has been studied for years. Traditionally such systems rely on an object detection network as a vision encoder to capture visual features and then produce text via a text decoder. Given a large amount of existing literature, in this post, I would like to only focus on one approach for solving vision language tasks, which is to extend pre-trained generalized language models to be capable of consuming visual signals.

## 15. [Learning with not Enough Data Part 3: Data Generation](https://lilianweng.github.io/posts/2022-04-15-data-gen/)

发布日期：2022-04-15

Here comes the Part 3 on learning with not enough data (Previous: Part 1 and Part 2). Let’s consider two approaches for generating synthetic data for training. Augmented data. Given a set of existing training samples, we can apply a variety of augmentation, distortion and transformation to derive new data points without losing the key attributes. We have covered a bunch of augmentation methods on text and images in a previous post on contrastive learning. For the sake of post completeness, I duplicate the section on data augmentation here with some edits. New data. Given few or even no data points, we can rely on powerful pretrained models to generate a number of new data points. This is especially true in recent years given the fast progress in large pretrained language models (LM). Few shot prompting is shown to be effective for LM to learn within context without extra training. Data Augmentation The goal of data augmentation is to modify the input format (e.g. text wording, visual appearance) while the semantic meaning stays unchanged.

## 16. [Learning with not Enough Data Part 2: Active Learning](https://lilianweng.github.io/posts/2022-02-20-active-learning/)

发布日期：2022-02-20

This is part 2 of what to do when facing a limited amount of labeled data for supervised learning tasks. This time we will get some amount of human labeling work involved, but within a budget limit, and therefore we need to be smart when selecting which samples to label.

## 17. [Learning with not Enough Data Part 1: Semi-Supervised Learning](https://lilianweng.github.io/posts/2021-12-05-semi-supervised/)

发布日期：2021-12-05

When facing a limited amount of labeled data for supervised learning tasks, four approaches are commonly discussed.

## 18. [How to Train Really Large Models on Many GPUs?](https://lilianweng.github.io/posts/2021-09-25-train-large/)

发布日期：2021-09-24

[Updated on 2022-03-13: add expert choice routing.] [Updated on 2022-06-10]: Greg and I wrote a shorted and upgraded version of this post, published on OpenAI Blog: “Techniques for Training Large Neural Networks”

## 19. [What are Diffusion Models?](https://lilianweng.github.io/posts/2021-07-11-diffusion-models/)

发布日期：2021-07-11

[Updated on 2021-09-19: Highly recommend this blog post on score-based generative modeling by Yang Song (author of several key papers in the references)]. [Updated on 2022-08-27: Added classifier-free guidance, GLIDE, unCLIP and Imagen. [Updated on 2022-08-31: Added latent diffusion model. [Updated on 2024-04-13: Added progressive distillation, consistency models, and the Model Architecture section.

## 20. [Contrastive Representation Learning](https://lilianweng.github.io/posts/2021-05-31-contrastive/)

发布日期：2021-05-31

The goal of contrastive representation learning is to learn such an embedding space in which similar sample pairs stay close to each other while dissimilar ones are far apart. Contrastive learning can be applied to both supervised and unsupervised settings. When working with unsupervised data, contrastive learning is one of the most powerful approaches in self-supervised learning.

## 21. [Reducing Toxicity in Language Models](https://lilianweng.github.io/posts/2021-03-21-lm-toxicity/)

发布日期：2021-03-21

Large pretrained language models are trained over a sizable collection of online data. They unavoidably acquire certain toxic behavior and biases from the Internet. Pretrained language models are very powerful and have shown great success in many NLP tasks. However, to safely deploy them for practical real-world applications demands a strong safety control over the model generation process.

## 22. [Controllable Neural Text Generation](https://lilianweng.github.io/posts/2021-01-02-controllable-text-generation/)

发布日期：2021-01-02

[Updated on 2021-02-01: Updated to version 2.0 with several work added and many typos fixed.] [Updated on 2021-05-26: Add P-tuning and Prompt Tuning in the “prompt design” section.] [Updated on 2021-09-19: Add “unlikelihood training”.]

## 23. [How to Build an Open-Domain Question Answering System?](https://lilianweng.github.io/posts/2020-10-29-odqa/)

发布日期：2020-10-29

[Updated on 2020-11-12: add an example on closed-book factual QA using OpenAI API (beta). A model that can answer any question with regard to factual knowledge can lead to many useful and practical applications, such as working as a chatbot or an AI assistant🤖. In this post, we will review several common approaches for building such an open-domain question answering system.

## 24. [Neural Architecture Search](https://lilianweng.github.io/posts/2020-08-06-nas/)

发布日期：2020-08-06

Although most popular and successful model architectures are designed by human experts, it doesn’t mean we have explored the entire network architecture space and settled down with the best option. We would have a better chance to find the optimal solution if we adopt a systematic and automatic way of learning high-performance model architectures.

## 25. [Exploration Strategies in Deep Reinforcement Learning](https://lilianweng.github.io/posts/2020-06-07-exploration-drl/)

发布日期：2020-06-07

[Updated on 2020-06-17: Add “exploration via disagreement” in the “Forward Dynamics” section. Exploitation versus exploration is a critical topic in Reinforcement Learning. We’d like the RL agent to find the best solution as fast as possible. However, in the meantime, committing to solutions too quickly without enough exploration sounds pretty bad, as it could lead to local minima or total failure. Modern RL algorithms that optimize for the best returns can achieve good exploitation quite efficiently, while exploration remains more like an open topic.

## 26. [The Transformer Family](https://lilianweng.github.io/posts/2020-04-07-the-transformer-family/)

发布日期：2020-04-07

[Updated on 2023-01-27: After almost three years, I did a big refactoring update of this post to incorporate a bunch of new Transformer models since 2020. The enhanced version of this post is here: The Transformer Family Version 2.0. Please refer to that post on this topic.]

## 27. [Curriculum for Reinforcement Learning](https://lilianweng.github.io/posts/2020-01-29-curriculum-rl/)

发布日期：2020-01-29

[Updated on 2020-02-03: mentioning PCG in the “Task-Specific Curriculum” section. [Updated on 2020-02-04: Add a new “curriculum through distillation” section.

## 28. [Self-Supervised Representation Learning](https://lilianweng.github.io/posts/2019-11-10-self-supervised/)

发布日期：2019-11-10

[Updated on 2020-01-09: add a new section on Contrastive Predictive Coding]. [Updated on 2020-04-13: add a “Momentum Contrast” section on MoCo, SimCLR and CURL.] [Updated on 2020-07-08: add a “Bisimulation” section on DeepMDP and DBC.] [Updated on 2020-09-12: add MoCo V2 and BYOL in the “Momentum Contrast” section.] [Updated on 2021-05-31: remove section on “Momentum Contrast” and add a pointer to a full post on “Contrastive Representation Learning”]

## 29. [Evolution Strategies](https://lilianweng.github.io/posts/2019-09-05-evolution-strategies/)

发布日期：2019-09-05

Stochastic gradient descent is a universal choice for optimizing deep learning models. However, it is not the only option. With black-box optimization algorithms, you can evaluate a target function $f(x): \mathbb{R}^n \to \mathbb{R}$, even when you don’t know the precise analytic form of $f(x)$ and thus cannot compute gradients or the Hessian matrix. Examples of black-box optimization methods include Simulated Annealing, Hill Climbing and Nelder-Mead method.

## 30. [Meta Reinforcement Learning](https://lilianweng.github.io/posts/2019-06-23-meta-rl/)

发布日期：2019-06-23

In my earlier post on meta-learning, the problem is mainly defined in the context of few-shot classification. Here I would like to explore more into cases when we try to “meta-learn” Reinforcement Learning (RL) tasks by developing an agent that can solve unseen tasks fast and efficiently.

## 31. [Domain Randomization for Sim2Real Transfer](https://lilianweng.github.io/posts/2019-05-05-domain-randomization/)

发布日期：2019-05-05

In Robotics, one of the hardest problems is how to make your model transfer to the real world. Due to the sample inefficiency of deep RL algorithms and the cost of data collection on real robots, we often need to train models in a simulator which theoretically provides an infinite amount of data. However, the reality gap between the simulator and the physical world often leads to failure when working with physical robots. The gap is triggered by an inconsistency between physical parameters (i.e. friction, kp, damping, mass, density) and, more fatally, the incorrect physical modeling (i.e. collision between soft surfaces).

## 32. [Are Deep Neural Networks Dramatically Overfitted?](https://lilianweng.github.io/posts/2019-03-14-overfit/)

发布日期：2019-03-14

[Updated on 2019-05-27: add the section on Lottery Ticket Hypothesis.] If you are like me, entering into the field of deep learning with experience in traditional machine learning, you may often ponder over this question: Since a typical deep neural network has so many parameters and training error can easily be perfect, it should surely suffer from substantial overfitting. How could it be ever generalized to out-of-sample data points?

## 33. [Generalized Language Models](https://lilianweng.github.io/posts/2019-01-31-lm/)

发布日期：2019-01-31

[Updated on 2019-02-14: add ULMFiT and GPT-2.] [Updated on 2020-02-29: add ALBERT.] [Updated on 2020-10-25: add RoBERTa.] [Updated on 2020-12-13: add T5.] [Updated on 2020-12-30: add GPT-3.] [Updated on 2021-11-13: add XLNet, BART and ELECTRA; Also updated the Summary section.] I guess they are Elmo & Bert? (Image source: here) We have seen amazing progress in NLP in 2018. Large-scale pre-trained language modes like OpenAI GPT and BERT have achieved great performance on a variety of language tasks using generic model architectures. The idea is similar to how ImageNet classification pre-training helps many vision tasks (*). Even better than vision classification pre-training, this simple and powerful approach in NLP does not require labeled data for pre-training, allowing us to experiment with increased training scale, up to our very limit.

## 34. [Object Detection Part 4: Fast Detection Models](https://lilianweng.github.io/posts/2018-12-27-object-recognition-part-4/)

发布日期：2018-12-27

In Part 3, we have reviewed models in the R-CNN family. All of them are region-based object detection algorithms. They can achieve high accuracy but could be too slow for certain applications such as autonomous driving. In Part 4, we only focus on fast object detection models, including SSD, RetinaNet, and models in the YOLO family.

## 35. [Meta-Learning: Learning to Learn Fast](https://lilianweng.github.io/posts/2018-11-30-meta-learning/)

发布日期：2018-11-30

[Updated on 2019-10-01: thanks to Tianhao, we have this post translated in Chinese!]

## 36. [Flow-based Deep Generative Models](https://lilianweng.github.io/posts/2018-10-13-flow-models/)

发布日期：2018-10-13

So far, I’ve written about two types of generative models, GAN and VAE. Neither of them explicitly learns the probability density function of real data, $p(\mathbf{x})$ (where $\mathbf{x} \in \mathcal{D}$) — because it is really hard! Taking the generative model with latent variables as an example, $p(\mathbf{x}) = \int p(\mathbf{x}\vert\mathbf{z})p(\mathbf{z})d\mathbf{z}$ can hardly be calculated as it is intractable to go through all possible values of the latent code $\mathbf{z}$.

## 37. [From Autoencoder to Beta-VAE](https://lilianweng.github.io/posts/2018-08-12-vae/)

发布日期：2018-08-12

[Updated on 2019-07-18: add a section on VQ-VAE & VQ-VAE-2.] [Updated on 2019-07-26: add a section on TD-VAE.] Autocoder is invented to reconstruct high-dimensional data using a neural network model with a narrow bottleneck layer in the middle (oops, this is probably not true for Variational Autoencoder, and we will investigate it in details in later sections). A nice byproduct is dimension reduction: the bottleneck layer captures a compressed latent encoding. Such a low-dimensional representation can be used as en embedding vector in various applications (i.e. search), help data compression, or reveal the underlying data generative factors.

## 38. [Attention? Attention!](https://lilianweng.github.io/posts/2018-06-24-attention/)

发布日期：2018-06-24

[Updated on 2018-10-28: Add Pointer Network and the link to my implementation of Transformer.] [Updated on 2018-11-06: Add a link to the implementation of Transformer model.] [Updated on 2018-11-18: Add Neural Turing Machines.] [Updated on 2019-07-18: Correct the mistake on using the term “self-attention” when introducing the show-attention-tell paper; moved it to Self-Attention section.] [Updated on 2020-04-07: A follow-up post on improved Transformer models is here.]

## 39. [Implementing Deep Reinforcement Learning Models with Tensorflow + OpenAI Gym](https://lilianweng.github.io/posts/2018-05-05-drl-implementation/)

发布日期：2018-05-05

The full implementation is available in lilianweng/deep-reinforcement-learning-gym In the previous two posts, I have introduced the algorithms of many deep reinforcement learning models. Now it is the time to get our hands dirty and practice how to implement the models in the wild. The implementation is gonna be built in Tensorflow and OpenAI gym environment. The full version of the code in this tutorial is available in [lilian/deep-reinforcement-learning-gym].

## 40. [Policy Gradient Algorithms](https://lilianweng.github.io/posts/2018-04-08-policy-gradient/)

发布日期：2018-04-08

[Updated on 2018-06-30: add two new policy gradient methods, SAC and D4PG.] [Updated on 2018-09-30: add a new policy gradient method, TD3.] [Updated on 2019-02-09: add SAC with automatically adjusted temperature]. [Updated on 2019-06-26: Thanks to Chanseok, we have a version of this post in Korean]. [Updated on 2019-09-12: add a new policy gradient method SVPG.] [Updated on 2019-12-22: add a new policy gradient method IMPALA.] [Updated on 2020-10-15: add a new policy gradient method PPG & some new discussion in PPO.] [Updated on 2021-09-19: Thanks to Wenhao & 爱吃猫的鱼, we have this post in Chinese1 & Chinese2].

## 41. [A (Long) Peek into Reinforcement Learning](https://lilianweng.github.io/posts/2018-02-19-rl-overview/)

发布日期：2018-02-19

[Updated on 2020-09-03: Updated the algorithm of SARSA and Q-learning so that the difference is more pronounced. [Updated on 2021-09-19: Thanks to 爱吃猫的鱼, we have this post in Chinese].

## 42. [The Multi-Armed Bandit Problem and Its Solutions](https://lilianweng.github.io/posts/2018-01-23-multi-armed-bandit/)

发布日期：2018-01-23

The algorithms are implemented for Bernoulli bandit in lilianweng/multi-armed-bandit. Exploitation vs Exploration The exploration vs exploitation dilemma exists in many aspects of our life. Say, your favorite restaurant is right around the corner. If you go there every day, you would be confident of what you will get, but miss the chances of discovering an even better option. If you try new places all the time, very likely you are gonna have to eat unpleasant food from time to time. Similarly, online advisors try to balance between the known most attractive ads and the new ads that might be even more successful.

## 43. [Object Detection for Dummies Part 3: R-CNN Family](https://lilianweng.github.io/posts/2017-12-31-object-recognition-part-3/)

发布日期：2017-12-31

[Updated on 2018-12-20: Remove YOLO here. Part 4 will cover multiple fast object detection algorithms, including YOLO.] [Updated on 2018-12-27: Add bbox regression and tricks sections for R-CNN.] In the series of “Object Detection for Dummies”, we started with basic concepts in image processing, such as gradient vectors and HOG, in Part 1. Then we introduced classic convolutional neural network architecture designs for classification and pioneer models for object recognition, Overfeat and DPM, in Part 2. In the third post of this series, we are about to review a set of models in the R-CNN (“Region-based CNN”) family.

## 44. [Object Detection for Dummies Part 2: CNN, DPM and Overfeat](https://lilianweng.github.io/posts/2017-12-15-object-recognition-part-2/)

发布日期：2017-12-15

Part 1 of the “Object Detection for Dummies” series introduced: (1) the concept of image gradient vector and how HOG algorithm summarizes the information across all the gradient vectors in one image; (2) how the image segmentation algorithm works to detect regions that potentially contain objects; (3) how the Selective Search algorithm refines the outcomes of image segmentation for better region proposal.

## 45. [Object Detection for Dummies Part 1: Gradient Vector, HOG, and SS](https://lilianweng.github.io/posts/2017-10-29-object-recognition-part-1/)

发布日期：2017-10-29

I’ve never worked in the field of computer vision and has no idea how the magic could work when an autonomous car is configured to tell apart a stop sign from a pedestrian in a red hat. To motivate myself to look into the maths behind object recognition and detection algorithms, I’m writing a few posts on this topic “Object Detection for Dummies”. This post, part 1, starts with super rudimentary concepts in image processing and a few methods for image segmentation. Nothing related to deep neural networks yet. Deep learning models for object detection and recognition will be discussed in Part 2 and Part 3.

## 46. [Learning Word Embedding](https://lilianweng.github.io/posts/2017-10-15-word-embedding/)

发布日期：2017-10-15

Human vocabulary comes in free text. In order to make a machine learning model understand and process the natural language, we need to transform the free-text words into numeric values. One of the simplest transformation approaches is to do a one-hot encoding in which each distinct word stands for one dimension of the resulting vector and a binary value indicates whether the word presents (1) or not (0).

## 47. [Anatomize Deep Learning with Information Theory](https://lilianweng.github.io/posts/2017-09-28-information-bottleneck/)

发布日期：2017-09-28

Professor Naftali Tishby passed away in 2021. Hope the post can introduce his cool idea of information bottleneck to more people. Recently I watched the talk “Information Theory in Deep Learning” by Prof Naftali Tishby and found it very interesting. He presented how to apply the information theory to study the growth and transformation of deep neural networks during training. Using the Information Bottleneck (IB) method, he proposed a new learning bound for deep neural networks (DNN), as the traditional learning theory fails due to the exponentially large number of parameters. Another keen observation is that DNN training involves two distinct phases: First, the network is trained to fully represent the input data and minimize the generalization error; then, it learns to forget the irrelevant details by compressing the representation of the input.

## 48. [From GAN to WGAN](https://lilianweng.github.io/posts/2017-08-20-gan/)

发布日期：2017-08-20

[Updated on 2018-09-30: thanks to Yoonju, we have this post translated in Korean!] [Updated on 2019-04-18: this post is also available on arXiv.] Generative adversarial network (GAN) has shown great results in many generative tasks to replicate the real-world rich content such as images, human language, and music. It is inspired by game theory: two models, a generator and a critic, are competing with each other while making each other stronger at the same time. However, it is rather challenging to train a GAN model, as people are facing issues like training instability or failure to converge.

## 49. [How to Explain the Prediction of a Machine Learning Model?](https://lilianweng.github.io/posts/2017-08-01-interpretation/)

发布日期：2017-08-01

The machine learning models have started penetrating into critical areas like health care, justice systems, and financial industry. Thus to figure out how the models make the decisions and make sure the decisioning process is aligned with the ethnic requirements or legal regulations becomes a necessity.

## 50. [Predict Stock Prices Using RNN: Part 2](https://lilianweng.github.io/posts/2017-07-22-stock-rnn-part-2/)

发布日期：2017-07-22

In the Part 2 tutorial, I would like to continue the topic on stock price prediction and to endow the recurrent neural network that I have built in Part 1 with the capability of responding to multiple stocks. In order to distinguish the patterns associated with different price sequences, I use the stock symbol embedding vectors as part of the input.

## 51. [Predict Stock Prices Using RNN: Part 1](https://lilianweng.github.io/posts/2017-07-08-stock-rnn-part-1/)

发布日期：2017-07-08

This is a tutorial for how to build a recurrent neural network using Tensorflow to predict stock market prices. The full working code is available in github.com/lilianweng/stock-rnn. If you don’t know what is recurrent neural network or LSTM cell, feel free to check my previous post.

## 52. [An Overview of Deep Learning for Curious People](https://lilianweng.github.io/posts/2017-06-21-overview/)

发布日期：2017-06-21

(The post was originated from my talk for WiMLDS x Fintech meetup hosted by Affirm.) I believe many of you have watched or heard of the games between AlphaGo and professional Go player Lee Sedol in 2016. Lee has the highest rank of nine dan and many world championships. No doubt, he is one of the best Go players in the world, but he lost by 1-4 in this series versus AlphaGo. Before this, Go was considered to be an intractable game for computers to master, as its simple rules lay out an exponential number of variations in the board positions, many more than what in Chess. This event surely highlighted 2016 as a big year for AI. Because of AlphaGo, much attention has been attracted to the progress of AI.

