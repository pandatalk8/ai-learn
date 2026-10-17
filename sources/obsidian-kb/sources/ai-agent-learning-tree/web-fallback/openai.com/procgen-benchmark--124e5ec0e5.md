Title: Procgen Benchmark

URL Source: http://openai.com/blog/procgen-benchmark/

Markdown Content:
[Skip to main content](http://openai.com/blog/procgen-benchmark/#main)

[](http://openai.com/)

*   [Research](http://openai.com/research/index/)
*   Products
*   [Business](http://openai.com/business/)
*   [Developers](http://openai.com/api/)
*   [Company](http://openai.com/about/)
*   [Foundation(opens in a new window)](https://openaifoundation.org/)

Log in[Try ChatGPT(opens in a new window)](https://chatgpt.com/?openaicom-did=d8d5bbbf-848b-44d7-a144-a60e260b7471&openaicom_referred=true)

*   Research
*   Products
*   Business
*   Developers
*   Company
*   [Foundation(opens in a new window)](https://openaifoundation.org/)

Procgen Benchmark | OpenAI

December 3, 2019

[Release](http://openai.com/research/index/release/)

# Procgen Benchmark

We’re releasing Procgen Benchmark, 16 simple-to-use procedurally-generated environments which provide a direct measure of how quickly a reinforcement learning agent learns generalizable skills.

[Read paper(opens in a new window)](https://arxiv.org/abs/1912.01588)[Environment code(opens in a new window)](https://github.com/openai/procgen)[Training code(opens in a new window)](https://github.com/openai/train-procgen)

![Image 1: A colorful collage of square-dimension 2D maze game interfaces](https://images.ctfassets.net/kftzwdyauwt9/0b00f831-a5c2-4bd1-1da6d37b3148/841a88ed09a094b614f89b6384017101/image_132.png?w=3840&q=90&fm=webp)

Listen to article 6:41

[Audio 2](http://openai.com/blog/procgen-benchmark/)

Share

Getting started

*   [Getting started](http://openai.com/blog/procgen-benchmark/#getting-started)
*   [Environment diversity is key](http://openai.com/blog/procgen-benchmark/#environment-diversity-is-key)
*   [Procgen Benchmark](http://openai.com/blog/procgen-benchmark/#procgen-benchmark)
*   [Design principles](http://openai.com/blog/procgen-benchmark/#design-principles)
*   [Evaluating generalization](http://openai.com/blog/procgen-benchmark/#evaluating-generalization)
*   [An ablation with deterministic levels](http://openai.com/blog/procgen-benchmark/#an-ablation-with-deterministic-levels)
*   [Next steps](http://openai.com/blog/procgen-benchmark/#next-steps)

*   [Getting started](http://openai.com/blog/procgen-benchmark/#getting-started)
*   [Environment diversity is key](http://openai.com/blog/procgen-benchmark/#environment-diversity-is-key)
*   [Procgen Benchmark](http://openai.com/blog/procgen-benchmark/#procgen-benchmark)
*   [Design principles](http://openai.com/blog/procgen-benchmark/#design-principles)
*   [Evaluating generalization](http://openai.com/blog/procgen-benchmark/#evaluating-generalization)
*   [An ablation with deterministic levels](http://openai.com/blog/procgen-benchmark/#an-ablation-with-deterministic-levels)
*   [Next steps](http://openai.com/blog/procgen-benchmark/#next-steps)

[Video 3](https://videos.ctfassets.net/kftzwdyauwt9/2o1t8h0LQeXq1OpwnedGKQ/4f3a0342845dc96358faafe690301696/env_coinrun.mp4)

00:00

## Getting started

#### Bash

`1$ pip install procgen # install2$ python -m procgen.interactive --env-name starpilot # human3$ python &lt;&lt;EOF # random AI agent4import gym5env = gym.make('procgen:procgen-coinrun-v0')6obs = env.reset()7while True:8    obs, rew, done, info = env.step(env.action_space.sample())9    env.render()10    if done:11        break12EOF`

Using the environment is easy whether you’re a human or AI:

We’ve found that all of the Procgen environments require training on 500–1000 different levels before they can generalize to new levels, which suggests that standard RL benchmarks need much more diversity within each environment. Procgen Benchmark has become the standard research platform used by the OpenAI RL team, and we hope that it accelerates the community in creating better RL algorithms.

## Environment diversity is key

[In⁠(opens in a new window)](https://arxiv.org/abs/1804.06893)[several⁠](http://openai.com/index/quantifying-generalization-in-reinforcement-learning/)[environments⁠(opens in a new window)](https://arxiv.org/abs/1806.10729), it has been observed that agents can overfit to remarkably large training sets. This evidence raises the possibility that overfitting pervades classic benchmarks like the[Arcade Learning Environment⁠(opens in a new window)](https://arxiv.org/abs/1207.4708), which has long served as a gold standard in reinforcement learning (RL). While the diversity between different games in the ALE is one of the benchmark’s greatest strengths, the low emphasis on generalization presents a significant drawback. In each game the question must be asked: are agents robustly learning a relevant skill, or are they approximately memorizing specific trajectories?

[CoinRun⁠](http://openai.com/index/quantifying-generalization-in-reinforcement-learning/)was designed to address precisely this issue, by using procedural generation to construct distinct sets of training levels and test levels. While CoinRun has helped us better quantify generalization in RL, it is still only a single environment. It’s likely that CoinRun is not fully representative of the many challenges RL agents must face. We want the best of both worlds: a benchmark comprised of many diverse environments, each of which fundamentally requires generalization. To fulfill this need, we have created Procgen Benchmark. CoinRun now serves as the inaugural environment in Procgen Benchmark, contributing its diversity to a greater whole.

Previous work, including the[Obstacle Tower Challenge⁠(opens in a new window)](https://arxiv.org/abs/1902.01378)and the[General Video Game AI framework⁠(opens in a new window)](https://arxiv.org/abs/1802.10363), has also encouraged using procedural generation to better evaluate generalization in RL. We’ve designed environments in a similar spirit, with two Procgen environments drawing direct inspiration from[GVGAI-based work⁠(opens in a new window)](https://arxiv.org/abs/1806.10729). Other environments like Dota and StarCraft also provide lots of per-environment complexity, but these environments are hard to rapidly iterate with (and it’s even harder to use more than one such environment at a time). With Procgen Benchmark, we strive for all of the following: experimental convenience, high diversity within environments, and high diversity across environments.

## Procgen Benchmark

Procgen Benchmark consists of 16 unique environments designed to measure both sample efficiency and generalization in reinforcement learning. This benchmark is ideal for evaluating generalization since distinct training and test sets can be generated in each environment. This benchmark is also well-suited to evaluate sample efficiency, since all environments pose diverse and compelling challenges for RL agents. The environments’ intrinsic diversity demands that agents learn robust policies; overfitting to narrow regions in state space will not suffice. Put differently, the ability to generalize becomes an integral component of success when agents are faced with ever-changing levels.

## Design principles

We’ve designed all Procgen environments to satisfy the following criteria:

*   **High Diversity**: Environment generation logic is given maximal freedom, subject to basic design constraints. The diversity in the resulting level distributions presents agents with meaningful generalization challenges.
*   **Fast Evaluation**: Environment difficulty is calibrated such that baseline agents make significant progress after training for 200M timesteps. Moreover, the environments are optimized to perform thousands of steps per second on a single CPU core, enabling a fast experimental pipeline.
*   **Tunable Difficulty**: All environments support two well-calibrated difficulty settings: easy and hard. While we report results using the hard difficulty setting, we make the easy difficulty setting available for those with limited access to compute power. Easy environments require approximately an eighth of the resources to train.
*   **Emphasis on Visual Recognition and Motor Control**: In keeping with precedent, environments mimic the style of many Atari and Gym Retro games. Performing well primarily depends on identifying key assets in the observation space and enacting appropriate low level motor responses.

[Video 4](https://videos.ctfassets.net/kftzwdyauwt9/5qejyuRPiCfP082KmeiXBI/52e72e98783db5fad49499c384154cb7/env_starpilot__1_.mp4)

00:00

## Evaluating generalization

We came to appreciate how hard RL generalization can be while conducting the[Retro Contest⁠](http://openai.com/index/first-retro-contest-retrospective/), as agents continually failed to generalize from the limited data in the training set. Later, our CoinRun experiments painted an even clearer picture of our agents’ struggle to generalize. We’ve now expanded on those results, conducting our most thorough study of RL generalization to date using all 16 environments in Procgen Benchmark.

We first measured how the size of the training set impacts generalization. In each environment, we generated training sets ranging in size from 100 to 100,000 levels. We trained agents for 200M timesteps on these levels using[Proximal Policy Optimization⁠](http://openai.com/index/openai-baselines-ppo/), and we measured performance on unseen test levels.

Generalization performance
Score over 100k levels, log scale

Train

Test

CoinRun

StarPilot

CaveFlyer

Dodgeball

Fruitbot

Chaser

Miner

Jumper

Leaper

Maze

BigFish

Heist

Climber

Plunder

Ninja

BossFight

We found that agents strongly overfit to small training sets in almost all environments. In some cases, agents need access to as many as 10,000 levels to close the generalization gap. We also saw a peculiar trend emerge in many environments: past a certain threshold, training performance improves as the training sets grows! This runs counter to trends found in supervised learning, where training performance commonly decreases with the size of the training set. We believe this increase in training performance comes from an implicit curriculum provided by a diverse set of levels. A larger training set can improve training performance if the agent learns to generalize _even across levels in the training set_. We previously noticed this effect with CoinRun, and have found it often occurs in many Procgen environments as well.

## An ablation with deterministic levels

Train and test performance
Score over 200M timesteps

Train

Test

CoinRun

StarPilot

CaveFlyer

Dodgeball

Fruitbot

Chaser

Miner

Jumper

Leaper

Maze

BigFish

Heist

Climber

Plunder

Ninja

BossFight

At test time, we remove the determinism in the sequence of levels, instead choosing level sequences at random. We find that agents become competent over the first several training levels in most games, giving an illusion of meaningful progress. However, test performance demonstrates that the agents have in fact learned almost nothing about the underlying level distribution. We believe this vast gap between training and test performance is worth highlighting. It reveals a crucial hidden flaw in training on environments that follow a fixed sequence of levels. These results show just how essential it is to use diverse environment distributions when training and evaluating RL agents.

## Next steps

We expect many insights gleaned from this benchmark to apply in more complex settings, and we’re excited to use these new environments to design more capable and efficient agents.

_If you’re interested in helping develop diverse environments,_[_we’re hiring_⁠](http://openai.com/careers/)_!_

*   [Exploration & Games](http://openai.com/research/index/?tags=exploration-game)
*   [Learning Paradigms](http://openai.com/research/index/?tags=learning-paradigms)
*   [Simulated Environments](http://openai.com/research/index/?tags=simulated-environments)
*   [Software & Engineering](http://openai.com/research/index/?tags=software-engineering)

## Authors

Karl Cobbe, Christopher Hesse, Jacob Hilton, John Schulman

## Acknowledgments

Thanks to Marc Bellemare, Julian Togelius, Carles Gelada, Jacob Jackson, Alex Ray, Lilian Weng, and Joshua Achiam for their feedback on the paper.

Thanks to Mira Murati, Brooke Chan, Justin Jay Wang, Greg Brockman, Ashley Pilipiszyn and Jack Clark for their work supporting, designing, writing, and providing feedback on this post.

Special thanks to[Kenney⁠(opens in a new window)](https://www.kenney.nl/)for the many high quality game assets used throughout these environments.

Additional thanks to Oleg Domrachev and Anton Tyshchenko ([CraftPix.net⁠(opens in a new window)](https://craftpix.net/))for several game backgrounds, as well as to[GameArtGuppy⁠(opens in a new window)](https://www.gameartguppy.com/), and[ansimuz⁠(opens in a new window)](https://ansimuz.itch.io/). All asset licenses can be found[here⁠(opens in a new window)](https://github.com/openai/procgen/blob/master/ASSET_LICENSES.md).

## Related articles

[View all](http://openai.com/news/)

![Image 2: Scaling Laws For Reward Model Overoptimization](https://images.ctfassets.net/kftzwdyauwt9/a8801fe6-8892-472b-f746d1d9fb2d/547c46ed9a8a71e89efbb7a7963a8932/image-6.webp?w=3840&q=90&fm=webp)

[Scaling laws for reward model overoptimization Publication Oct 19, 2022](http://openai.com/index/scaling-laws-for-reward-model-overoptimization/)

![Image 3: Screenshot of a scene from Minecraft](https://images.ctfassets.net/kftzwdyauwt9/ef9fc360-1a5a-4ca3-5c25b83b3564/50c07940455cc86ef84d91526d9cf3e0/vpt.jpg?w=3840&q=90&fm=webp)

[Learning to play Minecraft with Video PreTraining Conclusion Jun 23, 2022](http://openai.com/index/vpt/)

![Image 4: Group of people posing behind a panel](https://images.ctfassets.net/kftzwdyauwt9/e7b99f23-347e-4bc9-9e110180fdae/7ae5d14a2436edfbb925876fccae36ca/dota-2-with-large-scale-deep-reinforcement-learning.jpg?w=3840&q=90&fm=webp)

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
*   [ChatGPT(opens in a new window)](https://chatgpt.com/?openaicom-did=d8d5bbbf-848b-44d7-a144-a60e260b7471&openaicom_referred=true)
*   [ChatGPT Business(opens in a new window)](https://chatgpt.com/business/?openaicom-did=d8d5bbbf-848b-44d7-a144-a60e260b7471&openaicom_referred=true)
*   [ChatGPT Enterprise(opens in a new window)](https://chatgpt.com/business/enterprise/?openaicom-did=d8d5bbbf-848b-44d7-a144-a60e260b7471&openaicom_referred=true)
*   [ChatGPT for Education(opens in a new window)](https://chatgpt.com/business/education/?openaicom-did=d8d5bbbf-848b-44d7-a144-a60e260b7471&openaicom_referred=true)
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
*   [RSS](http://openai.com/news/rss.xml)

Terms & Policies
*   [Terms of Use](http://openai.com/policies/terms-of-use/)
*   [Privacy Policy](http://openai.com/policies/privacy-policy/)
*   [Other Policies](http://openai.com/policies/)

[(opens in a new window)](https://x.com/OpenAI)[(opens in a new window)](https://www.youtube.com/OpenAI)[(opens in a new window)](https://www.linkedin.com/company/openai)[(opens in a new window)](https://github.com/openai)[(opens in a new window)](https://www.instagram.com/openai/)[(opens in a new window)](https://www.tiktok.com/@openai)[(opens in a new window)](https://discord.gg/openai)

OpenAI © 2015–2026 Your privacy choices

English United States
