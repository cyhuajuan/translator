# AGENTS.md — Translator 项目 AI 协作指南

## 项目概述

这是一个基于 **Tauri v2 + React 19 + TypeScript** 的桌面翻译应用程序。应用通过 OpenAI 兼容 API 提供多语言翻译服务，支持 SSE 流式输出、自定义系统提示词模板、模型思考内容过滤等特性，拥有自定义无边框窗口和完善的设置管理。

| 层 | 技术栈 |
|---|---|
| 前端框架 | React 19 + TypeScript 6 |
| 构建工具 | Vite 8 |
| 样式方案 | Tailwind CSS v4 + shadcn/ui (base-nova 风格) |
| 桌面壳 | Tauri v2 (Rust 后端) |
| HTTP 请求 | @tauri-apps/plugin-http (绕过 CORS) |
| 包管理 | pnpm |
| 图标库 | lucide-react |

## 目录结构

```
translator/
├── src/                         # 前端源码 (React)
│   ├── App.tsx                  # 主应用组件 (翻译界面 + 自定义标题栏 + 翻译状态管理)
│   ├── main.tsx                 # React 入口
│   ├── index.css                # 全局样式 & Design Tokens
│   ├── components/
│   │   ├── SettingsDialog.tsx   # 设置弹窗 (翻译偏好 + 提示词模板 + 服务配置)
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
│   │   └── useSettings.tsx     # 设置状态管理 (localStorage 持久化, React Context)
│   └── lib/
│       ├── translate.ts         # 翻译核心逻辑 (OpenAI API + SSE 流式解析 + 思考过滤)
│       └── utils.ts             # cn() 工具函数 (clsx + tailwind-merge)
├── src-tauri/                   # Tauri 后端 (Rust)
│   ├── src/
│   │   ├── main.rs              # Rust 入口
│   │   └── lib.rs               # Tauri Builder 配置 (含 tauri-plugin-http)
│   ├── tauri.conf.json          # Tauri 应用配置
│   ├── capabilities/
│   │   └── default.json         # 权限声明 (窗口操作 + HTTP URL scope)
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

## 翻译引擎架构

翻译核心逻辑在 `src/lib/translate.ts` 中：

### API 调用流程

1. 从 `Settings.services` 中获取当前激活的翻译服务配置。
2. 将 `apiUrl` 作为 Base URL，自动拼接 `/chat/completions` 端点（兼容用户填写完整路径或仅 Base URL）。
3. 使用 `@tauri-apps/plugin-http` 的 `fetch` 发送请求（绕过浏览器 CORS 限制）。
4. 以 `stream: true` 模式请求 SSE 流式响应，逐 chunk 解析并通过 `onChunk` 回调实时输出。

### 系统提示词模板

支持 4 种模板变量，通过 `resolveSystemPrompt()` 在发送请求前替换：

| 变量 | 说明 | 示例值 |
|------|------|--------|
| `{{sourceLang}}` | 源语言英文名 | Chinese |
| `{{targetLang}}` | 目标语言英文名 | English |
| `{{sourceLangCode}}` | 源语言 ISO 代码 | zh-CN |
| `{{targetLangCode}}` | 目标语言 ISO 代码 | en |

语言映射表 (`LANG_INFO`) 定义在 `translate.ts` 中：

| 界面显示 | 英文名 | 代码 |
|---------|--------|------|
| 中文 | Chinese | zh-CN |
| 英文 | English | en |
| 日文 | Japanese | ja |
| 韩文 | Korean | ko |

新增语言时需同步更新 `LANG_INFO` 映射表以及 `App.tsx`/`SettingsDialog.tsx` 中的 `<SelectItem>` 列表。

### 模型思考内容过滤

`ThinkingFilter` 类实时过滤流式输出中的模型推理/思考内容：

- **`reasoning_content` 字段过滤**：`parseSSELine()` 只读取 `delta.content`，自动忽略部分 API（如 DeepSeek）使用的 `delta.reasoning_content` 字段。
- **`<think>...</think>` 标签过滤**：状态机实现，支持处理跨 chunk 的不完整标签。
- **前导空白过滤**：思考块移除后自动清理残留的前导换行符。

### 请求控制

- 支持 `AbortSignal` 取消正在进行的翻译请求。
- 新翻译开始时自动 abort 上一次未完成的请求。

## 编码规范与约定

### 前端通用

1. **语言:** 所有前端代码使用 TypeScript (`.tsx` / `.ts`)。
2. **样式:** 使用 Tailwind CSS v4 utility classes，通过 `@theme inline` 注入自定义 token。**不要使用内联 style 对象**。
3. **组件库:** UI 基础组件放在 `src/components/ui/`，由 shadcn/ui CLI 生成，**不要手动修改**这些文件。业务组件放在 `src/components/` 根目录。
4. **路径别名:** 使用 `@/` 作为 `src/` 的别名 (如 `import { Button } from "@/components/ui/button"`)。
5. **状态管理:** 轻量级状态用 React 内置 `useState`/`useEffect`。持久化配置通过 `localStorage`，具体模式见 `useSettings.tsx`。
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
- HTTP 插件: 使用 `tauri-plugin-http`，需在 capabilities 中配置 URL scope（包括 `localhost` 和 `127.0.0.1` 的显式声明，因为通配符 `http://**` 不匹配 IP 地址）。
- 当前后端包含 Tauri Builder、日志插件 (`tauri-plugin-log`) 和 HTTP 插件 (`tauri-plugin-http`)，无自定义 Rust 命令。
- 新增 Tauri 命令时，在 `lib.rs` 中用 `#[tauri::command]` 宏定义并注册到 `.invoke_handler()`。

## 设置系统架构

设置通过 `useSettings` hook (React Context + localStorage) 管理：

```typescript
interface Settings {
  defaultSourceLang: string;     // 默认源语言 (界面显示名)
  defaultTargetLang: string;     // 默认目标语言 (界面显示名)
  services: TranslationService[]; // OpenAI 兼容服务列表
  activeServiceId: string | null; // 当前激活的服务 ID
  systemPrompt: string;           // 系统提示词模板 (支持 {{变量}} 替换)
}

interface TranslationService {
  id: string;
  name: string;
  apiUrl: string;   // API Base URL (如 https://api.openai.com/v1)
  apiKey: string;
  model: string;
}
```

- 持久化 key: `translator_settings` (localStorage)。
- 默认系统提示词导出为 `DEFAULT_SYSTEM_PROMPT` 常量。
- 新增设置项时，在 `Settings` 接口添加字段并在 `defaultSettings` 中提供默认值。

### 设置对话框 Tab 结构

| Tab | 内容 |
|-----|------|
| 翻译 | 默认源/目标语言选择 |
| 提示词 | 系统提示词模板编辑器 + 可用变量说明 + 恢复默认按钮 |
| 高级 | 翻译服务配置管理 (增删改、API Base URL / Key / 模型) |

## 开发命令

```bash
# 安装依赖
pnpm install

# 启动前端开发服务器 (仅 Web，不含 Tauri 功能)
pnpm dev

# 启动 Tauri 桌面应用 (包含前端热更新，翻译功能需此模式)
pnpm tauri dev

# 构建生产版本
pnpm tauri build

# 添加 shadcn/ui 组件
pnpm dlx shadcn@latest add <component-name>
```

> **注意:** 翻译功能依赖 `@tauri-apps/plugin-http`，只有通过 `pnpm tauri dev` 运行完整桌面应用时才能正常工作。`pnpm dev` 仅启动前端，API 请求会因缺少 Tauri 运行时而失败。

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

1. 在 `src/hooks/useSettings.tsx` 的 `Settings` 接口添加字段。
2. 在 `defaultSettings` 中设置默认值。
3. 在 `src/components/SettingsDialog.tsx` 对应 Tab 中添加控件。

### 添加新的翻译语言

1. 在 `src/lib/translate.ts` 的 `LANG_INFO` 映射表中添加条目。
2. 在 `src/App.tsx` 的源语言和目标语言 `<Select>` 中添加 `<SelectItem>`。
3. 在 `src/components/SettingsDialog.tsx` 的默认语言 `<Select>` 中添加 `<SelectItem>`。

## 注意事项

- **不要修改 `src/components/ui/` 下的文件**，这些由 shadcn CLI 管理；如需定制样式，在使用处通过 `className` 覆盖。
- 所有翻译服务均兼容 **OpenAI Chat Completions API** 规范，不要假设使用特定厂商的 SDK。
- `apiUrl` 字段是 **Base URL** (如 `https://api.openai.com/v1`)，代码自动拼接 `/chat/completions`。
- 当前项目为**单页应用** (无路由)，如需添加路由请先讨论方案。
- 保持界面的**视觉高级感**：大圆角、微动画、毛玻璃效果是核心设计语言，新增 UI 需保持一致。
- HTTP 权限 scope 中 `http://**` 通配符**不匹配** `localhost` 和 IP 地址，需显式声明。
