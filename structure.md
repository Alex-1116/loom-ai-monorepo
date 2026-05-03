# Loom AI Monorepo 结构说明

本文档描述当前仓库的 monorepo 组织方式、各个 workspace 的职责，以及常见的协作约定。

## 1. 仓库概览

当前仓库采用 `pnpm workspace + Turborepo` 的 monorepo 结构：

- `pnpm-workspace.yaml` 负责声明工作区范围
- `turbo.json` 负责统一调度 `build`、`dev`、`lint`、`format`、`typecheck`
- 根目录 `package.json` 提供统一入口脚本
- 依赖版本通过 `catalog:` 集中管理，减少多包版本漂移

当前已纳入 workspace 的目录如下：

```text
apps/*
packages/*
tooling/*
```

## 2. 当前目录结构

```text
loom-ai-monorepo/
├── apps/                        # 独立部署的应用程序 (消费者)
│   ├── web/                     # 面向 C 端的官网/主应用 (Next.js)
│   ├── admin/                   # 面向 B 端的管理后台 (React/Vite)
│   └── .../                     # 其他应用 (根据需求添加)
│
├── packages/                    # 内部共享的 NPM 包 (生产者，被 apps 消费)
│   ├── ui/                      # 基础 UI 组件库 (封装 shadcn/ui, Radix 等)
│   ├── core/                    # 核心业务逻辑 (API 客户端, 状态管理, 业务模型)
│   ├── trcp/                    # TRPC 客户端 (与服务器端 TRPC 服务交互)
│   └── prisma/                  # Prisma 数据库客户端 (数据库操作)
│
├── tooling/                     # 工程化与构建配置 (收敛所有规范)
│   ├── eslint-config/           # 统一的 ESLint 规范
│   └── typescript-config/       # 统一的 TSConfig 规范
│
├── scripts/                     # 内部 CLI 工具和自动化脚本
│   ├── catalog/                 # 依赖版本管理 (pnpm-lock.yaml)
│   ├── cleanup/                 # 自动化清理脚本
│   └── ci/                      # 供 CI/CD 环境调用的特定脚本
│
├── .github/                     # CI/CD 工作流 (GitHub Actions)
│   └── workflows/               # 工作流配置目录
│       ├── ci.yml               # PR 检查 (Lint, Typecheck, Test)
│       └── release.yml          # 自动化部署与发布
│
├── .vscode/                     # 工作区级 VS Code 配置
├── package.json                 # 根脚本与全局开发依赖 (通常仅包含全局的工程化工具)
├── pnpm-workspace.yaml          # 包管理器工作区配置 (定义 packages 路径)
├── turbo.json                   # Turborepo 任务编排、任务调度器配置 (定义任务的依赖关系与缓存策略)
├── tsconfig.json                # 根级 TypeScript 配置入口
└── loom-ai.code-workspace       # VS Code 工作区文件
```

## 3. Workspace 角色划分

### `packages/ui`

`packages/ui` 是当前仓库的共享组件包，供应用层统一复用。

主要职责：

- 存放基础 UI 组件，位于 `src/components/`
- 暴露共享 hooks、工具函数和样式资源
- 作为应用层的设计系统基础，减少重复实现

当前导出能力包括：

- `@loom/ui/components/*`
- `@loom/ui/hooks/*`
- `@loom/ui/lib/*`
- `@loom/ui/globals.css`
- `@loom/ui/postcss.config`

当前内部结构大致如下：

```text
packages/ui/
├── src/
│   ├── components/              # 共享组件
│   ├── hooks/                   # 共享 hooks
│   ├── lib/                     # 共享工具函数
│   └── styles/                  # 共享样式
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

### `tooling/eslint-config`

`tooling/eslint-config` 是仓库内部的共享 ESLint 配置包，用来统一代码规范。

主要职责：

- 提供基础规则：`@loom/eslint-config/base`
- 提供 Next.js 规则：`@loom/eslint-config/next-js`
- 提供 React 内部包规则：`@loom/eslint-config/react-internal`

### `tooling/typescript-config`

`tooling/typescript-config` 是仓库内部的共享 TSConfig 包，用来统一 TypeScript 编译约定。

主要职责：

- 提供可复用的基础 tsconfig
- 减少各 workspace 重复维护配置
- 保持应用层与包层的类型检查行为一致

## 4. 根目录职责

根目录不是具体业务代码所在位置，而是 monorepo 的组织层。

主要负责：

- 统一脚本入口，例如 `pnpm dev`、`pnpm lint`、`pnpm typecheck`
- 统一开发依赖，例如 `turbo`、`typescript`、`eslint`、`prettier`
- 统一工程规范，例如 `commitlint`、`lint-staged`、`husky`
- 统一 workspace 编排和缓存策略

根目录常用脚本如下：

```bash
pnpm dev
pnpm build
pnpm lint
pnpm format
pnpm typecheck
pnpm cleanup
pnpm catalog:local
pnpm catalog:official
```

## 5. 依赖关系

当前仓库的依赖流向比较清晰：

```text
apps/web
  └── 依赖 @loom/ui

apps/web / packages/ui
  └── 依赖 @loom/eslint-config
  └── 依赖 @loom/typescript-config

根目录
  └── 统一提供 turbo、typescript、eslint、prettier、husky 等工程能力
```

建议保持以下依赖原则：

- `apps/*` 可以依赖 `packages/*` 和 `tooling/*`
- `packages/*` 可以依赖 `tooling/*`
- `tooling/*` 不依赖业务应用
- 避免 `apps/*` 之间互相依赖

## 6. Turborepo 任务编排

当前 `turbo.json` 定义了以下核心任务：

- `build`：依赖上游包的 `build`
- `lint`：依赖上游包的 `lint`
- `format`：依赖上游包的 `format`
- `typecheck`：依赖上游包的 `typecheck`
- `dev`：关闭缓存并以持久任务运行

这意味着：

- 在根目录执行 `pnpm lint` 时，会按依赖关系执行各 workspace 的 lint
- 在根目录执行 `pnpm typecheck` 时，会统一检查整个仓库
- `dev` 更适合本地持续开发，不参与缓存
