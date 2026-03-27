# Domain Pitfalls: Ollama Translator Desktop App

**Domain:** Tauri desktop app integrating with local Ollama API
**Researched:** 2026-03-27
**Confidence:** MEDIUM (based on Ollama API patterns and desktop app integration experience; web search unavailable to verify)

---

## Critical Pitfalls

### Pitfall 1: Ollama Service Not Running

**What goes wrong:** App attempts to call `localhost:11434` but Ollama is not running, resulting in "Connection refused" errors.

**Why it happens:** Desktop users may not realize Ollama needs to be running as a separate process before the app starts.

**Consequences:** Complete failure to translate. User sees generic network error with no actionable guidance.

**Prevention:**
1. Add startup detection in Phase 2 (Backend Integration) - ping Ollama health endpoint on app launch
2. Display clear user-facing message if Ollama is not detected with instructions to start it
3. Consider bundling or guiding users through Ollama installation

**Detection:**
- HTTP connection timeout/failure when attempting first translation
- Console logs showing `ECONNREFUSED` or similar socket errors

**Phase to address:** Phase 2 - Backend Integration

---

### Pitfall 2: Model Not Pulled / Wrong Model Name

**What goes wrong:** API returns 404 or 400 error indicating model not found when calling `/api/generate`.

**Why it happens:**
- User has Ollama running but has not pulled the `translategemma` model
- Misspelled model name in API request
- Model name format incorrect (Ollama requires exact format: `model:tag`, e.g., `translategemma:latest`)

**Consequences:** Translations fail. User sees error but does not know which model to install.

**Prevention:**
1. Validate model availability before first translation attempt
2. Call `/api/tags` to list available models and verify `translategemma` is present
3. Show user-friendly error with exact command to pull model: `ollama pull translategemma`

**Detection:**
- API 404 error with message about model not found
- Empty model list from `/api/tags`

**Phase to address:** Phase 2 - Backend Integration (with fallback in Phase 1 - MVP)

---

### Pitfall 3: Streaming Response Handling Errors

**What goes wrong:** App receives chunked streaming response but treats it as a single JSON response, resulting in malformed data or crashes.

**Why it happens:** Ollama's `/api/generate` endpoint streams responses by default with Server-Sent Events (SSE) format. Each chunk is a JSON object followed by a newline.

**Consequences:**
- Response parsing fails
- UI shows partial/translated text mixed with JSON
- Potential memory issues from buffering incorrect data

**Prevention:**
1. Use streaming-capable HTTP client (e.g., `reqwest` with `read_body_json_stream` in Rust, or fetch with `ReadableStream` in frontend)
2. Parse SSE format properly: each line is a complete JSON object
3. Accumulate response into string buffer before updating UI

**Detection:**
- Console errors about JSON parse failures
- Translation output appears corrupted or includes JSON fragments
- Network tab shows chunked transfer encoding

**Phase to address:** Phase 2 - Backend Integration

---

### Pitfall 4: Request Timeout on Long Translations

**What goes wrong:** Large text blocks cause requests to exceed timeout limits, resulting in truncated responses or failed requests.

**Why it happens:**
- Default HTTP client timeouts may be too short for model inference
- Translation with gemma can take 10-30+ seconds for long paragraphs
- Network latency + model inference time compounds

**Consequences:**
- Incomplete translations
- User sees timeout error with no retry option
- Poor UX requiring manual retry

**Prevention:**
1. Configure explicit timeout of 120+ seconds for translation requests
2. Implement request cancellation capability
3. Add progress indication for long-running translations
4. Consider chunking large inputs into smaller batches

**Detection:**
- Timeout errors in logs
- Partial responses received before timeout
- User complaints about long texts failing

**Phase to address:** Phase 2 - Backend Integration

---

## Moderate Pitfalls

### Pitfall 5: Incorrect API Request Format

**What goes wrong:** API returns 400 error with "invalid params, function name or parameters is empty" or similar validation errors.

**Why it happens:**
- Missing required fields in JSON body (e.g., `prompt`, `model`)
- Incorrect JSON structure (wrong field names)
- Sending form-encoded instead of JSON
- Missing `Content-Type: application/json` header

**Consequences:** Every translation request fails with validation error.

**Prevention:**
1. Verify exact API format per Ollama docs:
   ```json
   POST /api/generate
   {
     "model": "translategemma",
     "prompt": "Translate this: Hello",
     "stream": false
   }
   ```
2. Use type-safe HTTP client with clear request/response types
3. Add request validation before sending

**Detection:**
- 400 Bad Request responses
- Error messages mentioning missing parameters
- Validation errors in console

**Phase to address:** Phase 2 - Backend Integration

---

### Pitfall 6: Memory Pressure from Model Loading

**What goes wrong:** Ollama process crashes or is killed by OS due to insufficient memory when loading `translategemma` model.

**Why it happens:**
- Gemma models require significant RAM (2-8GB depending on quantisation)
- User may have other applications consuming memory
- No swap space configured
- 32-bit Ollama build hitting memory limits

**Consequences:**
- Ollama crashes silently
- App hangs waiting for response that never comes
- User must restart Ollama manually

**Prevention:**
1. Document minimum memory requirements (recommend 8GB+ RAM)
2. Add memory detection and warn user before they attempt translation
3. Consider loading model once at startup and keeping warm
4. Add retry logic with exponential backoff for transient failures

**Detection:**
- Ollama process exit codes
- System out of memory errors
- Logs showing model load failures

**Phase to address:** Phase 3 - Refinement & Polish

---

### Pitfall 7: Port Conflicts

**What goes wrong:** Another process is using port 11434, causing Ollama to fail to start or app cannot connect.

**Why it happens:**
- Another application already using port 11434
- User has multiple Ollama instances
- Port binding fails silently in Ollama

**Consequences:**
- Cannot connect to Ollama
- Confusing error messages about connection refused

**Prevention:**
1. Document how to check if port 11434 is in use: `netstat -an | grep 11434`
2. Provide instructions to change Ollama port if needed: `OLLAMA_HOST=localhost:11435`
3. Add port availability check in app initialization

**Detection:**
- Ollama logs showing port binding errors
- Connection refused immediately on app start

**Phase to address:** Phase 1 - MVP (detection only)

---

### Pitfall 8: Stale Model Context / Context Overflow

**What goes wrong:** Long conversation threads cause context window overflow, resulting in truncated or nonsensical translations.

**Why it happens:**
- Ollama models have fixed context windows (e.g., 8192 tokens for Gemma)
- Repeated translations accumulate in context
- No context reset mechanism implemented

**Consequences:**
- Quality degradation over time
- Translations become inconsistent
- Model may ignore recent instructions

**Prevention:**
1. Implement conversation/context management strategy
2. Reset context between independent translation tasks
3. Monitor context length and warn when approaching limits
4. For chat-like interfaces: keep only recent N messages

**Detection:**
- Translations degrade after many requests
- Model ignores language selection instructions
- Context window error messages

**Phase to address:** Phase 3 - Refinement & Polish

---

## Minor Pitfalls

### Pitfall 9: No Error Boundaries / Crash on API Failure

**What goes wrong:** Unhandled exceptions in React or Rust cause app to crash or show white screen when Ollama API fails.

**Why it happens:**
- No try/catch around API calls
- No React error boundaries
- Assumptions that API will always succeed

**Consequences:**
- Poor error UX
- App becomes unusable until restarted
- No recovery path for transient failures

**Prevention:**
1. Wrap all API calls in error handling
2. Add React error boundaries at route level
3. Implement retry logic for transient failures
4. Show user-friendly error messages with recovery actions

**Detection:**
- White screen of death
- Uncaught promise rejections
- Rust panics in logs

**Phase to address:** Phase 1 - MVP (error handling must be part of MVP)

---

### Pitfall 10: CORS Misconfiguration (if using frontend direct calls)

**What goes wrong:** If frontend directly calls `localhost:11434`, browser CORS policy blocks the request.

**Why it happens:**
- Browsers block cross-origin requests by default
- `localhost` to `localhost` is technically cross-origin
- Ollama may not send proper CORS headers

**Consequences:**
- All translation requests fail with CORS error
- Works in development but fails in production build

**Prevention:**
1. **Recommended:** Make Ollama calls through Rust/Tauri backend (avoids CORS entirely)
2. If direct frontend calls needed: Configure Ollama CORS via environment variable `OLLAMA_ORIGINS=*`
3. Use Tauri HTTP plugin which bypasses browser CORS

**Detection:**
- CORS errors in browser console
- Preflight requests failing
- Works in devtools but not in app

**Phase to address:** Phase 2 - Backend Integration (architectural decision)

---

### Pitfall 11: Model Inference Quality Issues

**What goes wrong:** Translations are poor quality, incorrect, or produce hallucinated content.

**Why it happens:**
- `translategemma` may not be suitable for production-quality translation
- Gemma models are instruction-following but not specifically trained as translators
- Prompt engineering insufficient

**Consequences:**
- User dissatisfaction
- Perceived as bug rather than model limitation
- May require prompt engineering or different model

**Prevention:**
1. Test with diverse input texts before committing to model
2. Craft effective system prompts specifying translation task
3. Have fallback or disclaimer about model limitations
4. Consider if `translategemma` is the right model choice

**Detection:**
- User complaints about translation quality
- Systematic errors in test translations
- Comparison with known good translations fails

**Phase to address:** Phase 1 - MVP (validate model quality before building UI)

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Phase 1: MVP Setup | No error handling, model quality issues | Build error handling alongside features; validate model first |
| Phase 2: Backend Integration | Streaming response handling, request format errors | Use proper HTTP client with SSE support; validate API contract |
| Phase 2: Backend Integration | Ollama not running | Detect and guide user on startup |
| Phase 3: Refinement | Memory pressure, context overflow | Add monitoring, context management |
| Phase 3: Refinement | Timeout issues | Tune timeouts, add progress indicators |

---

## Sources

**Confidence: MEDIUM**
Web search was unavailable during research. Findings based on:
- Ollama API documentation patterns (official API structure)
- General knowledge of local LLM integration patterns
- Tauri desktop app architecture best practices

**Key references (verify when web access is available):**
- Ollama API docs: https://github.com/ollama/ollama/blob/main/docs/api.md
- Ollama GitHub issues for common problems
- Tauri HTTP plugin documentation for backend-to-API calls

**Validation needed:**
- Confirm `translategemma` model exact name and availability
- Verify streaming response format for `/api/generate`
- Check if Ollama sends CORS headers (affects direct frontend calls)
