<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 📟 PDF Chapter Splitter v1.0.6

A powerful, high-performance terminal-simulated web application designed to intelligently segment PDF documents into individual chapters or sections. Built with a focus on privacy, speed, and a sleek developer-centric aesthetic.

## 🚀 Key Features

- **🧠 Dual-Track Detection Engine**:
  - **Track A (Bookmarks)**: Automatically extracts structure from internal PDF metadata.
  - **Track B (Heuristics)**: Uses advanced heuristic rules to detect headings based on font size, positioning, and text patterns.
- **🎚️ Adjustable Granularity**: Three levels of detection logic—Main chapters, Sub-chapters, or Deep segment analysis.
- **🛠️ Manual Node Overrides**: Full control to add, rename, or delete detected segments and adjust page ranges before execution.
- **📦 Batch Export**: Generates and downloads a structured ZIP archive containing all split PDF chapters.
- **🔒 100% Client-Side**: All binary processing happens locally in your browser. No PDF data ever leaves your machine—**Zero Server IO**.
- **📺 Cyberpunk UI**: A immersive "OS Simulation" interface featuring the OneDark theme, custom scanline effects, and a live output console.

## 🛠️ Technology Stack

- **Framework**: React 19 (TypeScript)
- **Styling**: Tailwind CSS
- **PDF Analysis**: [PDF.js](https://mozilla.github.io/pdf.js/)
- **PDF Manipulation**: [pdf-lib](https://pdf-lib.js.org/)
- **Compression**: [JSZip](https://stuk.github.io/jszip/)
- **Build Tool**: Vite

## 💻 Local Development

**Prerequisites:** Node.js (v18+)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/josebeg/pdf-chapter-splitter.git
   cd pdf-chapter-splitter
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

## 🌐 Deployment to GitHub Pages

The project is pre-configured for automated deployment via GitHub Actions.

1. Push your changes to the `main` branch.
2. In your GitHub repository settings, navigate to **Pages**.
3. Set the **Source** to **GitHub Actions**.
4. The deployment workflow will trigger automatically and host your app on `<username>.github.io/pdf-chapter-splitter/`.

---

<div align="center">
  <p><i>"Unauthorized data extraction is logged by kernel."</i></p>
</div>
