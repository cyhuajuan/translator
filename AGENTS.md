# AGENTS.md — Translator 项目 AI 协作指南

## 项目概述

这是一个基于 **Tauri v2 + React 19 + TypeScript** 的桌面翻译应用程序。应用通过 OpenAI 兼容 API 提供多语言翻译服务，拥有自定义无边框窗口、设置管理等功能。

| 层 | 技术栈 |
|---|---|
| 前端框架 | React 19 + TypeScript 6 |
| 构建工具 | Vite 8 |
| 样式方案 | Tailwind CSS v4 + shadcn/ui (base-nova 风格) |
| 桌面壳 | Tauri v2 (Rust 后端) |
| 包管理 | pnpm |
| 图标库 | lucide-react |

## 目录结构

```
translator/
├── src/                         # 前端源码 (React)
│   ├── App.tsx                  # 主应用组件 (翻译界面 + 自定义标题栏)
│   ├── main.tsx                 # React 入口
│   ├── index.css                # 全局样式 & Design Tokens
│   ├── components/
│   │   ├── SettingsDialog.tsx   # 设置弹窗 (翻译偏好 + 服务配置)
│   │   └── ui/                  # shadcn/ui 基础组件
│   │       ├── button.tsx
│   │       ├── dialog.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── scroll-area.tsx
│   │       ├── select.tsx
│   │       ├── switch.tsx
│   │       ├── tabs.tsx
│   │       └── textarea.tsx
│   ├── hooks/
│   │   └── useSettings.ts      # 设置状态管理 (localStorage 持久化)
│   └── lib/
│       └── utils.ts             # cn() 工具函数 (clsx + tailwind-merge)
├── src-tauri/                   # Tauri 后端 (Rust)
│   ├── src/
│   │   ├── main.rs              # Rust 入口
│   │   └── lib.rs               # Tauri Builder 配置
│   ├── tauri.conf.json          # Tauri 应用配置
│   ├── capabilities/
│   │   └── default.json         # 权限声明 (窗口操作)
│   └── Cargo.toml               # Rust 依赖
├── components.json              # shadcn/ui 配置
├── vite.config.ts               # Vite 构建配置
└── package.json                 # 前端依赖 & Scripts
```

## 设计系统 — Kinetic Polyglot

项目使用名为 **Kinetic Polyglot** 的自定义设计系统，所有颜色和设计 token 定义在 `src/index.css` 的 `:root` 中：

- **主色 (Primary):** `#FF6D00` (活力橙)
- **字体:** Plus Jakarta Sans (标题 + 正文), Geist Variable (备用)
- **圆角:** 大量使用 `rounded-full` 和 `rounded-[2rem]` 实现胶囊按钮和大圆角卡片
- **视觉特征:** 毛玻璃效果 (`backdrop-blur`)、渐变装饰、微交互动画 (`hover:scale-105`, `active:scale-95`)

### 颜色命名规范

采用 Material Design 3 色彩语义：`surface-container-*`, `on-surface`, `on-surface-variant`, `primary`, `primary-container`, `error`, `outline-variant` 等。在 Tailwind 中可直接使用这些颜色名称 (如 `bg-surface-container-high`, `text-on-surface-variant`)。

## 编码规范与约定

### 前端通用

1. **语言:** 所有前端代码使用 TypeScript (`.tsx` / `.ts`)。
2. **样式:** 使用 Tailwind CSS v4 utility classes，通过 `@theme inline` 注入自定义 token。**不要使用内联 style 对象**。
3. **组件库:** UI 基础组件放在 `src/components/ui/`，由 shadcn/ui CLI 生成，**不要手动修改**这些文件。业务组件放在 `src/components/` 根目录。
4. **路径别名:** 使用 `@/` 作为 `src/` 的别名 (如 `import { Button } from "@/components/ui/button"`)。
5. **状态管理:** 轻量级状态用 React 内置 `useState`/`useEffect`。持久化配置通过 `localStorage`，具体模式见 `useSettings.ts`。
6. **图标:** 统一使用 `lucide-react`。

### UI / 界面语言

- 所有面向用户的界面文本使用**简体中文**。
- 代码注释和变量命名使用英文。

### 窗口管理

- 应用使用**自定义标题栏** (`decorations: false`)，通过 `data-tauri-drag-region` 实现窗口拖拽。
- 窗口控件 (最小化/最大化/关闭) 在 `App.tsx` 中实现，使用 `@tauri-apps/api/window` 的 `getCurrentWindow()`。
- 最小窗口尺寸: 800×800，默认尺寸: 1100×800。

### 后端 (Rust / Tauri)

- Tauri v2 权限模型: 所有需要的 API 权限必须在 `src-tauri/capabilities/default.json` 中显式声明。
- 当前后端仅包含基础 Tauri Builder 和日志插件 (`tauri-plugin-log`)，无自定义 Rust 命令。
- 新增 Tauri 命令时，在 `lib.rs` 中用 `#[tauri::command]` 宏定义并注册到 `.invoke_handler()`。

## 设置系统架构

设置通过 `useSettings` hook 管理：

```typescript
interface Settings {
  defaultSourceLang: string;     // 默认源语言
  defaultTargetLang: string;     // 默认目标语言
  autoTranslate: boolean;        // 是否自动翻译
  services: TranslationService[]; // OpenAI 兼容服务列表
  activeServiceId: string | null; // 当前激活的服务 ID
}

interface TranslationService {
  id: string;
  name: string;
  apiUrl: string;   // 兼容 OpenAI Chat Completions 端点
  apiKey: string;
  model: string;
}
```

- 持久化 key: `translator_settings` (localStorage)。
- 新增设置项时，在 `Settings` 接口添加字段并在 `defaultSettings` 中提供默认值。

## 开发命令

```bash
# 安装依赖
pnpm install

# 启动前端开发服务器 (仅 Web)
pnpm dev

# 启动 Tauri 桌面应用 (包含前端热更新)
pnpm tauri dev

# 构建生产版本
pnpm tauri build

# 添加 shadcn/ui 组件
pnpm dlx shadcn@latest add <component-name>
```

## 添加新功能的工作流

### 添加新的 UI 页面/组件

1. 如需新的 shadcn/ui 基础组件 → `pnpm dlx shadcn@latest add <name>`。
2. 在 `src/components/` 下创建业务组件文件。
3. 遵循现有样式模式：使用设计系统中的 Tailwind 颜色类，保持视觉一致性。
4. 在 `App.tsx` 中引入并集成。

### 添加新的 Tauri 后端命令

1. 在 `src-tauri/src/lib.rs` 中定义 `#[tauri::command]` 函数。
2. 注册到 `.invoke_handler(tauri::generate_handler![...])` 中。
3. 如需额外权限，更新 `src-tauri/capabilities/default.json`。
4. 前端通过 `import { invoke } from "@tauri-apps/api/core"` 调用。

### 添加新的设置项

1. 在 `src/hooks/useSettings.ts` 的 `Settings` 接口添加字段。
2. 在 `defaultSettings` 中设置默认值。
3. 在 `src/components/SettingsDialog.tsx` 对应 Tab 中添加控件。

## 注意事项

- **不要修改 `src/components/ui/` 下的文件**，这些由 shadcn CLI 管理；如需定制样式，在使用处通过 `className` 覆盖。
- 所有翻译服务均兼容 **OpenAI Chat Completions API** 规范，不要假设使用特定厂商的 SDK。
- 当前项目为**单页应用** (无路由)，如需添加路由请先讨论方案。
- 保持界面的**视觉高级感**：大圆角、微动画、毛玻璃效果是核心设计语言，新增 UI 需保持一致。
