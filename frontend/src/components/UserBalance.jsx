import React, { useState, useEffect } from 'react';
import { formatEther } from 'ethers';
import { Wallet, RefreshCcw } from 'lucide-react';

const UserBalance = ({ account }) => {
    const [userBalance, setUserBalance] = useState("0.0");
    const [ethPrice] = useState(2500); // SETH price in USD

    const fetchBalance = async () => {
        try {
            if (!window.ethereum || !account) {
                console.log("No MetaMask or account");
                return;
            }

            // Direct balance fetch from MetaMask
            const balanceHex = await window.ethereum.request({
                method: 'eth_getBalance',
                params: [account, 'latest']
            });

            const balanceInEth = formatEther(balanceHex);
            console.log(`✅ Balance for ${account}: ${balanceInEth} SETH`);
            setUserBalance(balanceInEth);

        } catch (error) {
            console.error("Balance fetch failed:", error);
        }
    };

    useEffect(() => {
        fetchBalance();
        const interval = setInterval(fetchBalance, 10000);
        return () => clearInterval(interval);
    }, [account]);

    return (
        <div className="bg-[#151E32] p-6 rounded-xl border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <Wallet className="text-blue-500" size={20} />
                        <p className="text-slate-400 text-sm font-medium">Your Balance</p>
                        <RefreshCcw
                            size={14}
                            className="text-slate-500 cursor-pointer hover:text-blue-400 transition hover:rotate-180 duration-300"
                            onClick={fetchBalance}
                            title="Refresh Balance"
                        />
                    </div>
                    <p className="text-3xl font-bold text-white">{parseFloat(userBalance).toFixed(4)} SETH</p>
                    <p className="text-sm text-green-400 font-medium mt-1">
                        ≈ ${(parseFloat(userBalance) * ethPrice).toLocaleString()} USD
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserBalance;
