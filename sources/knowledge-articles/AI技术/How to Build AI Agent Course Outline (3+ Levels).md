# **“How to Build AI Agent” Course Outline (3+ Levels)**







## **Research Summary & Knowledge Map**







### **Core Concepts & Definitions**





- **AI Agent vs LLM vs RAG:** An **AI agent** is any AI-driven system that can **autonomously perceive, decide, and act** to achieve goals on a user’s behalf  . Unlike a standalone Large Language Model (LLM) which only generates text responses, or Retrieval-Augmented Generation (RAG) which simply fetches external info for the LLM, an AI agent **goes further by planning actions and executing them**. In essence: **LLMs** excel at generating text or code; **RAG** augments LLMs with factual retrieval; **AI agents** add **reasoning, tool use, and autonomy** to **take actions** (e.g. calling APIs, running code) towards a goal  . This autonomy means agents operate with minimal human intervention, persisting across steps and learning from outcomes. Traditional software “agents” were simply programs acting on user’s behalf (e.g. a script); modern AI agents leverage LLMs for flexible reasoning and are often called “**agentic AI**” for their goal-driven behavior  .

- **Different Perspectives on “Agent”:** In classic AI (Russell & Norvig), an *intelligent agent* perceives its environment and acts to maximize success; agents can be categorized as **reactive**, **deliberative**, or **hybrid**. **Reactive agents** act reflexively to stimuli (no planning or memory), like an antivirus that immediately reacts to a threat . **Deliberative agents** plan using internal models and past knowledge (like a digital assistant that reasons before responding) . **Hybrid agents** combine both (react to immediate inputs but also plan ahead)  . In the LLM era, these concepts manifest as simple rule-based tool callers vs. advanced agents with long-term memory and planning. Different research projects emphasize different aspects: e.g. *ReAct* defines an agent as an LLM that interleaves Chain-of-Thought reasoning with tool actions ; *Generative Agents* (Park et al. 2023) describe agents with rich memory and planning that **simulate human-like behavior** in a sandbox  . Overall, an **AI agent** can be seen as an **autonomous AI-driven software** with components for **goals, memory, planning, and tool integration** operating in a loop to accomplish tasks.

- **Typical Agent Architecture:** Across the literature, AI agents generally consist of the following **key components**  :

  **Goal/Instruction:** a high-level objective or task description that the agent strives to accomplish.

  **Reasoning Engine (LLM “brain”):** the core intelligence (often a large language model) that plans actions, generates intermediate thoughts, and makes decisions .

  **Planning Module:** breaks the goal into sub-tasks or decides on next steps; may use techniques like Chain-of-Thought or tree search to decide a sequence of actions .

  **Tools/Actions:** a set of external **capabilities** the agent can use – e.g. web search, APIs, code execution, databases. The agent decides **which tool to use and when**, often via function calling or special prompts  .

  **Perception/Observation:** the mechanism to receive feedback from actions (e.g. results from an API call, or environment state changes) so the agent can adjust its strategy .

  **Memory (State):** an internal knowledge base that **persists information**. This can be short-term (context window or working memory of recent steps) and long-term (vector database of past events or facts) to help the agent remember prior interactions or world knowledge  .

  **Reflection/Critic Module:** (optional) an evaluator that reviews the agent’s outputs or plans, providing feedback or self-correction signals (e.g. a “critic” prompting the LLM to fix errors)  .

  **Autonomy Loop:** a control loop that allows the agent to iterate: reason → act → observe → (update memory) → reason… until the goal is achieved or a stop condition. This loop enables **multi-step autonomy** beyond a single prompt-response. Multi-agent systems add another layer where multiple such agents communicate or coordinate.

- **Agent vs Tool vs Chain-of-Thought:** Early LLM applications used either **prompt chaining** (hard-coded multi-step workflows) or single-turn RAG. Agents differ by making **dynamic decisions**: they can decide *if, when,* and *which* tool to invoke, how to handle the result, and whether to continue or stop. The **ReAct** framework (Reason+Act) was a breakthrough that got LLMs to produce **interleaved thought and action** steps, rather than only a final answer . This yields a behavior like: *Thought:* “I need more info about X” → *Action:* “Search the web for X” → *Observation:* “Got results” → *Thought:* “Now I can answer”. ReAct agents essentially **merged chain-of-thought reasoning with tool use**  , overcoming limitations of pure CoT (which could hallucinate without external data). Today’s agents build on this: e.g. the *Toolformer* approach trains an LLM to insert API calls into its text when needed , and OpenAI’s function-calling API allows an LLM to decide to call a function (tool) during generation. Compared to a fixed pipeline, an agent’s flow is **dynamic** and can handle surprises (if one action yields an unexpected result, the agent can adapt its plan on the fly) .







### **Main Technical Approaches (“Tech Routes”)**





Over the past 2 years, several **main paradigms** have emerged for building AI agents:



- **ReAct Paradigm (Reasoning + Acting):** Uses the LLM’s chain-of-thought capabilities to guide action selection . A ReAct agent prints reasoning steps (e.g. “I should look up this detail…”) and action commands (e.g. “SEARCH(query)”) alternately. This synergy helps the agent **decompose problems and interface with tools** in a single loop . *Core idea:* the LLM “thinks out loud” and those thoughts determine the next action. ReAct was shown to significantly reduce hallucinations (by checking facts via tools) and handle interactive tasks better than plain CoT  . Many agent frameworks (LangChain’s agents, OpenAI function calling) use ReAct-style prompting under the hood.
- **RAG-Augmented Agents:** Agents that heavily leverage **Retrieval-Augmented Generation (RAG)** – integrating a vector database or search engine to fetch external knowledge. Here, the agent’s primary tool is a **knowledge retriever** (enterprise docs, web) to ground responses in facts  . Traditional RAG follows a simple query→retrieve→answer loop, which **lacks multi-step planning** . *Agentic RAG* extends this by allowing the agent to plan a sequence of retrievals or mix retrieval with other tools (for example, first fetch user profile, then use an API based on that). **Agent vs RAG:** RAG provides factual info but **cannot perform actions** or lengthy workflows by itself; an agent can incorporate RAG as one skill among many . In practice, RAG is often the memory system for an agent (knowledge base tool) or used for **long-term memory retrieval**.
- **Tool-Using Agents:** Emphasizes integration of various **APIs, functions, and software tools**. These agents focus on extending capabilities of LLMs by allowing them to invoke external functions (e.g. calculators, databases, web browsers, code interpreters). For instance, **Toolformer (Meta, 2023)** fine-tuned an LLM to **decide which API to call, when, and with what arguments**, inserting the result back into its text generation  . It achieved better accuracy on tasks like math and search by **outsourcing subtasks** to tools that are more reliable  . OpenAI’s Plugins and function calling, and frameworks like HuggingGPT, all fall in this category: the agent’s “action space” is a suite of tools. A key research direction is making tool-use more **autonomous and self-improving** (the agent learns when a tool was useful or if a tool failed, it tries alternatives). Tool-using agents are crucial for tasks requiring **world interaction** (browsing, transacting) or **calculation and coding** beyond the LLM’s training data.
- **Autonomous Task Agents (AutoGPT/BabyAGI style):** These emerged from the community as a way to let an agent **self-prompt in loops** towards an objective. For example, **AutoGPT (2023)** is an open-source project that wraps GPT-4 into an agent that can spawn new subtasks, call tools (web search, file I/O), and even create new agents to tackle subgoals . It was one of the first systems to show GPT-4 running “fully autonomously” to achieve a user-given goal, by iteratively critiquing its outputs and generating new prompts for itself . **BabyAGI (2023)** similarly demonstrated a “task list” agent: it keeps a list of tasks, completes them one by one, and dynamically adds or reprioritizes tasks based on intermediate results. These systems use minimal human input after kickoff – the agent generates its own next-step prompt. While exciting, they highlighted challenges: agents would often get stuck, loop indefinitely, or perform irrelevant actions (the infamous “coffee loop” cases), because pure LLM-driven planning can wander without constraints. Nonetheless, **AutoGPT and BabyAGI sparked huge interest** in autonomous agents and led to more robust successors (with better memory management, guardrails, etc.). They represent the “*Auto-agent*” route: *given an objective, the agent autonomously breaks it down and tries to accomplish it end-to-end*.
- **Multi-Agent Systems:** Instead of a single monolithic agent, this approach has **multiple agents with specialized roles** interacting. The simplest form is a **“chat” between two agents** (e.g. one as a “user” and one as an “assistant”) to reach a solution – the CAMEL framework demonstrated how two role-playing GPT agents can brainstorm and solve tasks together with minimal human input. More complex multi-agent systems involve an **organization of agents**: e.g. a Manager agent that delegates tasks to Worker agents (hierarchical model), or a peer-to-peer collaborative network where agents message each other freely (decentralized model). For example, **Microsoft Autogen (2023)** provides an infrastructure for spawning multiple agents (LLMs) that can communicate in either a **sequential pipeline, free group chat, or with a designated leader/manager**  . Another example, **MetaGPT (2023)**, coordinates agents in software engineering roles (PM, coder, tester) to collectively generate a software project. **OpenAI’s Swarm (2024)** is a lightweight framework for multi-agent orchestration where agents can **handoff tasks** to each other via function calls  . The benefit of multi-agent setups is to divide expertise (each agent can be prompted to have a distinct skill or persona) and achieve more complex workflows via collaboration. They also allow simulation of social dynamics or multi-party dialogue (e.g. generative agents simulating a town ). The challenge is managing the interactions – ensuring coherence, avoiding infinite loops of agents talking in circles, and scaling coordination as the number of agents grows. Techniques like shared memory (a common knowledge board) or protocols for turn-taking are used to impose order. Overall, multi-agent systems are a major research frontier, exploring emergent behaviors when multiple AI agents work together.
- **Self-Reflection and Memory-Augmented Planning:** A notable trend is adding mechanisms for agents to **reflect on their own performance and adjust**. For instance, **Reflexion (Shinn et al., 2023)** introduced a paradigm where an agent, after attempting a solution, can **critique itself in natural language and store that feedback**, then restart the task with that feedback considered  . This led to significant improvements in success rates on complex reasoning tasks. Similarly, “Tree-of-Thoughts” (Yao et al., 2023) allows an agent to **explore multiple reasoning branches** and backtrack when one path seems unpromising  – essentially giving the agent a way to *plan and reflect in a search tree* rather than a single chain-of-thought. These approaches recognize that naive LLM agents can be overconfident or get stuck, so adding a **feedback loop** (either explicitly via a critic model or implicitly via prompting the model to reconsider) yields more robust agents. Many frameworks now incorporate a *critic* or *evaluator* that monitors the main agent’s actions. Memory systems also play into this: Agents with a long-term memory store can remember past failures or successes and alter their strategy (e.g. an agent might recall “I already tried that API and it gave an error” and avoid it next time). In summary, beyond the basic perception-planning-action loop, cutting-edge agents have **meta-cognitive loops**: they **monitor, evaluate, and refine** their own behavior.







### **Representative Papers & Reports (Key Breakthroughs)**





Below is a selection of 10 influential papers/tech reports in the AI agent domain, with their year and a one-line contribution:



1. **ReAct: Synergizing Reasoning and Acting in Language Models (2022)** – *Shunyu Yao et al.* – Introduced the ReAct framework where an LLM generates interleaved **chain-of-thought and action outputs**, enabling it to **use tools mid-thought to reduce hallucination and solve decision-making tasks**  .
2. **Toolformer: Language Models Can Teach Themselves to Use Tools (2023)** – *Timo Schick et al. (Meta AI)* – Demonstrated a method to **fine-tune an LLM to decide when and how to call external APIs (calculator, search, etc.) on its own**, greatly improving performance on tasks by augmenting the LLM with tool results  .
3. **HuggingGPT: Solving AI Tasks with ChatGPT and its Friends in HuggingFace (2023)** – *Yongliang Shen et al. (Microsoft)* – Proposed an LLM-driven “**AI orchestrator**” that uses ChatGPT as a controller to **route tasks to specialist models** (e.g. vision or speech models from HuggingFace) and then integrate their outputs, pioneering a way to tackle complex multi-modal tasks by **combining multiple AI systems via an LLM**  .
4. **AutoGPT (Open-Source Project by Toran Bruce Richards, 2023)** – *No formal paper; significant GitHub project* – First widely popular example of a “**fully autonomous GPT-4 agent**” that loops on itself: it can **create new sub-goals, call tools (web search, file I/O), and generate new prompts for itself** towards an objective, showcasing both the potential and challenges of letting an LLM run continuously without human intervention  .
5. **BabyAGI (Open-Source Project by Yohei Nakajima, 2023)** – *No formal paper* – Proposed a simple task management agent that uses an LLM to **dynamically create, prioritize, and execute a list of tasks** towards a high-level goal. It introduced the idea of an “AI CEO” that can delegate to itself, inspiring many variations of task-driven autonomous agents.
6. **Generative Agents: Interactive Simulacra of Human Behavior (2023)** – *Joon Sung Park et al. (Stanford)* – Showcased a remarkable simulation where **25 AI agents with long-term memory and daily planners lived out believable human-like routines in a sandbox town** (à la *The Sims*), demonstrating how adding memory, reflection, and social interaction allows agents to exhibit **emergent social behaviors (forming friendships, scheduling parties)** autonomously  .
7. **Voyager: An Open-Ended Embodied Agent with LLMs (2023)** – *Guanzhi Wang et al. (Microsoft)* – Presented the first LLM-powered **embodied lifelong learning agent** in the game Minecraft. Voyager uses GPT-4 to **continually explore an open world, invent its own goals, write code to enact plans, and learn from failures**, resulting in an agent that **learns new skills autonomously over hundreds of game iterations** .
8. **Reflexion: An Autonomous Agent with Dynamic Memory and Self-Reflection (2023)** – *Noah Shinn et al.* – Introduced a framework where after each trial, the agent **stores a self-evaluation (“reflection”) in memory and uses it to improve subsequent attempts**, effectively doing gradient-free reinforcement learning via natural language feedback. This significantly increased success rates on reasoning tasks by enabling the agent to **learn from its mistakes using language**  .
9. **Tree-of-Thought: Deliberate Problem Solving with Large Language Models (2023)** – *Shunyu Yao et al.* – Generalized the chain-of-thought approach into a **search tree**, allowing an agent to **branch into multiple reasoning paths, explore alternatives, and backtrack** if needed. This approach helped solve complex puzzles and planning problems by imitating how humans consider different approaches, achieving higher success by not committing to the first idea that comes to mind.
10. **OpenAI “Swarm” Framework (2024)** – *OpenAI (open-source release)* – An experimental framework for **ergonomic multi-agent orchestration** where agents define *handoff functions* to pass tasks amongst each other . It introduced a lightweight way to connect agents such that one agent can delegate or trigger another via a function call, illustrating a design for scalable **swarm intelligence** with LLM agents working in tandem (e.g. a “Planner” agent handing off a coding task to a “Coder” agent).





*(Many other notable works exist — e.g.* ***HuggingGPT\****,* ***GPT-4 Tools/Plug-ins\****,* ***IBM Agentosphere (A2A, MCP protocols)\****,* ***Meta’s CICERO (game-playing negotiation agent)\*** *— but the above list captures a broad range of breakthroughs relevant to building AI agents.)*





### **Ecosystem: Frameworks, Libraries, and Platforms**





Dozens of open-source frameworks and platforms have emerged to make building AI agents easier. Here we categorize them into **(a) Developer Frameworks**, **(b) Agent Platforms**, and **(c) End-User Products**, and list some leading projects in each:



- **Developer Frameworks & Libraries (Open-Source):** These are toolkits for programmers to create and orchestrate agents, often providing abstractions for LLMs, tools, memory, etc.:

  

  - **LangChain** – 【GitHub: langchain-ai/langchain】 The most popular framework for composing LLM “chains” and agents. It provides out-of-the-box implementations of ReAct agents, tool integration, memory, and simplifies the creation of complex prompt flows. *Feature:* huge toolkit of connectors to APIs and prompt templates; often the starting point for building an agent quickly.
  - **LangGraph** – 【GitHub: langchain-ai/langgraph】 A framework from the LangChain team to build **agents as graphs**. It allows developers to define agent workflows as nodes/edges (states and transitions), enabling **cyclic, long-running, and stateful** agent behaviors (agents that can maintain state across calls). *Feature:* Emphasizes robust control flow (loops, conditionals) in agent design for resilience .
  - **Microsoft Autogen** – 【GitHub: microsoft/autogen】 A library by Microsoft for **orchestrating multiple agents** (and human) in conversations. It provides high-level classes for different agent types (e.g. a “Coordinator” vs “Worker” agent) and supports **multi-agent communication patterns** like broadcast (group chat) or hierarchy. *Feature:* Integration with Azure OpenAI and the ability to easily spin up a swarm of chat agents that can solve tasks collaboratively.
  - **OpenAI Swarm** – 【GitHub: openai/swarm】 An educational multi-agent orchestration framework (from OpenAI’s Solutions team) focusing on simplicity. Agents are defined with **instructions, tools, and handoff routes** – e.g. Agent A can handoff to Agent B via a special tool call . *Feature:* Minimal overhead to set up a multi-agent system, showing how GPT-4 instances can pass tasks among themselves through LLM-mediated function calls.
  - **CrewAI** – 【GitHub: crewAIInc/crewAI】 A fast Python framework built from scratch (independent of LangChain) for **role-based multi-agent teams**. It allows defining “Crews” of agents with different roles and coordinating them via an event-driven flow. *Feature:* Highly optimized for speed and offers low-level control; suitable for enterprise automation with many agents. (CrewAI highlights support for observability and complex workflows, and has a growing community) .
  - **LlamaIndex (formerly GPT Index)** – 【GitHub: run-llama/llama_index】 Initially a library for connecting LLMs with external data (documents, databases) via indices, it expanded to support **LlamaAgents**, enabling **knowledge-driven agents**. *Feature:* Simplifies building agents that can do advanced data retrieval and reasoning over private data; provides structured interfaces to your data (e.g. SQL agent that can converse with a database).
  - **HuggingGPT (Implementation)** – 【GitHub: microsoft/JARVIS】 (Unofficially called “JARVIS” in the project) – Microsoft’s sample project demonstrating HuggingGPT, where an LLM orchestrates HuggingFace models. *Feature:* Multi-modal agent capabilities – e.g. solving a task that requires image recognition + text, by automatically selecting the appropriate model for each subtask  .
  - **AutoGPT & BabyAGI Implementations** – 【GitHub: Significant-Gravitas/AutoGPT】【GitHub: yoheinakajima/babyagi】 – Open-source agent executors that anyone can run. AutoGPT provides a general framework for goal-driven agents with plugins (tools) and continuous looping; BabyAGI provides a simple task list manager. *Feature:* Large community and many forks; great for experimenting with autonomous agent behavior.
  - **AgentVerse** – 【GitHub: THUDM/AgentVerse】 A research framework (with arXiv paper) focusing on **multi-agent collaboration and simulation**. It supports creating groups of agents that can dynamically form teams, with a modular approach to communication and coordination strategies. *Feature:* Built by researchers (Tsinghua University) to study emergent behaviors in cooperating agents; useful for simulations or multi-agent research.
  - **MetaGPT** – 【GitHub: GAIR-NLP/MetaGPT】 Not to be confused with Meta AI, this open-source project organizes multiple GPT agents to mimic a software engineering team (PM, Architect, Engineer, QA). *Feature:* Showcases a template for complex workflows where each agent has specialized expertise and the system can tackle a project (like building a simple app) through their collaboration. It sparked interest in structured multi-agent role-play for complex tasks.

  

  *(Other notable mentions:* ***Stanford’s ChemIST\*** *for scientific agents,* ***Voyager’s code\*** *for lifelong learning,* ***Dust\*** *and* ***Haystack\*** *for agent toolchains, etc., are also part of the ecosystem.)*

- **Agent Platforms & Cloud Services:** These are platforms (often no-code or low-code) that allow developers or non-experts to deploy and manage agents at scale, often with enterprise integration:

  

  - **dify** – 【Website: dify.ai】【GitHub】 An open-source platform to build, customize, and deploy AI agents (and chatbots) with a visual interface. It provides a sandbox to configure prompts, tools, and data sources, so you can create an agent for your app without coding everything from scratch.
  - **LangFlow** – 【GitHub: logspace-ai/langflow】 A visual UI for LangChain, enabling users to **drag-and-drop components** (LLMs, tools, logical controls) to design agent workflows. Useful for rapid prototyping of chain-of-thought and tool interactions in a flowchart style.
  - **Beam AI** – *Proprietary Platform* – A leading “Agentic Process Automation” platform used by enterprises . It allows companies to “hire” AI agents to run operations. Beam provides templates for common business workflows (e.g. an Accounts Receivable agent, an HR onboarding agent) and an Agent OS to deploy reliable multi-agent systems with monitoring. *Feature:* Focus on enterprise needs – reliability, security, integration with internal systems – enabling businesses to automate back-office processes with **self-evolving agents**  .
  - **IBM watsonx Orchestrate** – *Proprietary (IBM)* – A platform (part of IBM watsonx) that lets business users create AI agents to handle tasks like scheduling meetings, retrieving enterprise data, sending emails, etc. It uses a library of pre-built skills and an orchestration engine to chain them. Emphasizes a *low-code approach* to AI workflow automation, integrating with corporate software (Salesforce, SAP, etc.).
  - **Salesforce Agentforce** – *Proprietary (Salesforce)* – A recently announced Salesforce platform for building and deploying AI agents within the Customer 360 ecosystem  . It enables businesses to create agents for sales, service, marketing that work alongside humans (e.g. an agent that assists a support rep by autonomously handling routine Tier-1 questions). Focus is on tight integration with Salesforce data and workflows, plus governance (human approval steps, etc.).
  - **OpenAI “Function Calling” + Tools Ecosystem** – (API + third-party plugins) While not a traditional platform, OpenAI’s function calling feature (June 2023) has led to a broad ecosystem of plugins and integrations. Platforms like Zapier, Slack, Notion integrated OpenAI-powered agents that can perform actions (e.g. a Slack bot that schedules meetings via Google Calendar when told). Many SaaS products now offer an “AI Agent” powered by OpenAI under the hood.

  

- **Notable Agent Products (End-User-Facing):** These are AI agent applications or services aimed at end users or specific domains, showcasing what agents can do in practice:

  

  - **Manus** – *General-Purpose AI Agent* – A cloud-based “AI executive assistant” that can execute complex tasks autonomously. Manus distinguishes itself from a chatbot by not just chatting but delivering results: it can take a goal like “Research and prepare a slide deck on topic X” and then go off to use tools (browser, document creator) to produce the output. It runs asynchronously in the cloud, so you don’t have to babysit it  . *Feature:* Emphasis on **context engineering** to keep the agent focused, and safety mechanisms while it runs without human intervention  .
  - **Adept’s ACT-1** – *AI Assistant for Software* – (Adept AI is a startup) ACT-1 is a vision-language agent that can **control existing software via the GUI** (like a human would). In demos, it can take actions like clicking buttons, entering text, and navigating web apps to complete tasks (e.g. book a flight or generate a sales report in Salesforce) purely from a high-level instruction. *Feature:* Uses computer vision to “see” the state of the app and a learned policy to decide actions, effectively turning any software UI into the agent’s action space.
  - **AWS CodeWhisperer & “Frontier Agents”** – *DevOps and Coding Agents* – Amazon is incorporating agentic AI into developer tools. For example, AWS’s *Kiro* (announced 2025) is an “agentic IDE” that can handle tasks like refactoring code across multiple repositories autonomously  . AWS also introduced an *Always-on DevOps Agent* for incident response, and a *Security Agent* for code scanning  . These agents continuously run in the background of software projects, proactively managing routine developer operations (with guardrails like sandboxed execution and required human code review to maintain trust  ).
  - **AgentGPT (web app)** – An easy UI where users can configure and launch an **AutoGPT-style agent** in their browser. It gained popularity by allowing people to witness an autonomous agent “thinking” through a goal step by step via a chat-like interface (it would show its scratchpad and chosen actions in real time). While more a demo than a robust product, it educated many about how these agents operate.
  - **Domain-Specific Agents:** e.g. **Educational tutors** (like a math tutor agent that can use tools to create and grade exercises), **Financial research agents** (that autonomously gather market data and draft analyses), **Game agents** (AI players or NPCs that behave human-like, as in generative agents in virtual worlds). These are usually built on top of the frameworks above for specific use-cases. For instance, an **AI Sales Coach agent** might live in a CRM, automatically researching prospects and drafting personalized outreach emails (there are startups doing exactly this).

  







### **Industry Applications & Use Cases**





AI agents have begun to find applications across many industries, automating or assisting in complex workflows:



- **Software Development & DevOps:** Agents can act as **Coding Assistants** (writing code modules, generating unit tests, submitting pull requests) and **DevOps Sentries** (monitoring systems, diagnosing incidents, applying fixes). For example, an agent can automatically handle a continuous integration pipeline – if a build fails, it identifies the error, attempts a fix, opens a PR, and notifies the team  . This reduces toil for engineers and speeds up development, though oversight is needed to ensure the agent’s code changes are correct  .
- **Business Operations (RPA 2.0):** In operations and admin, AI agents can replace a lot of routine human work: processing invoices, updating records, scheduling, data entry, basic customer outreach. Unlike traditional RPA (robotic process automation) that was rule-based, agents bring flexibility – e.g. a procurement agent that can receive an email request and navigate a purchasing system to place an order, handling exceptions via reasoning if a price changed or an item is out of stock. Enterprise platforms like Beam AI bundle many such **process agents** (for HR onboarding, finance compliance, etc.)  .
- **Customer Service & Support:** Beyond static chatbots, **AI support agents** can troubleshoot issues and take actions. For instance, a tech support agent could guide a user through complex setup by fetching knowledge base articles (RAG) and even performing diagnostics by calling backend APIs. On the business side, AI agents assist human support reps by auto-filling case details, suggesting responses, or even autonomously resolving simple tickets (e.g. refund processing). Zendesk’s AI bots or Salesforce’s Agentforce solutions aim to blend **human + AI agent** teams in contact centers, where AI handles the repetitive cases and humans handle the rest.
- **Education and Training:** **Tutor agents** can adapt to student needs, provide multi-step guidance in problem solving (using tools like calculators or simulators as needed), and even grade or give feedback on answers. Unlike rigid learning software, an agent tutor can dynamically figure out what concept a student is stuck on (via reasoning on the dialogue) and then deploy a different teaching strategy or fetch a better explanation from the web. There are also **content generation agents** for educators – automatically creating quizzes, flashcards, or lesson plans tailored to a curriculum (saving teachers time).
- **Finance & Trading:** AI agents are being explored for automating financial analyses – e.g. a “market research agent” that pulls data from financial APIs, news sources, and databases to write a stock analyst report complete with charts (tools: web scraping, Excel API, etc.). In trading, fully autonomous agents that execute trades based on objectives are more constrained due to risk, but semi-autonomous **portfolio assistants** exist (they rebalance portfolios or scan for opportunities and present rationale to humans). In banking, an agent could handle parts of loan processing or compliance (collecting documents, checking against regulations).
- **Scientific Research & Data Analysis:** Researchers have begun using agents to automate parts of literature review (an agent that reads dozens of papers and summarizes findings on a topic, citing sources), or to manage experiments (e.g. determining the next experimental condition based on previous results – a form of scientific “active agent”). In data science, an agent might take a data query goal (“find factors affecting sales drop”) and then proceed to run SQL queries, generate charts, and even do a statistical test by calling Python libraries – essentially acting as a junior data analyst.
- **Enterprise Knowledge Management:** Many companies deploy internal **knowledge worker agents** – for example, an agent that observes all the documents and communications in a company and can answer employees’ questions, or even proactively brief a team on important updates (“Friday evening, the agent sends each team member a custom summary of relevant project news it gathered from Slack, emails, JIRA, etc.”). These agents combine RAG for internal docs with agentic planning to tailor information delivery to each user.
- **Automation in Operations & IoT:** Agents can interface with IoT devices or backend systems to automate physical-world tasks. For instance, in IT operations, an agent could detect an anomaly in server metrics and then execute a runbook: it might scale up resources, restart a service, or notify the on-call – effectively an **autonomous system administrator**. In manufacturing, an agent might coordinate robots: receiving high-level production goals and orchestrating multiple machines’ schedules (multi-agent planning in an industrial setting).





In general, any domain that has **routine, well-defined processes or a need for 24/7 monitoring/response** is a candidate for AI agents. Early adopters are seeing efficiency gains (automation of tedious tasks) but also encountering challenges like the need for oversight and the difficulty of trust – hence many deployments keep a “human in the loop” for now.





### **Knowledge Tree / Capability Map**





To design a comprehensive course, we envision the body of knowledge as a **stack of layers**, from foundational concepts up to real-world production systems:



- **Foundation (Bottom Layer):** **Large Language Models, Embeddings, and Tools.** This is the base upon which agents are built. One must understand how LLMs work (transformer architecture, tokenization, model capabilities and limits), how they represent knowledge (embeddings in vector space), and how they can be extended (prompt engineering, fine-tuning, retrieval augmentation, function calling). This layer also includes basics of tool integration – how an LLM’s text output can be interpreted as an action (be it a JSON function call or code to execute). It’s the “fuel and engine” of our agents. Without a solid grasp here, one cannot effectively construct or tune an AI agent.
- **Core Agent Design (Middle Layer):** **Single-Agent Architecture, Memory, Planning, Multi-Agent Coordination.** Building on the foundation, this layer covers the patterns and components of agent systems. It spans the design of a single autonomous agent (how to do planning, incorporate feedback loops, design short-term vs. long-term memory, ensure the agent doesn’t go off-track) and extends to multi-agent systems (communication protocols, task allocation among agents, emergent dynamics). Here we also place various **agent reasoning strategies** (ReAct prompting, CoT vs ToT, self-reflection) and **architectural patterns** (e.g. Planner-Executor separation, or Critic models) that serve as reusable blueprints. By the end of this layer, one should be able to conceptualize and prototype an agent for a given task, and understand how to make multiple agents work together.
- **Application & Engineering (Top Layer):** **Building Deployable Systems, Integration & Productization, Use-Case Specialization.** The top layer is about taking agents out of the lab and into the real world. This includes engineering concerns: choosing the right model (open-source vs API, cost considerations), ensuring reliability (handling errors, fallbacks to human, monitoring agent actions), deploying on infrastructure (latency, scaling for many concurrent agents), and implementing safeguards (security, ethical guardrails). It also involves adapting agents to specific **business scenarios** – how to gather requirements for an AI agent product, how to evaluate it (what’s the success metric for an “AI sales assistant”?), and how to iterate with user feedback. Essentially, it’s about bridging the gap from prototype to a **production-ready agent** that delivers value in an industry setting. This layer completes the skillset by focusing on practicality: not just can we build an agent that *works*, but can we build an agent that is *useful and usable* in context (with a UI, with analytics, etc.), and understand the **business model** around it (cost of running it vs. ROI).





With these layers in mind, the course modules will proceed from fundamentals up through advanced topics, mirroring this bottom-to-top progression. The aim is to ensure a **theory→technique→engineering→product** progression – learners start with core concepts, apply them in increasingly complex projects, and finally understand how to deploy agents that solve real problems. The following outline reflects this structure, with modules covering theory and technical foundations first, then moving into hands-on building and finally into product and capstone work.



------





## **Module 1: AI Agent Core Theory and Evolution**





- **学习目标 (Learning Objectives):** Understand what AI agents are and how they differ from standard chatbots or retrieval QA systems. Learn the key components that make up an agent and trace the historical development from simple bots to autonomous agents. Grasp the taxonomy of agent types and the state-of-the-art paradigms (ReAct, etc.).
- **预期产出 (Expected Outcomes):** Ability to articulate the definition of an AI agent in various contexts; compare different agent frameworks conceptually. A written summary (or concept map) of major agent architectures and a timeline of important milestones in agent research.
- **推荐技术栈 / 工具 (Recommended Tech Stack/Tools):** No coding in this module (focus is theoretical), but recommend reading material on ReAct (original paper) , OpenAI function calling docs, and perhaps small demos in an environment like OpenAI Playground to illustrate reasoning vs acting. Tools: Excalidraw or similar for drawing agent component diagrams; citation tools (Scholar) for reading papers.







### **1.1 Key Concepts and Definitions**







#### **1.1.1 What is an AI Agent?**

####  **– Definition and discussion of agents, including the difference between** 

#### **LLM, Chatbot, RAG system, and Agent**

####  

#### 

####  

#### 

#### **. Present the** 

#### **perception-cognition-action loop**

####  **and explain autonomy (proactiveness) vs. reactiveness. Cover Russell & Norvig’s agent definition briefly and map it to LLM-based agents.**





#### **1.1.2 Agent Components**

####  **– Detailed walkthrough of** 

#### **Goal, Environment, Sensors/Perception, Effectors/Actions, Memory, and Learning**

#### **. Introduce the typical** 

#### **“Planner-Controller-Execution”**

####  **breakdown: e.g.** 

#### **Planner (LLM reasoning engine) + Tool Executor + Memory module + Critic**

####  **in many frameworks** 

#### 

#### **. Use a diagram to show how a user prompt goes into an agent “brain”, which may query memory or decide to use a tool, then observe result, etc. Emphasize how this is more complex than a single-turn chat.**





#### **1.1.3 实操练习 / Mini Project – Thought vs. Action**

#### **: Using an OpenAI API (or the playground), have students craft a simple ReAct prompt. For instance, prompt GPT-4 with a basic ReAct format to solve a factual query (“Who is the current president of France? Show reasoning.”) vs. just asking directly. Observe how it outputs reasoning steps and a search action. This exercise solidifies the idea of an agent’s thought/action process.** 

#### **(No coding required beyond writing prompts; use any LLM with a ReAct template.)**





### **1.2 Evolution of AI Agents**







#### **1.2.1 From Chatbots to Agents**

####  **– A brief history: early chatbots (Eliza) with scripted responses, to retrieval-based QA systems, to the advent of** 

#### **Chain-of-Thought prompting**

####  **(when LLMs started reasoning), then Tool use (WebGPT using browsers, 2021), then the explosion of autonomous agents in 2023. Highlight the shift from single-turn Q&A to multi-turn task completion. Use a timeline including:** 

#### **Eliza (1960s)**

####  **→** 

#### **rule-based bots (1990s)**

####  **→** 

#### **seq2seq chatbots (2016)**

####  **→** 

#### **LLMs (2020)**

####  **→** 

#### **CoT (2022)**

####  **→** 

#### **ReAct & tools (2022)**

####  **→** 

#### **AutoGPT (2023)**

####  **→** 

#### **Generative Agents (2023)**

#### **.**





#### **1.2.2 Landmark Papers & Frameworks**

####  **– Discuss 3–4 seminal works in context. For example,** 

#### **ReAct (2022)**

####  **as turning point (LLMs that think and act)** 

#### 

#### **,** 

#### **AutoGPT/BabyAGI (early 2023)**

####  **as sparking public interest in full autonomy,** 

#### **Generative Agents (2023)**

####  **showing long-term autonomy, and perhaps** 

#### **OpenAI’s Function Calling & Plugins**

####  **bringing agents into mainstream platforms. Also mention frameworks: LangChain’s rise in 2023 enabling many hobbyist agents, etc.**





#### **1.2.3 实操练习 – Reading & Presentation**

#### **: Students pick one seminal paper (from a provided list of 5) and read it in depth (e.g. ReAct, Generative Agents, Toolformer, etc.). They then create a one-slide summary of its core contribution and present how that idea could be used in an agent. This improves literature review skills and situates our work in a research context.**





### **1.3 Agent Taxonomies and Classifications**







#### **1.3.1 Types of Agents**

####  **– Present various classification schemes:** 

#### **Reactive vs Deliberative vs Hybrid agents**  

####  **(from classical AI),** 

#### **Single vs Multi-agent**

####  **(an agent working alone vs in a society of agents),** 

#### **Autonomous vs Human-in-the-loop**

####  **(fully automated versus decision support agents). Also, categorize by purpose: task-specific agents vs general problem solvers, and by lifespan: ephemeral agents (spawn for one task and die) vs persistent agents (long-running persona).**





#### **1.3.2 Roles in Multi-Agent Systems**

####  **– Define common roles like** 

#### **Manager/Planner**

####  **agent,** 

#### **Worker**

####  **agents,** 

#### **Evaluator**

####  **or** 

#### **Critic**

####  **agent. E.g. in AutoGen or certain frameworks, one agent might just coordinate others. Also, cover communication patterns: broadcasting vs one-to-one messaging, central vs distributed control. Use simple examples (like a manager agent that delegates a coding task to a coder agent and a tester agent).**





#### **1.3.3 实操练习 – Agent Role Play Simulation**

#### **: In a classroom or Slack channel, do a** 

#### **role-play**

####  **where each student simulates an “agent” with a specific role (one as Planner, one as a Knowledge Base, one as a Doer, etc.) and they must collectively solve a task (e.g. answer a complex question or plan an event). This human simulation of multi-agent collaboration helps illustrate challenges like coordination and misunderstandings, which can then be tied back to how AI multi-agents need protocols.**





## **Module 2: LLM Fundamentals and Knowledge Base for Agents**





- **学习目标:** Build a strong understanding of the Large Language Models underpinning AI agents. Cover how transformers work at a high level, tokenization, embeddings, and how LLMs can be guided via prompting. Also learn about model fine-tuning, alignment (RLHF), and limitations (like hallucination). This provides the “brain power” insight for the agent.
- **预期产出:** Students will be able to explain how an LLM generates text and what influences its outputs. They will know how to choose a model for an agent (size, cost, latency considerations) and how to mitigate model weaknesses (e.g. use RAG to compensate for knowledge cutoff). Deliverables include a short report comparing two candidate models for a given agent project (e.g. GPT-4 vs an open-source Llama2 for a customer service agent).
- **推荐技术栈:** Python, with libraries such as HuggingFace Transformers for experimentation. Open-source models like GPT-NeoX or Llama 2 for hands-on (to avoid cost), and OpenAI API for demonstration of a state-of-the-art model. Tools: HuggingFace Inference API, text-generation-webui for local model tests, sentence-transformers for embeddings.







### **2.1 Transformer Models and Capabilities**







#### **2.1.1 Transformer 101**

####  **– High-level overview of how transformers work (no heavy math): tokens, self-attention mechanism, how the model “predicts next word”. Explain concepts of model size (parameters), training (predicting next token on huge text corpora). Emphasize emergent capabilities of large models (few-shot learning, reasoning) – e.g. why GPT-3 (2020) was groundbreaking.**





#### **2.1.2 Prompting and Conditioning**

####  **– How input prompts steer output. Introduce ideas of** 

#### **system vs user prompts**

#### **, few-shot examples, and how** 

#### **chain-of-thought prompting**

####  **can elicit reasoning. Perhaps demonstrate with a smaller model: show prompt vs output examples (e.g. normal prompt vs prompt with “let’s think step by step”). This is crucial for agent design since prompt engineering is how we imbue the agent with behavior.**





#### **2.1.3 Model Strengths & Weaknesses**

####  **– Discuss what LLMs are good at (language, basic reasoning, knowledge up to training data) and not good at (reliable computation, very current info, following long chains of logic without error). Cover** 

#### **hallucination**

####  **phenomenon (and why grounding with tools or data is needed)** 

#### 

####  

#### 

#### **. Also mention bias and toxicity issues (which later tie into guardrails in Module 4/5).**





#### **2.1.4 实操练习 – Prompt Experiment:**

####  **Using a chosen model (e.g. a 7B parameter model locally or OpenAI’s API), students will try to prompt it to do a multi-step task (like a simple riddle or math problem) and observe failure. Then apply a chain-of-thought prompt like “Let’s think step by step” or provide an example reasoning, and see the improvement. This hands-on shows the impact of prompting on LLM performance, motivating tool use next.**





### **2.2 Knowledge Augmentation (Embeddings & RAG)**







#### **2.2.1 Embeddings and Vector Search**

####  **– Explain how text can be converted to vectors (embeddings) and how similarity search works. This is core to how agents** 

#### **remember or look up knowledge**

#### **. Show a small example: embedding two sentences and computing cosine similarity. Intuition of what the embedding space represents (semantic closeness).**





#### **2.2.2 Retrieval-Augmented Generation (RAG)**

####  **– Describe the RAG pipeline: user query → embed → similarity search in a knowledge base → retrieved context + query → LLM generates answer** 

#### 

####  

#### 

#### **. Emphasize how this reduces hallucination by grounding answers in retrieved text** 

#### 

#### **. This is essentially how an agent can have an extended knowledge beyond its parametric memory. Cover vector database tools (FAISS, Pinecone, etc.).**





#### **2.2.3 Integrating RAG into Agents**

####  **– Connect RAG to the agent concept: an agent may use a “Search tool” or “Docs tool” which under the hood does RAG. Discuss patterns like the ReAct+Wiki approach (where the agent uses a wiki browser to fetch info mid-thought)** 

#### 

#### **. Also caution: RAG alone doesn’t do multi-step planning** 

#### 

####  **– that’s why we wrap it in an agent loop.**





#### **2.2.4 实操练习 – Build a Mini-QA Agent:**

####  **Provide students with a small document corpus (say, a few wiki articles). Have them use an embedding-based search (e.g. via Haystack or simple FAISS) to answer a question by retrieving relevant text and feeding it to an LLM. They can do this in a notebook, effectively implementing a basic RAG system. Then frame it as an agent: the “action” is retrieve, the observation is text, the final is answer. This coding exercise cements understanding of how agents leverage external knowledge.**





### **2.3 Model Fine-tuning and Alignment**







#### **2.3.1 Fine-tuning vs Prompting**

####  **– Explain the difference between pre-training, supervised fine-tuning (e.g. instruction tuning), and reinforcement learning (RLHF). For instance, how GPT-3 became InstructGPT and then ChatGPT through these processes. This matters when choosing or customizing a model for an agent (maybe you fine-tune a smaller model on domain instructions).**





#### **2.3.2 Aligning Model Behavior**

####  **– Introduce the concept of alignment: making the model follow instructions and ethical guidelines (the RLHF process that gave us helpful and harmless models). Also mention RLAIF (AI feedback) briefly as it’s emerging. Tie this to agents: an agent might need alignment to not produce harmful actions or to ask for help when stuck (some frameworks include a “when to stop” condition to avoid infinite loops).**





#### **2.3.3 Model Selection for Agents**

####  **– Discuss considerations in choosing a model: OpenAI GPT-4 vs open source (Llama 2, etc.) in terms of capability, cost, latency. Cover token context window as a factor (agents can blow past context limits with lots of steps). Discuss using smaller on-prem models for privacy vs using an API. This sets up for Module 5 where students will pick a model for their project.**





#### **2.3.4 实操练习 – Fine-tune a Toy Model:**

####  **Using a small model (like distilgpt2 or Llama 2 7B on a subset), demonstrate fine-tuning on a simple domain (e.g. Q&A pairs about a specific topic). While full fine-tuning might be too slow, students can do a mock (or at least watch a walkthrough) and then test the model’s new behavior. Alternatively, do a** 

#### **LoRA**

####  **adapter fine-tune for an open-source model on an instruction dataset. This shows how one can customize model behavior beyond prompts – useful if they ever need to specialize an agent’s LLM.**





## **Module 3: AI Agent Architecture & Design Patterns**





- **学习目标:** Dive into the structural design of agents. Students will learn proven architectural patterns for single-agent systems (like ReAct loop, planner-executor separation) and for multi-agent systems (architectures like Supervisor-Worker, or ecosystems like AutoGen’s roles). They will also learn about designing an agent’s memory (short vs long-term) and how to incorporate tool usage formally (function calling, etc.). By the end, they should be able to blueprint an agent for a given task, including deciding how it breaks tasks down and how multiple agents might interact.
- **预期产出:** A set of design diagram sketches for different agent patterns (e.g. a flowchart of a single agent loop with reflection, a diagram of a multi-agent system with roles). Additionally, a written plan for an agent they intend to build (as a mini-proposal, describing how it would function internally). This sets the stage for implementation in Module 5.
- **推荐技术栈:** UML or flowchart tools (Lucidchart, MermaidJS) for architecture diagrams. For code, perhaps small templates using LangChain or similar to illustrate patterns. Also, LangChain’s documentation, OpenAI function calling examples, and multi-agent frameworks (AutoGen, etc.) as references.







### **3.1 Single-Agent Architectures**







#### **3.1.1 The ReAct Loop Detailed**

####  **– Step through a canonical single-agent loop: Prompt (including instructions + memory + last observation) → LLM thinks (“Thought… Action: X…”) → if Action is not “Finish”, execute tool → get Observation → append to context → next loop. Draw this as a flowchart. Discuss how this loop terminates (either the agent decides to output an answer or a max loop count triggers a stop). Emphasize how reasoning and acting are interleaved** 

#### 

####  

#### 

#### **.**





#### **3.1.2 Planner-Executor (Plan-and-Act)**

####  **– Some designs use a two-phase approach: first the agent** 

#### **plans out a sequence**

####  **of actions, then executes them. E.g. “Think first, then act” as separate steps. Outline this pattern and pros/cons vs ReAct (which is interwoven). Sometimes a high-level plan can be made then executed step by step (Voyager did something like this in code form). This pattern can be implemented by having the LLM output a pseudo-code plan that another function then runs.**





#### **3.1.3 Memory Management**

####  **– Design of memory: how to store and retrieve information during the agent’s operation. Explain** 

#### **short-term memory**

####  **(the recent dialogue or scratchpad that stays in the prompt) vs** 

#### **long-term memory**

####  **(e.g. using a vector DB to store important facts that persist beyond the context window). Patterns: sliding window of dialogue vs summary of old events to compress. Also mention episodic memory (per conversation) vs semantic memory (general world knowledge). For engineering: when to use a vector store – e.g. if agent needs to recall something from an hour ago that’s too long to keep verbatim.**





#### **3.1.4 Tool-Using Mechanisms**

####  **– How to integrate tools into the architecture. Options include:** 

#### **Function Calling (structured outputs)**

####  **– where the LLM output is directly parsed as a function call (OpenAI’s approach);** 

#### **Action strings**

####  **– where the LLM outputs a special token or format like “**SEARCH: query**” that the orchestration code parses (LangChain’s approach); or** 

#### **Code generation**

####  **– having the agent literally write code that when executed performs actions (like executing Python code it wrote). Compare these and note reliability issues (e.g. function calling ensures well-formed JSON, while free text can be fuzzy).**





#### **3.1.5 实操练习 – Customize an Agent Prompt:**

####  **Provide a basic ReAct agent script (maybe using LangChain’s simpler agent). Have students modify the** 

#### **prompt and structure**

####  **to insert a custom tool. For example, add a new tool “Calculator” into the agent’s toolbox and adjust the prompt to reflect how the agent should use it (“If you see a math problem, use the Calculator tool”). Then test the agent on a query requiring that tool. This exercise shows how architecture and prompt design go hand in hand.**





### **3.2 Multi-Agent System Design**







#### **3.2.1 Coordination Patterns**

####  **– Present common multi-agent topologies:** 

#### **Master-Slave (Manager-Worker)**

####  **where one agent delegates tasks to others (e.g. one agent breaks a job into parts and assigns to specialized agents, then aggregates results)** 

#### 

#### **.** 

#### **Peer-to-Peer (Self-Organizing)**

####  **where agents have equal standing and communicate freely (like a group chat of agents) – here issues of convergence and conflict resolution arise.** 

#### **Hierarchical**

####  **(multi-level managers) which could mirror organizational charts. Discuss when to use which (hierarchy for complex, well-structured tasks; peer for creative brainstorming among agents).**





#### **3.2.2 Communication Protocols**

####  **– How agents talk: via a shared language (natural language messages) vs structured messages. Many frameworks just have them chat in plain English (e.g. “Agent A: asks question; Agent B: answers”). Others define an API or roles. Introduce the idea of an** 

#### **Agent Communication Protocol**

####  **(in IBM’s terms, A2A) – e.g. each message might have a header with intent, or agents might have to preface messages with certain tags. Simpler approach: one can just stuff all agent outputs into a single prompt context and let the LLM figure it out, but that can be messy as number of agents grows.**





#### **3.2.3 Shared Memory / Blackboards**

####  **– A design where multiple agents contribute to a common knowledge store (like a “blackboard” in blackboard systems or a Google Doc they all edit). This can help coordination – e.g. an agent writes intermediate results to a shared memory that others can read. For instance, one agent writes “subgoal completed: X = 42” to memory and another agent picks that up to proceed. Design considerations: how to avoid confusion or overwrite in shared memory; maybe designate one agent as memory manager or use vector DB with tags per agent.**





#### **3.2.4 Case Study: AutoGen (Multi-LLM threads)**

####  **– Walk through a concrete example of multi-agent from Microsoft** 

#### **Autogen**

#### **: e.g. a User Simulator agent and an Assistant agent chatting to solve a task, with a** 

#### **Proxy**

####  **overseeing (if any). Or OpenAI’s Swarm: how handoffs are designed (one agent’s action triggers another). By studying a real framework, highlight how roles and messaging are implemented in code.**





#### **3.2.5 实操练习 – Simulated Multi-Agent Chat:**

####  **Using a provided script or a LangChain example, run a scenario with two agents in conversation (e.g. one agent has knowledge about movies, another about books, and they debate a topic that spans both). Students can adjust each agent’s system prompt (giving them distinct personas or goals) and then observe how the dialogue unfolds. This could be done with two instances of GPT-3.5 and a simple loop exchanging messages. It illustrates emergent behaviors (they might correct each other or get stuck without a human) and the need for an overarching controller sometimes.**





### **3.3 Patterns for Specific Challenges**







#### **3.3.1 Long-Term Planning vs Reactivity**

####  **– Some agents need to plan several steps ahead (chess, or strategic business decision-making), while others can just react step by step. Discuss how to incorporate planning capability: e.g.** 

#### **Tree-of-Thoughts**

####  **approach (the agent simulates multiple future action sequences in its mind and picks the best) or** 

#### **macro-actions**

####  **(where one action can trigger a predefined sequence, reducing decision frequency). Also mention the risk of over-planning (wasting tokens on plans that might become irrelevant once environment responds).**





#### **3.3.2 Error Handling and Uncertainty**

####  **– Design patterns for when things go wrong: e.g. the agent calls a tool and gets an error or no result. How to incorporate error-handling in prompts (“If tool fails, try a different approach” embedded in instructions) or via code (catch exceptions and feed that info back to LLM). Also, handling when the LLM output is invalid (not following format) – techniques like checking and re-prompting (“Assistant, you did not follow the format, please correct.”). This pattern is essential for robust agents that won’t just crash on first error.**





#### **3.3.3 Self-Monitoring (Critic & Reflection)**

####  **– Architectural patterns to include a** 

#### **Critic model**

####  **or self-reflection step. For example, after each thought/action, have the LLM produce an extra “critique” output or have a separate smaller model evaluate the main model’s output (like “was this answer correct? if not, hint at fix”). Show how one can integrate this: either as an additional turn in the prompt (LLM generates answer, then asked “Is this answer good? If not, fix it.” as in Reflexion** 

#### 

#### **) or as a separate agent (Critic agent in a multi-agent setup that can override or suggest edits).**





#### **3.3.4 实操练习 – Implement a Critic Step:**

####  **Students take a QA agent they built and augment it with a simple self-check. For example, after the agent answers, run a verification: ask the LLM (or another model) “Does the previous answer use the provided information correctly? (yes/no)” or “Is the final answer found in the reference text?” if doing RAG. If the check fails, have the agent try again. This can be done in LangChain by sequentially calling models. Students will see if this improves accuracy on a few queries (perhaps catching a hallucination). It’s a practical intro to reflective patterns.**





## **Module 4: Core Techniques and Modules for AI Agents**





- **学习目标:** Break down the key algorithmic techniques and tools that empower agents. This includes task decomposition strategies (how an agent can break a big goal into subgoals), various reasoning strategies like CoT vs Tree-of-Thought vs Reflection (we touched conceptually, now more how-to), how to implement function/tool calling in practice, and handling of safety and constraints (ensuring the agent doesn’t violate rules). This module is like a deep dive into the “skills” an agent developer needs to craft intelligent and safe agents.
- **预期产出:** Code snippets or pseudo-code for implementing certain techniques (e.g. a simple recursive task decomposition function that an agent could use, or a template for self-reflection prompt). Additionally, a “tool specification” document that students create for a set of tools they might give an agent (defining what the tool is, how the agent should use it). Possibly also a short write-up on how they would ensure safety for a given agent idea (identifying risks and proposing mitigations).
- **推荐技术栈:** Python for coding tools and using frameworks. LangChain (for tool definitions and function calling demonstrations), OpenAI API or local LLM with function calling support (like OpenAI functions or Guidance library). Possibly OpenAI Evals framework to test agent behavior against constraints.







### **4.1 Task Decomposition Techniques**







#### **4.1.1 Divide and Conquer**

####  **– Teach how complex tasks can be split: either by the agent itself or by an external dispatcher. Discuss** 

#### **recursive decomposition**

####  **(an agent that, when given a goal, first lists sub-tasks and then tackles them one by one – this was essentially BabyAGI’s approach). Also mention** 

#### **LEAF (Lookahead)**

####  **planning vs** 

#### **reactive next-step**

####  **planning. Provide examples: “Plan a vacation” could be broken into “choose destination, find flights, book hotel, plan itinerary.” Agents can be prompted to list these explicitly.**





#### **4.1.2 Tools for Decomposition**

####  **– Some frameworks have built-ins: e.g. LangChain’s** 

#### **Plan-and-Execute**

####  **chain where one prompt generates a plan and another executes steps. Or using an explicit “task list” in memory that the agent updates (like BabyAGI). Walk through pseudo-code of maintaining a task queue: initialize from user goal, loop: take top task, work on it (possibly spawning a sub-agent for it), get result, mark done, possibly add new tasks.**





#### **4.1.3 Case Study: ChatGPT Plugins as Delegation**

####  **– Viewing the plugins system as a form of subtask delegation: e.g. when using the OpenTable plugin, ChatGPT essentially delegated “find restaurant” to that API. Though not classical decomposition, it’s delegating a specific functionality. Compare with agent decomposition: e.g. AutoGPT would create a “Search for restaurants” subtask itself and then use a generic search tool. This shows different levels (specific vs open-ended).**





#### **4.1.4 实操练习 – Manual Decomposition:**

####  **Take a moderately complex problem (e.g. “Organize a one-day tech conference event”). Have students manually outline how they’d break it into tasks. Then have them prompt an LLM to do the same (“List the steps to …”). Compare and discuss differences. Next, if available, use an agent that actually executes on one of those sub-tasks (maybe a web search). The goal is to connect natural decomposition to how an agent might handle it.**





### **4.2 Advanced Reasoning Strategies**







#### **4.2.1 Chain-of-Thought vs Tree-of-Thought**

####  **– Revisit CoT as a baseline (linear reasoning) and** 

#### **Tree-of-Thought (ToT)**

####  

#### 

####  **where the agent can consider multiple options at a decision point (like Minimax search but with an LLM evaluating states). Provide an illustrative scenario: a puzzle with multiple possible moves – CoT might pick one path and fail if wrong, ToT would explore a few then choose. Discuss how ToT can be implemented: either by the agent itself enumerating alternatives, or by an external loop that prompts the agent multiple times with different assumptions.**





#### **4.2.2 Self-Reflection (Reflexion)**

####  **– Detail how to prompt an agent to reflect. For example, after an answer is produced, ask it “If you had to criticize your solution, what would you say?”** 

#### 

#### **. Or intermix reflection during the process (“Before finalizing, think: is there any flaw in the reasoning so far?”). Provide actual prompt templates from Reflexion paper or similar. Show an example where an agent initially answers incorrectly, then when forced to reflect, catches its mistake.**





#### **4.2.3 Few-Shot and Skill Projection**

####  **– Sometimes giving an agent examples (few-shot) can help it reason better or learn to use a tool. Discuss when to use few-shot in agents (maybe for a very specific pattern of action). Also mention “skill projection”: if an agent has solved a similar task before, it can reuse that reasoning. That’s more for meta-learning; practically, storing successful trajectories and injecting them as examples for similar future queries.**





#### **4.2.4 实操练习 – Implement Tree Search:**

####  **A guided coding exercise where students implement a simple tree search for an agent solving a small puzzle (like the 8-puzzle or a maze). The agent (LLM) can generate possible moves and an evaluation of state. Students will write a loop that at each step expands possible next moves (with the LLM’s help) and explores one or two levels deep, then backtracks if needed. This might use a smaller model for cost. The point is to concretely see how branching could work and how to use the LLM as a heuristic evaluator in a tree. (If coding is too heavy, pseudo-code and a conceptual run-through suffice.)**





### **4.3 Function Calling, Tool APIs, and Code Execution**







#### **4.3.1 Tool/API Specification**

####  **– How to define tools for an agent. Emphasize providing clear** 

#### **descriptions**

####  **and input/output schema for each tool, as these are often fed into the prompt or the function interface. For instance, a “Search” tool with description “use this to search the web for information” and input schema** 

#### **{"query": "string"}**

#### **. Best practices: make tool names and descriptions unambiguous to the LLM (so it doesn’t confuse tools). Mention the limit of too many tools (LLM might confuse them if overlapping functionality).**





#### **4.3.2 OpenAI Function Calling**

####  **– Explain how modern APIs allow passing a list of function specs to the model, and the model can directly output a JSON for a function call when appropriate. This greatly simplifies tool use. Show a quick example JSON spec and model output (maybe from OpenAI docs). If possible, demonstrate calling GPT-3.5 with a function spec and getting a function call. Also, how the developer then executes the function and returns the result to the model.**





#### **4.3.3 Code Interpreter Agents**

####  **– A powerful pattern: have the agent write code (Python, JS, etc.) which is then executed to achieve tasks (e.g. data analysis, math). Notably, OpenAI’s Code Interpreter (now ChatGPT “Advanced Data Analysis”) does this: the agent is basically in a sandbox where it can write and run code. Discuss when this is useful (complex computation, file operations). Also caution: this requires a safe sandbox, as executing arbitrary code is risky. Many open-source “GPT-Engineer” style projects rely on this pattern.**





#### **4.3.4 实操练习 – Add a New Tool to Agent:**

####  **If using LangChain or a custom agent from earlier, students will add a new dummy tool (e.g. a “Weather API” that just returns a fixed response). They’ll update the agent’s tool list and test if the agent uses it appropriately when asked a weather question. Alternatively, use OpenAI function calling: define a simple function (in code) like** 

#### **get_current_time()**

####  **and ask GPT to use it by providing the function in the API call. Students should observe the model output a function call and then how the code returns a result to the model for final answer. This cements understanding of the tool integration loop.**





### **4.4 Agent Guardrails: Safety and Constraints**







#### **4.4.1 Potential Risks with Autonomous Agents**

####  **– Brainstorm the things that can go wrong: the agent could produce unwanted content (since it’s effectively running unsupervised), it could spam an API or perform destructive actions (if connected to say a shell or credit card API), it could get stuck in a loop and rack up cost, or could reveal sensitive info. Discuss historical examples: e.g. the ChaosGPT that was tasked to “destroy humanity” (a tongue-in-cheek experiment) or instances of AutoGPT running up API bills by looping.**





#### **4.4.2 Implementing Guardrails**

####  **– Strategies to keep agents in check:** 

#### **Permission systems**

####  **(require human approval for certain actions – e.g. an agent can propose sending an email but a human must approve),** 

#### **Budget limits**

####  **(set a max number of steps or API calls, then agent must stop),** 

#### **Policy filtering**

####  **(use a content filter on agent outputs to catch disallowed content),** 

#### **Role constraints in prompt**

####  **(“You are an agent that never does X…” as part of system prompt). If using something like Guardrails.ai or AI Robin, mention these frameworks that can enforce policies on LLM output.**





#### **4.4.3 Testing and Evaluation**

####  **– How to test an agent before deploying: unit tests for tools (ensuring tool usage format is correct), simulation tests (run the agent in a safe environment on many scenarios to see if it behaves), and evaluation against criteria (like using benchmarks or custom eval sets). For instance, create some “red team” scenarios (like instructing the agent to do something dangerous) and verify it refuses. Mention OpenAI Evals or other community evals as a way to systematically test agent behavior.**





#### **4.4.4 实操练习 – Define a Safety Protocol:**

####  **Students will write a short “Agent Safety Charter” for a hypothetical agent. For example, if they were building an agent that manages a Twitter account, what rules and limits would they impose? They should list: forbidden actions/content, when to fallback to human, and how they’d implement that (e.g. “the agent will call a ‘check_toxicity’ tool on any composed tweet and if high, will not post”). This is not coding but a design exercise that makes them think of embedding guardrails, which they can implement in Module 5 or 6 when building. Optionally, if time: implement a simple filter in their agent loop – e.g. after the agent forms a response, run it through a profanity filter (a regex or an API like Perspective) and if it fails, have the agent adjust. This shows practically how to incorporate a guardrail.**





## **Module 5: Engineering an AI Agent from Scratch (0→1 Build)**





- **学习目标:** Turn theory into practice by actually building a simple but complete AI agent system from the ground up. This module walks through implementing a basic agent loop with a minimal tech stack and incrementally adding features (tools, memory, etc.). It also covers general software engineering aspects: organizing code, using version control, and deploying the agent locally or on a server. Students learn by doing – writing code for an agent and seeing it work (and break, and then fix it).
- **预期产出:** A working simple agent (e.g. a command-line chatbot agent that can use at least one or two tools). Students will produce the code for this agent, along with documentation explaining its design. Additionally, small demo outputs showing the agent performing a task end-to-end. Essentially, this is the first prototype of their agent project.
- **推荐技术栈:** Python (for ease and ecosystem). Libraries: could start without any framework (to really code the loop manually), then possibly introduce LangChain or similar to simplify. OpenAI API for reliable LLM (or a local model if API not available/too costly). Tool integrations via simple Python functions (e.g. using requests for a web API, or a search library). For memory, possibly an SQLite or just in-memory list for simplicity.







### **5.1 Minimal Viable Agent: Hello World**







#### **5.1.1 Setting Up Environment**

####  **– Ensure students have the dev environment ready: Python installed, necessary API keys (OpenAI, etc.) or local model, and IDE/jupyter. Use a requirements file for needed libraries (openai, langchain, etc.). Version control (git) initiation for their project folder. This covers basic engineering hygiene.**





#### **5.1.2 Basic Agent Loop Implementation**

####  **– Write a very simple loop: prompt user for input, feed to LLM, get answer, print answer. Then modify this loop to incorporate a reasoning/action output. For instance, implement a structure: if model output contains some special token (e.g. “[SEARCH]”), handle that by performing a pseudo-search (maybe just print “(pretending to search)”), then feed result back. Initially, do this in the simplest way possible (just to illustrate the mechanism). Essentially, a hardcoded single-tool agent to show the skeleton.**





#### **5.1.3 Testing the Basic Agent**

####  **– Run the agent on a trivial task (maybe one that triggers the search dummy tool). Confirm the flow (see that it indeed went to tool and came back). This reinforces understanding of control flow between LLM and code.**





#### **5.1.4 Iterative Development Mindset**

####  **– Emphasize how to build in increments: get a basic working core, then add one feature at a time (rather than trying to build a full agent in one go). Also highlight logging/printing intermediate steps for debugging (an agent’s thought process can be opaque, so logging each thought and action is key). Set up a simple logger for agent steps.**





### **5.2 Building Tools and Actions**







#### **5.2.1 Abstracting Tool Interfaces**

####  **– Create a simple way to define tools in code. Perhaps a dictionary or list of tool specs, each with a name, a function to call, and a description. Write helper code to match the agent’s action choice to the actual function. For example, define** 

#### **tool_search(query) -> returns top web result**

####  **(maybe using an API like SerpAPI or a dummy if not allowed). Also a** 

#### **tool_calculate(expression)**

####  **that evals math. By having 2-3 tools, we can test selection logic.**





#### **5.2.2 Integrating Tools with LLM**

####  **– Now, implement the parsing of LLM output to detect tool usage. If using a convention like the ReAct prompt, parse the action line. If using OpenAI function calling, integrate that (which largely handles parsing for us). This is a crucial engineering step: connecting model output to actual function execution and then back. Discuss error cases (model calls a non-existent tool – how will our code handle that?).**





#### **5.2.3 Memory Integration**

####  **– Add a very simple memory: e.g. maintain a list** 

#### **conversation_history**

####  **of past interactions or a summary string. Integrate it by including relevant memory in the prompt each cycle (for short-term, the last N turns; for long-term maybe none for now or a simple retrieval of a fact if question repeats). Code this and test that the agent can refer to previous user message correctly (“As I said earlier…” type continuity).**





#### **5.2.4 实操练习 – Implement & Test Tools:**

####  **At this stage, students will code a specific tool, say a Wikipedia search using an API or scraping. Then ask the agent a question that requires that tool (“Find me the population of X city”). Watch the agent go through steps: ideally, it should call the search tool, get an answer, and return it. If it fails (maybe the parsing didn’t work), this is a chance to debug. They will iterate until it works, thereby learning hands-on how tool integration issues manifest (e.g. maybe the LLM phrased the action slightly differently than expected – they might adjust prompt or parsing).**





### **5.3 Connecting Knowledge Bases and APIs**







#### **5.3.1 Adding a Knowledge Base (RAG)**

####  **– Take an example knowledge domain (maybe a set of company FAQs or a short text file). Demonstrate integrating a vector store: e.g. compute embeddings for each FAQ answer and on each user query, find the top match and provide it to the agent as context. Code this pipeline and attach to agent’s loop (as a special “Memory Retrieval” step at prompt time, or as a tool like** 

#### **tool_lookup**

#### **). This gives the agent some “closed-book” info.**





#### **5.3.2 External API Integration**

####  **– Show how the agent can call external APIs beyond search – perhaps a weather API or currency converter. Implement a dummy function for one of these (or real if API keys available). The point is to illustrate how easy/hard it is for an agent to use specialized APIs: likely need to format queries precisely, etc. Emphasize reading API docs as a skill (for the agent or the developer writing the tool description).**





#### **5.3.3 Handling API Failures**

####  **– Implement simple error catching around API calls – e.g. if API returns error or times out, how do we inform the agent (likely by returning a structured error message as observation). Possibly have the agent handle it: if observation contains “ERROR”, maybe it tries something else or apologizes.**





#### **5.3.4 实操练习 – Knowledge Tool Demo:**

####  **If a small dataset is provided (like a text about a topic), students incorporate a retrieval step. For example, whenever the agent is asked something factual, they can force a retrieval from that dataset. They then compare the agent’s answer with and without that context to see the improvement. This solidifies how connecting to knowledge sources is done in code and why it matters.**





### **5.4 Prompt Design and Role Engineering**







#### **5.4.1 System Prompts and Agent Persona**

####  **– Now that the code structure is set, focus on crafting the system prompt that defines the agent’s role and style. Show examples of effective system prompts for agents (OpenAI’s documentation has some for tool use: e.g. “You are an agent given the following tools… You should always think step by step and when you need info, use search,” etc.). Let students refine their agent’s persona (is it formal, friendly, does it explain its steps or hide them?).**





#### **5.4.2 Few-shot Examples in Prompt**

####  **– If the agent is struggling with something (maybe it doesn’t format the action exactly right), consider adding a few-shot example in the prompt. Teach how to select minimal but useful examples. Implement one in the prompt and test the effect. Warning: large prompts cost more tokens, so weigh benefit.**





#### **5.4.3 User Prompting and UX**

####  **– Discuss how the agent will interact with a user interface eventually (CLI vs chat vs GUI). If CLI/chat, how to format outputs nicely (maybe separating the agent’s thought log vs final answer). Possibly introduce the idea of a simple front-end (could be next module).**





#### **5.4.4 实操练习 – Prompt Tuning:**

####  **Have students deliberately tweak the system prompt or few-shot examples and observe the agent’s behavior change. For instance, add a line “If the user asks for a joke, respond with a joke” and then ask for a joke – see if it obliges in the set style. Or instruct it to be concise vs verbose. This shows how powerful the prompt is in controlling the agent’s style and adherence to desired behavior.**





### **5.5 Deployment Considerations**







#### **5.5.1 Running Locally vs Cloud**

####  **– Now that an agent is built, how to deploy: Running on a local machine (benefits: data control, potentially using local model to save costs) vs calling an API (fast iteration, less maintenance). Also mention containerization if needed (dockerizing the agent code for easier deploy).**





#### **5.5.2 Performance Optimization**

####  **– Basic tips: reduce token usage by trimming context, using smaller models for certain steps (maybe use GPT-3.5 for tool usage and GPT-4 only for final complex reasoning), asynchronous execution if multiple calls, etc. At this stage, the agent likely is small, but it’s good to plant seeds of thinking about efficiency.**





#### **5.5.3 Monitoring and Logging**

####  **– Encourage adding comprehensive logging of agent decisions (maybe writing to a log file every thought and action). This will be invaluable later when debugging with real users. Introduce the concept of** 

#### **observability**

####  **for AI agents – e.g. using tools like LangSmith or other tracing tools that record each step. In code, maybe incorporate LangChain’s tracing or simply ensure our prints can be toggled to a log file.**





#### **5.5.4 实操练习 – Basic Deployment:**

####  **If feasible, have students deploy their agent script on a simple cloud environment or at least run it as a persistent service. Could be as easy as running it in a background thread or on an AWS free tier instance. Alternatively, simulate multiple users by running multiple queries sequentially. The point is to transition from dev-testing (one query at a time manually) to thinking of it as a service that could handle requests continuously. They should ensure it resets state appropriately between sessions, etc. This highlights differences between a one-off script and a long-running agent service.**



*(By the end of Module 5, students have a functioning agent prototype and have learned core implementation skills. The next modules will build on this by exploring existing frameworks (to see how others do it), and then scaling up to product-level considerations.)*





## **Module 6: Deep Dive into Mainstream Agent Frameworks & Projects**





- **学习目标:** Expose students to the leading open-source frameworks and platforms for building AI agents, analyzing how they are designed and when to use them. By dissecting frameworks like LangChain Agents, Microsoft’s Autogen, etc., students learn best practices and different design philosophies. This module is about broadening their toolkit beyond the scratch-built agent by understanding and leveraging existing solutions. It’s also comparative – highlighting pros/cons of frameworks in terms of abstraction, flexibility, performance.
- **预期产出:** A comparative analysis document or presentation where students (in teams perhaps) pick one framework, explore its usage, build a tiny demo with it, and then present its key features and limitations to the class. Also, code for 1-2 small demos using different frameworks (e.g. one with LangChain, one with another library) solving the same task, to experience differences. Possibly contribute a small improvement or bugfix to an open-source project (if feasible) to engage with the community aspect.
- **推荐技术栈:** LangChain (Python) for sure – it’s widely used; others like LlamaIndex, OpenAI’s functions (which we covered conceptually, but here as a framework usage), Microsoft Autogen (Python SDK), and maybe one of the multi-agent ones like CamelAI or CrewAI. Tools: GitHub for reading source code, pip for installing these libs, Jupyter for trying them out. Possibly Docker if trying something like running Agentverse that might need it.







### **6.1 LangChain Agents and LangGraph**







#### **6.1.1 Overview of LangChain**

####  **– Introduce LangChain’s purpose: it’s a library to assist development of LLM applications, with modules for memory, tools, chains, and agents. Focus on the** 

#### **Agent**

####  **capabilities: different agent types (like Zero-shot React, Conversational Agent, etc. as defined in LangChain docs). How LangChain simplifies tool integration (with its Tool class and agent executor handling the loop).**





#### **6.1.2 Building an Agent with LangChain**

####  **– Live code or pseudo-code: using LangChain to replicate something like the agent built in Module 5. Show how few lines it can take (just define tools and choose an agent class, like** 

#### **initialize_agent(tools, llm, agent="zero-shot-react")**

#### **). Run a test query to show it working. Highlight how it parses the LLM output for you, etc.**





#### **6.1.3 LangGraph for Complex Workflows**

####  **– Explain that LangGraph is an extension allowing more complex agent workflows (graphs of nodes rather than linear thought chains). Possibly show an example from their docs: e.g. a graph where one branch does a search while another branch does something else, then join. Discuss in what scenarios LangGraph is advantageous (long-running or multi-step workflows that require check-pointing and possibly parallelism).**





#### **6.1.4 Demo & Hands-on:**

####  **Students use LangChain to quickly create an agent that uses a couple of tools (maybe similar to prior ones). They then intentionally “break open the box” by printing out what LangChain is doing internally (the prompts it creates, etc.) to connect it to what they learned coding from scratch. Optionally, try LangChain’s** 

#### **Agent debugging**

####  **utilities if any, or simply observe how errors are handled by it. If time permits, attempt a LangGraph example (though that might be advanced). The goal is they see how using a framework can accelerate development, but also see the abstraction layers.**





### **6.2 Microsoft Autogen and OpenAI Functions**







#### **6.2.1 Microsoft Autogen**

####  **– Introduce AutoGen, which Microsoft released to facilitate multi-agent interactions. Key features: predefined agent classes like** 

#### **UserProxyAgent**

#### **,** 

#### **AssistantAgent**

#### **, easy creation of multi-agent dialogues, and built-in support for tools (including a code execution agent). Perhaps show a snippet of creating two agents that chat – Autogen reportedly makes that straightforward. Also mention its memory approach (if any) and how it organizes chat sessions.**





#### **6.2.2 CrewAI (or similar)**

####  **– CrewAI as an example of a more** 

#### **structured multi-agent framework**

####  **(with the concept of “Crew” and “Flows”)** 

#### 

#### **. Outline how CrewAI defines roles and tasks for agents, and things like its built-in memory object** 

#### 

#### **. Possibly mention that CrewAI includes an entire suite for production (observability, control plane) – which is beyond a coding library; it’s moving towards a platform.**





#### **6.2.3 OpenAI Function Calling in Practice**

####  **– We already integrated function calling in Module 5 manually; here treat it as part of a “framework” – in that one can rely on OpenAI’s machinery to do agent-like operations (like the Plugins system). Show maybe how easy it is to add a tool via function spec vs writing your own parser. Also mention OpenAI’s Plugin ecosystem (though not open-source, it’s an emerging “platform” for agents hooking into services).**





#### **6.2.4 Demo & Hands-on:**

####  **If feasible, let students try out Autogen or another multi-agent library by following a short tutorial (e.g. making two chat agents solve a problem together). Alternatively, watch a demo video of it and discuss. Have them note differences: e.g. Autogen uses multiple LLM calls in parallel or sequential, how is that different from LangChain’s single agent. If they try CrewAI or others, perhaps just inspect their docs or do a pip install and run a provided example. The point is less to code from scratch (these frameworks can be complex) but to be aware of their existence and when one might choose them (e.g. “If I need a multi-agent system with robust memory, maybe CrewAI is a good choice” vs “For quick tool integration, LangChain might suffice”).**





### **6.3 Comparing Frameworks: Design Philosophy**







#### **6.3.1 Level of Abstraction**

####  **– Compare how high-level vs low-level each framework is. LangChain is relatively high-level (you don’t manage the loop yourself), whereas our scratch-built agent was low-level. CrewAI gives a high-level structure (Crew and Flow) but also allows fine control. Autogen is somewhat high-level specifically for multi-agent patterns. Discuss trade-offs: high-level = quick development but potentially less flexibility; low-level = more control but more work and risk of bugs.**





#### **6.3.2 Tool Ecosystem**

####  **– Note which frameworks come with rich tool integrations: LangChain has many ready-made tools (Google search, WolframAlpha, etc.), which is very handy. Others may require writing your own. If a project’s goal involves many API integrations, maybe LangChain or AgentGPT (which had a plugin store concept) could help.**





#### **6.3.3 Memory and State Handling**

####  **– Some frameworks (LangChain, CrewAI) provide easy connectors to vector stores for memory and even automate episodic memory. Others might leave it to user. Compare memory strategies: LangChain’s ConversationBufferMemory vs custom; how frameworks differ in keeping conversation state.**





#### **6.3.4 Performance and Scalability**

####  **– Mention that frameworks add overhead. If maximum efficiency is needed, one might bypass and implement a lean custom loop (especially for large-scale deployment). Some frameworks might not be optimized for multi-thread or async. E.g. LangChain’s agent might call the LLM sequentially for each thought – not great if you want to parallelize tool calls. Also note community support: LangChain is widely supported, smaller frameworks maybe less so but possibly more tailored.**





#### **6.3.5 实操练习 – Framework Selection Case:**

####  **Pose a scenario (e.g. “We need to build an agent that interacts with 5 different internal APIs and will be used by thousands of users concurrently. What framework or approach would you choose and why?”). Have students outline a rationale (there’s no single right answer, but they should consider the above factors). This can be a short written answer or a group discussion. It forces them to articulate differences and make design decisions based on requirements.**





### **6.4 “Learning by Example” Projects**







#### **6.4.1 LangChain Hub Demos**

####  **– Look at a couple of exemplary projects built with LangChain (e.g. an “AI Travel Agent” or “SQL query agent”). Reading through their code or blog post to see how the pieces come together. Identify patterns: oh, they used XYZ tool for search, they set up memory like this, etc.**





#### **6.4.2 LlamaIndex Agent Example**

####  **– If not covered earlier, see how LlamaIndex (llama-agents) would build an agent for, say, document QA. Emphasize its straightforward data integration.**





#### **6.4.3 Open-Source AutoGPT Variants**

####  **– There are many AutoGPT derivatives (AgentGPT, BabyAGI, etc.). Perhaps pick one lightweight variant and examine how it’s structured (the repo “awesome-ai-agents” lists many). The idea is to show students real code of an autonomous agent loop from the wild, to compare with what they wrote. Possibly they’ll find similar elements (loops, memory). This helps solidify that the concepts learned are universal.**





#### **6.4.4 实操练习 – Contribute or Extend:**

####  **Encourage an open-source mindset: for instance, ask students to think of a small improvement or feature they could add to their agent or a framework. Maybe even open an issue or PR in LangChain or similar if they found a bug. Or simpler: implement a new tool plugin for LangChain (like integrating a niche API) and share it. This gives a sense of community-driven development and reinforces engineering practices beyond just using what’s given. Each student could write a short description of the extension they would contribute and why (even if they don’t actually code+merge it due to time). This is more of a forward-looking exercise to wrap up module 6.**





## **Module 7: From Prototype to Product – Building Commercial-Grade AI Agents**





- **学习目标:** Shift focus to production considerations: how to deploy an agent as a reliable service, how to handle scale (many requests), ensure uptime, monitor performance, and the unique challenges of running agents (like unpredictable behavior). Cover various application domains and how an agent fits into a product (front-end UX, backend integration). Also discuss business aspects: cost estimation, pricing models for agent services, and compliance. Essentially turning the tech into a viable product or service.
- **预期产出:** A deployment plan document for the agent project they have (covering architecture, scaling approach, monitoring strategy). Possibly a simple deployed instance of their agent (maybe on cloud or as a local web app) to demonstrate the end-to-end product. Another output: case study analyses – e.g. each student picks an industry and outlines how an AI agent could be applied and what value it brings (and any domain-specific requirements).
- **推荐技术栈:** Docker & Kubernetes basics for deployment (if relevant), cloud platforms (AWS, GCP, Azure – using whichever services like AWS Lambda for serverless agent, or a container on Azure). Monitoring tools like logging systems (ELK stack) or APM (Application Performance Monitoring) if available. Possibly specific libraries for tracing (OpenTelemetry). For front-end, maybe a simple React or chat UI (could use Streamlit or Gradio for quick demo UI).







### **7.1 Agents as a Service (Architecture)**







#### **7.1.1 Service-Oriented Architecture for Agents**

####  **– Outline a typical cloud architecture: user interacts via an API or web UI → request goes to an** 

#### **Agent Service**

####  **(could be a Flask app or serverless function) → the agent service calls LLMs and tools, manages state (possibly in a DB) → returns result to user. Emphasize stateless vs stateful design: e.g. a conversation agent might store conversation state in a database or cache keyed by session. Draw a component diagram with user, web server, agent logic, external APIs (tools), and data stores (for memory, logs).**





#### **7.1.2 Scalability Considerations**

####  **– If the agent gets 1000 requests per minute, how to handle? Ideas: concurrency – can the agent handle multiple sessions in parallel? If using external API like OpenAI, that becomes the bottleneck or cost factor. Possibly use a** 

#### **queue system**

####  **(Celery or cloud task queues) for longer tasks so they don’t tie up web threads. Also, scaling horizontally: containerize the agent and run N instances behind a load balancer. Highlight that some agent actions might be slow (web search, etc.), so think about asynchronous patterns.**





#### **7.1.3 Reliability and Recovery**

####  **– What if the agent process crashes or gets into a bad state? Design should ensure at least the system doesn’t go down with one agent error. Using stateless workers helps (each request fresh). Also maybe implement timeouts for any action (like if a tool call hangs, ensure the agent doesn’t freeze indefinitely). Discuss how to handle partial failure: e.g. if a tool fails, do we return an apology to user or try an alternative? At product level, probably better to return something than nothing, so maybe having fallback behavior (like default to just answering with LLM without tools if tools fail).**





#### **7.1.4 Logging & Monitoring**

####  **– In production, log every query and agent decision (with PII considerations). Use monitoring to track metrics: number of requests, success vs fail count, latency of responses, cost per response (esp if using paid API). Possibly set up alerts (if error rate goes high or if costs spike beyond threshold). Tools: mention something like** 

#### **Arize AI**

####  **or** 

#### **WhyLabs**

####  **for ML monitoring if known, but simpler: store logs in a DB and manually analyze initially.**





#### **7.1.5 Security**

####  **– If an agent can execute actions, ensure security: e.g. if it’s allowed to run code, sandbox it heavily (like limited compute environment). If it integrates with company systems, ensure it cannot perform unauthorized ops (maybe give it a limited permission set, like a service account with only read access if it’s a research agent). Also, authentication – ensure only authorized users can use the agent if it exposes sensitive data or costly operations. This is standard web app security but with the nuance that the agent might do unpredictable things.**





#### **7.1.6 实操练习 – Deployment Plan:**

####  **Students will draft a deployment diagram/plan for their agent. They should specify: how they’d host the model (or API calls), how they’d deploy the code (cloud VM, container, serverless), how they’d scale it for 10x load, and what monitoring they’d put in place. This can be a one-page architecture diagram with bullet points. It forces them to apply module concepts to their specific project.**





### **7.2 High-Concurrency and Optimization**







#### **7.2.1 Handling Many Users**

####  **– Real product might have many simultaneous conversations. Strategies: use a** 

#### **session-based architecture**

####  **where each session has isolated memory (could be in-memory with a key, or stored in a DB between calls). Show how sticky sessions could be a thing (user always goes to same instance to keep their memory local) vs centralized memory storage all instances can access (like Redis).**





#### **7.2.2 Throughput vs Cost**

####  **– If using an API like OpenAI, the more concurrency, the more cost. Consider batch processing if possible (OpenAI doesn’t have batch for chat, but some tasks could be batched). Also possibly use** 

#### **streaming**

####  **responses – stream tokens to user as they come to reduce perceived latency. That implies agent can stream out final answer while maybe still doing some behind-scenes (though streaming is mostly for final answer).**





#### **7.2.3 Caching**

####  **– One way to reduce load: cache results of common queries or sub-steps. E.g. if users often ask similar things, caching the agent’s answer for some time could save recomputation (though risk of staleness if context changes). Also caching tool call results – like if two agents search the same query within a minute, reuse result. Discuss trade-offs and tools (in-memory cache, or external like Redis for multi-instance).**





#### **7.2.4 Profiling and Bottlenecks**

####  **– Encourage profiling the agent’s performance. Possibly run a load test with a certain number of parallel requests to find at what point things slow. Identify bottleneck: usually the LLM API call (which you can’t speed up except by using faster model or more replicas). If a local model, maybe GPU is 100% utilized at X requests/sec. Solutions: add GPUs for scale, or pick a smaller model with faster inference if possible.**





#### **7.2.5 实操练习 – Cost Analysis:**

####  **Give students a scenario with specific numbers: e.g. “Our agent uses GPT-4, which costs ~$0.06 per 1K tokens. Each conversation turn averages 800 tokens (user + response). If we expect 1000 conversations per day with ~5 turns each, what is the daily cost? How about monthly? Now consider using GPT-3.5 ($0.002 per 1K). Recalculate. Would quality trade-off be worth 30x cost reduction?” Let them compute and think. Perhaps they present their reasoning in a few sentences. This trains them to estimate and be mindful of cost, an important business aspect.**





### **7.3 Domain-Specific Deployment Scenarios**







#### **7.3.1 Agent for Operations Automation**

####  **– Example: an AI Ops agent that monitors logs and takes actions. How to integrate it with existing IT systems (it might need access to monitoring tools, incident management). Also reliability: it should likely run continuously and be thoroughly tested because mistakes could cause outages. Possibly mention an event-driven design: agent triggers on certain events rather than constant queries.**





#### **7.3.2 Customer Service Agent**

####  **– If deploying to customers (end-users), stakes are high for correct and safe answers. You’d put more guardrails, maybe human handoff: e.g. agent tries to answer, but if confidence low or user asks to speak to human, route to human. Also compliance: ensure it doesn’t violate privacy (maybe mask certain data). And support multiple languages if needed.**





#### **7.3.3 Finance/Risk Agent**

####  **– Domain constraints: e.g. a trading agent might have to be certified or limited by regulations (cannot execute certain trades without human). Emphasize domain knowledge needed to embed: the agent might require a knowledge base of policies. Also, heavy logging and audit trail needed in these industries to explain what the agent did (because of compliance).**





#### **7.3.4 Education/Tutoring Agent**

####  **– Focus on pedagogy: the agent’s goal isn’t just to give answer but to teach. So it might be measured on different metrics (student improvement). Possibly need to adapt to different learning paces. Also, risk: giving incorrect info to a student can be harmful (learning wrong thing), so maybe double-check answers via some verification (like using a curated knowledge base for factual questions).**





#### **7.3.5科研/知识助理 Agent**

####  **– For researchers or writers, an agent that helps with literature review or drafting. Requirements: connecting to academic databases (tools), keeping track of references (the agent should not hallucinate citations – maybe integrate with a library API to fetch real references). Also, allow user to iteratively refine (so agent needs good memory of the conversation context). Possibly mention that tools like Elicit.org do some of this with LLMs.**





#### **7.3.6实操练习 – Industry Use-Case Design:**

####  **Each student (or group) picks one domain (e.g. one of the above or another like “Sales Agent” or “Coding Pair Programmer Agent”) and outlines how they would tailor an agent for it. They should consider: what special tools or knowledge does it need? What failure is unacceptable and how to guard? What’s the ROI – e.g. does it save time, increase revenue? They present a one-page concept. This ties together technical and business considerations and shows understanding of applying agents to real problems.**





### **7.4 Cost, ROI, and Business Models**







#### **7.4.1 Cost Components**

####  **– Break down cost of running an agent service: LLM API or inference compute (likely biggest cost), developer time to maintain it, possibly costs for external APIs (some tools might charge, e.g. a paid search API), and infrastructure (servers, storage for logs). If using a SaaS model for the agent, also sales/marketing overhead.**





#### **7.4.2 Pricing Strategies**

####  **– If one were to sell agent services, how to price? Options: per request (e.g. $ per 100 calls), per month subscription, or outcome-based (if agent completes tasks that save X money, maybe charge fraction of that). Many current agent products (like those 10 best AI agent platforms** 

#### 

#### **) have subscription tiers or usage-based pricing. Discuss a couple examples (maybe Manus or others if info available on pricing).**





#### **7.4.3 Measuring ROI**

####  **– For a business using an agent, how to measure return? If an ops agent reduces incidents by 20%, that might save Y hours of downtime which = $Z saved. Or a support agent handles 1000 queries that otherwise a human would (so saved N human hours). Outline needing to measure agent success not just by “it works” but by key performance indicators (KPIs) relevant to domain: customer satisfaction in support, conversion rate in sales, etc. This ties to how you justify the project and refine it.**





#### **7.4.4 Future Trends**

####  **– Briefly, discuss what’s on the horizon: improvements in model cost (open-source getting better, cost per token likely dropping), more specialized agents (vertical integration into tools like CRMs, etc.), and regulatory aspects (the EU AI Act might categorize some autonomous agents as high risk if they make decisions impacting humans). So business has to keep eye on compliance and evolving tech.**





#### **7.4.5实操练习 – ROI Calculation:**

####  **Give a hypothetical: “A company spends $50k/month on customer support salaries. They implement an AI agent that can handle 30% of tickets, with a running cost of $5k/month for the AI infrastructure. What is the net savings? What other intangible benefits or costs (like 24/7 availability, potential bad answer risk) should be considered?” Students do the basic math ($15k saved minus $5k cost = $10k net saved) and then qualitatively add considerations. This solidifies thinking beyond just tech – into why build this agent at all from a business view.**



*(By end of Module 7, students are equipped to not only build an agent but also deploy and manage it responsibly in a production context, and understand the value proposition.)*





## **Module 8: Learning Path & Capstone Project – Multi-Agent Factory**





- **Module 8 is the capstone of the course, consolidating everything into a substantial project.**

- **项目目标 (Project Objectives):** To design and implement a fully-functional AI agent system that runs sustainably and achieves a chosen goal in a realistic scenario. This capstone should synthesize skills: prompt design, tool integration, multi-agent if applicable, memory, deployment, etc. The project should be ambitious enough to demonstrate engineering and practical utility, yet scoped to a level that a student team can complete in a reasonable time with available resources.

- **项目要求 (Project Requirements):**

  

  - Students (possibly in teams) must propose an agent system addressing a specific use-case (e.g. “AI Research Assistant for Market Analysis” or “Automated DevOps Helper”). The proposal should outline the agent’s **goal, target users, and the tasks it will automate**.
  - The system must include: at least one LLM (could be via API or local), at least two types of tools/integrations (e.g. web search, database, external API, or even hardware if creative), a memory mechanism (long or short-term context handling), and a user interface (CLI, chat UI, etc.) for interaction.
  - **Architecture design document:** They must produce a diagram and description of the system’s architecture (as practiced in Module 7), including how components communicate, and any multi-agent structure if present.
  - **Technical implementation:** Code the agent system, ideally using some frameworks for efficiency but with significant custom logic to meet their specific needs. Use version control and document the code.
  - **Testing & Evaluation:** Develop a small test suite or evaluation plan to demonstrate the agent performs as expected. Also define success metrics for the agent (e.g. accuracy on certain queries, time saved on a task, etc.) and report results from initial runs.
  - **Documentation & demo:** Write a short report or create slides covering what the agent does, how it’s built (choices of models, tools, etc.), and a demo scenario showing it in action (could be a recorded video or a live presentation).

  

- **评估标准 (Evaluation Criteria):**

  

  - *Functionality:* Does the agent meet the objectives set out in the proposal? (e.g. If it’s a scheduler agent, can it successfully schedule meetings given constraints?)
  - *Robustness:* How does it handle unexpected inputs or errors? (In demo or tests, see if it breaks easily or recovers gracefully)
  - *Innovation:* Did the students implement any creative approach or go beyond examples (like a unique tool integration, or a novel multi-agent interaction)?
  - *Use of Course Knowledge:* Does the project clearly incorporate techniques from the course (e.g. effective prompting, memory usage, safe completion guidelines, etc.)?
  - *Documentation & Explanation:* Can the students explain how each part of their system works and why they made those design decisions? Is the code well-documented for maintainability?
  - *Deployment readiness:* While full production deployment isn’t required, projects that show they considered deployment (like running the agent on a cloud service or container, adding monitoring logs, etc.) will be rated higher as they demonstrate a complete engineering mindset.
  - *Impact:* (Bonus) Does the project have potential real-world impact or solve a real problem? Even if a prototype, a clear vision of its value adds to its merit.

  







### **8.1 Progressive Project Milestones**





*(This sub-module outlines the learning path leading to the capstone, ensuring students practice incremental builds.)*





#### **8.1.1 Project 1 – “Hello Agent” (Milestone 1)**

####  **– A very simple agent solving a narrow task. For instance, an agent that given a topic, automatically collects three relevant articles (using a News API) and summarizes them. This gets students feet wet with calling an API and generating text.** 

#### **Skills:**

####  **API tool use, summary prompt, basic loop.**





#### **8.1.2 Project 2 – Tool-Enhanced Agent (Milestone 2)**

####  **– Increase complexity: perhaps an agent that acts like a “Personal Assistant” doing two-step tasks. E.g. “Find me a restaurant and put a reminder on my calendar.” This requires the agent to use a Search tool and a Calendar API. Students implement two tools and handling of multiple sequential actions.** 

#### **Skills:**

####  **Multi-tool coordination, simple memory (carry search result into calendar step).**





#### **8.1.3 Project 3 – Multi-Agent Workshop (Milestone 3)**

####  **– Introduce multi-agent collaboration in a controlled way. For example, a “Dev Assistant” where one agent generates code and another reviews it (pair programming style). The system then outputs the final code if reviewer approves.** 

#### **Skills:**

####  **Multi-agent prompt design, passing messages, using a Critic role.**





#### **8.1.4 Project 4 – Domain-Specific MVP (Milestone 4)**

####  **– Now students focus on their chosen capstone domain. They build a** 

#### **Minimum Viable Product**

####  **version of their final project. For instance, if final is an “AI Travel Planner Agent”, the MVP might only plan flights and hotels for one city (just to prove core logic). This should be working end-to-end albeit with limited scope. They gather initial feedback (maybe peers test it out).** 

#### **Skills:**

####  **Domain knowledge integration, scaling down scope to core value.**



*(By completing these milestones across the course, students are prepared to deliver the full capstone with confidence.)*





### **8.2 Capstone Execution**







#### **8.2.1 Implementation Phase:**

####  **Students now expand their MVP to the full Capstone agent. They add all intended features, refine prompts, and ensure each module (LLM, tools, memory, interface) works in harmony. Instructors mentor as needed, but students should drive design decisions, applying lessons from Modules 1–7.**





#### **8.2.2 Testing Phase:**

####  **They test the agent extensively: create diverse scenarios, adversarial cases (to test safety), and edge cases relevant to the domain. Use logs to debug issues. Possibly conduct user testing with classmates posing as users to get qualitative feedback on usability and usefulness. Iterate based on findings (e.g. if users got confused by agent’s response format, adjust it).**





#### **8.2.3 Deployment/Packaging:**

####  **Prepare the agent for demonstration: if possible, deploy on a cloud or at least run it on a local server accessible via localhost for demo. Ensure any secrets (API keys) are handled securely in code. If deployment is heavy, a recorded video of the agent performing a complex task could suffice, but live demo is encouraged. Package code in a GitHub repository with clear instructions, so others can run it.**





#### **8.2.4 Presentation & Review:**

####  **Each team presents their project: context (what problem does it solve?), demo of agent in action, architecture and technical highlights, and any results (metrics or improvements achieved). They should also discuss limitations and next steps, showing understanding that no agent is perfect yet. A Q&A follows where evaluators or peers ask about design choices or how it handles certain situations, and the team responds, demonstrating deep knowledge of their project.**



*(This capstone presentation simulates a pitch of an AI product and an engineering review, giving students experience in defending and explaining their work.)*





### **8.3 Completion and Next Steps**







#### **8.3.1 Reflective Analysis:**

####  **After project completion, students write a brief reflection: What was the hardest challenge? What would they do with 3 more months? This instills continuous learning mindset.**





#### **8.3.2 Course Wrap-Up:**

####  **Summarize the journey from theory to practice. Reiterate how the modules built up their competencies to create something potentially impactful. Encourage them to continue updating their agent with new techniques as the field evolves (maybe mention that in 2025 and beyond, new frameworks or more efficient models will come, so keep learning!).**





#### **8.3.3 Showcase and Networking:**

####  **Students are encouraged to share their projects (on GitHub or personal blog) as part of a portfolio, and perhaps reach out to the open-source or professional community (e.g. if they built a great CRM agent, maybe share with that product’s community or even contribute to a related project). The course might culminate in a showcase event where industry folks are invited to see demos, giving students exposure and feedback from outside the classroom.**





- *This capstone ties together the course’s full* ***理论→技术→工程→产品\*** *loop: from understanding concepts to implementing algorithms, engineering a system, and considering product impact.* Students finishing this will have not just learned about AI agents but actually built one, positioning them strongly for careers or ventures in this cutting-edge field.