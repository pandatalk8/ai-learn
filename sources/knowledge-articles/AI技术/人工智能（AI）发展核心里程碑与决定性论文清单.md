### 第一层：基石时代 (The Bedrock) - 1950s ~ 1980s



*这一层是AI的理论起源，主要基于逻辑符号和简单的神经元模拟。*

1. **图灵测试 (1950)**
   - **论文:** *Computing Machinery and Intelligence* (Alan Turing)
   - **意义:** 提出了“机器能思考吗？”的终极问题，确立了AI的哲学目标。
2. **感知机 (1958)**
   - **论文:** *The Perceptron: A Probabilistic Model for Information Storage and Organization in the Brain* (Frank Rosenblatt)
   - **意义:** 第一个神经网络模型。虽然它很快被证明无法解决异或（XOR）问题（导致了第一次AI寒冬），但它是现代深度学习的“单细胞祖先”。
3. **反向传播算法 (1986)**
   - **论文:** *Learning representations by back-propagating errors* (Rumelhart, Hinton, Williams)
   - **关键突破:** 找到了训练多层神经网络的方法。这是今天所有深度学习模型（包括GPT）能够“学习”的数学核心。

------



### 第二层：卷积与统计学习的复兴 (The Renaissance) - 1990s ~ 2012



*这一层见证了神经网络在视觉领域的突破，以及从“规则驱动”向“数据驱动”的转变。*

1. **LeNet-5 (1998)**
   - **论文:** *Gradient-based learning applied to document recognition* (Yann LeCun et al.)
   - **关键突破:** **卷积神经网络 (CNN)** 的奠基之作。它成功识别了手写数字（MNIST），证明了神经网络可以处理图像数据。
2. **ImageNet 与 AlexNet (2012) —— \**大爆炸时刻\****
   - **论文:** *ImageNet Classification with Deep Convolutional Neural Networks* (Alex Krizhevsky, Sutskever, Hinton)
   - **意义:** 深度学习的**“奇点”**。AlexNet 在 ImageNet 竞赛中以压倒性优势夺冠，证明了“大数据 + GPU + 深层网络”的可行性，正式开启了深度学习时代。

------



### 第三层：深度学习的黄金时代 (The Deep Learning Boom) - 2013 ~ 2016



*这一层模型开始理解语义、生成图像，并在游戏中战胜人类。*

1. **Word2Vec (2013)**
   - **论文:** *Efficient Estimation of Word Representations in Vector Space* (Tomas Mikolov / Google)
   - **关键突破:** 让计算机理解词语之间的关系（如：国王 - 男人 + 女人 = 女王）。这是自然语言处理（NLP）现代化的开端。
2. **GANs (2014)**
   - **论文:** *Generative Adversarial Nets* (Ian Goodfellow)
   - **意义:** **生成对抗网络**。让AI学会了“创造”图片，是后来AI绘画（Midjourney等）的远祖。
3. **ResNet (2015)**
   - **论文:** *Deep Residual Learning for Image Recognition* (Kaiming He/何恺明 et al.)
   - **关键突破:** 解决了极深网络（上百层）无法训练的问题。如今几乎所有的视觉大模型都在使用这种残差结构。
4. **AlphaGo (2016)**
   - **论文:** *Mastering the game of Go with deep neural networks and tree search* (DeepMind)
   - **意义:** 深度强化学习（RL）的巅峰，证明了AI在复杂策略空间中可以超越人类直觉。

------



### 第四层：Transformer 与 大语言模型时代 (The LLM Era) - 2017 ~ 至今



*这是我们目前所处的地质层，统治力量是 Transformer 架构。*

1. **Transformer (2017) —— 圣经级论文**
   - **论文:** **Attention Is All You Need** (Vaswani et al. / Google)
   - **核心:** 抛弃了循环神经网络（RNN），提出了**自注意力机制 (Self-Attention)**。这是当今所有大模型（GPT, Claude, Llama）的物理底座。没有这篇论文，就没有今天的生成式AI。
2. **BERT (2018)**
   - **论文:** *BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding* (Google)
   - **意义:** 确立了 **“预训练 + 微调” (Pre-train + Fine-tune)** 的范式。它让模型先通读海量文字，再学习特定任务。
3. **GPT-3 (2020)**
   - **论文:** *Language Models are Few-Shot Learners* (OpenAI)
   - **关键发现:** **Scaling Laws (缩放定律)**。证明了只要模型足够大、数据足够多，模型就会涌现出意想不到的智能（Emergent Abilities），而不需要针对特定任务进行微调。
4. **InstructGPT / RLHF (2022)**
   - **论文:** *Training language models to follow instructions with human feedback* (OpenAI)
   - **意义:** ChatGPT 的前身。引入了 **人类反馈强化学习 (RLHF)**，解决了大模型“胡言乱语”的问题，让模型学会听懂人话、符合人类价值观。
5. **Llama (2023)**
   - **论文:** *LLaMA: Open and Efficient Foundation Language Models* (Meta)
   - **意义:** 开启了高性能**开源大模型**的时代，打破了OpenAI和Google的垄断，让个人开发者也能在本地运行大模型。

