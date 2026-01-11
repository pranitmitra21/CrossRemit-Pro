import React, { useState } from 'react';
import { Contract } from 'ethers';
import { Coins, ExternalLink } from 'lucide-react';
import config from '../config.json';

const Faucet = ({ account }) => {
    const openSepoliaMine = () => {
        window.open("https://sepolia-faucet.pk910.de/", "_blank");
    };

    const openSepoliaFaucet = () => {
        window.open("https://cloud.google.com/application/web3/faucet/ethereum/sepolia", "_blank");
    };

    return (
        <div className="flex gap-2">
            <button
                onClick={openSepoliaMine}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                title="Mine Sepolia ETH"
            >
                <Coins size={20} />
                Mine Sepolia ETH
            </button>
            <button
                onClick={openSepoliaFaucet}
                className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-bold"
                title="Get ETH for Gas Fees"
            >
                ⛽ Get Gas <ExternalLink size={16} />
            </button>
        </div>
    );
};

export default Faucet;
