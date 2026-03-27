# Requirements: Ollama 翻译助手

**Defined:** 2026-03-27
**Core Value:** 让用户快速、方便地使用本地 AI 模型进行多语言翻译，无需依赖云服务，保护隐私。

## v1 Requirements

### 界面 (UI)

- [x] **UI-01**: 用户可在源语言下拉框选择中文/英文/日文
- [x] **UI-02**: 用户可在目标语言下拉框选择中文/英文/日文
- [ ] **UI-03**: 源语言和目标语言选择记录上次配置，程序重启后自动恢复
- [x] **UI-04**: 用户可点击互换按钮交换源语言和目标语言
- [x] **UI-05**: 用户可点击清空按钮同时清空输入和输出文本框

### 翻译功能 (Translation)

- [x] **TRN-01**: 用户在输入框输入文本后，点击翻译按钮发起翻译请求
- [x] **TRN-02**: 翻译请求调用本地 Ollama translategemma 模型
- [x] **TRN-03**: 翻译结果（仅译文）显示在输出文本框
- [x] **TRN-04**: 翻译过程中显示加载动画，禁用翻译按钮
- [x] **TRN-05**: 翻译完成后恢复翻译按钮可用状态

### Ollama 连接 (Connection)

- [x] **CONN-01**: 检测 Ollama 服务是否运行，未运行时显示友好错误提示
- [x] **CONN-02**: 检测模型是否可用，不可用时提示用户拉取模型

## v2 Requirements

暂未规划。

## Out of Scope

| Feature | Reason |
|---------|--------|
| 翻译历史记录 | 用户明确不需要 |
| 实时流式翻译输出 | 用户明确不需要 |
| 快捷键支持 | 用户明确不需要 |
| 文件翻译 | 仅支持文本翻译 |
| 自动检测源语言 | 手动选择更可靠 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| UI-01 | Phase 1 | Complete |
| UI-02 | Phase 1 | Complete |
| UI-03 | Phase 2 | Pending |
| UI-04 | Phase 1 | Complete |
| UI-05 | Phase 1 | Complete |
| TRN-01 | Phase 1 | Complete |
| TRN-02 | Phase 1 | Complete (01-01) |
| TRN-03 | Phase 1 | Complete (01-01) |
| TRN-04 | Phase 1 | Complete |
| TRN-05 | Phase 1 | Complete |
| CONN-01 | Phase 1 | Complete (01-01) |
| CONN-02 | Phase 1 | Complete (01-01) |

**Coverage:**
- v1 requirements: 12 total
- Phase 1: 11 requirements
- Phase 2: 1 requirement
- Mapped: 12/12
- Unmapped: 0

---
*Requirements defined: 2026-03-27*
*Roadmap created: 2026-03-27*
