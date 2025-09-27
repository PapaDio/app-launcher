# Copilot Instructions for app-launcher

## Project Overview
- **Architecture:** This is a cross-platform desktop app built with Tauri (Rust backend) and React/TypeScript (frontend) using Vite. The Rust code lives in `src-tauri/src/`, while the frontend is in `src/`.
- **Major Components:**
  - **Frontend:** React components in `src/components/` (UI), hooks in `src/hooks/`, and utility functions in `src/lib/`.
  - **Backend:** Rust logic in `src-tauri/src/`, including app detection and main entrypoint.
  - **Assets:** Icons and images in `public/` and `src/assets/`.
  - **Config:** Tauri config in `src-tauri/tauri.conf.json`, build scripts in `src-tauri/build.rs`.

## Developer Workflows
- **Build Frontend:**
  - Use Vite (`npm run dev` for development, `npm run build` for production).
- **Build Tauri App:**
  - Use Tauri CLI (`npm run tauri dev` for live reload, `npm run tauri build` for release).
- **Rust Backend:**
  - Main Rust files: `src-tauri/src/main.rs`, `src-tauri/src/app_detector.rs`, `src-tauri/src/lib.rs`.
  - Use `cargo build` or Tauri commands for compilation.
- **Debugging:**
  - Use `rust-analyzer` for Rust, browser/React DevTools for frontend.

## Project-Specific Patterns
- **Component Structure:**
  - UI components are from ShadCN/ui at `src/components/ui/`.
  - Dialogs, context menus, and providers are separated for clarity.
- **State Management:**
  - Context and hooks (e.g., `useAppData`, `use-toast`) are used for app state and notifications.
- **Custom App Data:**
  - App metadata and custom apps are stored in JSON files (`src-tauri/custom_apps.json`, `components.json`).
- **Styling:**
  - Uses Tailwind CSS (`tailwind.config.js`, `src/styles/App.css`).

## Integration Points
- **Frontend/Backend Communication:**
  - Tauri APIs are used for IPC between React and Rust.
  - Rust exposes commands to the frontend via Tauri.
- **External Dependencies:**
  - Rust crates (see `Cargo.toml`), NPM packages (see `package.json`).

## Conventions & Examples
- **File Naming:**
  - Use PascalCase for React components, camelCase for hooks and utilities.
- **Adding a New App Type:**
  - Update `src-tauri/custom_apps.json` and relevant React components.
- **Key Files:**
  - `src-tauri/src/main.rs` (Rust entrypoint)
  - `src/App.tsx` (React root)
  - `src/components/` (UI)
  - `src-tauri/tauri.conf.json` (Tauri config)

## References
- See [README.md](../README.md) for IDE setup and basic info.

---
_If any section is unclear or missing, please provide feedback to improve these instructions._
