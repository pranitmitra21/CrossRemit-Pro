import React from 'react';
import { ArrowLeft, Book, Zap, Shield, Globe, Terminal, Code, CheckCircle } from 'lucide-react';

const DocumentationPage = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            {/* Header */}
            <header className="bg-black/30 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onBack}
                            className="p-2 hover:bg-gray-700 rounded-lg transition"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
                        <h1 className="text-xl font-bold">CrossRemit Pro Documentation</h1>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-6xl mx-auto px-6 py-12">
                {/* Hero Section */}
                <div className="mb-12 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full mb-4">
                        <Zap className="text-blue-400" size={16} />
                        <span className="text-sm text-blue-300">Developer Documentation</span>
                    </div>
                    <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Blockchain-Powered Cross-Border Remittance
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Complete guide to setting up, configuring, and deploying CrossRemit Pro
                    </p>
                </div>

                {/* Quick Start */}
                <section className="mb-12 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Zap className="text-blue-400" size={24} />
                        Quick Start
                    </h3>
                    <p className="text-gray-300 mb-4">One-click launch for Windows:</p>
                    <div className="bg-black/40 rounded-lg p-4 font-mono text-sm">
                        <p className="text-green-400"># Simply double-click:</p>
                        <p className="text-white">start_all.bat</p>
                    </div>
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                        {['Hardhat Node', 'Smart Contracts', 'Backend API', 'Frontend'].map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                                <CheckCircle className="text-green-400" size={16} />
                                {item}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Installation */}
                <section className="mb-12">
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Terminal className="text-purple-400" size={24} />
                        Installation & Setup
                    </h3>

                    <div className="space-y-6">
                        {/* Prerequisites */}
                        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                            <h4 className="text-lg font-semibold mb-4 text-blue-300">Prerequisites</h4>
                            <div className="grid md:grid-cols-3 gap-4">
                                {[
                                    { name: 'Node.js', version: 'v18+' },
                                    { name: 'MetaMask', version: 'Latest' },
                                    { name: 'Git', version: 'Latest' }
                                ].map((item, i) => (
                                    <div key={i} className="bg-gray-900/50 rounded-lg p-4">
                                        <p className="font-semibold text-white">{item.name}</p>
                                        <p className="text-sm text-gray-400">{item.version}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Manual Setup Steps */}
                        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                            <h4 className="text-lg font-semibold mb-4 text-blue-300">Manual Setup</h4>
                            <div className="space-y-4">
                                {[
                                    { step: '1', title: 'Install Dependencies', cmd: 'npm install' },
                                    { step: '2', title: 'Start Hardhat Node', cmd: 'npx hardhat node' },
                                    { step: '3', title: 'Deploy Contracts', cmd: 'npx hardhat run Scripts/deploy-local.js --network localhost' },
                                    { step: '4', title: 'Start Backend', cmd: 'cd backend && node server.js' },
                                    { step: '5', title: 'Start Frontend', cmd: 'cd frontend && npm run dev' }
                                ].map((item) => (
                                    <div key={item.step} className="flex gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center font-bold text-sm">
                                            {item.step}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-white mb-1">{item.title}</p>
                                            <code className="text-sm text-gray-300 bg-black/40 px-3 py-1 rounded">{item.cmd}</code>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* API Reference */}
                <section className="mb-12">
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Code className="text-green-400" size={24} />
                        API Reference
                    </h3>
                    <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-900/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Method</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Endpoint</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Description</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {[
                                        { method: 'POST', endpoint: '/api/kyc/submit', desc: 'Submit KYC details' },
                                        { method: 'GET', endpoint: '/api/kyc/status/:addr', desc: 'Check KYC status' },
                                        { method: 'GET', endpoint: '/api/admin/pending', desc: 'List pending KYC' },
                                        { method: 'POST', endpoint: '/api/admin/update-status', desc: 'Approve/Reject KYC' },
                                        { method: 'GET', endpoint: '/api/rates', desc: 'Get FX rates' },
                                        { method: 'POST', endpoint: '/api/faucet/eth', desc: 'Request test ETH' }
                                    ].map((api, i) => (
                                        <tr key={i} className="hover:bg-gray-700/30 transition">
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${api.method === 'GET' ? 'bg-blue-500/20 text-blue-300' : 'bg-green-500/20 text-green-300'
                                                    }`}>
                                                    {api.method}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-sm text-gray-300">{api.endpoint}</td>
                                            <td className="px-6 py-4 text-sm text-gray-400">{api.desc}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* Key Features */}
                <section className="mb-12">
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Shield className="text-yellow-400" size={24} />
                        Key Features
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        {[
                            { icon: Shield, title: 'KYC Verification', desc: 'Bank-grade identity verification' },
                            { icon: Zap, title: 'Instant Settlement', desc: 'Blockchain-powered instant transfers' },
                            { icon: Globe, title: 'Multi-Currency', desc: 'USD, EUR, GBP, INR, NGN support' },
                            { icon: Code, title: 'Smart Contracts', desc: 'Secure, auditable transactions' }
                        ].map((feature, i) => (
                            <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-blue-500/50 transition">
                                <feature.icon className="text-blue-400 mb-3" size={32} />
                                <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
                                <p className="text-gray-400 text-sm">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Troubleshooting */}
                <section className="mb-12">
                    <h3 className="text-2xl font-bold mb-6">🐛 Troubleshooting</h3>
                    <div className="space-y-4">
                        {[
                            {
                                issue: 'User not KYC verified',
                                solution: 'Go to Admin Dashboard and approve the user. Watch for [Sync] Success in backend terminal.'
                            },
                            {
                                issue: 'White screen on frontend',
                                solution: 'Ensure Hardhat node is running and contracts are deployed. Check frontend/src/config.json exists.'
                            },
                            {
                                issue: 'MetaMask "Nonce too high"',
                                solution: 'Open MetaMask → Settings → Advanced → Clear Activity Tab Data'
                            }
                        ].map((item, i) => (
                            <div key={i} className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                                <h4 className="text-lg font-semibold text-red-300 mb-2">❌ {item.issue}</h4>
                                <p className="text-gray-300">✅ <strong>Solution:</strong> {item.solution}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Footer */}
                <div className="text-center pt-8 border-t border-gray-700">
                    <p className="text-gray-400">Built with ❤️ using Blockchain Technology</p>
                    <p className="text-sm text-gray-500 mt-2">Powered by CrossRemit API</p>
                </div>
            </main>
        </div>
    );
};

export default DocumentationPage;
