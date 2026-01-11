import React, { useState, useEffect } from 'react';
import { BrowserProvider } from 'ethers';
import { Wallet } from 'lucide-react';

const WalletConnect = ({ onConnect, account }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (!account) return;
        navigator.clipboard.writeText(account);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const provider = new BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const address = await signer.getAddress();
                onConnect(provider, signer, address);
            } catch (error) {
                console.error("Connection failed", error);
            }
        } else {
            alert("Please install MetaMask!");
        }
    };

    return (
        <button
            id="wallet-connect-btn"
            onClick={account ? handleCopy : connectWallet}
            className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition overflow-hidden relative ${account ? "bg-indigo-600 hover:bg-indigo-700" : "bg-blue-600 hover:bg-blue-700"
                }`}
            title={account ? "Click to Copy Address" : "Connect Wallet"}
        >
            <Wallet size={20} />
            <span className="font-mono">
                {account
                    ? (copied ? "Copied! ✅" : `${account.slice(0, 6)}...${account.slice(-4)}`)
                    : "Connect Wallet"}
            </span>
        </button>
    );
};

export default WalletConnect;
