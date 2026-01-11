# CrossRemit Pro 🌍🚀

**CrossRemit Pro** is a full-fledged, enterprise-grade cross-border remittance platform built on Ethereum (Polygon) with a complete Web2 backend and React frontend.

It features **Real-time Multi-Currency Settlement**, **Bank-Grade KYC/AML Compliance**, **AI-Driven Fraud Detection**, and a **Premium User Experience**.

---

## 🏗 System Architecture

The platform consists of three main pillars:

### 1. Smart Contracts (Blockchain Layer)
- **`Remittance.sol`**: The core settlement engine.
  - Enforces `onlyVerified` modifier for transactions.
  - Owners can whitelist/blacklist users (KYC).
  - Records immutable transaction proof on-chain.
- **`MockToken.sol`**: An ERC20 stablecoin (USDC) for testing.

### 2. Backend API (Node.js/Express)
- **Database**: `lowdb` (JSON-based) for persistent user profiles and transaction history.
- **Mock Oracle**: Provides live exchange rates for **USD -> NGN, EUR, GBP, INR, JPY**.
- **Compliance Engine**:
  - `/api/kyc/submit`: Handles ID document uploads.
  - `/api/admin/approve`: Allows compliance officers to verify users.
- **AI Sentinel**:
  - `/api/ai/fraud-check`: Analyzes transaction patterns using heuristics to assign a **Risk Score** (0-100). Blocks high-risk transfers.

### 3. Frontend Application (React + Vite)
- **Premium UI**: Dark mode landing page, Glassmorphism dashboard, Framer Motion animations.
- **Features**:
  - **Wallet Connect**: Metamask integration.
  - **KYC Gate**: Users cannot Transact until approved by Admin.
  - **Admin Dashboard**: Live analytics (Volume, User Count) and Verification Queue.
  - **Smart Send Form**: Live currency conversion and AI Risk Alerts before signing.
  - **Activity Feed**: Unified history of off-chain metadata and on-chain status.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MetaMask Wallet

### Installation

1.  **Clone & Install Dependencies**
    ```bash
    # Root (Hardhat)
    npm install

    # Backend
    cd backend
    npm install

    # Frontend
    cd ../frontend
    npm install
    ```

2.  **Start Local Blockchain**
    Open Terminal 1:
    ```bash
    npx hardhat node
    ```

3.  **Deploy Smart Contracts**
    Open Terminal 2:
    ```bash
    npx hardhat run scripts/deploy-local.js --network localhost
    ```

4.  **Start Backend Server**
    Open Terminal 3:
    ```bash
    cd backend
    node server.js
    ```
    *API running on http://localhost:3001*

5.  **Start Frontend**
    Open Terminal 4:
    ```bash
    cd frontend
    npm run dev
    ```
    *App running on http://localhost:5173* (or similar)

---

## 🧪 Usage Guide

1.  **Connect**: Open the app and connect MetaMask (Localhost 8545).
2.  **Onboard**: Submit the KYC Form (Enter any name/ID).
3.  **Approve (Admin)**: On the same dashboard, find the **Admin Panel**. Click the **Checkmark** to approve yourself.
4.  **Mint Funds**: Click **"Mint Mock USDC"** in the header to get test money.
5.  **Send**:
    - Select Currency (e.g., EUR).
    - Enter Amount.
    - **AI Check**: Notice the "Risk Score" badge. Try sending > 10,000 to trigger a warning!
    - Confirm transaction in MetaMask.
6.  **Verify**: Check "Recent Activity" to see the log.

---

## 🛡️ Security & Compliance
- **On-Chain Enforcement**: The contract *rejects* any interaction from non-whitelisted addresses.
- **Fraud Guard**: The AI backend pre-screens every request.
- **Audit Logs**: All admin actions are logged.

---

*Built with ❤️ by Antigravity*
