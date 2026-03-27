# Phase 2: Language Persistence - Research

**Researched:** 2026-03-27
**Domain:** Tauri 2 plugin-store for local persistence
**Confidence:** HIGH

## Summary

Phase 2 implements UI-03: language preferences persist across app restarts. The decision to use `tauri-plugin-store` is locked (D-01). This research covers the plugin API, integration patterns, and pitfalls for the planner.

**Primary recommendation:** Use `LazyStore` on the frontend with `language_prefs` key, initialized in a `useEffect` hook. Save on Select `onChange` events. Register plugin in Rust with default `.build()`.

## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Use Tauri store plugin for persistence
- **D-02:** Real-time save on every language change
- **D-03:** Default: English (en) → Chinese (zh)

### Claude's Discretion
- Storage key name (e.g., `language_prefs` vs `preferences`)
- Tauri store initialization and error handling approach
- Whether to use `useEffect` or React state `onChange` for save triggers

### Deferred Ideas (OUT OF SCOPE)
- Prompt template update — Phase 1 territory, deferred to future optimization

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| UI-03 | 源语言和目标语言选择记录上次配置，程序重启后自动恢复 | tauri-plugin-store API supports get/set with auto-save; LazyStore pattern recommended for deferred load |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `tauri-plugin-store` (Rust) | 2.4.2 | Backend persistence | Official Tauri plugin for key-value store |
| `@tauri-apps/plugin-store` (JS) | 2.4.2 | Frontend bindings | Official JS guest bindings for the Rust plugin |

### Installation
```bash
# Rust side (src-tauri/Cargo.toml)
tauri-plugin-store = "2"

# Frontend side (package.json via pnpm)
pnpm add @tauri-apps/plugin-store
```

**Version verification:** npm shows `@tauri-apps/plugin-store@2.4.2` as latest (2024). Cargo shows `tauri-plugin-store = "2.4.2"` available.

## Architecture Patterns

### Recommended Project Structure
```
src/
├── lib/
│   ├── languages.ts    # LANGUAGES array (exists)
│   └── store.ts        # NEW: store initialization helper
├── routes/
│   └── index.tsx       # MODIFY: integrate persistence
src-tauri/src/
├── lib.rs              # MODIFY: register tauri-plugin-store
└── main.rs            # (no change)
```

### Pattern: LazyStore Initialization with useEffect

**What:** Load preferences on component mount using React `useEffect`, not at module level.

**When to use:** When store access should be deferred until component renders.

```typescript
// src/lib/store.ts (NEW)
import { LazyStore } from '@tauri-apps/plugin-store'

const store = new LazyStore('language_prefs.json')

export default store
```

```typescript
// In src/routes/index.tsx
import store from '@/lib/store'
import { LANGUAGES } from '@/lib/languages'

function RouteComponent() {
  const [sourceLang, setSourceLang] = React.useState<string>("en")
  const [targetLang, setTargetLang] = React.useState<string>("zh")
  const [storeLoaded, setStoreLoaded] = React.useState(false)

  // Load persisted values on mount
  React.useEffect(() => {
    const loadPrefs = async () => {
      await store.init()
      const savedSource = await store.get<string>('sourceLang')
      const savedTarget = await store.get<string>('targetLang')
      if (savedSource) setSourceLang(savedSource)
      if (savedTarget) setTargetLang(savedTarget)
      setStoreLoaded(true)
    }
    loadPrefs()
  }, [])

  // Save on change
  const handleSourceLangChange = async (value: string) => {
    setSourceLang(value)
    await store.set('sourceLang', value)
  }

  const handleTargetLangChange = async (value: string) => {
    setTargetLang(value)
    await store.set('targetLang', value)
  }

  // ... rest of component
}
```

**Source:** Official tauri-plugin-store README (https://github.com/tauri-apps/plugins-workspace/tree/v2/plugins/store)

### Pattern: Rust Plugin Registration

**What:** Register the store plugin in `lib.rs` before running.

**When to use:** Always — plugin must be registered at app startup.

```rust
// src-tauri/src/lib.rs
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_store::Builder::default().build())  // ADD THIS
        .invoke_handler(tauri::generate_handler![...])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

**Source:** Official tauri-plugin-store README

### Anti-Patterns to Avoid
- **Direct localStorage use:** Desktop apps should not use browser localStorage — tauri-plugin-store is the proper Tauri 2 solution
- **Store operation before init:** LazyStore requires `await store.init()` or `await store.load()` before `get`/`set` calls
- **Blocking component render with sync store load:** Use async `useEffect` for loading, not synchronous module-level code

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Persistent key-value storage | Custom JSON file reader/writer | tauri-plugin-store | Handles app paths, race conditions, atomic writes |
| Cross-platform storage | Platform-specific APIs | tauri-plugin-store | Works on Linux/Windows/macOS consistently |

**Key insight:** tauri-plugin-store is battle-tested for Tauri apps and handles edge cases (file locking, atomic saves, app data directories) that custom implementations miss.

## Common Pitfalls

### Pitfall 1: Store Not Registered
**What goes wrong:** `Store.load()` throws "not implemented" or similar error.
**Why it happens:** Plugin not added to Rust `lib.rs`.
**How to avoid:** Add `.plugin(tauri_plugin_store::Builder::default().build())` to tauri Builder.
**Warning signs:** Console errors about plugin not found.

### Pitfall 2: Accessing Store Before Init
**What goes wrong:** `get()` returns `undefined` even though value was set.
**Why it happens:** LazyStore requires `await store.init()` before first access.
**How to avoid:** Call `store.init()` in useEffect before accessing values.
**Warning signs:** First render shows defaults even if persisted values exist.

### Pitfall 3: Same Value Triggers Save
**What goes wrong:** Unnecessary store writes on every render.
**Why it happens:** Calling `set()` in `onChange` even when value unchanged.
**How to avoid:** Compare new value with current state before saving.

## Code Examples

### Complete Flow (Verified from Official Docs)

```typescript
import { LazyStore } from '@tauri-apps/plugin-store'

const store = new LazyStore('preferences.json')

// Load
await store.init()
const sourceLang = await store.get<string>('sourceLang')  // returns undefined if not set

// Save (auto-saves by default with 100ms debounce)
await store.set('sourceLang', 'en')

// Manual save if needed
await store.save()
```

**Source:** tauri-plugin-store README, TypeScript definitions

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Tauri 1.x store | tauri-plugin-store v2 | Tauri 2 release | v2 API uses `Store.load()` instead of constructor |

**Deprecated/outdated:**
- Tauri 1.x `tauri::Store` — replaced by `tauri-plugin-store` in Tauri 2
- `@tauri-apps/api/store` (old import path) — now `@tauri-apps/plugin-store`

## Open Questions

1. **Storage key name**
   - What we know: The CONTEXT.md leaves this to discretion
   - What's unclear: Whether `language_prefs.json` or just `preferences.json` is preferred
   - Recommendation: Use `language_prefs.json` since the store may expand to other preferences later

2. **Error handling strategy**
   - What we know: Store operations can fail if file is corrupted or permissions issues
   - What's unclear: Whether to silently fall back to defaults or show error toast
   - Recommendation: Silently fall back to defaults (en→zh) — same as Phase 1 defaults

## Environment Availability

Step 2.6: SKIPPED (no external dependencies beyond already-configured Tauri 2 + Node.js)

The phase requires only:
- Tauri 2 runtime (already in project via `src-tauri/`)
- pnpm (already in project for frontend dependencies)
- No new system-level tools needed

## Sources

### Primary (HIGH confidence)
- `@tauri-apps/plugin-store@2.4.2` npm package README — full API documentation, installation instructions
- `tauri-plugin-store` cargo crate — Rust side API
- TypeScript definitions in `dist-js/index.d.ts` — complete interface

### Secondary (MEDIUM confidence)
- Project existing code: `src/routes/index.tsx`, `src/lib/languages.ts`, `src-tauri/src/lib.rs` — current implementation to modify

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — official Tauri 2 plugin, versions verified from npm/cargo registry
- Architecture: HIGH — official README provides exact patterns
- Pitfalls: MEDIUM — based on general Tauri plugin patterns, not specific bug reports

**Research date:** 2026-03-27
**Valid until:** 2026-04-26 (30 days — stable plugin API)
