Title: Faulty reward functions in the wild

URL Source: http://openai.com/blog/faulty-reward-functions/

Markdown Content:
The RL agent finds an isolated lagoon where it can turn in a large circle and repeatedly knock over three targets, timing its movement so as to always knock over the targets just as they repopulate. Despite repeatedly catching on fire, crashing into other boats, and going the wrong way on the track, our agent manages to achieve a higher score using this strategy than is possible by completing the course in the normal way. Our agent achieves a score on average 20 percent higher than that achieved by human players.

While harmless and amusing in the context of a video game, this kind of behavior points to a more general issue with reinforcement learning: it is often difficult or infeasible to capture exactly what we want an agent to do, and as a result we frequently end up using imperfect but easily measured proxies. Often this works well, but sometimes it leads to undesired or even dangerous actions. More broadly it contravenes the basic engineering principle that systems should be reliable and predictable. We’ve also explored this issue at greater length in our research paper[Concrete Problems on AI Safety⁠](https://openai.com/index/concrete-ai-safety-problems/).

How can we avoid such problems? Aside from being careful about designing reward functions, several research directions OpenAI is exploring may help to reduce cases of misspecified rewards:

*   Learning from demonstrations allows us to avoid specifying a reward directly and instead just learn to imitate how a human would complete the task. In this example, since the vast majority of humans would seek to complete the racecourse, our RL algorithms would do the same.
*   In addition to, or instead of human demonstrations, we can also incorporate[human feedback⁠(opens in a new window)](https://medium.com/ai-control/efficient-feedback-a347748b1557#.exjnsupts)by evaluating the quality of episodes or even sharing control with the agent in an interactive manner. It’s possible that a very small amount of evaluative feedback might have prevented this agent from going around in circles.
*   It may be possible to use transfer learning to train on many similar games, and infer a “common sense” reward function for this game. Such a reward function might prioritize finishing the race based on the fact that a typical game has such a goal, rather than focusing on the idiosyncrasies of this particular game’s reward function. This seems more similar to how a human would play the game.

These methods may have their own shortcomings. For example, transfer learning involves extrapolating a reward function for a new environment based on reward functions from many similar environments. This extrapolation could itself be faulty—for example, an agent trained on many racing video games where driving off the road has a small penalty, might incorrectly conclude that driving off the road in a new, higher stakes setting is not a big deal. More subtly, if the reward extrapolation process involves neural networks,[adversarial examples⁠(opens in a new window)](https://arxiv.org/abs/1412.6572)in that network could lead a reward function that has “unnatural” regions of high reward that do not correspond to any reasonable real-world goal.

Solving these issues will be complex. Our hope is that Universe will enable us to both discover and address new failure modes at a rapid pace, and eventually to develop systems whose behavior we can be truly confident in.
