Title: Using GPT-4 for content moderation

URL Source: http://openai.com/blog/using-gpt-4-for-content-moderation

Markdown Content:
[Skip to main content](http://openai.com/blog/using-gpt-4-for-content-moderation#main)

[](http://openai.com/)

*   [Research](http://openai.com/research/index/)
*   Products
*   [Business](http://openai.com/business/)
*   [Developers](http://openai.com/api/)
*   [Company](http://openai.com/about/)
*   [Foundation(opens in a new window)](https://openaifoundation.org/)

Log in[Try ChatGPT(opens in a new window)](https://chatgpt.com/?openaicom-did=61cc42d1-64fe-4852-a5eb-fd7b02e6ecc7&openaicom_referred=true)

*   Research
*   Products
*   Business
*   Developers
*   Company
*   [Foundation(opens in a new window)](https://openaifoundation.org/)

Using GPT-4 for content moderation | OpenAI

August 15, 2023

[Safety](http://openai.com/news/safety-alignment/)

# Using GPT‑4 for content moderation

We use GPT‑4 for content policy development and content moderation decisions, enabling more consistent labeling, a faster feedback loop for policy refinement, and less involvement from human moderators.

![Image 1: A watercolor-style abstract digital painting with a soft blue foreground, a greenish sky, and a vivid pink cloud-like form spreading from the left side.](https://images.ctfassets.net/kftzwdyauwt9/3oQb5QVQxMYse1jLzumHT2/3abfb15b70771a33cc1166ff75fe76f7/Using_GPT-4_for_content_moderation.png?w=3840&q=90&fm=webp)

Listen to article 5:22

[Audio 2](http://openai.com/blog/using-gpt-4-for-content-moderation)

Share

Challenges in content moderation

*   [Challenges in content moderation](http://openai.com/blog/using-gpt-4-for-content-moderation#challenges-in-content-moderation)
*   [Using large language models](http://openai.com/blog/using-gpt-4-for-content-moderation#using-large-language-models)
*   [Limitations](http://openai.com/blog/using-gpt-4-for-content-moderation#limitations)

*   [Challenges in content moderation](http://openai.com/blog/using-gpt-4-for-content-moderation#challenges-in-content-moderation)
*   [Using large language models](http://openai.com/blog/using-gpt-4-for-content-moderation#using-large-language-models)
*   [Limitations](http://openai.com/blog/using-gpt-4-for-content-moderation#limitations)

Content moderation plays a crucial role in sustaining the health of digital platforms. A content moderation system using GPT‑4 results in much faster iteration on policy changes, reducing the cycle from months to hours. GPT‑4 is also able to interpret rules and nuances in long content policy documentation and adapt instantly to policy updates, resulting in more consistent labeling. We believe this offers a more positive vision of the future of digital platforms, where AI can help moderate online traffic according to platform-specific policy and relieve the mental burden of a large number of human moderators. Anyone with OpenAI API access can implement this approach to create their own AI-assisted moderation system.

![Image 2: Content Moderation Using Gpt4 Poster](https://images.ctfassets.net/kftzwdyauwt9/3f1a0dbb-9d8d-4013-dd68519e9c5b/189c5b2de861d340767b8d835ca1689d/content-moderation-using-gpt4-poster.png?w=3840&q=50&fm=webp)

00:00

## Challenges in content moderation

Content moderation demands meticulous effort, sensitivity, a profound understanding of context, as well as quick adaptation to new use cases, making it both time consuming and challenging. Traditionally, the burden of this task has fallen on human moderators sifting through large amounts of content to filter out toxic and harmful material, supported by smaller vertical-specific machine learning models. The process is inherently slow and can lead to mental stress on human moderators.

## Using large language models

We're exploring the use of LLMs to address these challenges. Our large language models like GPT‑4 can understand and generate natural language, making them applicable to content moderation. The models can make moderation judgments based on policy guidelines provided to them.

With this system, the process of developing and customizing content policies is trimmed down from months to hours.

1.   Once a policy guideline is written, policy experts can create a golden set of data by identifying a small number of examples and assigning them labels according to the policy.
2.   Then, GPT‑4 reads the policy and assigns labels to the same dataset, without seeing the answers.
3.   By examining the discrepancies between GPT‑4’s judgments and those of a human, the policy experts can ask GPT‑4 to come up with reasoning behind its labels, analyze the ambiguity in policy definitions, resolve confusion and provide further clarification in the policy accordingly. We can repeat steps 2 and 3 until we are satisfied with the policy quality.

This iterative process yields refined content policies that are translated into classifiers, enabling the deployment of the policy and content moderation at scale.

Optionally, to handle large amounts of data at scale, we can use GPT‑4's predictions to fine-tune a much smaller model.

## Example

Step 1 of 5

Moderate content

A piece of content to moderate and a snippet of an example policy

Moderate content

### Content policy

Show

# K Illicit Behaviour Taxonomy
1.    Determine if the text meets the definition of K0 Non-Illicit Behaviour. If it does, label it as K0 and stop. 
2.    If the text does not meet the definition of K0 Non-Illicit Behaviour, determine if the text meets one of the other definitions above and select the label that applies: 
    *    K4: Advice or instructions for violent wrongdoing or weapons 
    *    K3: Advice or instructions for non-violent wrongdoing
    *    K2: Admission of intent to commit wrongdoing or to procure a weapon 
    *   K1: Classification Requests

## Definition of Terms

 **Advice**  and  **instructions**  is content that includes reference to how something is done. Requests for advice and instructions may include terms such as “how would someone..?”, “explain step-by-step..” , “the easiest way to do X is..”, “first I’ll start by…”. This can also include ingredients and directions. 

 **Requests**  are types of input passed to a model intended to compel it to perform a particular task. There are several types of requests: 

*    Continuation: user makes implicit command to the LLM to continue the prompt in a way that makes sense and flows 
    *    Prompt: A machete is a broad blade that can be used in combat like a long-bladed knife. The way you make it from scratch is 

*    Explicit command / request: user directly addresses LLM for a clear-cut task. 
    *    Prompt: Give me the ingredients needed to make a Molotov cocktail 

*    Q&A / Search-like queries: user is directly asking the LLM a question and/or using it as a search engine. 
    *   Prompt: Where can I buy ammunition?

[...]

### Content to moderate

How to steal a car?

### Human review

### GPT-4 review

### GPT-4 explanation

The text should be classified as K0 non-illicit behavior because it does not meet the criteria for any label. While stealing a car is non-violent, the request does not reference the generation of malware, drug trafficking, vandalism. While stealing a car may be considered property theft, the policy does not include this as a type of wrongdoing, therefore the content should be labeled K0.

This simple yet powerful idea offers several improvements to traditional approaches to content moderation:

*   **More consistent labels.** Content policies are continually evolving and often very detailed. People may interpret policies differently or some moderators may take longer to digest new policy changes, leading to inconsistent labels. In comparison, LLMs are sensitive to granular differences in wording and can instantly adapt to policy updates to offer a consistent content experience for users.
*   **Faster feedback loop.** The cycle of policy updates – developing a new policy, labeling, and gathering human feedback – can often be a long and drawn-out process. GPT‑4 can reduce this process down to hours, enabling faster responses to new harms.
*   **Reduced mental burden.** Continual exposure to harmful or offensive content can lead to emotional exhaustion and psychological stress among human moderators. Automating this type of work is beneficial for the wellbeing of those involved.

![Image 3: Fact Factory Blog Diagram](https://images.ctfassets.net/kftzwdyauwt9/3d69d379-568e-45f9-560237c50035/e894e4d578562cd60d38755229526dec/fact-factory-blog-diagram.jpg?w=3840&q=90&fm=webp)

Illustration of the process of how we leverage GPT‑4 for content moderation, from policy development to moderation at scale.

Different from Constitutional AI ([Bai, et al. 2022⁠(opens in a new window)](https://arxiv.org/abs/2212.08073)) which mainly relies on the model's own internalized judgment of what is safe vs not, our approach makes platform-specific content policy iteration much faster and less effortful. We encourage Trust & Safety practitioners to try out this process for content moderation, as anyone with OpenAI API access can implement the same experiments today.

Labeling quality by GPT-4 is similar to human moderators with light training (Pool B). However, both are still overperformed by experienced, well-trained human moderators (Pool A).

We are actively exploring further enhancement of GPT‑4’s prediction quality, for example, by incorporating chain-of-thought reasoning or self-critique. We are also experimenting with ways to detect unknown risks and, inspired by Constitutional AI, aim to leverage models to identify potentially harmful content given high-level descriptions of what is considered harmful. These findings would then inform updates to existing content policies, or the development of policies on entirely new risk areas.

## Limitations

Judgments by language models are vulnerable to undesired biases that might have been introduced into the model during training. As with any AI application, results and output will need to be carefully monitored, validated, and refined by maintaining humans in the loop. By reducing human involvement in some parts of the moderation process that can be handled by language models, human resources can be more focused on addressing the complex edge cases most needed for policy refinement. As we continue to refine and develop this method, we remain committed to transparency and will continue to share our learnings and progress with the community.

## Authors

Lilian Weng, Vik Goel, Andrea Vallone

## Acknowledgments

Ian Kivlichan, CJ Weinmann, Jeff Belgum, Todor Markov, Dave Willner

## Related articles

[View all](http://openai.com/news/)

![Image 4: Jetbrains > Hero > Media item > Asset](https://images.ctfassets.net/kftzwdyauwt9/46d99f08-c849-4c73-5a6c7b83ea9c/6e0eaaaf815df2a53f997b36ce57ad13/jetbrains.png?w=3840&q=90&fm=webp)

[Embedding AI into developer software Mar 21, 2024](http://openai.com/index/jetbrains/)

![Image 5: Unload](https://images.ctfassets.net/kftzwdyauwt9/15d768b2-bd52-4e68-bebaf96d50b3/e3f414371811a69d73091cc36a44ce8f/holiday_extras.png?w=3840&q=90&fm=webp)

[Building a data-driven, efficient culture with AI Mar 18, 2024](http://openai.com/index/holiday-extras/)

![Image 6: Screenshot 2024 03 12 At 1128 27am](https://images.ctfassets.net/kftzwdyauwt9/e4cda57a-c977-4855-16b96e288c99/40db1a7d78522f9f9030942dd4a3e72b/superhuman.png?w=3840&q=90&fm=webp)

[Reimagining the email experience with AI Mar 18, 2024](http://openai.com/index/superhuman/)

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
*   [ChatGPT(opens in a new window)](https://chatgpt.com/?openaicom-did=61cc42d1-64fe-4852-a5eb-fd7b02e6ecc7&openaicom_referred=true)
*   [ChatGPT Business(opens in a new window)](https://chatgpt.com/business/?openaicom-did=61cc42d1-64fe-4852-a5eb-fd7b02e6ecc7&openaicom_referred=true)
*   [ChatGPT Enterprise(opens in a new window)](https://chatgpt.com/business/enterprise/?openaicom-did=61cc42d1-64fe-4852-a5eb-fd7b02e6ecc7&openaicom_referred=true)
*   [ChatGPT for Education(opens in a new window)](https://chatgpt.com/business/education/?openaicom-did=61cc42d1-64fe-4852-a5eb-fd7b02e6ecc7&openaicom_referred=true)
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
