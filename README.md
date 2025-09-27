
# 🚀 App Launcher

>A beautiful, cross-platform desktop app for launching and managing your favorite applications. Built with Tauri (Rust backend) and React (TypeScript frontend), it offers a fast, modern, and customizable experience.

---

## ✨ Features

- **App Management:** Add, edit, delete, and launch apps with custom icons and categories.
- **Cross-Platform:** Runs on Windows, macOS, and Linux.
- **Fast & Lightweight:** Powered by Tauri and Vite for minimal resource usage.
- **Modern UI:** Built with React, shadcn/ui, Radix UI, and Tailwind CSS.
- **Custom Apps:** Easily manage your own app list via JSON config.

---

## 🛠️ Technology Stack

- **Frontend:** React, TypeScript, Vite, shadcn/ui, Radix UI, Tailwind CSS
- **Backend:** Rust, Tauri
- **IPC:** Tauri commands for frontend-backend communication
- **Config:** JSON files for custom apps and capabilities

---

## 📦 Project Structure

```
app-launcher/
├── src/                # React frontend
│   ├── components/     # UI components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions
│   ├── styles/         # CSS/Tailwind styles
│   └── App.tsx         # Main app entry
├── src-tauri/          # Rust backend (Tauri)
│   ├── src/            # Rust source files
│   ├── custom_apps.json# User app config
│   └── tauri.conf.json # Tauri config
├── public/             # Static assets/icons
├── package.json        # NPM dependencies
├── tailwind.config.js  # Tailwind config
├── vite.config.ts      # Vite config
└── README.md           # Project info
```

---

## 🚧 Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Rust](https://www.rust-lang.org/tools/install)
- [Tauri CLI](https://tauri.app/v1/guides/getting-started/prerequisites/)

### 1. Install Dependencies

```sh
npm install
```

### 2. Start Frontend (Vite)

```sh
npm run dev
```

### 3. Start Desktop App (Tauri)

```sh
npm run tauri dev
```

---

## 🏗️ Build for Release

To build the production desktop app:

```sh
npm run build        # Build frontend
npm run tauri build  # Build Tauri desktop app
```

The final binaries will be in `src-tauri/target/release/` (or platform-specific output folders).

---

## 📚 References & Docs

- [Tauri Documentation](https://tauri.app/)
- [React Documentation](https://react.dev/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 💡 Contributing

Pull requests and suggestions are welcome! Please open an issue for bugs or feature requests.

---

## 📝 License

MIT
