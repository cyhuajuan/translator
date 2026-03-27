# External Integrations

**Analysis Date:** 2026-03-27

## APIs & External Services

**No external APIs detected.**
This is a minimal/stub Tauri application with no HTTP API integrations configured.

## Data Storage

**Local Storage Only:**
- No database configured
- No file storage service configured
- Session/state managed in-memory via React Query

## Authentication & Identity

**No authentication provider configured.**
- No auth library present (no Auth.js, Clerk, Supabase, etc.)
- No user identity management

## Monitoring & Observability

**Error Tracking:**
- None configured

**Logs:**
- Standard console logging via React/Tauri
- Log files in `logs/` directory (gitignored)

## CI/CD & Deployment

**Hosting:**
- Tauri desktop application (no web hosting)

**CI Pipeline:**
- None detected (no GitHub Actions, CI config, etc.)

## Environment Configuration

**Environment files:**
- `.env` file present (in gitignore)
- No public env vars configured (no VITE_ prefixed variables)

## Webhooks & Callbacks

**Incoming webhooks:**
- None

**Outgoing webhooks:**
- None

## Tauri Plugins

**Configured plugins:**
- `tauri-plugin-opener` - Enables opening URLs in default browser
  - Permissions: `opener:default`

## Desktop Capabilities

**Window permissions:**
- `core:default` - Standard window operations
- `opener:default` - Open URLs in browser

---

*Integration audit: 2026-03-27*
