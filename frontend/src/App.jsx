import React, { useState, useEffect } from 'react';
import WalletConnect from './components/WalletConnect';
import Faucet from './components/Faucet';
import SendForm from './components/SendForm';
import { BrowserProvider } from 'ethers'; // Added BrowserProvider
import WithdrawList from './components/WithdrawList';
import KYCForm from './components/KYCForm';
import AdminDashboard from './components/AdminDashboard';
import UserBalance from './components/UserBalance';
import TransactionHistory from './components/TransactionHistory';
import LandingPage from './components/LandingPage';
import KYCHistory from './components/KYCHistory';
import DocumentationPage from './components/DocumentationPage';
import { Globe, ShieldCheck, User, LogOut, Sun, Moon } from 'lucide-react';
import { API_URL } from './apiConfig';

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [kycStatus, setKycStatus] = useState('not_found');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') !== 'light';
  });

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      return newMode;
    });
  };

  // Your admin wallet address (contract owner)
  const ADMIN_ADDRESS = "0xFAf7FC6B3CD3B317841b84F01Be8ceC9F1999815".toLowerCase();

  const handleConnect = (prov, sig, addr) => {
    setProvider(prov);
    setSigner(sig);
    setAccount(addr);
    setIsAdmin(addr.toLowerCase() === ADMIN_ADDRESS);
    fetchKycStatus(addr);
  };

  const fetchKycStatus = async (addr) => {
    try {
      const res = await fetch(`${API_URL}/api/kyc/status/${addr}`);
      const data = await res.json();
      if (data.status) setKycStatus(data.status);
      else setKycStatus('not_found');
    } catch (e) {
      console.error(e);
      setKycStatus('error');
    }
  };

  useEffect(() => {
    if (account) {
      const interval = setInterval(() => fetchKycStatus(account), 5000);
      return () => clearInterval(interval);
    }
  }, [account]);

  // Event Listeners for Account/Chain Changes (No Auto-Connect for Security)
  useEffect(() => {
    if (window.ethereum) {
      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          // Only reconnect if user is already connected
          if (account) {
            const reconnect = async () => {
              try {
                const provider = new BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                handleConnect(provider, signer, accounts[0]);
              } catch (e) {
                console.error("Reconnect failed", e);
              }
            };
            reconnect();
          }
        } else {
          // User disconnected from MetaMask
          setAccount(null);
          setSigner(null);
          setProvider(null);
        }
      });

      // Listen for chain changes
      window.ethereum.on('chainChanged', () => {
        // Reloading is recommended by MetaMask for chain changes to avoid state inconsistency
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, [account]);

  // Listen for history updates
  useEffect(() => {
    const handleUpdate = () => { /* Logic to trigger history refresh if moved to context, or rely on component mount */ };
    window.addEventListener('transactionUpdated', handleUpdate);
    return () => window.removeEventListener('transactionUpdated', handleUpdate);
  }, []);

  return (

    <div className={`min-h-screen font-sans selection:bg-blue-500/30 ${isDarkMode ? 'bg-[#0B1120] text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Show Documentation Page */}
      {showDocs ? (
        <DocumentationPage onBack={() => setShowDocs(false)} />
      ) : (
        <>
          {/* Header */}
          {account && (
            <header className={`${isDarkMode ? 'bg-[#0B1120]/80 border-slate-800' : 'bg-white/80 border-gray-200'} backdrop-blur-xl border-b sticky top-0 z-50 transition-colors duration-300`}>
              <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
                  <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                    CrossRemit Pro
                  </h1>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={toggleTheme}
                    className={`p-2 rounded-lg transition ${isDarkMode ? 'text-yellow-400 hover:bg-yellow-400/10' : 'text-slate-600 hover:bg-slate-100'}`}
                    title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                  >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                  </button>
                  <Faucet signer={signer} account={account} />
                  <WalletConnect onConnect={handleConnect} account={account} />
                  <button
                    onClick={() => {
                      setAccount(null);
                      setSigner(null);
                      setProvider(null);
                      setKycStatus('not_found');
                    }}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                    title="Disconnect & Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </div>
            </header>
          )}

          {/* Main Content */}
          <main className={!account ? "w-full" : "max-w-6xl mx-auto px-6 py-12"}>
            {!account ? (
              <LandingPage
                onConnect={() => document.getElementById('wallet-connect-btn')?.click()}
                onShowDocs={() => setShowDocs(true)}
              />
            ) : (
              <div className="grid grid-cols-1 gap-8">
                {/* Welcome Banner */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-8 shadow-xl flex justify-between items-center transition-all">
                  <div>
                    <h3 className="text-lg font-medium opacity-80 mb-1">Authenticated User</h3>
                    <p className="text-2xl font-bold font-mono">{account.slice(0, 6)}...{account.slice(-4)}</p>
                    <div className="mt-4 flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs uppercase font-bold tracking-wider ${kycStatus === 'verified' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                        kycStatus === 'pending' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                          'bg-red-500/20 text-red-300 border border-red-500/30'
                        }`}>
                        KYC: {kycStatus}
                      </span>
                    </div>
                  </div>
                  <User size={48} className="opacity-20" />
                </div>

                {/* Dashboard - Visible to all users */}
                <div className="border-t border-gray-200 pt-8">
                  <AdminDashboard signer={signer} isAdmin={isAdmin} isDarkMode={isDarkMode} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
                  <div className="space-y-6">
                    <KYCForm account={account} isDarkMode={isDarkMode} />

                    {/* Send Form */}
                    <div className={kycStatus === 'verified' ? '' : 'opacity-50 pointer-events-none filter blur-[1px]'}>
                      <SendForm signer={signer} account={account} isDarkMode={isDarkMode} />
                      {kycStatus !== 'verified' && (
                        <p className="text-center text-red-500 text-sm mt-2 font-medium">Complete KYC to unlock sending</p>
                      )}
                    </div>

                    {/* KYC History - Admin Only */}
                    {isAdmin && <KYCHistory isDarkMode={isDarkMode} />}
                  </div>

                  <div className="space-y-6">
                    {/* Activity Feed */}
                    <TransactionHistory account={account} isDarkMode={isDarkMode} />

                    {/* Incoming (On-Chain) */}
                    <WithdrawList signer={signer} account={account} isDarkMode={isDarkMode} />
                  </div>
                </div>
              </div>
            )}
          </main>

          {/* Hidden Connect Button trigger for Landing Page */}
          {!account && (
            <div className="hidden">
              <WalletConnect onConnect={handleConnect} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;


