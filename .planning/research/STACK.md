# Technology Stack: Ollama API Integration with Tauri Desktop App

**Project:** Ollama Translator Desktop App
**Researched:** 2026-03-27
**Confidence:** HIGH (established technologies with well-documented patterns)

## Recommended Stack

### HTTP Requests in Rust Backend

| Crate | Version | Purpose | Why |
|-------|---------|---------|-----|
| `reqwest` | 0.11+ | HTTP client | **De facto standard** for Rust HTTP requests. Async by default, supports HTTPS, streaming, and integrates seamlessly with Tauri commands. |
| `serde` + `serde_json` | Latest | JSON serialization | Natural companion to reqwest for parsing Ollama's JSON responses. |
| `tokio` | 1+ | Async runtime | Required for reqwest's async functionality. Tauri 2 uses it internally. |

**Rust Backend Approach:**

```rust
// src-tauri/src/commands.rs
use reqwest::Client;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct OllamaRequest {
    model: String,
    prompt: String,
    stream: bool,
}

#[tauri::command]
async fn translate(text: String, target_lang: String) -> Result<String, String> {
    let client = Client::new();

    let request_body = OllamaRequest {
        model: "translategemma".to_string(),
        prompt: format!("Translate to {}: {}", target_lang, text),
        stream: false,
    };

    let response = client
        .post("http://localhost:11434/api/generate")
        .json(&request_body)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let result: serde_json::Value = response.json().await.map_err(|e| e.to_string())?;
    Ok(result["response"].as_str().unwrap_or("").to_string())
}
```

### HTTP Requests in React Frontend

| Library | Purpose | Why |
|---------|---------|-----|
| Built-in `fetch` | HTTP requests | **Recommended for Tauri.** Tauri 2 uses WebView2 (Windows) / WKWebView (macOS) which have full Fetch API support. No extra dependencies needed. |

**Frontend Approach:**

```typescript
// For simple API calls, use fetch directly
async function translate(text: string, targetLang: string): Promise<string> {
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'translategemma',
      prompt: `Translate to ${targetLang}: ${text}`,
      stream: false,
    }),
  });

  const data = await response.json();
  return data.response;
}
```

**When to use alternatives:**

| Scenario | Use | Why |
|----------|-----|-----|
| Need interceptors | axios | Fetch doesn't have拦截器. Overkill for simple calls. |
| Need file uploads with progress | reqwest (Rust backend) | Better control over streaming. |
| Need request cancellation | axios orAbortController + fetch | Both support cancellation. |
| Complex authentication | reqwest (Rust backend) | More control over headers. |

## Architecture Decision: Backend vs Frontend HTTP Calls

**Recommendation: Make Ollama calls from Rust backend via Tauri commands**

| Aspect | Backend (Rust) | Frontend (React) |
|--------|-----------------|------------------|
| Security | Credentials/config stay local | Exposes connection logic |
| Error handling | Rust's Result types | JavaScript promises |
| Reusability | Can call from multiple commands | Single component |
| Latency | Same network call | Same network call |
| Complexity | Standard reqwest patterns | Standard fetch patterns |

**For this project:** Use **Rust backend calls via Tauri commands**. This keeps Ollama integration encapsulated in the backend, follows Tauri best practices, and allows future expansion (e.g., caching, rate limiting) without frontend changes.

## Alternative Crates/Libraries Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Rust HTTP Client | `reqwest` | `surf`, `isahc`, `ureq` | reqwest has largest ecosystem, best async support, and is most commonly used with Tauri. |
| JS HTTP Library | `fetch` (built-in) | `axios` | Tauri webview has full Fetch support. axios adds ~14KB bundle size for minimal benefit. |
| Tauri HTTP Plugin | `@tauri-apps/plugin-http` | Manual fetch/reqwest | Useful for mobile where CORS applies, but desktop localhost has no CORS. Skip for simplicity. |

## Dependencies to Install

```bash
# Cargo.toml (Rust dependencies)
[dependencies]
reqwest = { version = "0.12", features = ["json", "rustls-tls"] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
tokio = { version = "1", features = ["full"] }
tauri = { version = "2", features = [] }
```

```bash
# Frontend: No additional packages needed
# Node.js fetch is available in Tauri webview
```

## Source Verification

- **reqwest**: https://docs.rs/reqwest (official crate documentation)
- **Tauri 2 commands**: https://v2.tauri.app/distribute/proxies/ (proxy/command patterns)
- **Fetch API**: Standard web API, available in all Tauri webviews

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| reqwest recommendation | HIGH | Industry standard for Rust HTTP since 2018+ |
| Fetch recommendation | HIGH | Built-in to all modern webviews including Tauri |
| Backend-first architecture | HIGH | Follows Tauri security model and best practices |
| Version compatibility | MEDIUM | Check Cargo.toml latest versions at build time |

## Gaps

- No search API available to verify latest Tauri plugin recommendations
- Recommend running `cargo search reqwest` before finalizing versions
