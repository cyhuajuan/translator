# Phase 1: Core Translation - Context

**Gathered:** 2026-03-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can translate text between Chinese, English, and Japanese using local Ollama with proper error handling. This phase delivers the complete translation workflow including:
- Source and target language selection via dropdowns
- Text input and output text areas
- Translate button that invokes Ollama API
- Swap button to exchange languages
- Clear button to reset both text boxes
- Loading animation during translation
- Error handling for Ollama connection and model availability
</domain>

<decisions>
## Implementation Decisions

### Loading Animation
- **D-01:** Use rotating spinner icon (Lucide Loader2 or similar) during translation
- **D-02:** Loading state replaces translate button text with spinner icon (icon-only, no text)
- **D-03:** Animation speed: standard 1-second rotation cycle
- **D-04:** Translate button is disabled during loading state

### Pre-Decided (from earlier planning)
- Manual language selection (not auto-detect) — more reliable per user preference
- No streaming output — user explicitly does not need it
- Single translate button — simple UI approach
- Ollama calls via Rust backend (Tauri commands) — best practice per research
- Prompt template: "You are a professional {SOURCE_LANG} ({SOURCE_CODE}) to {TARGET_LANG} ({TARGET_CODE}) translator..."

### Claude's Discretion
The following are left to implementation discretion:
- UI layout (text areas, dropdowns, button arrangement)
- Error message display approach (toast, inline, dialog)
- Specific component variants from shadcn/ui

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Documents
- `.planning/PROJECT.md` — Core value, constraints, Ollama API endpoint info
- `.planning/REQUIREMENTS.md` — v1 requirements mapping to phases
- `.planning/ROADMAP.md` — Phase 1 success criteria

### Codebase References
- `src/components/ui/button.tsx` — Existing shadcn button component pattern
- `src/lib/utils.ts` — `cn()` utility for Tailwind class merging
- `src-tauri/src/lib.rs` — Rust backend with Tauri command pattern
- `.planning/codebase/CONVENTIONS.md` — Naming conventions and code patterns
- `.planning/codebase/STRUCTURE.md` — Directory layout and file purposes

</canonical_refs>

<codebase>
## Existing Code Insights

### Reusable Assets
- `Button` component from shadcn/ui with size variants (can use `size="icon"` for icon-only buttons)
- `cn()` utility for conditional Tailwind classes
- Tauri `#[tauri::command]` pattern for Rust backend commands

### Established Patterns
- Functional React components with TypeScript
- CVA (class-variance-authority) for component variants
- Tailwind CSS with `cn()` utility for conditional classes
- `createFileRoute('/')` pattern for routes

### Integration Points
- Frontend to Rust: `@tauri-apps/api` invoke calls
- New components: `src/components/ui/` for UI components
- Route component: `src/routes/index.tsx`
- Rust commands: `src-tauri/src/lib.rs`

</codebase>

<specifics>
## Specific Ideas

No specific references or examples requested — open to standard approaches aligned with codebase conventions.

</specifics>

<deferred>
## Deferred Ideas

### Not Discussed (deferred to implementation discretion)
- UI layout details (text areas, language dropdowns, button arrangement)
- Error display approach (toast, inline message, dialog)
- Specific loading error message wording

**Rationale:** User chose to focus on loading animation decisions only; other aspects left to implementation team's judgment based on codebase conventions.

</deferred>

---

*Phase: 01-core-translation*
*Context gathered: 2026-03-27*
