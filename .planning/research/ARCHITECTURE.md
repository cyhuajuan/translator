# Architecture Patterns

**Domain:** Tauri 2 Desktop App + Local Ollama API
**Researched:** 2026-03-27
**Confidence:** MEDIUM

**Note:** Web search tools were unavailable during research. Findings are based on Tauri 2 best practices from training data. Recommend validation via official Tauri docs at https://tauri.app if any claim seems incorrect.

## Recommended Architecture

### Component Boundaries

```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend                          │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐  │
│  │  UI Layer   │───▶│ Translation │───▶│  State Manager  │  │
│  │  (Components)│    │   Hook      │    │  (TanStack)     │  │
│  └─────────────┘    └──────┬──────┘    └─────────────────┘  │
└───────────────────────────┼─────────────────────────────────┘
                            │ invoke()
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Tauri IPC Bridge                         │
│              (tauri::command via generate_handler!)         │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Rust Backend                              │
│  ┌─────────────────┐    ┌─────────────────┐                  │
│  │  Command Layer │───▶│  Ollama Client  │                  │
│  │ (tauri::command)│    │    (reqwest)    │                  │
│  └─────────────────┘    └────────┬────────┘                  │
└─────────────────────────────────┼────────────────────────────┘
                                  │ HTTP POST
                                  ▼
                    ┌─────────────────────────┐
                    │   Ollama API            │
                    │   localhost:11434       │
                    │   /api/generate          │
                    └─────────────────────────┘
```

### What Talks to What

| From | To | Protocol | Purpose |
|------|-----|----------|---------|
| React Components | Translation Hook | Function call | UI event handling |
| Translation Hook | Rust Backend | `invoke()` (IPC) | Request translation |
| Rust Backend | Ollama | HTTP/JSON | Model inference |
| Ollama | Rust Backend | HTTP/JSON | Response |

### Data Flow

**Translation Request:**
1. User enters text in frontend input
2. User clicks translate button
3. Frontend calls `invoke('translate', { text, sourceLang, targetLang })`
4. Rust command receives request
5. Rust builds prompt with template and source/target language
6. Rust sends POST to `http://localhost:11434/api/generate`
7. Ollama returns JSON with translated text
8. Rust parses response and returns to frontend
9. Frontend updates state with result

**Error Flow:**
1. If Ollama unreachable: Rust catches error, returns error variant
2. Frontend receives error, displays user-friendly message
3. App continues to be usable (no crash)

## API Call Logic: Rust Backend vs JavaScript Frontend

**Recommendation: Rust Backend**

| Consideration | JavaScript Frontend | Rust Backend |
|--------------|--------------------|--------------|
| CORS | Problematic - localhost has CORS restrictions | No CORS issues |
| Error handling | Scattered | Centralized |
| Ollama URL exposure | Visible in bundled JS | Hidden |
| Async management | Promise-based | tokio runtime |
| Type safety | TypeScript (good) | Rust (excellent for HTTP) |

**Exception:** If building a pure web view that needs to call Ollama directly (not a Tauri desktop app), JavaScript would be necessary. But for Tauri desktop, Rust backend is the recommended pattern.

## Build Order (Dependencies)

```
Phase 1: Foundation
├── Setup Rust HTTP client (reqwest)
├── Define Tauri commands (translate, health_check)
└── Verify Rust → Ollama connectivity

Phase 2: Backend Integration
├── Implement translation prompt builder
├── Add error types and handling
├── Test Ollama API round-trip
└── Verify Rust command returns proper JSON

Phase 3: Frontend Integration
├── Create TranslationHook (calls invoke)
├── Wire up UI button to hook
├── Display loading state
└── Handle error states from backend

Phase 4: Polish
├── Add language persistence
├── Refine error messages
└── Add health check on startup
```

## Key Rust Patterns

### Tauri Command Pattern

```rust
use serde::{Deserialize, Serialize};
use reqwest::Client;
use tokio;

#[derive(Debug, Serialize, Deserialize)]
pub struct TranslateRequest {
    pub text: String,
    pub source_lang: String,
    pub target_lang: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TranslateResponse {
    pub translated_text: String,
}

#[tauri::command]
pub async fn translate(
    text: String,
    source_lang: String,
    target_lang: String,
) -> Result<TranslateResponse, String> {
    // Build prompt, call Ollama, return response
}
```

### Required Rust Dependencies

```toml
[dependencies]
reqwest = { version = "0.12", features = ["json"] }
tokio = { version = "1", features = ["full"] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
```

## Component Responsibilities

| Component | Responsibility |
|-----------|---------------|
| `src/routes/index.tsx` | UI input/output, button click |
| `src/hooks/useTranslation.ts` | Bridge to Rust invoke, state management |
| `src-tauri/src/lib.rs` | Tauri command definitions |
| `src-tauri/src/ollama.rs` | Ollama HTTP client, prompt building |
| `src-tauri/src/error.rs` | Error type definitions |

## Security Notes

- Ollama runs on localhost only (not exposed externally)
- No API keys required for local Ollama
- Frontend cannot directly inspect HTTP traffic to Ollama (it's in Rust)
- CSP in tauri.conf.json should be configured appropriately

## Sources

- [Tauri 2 Commands Documentation](https://tauri.app/develop/calling-rust/) (MEDIUM confidence - training data)
- [Tauri IPC Pattern](https://tauri.app/develop/call-and-subscribe/) (MEDIUM confidence - training data)
- [Ollama API Reference](https://github.com/ollama/ollama/blob/main/docs/api.md) (MEDIUM confidence - training data)
