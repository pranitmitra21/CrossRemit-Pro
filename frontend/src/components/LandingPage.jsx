import React from 'react';
import { motion } from 'framer-motion';
import { Globe, ArrowRight, ShieldCheck, Zap, Wallet } from 'lucide-react';

const LandingPage = ({ onConnect, onShowDocs }) => {
    return (
        <div className="h-screen w-screen bg-[#0a0a0a] text-white font-sans overflow-hidden relative flex flex-col">
            {/* Background Gradients */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[120px] opacity-20 animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600 rounded-full blur-[120px] opacity-20 animate-pulse"></div>
            </div>

            {/* Navigation */}
            <nav className="relative z-10 max-w-7xl mx-auto w-full px-6 h-16 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain" />
                    <span className="text-xl font-bold tracking-tight">CrossRemit Pro</span>
                </div>
                <button
                    onClick={onShowDocs}
                    className="text-gray-400 hover:text-white transition text-sm font-medium"
                >
                    Documentation
                </button>
            </nav>

            {/* Main Content - Centered */}
            <main className="relative z-10 flex-1 flex items-center justify-center px-6 w-full">
                <div className="max-w-7xl w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-12"
                    >
                        <span className="px-4 py-1.5 rounded-full border border-gray-800 bg-gray-900/50 backdrop-blur-md text-sm text-gray-400 mb-6 inline-block">
                            ✨ The Future of Global Payments
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500 max-w-4xl mx-auto">
                            Borderless Payments for the Modern Enterprise
                        </h1>
                        <p className="text-base text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
                            Send money globally with instant settlement, real-time exchange rates, and bank-grade compliance.
                            Powered by blockchain, designed for humans.
                        </p>

                        <div className="flex justify-center mb-10">
                            <button
                                onClick={onConnect}
                                className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition flex items-center gap-2 group"
                            >
                                <Wallet size={20} />
                                Connect Wallet
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </motion.div>

                    {/* Feature Grid - Compact */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-5xl mx-auto">
                        {[
                            { icon: Zap, title: "Instant Settlement", desc: "Funds arrive in seconds, not days." },
                            { icon: ShieldCheck, title: "Bank-Grade KYC", desc: "Integrated compliance checks." },
                            { icon: Globe, title: "Multi-Currency", desc: "USD, EUR, GBP, INR, NGN support." }
                        ].map((f, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                viewport={{ once: true }}
                                className="p-5 rounded-xl bg-gray-900/40 border border-gray-800 hover:bg-gray-900/60 transition backdrop-blur-sm text-left"
                            >
                                <div className="bg-gray-800 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                                    <f.icon className="text-blue-400" size={20} />
                                </div>
                                <h3 className="text-lg font-semibold mb-1">{f.title}</h3>
                                <p className="text-gray-400 text-sm">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LandingPage;
