"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { irishGrover } from '@/lib/fonts';

interface CharacterCreationProps {
    onConfirm: (name: string) => void;
}

export const CharacterCreation: React.FC<CharacterCreationProps> = ({ onConfirm }) => {
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onConfirm(name.trim());
        }
    };

    return (
        <div className={`min-h-screen bg-black flex flex-col items-center justify-center p-4 ${irishGrover.className} text-white`}>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="w-full max-w-2xl text-center space-y-12"
            >
                <h2 className="text-5xl md:text-6xl tracking-wide">
                    Quel est le nom de ce formidable DSI ?
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col items-center gap-8">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full max-w-md h-16 bg-[#505050] text-white text-center text-3xl focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                        autoFocus
                    />

                    <button
                        type="submit"
                        className={`text-2xl transition-opacity duration-500 ${name.trim() ? 'opacity-100' : 'opacity-0'}`}
                    >
                        [CONFIRMER]
                    </button>
                </form>
            </motion.div>
        </div>
    );
};
