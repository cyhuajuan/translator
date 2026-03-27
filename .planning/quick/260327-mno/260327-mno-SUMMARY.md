---
phase: quick
plan: "260327-mno"
subsystem: backend
tags: [translation, prompt, ollama]
dependency_graph:
  requires: []
  provides: [PROMPT-01]
  affects: [src-tauri/src/lib.rs]
tech_stack:
  added: []
  patterns: [positional-format-args]
key_files:
  created: []
  modified:
    - src-tauri/src/lib.rs
decisions:
  - "Use positional arguments {0}-{4} in format! macro since source_display and source_lang appear multiple times in the prompt string"
metrics:
  duration: ~1 min
  completed: "2026-03-27T07:31:00Z"
  tasks: 1
  files: 1
---

# Quick Task 260327-mno: 更新翻译提示词为官方格式 Summary

## One-liner

Translation prompt updated to official translategemma model format with comprehensive translation guidelines.

## Changes Made

**1. 更新翻译提示词格式** — `src-tauri/src/lib.rs`

- **旧格式**: 简单的 "You are a professional {} ({}) to {} ({}) translator. Provide only the translated text..."
- **新格式**: 包含完整的翻译指导说明，使用位置参数 {0}-{4} 避免歧义
- **Commit**: `54e9042`

## Verification

- `cargo check --manifest-path src-tauri/Cargo.toml` — 通过
- 新提示词包含 "Your goal is to accurately convey" 和 "Produce only the {TARGET_LANG} translation"

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None.

## Checklist

- [x] 提示词已更新为官方格式
- [x] 包含 "Your goal is to accurately convey"
- [x] 包含 "Produce only the {TARGET_LANG} translation"
- [x] cargo check 通过
- [x] 原子提交完成

---

## Self-Check: PASSED

- `54e9042` 存在于 git log
- `src-tauri/src/lib.rs` 已更新，包含新提示词格式
