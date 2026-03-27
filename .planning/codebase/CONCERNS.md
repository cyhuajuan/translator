# Codebase Concerns

**Analysis Date:** 2026-03-27

## Tech Debt

**Translation Functionality Not Implemented:**
- Issue: The application is a bare Tauri + React skeleton with no actual translation logic
- Files: `src-tauri/src/lib.rs` (only has a `greet` function), `src/routes/index.tsx` (displays "Hello '/'!")
- Impact: Application cannot perform translations - core feature missing
- Fix approach: Implement translation API integration and UI for text input/output

**Rust Crate Naming Workaround:**
- Issue: The lib name `hj_project_name_lib` appears to be a placeholder workaround for a Windows Cargo bug
- Files: `src-tauri/Cargo.toml` (line 14), `src-tauri/src/main.rs` (line 5)
- Impact: Confusing/odd naming, may cause issues if project is renamed
- Fix approach: Consider renaming properly or document why the suffix is needed

**Generated Route File with Suppressions:**
- Issue: `routeTree.gen.ts` has `@ts-nocheck` and `eslint-disable` directives
- Files: `src/routes/index.tsx`, `src/routes/__root.tsx`
- Impact: Type safety and linting disabled for generated code, issues may go undetected
- Fix approach: Ensure code generation produces clean output, remove suppressions

## Known Bugs

**No bugs identified yet:**
- The codebase is too early-stage to have discovered runtime bugs
- Unit/integration tests are not present to surface issues

## Security Considerations

**CSP Disabled:**
- Risk: Content Security Policy is set to `null` in `tauri.conf.json`
- Files: `src-tauri/tauri.conf.json` (line 22)
- Current mitigation: None
- Recommendations: Enable CSP with appropriate restrictions for a translation app

**DevTools Enabled in Production:**
- Risk: No configuration to disable devtools in release builds
- Files: `src-tauri/tauri.conf.json`
- Current mitigation: None specified
- Recommendations: Add `"app"]["windows"[0]"devtools": true` only for debug builds

**Sensitive Data Handling:**
- Risk: No environment variable validation or secret management pattern established
- Files: None (no env handling exists yet)
- Current mitigation: None
- Recommendations: Establish secure patterns before adding API keys for translation services

## Performance Bottlenecks

**No Performance Issues Currently:**
- The application is minimal with no actual workloads
- React Query is included but unused (no queries defined)
- Recommendation: Monitor React Query instantiation in `src/main.tsx` - QueryClient created but may not be needed yet

## Fragile Areas

**Route Generation Coupling:**
- Files: `src/routeTree.gen.ts`
- Why fragile: Auto-generated file with manual type casts (`as any`), easy to break with changes
- Safe modification: Regenerate via `pnpm dev` after route changes, never edit manually
- Test coverage: None

**Tauri Build Configuration:**
- Files: `src-tauri/tauri.conf.json`
- Why fragile: Hardcoded port 1420, if occupied, dev server fails silently
- Safe modification: Use `TAURI_DEV_HOST` env var as already configured in `vite.config.ts`

## Scaling Limits

**Frontend State Management:**
- Current capacity: No state management beyond React Query setup
- Limit: Not applicable yet
- Scaling path: Add React context or state management when UI complexity grows

**Rust Backend:**
- Current capacity: Single command `greet`
- Limit: No multi-threading, async patterns, or IPC beyond invoke/handler
- Scaling path: Add Tauri commands for each translation operation, consider async/await patterns

## Dependencies at Risk

**`shadcn` Package:**
- Risk: Package listed in dependencies but UI components use `radix-ui` directly
- Impact: Confusing dependency tree, potential version mismatch
- Migration plan: Either use shadcn CLI properly or remove from dependencies

**React 19 with TanStack Router 1.x:**
- Risk: Very recent React version (19.1.0) with potentially untested compatibility
- Impact: Router plugin may have edge cases with React 19's concurrent features
- Migration plan: Monitor for updates, test thoroughly after dependency updates

## Missing Critical Features

**Translation UI:**
- Problem: Routes display placeholder text, no actual translator interface
- Blocks: User cannot input text, select languages, or see translations

**Error Handling:**
- Problem: No error boundaries in React, no try/catch in Rust commands
- Blocks: Unhandled exceptions will crash the application

**Loading States:**
- Problem: No loading indicators defined
- Blocks: User has no feedback during async operations (once implemented)

**Language Selection:**
- Problem: No mechanism to select source/target languages
- Blocks: Cannot configure translation language pair

## Test Coverage Gaps

**No Test Files Present:**
- What's not tested: Entire application
- Files: None have `.test.*` or `.spec.*` patterns
- Risk: Any refactoring or feature addition could break existing functionality undetected
- Priority: High - add tests before implementing features

**Rust Code Untested:**
- What's not tested: Rust backend logic
- Files: `src-tauri/src/lib.rs`, `src-tauri/src/main.rs`
- Risk: The single `greet` function works, but adding translation logic without tests is risky

---

*Concerns audit: 2026-03-27*
