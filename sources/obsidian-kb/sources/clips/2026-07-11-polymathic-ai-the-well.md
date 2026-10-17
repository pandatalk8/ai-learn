---
title: "The Well：15TB 物理仿真机器学习数据集"
original_title: "The Well: a Large-Scale Collection of Diverse Physics Simulations for Machine Learning"
author: "Polymathic AI / The Well contributors"
source_url: "https://github.com/PolymathicAI/the_well"
source_platform: GitHub
published: 2024-12-02
captured: 2026-07-11
type: open-source-dataset
lang: en
status: source-summary-with-claim-audit
repository_commit: "0795c20913fb5e3ecf99a56d7bbc78b653313987"
package_version: "1.2.1"
paper: "NeurIPS 2024 Datasets and Benchmarks, arXiv:2412.00568v2"
license: "数据 CC-BY-4.0；仓库软件 BSD-3-Clause；部分原始仿真代码未公开"
tags: [ai-for-science, physics-simulation, pde, surrogate-model, scientific-machine-learning, open-data, pytorch, hdf5]
---

# The Well：15TB 物理仿真机器学习数据集

## 来源边界

本文是对 `PolymathicAI/the_well`、项目文档和论文的本地来源记录，不是官方文档的全文转载。

- 仓库：https://github.com/PolymathicAI/the_well
- 文档：https://polymathic-ai.org/the_well/
- 数据概览：https://polymathic-ai.org/the_well/datasets_overview/
- Hugging Face：https://huggingface.co/collections/polymathic-ai/the-well-67e129f4ca23e0447395d74c
- 论文：https://arxiv.org/abs/2412.00568
- NeurIPS：https://proceedings.neurips.cc/paper_files/paper/2024/hash/4f9a5acd91ac76569f2fe291b1f4772b-Abstract-Datasets_and_Benchmarks_Track.html
- 本次检查提交：`0795c20`（2026-07-06）

## 官方发布内容

The Well 是 Polymathic AI 牵头建设的时空物理仿真数据集合。论文和项目文档采用“16 个数据集、总计 15TB”的官方口径；单项规模从 6.9GB 到 5.1TB。数据存为统一规格的 HDF5，主要是二维或三维网格上的时序物理场，并提供元数据、训练/验证/测试划分、统计量、可视化 notebook、下载工具和 PyTorch 接口。

论文中的主要物理场景包括：

| 数据集/家族 | 物理问题 |
|---|---|
| `acoustic_scattering` | 复杂介质和几何中的声学散射 |
| `active_matter` | 主动物质与生物启发系统 |
| `convective_envelope_rsg` | 红超巨星对流包层的辐射流体动力学 |
| `euler_multi_quadrants` | 可压缩 Euler 方程、激波与稀疏波 |
| `gray_scott_reaction_diffusion` | Gray–Scott 反应扩散与自组织图样 |
| `helmholtz_staircase` | 周期结构上的 Helmholtz 散射 |
| `MHD` | 星际介质的磁流体湍流，64³/256³ |
| `planetswe` | 行星尺度浅水方程与大气动力学 |
| `post_neutron_star_merger` | 中子星并合后吸积盘、磁流体与中微子输运 |
| `rayleigh_benard` | Rayleigh–Bénard 热对流 |
| `rayleigh_taylor_instability` | Rayleigh–Taylor 不稳定性与湍流混合 |
| `shear_flow` | 剪切流不稳定性与湍流 |
| `supernova_explosion` | 超新星爆炸与星际介质冲击波，64³/128³ |
| `turbulence_gravity_cooling` | 湍流、引力与冷却共同作用的星际介质 |
| `turbulent_radiative_layer_2D/3D` | 湍流混合层与辐射冷却 |
| `viscoelastic_instability` | 黏弹性流动与弹性惯性湍流 |

“16”是项目的正式集合口径，不应直接用仓库目录数或 Hugging Face repo 数复算：声学场景被拆成多个配置，MHD/超新星有多个分辨率，二维/三维版本和修正版也可能分别出现。当前仓库还保留已弃用的 `viscoelastic_instability`，推荐使用修正后的 `viscoelastic_instability_v2`。

## 数据如何进入训练管线

安装 `the_well` 后，数据可以先下载到本地，也可以通过 Hugging Face 的 `hf://` 路径流式读取。`WellDataset` 实现 PyTorch map-style Dataset，`WellDataModule` 可创建 train/validation/test DataLoader。

```python
from the_well.data import WellDataset
from torch.utils.data import DataLoader

trainset = WellDataset(
    well_base_path="hf://datasets/polymathic-ai/",
    well_dataset_name="active_matter",
    well_split_name="train",
)
train_loader = DataLoader(trainset)
```

“随时可以导入 DataLoader”基本准确，但不代表 15TB 数据可以无成本即插即用。初始化远程数据可能需要数分钟，大规模训练时官方建议下载到本地；用户仍需足够的存储、带宽、内存/GPU 和适配具体物理场的训练设计。

## 计算成本的证据

项目确实汇集了普通研究者难以独立重建的计算资产，但不同数据集的成本相差很大：

- `convective_envelope_rsg`：官方数据说明给出约两个月、80 个 NASA Pleiades Skylake CPU 节点，约一千万 CPU 小时。
- `post_neutron_star_merger`：每次仿真约三周、300 CPU 核，运行于 Los Alamos 的集群等超级计算设施。
- `supernova_explosion`：单批使用最高 1,040 CPU 核。
- `turbulent_radiative_layer_3D`：全部仿真约 34,560 CPU 小时。
- 也有较便宜的任务，例如 `active_matter` 的单次仿真约 20 分钟 A100，最小数据集仅 6.9GB。

因此，“需要国家实验室和数百万美元才能重现”不能作为整个集合的统一事实表述。论文证实的是部分场景需要国家实验室、NASA 或大型 HPC 资源以及数周到数月计算；官方没有给出“数百万美元”的总成本估价。

## 代理模型到底替代什么

The Well 重点评测 PDE/物理动力学代理模型：从若干历史时间步预测下一物理状态，再通过滚动得到后续轨迹。论文基线包括 FNO、TFNO、U-Net 和 ConvNeXt U-Net。

代理模型训练完成后，推理通常比再次运行高保真数值求解器快得多。但“用一次前向传播替代价值数百万美元的求解器”并不严谨：

- 一次前向传播通常只预测下一时间步；长时间轨迹常需多次自回归前向传播。
- 模型是近似器，不自动继承数值求解器的守恒、稳定性、边界条件和误差保证。
- 代理模型需要先支付训练成本，并且只能在训练分布和验证范围内谨慎使用。
- The Well 的作用是提供训练与统一比较的基础设施，不是交付已经验证可替代所有求解器的模型。

## 机构与资助

论文作者机构包括 Polymathic AI、Flatiron Institute、University of Colorado Boulder、University of Cambridge、New York University、Rutgers University、MIT、Cornell University、University of Tokyo、Los Alamos National Laboratory、University of California Berkeley、Princeton University、CEA DAM 和 University of Liège。

所以“Flatiron Institute + 11 所大学”并不准确：参与者既包括大学，也包括国家实验室和研究机构。项目组织获得 Simons Foundation、Schmidt Sciences 资助及 NVIDIA 算力捐赠；各数据集贡献者另有 NASA、LANL、EPSRC、MEXT/Fugaku 等项目支持。

## 开放性与许可证

- The Well 数据集：论文数据说明标注为 **CC BY 4.0**。
- `the_well` 软件仓库：当前 `LICENSE` 为 **BSD 3-Clause**。
- 数据可免费分项下载或从 Hugging Face 访问。
- 但论文明确说明，部分数据由专有仿真代码生成，原始生成代码无法发布。

因此，更准确的说法是“数据和统一工具链开放”，而不是“从原始求解器到全部生成流程 100% 开源”。复用具体数据时仍应查看相应数据卡、引用要求和生成说明。

## 用户提供的传播文案：核验结果

| 说法 | 结论 |
|---|---|
| 15TB、16 个数据集 | 官方口径支持 |
| 覆盖流体、MHD、超新星、声学、主动物质等 | 支持 |
| 普通研究者难以独立重建 | 对部分高成本数据集成立，不能等量概括所有数据集 |
| 需要国家实验室和数百万美元 | 国家实验室/HPC 有证据；数百万美元无官方估价支持 |
| 一次前向传播替代求解器 | 过度简化；常为单步预测并需自回归滚动 |
| 可直接导入 DataLoader | 基本支持，但需要安装、数据访问和足够计算/存储资源 |
| 100% 开源 | 数据与工具开放；部分生成代码未开放 |

## 本知识库中的解读

- Wiki 深度解读：[[wiki/sources/2026-07-11-polymathic-ai-the-well]]
- 相关主题：PDE 代理模型、神经算子、科学机器学习、AI for Science、物理基础模型
