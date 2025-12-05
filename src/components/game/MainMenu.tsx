"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

interface MainMenuProps {
    onStart: () => void;
}

import { irishGrover } from '@/lib/fonts';

export const MainMenu: React.FC<MainMenuProps> = ({ onStart }) => {
    return (
        <div className={`flex flex-col items-center justify-center min-h-screen bg-black text-white ${irishGrover.className} relative overflow-hidden`}>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5 }}
                className="text-center space-y-16 z-10"
            >
                <h1 className="text-8xl md:text-9xl tracking-tighter" style={{ textShadow: '0 0 10px rgba(255,255,255,0.5)' }}>
                    MiamUniversity
                </h1>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onStart}
                    className="text-4xl md:text-5xl flex items-center gap-4 mx-auto hover:text-gray-300 transition-colors"
                >
                    <span>&gt;</span> Commencer
                </motion.button>
            </motion.div>

            {/* Footer */}
            <div className="absolute bottom-8 text-sm text-gray-500 font-sans">
                Developped by team 404 Sleep Not Found
            </div>
        </div>
    );
};
