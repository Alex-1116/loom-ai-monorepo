# monorepo 项目结构设计摘要

```
my-enterprise-monorepo/
├── apps/                      # 独立部署的应用程序 (消费者)
│   ├── web/                   # 面向 C 端的官网/主应用 (Next.js)
│   ├── admin/                 # 面向 B 端的管理后台 (React/Vite)
│   ├── mobile/                # 移动端应用 (React Native / Expo)
│   ├── docs/                  # 项目官方文档 (Docusaurus / Nextra)
│   └── api/                   # BFF 层或后端服务 (NestJS / Express)
│
├── packages/                  # 内部共享的 NPM 包 (生产者，被 apps 消费)
│   ├── ui/                    # 基础 UI 组件库 (封装 shadcn/ui, Radix 等)
│   ├── core/                  # 核心业务逻辑 (API 客户端, 状态管理, 业务模型)
│   ├── hooks/                 # 共享的 React Hooks 集合
│   ├── utils/                 # 纯函数工具库 (日期格式化、数学计算等)
│   ├── types/                 # 全局共享的 TypeScript 类型定义
│   ├── database/              # 数据库 Schema、Prisma/Drizzle Client
│   └── icons/                 # 统一封装的图标库
│
├── tooling/                   # 工程化与构建配置 (收敛所有规范)
│   ├── eslint-config/         # 统一的 ESLint 规范
│   ├── typescript-config/     # 统一的 TSConfig 规范
│   ├── tailwind-config/       # 统一的 Tailwind CSS 主题和插件配置
│   ├── prettier-config/       # 统一的代码格式化规范
│   └── jest-config/           # 统一的测试配置
│
├── scripts/                   # 内部 CLI 工具和自动化脚本
│   ├── generate-app/          # 快速生成新 app 的脚手架
│   ├── release/               # 自动化发版脚本 (Changesets / Lerna)
│   └── ci/                    # 供 CI/CD 环境调用的特定脚本
│
├── .github/                   # CI/CD 工作流 (GitHub Actions)
│   └── workflows/
│       ├── ci.yml             # PR 检查 (Lint, Typecheck, Test)
│       └── release.yml        # 自动化部署与发布
│
├── .changeset/                # 版本控制与 Changelog 管理工具配置
├── package.json               # 根依赖 (通常仅包含全局的工程化工具)
├── pnpm-workspace.yaml        # 包管理器工作区配置 (定义 packages 路径)
└── turbo.json                 # 任务调度器配置 (定义任务的依赖关系与缓存策略)
```

```
enterprise-console-monorepo/
├── apps/
│   ├── shell/                 # 微前端基座 (Base App)，负责路由分发、鉴权、全局导航
│   ├── app-dashboard/         # 子应用：大盘监控 (独立团队维护)
│   ├── app-user-center/       # 子应用：用户中心 (独立团队维护)
│   └── app-billing/           # 子应用：计费中心 (独立团队维护)
│
├── libs/                      # 业务/基础库 (Nx 中通常叫 libs)
│   ├── shared/                # 跨应用的共享模块
│   │   ├── auth/              # 统一的 SSO 鉴权逻辑
│   │   ├── request/           # 封装的 Axios 实例 (带统一拦截器)
│   │   └── constants/         # 全局错误码、枚举值
│   ├── design-system/         # 内部定制的组件库 (基于 AntD / Arco Design 二次封装)
│   ├── business-components/   # 业务组件 (如：带有业务逻辑的员工选择器、部门树)
│   └── i18n/                  # 国际化文案字典和工具
│
├── tools/                     # 自研的工程化工具
│   ├── generators/            # 模板生成器 (生成标准化的微前端子应用)
│   └── executors/             # 自定义的构建脚本 (如：微前端模块联邦的 webpack 插件封装)
│
├── common/                    # Rush.js 专用的公共配置目录
│   ├── config/                # Rush 全局策略配置
│   └── temp/                  # 统一的幽灵依赖幽灵目录
└── rush.json                  # Rush 配置文件
```

```
mega-repo/
├── product_a/                 # 产品线 A
│   ├── frontend/              # A 的前端
│   ├── backend/               # A 的后端 (Go/Java)
│   └── BUILD.bazel            # 细粒度的构建描述文件
│
├── product_b/                 # 产品线 B
│   ├── web/                   # B 的 Web 端
│   ├── ios/                   # B 的 iOS 端 (Swift)
│   └── android/               # B 的安卓端 (Kotlin)
│
├── third_party/               # 所有第三方依赖的统一收口
│   ├── npm/                   # Node.js 依赖
│   ├── python/                # Python 依赖
│   └── rust/                  # Rust 依赖
│
└── infra/                     # 公司级基础设施
    ├── design_system/         # 跨平台的设计系统
    ├── logging/               # 统一打点和日志上报
    ├── rpc/                   # gRPC / Thrift 定义文件 (proto/thrift)
    └── build_rules/           # 构建规则定义
```

```
framework-monorepo/
├── packages/                  # 核心包
│   ├── core/                  # 框架核心逻辑 (极小体积，无副作用)
│   ├── react/                 # React 适配层 (React Hooks)
│   ├── vue/                   # Vue 适配层
│   ├── server/                # 服务端核心
│   └── cli/                   # 命令行工具
│
├── plugins/                   # 官方维护的插件生态
│   ├── plugin-auth/           # 鉴权插件
│   ├── plugin-cache/          # 缓存插件
│   └── plugin-metrics/        # 监控插件
│
├── examples/                  # 演示和测试用例 (非常重要)
│   ├── with-nextjs/           # Next.js 接入示例
│   ├── with-express/          # Express 接入示例
│   └── with-vite/             # Vite 接入示例
│
├── e2e/                       # 跨包的端到端测试 (Playwright / Cypress)
└── docs/                      # 框架官方文档
```
