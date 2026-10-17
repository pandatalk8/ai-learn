---
title: "图像文字识别（OCR）"
type: concept
status: reviewed
created: 2026-09-02
updated: 2026-09-02
tags: [OCR, 计算机视觉, 移动端AI, 文档解析, PaddleOCR]
aliases: [OCR, 图片文字提取, 移动端OCR, Optical Character Recognition]
sources:
  - sources/clips/2026-09-02-mobile-ocr-official-sources.md
related:
  - "[[AI技术]]"
confidence: medium
---

# 图片文字提取：OCR 模型选型与训练指南

输入一张图片并提取其中的文字，这类任务通常称为 OCR（Optical Character Recognition，光学文字识别）。绝大多数情况下不建议从零训练模型，应先使用开源预训练模型建立基线，再根据具体业务图片进行微调。

本文的模型能力、移动端部署方式、许可证和维护状态，统一以本地资料汇编 `sources/clips/2026-09-02-mobile-ocr-official-sources.md` 中记录的官方文档、官方模型卡和项目仓库为事实来源。相关信息采集于 2026-09-02，实际采用前应重新核对目标版本。

## 一、先判断 OCR 场景

| 输入场景 | 推荐方案 |
| --- | --- |
| 截图、照片、票据，需要文字和坐标 | 文字检测模型 + 文字识别模型 |
| 已裁剪成单行文字的小图片 | 只使用文字识别模型 |
| PDF、论文、表格、公式，需要还原排版 | 文档解析模型或 OCR-VLM |
| 特殊字体、工业字符、固定业务单据 | 预训练 OCR + 业务数据微调 |

## 二、可以直接使用的开源模型

### 1. 中文通用 OCR：PP-OCRv6

中文截图、照片和票据识别可以优先测试 PP-OCRv6。

- 支持中文、英文、日文等多语言。
- 能返回文字内容、坐标和置信度。
- 提供 tiny、small、medium 三种规模，覆盖边缘设备到服务器部署。
- 相比生成式视觉语言模型，通常推理更快，也更不容易根据上下文“猜字”。
- Hugging Face 提供独立的[检测模型](https://huggingface.co/PaddlePaddle/PP-OCRv6_medium_det_safetensors)和[识别模型](https://huggingface.co/PaddlePaddle/PP-OCRv6_medium_rec_safetensors)。
- 官方提供训练权重、训练配置和导出流程，参见 [PP-OCRv6 官方说明](https://www.paddleocr.ai/main/en/version3.x/algorithm/PP-OCRv6/PP-OCRv6.html)。

安装：

```bash
pip install paddleocr
# PaddlePaddle 需要根据 CPU 或 CUDA 环境单独安装
```

最简单的 Python 调用方式：

```python
from paddleocr import PaddleOCR

ocr = PaddleOCR(
    use_doc_orientation_classify=False,
    use_doc_unwarping=False,
    use_textline_orientation=False,
)

results = ocr.predict("test.png")

for result in results:
    result.print()
    result.save_to_json("output")
    result.save_to_img("output")
```

默认使用 PP-OCRv6 medium，适合先做基线测试。

（来源：`sources/clips/2026-09-02-mobile-ocr-official-sources.md`，“PaddleOCR 与 PP-OCRv6”）

### 2. 整页文档转 Markdown：PaddleOCR-VL-1.6

如果图片是论文、书页、合同、表格或带公式的页面，可以使用 [PaddleOCR-VL-1.6](https://huggingface.co/PaddlePaddle/PaddleOCR-VL-1.6)。

它是约 1B 参数的多语言文档解析模型，支持文字、表格、公式、图表、印章和版面结构，采用 Apache-2.0 许可证。

安装：

```bash
pip install "paddleocr[doc-parser]>=3.6.0"
```

将文档解析为 JSON 和 Markdown：

```python
from paddleocr import PaddleOCRVL

pipeline = PaddleOCRVL(pipeline_version="v1.6")
results = pipeline.predict("document.png")

for result in results:
    result.print()
    result.save_to_json("output")
    result.save_to_markdown("output")
```

如果只是提取普通图片里的文字，PP-OCRv6 通常更轻、更稳定；需要恢复版面结构时再使用 PaddleOCR-VL。

（来源：`sources/clips/2026-09-02-mobile-ocr-official-sources.md`，“PaddleOCR 与 PP-OCRv6”）

### 3. Hugging Face Transformers 模型

还可以考虑以下模型：

- [GOT-OCR-2.0-hf](https://huggingface.co/stepfun-ai/GOT-OCR-2.0-hf)：约 0.6B 参数，支持多语言、整页 OCR、指定区域 OCR、Markdown、LaTeX、表格和公式。
- [microsoft/trocr-base-handwritten](https://huggingface.co/microsoft/trocr-base-handwritten)：适合已经裁剪好的单行手写文字，不适合直接处理包含大量文本框的整张图片。
- [Nanonets-OCR-s](https://huggingface.co/nanonets/Nanonets-OCR-s)：偏向把复杂文档转换为结构化 Markdown。

如果需要文字坐标、批量高并发，或者要求严格忠于图片内容，传统的“检测 + 识别”流水线通常比生成式 OCR-VLM 更合适。生成式模型可能出现漏字、改字或幻觉。

（来源：`sources/clips/2026-09-02-mobile-ocr-official-sources.md`，“Hugging Face 上的端到端 OCR 模型”）

## 三、手机端可以实现 OCR 的开源项目

现在的手机能够直接完成 OCR，主要不是因为手机运行了大型视觉语言模型，而是因为传统 OCR 模型已经足够小，并且手机芯片、ARM SIMD、GPU/NPU 和 Core ML 等推理能力已经比较成熟。

典型的本地处理链路是：

```text
摄像头或相册图片
        ↓
图片缩放、旋转和透视校正
        ↓
文字检测模型
        ↓
裁剪每个文字区域
        ↓
文字识别模型
        ↓
文字、坐标、置信度
```

这种方案可以完全离线运行，不需要把用户的照片上传到服务器，适合隐私敏感、弱网和低延迟场景。

（来源：`sources/clips/2026-09-02-mobile-ocr-official-sources.md`，“PaddleOCR 与 PP-OCRv6”）

### 1. PaddleOCR 官方 Android/iOS Demo

项目地址：[PaddlePaddle/PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR)

这是目前最值得优先采用的方案，尤其适合中文 OCR。

| 项目 | 实现方式 |
| --- | --- |
| Android | Kotlin、Jetpack Compose、OpenCV、ONNX Runtime |
| iOS | SwiftUI、OpenCV、ONNX Runtime |
| 模型 | PP-OCRv6 tiny/small、PP-OCRv5 mobile |
| 输出 | 文字、文字框坐标、置信度 |
| 部署 | 完全离线，可嵌入 App |
| 许可证 | Apache-2.0，仍需核对打包的第三方依赖许可证 |

PaddleOCR 官方的 [Android 部署示例](https://www.paddleocr.ai/latest/en/version3.x/inference_deployment/cross_platform/android_deployment.html) 位于：

```text
PaddleOCR/deploy/ppocr-android
```

它已经实现完整的检测和识别流水线，支持 PP-OCRv6 ONNX 模型，可以作为源码模块使用，也可以构建为 AAR 后集成到其他 Android 应用。当前示例要求 Android 8.0（API 26）或更高版本。

```bash
git clone https://github.com/PaddlePaddle/PaddleOCR.git
cd PaddleOCR/deploy/ppocr-android

# 构建 Demo APK
./gradlew :app:assembleDebug

# 或构建可集成的 AAR
./gradlew :ppocr-sdk:assembleRelease
```

Android 端调用形式类似：

```kotlin
val ocr = PaddleOCR.create(context)
val result = ocr.recognize(imageBytes)

result.results.forEach { item ->
    println("Text: ${item.text}")
    println("Confidence: ${item.confidence}")
    println("Box: ${item.box.points}")
}

ocr.release()
```

官方的 [iOS 部署示例](https://www.paddleocr.ai/latest/en/version3.x/inference_deployment/cross_platform/ios_deployment.html) 位于：

```text
PaddleOCR/deploy/ios_demo
```

它使用 SwiftUI 和 ONNX Runtime Objective-C API 在设备本地执行检测与识别，支持 `PP-OCRv6_small`、`PP-OCRv6_tiny` 和 `PP-OCRv5_mobile`。当前示例以 iOS 16+ 和 Xcode 16+ 为开发环境。

```bash
cd PaddleOCR/deploy/ios_demo
pod install
./scripts/fetch_ios_demo_models.sh PP-OCRv6_small
open PaddleOCRDemo.xcworkspace
```

模型选择建议：

- `PP-OCRv6_tiny`：优先考虑安装包大小、内存和速度。
- `PP-OCRv6_small`：在较新的手机上平衡准确率与速度，适合作为默认选择。
- `PP-OCRv6_medium`：更适合服务器或性能较强的设备，不建议一开始就放进普通手机 App。

### 2. ncnn + PP-OCR

推理框架：[Tencent/ncnn](https://github.com/Tencent/ncnn)

Android 示例：[nihui/ncnn-android-ppocrv5](https://github.com/nihui/ncnn-android-ppocrv5)

ncnn 是腾讯开源的移动端神经网络推理框架，采用纯 C++ 实现，没有复杂的第三方运行时依赖，支持 ARM NEON、多核 CPU 和 Vulkan GPU，许可证为 BSD-3-Clause。

`ncnn-android-ppocrv5` 提供了可直接用 Android Studio 构建的相机 OCR 示例，其基本模型转换链路是：

```text
PaddleOCR 模型
      ↓
ONNX
      ↓
pnnx
      ↓
ncnn .param + .bin
      ↓
Android NDK/C++ 推理
```

它适合以下场景：

- 对 APK 体积、启动速度和运行内存比较敏感。
- 希望主要使用 C++/NDK 实现推理层。
- 需要从摄像头视频流持续识别，而不是偶尔识别单张照片。
- 愿意自行处理模型转换、算子兼容和后处理代码。

需要注意，`ncnn-android-ppocrv5` 是社区示例，而不是 PaddleOCR 官方 Android SDK。正式产品应检查该仓库自身、模型文件和依赖组件的许可证，并在目标手机上验证精度及性能。

（来源：`sources/clips/2026-09-02-mobile-ocr-official-sources.md`，“ncnn 与 Android PP-OCR 示例”）

### 3. RapidOCR

项目地址：[RapidAI/RapidOCR](https://github.com/RapidAI/RapidOCR)

RapidOCR 将 PaddleOCR 等模型转换为兼容性较好的 ONNX 格式，并提供 Python、C++、Java、C# 等多语言实现。仓库中包含 Android、iOS、C++、JVM 和 .NET 等目录，适合希望复用同一套模型和接口实现多平台部署的团队。

主要特点：

- 默认支持中文和英文。
- 支持离线部署。
- 可选择 ONNX Runtime、MNN、PaddlePaddle、OpenVINO 等推理后端。
- 工程代码采用 Apache-2.0 许可证；模型版权和许可证需要分别核对。
- 如果模型精度不足，可以在 PaddleOCR 中微调，再转换到 RapidOCR 的部署格式。

RapidOCR 更像跨平台 OCR 工具箱。它适合已经有 C++/Java 跨端架构的团队；如果只开发一个 Android 或 iOS App，PaddleOCR 官方示例通常更直接。

（来源：`sources/clips/2026-09-02-mobile-ocr-official-sources.md`，“RapidOCR”）

### 4. Tesseract OCR

核心项目：[tesseract-ocr/tesseract](https://github.com/tesseract-ocr/tesseract)

Android 封装：[adaptech-cz/Tesseract4Android](https://github.com/adaptech-cz/Tesseract4Android)

Tesseract 是成熟的 C++ OCR 引擎，采用 Apache-2.0 许可证，可以完全离线运行。`Tesseract4Android` 提供 Java/JNI 和 AAR 集成方式，并适配较新的 Android Studio 和 Tesseract 版本。

它比较适合：

- 扫描质量较好的印刷体文档。
- 需要成熟的语言训练数据和传统 OCR 参数配置。
- 不希望引入深度学习推理框架。

它不一定适合复杂背景、自然场景照片、扭曲文字、艺术字体和较复杂的中文手机拍照场景。对于这些场景，应优先实测 PP-OCRv6。

iOS 上曾经常用的 `SwiftyTesseract` 已经归档并停止维护，因此不建议把它作为新项目的主要依赖。需要 iOS 开源离线方案时，可以优先使用 PaddleOCR 官方 iOS Demo，或者自行把 `libtesseract` 封装进项目。

（来源：`sources/clips/2026-09-02-mobile-ocr-official-sources.md`，“Tesseract 与移动端封装”）

### 5. OcrLiteAndroidNcnn

项目地址：[benjaminwan/OcrLiteAndroidNcnn](https://github.com/benjaminwan/OcrLiteAndroidNcnn)

这是一个面向 Android 的轻量中文 OCR 示例，采用 DBNet + AngleNet + CRNN，并通过 ncnn 执行推理。项目提供 Kotlin Demo、C++ Native 层和可封装成 AAR 的 Library。

它的优势是体积小、结构容易理解，适合学习移动端 OCR 的检测、方向分类和识别流程。不过模型和工程相对较老，新产品应优先比较 PP-OCRv6 官方 Android Demo，并仔细核对完整源码、模型来源、许可证和最新 Android 工具链兼容性。

（来源：`sources/clips/2026-09-02-mobile-ocr-official-sources.md`，“OcrLiteAndroidNcnn”）

### 6. 哪个项目最值得选

| 需求 | 推荐项目 |
| --- | --- |
| 新开发的中文 Android OCR App | PaddleOCR 官方 Android Demo + PP-OCRv6 small |
| 新开发的中文 iOS OCR App | PaddleOCR 官方 iOS Demo + PP-OCRv6 small |
| 极小模型、低端设备 | PP-OCRv6 tiny 或 ncnn + PP-OCR |
| Android NDK/C++、实时相机流 | ncnn-android-ppocrv5 |
| 同时支持多种语言和开发平台 | RapidOCR |
| 清晰扫描件、传统印刷文档 | Tesseract |
| 学习轻量 OCR 工程实现 | OcrLiteAndroidNcnn |

如果准备做正式产品，建议先以 PaddleOCR 官方 Demo 为起点。它已经提供 Android/iOS 工程、模型下载、SDK 接口和性能测试脚本，能够减少自行拼接预处理、后处理和坐标恢复算法的工作量。

## 四、什么时候需要训练

只有出现以下情况时，才有必要考虑微调：

- 特殊字体、手写体或艺术字识别效果差。
- 工业铭牌、仪表、点阵字符等特殊场景。
- 图片长期存在模糊、反光、扭曲或特殊拍摄角度。
- 业务包含大量生僻字、专有名词或固定格式。
- 现成模型无法满足准确率、速度或模型大小要求。

不建议从零训练，应从 PP-OCRv6 等预训练权重开始微调。

## 五、训练数据如何标注

完整 OCR 系统通常需要两类数据。

### 1. 文字检测数据

标注内容为：

```text
整张图片 + 每一行文字的四边形或多边形坐标
```

检测模型只负责判断文字在哪里，不负责判断具体是什么字。

### 2. 文字识别数据

标注内容为：

```text
裁剪后的单行文字图片 + 完全准确的文字标签
```

例如：

```text
images/00001.jpg    北京市朝阳区
images/00002.jpg    订单编号：A10238
```

如果业务输入已经是裁剪好的固定文字区域，可以只训练识别模型，这会显著降低标注和训练成本。

如果训练端到端文档解析模型，数据则通常是：

```text
整页图片 -> 目标纯文本、Markdown、HTML 或结构化 JSON
```

## 六、推荐训练流程

1. 收集与真实业务一致的图片。
2. 按设备、客户或文档模板划分训练集、验证集和测试集，避免同一模板的相似图片泄漏到测试集。
3. 先用开源模型运行基线测试。
4. 将错误分为漏检、错检、错字、模糊、旋转和特殊字体等类别。
5. 只微调存在问题的模块：
   - 找不到文字：训练检测模型。
   - 找到了但识别错误：训练识别模型。
6. 加入模糊、透视、阴影、压缩、旋转、低分辨率等数据增强。
7. 使用检测 Hmean、字符错误率（CER）、整图准确率、推理延迟和显存占用进行评估。

训练数据量没有适用于所有 OCR 场景的固定阈值。固定模板、字符集有限的任务通常比字体、设备和拍摄环境变化很大的任务更容易收敛。应通过学习曲线和独立测试集决定是否继续增加数据，并优先修正错误标注、缺失标注与训练—生产分布不一致的问题。

PaddleOCR 已提供完整的训练和导出说明：

- [文字检测训练文档](https://www.paddleocr.ai/latest/en/version3.x/module_usage/text_detection.html)
- [文字识别训练文档](https://www.paddleocr.ai/latest/en/version3.x/module_usage/text_recognition.html)

（来源：`sources/clips/2026-09-02-mobile-ocr-official-sources.md`，“PaddleOCR 与 PP-OCRv6”）

## 七、选型结论

- 普通中文图片文字提取：优先使用 **PP-OCRv6**。
- 论文、合同、表格、公式转 Markdown：使用 **PaddleOCR-VL-1.6**。
- 单行手写文字：可以测试 **TrOCR**。
- 手机端离线 OCR：优先从 **PaddleOCR 官方 Android/iOS Demo + PP-OCRv6 small** 开始。
- 极致轻量或实时相机识别：测试 **PP-OCRv6 tiny** 或 **ncnn + PP-OCR**。
- 只有现成模型在特定业务图片上效果不够时，再微调检测模型或识别模型。

## 本地来源

- 官方资料汇编：`sources/clips/2026-09-02-mobile-ocr-official-sources.md`
- 机器关系：`.kb/links/concepts/图像文字识别（OCR）.yaml`
