# 工作流画布系统技术评估：自研实现 vs React Flow

## 1. 概述

本文档对 ai-pilot-flow 项目中自研的工作流画布系统进行技术评估，与业界主流开源库 React Flow 进行多维度对比，为后续技术路线决策提供参考。

**评估结论**：当前自研画布系统架构设计合理、交互手感优秀、与业务场景高度契合，已达到生产可用水准，**建议继续沿用自研方案，无需迁移到 React Flow**。

---

## 2. 自研画布系统架构分析

### 2.1 目录结构

```
src/components/workflows/editor/
├── canvas/                    # 画布渲染层
│   ├── canvas-viewport.tsx    # 视口主入口
│   ├── canvas-background.tsx  # 点阵背景
│   ├── canvas-edges-layer.tsx # 连线层 (SVG)
│   ├── canvas-guides-layer.tsx# 对齐辅助线层
│   └── canvas-selection-layer.tsx # 框选层
├── chrome/                    # UI 附着层
│   ├── toolbar/               # 工具栏 (左/下/视图)
│   ├── panels/                # 面板 (节点检查器/大纲/运行预览)
│   └── overlays/              # 浮层 (空状态/缩放指示器)
├── interactions/              # 交互逻辑层
│   ├── hooks/                 # 交互 hooks (拆分细致)
│   │   ├── useCanvasPan.ts
│   │   ├── useCanvasZoom.ts
│   │   ├── useCanvasNodeDrag.ts
│   │   ├── useCanvasSelection.ts
│   │   ├── useCanvasSelectionDrag.ts
│   │   ├── useCanvasEdgeConnection.ts
│   │   ├── useCanvasSnapping.ts
│   │   ├── useCanvasNodeMeasurements.ts
│   │   └── useCanvasViewportControls.ts
│   └── utils/                 # 交互计算工具
├── nodes/                     # 节点系统
│   ├── shell/                 # 节点统一外壳
│   ├── blocks/                # 具体节点块 (image/video/3d/tool)
│   ├── registry/              # 节点注册中心
│   └── shared/                # 节点共用组件
├── model/                     # 模型层
│   ├── types/                 # TypeScript 类型定义
│   ├── schema/                # 校验 schema
│   └── constants/             # 常量与工具定义
├── services/                  # 领域服务
│   ├── serializer/            # 序列化/反序列化
│   ├── validators/            # 校验器
│   └── layout/                # 自动布局
└── state/                     # 状态管理
    ├── workflow-editor-store.ts
    ├── workflow-editor-actions.ts
    ├── workflow-editor-history.ts
    └── workflow-editor-selectors.ts
```

### 2.2 核心设计亮点

#### 2.2.1 视口坐标系统

采用**"世界原点固定在屏幕中心 + viewport 偏移"**模型：

```tsx
// canvas-viewport.tsx:809-816
transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`,
transformOrigin: "0 0",
```

相比 React Flow 默认的左上角原点模型，居中坐标系天然适合画布类应用，缩放时围绕点计算更直观。

#### 2.2.2 缩放交互调教

- **围绕鼠标指针缩放**，而非画布中心，符合专业软件直觉
- **滚轮连续比例缩放**：`Math.exp(-event.deltaY * 0.01)`，避免固定步进导致的卡顿感
- **双指捏合缩放**正确计算手势中心对应的世界坐标，防止漂移
- **普通滚轮平移 + Ctrl/Cmd+滚轮缩放**，符合 Figma/Blender 等专业软件操作习惯
- 缩放范围限制：`MIN_SCALE` ~ `MAX_SCALE`，防止过度缩放

#### 2.2.3 三阶段历史记录系统

| 模式       | 用途       | 场景                               |
| ---------- | ---------- | ---------------------------------- |
| `skip`     | 不记录历史 | 视口平移/缩放、临时预览状态        |
| `deferred` | 延迟入队   | 节点拖拽过程中（不产生几十条历史） |
| `commit`   | 立即提交   | 拖拽结束、删除节点等确定操作       |

拖拽过程中仅更新状态不记录历史，松手时 `flushHistory()` 统一提交，保证撤销/重做体验流畅。

#### 2.2.4 智能吸附对齐

- 吸附阈值随缩放动态调整：`snapThreshold = 24 / safeScale`
  - 放大时更容易精确对齐
  - 缩小时不会误吸附
- 支持对齐到其他节点的边缘/中心
- 支持对齐到画布中心点
- 可视化对齐辅助线实时显示

#### 2.2.5 分层渲染架构

```
Background (点阵)
    ↓
Guides Layer (对齐线)
    ↓
Edges Layer (SVG 连线)
    ↓
Nodes Layer (DOM 节点)
    ↓
Selection Layer (框选框)
    ↓
Overlays (工具栏/面板/浮层)
```

每一层职责单一，z-index 管理清晰，便于后续扩展（动画层、批注层、实时协作光标层等）。

---

## 3. 功能对比矩阵

| 功能维度            | 自研画布            | React Flow                   | 备注                                  |
| ------------------- | ------------------- | ---------------------------- | ------------------------------------- |
| **视口/平移**       | ✅ 优秀             | ✅ 良好                      | 自研滚轮行为更符合专业软件习惯        |
| **缩放**            | ✅ 优秀             | ✅ 良好                      | 自研围绕指针缩放，手感更准            |
| **双指触控**        | ✅ 支持             | ✅ 支持                      | 两者都有，React Flow 经过更多设备测试 |
| **节点拖拽**        | ✅ 支持             | ✅ 支持                      | 自研带吸附对齐，React Flow 需插件     |
| **多选拖拽**        | ✅ 支持             | ✅ 支持                      | -                                     |
| **框选**            | ✅ 支持             | ✅ 支持                      | -                                     |
| **连线创建**        | ✅ 支持             | ✅ 支持                      | 自研支持边重连                        |
| **边重连**          | ✅ 支持             | ✅ 支持                      | -                                     |
| **吸附对齐**        | ✅ 原生优秀         | ⚠️ 需插件                    | React Flow snapgrid 仅支持网格对齐    |
| **撤销/重做**       | ✅ 三阶段精细控制   | ✅ 支持                      | React Flow 默认粒度较粗               |
| **自动布局**        | ✅ 水平布局         | ⚠️ 需插件                    | -                                     |
| **导入/导出**       | ✅ JSON 序列化      | ⚠️ 需自行实现                | -                                     |
| **工作流校验**      | ✅ 内置校验器       | ❌ 无                        | -                                     |
| **运行时状态反馈**  | ✅ 节点执行状态展示 | ❌ 无                        | 与 runtime 深度集成                   |
| **节点分组/子流程** | ❌ 未实现           | ✅ 原生支持                  | -                                     |
| **小地图/缩略图**   | ❌ 未实现           | ✅ 内置 MiniMap              | 可快速补充                            |
| **节点注释**        | ❌ 未实现           | ✅ 内置                      | -                                     |
| **边动画**          | ❌ 未实现           | ✅ 支持                      | 数据流动画很重要                      |
| **视口裁剪优化**    | ❌ 全量渲染         | ✅ onlyRenderVisibleElements | 100+ 节点时才需要                     |
| **无障碍/键盘导航** | ⚠️ 基础             | ✅ 较完善                    | -                                     |
| **TypeScript 类型** | ✅ 完善             | ✅ 完善                      | -                                     |
| **社区插件生态**    | ❌ 无               | ✅ 丰富                      | -                                     |
| **文档/测试**       | ⚠️ 需自行维护       | ✅ 完善                      | -                                     |

---

## 4. 自研方案核心优势

### 4.1 业务深度定制能力

本项目的节点不是通用矩形，而是**高度定制化的工具节点**：

- 每个工具节点有完全不同的 UI 布局
- 节点内置表单控件（滑块、输入框、下拉选择）
- 节点上直接有"Run"运行按钮
- 端口位置根据节点类型精确偏移（`workflow-node-port-offsets.ts`）
- 节点执行状态实时可视化（运行中/成功/失败）

这种深度定制在 React Flow 中需要大量 hack 和绕过内部抽象，反而自研更可控。

### 4.2 Runtime 深度集成

画布编辑器与工作流运行时（`runtime/`）深度集成：

- 运行时节点状态直接映射到画布 UI
- 内置工作流校验（`validate-workflow.ts`）
- 导入时自动校验（`deserialize-workflow.ts`）
- 运行预览面板直接在画布层展示

React Flow 只是一个"画节点连线"的视图库，业务逻辑完全需要自己额外实现，而你已经把编辑器和执行引擎的桥梁搭好了。

### 4.3 交互一致性

所有交互逻辑采用**独立 hook 拆分**：

- 每个交互行为一个 hook，职责单一
- 不依赖第三方库的内部状态
- 可以精确控制事件优先级和冲突处理（比如什么时候触发平移、什么时候触发框选）

React Flow 的事件系统虽然完善，但遇到复杂交互冲突时需要理解其内部事件传播机制，调试成本高。

### 4.4 代码可理解性

整个画布系统代码量可控，核心逻辑在 ~5000 行以内（不含节点 UI），团队完全可以 hold 住。出了问题可以从源码层面直接 debug，不需要等 React Flow 发版修复。

---

## 5. React Flow 的优势场景

以下情况 React Flow 仍是更好的选择：

1. **团队没有足够前端能力自研画布**——React Flow 开箱即用，能快速出活
2. **需求是通用流程图/思维导图**——不需要高度定制节点
3. **需要快速上线且后续不做深度交互优化**——React Flow 生态成熟
4. **节点数量预计超过 200+**——React Flow 的视口裁剪优化更成熟

**但这些场景都不符合我们的项目现状**。

---

## 6. 当前待完善功能

按优先级排序：

### P0 - 体验关键路径

- [ ] **边动画效果**：工作流运行时的数据流动画，对执行状态展示至关重要
- [ ] **键盘快捷键增强**：
  - Ctrl/Cmd+A 全选
  - 方向键微移节点
  - Ctrl/Cmd+C/V 复制粘贴节点
  - 空格临时切换手型工具
- [ ] **连线删除优化**：选中边后按 Delete 删除（基础已有，可增加双击删除边）

### P1 - 效率提升

- [ ] **小地图/缩略图导航**：对大工作流快速定位很有帮助，预计 0.5 人天
- [ ] **节点注释/便签**：在画布上添加说明文字，方便工作流文档化
- [ ] **框选时按住空格可平移**：类似 Figma 的框选平移交互
- [ ] **多选节点对齐工具**：左对齐/右对齐/居中对齐/等距分布

### P2 - 大规模场景优化

- [ ] **视口裁剪**：超过 50 个节点时，仅渲染视口范围内的节点/边（简单 AABB 检测即可，预计 1 人天）
- [ ] **节点分组/子流程**：支持将多个节点折叠为一个组节点
- [ ] **批量操作优化**：大量节点同时拖拽时的性能优化

### P3 - 锦上添花

- [ ] **无限画布边界**：平移到一定距离后有软边界提示
- [ ] **网格背景开关**：可选网格/点阵/无背景
- [ ] **节点收藏/常用节点快捷栏**
- [ ] **协作光标（多用户编辑）**

---

## 7. 性能评估

### 当前状态

- **DOM 节点渲染**：所有节点全量 DOM 渲染
- **SVG 连线**：SVG 绘制连线
- **适用规模**：单工作流 100 节点以内无压力

以当前内容生产工作流的场景，一条工作流通常在 10-30 个节点，**现有实现性能完全够用**。

### 后续优化空间

当节点数超过 100 时可引入：

1. **简单视口裁剪**：遍历节点判断是否在视口内（+padding），非可见节点设为 `visibility: hidden` 或不渲染
2. **连线裁剪**：仅渲染视口内节点相关的连线
3. **React.memo 优化**：对节点组件做精细的 memo 控制

这些优化都不需要重构现有架构，可平滑叠加。

---

## 8. 结论与建议

### 8.1 核心结论

**继续沿用自研画布方案，不迁移到 React Flow。**

理由：

1. ✅ **核心交互质量已经达到或超过 React Flow 水准**——平移、缩放、拖拽、吸附、连线这些用户感知最强的部分已经调教得相当不错
2. ✅ **业务定制需求与自研架构高度匹配**——高度定制化的工具节点、运行时深度集成，这些是 React Flow 的短板
3. ✅ **代码架构清晰可维护**——hook 拆分合理，状态管理规范，团队完全可以掌控
4. ✅ **无第三方依赖风险**——不依赖外部库的发版节奏，遇到问题可以直接修改源码
5. ✅ **当前性能满足业务需求**——内容生产工作流节点数有限，短期内不会遇到性能瓶颈

### 8.2 技术路线建议

| 阶段           | 目标             | 重点工作                                            |
| -------------- | ---------------- | --------------------------------------------------- |
| **MVP 阶段**   | 核心闭环可用     | P0 功能（边动画、基础快捷键）                       |
| **产品化阶段** | 体验流畅         | P1 功能（小地图、注释、对齐工具）+ 对接真实模型 API |
| **规模化阶段** | 支撑大规模工作流 | P2 功能（视口裁剪、节点分组）+ 协作能力             |

### 8.3 参考学习方向

不需要换 React Flow，但可以借鉴它的优点：

1. 参考 `MiniMap` 实现小地图
2. 参考其边的路径算法（贝塞尔曲线控制点计算）
3. 学习其无障碍和键盘导航的设计思路
4. 性能优化时可参考其视口裁剪思路

---

## 9. 附录：关键代码位置索引

| 功能         | 文件位置                                        |
| ------------ | ----------------------------------------------- |
| 视口主入口   | `canvas/canvas-viewport.tsx`                    |
| 平移逻辑     | `interactions/hooks/useCanvasPan.ts`            |
| 缩放逻辑     | `interactions/hooks/useCanvasZoom.ts`           |
| 节点拖拽     | `interactions/hooks/useCanvasNodeDrag.ts`       |
| 多选拖拽     | `interactions/hooks/useCanvasSelectionDrag.ts`  |
| 框选         | `interactions/hooks/useCanvasSelection.ts`      |
| 连线/重连    | `interactions/hooks/useCanvasEdgeConnection.ts` |
| 吸附对齐     | `interactions/hooks/useCanvasSnapping.ts`       |
| 吸附算法     | `interactions/utils/snapping.ts`                |
| 视口计算工具 | `interactions/utils/viewport.ts`                |
| 状态管理     | `state/workflow-editor-store.ts`                |
| 历史记录     | `state/workflow-editor-history.ts`              |
| 节点端口偏移 | `model/constants/workflow-node-port-offsets.ts` |
| 工具节点定义 | `model/constants/tool-definitions.tsx`          |
| 工作流校验   | `services/validators/validate-workflow.ts`      |
| 序列化       | `services/serializer/serialize-workflow.ts`     |
| 自动布局     | `services/layout/auto-layout.ts`                |
| 运行时引擎   | `runtime/engine/workflow-runtime-engine.ts`     |
