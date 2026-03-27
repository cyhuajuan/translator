# Phase 2: Language Persistence - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-27
**Phase:** 02-language-persistence
**Areas discussed:** Storage Mechanism, Save Timing, Default Values

---

## Storage Mechanism

| Option | Description | Selected |
|--------|-------------|----------|
| Tauri store (recommended) | Desktop专用持久化存储，API 简洁，需要添加 Rust 依赖 | ✓ |
| localStorage | 前端直接使用，最简单，但持久性依赖 webview 配置 | |
| You decide | 由下游 agent 决定 | |

**User's choice:** Tauri store (recommended)
**Notes:** Desktop专用，Tauri生态，适合持久化需求

---

## Save Timing

| Option | Description | Selected |
|--------|-------------|----------|
| Real-time save (recommended) | 每次语言变更时立即保存，最简单可靠 | ✓ |
| Save on app close | 只在应用关闭时保存，实现稍复杂且有崩溃丢数据风险 | |
| Both | 变更时实时保存 + 关闭时备份，最可靠 | |

**User's choice:** Real-time save (recommended)
**Notes:** 语言选择不频繁，实时保存最简单可靠

---

## Default Values

| Option | Description | Selected |
|--------|-------------|----------|
| Keep en→zh (recommended) | 与当前 Phase 1 代码一致 | ✓ |
| Both English | 中立选择，不预设翻译方向 | |
| You decide | 由下游 agent 决定 | |

**User's choice:** Keep en→zh (recommended)
**Notes:** 与 Phase 1 代码一致，用户已熟悉

---

## Deferred Ideas

### Prompt Template Update
**Mentioned by user:** Update translation prompt to official model format
**Action taken:** Noted as Phase 1 territory, deferred to future Phase 1 follow-up or optimization phase
