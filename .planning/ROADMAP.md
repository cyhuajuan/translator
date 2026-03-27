# Ollama Translator - Roadmap

## Phases

- [ ] **Phase 1: Core Translation** - Complete translation workflow with Ollama integration
- [ ] **Phase 2: Language Persistence** - Save and restore language preferences

## Phase Details

### Phase 1: Core Translation

**Goal:** Users can translate text between Chinese, English, and Japanese using local Ollama with proper error handling

**Depends on:** Nothing (first phase)

**Requirements:** UI-01, UI-02, UI-04, UI-05, TRN-01, TRN-02, TRN-03, TRN-04, TRN-05, CONN-01, CONN-02

**Success Criteria** (what must be TRUE):
1. User can select source language (Chinese/English/Japanese) from dropdown
2. User can select target language (Chinese/English/Japanese) from dropdown
3. User can input text in source text box
4. User can click translate button to call Ollama API and see translated result in output text box
5. Loading animation displays during translation and translate button is disabled
6. Translate button re-enables after translation completes
7. User sees friendly error message if Ollama is not running
8. User sees friendly error message if translategemma model is not available
9. User can click swap button to exchange source and target languages
10. User can click clear button to empty both text boxes

**Plans:** 2 plans

Plans:
- [x] 01-01-PLAN.md - Rust backend with reqwest and Tauri translate/connection commands
- [ ] 01-02-PLAN.md - React translation UI with language selectors, text areas, and translate/swap/clear buttons

**UI hint:** yes

---

### Phase 2: Language Persistence

**Goal:** Language preferences are saved and restored across app sessions

**Depends on:** Phase 1

**Requirements:** UI-03

**Success Criteria** (what must be TRUE):
1. Selected source language is saved when changed
2. Selected target language is saved when changed
3. Saved language selections are restored when app starts

**Plans:** TBD

---

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Core Translation | 1/2 | In progress | 01-01-SUMMARY.md |
| 2. Language Persistence | 0/3 | Not started | - |

## Coverage

- v1 requirements: 12 total
- Phase 1: 11 requirements
- Phase 2: 1 requirement
- Mapped: 12/12
- Unmapped: 0

---

*Last updated: 2026-03-27*
