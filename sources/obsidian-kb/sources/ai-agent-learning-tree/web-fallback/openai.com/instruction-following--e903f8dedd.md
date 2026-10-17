Title: Aligning language models to follow instructions

URL Source: http://openai.com/research/instruction-following

Markdown Content:
*   [GPT](https://openai.com/research/index/?tags=gpt)
*   [Language](https://openai.com/research/index/?tags=language)

## Footnotes

1.   A
We only use prompts submitted through the Playground to an earlier version of the InstructGPT models that was deployed in January 2021. Our human annotators remove personal identifiable information from all prompts before adding it to the training set.

2.   B
The InstructGPT models deployed in the API are updated versions trained using the same human feedback data. They use a similar but slightly different training method that we will describe in a forthcoming publication.

3.   C
We also measure several other dimensions of potentially harmful outputs on our API distribution: whether the outputs contain sexual or violent content, denigrate a protected class, or encourage abuse. We find that InstructGPT doesn’t improve significantly over GPT-3 on these metrics; the incidence rate is equally low for both models.

4.   D
We found this approach more effective than simply increasing the KL coefficient.

5.   E
These labelers are sourced from Scale AI and Upwork, similarly to our training labelers, but do not undergo a screening test.

## References

1.   1
Christiano, P., Leike, J., Brown, T.B., Martic, M., Legg, S. and Amodei, D., 2017. Deep reinforcement learning from human preferences. arXiv preprint arXiv:1706.03741.

2.   2
Stiennon, N., Ouyang, L., Wu, J., Ziegler, D.M., Lowe, R., Voss, C., Radford, A., Amodei, D. and Christiano, P.,2020.

3.   3
Wu, J., Ouyang, L., Ziegler, D.M., Stiennon, N., Lowe, R., Leike, J. and Christiano, P., 2021. Recursively summarizing books with human feedback. arXiv preprint arXiv:2109.10862.

4.   4
Wei, J., Bosma, M., Zhao, V.Y., Guu, K., Yu, A.W., Lester, B., Du, N., Dai, A.M. and Le, Q.V., 2021. Finetuned language models are zero-shot learners. arXiv preprint arXiv:2109.01652.

5.   5
Sanh, V., Webson, A., Raffel, C., Bach, S.H., Sutawika, L., Alyafeai, Z., Chaffin, A., Stiegler, A., Scao, T.L., Raja, A. and Dey, M., 2021. Multitask prompted training enables zero-shot task generalization. arXiv preprint arXiv:2110.08207.

6.   6
Bender, E.M., Gebru, T., McMillan-Major, A. and Shmitchell, S., 2021, March. On the Dangers of Stochastic Parrots: Can Language Models Be Too Big?🦜. In Proceedings of the 2021 ACM Conference on Fairness, Accountability, and Transparency (pp.610-623).

7.   7
Bommasani, R., Hudson, D.A., Adeli, E., Altman, R., Arora, S., von Arx, S., Bernstein, M.S., Bohg, J., Bosselut, A., Brunskill, E. and Brynjolfsson, E., 2021. On the opportunities and risks of foundation models. arXiv preprint arXiv:2108.07258.

8.   8
Kenton, Z., Everitt, T., Weidinger, L., Gabriel, I., Mikulik, V. and Irving, G., 2021. Alignment of Language Agents. arXiv preprint arXiv:2103.14659.

9.   9
Weidinger, L., Mellor, J., Rauh, M., Griffin, C., Uesato, J., Huang, P.S., Cheng, M., Glaese, M., Balle, B., Kasirzadeh, A. and Kenton, Z., 2021. Ethical and social risks of harm from Language Models. arXiv preprint arXiv:2112.04359.

10.   10
Tamkin, A., Brundage, M., Clark, J. and Ganguli, D., 2021. Understanding the Capabilities, Limitations, and Societal Impact of Large Language Models. arXiv preprint arXiv:2102.02503.

11.   11
Solaiman, I. and Dennison, C., 2021. Process for Adapting Language Models to Society (PALMS) with Values-Targeted Datasets. arXiv preprint arXiv:2106.10328.

12.   12
Ngo, H., Raterink, C., Araújo, J.G., Zhang, I., Chen, C., Morisot, A. and Frosst, N., 2021. Mitigating harm in language models with conditional-likelihood filtration. arXiv preprint arXiv:2108.07790.

13.   13
Xu, J., Ju, D., Li, M., Boureau, Y.L., Weston, J. and Dinan, E., 2020. Recipes for safety in open-domain chatbots. arXiv preprint arXiv:2010.07079.

14.   14
Keskar, N.S., McCann, B., Varshney, L.R., Xiong, C. and Socher, R., 2019. Ctrl: A conditional transformer language model for controllable generation. arXiv preprint arXiv:1909.05858.

15.   15
Krause, B., Gotmare, A.D., McCann, B., Keskar, N.S., Joty, S., Socher, R. and Rajani, N.F., 2020. Gedi: Generative discriminator guided sequence generation. arXiv preprint arXiv:2009.06367.

16.   16
Dathathri, S., Madotto, A., Lan, J., Hung, J., Frank, E., Molino, P., Yosinski, J. and Liu, R., 2019. Plug and play language models: A simple approach to controlled text generation. arXiv preprint arXiv:1912.02164.

17.   17
Lin, S., Hilton, J. and Evans, O., 2021. TruthfulQA: Measuring how models mimic human falsehoods. arXiv preprint arXiv:2109.07958.

18.   18
Gehman, S., Gururangan, S., Sap, M., Choi, Y. and Smith, N.A., 2020. RealToxicityPrompts: Evaluating neural toxic degeneration in language models. arXiv preprint arXiv:2009.11462.

19.   19
Rudinger, R., Naradowsky, J., Leonard, B. and Van Durme, B., 2018. Gender bias in coreference resolution. arXiv preprint arXiv:1804.09301.

20.   20
Nangia, N., Vania, C., Bhalerao, R. and Bowman, S.R., 2020. CrowS-pairs: A challenge dataset for measuring social biases in masked language models. arXiv preprint arXiv:2010.00133.

## Authors

Ryan Lowe, Jan Leike

## Acknowledgments

We’d like to thank our paper co-authors: Long Ouyang, Jeff Wu, Roger Jiang, Diogo Almeida, Carroll Wainwright, Pamela Mishkin, Chong Zhang, Sandhini Agarwal, Katarina Slama, Alex Ray, John Schulman, Jacob Hilton, Fraser Kelton, Luke Miller, Maddie Simens, Amanda Askell, Peter Welinder, and Paul Christiano, along with everyone who provided feedback on the paper and blog post. We’d also like to thank the Comms team for their guidance and assistance, including Steve Dowling, Hannah Wong, Elie Georges, Alper Ercetin, Jared Salzano, Allan Diego, and Justin Jay Wang. Finally, we’d like to thank our labelers, without whom this project would not have been possible.
