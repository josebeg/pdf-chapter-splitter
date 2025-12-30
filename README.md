<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1oQYtIeGDyWkdbO3ZKwbhfpoabswE2U4N

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to GitHub Pages

1. Create a new repository on GitHub.
2. Push your code to the `main` branch.
3. In your repo settings, go to **Pages** and set the **Source** to **GitHub Actions**.
4. The app will be automatically built and deployed.

> [!NOTE]
> Since this app is now 100% client-side, you don't need to provide any API keys for deployment.
