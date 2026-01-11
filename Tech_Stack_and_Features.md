# Technology Stack & Feature Breakdown

## 1. Technology Stack

### A. Frontend (User Interface)
| Technology | Purpose | Why it was used |
| :--- | :--- | :--- |
| **React (Vite)** | Core UI Framework | Fast development, component-based architecture, and high performance. |
| **Tailwind CSS** | Styling | Rapid UI building with utility classes; ensures a modern, clean look. |
| **Ethers.js (v6)** | Blockchain Interaction | Connects the web app to the Ethereum network (Metamask) to sign transactions. |
| **Framer Motion** | Animations | Adds smooth transitions and "glassmorphism" effects for a premium feel. |

### B. Backend (Server & API)
| Technology | Purpose | Why it was used |
| :--- | :--- | :--- |
| **Node.js + Express** | API Server | Handles off-chain logic, API endpoints, and serves as the bridge between UI and Blockchain. |
| **LowDB** | Database | Lightweight, JSON-based database for storing user profiles and history without needing a complex SQL setup. |
| **Cors & Body-Parser** | Middleware | Security and request parsing for handling JSON data from the frontend. |

### C. Blockchain (Settlement Layer)
| Technology | Purpose | Why it was used |
| :--- | :--- | :--- |
| **Solidity (v0.8.20)** | Smart Contracts | The programming language for writing the `Remittance` and `MockToken` contracts. |
| **Hardhat** | Development Environment | Compiling, testing, and deploying contracts to a local Ethereum network. |
| **OpenZeppelin** | Security Library | standard, battle-tested contracts (ERC20, Ownable) to prevent vulnerabilities. |

---

## 2. Feature Breakdown

### 🛡️ Compliance & Security
| Feature | Description | Usage / User Benefit |
| :--- | :--- | :--- |
| **KYC Guard** | Users must upload ID and get approval before trading. | **Prevents illegal activity.** Ensures only verified users can interact with the smart contract. |
| **Admin Dashboard** | A specialized view for compliance officers. | **Operational Control.** Allows admins to review documents and approve/reject users with one click. |
| **Blockchain Sync** | Automatic background synchronization. | **Reliability.** Ensures that when an admin approves a user in the database, the Smart Contract is updated automatically. |

### 🤖 Intelligent Features
| Feature | Description | Usage / User Benefit |
| :--- | :--- | :--- |
| **AI Fraud Sentinel** | Analyzes transaction patterns (Amount, Receiver) before enforcing. | **Risk Reduction.** Warns users if a transaction looks suspicious (e.g., sending to a known bad address or unusually high amounts). |
| **Smart Rates** | Fetches live (mock) exchange rates for multiple currencies. | **Transparency.** Shows users exactly how much their recipient will get in Fiat terms (EUR, NGN, GBP). |

### 💸 Core Money Movement
| Feature | Description | Usage / User Benefit |
| :--- | :--- | :--- |
| **Cross-Border Send** | The primary form for transferring funds. | **Speed & Cost.** Uses stablecoins for near-instant settlement instead of slow banking SWIFT networks. |
| **Withdrawal System** | Recipients claim funds via the portal. | **Self-Custody.** Gives the recipient control over when they pull the funds to their wallet. |
| **Mock Faucet** | "Mint Mock USDC" button. | **Testing.** Allows users to get free test tokens to try out the platform without spending real money. |
