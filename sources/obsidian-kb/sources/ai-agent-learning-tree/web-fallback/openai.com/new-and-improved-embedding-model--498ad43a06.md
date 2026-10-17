Title: New and improved embedding model

URL Source: http://openai.com/blog/new-and-improved-embedding-model

Markdown Content:
[Skip to main content](http://openai.com/blog/new-and-improved-embedding-model#main)

[](http://openai.com/)

*   [Research](http://openai.com/research/index/)
*   Products
*   [Business](http://openai.com/business/)
*   [Developers](http://openai.com/api/)
*   [Company](http://openai.com/about/)
*   [Foundation(opens in a new window)](https://openaifoundation.org/)

Log in[Try ChatGPT(opens in a new window)](https://chatgpt.com/?openaicom-did=5b3ff1f7-04ee-4d58-b9de-5d9dee51db59&openaicom_referred=true)

*   Research
*   Products
*   Business
*   Developers
*   Company
*   [Foundation(opens in a new window)](https://openaifoundation.org/)

New and improved embedding model | OpenAI

December 15, 2022

[Product](http://openai.com/news/product-releases/)

# New and improved embedding model

[Read documentation(opens in a new window)](https://beta.openai.com/docs/guides/embeddings)

![Image 1: A soft-focus landscape painting depicting a green foreground, a pastel pink and beige field, and distant hills beneath a bright pink and light blue sky.](https://images.ctfassets.net/kftzwdyauwt9/266Oz4WaWnYHxkErVdrfYD/a986d84d80b9d5a277732bb0aac706c9/new-and-improved-embedding-model.jpg?w=3840&q=90&fm=webp)

Listen to article 3:22

[Audio 2](http://openai.com/blog/new-and-improved-embedding-model)

Share

Model improvements

*   [Model improvements](http://openai.com/blog/new-and-improved-embedding-model#model-improvements)
*   [Limitations](http://openai.com/blog/new-and-improved-embedding-model#limitations)
*   [Examples of the embeddings API in action](http://openai.com/blog/new-and-improved-embedding-model#examples-of-the-embeddings-api-in-action)

*   [Model improvements](http://openai.com/blog/new-and-improved-embedding-model#model-improvements)
*   [Limitations](http://openai.com/blog/new-and-improved-embedding-model#limitations)
*   [Examples of the embeddings API in action](http://openai.com/blog/new-and-improved-embedding-model#examples-of-the-embeddings-api-in-action)

The new model, `text-embedding-ada-002`, replaces five separate models for text search, text similarity, and code search, and outperforms our previous most capable model, Davinci, at most tasks, while being priced 99.8% lower.

Embeddings are numerical representations of concepts converted to number sequences, which make it easy for computers to understand the relationships between those concepts. Since the[initial launch⁠](http://openai.com/index/introducing-text-and-code-embeddings/)of the OpenAI[/embeddings⁠(opens in a new window)](https://beta.openai.com/docs/api-reference/embeddings)endpoint, many applications have incorporated embeddings to personalize, recommend, and search content.

![Image 2](https://cdn.openai.com/new-and-improved-embedding-model/draft-20221214a/vectors-mobile-1.svg)![Image 3](https://cdn.openai.com/new-and-improved-embedding-model/draft-20221214a/vectors-1.svg)![Image 4](https://cdn.openai.com/new-and-improved-embedding-model/draft-20221214a/vectors-mobile-2.svg)![Image 5](https://cdn.openai.com/new-and-improved-embedding-model/draft-20221214a/vectors-2.svg)![Image 6](https://cdn.openai.com/new-and-improved-embedding-model/draft-20221214a/vectors-mobile-3.svg)![Image 7](https://cdn.openai.com/new-and-improved-embedding-model/draft-20221214a/vectors-3.svg)

You can query the[/embeddings⁠(opens in a new window)](https://beta.openai.com/docs/api-reference/embeddings)endpoint for the new model with two lines of code using our[OpenAI Python Library⁠(opens in a new window)](https://github.com/openai/openai-python), just like you could with previous models:

```python
import openai
response = openai.Embedding.create(
  input="porcine pals say",
  model="text-embedding-ada-002"
)
```
Print response

## Model improvements

**Stronger performance**.`text-embedding-ada-002`outperforms all the old embedding models on text search, code search, and sentence similarity tasks and gets comparable performance on text classification. For each task category, we evaluate the models on the datasets used in[old embeddings⁠(opens in a new window)](https://arxiv.org/abs/2201.10005).

Text search Code search Sentence similarity Text classification

Model Performance
**text-embedding-ada-002**53.3
text-search-davinci-*-001 52.8
text-search-curie-*-001 50.9
text-search-babbage-*-001 50.4
text-search-ada-*-001 49.0

Dataset: [BEIR](https://github.com/UKPLab/beir) (ArguAna, ClimateFEVER, DBPedia, FEVER, FiQA2018, HotpotQA, NFCorpus, QuoraRetrieval, SciFact, TRECCOVID, Touche2020)

**Unification of capabilities**. We have significantly simplified the interface of the[/embeddings⁠(opens in a new window)](https://beta.openai.com/docs/api-reference/embeddings)endpoint by merging the five separate models shown above (`text-similarity`,`text-search-query`,`text-search-doc`,`code-search-text`and`code-search-code`) into a single new model. This single representation performs better than our previous embedding models across a diverse set of text search, sentence similarity, and code search benchmarks.

**Longer context.**The context length of the new model is increased by a factor of four, from 2048 to 8192, making it more convenient to work with long documents.

**Smaller embedding size.**The new embeddings have only 1536 dimensions, one-eighth the size of`davinci-001`embeddings, making the new embeddings more cost effective in working with vector databases.

**Reduced price.**We have reduced the price of new embedding models by 90% compared to old models of the same size. The new model achieves better or similar performance as the old Davinci models at a 99.8% lower price.

Overall, the new embedding model is a much more powerful tool for natural language processing and code tasks. We are excited to see how our customers will use it to create even more capable applications in their respective fields.

## Limitations

The new`text-embedding-ada-002`model is not outperforming`text-similarity-davinci-001`on the SentEval linear probing classification benchmark. For tasks that require training a light-weighted linear layer on top of embedding vectors for classification prediction, we suggest comparing the new model to`text-similarity-davinci-001`and choosing whichever model gives optimal performance.

Check the[Limitations & Risks⁠(opens in a new window)](https://beta.openai.com/docs/guides/embeddings/limitations-risks)section in the embeddings documentation for general limitations of our embedding models.

## Examples of the embeddings API in action

[**Kalendar AI**⁠(opens in a new window)](https://kalendar.ai/)is a sales outreach product that uses embeddings to match the right sales pitch to the right customers out of a dataset containing 340M profiles. This automation relies on similarity between embeddings of customer profiles and sale pitches to rank up most suitable matches, eliminating 40–56% of unwanted targeting compared to their old approach.

[**Notion**⁠(opens in a new window)](https://www.notion.so/), the online workspace company, will use OpenAI’s new embeddings to improve Notion search beyond today’s keyword matching systems.

*   [Read documentation(opens in a new window)](https://beta.openai.com/docs/guides/embeddings)

*   [API Platform](http://openai.com/news/?tags=api-platform)
*   [2022](http://openai.com/news/?tags=2022)

## Authors

Ryan Greene, Ted Sanders, Lilian Weng, Arvind Neelakantan

## Related articles

[View all](http://openai.com/news/)

![Image 8: Newspartnership Cover](https://images.ctfassets.net/kftzwdyauwt9/ffffbd46-a171-41c5-25d9eec16b7d/bd1bc987f38b1c2901819b4c211886a2/NewsPartnership_Cover.png?w=3840&q=90&fm=webp)

[Global news partnerships: Le Monde and Prisa Media Company Mar 13, 2024](http://openai.com/index/global-news-partnerships-le-monde-and-prisa-media/)

![Image 9: News > Company carousel > Review completed > Media](https://images.ctfassets.net/kftzwdyauwt9/3BEH4mYgX0MXC45XOsbOru/fdcc0dadabd87f8e9a776a2f34647de0/37.png?w=3840&q=90&fm=webp)

[Review completed & Altman, Brockman to continue to lead OpenAI Company Mar 8, 2024](http://openai.com/index/review-completed-altman-brockman-to-continue-to-lead-openai/)

![Image 10: New board of directors](https://images.ctfassets.net/kftzwdyauwt9/5J9s3ItUUDOTebSo0ZVmun/642e8632be32866792c7aaae0113aaa5/44.png?w=3840&q=90&fm=webp)

[OpenAI announces new members to board of directors Company Mar 8, 2024](http://openai.com/index/openai-announces-new-members-to-board-of-directors/)

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
*   [ChatGPT(opens in a new window)](https://chatgpt.com/?openaicom-did=5b3ff1f7-04ee-4d58-b9de-5d9dee51db59&openaicom_referred=true)
*   [ChatGPT Business(opens in a new window)](https://chatgpt.com/business/?openaicom-did=5b3ff1f7-04ee-4d58-b9de-5d9dee51db59&openaicom_referred=true)
*   [ChatGPT Enterprise(opens in a new window)](https://chatgpt.com/business/enterprise/?openaicom-did=5b3ff1f7-04ee-4d58-b9de-5d9dee51db59&openaicom_referred=true)
*   [ChatGPT for Education(opens in a new window)](https://chatgpt.com/business/education/?openaicom-did=5b3ff1f7-04ee-4d58-b9de-5d9dee51db59&openaicom_referred=true)
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
