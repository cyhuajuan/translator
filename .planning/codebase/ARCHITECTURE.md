# Architecture

**Analysis Date:** 2026-03-27

## Pattern Overview

**Overall:** Tauri 2 Desktop Application with React Frontend

**Key Characteristics:**
- Cross-platform desktop app using Tauri 2 (Rust backend)
- React 19 frontend with TypeScript
- File-based routing via TanStack Router (code-generated route tree)
- Server state management via TanStack Query
- CSS-in-JS via Tailwind CSS v4 with shadcn/ui components

## Layers

**Frontend (React):**
- Purpose: User interface and client-side state management
- Location: `src/`
- Contains: Routes, components, utilities, styles
- Depends on: `@tauri-apps/api` for Rust communication
- TanStack Router generates `routeTree.gen.ts` from file-based routes

**Backend (Rust/Tauri):**
- Purpose: Native desktop functionality, system integration
- Location: `src-tauri/src/`
- Contains: `lib.rs` (main logic), `main.rs` (entry point)
- Exposes commands via `#[tauri::command]` attribute
- Uses `tauri_plugin_opener` for system integrations

**Build System:**
- Purpose: Development server and production bundling
- Location: `vite.config.ts`, `tsconfig.json`
- Vite handles HMR and dev server on port 1420

## Data Flow

**Frontend-to-Backend Communication:**

1. Frontend invokes Tauri commands via `@tauri-apps/api`
2. `src-tauri/src/lib.rs` defines commands with `#[tauri::command]`
3. Response returned to frontend asynchronously
4. Example in `src-tauri/src/lib.rs`:
   ```rust
   #[tauri::command]
   fn greet(name: &str) -> String {
       format!("Hello, {}! You've been greeted from Rust!", name)
   }
   ```

**Routing Flow:**

1. File-based routes in `src/routes/` define route structure
2. TanStack Router plugin generates `src/routeTree.gen.ts`
3. `src/main.tsx` creates router with generated tree and QueryClient context
4. `RouterProvider` renders route tree

## Key Abstractions

**Route Component Pattern:**
- Location: `src/routes/*.tsx`
- Pattern: `createFileRoute('/path')` creates route with component
- Generated type-safe route tree in `routeTree.gen.ts`

**UI Component Pattern:**
- Location: `src/components/ui/*.tsx`
- Pattern: shadcn/ui components using Radix UI primitives
- Styled with Tailwind CSS using `cn()` utility

**Utility Pattern:**
- Location: `src/lib/utils.ts`
- Purpose: Shared utilities like `cn()` for Tailwind class merging

## Entry Points

**Rust Backend:**
- `src-tauri/src/main.rs`: Application entry, calls `hj_project_name_lib::run()`
- `src-tauri/src/lib.rs`: `run()` function builds Tauri app with plugins and command handlers

**React Frontend:**
- `src/main.tsx`: React app entry, creates QueryClient and RouterProvider
- `index.html`: HTML entry point with `<div id="root">`

## Error Handling

**Rust:**
- `expect()` for unrecoverable errors in Tauri builder
- `Result` types with `?` operator for fallible operations

**TypeScript:**
- Strict mode enabled in `tsconfig.json`
- `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`

## Cross-Cutting Concerns

**Styling:** Tailwind CSS v4 via `@tailwindcss/vite`, shadcn/ui component library
**State:** TanStack Query for server state, component state for local UI
**Routing:** File-based with code generation
**Linting:** Biome for formatting and linting (configured in `biome.json`)
**Type Safety:** Generated route types via TanStack Router plugin

---

*Architecture analysis: 2026-03-27*
