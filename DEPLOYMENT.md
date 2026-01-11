# Deployment Guide for CrossRemit Pro

This guide will walk you through deploying the **Cross-Border Remittance** application to the cloud.

## Prerequisites
- **GitHub Account** (to host your code)
- **Vercel Account** (for Frontend) - Free
- **Render Account** (for Backend) - Free
- **Alchemy/Infura URL** (for Sepolia Network)

---

## Phase 1: Push Code to GitHub
1. Create a new repository on [GitHub](https://github.com/new).
2. Open your project terminal and run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

---

## Phase 2: Deploy Backend (Render)
1. Log in to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Settings:
   - **Name:** `crossremit-backend`
   - **Root Directory:** `backend` (Important!)
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. **Environment Variables** (Add these):
   - `PORT`: `3001` (or leave default)
   - `PRIVATE_KEY`: Your wallet private key (from `.env`)
   - `ALCHEMY_API_URL`: Your Alchemy Sepolia URL
6. Click **Deploy Web Service**.
7. **Copy the Backend URL** (e.g., `https://crossremit-backend.onrender.com`). You will need this for the frontend.

> **Note on Database:** The free node on Render is ephemeral. The `db.json` file will reset every time the server restarts. For a persistent production app, you would need to switch to a hosted database service.

---

## Phase 3: Deploy Frontend (Vercel)
1. Log in to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository.
4. Settings:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend` (Edit this!)
5. **Environment Variables**:
   - `VITE_API_URL`: Paste your Render Backend URL (e.g., `https://crossremit-backend.onrender.com`) - **No trailing slash!**
6. Click **Deploy**.
7. Vercel will build your site and give you a live URL (e.g., `https://crossremit-frontend.vercel.app`).

---

## Phase 4: Final Configuration
1. **Update `config.json`:** Ensure your smart contract deployed on Sepolia is the one referenced in `frontend/src/config.json`. If you used `deploy-local.js`, you might need to run a deployment script for Sepolia and update this file with the new address before pushing to GitHub.
2. **Access the App:** Open your Vercel URL.
3. **Connect Wallet:** Ensure your MetaMask is on the **Sepolia Network**.

## Troubleshooting
- **Backend Error:** Check Render logs. If it says "Module not found", ensure `Root Directory` is set to `backend`.
- **API Connection Failed:** Check browser console (F12). Verify `VITE_API_URL` is set correctly in Vercel.
- **Contract Error:** Make sure you are on Sepolia and have Sepolia ETH.
