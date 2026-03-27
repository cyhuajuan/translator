# Technology Stack

**Analysis Date:** 2026-03-27

## Languages

**Primary:**
- TypeScript 5.9.3 - Frontend source code
- Rust 2021 edition - Backend/native code

**Secondary:**
- CSS (Tailwind CSS 4 with CSS variables)

## Runtime

**Environment:**
- Node.js (for frontend build)
- Tauri 2 (desktop runtime)

**Package Manager:**
- pnpm
- Lockfile: `pnpm-lock.yaml` (present)

## Frameworks

**Core:**
- React 19.1.0 - UI framework
- Tauri 2 - Desktop application framework
- Vite 8.0.1 - Build tool and dev server

**Routing:**
- @tanstack/react-router 1.168.2 - File-based routing with code splitting

**Data Fetching:**
- @tanstack/react-query 5.95.0 - Server state management

**UI Components:**
- shadcn 4.1.0 - Component library (using "radix-nova" style)
- radix-ui 1.4.3 - Unstyled, accessible UI primitives (via shadcn)
- class-variance-authority 0.7.1 - Variant management for components
- lucide-react 0.577.0 - Icon library

**Styling:**
- Tailwind CSS 4.2.2 - Utility-first CSS
- tw-animate-css 1.4.0 - Animation utilities
- tailwind-merge 3.5.0 - Tailwind class merging
- clsx 2.1.1 - Class name utility

**Desktop:**
- tauri-plugin-opener 2 - URL opening capability

## Build & Dev Tools

**Frontend Build:**
- Vite 8.0.1 with `@vitejs/plugin-react`

**Code Quality:**
- Biome 2.4.8 - Linting and formatting
  - Single quotes for JS, double for JSX
  - 2-space indentation
  - Recommended rules enabled

**CSS Build:**
- @tailwindcss/vite 4.2.2 - Tailwind Vite integration

**Routing Code Generation:**
- @tanstack/router-plugin 1.167.3 - Route tree generation

**Tauri CLI:**
- @tauri-apps/cli 2 - Tauri development/build commands

## Configuration

**TypeScript Configuration:**
- Target: ES2020
- Module: ESNext
- JSX: react-jsx
- Strict mode enabled
- Path alias: `@/*` maps to `./src/*`

**Vite Configuration:**
- Port: 1420
- Tailwind CSS plugin enabled
- TanStack Router plugin with auto code splitting
- Path alias: `@` resolves to `src/`

**Tauri Configuration:**
- App name: "translator"
- Window: 800x600
- Bundle targets: all
- CSP: null (disabled)

## Platform Requirements

**Development:**
- Node.js (for Vite dev server)
- Rust toolchain (for Tauri)
- pnpm

**Production:**
- Tauri desktop runtime (bundles Chromium + Rust)

---

*Stack analysis: 2026-03-27*
