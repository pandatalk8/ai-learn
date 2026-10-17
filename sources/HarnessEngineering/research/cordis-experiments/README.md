# Cordis 源码行为实验

日期：2026-10-01。Node.js v25.6.0，esbuild 0.28.0，Vitest 4.1.5。

研究对象：

- 上游 `cordiverse/cordis`：`f8ea3cd50f1a5724e8e715995bcde131c9c12b2c`，core 包声明 `4.0.0-rc.10`。
- Harness `deepseek-ai/deepseek-harness`：`639ed015397290b3745d163aafe02ffee4aa3f84`，使用其 `vendor/cordis` 和 `vendor/cosmokit`。

`probe.mjs` 含 10 组行为实验。普通行为包含断言；版本差异以观测值输出，不把差异伪装成兼容性失败。JSON 是实际运行结果。资源关闭使用内存标记与手动 Promise 闸门模拟，不连接真实数据库。

验证范围：上游 core 的 12 个测试文件、87 个测试全部通过；两版各运行上述 10 组实验。没有运行完整 Loader、HMR、Harness 集成测试、浏览器测试或性能基准。上游测试使用简化 Vitest 配置，省去与 core 无关的 YAML/Node 内部模块钩子，并用 esbuild 转换标准装饰器；首次未经此转换的运行有一个装饰器解析失败，调整测试运行器后全部通过。未修改上游测试或实现。

## 复现

以下在独立临时目录安装研究依赖，不修改项目依赖。`CORDIS_REPORT` 指向本目录。

```sh
CORDIS_REPORT=/Users/wanghe/workspace/Projects/HarnessEngineering/research/cordis-experiments
CORDIS_LAB=$(mktemp -d /tmp/cordis-lab.XXXXXX)
cd "$CORDIS_LAB"
npm install --no-audit --no-fund --ignore-scripts vitest@4.1.5 esbuild@0.28.0 cosmokit@1.8.1 @standard-schema/spec@1.1.0

git init cordis
git -C cordis fetch --depth 1 https://github.com/cordiverse/cordis.git f8ea3cd50f1a5724e8e715995bcde131c9c12b2c
git -C cordis checkout --detach FETCH_HEAD
git init harness
git -C harness fetch --depth 1 https://github.com/deepseek-ai/deepseek-harness.git 639ed015397290b3745d163aafe02ffee4aa3f84
git -C harness sparse-checkout set vendor
git -C harness checkout --detach FETCH_HEAD

./node_modules/.bin/esbuild cordis/packages/core/src/index.ts --bundle --platform=node --format=esm --outfile=upstream.mjs
./node_modules/.bin/esbuild harness/vendor/cordis/src/index.ts --bundle --platform=node --format=esm --alias:@deepseek-ai/cosmokit="$CORDIS_LAB/harness/vendor/cosmokit/src/index.ts" --outfile=harness.mjs

node "$CORDIS_REPORT/probe.mjs" "$CORDIS_LAB/upstream.mjs"
node "$CORDIS_REPORT/probe.mjs" "$CORDIS_LAB/harness.mjs"

cp "$CORDIS_REPORT/vitest.config.mjs" ./vitest.config.mjs
CORDIS_SOURCE="$CORDIS_LAB/cordis" ./node_modules/.bin/vitest run --config ./vitest.config.mjs
```

依赖安装不附带完整环境锁文件；这是源码行为复现实验，不是发布构建。上游依赖使用 npm Cosmokit 1.8.1；Harness 使用同一提交自带的 Cosmokit。测试记录见 `core-tests.txt`，两个 JSON 分别保存上游和 Harness 的探针输出。
