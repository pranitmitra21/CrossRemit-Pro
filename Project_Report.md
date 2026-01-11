# Project Report: Cross-Border Remittance Platform

## 1. Executive Summary
**CrossRemit Pro** is a hybrid decentralized application (dApp) designed to facilitate secure, compliant, and efficient cross-border payments. It leverages the **Ethereum/Polygon** blockchain for final settlement while utilizing a **Web2 backend** for compliance (KYC), user management, and enhanced user experience features like AI-driven fraud detection.

## 2. System Architecture
The application follows a **3-Tier Architecture**:

### A. Blockchain Layer (Smart Contracts)
- **Role:** Trustless settlement, immutable transaction recording, and compliance enforcement.
- **Technology:** Solidity (v0.8.20), Hardhat.
- **Key Components:**
    - `Remittance.sol`: The core logic. Validates that senders are KYC-verified before allowing transfers.
    - `MockToken.sol`: An ERC20 token acting as the settlement stablecoin (e.g., USDC).

### B. Backend Layer (Off-Chain Logic)
- **Role:** Data persistence, complex business logic, compliance management, and blockchain synchronization.
- **Technology:** Node.js, Express, LowDB (JSON Database).
- **Key Services:**
    - **KYC Engine:** Handles document submission and admin approval.
    - **Blockchain Sync:** Automatically syncs "Verified" status from the off-chain database to the on-chain Smart Contract.
    - **AI Fraud Sentinel:** Evaluates transactions based on heuristics (Risk Score 0-100).
    - **Relayer/Faucet:** Provides gas funds for testing environments.

### C. Frontend Layer (User Interface)
- **Role:** User interaction, wallet connection, and dashboard visualization.
- **Technology:** React, Vite, Ethers.js.
- **Key Features:**
    - Modern UI with glassmorphism design.
    - Admin Dashboard for compliance officers.
    - End-user Dashboard for sending funds and tracking status.

---

## 3. Technical Deep Dive

### 3.1 Smart Contract Logic (`Remittance.sol`)
The contract employs an `onlyVerified` modifier to gate the `sendRemittance` function.
- **State Variables:**
    - `kycVerified`: Mapping of user addresses to boolean status.
    - `transfers`: Storage of all Remittance records (Sender, Recipient, Amount, FX Rate).
- **Functions:**
    - `setKycStatus(address, bool)`: Admin-only function to whitelist users.
    - `sendRemittance(...)`: Transfers tokens from Sender to Contract. Records metadata.
    - `withdraw(id)`: Allows the specific recipient to claim their funds.

### 3.2 Backend Workflow (`server.js`)
The backend is the "brain" that bridges Web2 usability with Web3 security.
- **Data Model:**
    - **Users:** Stores Name, Document, Status (`pending`/`verified`/`rejected`).
    - **Transactions:** Off-chain log for UI history (faster retrieval than querying blockchain events).
- **KYC Synchronization:**
    - The server runs a `syncKycOnChain` function. When an Admin verifies a user via the API, the backend (using a private key) calls the smart contract to update the user's status on-chain. This creates a "gasless" experience for the admin's UI actions (admin pays gas via backend wallet).

### 3.3 AI Fraud Detection
Mock AI logic evaluates every transfer request:
- **High Value:** > 10,000 units adds +40 risk.
- **Blacklist:** Recipients starting with `0x000` get +80 risk.
- **Random Variance:** Adds "fuzzy" logic to simulate real-world AI uncertainty.

---

## 4. Key Features & Flow
1.  **Onboarding:** User connects wallet -> Submits KYC form -> Backend stores request.
2.  **Compliance:** Admin reviews request in Dashboard -> Approves User -> Backend syncs approval to Blockchain.
3.  **Sending:** User enters amount/currency -> "AI Sentinel" checks risk -> If safe, User signs Metamask tx -> Funds move to Contract.
4.  **Settlement:** Recipient connects wallet -> Sees pending transfer -> Calls `withdraw` -> Funds move to Recipient.

## 5. Security Considerations
- **Centralization Risk:** The Admin (Owner) has full control over the KYC list.
- **Private Key Management:** The backend uses a hardcoded private key (default Hardhat account) for syncing. In production, this must be replaced with a secure KMS (Key Management System).
- **Data Privacy:** User documents are currently stored in a local JSON file. Production should use encrypted S3 or IPFS storage.

## 6. Recommendations
1.  **Database:** Migrate from LowDB (JSON) to MongoDB or PostgreSQL for scalability.
2.  **Indexing:** Use The Graph or a dedicated indexer instead of relying solely on local DB logs for transaction history.
3.  **Security:** Externalize the `PRIVATE_KEY` management and implement rate limiting on the Faucet and API.
