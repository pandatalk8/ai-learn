# The Path to Ubiquitous AI

By Ljubisa Bajic

Many believe AI is the real deal. In narrow domains, it already surpasses human performance. Used well, it is an unprecedented amplifier of human ingenuity and productivity. Its widespread adoption is hindered by two key barriers: high latency and astronomical cost. Interactions with language models lag far behind the pace of human cognition. Coding assistants can ponder for minutes, disrupting the programmer's state of flow, and limiting effective human-AI collaboration. Meanwhile, automated agentic AI applications demand millisecond latencies, not leisurely human-paced responses.

On the cost front, deploying modern models demands massive engineering and capital: room-sized supercomputers consuming hundreds of kilowatts, with liquid cooling, advanced packaging, stacked memory, complex I/O, and miles of cables. This scales to city-sized data center campuses and satellite networks, driving extreme operational expenses.

Though society seems poised to build a dystopian future defined by data centers and adjacent power plants, history hints at a different direction. Past technological revolutions often started with grotesque prototypes, only to be eclipsed by breakthroughs yielding more practical outcomes.

Consider ENIAC, a room-filling beast of vacuum tubes and cables. ENIAC introduced humanity to the magic of computing, but was slow, costly, and unscalable. The transistor sparked swift evolution, through workstations and PCs, to smartphones and ubiquitous computing, sparing the world from ENIAC sprawl.

General-purpose computing entered the mainstream by becoming easy to build, fast, and cheap.

AI needs to do the same.

## About Taalas

Founded 2.5 years ago, Taalas developed a platform for transforming any AI model into custom silicon. From the moment a previously unseen model is received, it can be realized in hardware in only two months.

The resulting Hardcore Models are an order of magnitude faster, cheaper, and lower power than software-based implementations.

Taalas' work is guided by the following core principles:

### 1. Total specialization

Throughout the history of computation, deep specialization has been the surest path to extreme efficiency in critical workloads.

AI inference is the most critical computational workload that humanity has ever faced, and the one that stands to gain the most from specialization.

Its computational demands motivate total specialization: the production of optimal silicon for each individual model.

### 2. Merging storage and computation

Modern inference hardware is constrained by an artificial divide: memory on one side, compute on the other, operating at fundamentally different speeds.

This separation arises from a longstanding paradox. DRAM is far denser, and therefore cheaper, than the types of memory compatible with standard chip processes. However, accessing off-chip DRAM is thousands of times slower than on-chip memory. Conversely, compute chips cannot be built using DRAM processes.

This divide underpins much of the complexity in modern inference hardware, creating the need for advanced packaging, HBM stacks, massive I/O bandwidth, soaring per-chip power consumption, and liquid cooling.

Taalas eliminates this boundary. By unifying storage and compute on a single chip, at DRAM-level density, our architecture far surpasses what was previously possible.

### 3. Radical simplification

By removing the memory-compute boundary and tailoring silicon to each model, we were able to redesign the entire hardware stack from first principles.

The result is a system that does not depend on difficult or exotic technologies, no HBM, advanced packaging, 3D stacking, liquid cooling, high speed IO.

Engineering simplicity enables an order-of-magnitude reduction in total system cost.

## Early Products

Guided by this technical philosophy, Taalas has created the world's fastest, lowest cost/power inference platform.

Today, we are unveiling our first product: a hard-wired Llama 3.1 8B, available as both a chatbot demo and an inference API service.

Taalas' silicon Llama achieves 17K tokens/sec per user, nearly 10X faster than the current state of the art, while costing 20X less to build, and consuming 10X less power.

We selected the Llama 3.1 8B as the basis for our first product due to its practicality. Its small size and open-source availability allowed us to harden the model with minimal logistical effort.

While largely hard-wired for speed, the Llama retains flexibility through configurable context window size and support for fine-tuning via low-rank adapters (LoRAs).

At the time we began work on our first generation design, low-precision parameter formats were not standardized. Our first silicon platform therefore used a custom 3-bit base data type. The Silicon Llama is aggressively quantized, combining 3-bit and 6-bit parameters, which introduces some quality degradations relative to GPU benchmarks.

Our second-generation silicon adopts standard 4-bit floating-point formats, addressing these limitations while maintaining high speed and efficiency.

## Upcoming models

Our second model, still based on Taalas' first-generation silicon platform (HC1), will be a mid-sized reasoning LLM. It is expected in our labs this spring and will be integrated into our inference service shortly thereafter.

Following this, a frontier LLM will be fabricated using our second-generation silicon platform (HC2). HC2 offers considerably higher density and even faster execution. Deployment is planned for winter.

## Instantaneous AI, in your hands today

Our debut model is clearly not on the leading edge, but we decided to release it as a beta service anyway – to let developers explore what becomes possible when LLM inference runs at sub-millisecond speed and near-zero cost.

We believe that our service enables many classes of applications that were previously impractical, and want to encourage developers to experiment, and discover how these capabilities can be applied.

### On substance, team and craft

At its core, Taalas is a small group of long-time collaborators, many of whom have been together for over twenty years. To remain lean and focused, we rely on external partners who bring equal skill and decades of shared experience. The team grows slowly, with new team members joining through demonstrated excellence, alignment with our mission and respect for our established practices. Here, substance outweighs spectacle, craft outweighs scale, and rigor outweighs redundancy.

Taalas is a precision strike, in a world where deep-tech startups approach their chosen problems like medieval armies besieging a walled city, with swarming numbers, overflowing coffers of venture capital, and a clamor of hype that drowns out clear thought.

Our first product was brought to the world by a team of 24 team members, and a total of just $30M spent, of more than $200M raised. This achievement demonstrates that precisely defined goals and disciplined focus achieve what brute force cannot.

Going forward, we will advance in the open. Our Llama inference platform is already in your hands. Future systems will follow as they mature. We will expose them early, iterate swiftly, and accept the rough edges.

## Conclusion

Innovation begins by questioning assumptions and venturing into the neglected corners of any solution space. That is the path we chose at Taalas.

Our technology delivers step-function gains in performance, power efficiency, and cost.

It reflects a fundamentally different architectural philosophy from the mainstream, one that redefines how AI systems are built and deployed.

Disruptive advances rarely look familiar at first, and we are committed to helping the industry understand and adopt this new operating paradigm.

Our first products, beginning with our hard-wired Llama and rapidly expanding to more capable models, eliminate high latency and cost, the core barriers to ubiquitous AI.

We have placed instantaneous, ultra-low-cost intelligence in developers' hands, and are eagerly looking forward to seeing what they build with it.
