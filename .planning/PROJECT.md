# Ollama 翻译助手

## What This Is

一款基于本地 Ollama 的桌面翻译工具，调用 translategemma 模型实现中、英、日三种语言的互译。用户通过简洁的双文本框界面输入原文并获取译文。

## Core Value

让用户快速、方便地使用本地 AI 模型进行多语言翻译，无需依赖云服务，保护隐私。

## Requirements

### Validated

- ✓ Tauri 2 桌面应用框架 — existing
- ✓ React 19 前端 + TypeScript — existing
- ✓ Tailwind CSS v4 + shadcn/ui 组件库 — existing
- ✓ 用户可选择源语言（中文/英文/日文）— Phase 01
- ✓ 用户可选择目标语言（中文/英文/日文）— Phase 01
- ✓ 用户输入文本后点击按钮触发翻译 — Phase 01
- ✓ 调用本地 Ollama translategemma 模型进行翻译 — Phase 01
- ✓ 显示加载动画直至翻译完成 — Phase 01
- ✓ Ollama 未运行时显示友好错误提示 — Phase 01
- ✓ 一键清空两个文本框 — Phase 01
- ✓ 用户可一键互换源/目标语言 — Phase 01

### Active

- [ ] 语言选择记录上次配置并自动恢复

### Out of Scope

- 翻译历史记录功能 — 用户明确不需要
- 实时流式翻译输出 — 用户明确不需要
- 快捷键支持 — 用户明确不需要
- 文件翻译（仅支持文本）
- 自动检测源语言功能 — 手动选择更可靠

## Context

**技术环境：**
- Tauri 2 桌面应用（Rust 后端 + React 前端）
- Ollama 运行于 localhost:11434
- 使用 translategemma 模型进行翻译
- 项目已有基础框架和 UI 组件

**Ollama API 交互方式：**
- 端点：`POST http://localhost:11434/api/generate`
- 模型：`translategemma`
- 使用预设提示词模板填充变量

**提示词模板结构：**
```
You are a professional {SOURCE_LANG} ({SOURCE_CODE}) to {TARGET_LANG} ({TARGET_CODE}) translator...
```

## Constraints

- **Ollama 依赖**: 必须本地运行 Ollama 并加载 translategemma 模型
- **离线可用**: 翻译完全在本地完成，无需网络
- **模型限制**: 仅支持 translategemma 模型，不支持其他模型

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 手动选择语言 | 用户偏好手动选择而非自动检测，更可靠 | — Pending |
| 不使用流式输出 | 用户明确不需要，简化实现 | — Pending |
| 单一翻译按钮 | 简洁界面设计，无需额外选项 | — Pending |

---

*Last updated: 2026-03-27 after Phase 01 completion*

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state
