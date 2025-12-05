"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Volume2, VolumeX, Headphones } from 'lucide-react';
import { useVolume } from '@/lib/audio/VolumeContext';
import { irishGrover } from '@/lib/fonts';

interface MainMenuProps {
    onStart: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onStart }) => {
    const { volume, setVolume } = useVolume();
    const [showAudioSetup, setShowAudioSetup] = useState(true);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Play test sound when volume changes (debounced)
    useEffect(() => {
        if (!showAudioSetup) return;
        
        const timer = setTimeout(() => {
            if (audioRef.current) {
                audioRef.current.volume = volume;
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(() => {});
            } else {
                const audio = new Audio('/audio/cat/cat1.mp3');
                audio.volume = volume;
                audioRef.current = audio;
                audio.play().catch(() => {});
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [volume, showAudioSetup]);

    const handleStartGame = () => {
        setShowAudioSetup(false);
        // Stop test audio
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
    };

    if (showAudioSetup) {
        return (
            <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/95 text-white ${irishGrover.className}`}>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl w-full p-8 bg-slate-900 border-4 border-white rounded-lg text-center space-y-8 shadow-[0_0_50px_rgba(255,255,255,0.1)]"
                >
                    <div className="space-y-4">
                        <Headphones className="w-20 h-20 mx-auto text-blue-400 animate-pulse" />
                        <h2 className="text-4xl md:text-5xl text-blue-400">Expérience Audio & Visuelle</h2>
                        <p className="text-xl md:text-2xl font-sans text-gray-300 leading-relaxed px-8">
                            Cette aventure est conçue pour être vécue avec du son.<br/>
                            Pour une immersion totale, l'utilisation d'un casque est recommandée.
                        </p>
                    </div>

                    <div className="space-y-6 py-8 border-t border-b border-white/20">
                        <div className="flex items-center justify-center gap-4">
                            {volume === 0 ? <VolumeX className="w-8 h-8" /> : <Volume2 className="w-8 h-8" />}
                            <span className="text-3xl w-20">{Math.round(volume * 100)}%</span>
                        </div>
                        
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className="w-full max-w-md h-4 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
                        />
                        <p className="text-sm text-gray-500 font-sans italic">
                            Ajustez le volume jusqu'à entendre le son confortablement
                        </p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleStartGame}
                        className="px-8 py-4 bg-white text-black text-2xl md:text-3xl rounded hover:bg-blue-400 transition-colors font-bold"
                    >
                        C'est parti !
                    </motion.button>
                </motion.div>
            </div>
        );
    }

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
