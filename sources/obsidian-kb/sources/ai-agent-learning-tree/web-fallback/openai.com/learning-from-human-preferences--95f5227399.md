Title: Learning from human preferences

URL Source: http://openai.com/index/learning-from-human-preferences/

Markdown Content:
[Skip to main content](http://openai.com/index/learning-from-human-preferences/#main)

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

June 13, 2017

[Release](http://openai.com/research/index/release/)

# Learning from human preferences

[Read paper(opens in a new window)](https://arxiv.org/abs/1706.03741)

![Image 1: Learning From Human Preferences](https://images.ctfassets.net/kftzwdyauwt9/745ba770-7a51-45b1-2dbb2416a1d1/8949061be0f45f0eda1ce3b8acc2a081/image-96.webp?w=3840&q=90&fm=webp)

Loading…

[Audio 2](http://openai.com/index/learning-from-human-preferences/)

Share

Challenges

*   [Challenges](http://openai.com/index/learning-from-human-preferences/#challenges)
*   [Footnote](http://openai.com/index/learning-from-human-preferences/#footnote)

*   [Challenges](http://openai.com/index/learning-from-human-preferences/#challenges)
*   [Footnote](http://openai.com/index/learning-from-human-preferences/#footnote)

One step towards building safe AI systems is to remove the need for humans to write goal functions, since using a simple proxy for a complex goal, or getting the complex goal a bit wrong, can lead to undesirable and even dangerous behavior. In collaboration with DeepMind’s safety team, we’ve developed an algorithm which can infer what humans want by being told which of two proposed behaviors is better.

We present a learning algorithm that uses small amounts of human feedback to solve modern RL environments. Machine learning systems with human feedback[have⁠(opens in a new window)](https://papers.nips.cc/paper/4805-a-bayesian-approach-for-policy-learning-from-trajectory-preference-queries)[been⁠(opens in a new window)](https://link.springer.com/chapter/10.1007/978-3-319-02675-6_46)[explored⁠(opens in a new window)](https://arxiv.org/abs/1208.0984)[before⁠(opens in a new window)](https://hal.inria.fr/hal-00980839), but we’ve scaled up the approach to be able to work on much more complicated tasks. Our algorithm needed 900 bits of feedback from a human evaluator to learn to backflip—a seemingly simple task which is simple to judge but[challenging⁠](http://openai.com/index/deep-reinforcement-learning-from-human-preferences/#bflip)to specify.

![Image 2: Humanfeedbackjump](https://images.ctfassets.net/kftzwdyauwt9/cf6fdf49-ea9e-489d-eb53eceeebc7/03dec4ea90925c03dea2ee6c4976e921/humanfeedbackjump.gif?w=3840&q=90&fm=webp)

Our algorithm learned to backflip using around 900 individual bits of feedback from the human evaluator.

The overall training process is a 3-step feedback cycle between the human, the agent’s understanding of the goal, and the RL training.

![Image 3: Diagram2x 2](https://images.ctfassets.net/kftzwdyauwt9/76127a33-15be-4357-ee340ba5f9d5/8a212d11cf7ae259505a6c8125c7074f/diagram2x-2.png?w=3840&q=90&fm=webp)

Our AI agent starts by acting randomly in the environment. Periodically, two video clips of its behavior are given to a human, and the human decides which of the two clips is closest to fulfilling its goal—in this case, a backflip. The AI gradually builds a model of the goal of the task by finding the reward function that best explains the human’s judgments. It then uses RL to learn how to achieve that goal. As its behavior improves, it continues to ask for human feedback on trajectory pairs where it’s most uncertain about which is better, and further refines its understanding of the goal.

Our approach demonstrates promising sample efficiency—as stated previously, the backflip video required under 1000 bits of human feedback. It took less than an hour of a human evaluator’s time, while in the background the policy accumulated about 70 hours of overall experience (simulated at a much faster rate than real-time.) We will continue to work on reducing the amount of feedback a human needs to supply. You can see a sped-up version of the training process in the following video.

We’ve tested our method on a number of tasks in the simulated robotics and Atari domains (without being given access to the reward function: so in Atari, without having access to the game score). Our agents can learn from human feedback to achieve strong and sometimes superhuman performance in many of the environments we tested. In the following animation you can see agents trained with our technique playing a variety of Atari games. The horizontal bar on the right hand side of each frame represent’s each agents prediction about how much a human evaluator would approve of their current behavior. These visualizations indicate that agents trained with human feedback learn to value oxygen in Seaquest (left), anticipate rewards in Breakout and Pong (center), or work out how to recover from crashes in Enduro(right).

![Image 4: Seaquestsave](https://images.ctfassets.net/kftzwdyauwt9/66ed060d-eb2b-4526-587454feb58d/f334c6ee4c40536ce1863c70f8fe3047/seaquestsave.gif?w=3840&q=90&fm=webp)

![Image 5: Spaceinvadersbehavior](https://images.ctfassets.net/kftzwdyauwt9/66ed060d-eb2b-4526-b8c43779417e/c3f1780d14de003504a1d2b7132ff3b5/spaceinvadersbehavior.gif?w=3840&q=90&fm=webp)

![Image 6: Pong2](https://images.ctfassets.net/kftzwdyauwt9/66ed060d-eb2b-4526-4ca9ae27f567/bddd5d485b6e03cf1d3bcfd3d915cbb9/pong2.gif?w=3840&q=90&fm=webp)

![Image 7: Enduro1](https://images.ctfassets.net/kftzwdyauwt9/7b8509cb-549f-4548-41d14481cd4b/345f60db7bd258da56de7522c61e5d4a/enduro1.gif?w=3840&q=90&fm=webp)

Note there’s no need for the feedback to align with the environment’s normal reward function: we can, for example, train our agents to precisely keep even with other cars in Enduro rather than maximizing game score by passing them. We also sometimes find that learning from feedback does better than reinforcement learning with the normal reward function, because the human shapes the reward better than whoever wrote the environment’s reward.

## Challenges

Our algorithm’s performance is only as good as the human evaluator’s intuition about what behaviors _look_ correct, so if the human doesn’t have a good grasp of the task they may not offer as much helpful feedback. Relatedly, in some domains our system can result in agents adopting policies that trick the evaluators. For example, a robot which was supposed to grasp items instead positioned its manipulator in between the camera and the object so that it only _appeared_ to be grasping it, as shown below.

![Image 8: Gifhandlerresized](https://images.ctfassets.net/kftzwdyauwt9/f12a1b22-538c-475f-fc11e192c9c0/afe00400704dbd16c3d090fdbf76c118/gifhandlerresized.gif?w=3840&q=90&fm=webp)

We addressed this particular problem by adding in visual cues (the thick white lines in the above animation) to make it easy for the human evaluators to estimate depth.

The research described in this post was done in collaboration with Jan Leike, Miljan Martic, and Shane Legg at DeepMind. Our two organizations plan to continue to collaborate on topics that touch on long-term AI safety. We think that techniques like this are a step towards safe AI systems capable of learning human-centric goals, and can complement and extend existing approaches like reinforcement and imitation learning. This post is representative of the work done by OpenAI’s safety team; if you’re interested in working on problems like this, please[join us⁠](http://openai.com/careers/)!

## Footnote

![Image 9: Goodgifb1 2](https://images.ctfassets.net/kftzwdyauwt9/9b63988d-b4dd-4313-a696d817a0bb/8c5a970593721250ee5d2fdb2a0465ff/goodgifb1-2.gif?w=3840&q=90&fm=webp)

![Image 10: Badgif3](https://images.ctfassets.net/kftzwdyauwt9/9b63988d-b4dd-4313-9994e383af43/0a135059372795a2a98de43e227f5996/badgif3.gif?w=3840&q=90&fm=webp)

By comparison, we took two hours to write our own reward function (the animation in the above right) to get a robot to backflip, and though it succeeds it’s a lot less elegant than the one trained simply through human feedback (top left). We think there are many cases where human feedback could let us specify a specific goal more intuitively and quickly than is possible by manually hand-crafting the objective.

You can replicate this backflip in[gym⁠(opens in a new window)](https://github.com/openai/gym)with the following reward function for Hopper:

#### Python

`1def reward_fn(a, ob):2    backroll = -ob[7]3    height = ob[0]4    vel_act = a[0] * ob[8] + a[1] * ob[9] + a[2] * ob[10]5    backslide = -ob[5]6    return backroll * (1.0 + .3 * height + .1 * vel_act + .05 * backslide)`

*   [Ethics & Safety](http://openai.com/research/index/?tags=ethics-safety)
*   [Learning Paradigms](http://openai.com/research/index/?tags=learning-paradigms)

## Authors

Dario Amodei, Paul Christiano, Alex Ray

## Related articles

[View all](http://openai.com/news/)

![Image 11: Disrupting malicious > media](https://images.ctfassets.net/kftzwdyauwt9/5080983d-9c4d-4479-17e421d7380a/0b42f77c2478bc5bc7bde3fddfc68462/45.png?w=3840&q=90&fm=webp)

[Disrupting malicious uses of AI by state-affiliated threat actors Security Feb 14, 2024](http://openai.com/index/disrupting-malicious-uses-of-ai-by-state-affiliated-threat-actors/)

![Image 12](https://images.ctfassets.net/kftzwdyauwt9/ec66425e-99ca-4314-d04b087f8727/de7341b6a5281c2a220b93a737ce19b0/building-an-early-warning-system-for-llm-aided-biological-threat-creation.jpg?w=3840&q=90&fm=webp)

[Building an early warning system for LLM-aided biological threat creation Publication Jan 31, 2024](http://openai.com/index/building-an-early-warning-system-for-llm-aided-biological-threat-creation/)

![Image 13: Democratic Inputs To AI Grant Program Update](https://images.ctfassets.net/kftzwdyauwt9/f50ce1d2-4f61-4ed2-e560c624d631/6f4dd4542898a35d0a91b137f85c9834/Democratic_inputs_to_AI_grant_program_lessons_learned_and_implementation_plans.jpg?w=3840&q=90&fm=webp)

[Democratic inputs to AI grant program: lessons learned and implementation plans Safety Jan 16, 2024](http://openai.com/index/democratic-inputs-to-ai-grant-program-update/)

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
