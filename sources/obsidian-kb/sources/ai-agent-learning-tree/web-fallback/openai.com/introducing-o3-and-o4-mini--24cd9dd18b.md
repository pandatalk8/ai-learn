Title: Introducing OpenAI o3 and o4-mini

URL Source: http://openai.com/index/introducing-o3-and-o4-mini/

Markdown Content:
*   [What’s changed](http://openai.com/index/introducing-o3-and-o4-mini/#whats-changed)
*   [Continuing to scale reinforcement learning](http://openai.com/index/introducing-o3-and-o4-mini/#continuing-to-scale-reinforcement-learning)
*   [Thinking with images](http://openai.com/index/introducing-o3-and-o4-mini/#thinking-with-images)
*   [Toward agentic tool use](http://openai.com/index/introducing-o3-and-o4-mini/#toward-agentic-tool-use)
*   [Safety](http://openai.com/index/introducing-o3-and-o4-mini/#safety)
*   [Codex CLI: frontier reasoning in the terminal](http://openai.com/index/introducing-o3-and-o4-mini/#codex-cli-frontier-reasoning-in-the-terminal)
*   [Access](http://openai.com/index/introducing-o3-and-o4-mini/#access)
*   [What's next](http://openai.com/index/introducing-o3-and-o4-mini/#whats-next)
*   [Livestream replay](http://openai.com/index/introducing-o3-and-o4-mini/#livestream-replay)

_**Update on June 10, 2025:**_**_OpenAI o3‑pro is now available to Pro users in ChatGPT, as well as in our API_**_. Like OpenAI o1‑pro, o3‑pro is a version of our most intelligent model, OpenAI o3, designed to think longer and provide the most reliable responses. Full details can be found in our_[_release notes_⁠(opens in a new window)](https://help.openai.com/en/articles/9624314-model-release-notes)_._

* * *

Today, we’re releasing OpenAI **o3** and **o4-mini,** the latest in our o-series of models trained to think for longer before responding. These are the smartest models we’ve released to date, representing a step change in ChatGPT's capabilities for everyone from curious users to advanced researchers. For the first time, our reasoning models can agentically use and combine every tool within ChatGPT—this includes searching the web, analyzing uploaded files and other data with Python, reasoning deeply about visual inputs, and even generating images. Critically, these models are trained to reason about when and how to use tools to produce detailed and thoughtful answers in the right output formats, typically in under a minute, to solve more complex problems. This allows them to tackle multi-faceted questions more effectively, a step toward a more agentic ChatGPT that can independently execute tasks on your behalf. The combined power of state-of-the-art reasoning with full tool access translates into significantly stronger performance across academic benchmarks and real-world tasks, setting a new standard in both intelligence and usefulness.

## What’s changed

**OpenAI o3** is our most powerful reasoning model that pushes the frontier across **coding, math, science, visual perception**, and more. It sets a new SOTA on benchmarks including Codeforces, SWE-bench (without building a custom model-specific scaffold), and MMMU. It’s ideal for complex queries requiring multi-faceted analysis and whose answers may not be immediately obvious. It performs especially strongly at visual tasks like analyzing images, charts, and graphics. In evaluations by external experts, o3 makes 20 percent fewer major errors than OpenAI o1 on difficult, real-world tasks—especially excelling in areas like programming, business/consulting, and creative ideation. Early testers highlighted its analytical rigor as a thought partner and emphasized its ability to generate and critically evaluate novel hypotheses—particularly within biology, math, and engineering contexts.

**OpenAI o4-mini** is a smaller model optimized for fast, cost-efficient reasoning—it achieves remarkable performance for its size and cost, particularly in **math, coding, and visual tasks**. It is the best-performing benchmarked model on AIME 2024 and 2025. Although access to a computer meaningfully reduces the difficulty of the AIME exam, we also found it notable that o4-mini achieves 99.5% pass@1 (100% consensus@8) on AIME 2025 when given access to a Python interpreter. While these results should not be compared to the performance of models without tool access, they are one example of how effectively o4-mini leverages available tools; o3 shows similar improvements on AIME 2025 from tool use (98.4% pass@1, 100% consensus@8).

In expert evaluations, o4-mini also outperforms its predecessor, o3‑mini, on non-STEM tasks as well as domains like data science. Thanks to its efficiency, o4-mini supports significantly higher usage limits than o3, making it a strong high-volume, high-throughput option for questions that benefit from reasoning. External expert evaluators rated **both models** as demonstrating improved instruction following and more useful, verifiable responses than their predecessors, thanks to improved intelligence and the inclusion of web sources. Compared to previous iterations of our reasoning models, these two models should also feel more natural and conversational, especially as they reference memory and past conversations to make responses more personalized and relevant.

### Multimodal

### Coding

_All SWE-bench evaluation runs use a fixed subset of n=477 verified tasks which have been validated on our internal infrastructure._

### Instruction following and agentic tool use

_All models are evaluated at high ‘reasoning effort’ settings—similar to variants like ‘o4-mini-high’ in ChatGPT._

## Continuing to scale reinforcement learning

Throughout the development of OpenAI o3, we’ve observed that large-scale reinforcement learning exhibits the same **“more compute = better performance**” trend observed in GPT‑series pretraining. By retracing the scaling path—this time in RL—we’ve pushed an additional order of magnitude in both training compute and inference-time reasoning, yet still see clear performance gains, validating that the models’ performance continues to improve the more they’re allowed to think. At equal latency and cost with OpenAI o1, o3 delivers higher performance in ChatGPT—and we've validated that if we let it think longer, its performance keeps climbing.

We also trained both models to**use tools through reinforcement learning**—teaching them not just how to use tools, but to reason about when to use them. Their ability to deploy tools based on desired outcomes makes them more capable in open-ended situations—particularly those involving visual reasoning and multi-step workflows. This improvement is reflected both in academic benchmarks and real-world tasks, as reported by early testers.

## Thinking with images

![Image 1: ChatGPT thinking with images](https://images.ctfassets.net/kftzwdyauwt9/5xCw1KgHHs0BQI0Fz1bOLM/1ca4ddcca658fddd65815dd3aa288773/thinking_with_images_static.png?w=3840&q=90&fm=webp)

For the first time, these models can integrate images directly into their chain of thought. They don’t just see an image—they think with it. This unlocks a new class of problem-solving that blends visual and textual reasoning, reflected in their state-of-the-art performance across multimodal benchmarks.

People can upload a photo of a whiteboard, a textbook diagram, or a hand-drawn sketch, and the model can interpret it—even if the image is blurry, reversed, or low quality. With tool use, the models can manipulate images on the fly—rotating, zooming, or transforming them as part of their reasoning process.

These models deliver best-in-class accuracy on visual perception tasks, enabling it to solve questions that were previously out of reach. Check out the [visual reasoning research blog⁠](http://openai.com/index/thinking-with-images/) to learn more.

## Toward agentic tool use

OpenAI o3 and o4-mini have full access to tools within ChatGPT, as well as your own custom tools via function calling in the API. These models are trained to reason about how to solve problems, choosing when and how to use tools to produce detailed and thoughtful answers in the right output formats quickly—typically in under a minute.

For example, a user might ask: “How will summer energy usage in California compare to last year?” The model can search the web for public utility data, write Python code to build a forecast, generate a graph or image, and explain the key factors behind the prediction, chaining together multiple tool calls. Reasoning allows the models to react and pivot as needed to information it encounters. For example, they can search the web multiple times with the help of search providers, look at results, and try new searches if they need more info.

This flexible, strategic approach allows the models to tackle tasks that require access to up-to-date information beyond the model’s built-in knowledge, extended reasoning, synthesis, and output generation across modalities.

_All examples were completed with OpenAI o3._

### Advancing cost-efficient reasoning

##### Cost vs performance: o3‑mini and o4-mini

##### Cost vs performance: o1 and o3

OpenAI o3 and o4-mini are the most intelligent models we have ever released, and they’re also often more efficient than their predecessors, OpenAI o1 and o3‑mini. For example, on the 2025 AIME math competition, the cost-performance frontier for o3 strictly improves over o1, and similarly, o4-mini's frontier strictly improves over o3‑mini. More generally, we expect that for most real-world usage, o3 and o4-mini will also be both smarter and cheaper than o1 and o3‑mini, respectively.

## Safety

Each improvement in model capabilities warrants commensurate improvements to safety. For OpenAI o3 and o4-mini, we completely rebuilt our safety training data, adding new refusal prompts in areas such as biological threats (biorisk), malware generation, and jailbreaks. This refreshed data has led o3 and o4-mini to achieve strong performance on our internal refusal benchmarks (e.g., [instruction hierarchy⁠](http://openai.com/index/the-instruction-hierarchy/), jailbreaks). In addition to strong performance for model refusals, we have also developed system-level mitigations to flag dangerous prompts in frontier risk areas. Similar to our earlier work in [image generation⁠](http://openai.com/index/introducing-4o-image-generation/), we trained a reasoning LLM monitor which works from human-written and interpretable safety specifications. When applied to biorisk, this monitor successfully flagged ~99% of conversations in our human red‑teaming campaign.

We stress tested both models with our most rigorous safety program to date. In accordance with our updated [Preparedness Framework⁠](https://openai.com/index/updating-our-preparedness-framework/), we evaluated o3 and o4-mini across the three tracked capability areas covered by the Framework: biological and chemical, cybersecurity, and AI self-improvement. Based on the results of these evaluations, we have determined that both o3 and o4‑mini remain below the Framework's "High" threshold in all three categories. We have published the detailed results from these evaluations in the accompanying [system card⁠.⁠](http://openai.com/index/o3-o4-mini-system-card/)

## Codex CLI: frontier reasoning in the terminal

We’re also sharing a new experiment: Codex CLI, a lightweight coding agent you can run from your terminal. It works directly on your computer and is designed to maximize the reasoning capabilities of models like o3 and o4-mini, with upcoming support for additional API models like [GPT‑4.1⁠](https://openai.com/index/gpt-4-1/).

You can get the benefits of multimodal reasoning from the command line by passing screenshots or low fidelity sketches to the model, combined with access to your code locally. We think of it as a minimal interface to connect our models to users and their computers. Codex CLI is fully open-source at [github.com/openai/codex⁠(opens in a new window)](https://github.com/openai/codex) today.

Alongside, we are launching a $1 million initiative to support projects using Codex CLI and OpenAI models. We will evaluate and accept applications for grants in increments of $25,000 USD in the form of API credits. Proposals can be submitted [here](http://openai.com/form/codex-open-source-fund/).

## Access

ChatGPT Plus, Pro, and Team users will see o3, o4-mini, and o4-mini-high in the model selector starting today, replacing o1, o3‑mini, and o3‑mini‑high. ChatGPT Enterprise and Edu users will gain access in one week. Free users can try o4-mini by selecting 'Think' in the composer before submitting their query. Rate limits across all plans remain unchanged from the prior set of models.

We expect to release OpenAI o3‑pro in a few weeks with full tool support. For now, Pro users can still access o1‑pro.

Both o3 and o4-mini are also available to developers today via the Chat Completions API and Responses API (some developers will need to [verify their organizations⁠(opens in a new window)](https://help.openai.com/en/articles/10910291-api-organization-verification) to access these models). The Responses API supports reasoning summaries, the ability to preserve reasoning tokens around function calls for better performance, and will soon support built-in tools like web search, file search, and code interpreter within the model’s reasoning. To get started, [explore our docs⁠⁠(opens in a new window)](https://platform.openai.com/docs/guides/reasoning?api-mode=responses) and stay tuned for more updates.

## What's next

Today's updates reflect the direction our models are heading in: we’re converging the specialized reasoning capabilities of the o-series with more of the natural conversational abilities and tool use of the GPT‑series. By unifying these strengths, our future models will support seamless, natural conversations alongside proactive tool use and advanced problem-solving.

* * *

_**Update on July 28, 2025:**_ _SWE-Lancer dataset and results updated as of July 17, 2025, available at:_[_https://github.com/openai/preparedness_⁠(opens in a new window)](https://github.com/openai/preparedness)_and in our system cards. This update resolves several issues that were impacting the dollars earned results and removes the requirement for internet connectivity during execution, eliminating a primary source of variability in model performance._

_**Update on April 16, 2025:**_ _results for o3 on Charxiv-r and Mathvista were updated to reflect a system prompt change that wasn't present in the original evaluation._

## Livestream replay

*   [ChatGPT](http://openai.com/research/index/?tags=chatgpt)
*   [GPT](http://openai.com/research/index/?tags=gpt)
*   [Framework](http://openai.com/research/index/?tags=framework)
*   [2025](http://openai.com/research/index/?tags=2025)

## Author

OpenAI

## Footnotes

_* tau-bench eval numbers are averaged across 5 runs to reduce variance, and run without any custom tools or prompting. We found tau-bench retail rollouts are more prone to user model errors._ _Numbers for shaded bar are run with_ _GPT-4.1 as user model because it’s significantly better than GPT-4o at instruction following._

_* SWE-bench uses 256k max context length, which improves the solve rate for o4-mini by about 3% and impacts o3’s solve rate by <1%. We also exclude 23 samples that are not runnable on our internal infrastructure._

_** When enabling browsing, the model can sometimes find exact answers online, for example, by reading blog posts with sample problems from a dataset. We mitigate concerns of the model cheating while browsing with two strategies:_

*   _Blocked domains that we have observed the model cheating from in the past._

*   _Used a reasoning model as a monitor to examine all tokens in each attempt, in order to identify suspicious behavior. Suspicious behavior is defined as "a page, file, or snippet whose main purpose is to provide the exact answer to this specific question—e.g., an official grading key, leaked “solutions” gist, or discussion quoting the finished answer verbatim." Benign behavior is defined as "Any authoritative resource a diligent human might consult (documentation, manuals, scholarly papers, reputable articles) even if it incidentally contains the correct answer." Any attempts where the monitor deemed the rollout suspicious are counted as incorrect. Most samples failed by this check were problems whose exact solution was available on multiple internet sources_**_unrelated_**_to HLE._

_Finally, our evaluations with browsing may not be perfectly reproducible in the OpenAI API due to a difference in search engine backends between ChatGPT and the OpenAI API. These results are intended to be representative of the ChatGPT user experience, but depending on demand, the search configuration may change over time._

## Contributors

Aaditya Singh, Aaron Schlesinger, Adam Fry, Adam Lerer, Adam Perelman, Adam Walker, Ahmed El-Kishky, Aidan Clark, Aidan McLaughlin, Aiden Low, Akila Welihinda, Akshay Nathan, Aleksander Madry, Aleksandra Spyra, Alex Karpenko, Alex Neitz, Alex Tachard Passos, Alex Wei, Alexander Prokofiev, Alexander Zielenski, Alexandra Barr, Alexey Ivanov, Alexi Christakis, Alfred Xue, Allison Tam, Ally Bennett, Ally Bennett , Amelia Liu, Amy McDonald Sandjideh, Ananya Kumar, Andre Saraiva, Andrea Vallone, Andrew Chen, Andrew Duberstein, Andrew Gibiansky, Andrew Kondrich, Andrew Tulloch, Andrey Mishchenko, Andy Applebaum, Andy Wang, Angela Baek, Annie Wei, Anting Shen, Antoine Pelisse, Anuj Saharan, Arun Vijayvergiya, Ashley Tyra, Ashvin Nair, Avi Nayak, Avital Oliver, Behrooz Ghorbani, Belinda Truong, Ben Sokolowsky, Beth Hoover, Bo Xu, Boaz Barak, Bohan Zhang, Borys Minaiev, Botao Hao, Bowen Baker, Bowen Cheng, Brandon McKinzie, Brandon Wang, Brian Hsu, Brian Yang, Brian Yu, Brian Zhang, Camillo Lugaresi, Carolina Paz, Carpus Chang, Cary Bassin , Cary Hudson, Casey Chu, Chak Li, Charles Zhao, Charlie Jatt, Charlotte Cole, Chelsea Voss, Chen Shen, Chengxu Zhuang, Chris Colby, Chris Hallacy , Chris Koch, Christina Kaplan, Christina Kim, Colin Reid, Colin Wei, Cristina Scheau, D. Sculley, Damien Deville, Dan Roberts, Dana Palmie, Dane Stuckey, Daniel Levine, David Hu, David Martin, David Robinson, David Sasaki, Davis Wu, Derek Chen, Dibya Bhattacharjee, Dimitris Tsipras, Dinghua Li, DJ Strouse, dmed Medina, Drew Hintz, Eddie Zhang, Edmund Wong, Elaine Ya Le, Eli Yani , Elizabeth Proehl, Emily Sokolova, Enoch Cheung, Eri Schwartz, Eric Mitchell, Eric Ning, Eric Sigler, Eric Wallace, Eugenio Panero, Evan Mays, Evgenii Nikishin, Fan Wang, Fangyuan Li, Filippo Raso, Foivos Tsimpourlas, Fouad Matin, Francis Song, Francis Zhang, Gary Yang, Gene Oden, Giambattista Parascandolo, Gildas Chabot, Grace Kim, Grace Zhao, Greg Brockman, Gregory Valiant, Guillaume Leclerc, Hadi Salman, Haitang Hu, Hannah Sheahan, Hao Sheng, Haoyu Wang, Henrique Ponde de Oliveira Pinto, Henry Aspegren, Heqing Yan, Hessam Bagherinezhad, Hongyu Ren, Hunter Lightman, Hyeonwoo Noh, Ian Kivlichan, Ian Sohl, Ignasi Clavera, Ikai Lan, Ilge Akkaya, Ilya Kostrikov, Irina Kofman, Isa Fulford, Jake Brill, Jakub Pachocki, James Betker, James Lee, James Qin, Jamie Kiros, Jason Ai, Jay Wang, Jean Harb, Jeff Mickey, Jeffrey Han, Jeffrey Wang, Jeremy Chen, Jerry Tworek, Jessica Liang, Jessica Shieh, Ji Lin, Jiahui Yu, Jianfeng Wang, Jie Tang, Jihan Yin, Jing Li, Joanne Jang, Joel Morris, Johannes Ferstad, Johannes Heidecke, John Fishbein, Jon Okun, Jonathan Gordon, Joost Huizinga, Jos Kraaijeveld, Joseph Mo, Josh Lawson , Josh Tobin, Junhua Mao, Kai Chen, Kai Hayashi, Karan Singhal, Karina Nguyen, Katy Shi, Kelly Stirman, Kenji Hata, Kenny Nguyen, Keren Gu-Lemberg, Kevin Gladstone, Kevin King, Kevin Liu, Kevin Lu, Kevin Park, Kevin Stone, Kevin Weil, Kevin Whinnery, Kevin Yu, Kote Mushegiani, Kristen Ying, Kristian Georgiev, Kshitij Gupta, Kyle Kosic, Lama Ahmad, Larry Lv, Lauren Itow, Lauren Yang, Lee Byron, Leo Chen, Leo Liu, Leon Maksin, Leyton Ho, Li Jing, Liang Xiong, Lin Yang, Linden Li, Lorenz Kuhn, Louis Feuvrier, Lu Zhang, Łukasz Kaiser, Mahmoud Eariby, Maja Trębacz, Manas Joglekar, Manoli Liodakis, Manuka Stratta, Mark Chen, Mark Hudnall, Mark Sun, Mark Wang, Martin Li, Marvin Zhang, Mateusz Litwin, Matt Jones, Matt Lim, Max Johnson, Max Schwarzer, Mayank Gupta, Meghan Shah, Mengqing Wang, Mengyuan Yan, Mia Glaese, Michael Bolin, Michael Lampe, Michael Malek, Michael Sharman, Michael Zhang, Michele Wang, Michelle Pokrass, Miguel Oom Temudo de Castro, Mihai Florian, Mike McClay, Mike Trpcic, Miki Habryn, Miles Wang, Ming Chen, Mingxuan Wang, Minnia Feng, Mitchell Gordon, Mo Bavarian, Mostafa Rohaninejad, Nacho Soto, Nakul Khanna, Nat McAleese, Natalie Staudacher, Natan LaFontaine, Neel Ajjarapu, Nick Felt, Nick Turley, Nikil Pancha, Nikita Mikhaylin, Niko Felix, Nikunj Handa, Ning Liu, Nishant Rai, Noah Jorgensen, Noam Brown, Oleg Boiko, Oleg Murk, Olivia Watkins, Olivier Godement, Oona Gleeson, Paul Ashbourne, Pavel Belov, Peter Flockhart, Peter Hoeschele, Peter Zhokhov, Philip Pronin, Phillip Guo, Phoebe Thacker, Prafulla Dhariwal, Prashanth R, Rachel Dias, Rahul Arora, Rajkumar Samuel, Rasmus Rygaard, Ravi Teja Mullapudi, Raymond Li, Raz Gaon, Reah Miyara, Reiichiro Nakano, Reimar Leike, Rennie Song, Rhythm Garg, RJ Marsan, Robert Xiong, Robin Brown, Roman Tsiupa, Rui Shu, Ruslan Nigmatullin, Saachi Jain, Saagar Patel, Sam Altman, Sam Toizer, Sam Toyer, Samir Ahmed, Samuel Miserendino, Samuel Wolrich , Sandhini Agarwal, Santiago Hernández, Sarah Dong, Savannah Heon, Scott Ethersmith, Scott Mayer McKinney, Sean Fitzgerald, Sever Banesiu, Shamez Hemani, Shengjia Zhao, Shengli Hu, Shibani Santurkar, Shreyas Krishnaswamy, Shuchao Bi, Shunyu Yao, Shuyuan Zhang, Simón Posada Fishman, Spencer Papay, Spug Golden, Srinivas Narayanan, Stanley Hsieh, Stephen Logsdon, Sundeep Tirumalareddy, Tal Stramer, Tao Wang, Tao Xin, Taylor Gordon, Tejal Patwardhan, Thibault Sottiaux, Tina Sriskandarajah, Tony Casparro, Tony Zhao, Trapit Bansal, Trevor Creech, Uzair Navid Iftikhar, Valerie Qi, Vineet Kosaraju, Vishal Kuo, Vitchyr Pong, Vivek Verma, Vlad Petrov, Wenda Zhou, Wenlei Xie, Wenting Zhan, Will DePue, Will Ellsworth, William Sheu, Wyatt Thompson, Yaming Lin, Yann Dubois, Yaodong Yu, Yara Khakbaz, Yash Patil, Yifan Wu, Yilong Qin, Yining Chen, Yirui Zhang, Yo Shavit , Young Cha, Yunyun Wang, Yushi Wang, Zack Sultan, Zehao Dou, Zewei Chu, Zheng Shao, Zhigang Wang, Zhishuai Zhang, Zihao Zhang
