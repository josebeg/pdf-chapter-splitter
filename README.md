<div align="center">

  # 📟 PDF Chapter Splitter

  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
  [![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Deployment](https://github.com/josebeg/pdf-chapter-splitter/actions/workflows/deploy.yml/badge.svg)](https://github.com/josebeg/pdf-chapter-splitter/actions/workflows/deploy.yml)

  **A high-performance, terminal-inspired web utility for intelligent PDF segmentation.**
  
  [Live Demo](https://josebeg.github.io/pdf-chapter-splitter/) · [Report Bug](https://github.com/josebeg/pdf-chapter-splitter/issues) · [Request Feature](https://github.com/josebeg/pdf-chapter-splitter/issues)
</div>

---

## 📖 Overview

**PDF Chapter Splitter** is a specialized tool designed to break down large PDF documents into manageable chapters. Unlike generic splitters, it uses a **dual-track detection engine** to intelligently identify logical breaks in your documents, providing a seamless workflow from upload to batch export.

The interface is built as an **OS Simulation**, offering a unique developer-focused aesthetic inspired by terminal environments and cyberpunk design.

## ✨ Key Features

- **🧠 Intelligent Detection Engine**:
  - **Track A (Metadata)**: Leverages internal PDF bookmarks for 1:1 structural fidelity.
  - **Track B (Heuristics)**: Employs OCR-style heuristic analysis of typography and layout to identify headings when metadata is missing.
- **🛡️ Privacy First (Zero Server IO)**: 100% of the processing is performed in the client's browser using Web Workers. Your sensitive documents never touch a server.
- **🎚️ Adaptive Granularity**: Choose between *High-Level*, *Detailed*, or *Deep Scan* modes to control how finely the engine segments your document.
- **⌨️ Terminal-Driven Experience**: Includes a live logger, simulated boot sequence, and a OneDark color scheme for a premium CLI feel.
- **� Structured ZIP Export**: Automatically bundles split chapters into a clean, hierarchically named ZIP archive.

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19 + TypeScript |
| **Styling** | Tailwind CSS (Custom Dark Theme) |
| **PDF Engine** | Mozilla's PDF.js + pdf-lib |
| **Archiving** | JSZip |
| **State** | React Hooks + Terminal Logic Emulation |

## � Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the Repo**
   ```bash
   git clone https://github.com/josebeg/pdf-chapter-splitter.git
   ```
2. **Install Dependencies**
   ```bash
   cd pdf-chapter-splitter
   npm install
   ```
3. **Launch Development Environment**
   ```bash
   npm run dev
   ```

## 🔌 Deployment

This project is optimized for **GitHub Pages**.

1. Fork or Clone this repository.
2. Ensure GitHub Actions are enabled.
3. The included `.github/workflows/deploy.yml` will automatically build and deploy the app whenever you push to `main`.
4. Configure your repository settings under **Pages** to use **GitHub Actions** as the source.

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/josebeg">Josebeg</a></sub>
  <br/>
  <code>SYSTEM_STATUS: OPTIMAL</code>
</div>
