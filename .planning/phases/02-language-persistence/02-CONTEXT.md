# Phase 2: Language Persistence - Context

**Gathered:** 2026-03-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Language preferences (source and target language) are saved when changed and automatically restored when the app starts, giving users a persistent, seamless translation experience.
</domain>

<decisions>
## Implementation Decisions

### Storage Mechanism
- **D-01:** Use Tauri store plugin for persistence — desktop专用持久化存储，与 React 前端集成良好

### Save Timing
- **D-02:** Real-time save on every language change — whenever user changes language via dropdown, immediately persist to store

### Default Values
- **D-03:** Default: English (en) → Chinese (zh) — consistent with Phase 1 hardcoded defaults in `src/routes/index.tsx`

### Claude's Discretion
- Storage key name (e.g., `language_prefs` vs `preferences`)
- Tauri store initialization and error handling approach
- Whether to use `useEffect` or React state `onChange` for save triggers

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Documents
- `.planning/PROJECT.md` — Core value, constraints, Ollama API endpoint info
- `.planning/REQUIREMENTS.md` — UI-03 requirement for language persistence
- `.planning/ROADMAP.md` — Phase 2 success criteria
- `.planning/phases/01-core-translation/01-CONTEXT.md` — Phase 1 decisions, especially prompt template

### Codebase References
- `src/routes/index.tsx` — Main translation UI with `sourceLang` and `targetLang` state
- `src/lib/languages.ts` — `LANGUAGES` array with `{ code, name }` for zh/en/ja
- `src-tauri/src/lib.rs` — Rust backend with `#[tauri::command]` pattern (for reference)

</canonical_refs>

<codebase>
## Existing Code Insights

### Reusable Assets
- `LANGUAGES` array in `src/lib/languages.ts` — used for both dropdown options and storage keys
- `cn()` utility in `src/lib/utils.ts` — for conditional Tailwind classes
- shadcn `Select` component pattern — existing in codebase

### Established Patterns
- React `useState` for `sourceLang` and `targetLang` in `RouteComponent`
- `invoke()` from `@tauri-apps/api/core` for frontend → Rust communication
- Functional React components with TypeScript

### Integration Points
- Frontend reads initial state from store on mount
- Frontend writes to store on `onChange` events from Select components
- New Tauri command may be needed OR use `tauri-plugin-store` directly from frontend

</codebase>

<specifics>
## Specific Ideas

No specific examples or references requested — decisions are based on consistency with Phase 1 and standard Tauri patterns.
</specifics>

<deferred>
## Deferred Ideas

### Prompt Template Update (Phase 1 territory)
- **Idea:** Update translation prompt to official model format:
  ```
  You are a professional {SOURCE_LANG} ({SOURCE_CODE}) to {TARGET_LANG} ({TARGET_CODE}) translator. Your goal is to accurately convey the meaning and nuances of the original {SOURCE_LANG} text while adhering to {TARGET_LANG} grammar, vocabulary, and cultural sensitivities. Produce only the {TARGET_LANG} translation, without any additional explanations or commentary. Please translate the following {SOURCE_LANG} text into {TARGET_LANG}:

  {TEXT}
  ```
- **Why deferred:** This is Phase 1 (Core Translation) territory, not Phase 2 (Language Persistence)
- **Belongs to:** Phase 1 follow-up or future optimization phase

</deferred>

---

*Phase: 02-language-persistence*
*Context gathered: 2026-03-27*
