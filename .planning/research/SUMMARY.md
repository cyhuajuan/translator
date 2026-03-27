# Project Research Summary

**Project:** Ollama Translator Desktop App
**Domain:** Desktop Translation Application with Local AI
**Researched:** 2026-03-27
**Confidence:** MEDIUM (web search unavailable during research; based on training data)

## Executive Summary

This is a desktop translation application built with Tauri 2 (Rust backend + React frontend) that interfaces with a local Ollama instance running a translation model. The application follows a local-first philosophy - all translation happens on the user's machine using Ollama, no cloud dependencies, no API keys, no data leaves the device. Experts build this type of application by encapsulating Ollama API calls in the Rust backend layer, avoiding CORS issues and keeping sensitive connection logic hidden from the frontend.

The recommended approach is to use Tauri commands (Rust) for all Ollama communication rather than direct frontend fetch calls. This provides better security, centralized error handling, and follows Tauri best practices. The stack uses reqwest 0.12+ for HTTP, serde for JSON serialization, and tokio for async runtime in Rust, with built-in fetch for any frontend HTTP needs.

Key risks include Ollama not being running when the app starts (connection refused), model not being pulled or wrong model name (404 errors), and streaming response handling (Ollama defaults to SSE format). These must be addressed in the backend integration phase to deliver a production-ready application.

## Key Findings

### Recommended Stack

**Core technologies for Tauri 2 + Ollama integration:**

- **reqwest 0.12+** (Rust): De facto standard for HTTP requests in Rust. Async by default with excellent JSON support for Ollama's API responses.
- **serde + serde_json**: Required for type-safe request/response handling in Rust commands.
- **tokio 1+**: Async runtime required for reqwest; Tauri 2 uses it internally.
- **Built-in fetch (JS)**: Recommended for any frontend HTTP needs; Tauri WebView2/WKWebView have full Fetch support.
- **axios**: Not needed - adds unnecessary bundle size for minimal benefit over fetch.

**Architecture decision:** Make Ollama calls from Rust backend via Tauri commands. Frontend should never directly call `localhost:11434`.

### Expected Features

**Must have (table stakes):**
- Text input area with paste support
- Language selection (source + target dropdowns with auto-detect)
- Translate button with loading state
- Translation output display (read-only, copyable)
- Copy to clipboard functionality
- Clear/reset function
- Ollama connection status indicator

**Should have (competitive differentiators):**
- Live/auto-translate on typing (with debouncing)
- Translation history (local storage, searchable)
- Keyboard shortcuts (Ctrl+Enter to translate)
- Dark/light theme (follows system preference)
- System tray / minimize to tray

**Defer (v2+):**
- Global hotkey for selected text from any app
- Multiple simultaneous translations (side-by-side)
- Pronunciation / TTS playback
- Favorites / saved translations

**Anti-features to never build:**
- Cloud account required
- Internet-dependent translation
- Subscription/paywall for basic features
- Excessive permissions
- Ads or bloat features

### Architecture Approach

The application follows a layered architecture: React frontend communicates with Rust backend via Tauri IPC (`invoke()`), and Rust backend makes HTTP calls to local Ollama API.

**Major components:**
1. **React UI Layer** (`src/routes/index.tsx`): Input/output, button clicks, loading states
2. **Translation Hook** (`src/hooks/useTranslation.ts`): Bridges frontend to Rust via `invoke()`, manages state
3. **Tauri Command Layer** (`src-tauri/src/lib.rs`): Defines `#[tauri::command]` functions
4. **Ollama Client** (`src-tauri/src/ollama.rs`): HTTP client for Ollama API, prompt building
5. **Error Handling** (`src-tauri/src/error.rs`): Centralized error types

**Data flow:** User input -> React component -> `invoke('translate', {...})` -> Rust command -> reqwest POST to `localhost:11434/api/generate` -> parse JSON response -> return to frontend -> update UI.

### Critical Pitfalls

1. **Ollama service not running** — App connects to `localhost:11434` but Ollama isn't started. Prevention: Add health check on startup, display user-friendly message with instructions to start Ollama.

2. **Model not pulled / wrong model name** — API returns 404. Prevention: Call `/api/tags` to verify model availability before first translation, show exact command `ollama pull translategemma` if missing.

3. **Streaming response mishandling** — Ollama's `/api/generate` streams SSE by default. Prevention: Set `"stream": false` in request body OR handle SSE parsing properly if streaming is needed.

4. **Request timeout on long translations** — Default timeouts too short for model inference (10-30+ seconds). Prevention: Configure 120+ second timeout explicitly, add cancellation capability.

5. **No error boundaries / crash on API failure** — Unhandled exceptions crash the app. Prevention: Wrap all API calls in error handling, add React error boundaries, show user-friendly error messages.

## Implications for Roadmap

Based on research, the following phase structure is recommended:

### Phase 1: MVP Foundation
**Rationale:** Establish the core translation loop with error handling. Must validate model quality and basic connectivity before building UI.
**Delivers:** Working translation from text input to output display via Tauri command.
**Features:** Text input, language selection, translate button, output display, copy to clipboard, clear/reset.
**Avoids:** Pitfall 11 (model quality) — validate `translategemma` produces acceptable translations before investing in UI.

### Phase 2: Backend Integration & Error Resilience
**Rationale:** Ollama is an external service that may not be running. This phase adds robust detection and user guidance.
**Delivers:** Health check on startup, user-friendly Ollama-not-running messages, model availability verification.
**Uses:** reqwest for HTTP, serde for JSON, tokio for async.
**Implements:** Ollama client module with proper error types.
**Avoids:** Pitfalls 1, 2, 5 (Ollama not running, model not found, incorrect API format).

### Phase 3: Frontend Integration & Polish
**Rationale:** Wire up the UI to backend with proper state management and error display.
**Delivers:** Connected UI with loading states, error handling, connection status indicator.
**Features:** Loading states, error messages, connection status indicator, basic error boundaries.
**Avoids:** Pitfall 9 (no error boundaries).

### Phase 4: Polish & v2 Features
**Rationale:** Quality of life improvements that don't affect core translation.
**Delivers:** Translation history, keyboard shortcuts, dark/light theme, system tray.
**Addresses:** Pitfalls 6, 8 (memory pressure, context overflow) with monitoring and context management.

### Phase Ordering Rationale

- **Phase 1 before 2:** Validate the core loop works before adding error resilience around it.
- **Phase 2 before 3:** Backend must be solid before frontend wires up to it extensively.
- **Phase 3 before 4:** Polish builds on working infrastructure, not before.
- **Grouping:** Backend concerns (Phase 2) grouped separately from frontend concerns (Phase 3).

### Research Flags

Phases needing deeper research during planning:
- **Phase 1:** Model quality validation — need to confirm `translategemma` exists and produces acceptable translations. Web search unavailable to verify model name and availability.
- **Phase 4:** System tray implementation — Tauri 2 specifics for system tray may need documentation lookup.

Phases with standard patterns (skip research-phase):
- **Phase 1:** Basic Tauri command setup is well-documented.
- **Phase 2:** reqwest + Ollama API integration follows standard HTTP patterns.
- **Phase 3:** React state management with Tauri invoke is common pattern.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | reqwest, serde, tokio are industry standards. Tauri 2 patterns well-established. |
| Features | MEDIUM | Based on translation software landscape knowledge; web search unavailable to verify user expectations. |
| Architecture | MEDIUM | Based on Tauri 2 best practices from training data; official docs recommend this pattern. |
| Pitfalls | MEDIUM | Based on Ollama API patterns and desktop integration experience; streaming format needs verification. |

**Overall confidence:** MEDIUM

**Reason:** Web search was unavailable during research. All findings based on training data. Recommend validating key claims (Ollama API exact format, `translategemma` model availability, Tauri 2 system tray API) via official documentation before Phase 4 planning.

### Gaps to Address

- **Model name verification:** `translategemma` model needs confirmation — exact name, quantization options, availability on Ollama library.
- **Streaming format:** Need to verify exact SSE format from Ollama `/api/generate` when `stream: true`.
- **Tauri 2 system tray API:** Specific APIs for system tray in Tauri 2 need verification.
- **Prompt engineering:** Effective system prompts for translation task need experimentation.

## Sources

### Primary (HIGH confidence)
- reqwest crate documentation (docs.rs/reqwest) — Rust HTTP client patterns
- Ollama API reference structure (github.com/ollama/ollama/blob/main/docs/api.md) — API endpoint format
- Tauri 2 command patterns (tauri.app/develop/calling-rust/) — IPC bridge patterns

### Secondary (MEDIUM confidence)
- Tauri 2 IPC documentation (training data) — invoke() patterns
- Translation software UX patterns (DeepL, Google Translate, Obsidian plugins) — feature expectations
- Desktop app error handling best practices — error boundary patterns

### Tertiary (LOW confidence)
- `translategemma` model specifics — needs verification from Ollama library
- Tauri 2 system tray API — needs official documentation lookup
- Memory requirements for Gemma models — general knowledge, actual requirements may vary

---
*Research completed: 2026-03-27*
*Ready for roadmap: yes*
