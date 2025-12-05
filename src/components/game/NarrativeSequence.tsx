"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface NarrativeSequenceProps {
    onComplete: () => void;
}

export const NarrativeSequence: React.FC<NarrativeSequenceProps> = ({ onComplete }) => {
    const [showSkip, setShowSkip] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowSkip(true), 3000);
        const endTimer = setTimeout(onComplete, 45000); // Auto skip after 45s
        return () => {
            clearTimeout(timer);
            clearTimeout(endTimer);
        };
    }, [onComplete]);

    return (
        <div className="fixed inset-0 bg-black overflow-hidden flex justify-center perspective-container font-sans">
            <style jsx global>{`
        .perspective-container {
          perspective: 400px;
        }
        .crawl-container {
          position: relative;
          top: 90%;
          transform-origin: 50% 100%;
          animation: crawl 40s linear forwards;
        }
        @keyframes crawl {
          0% {
            top: 100%;
            transform: rotateX(20deg) translateZ(0);
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            top: -200%;
            transform: rotateX(25deg) translateZ(-1000px);
            opacity: 0;
          }
        }
      `}</style>

            <div className="crawl-container w-full max-w-6xl text-center text-[#feda4a] font-bold text-7xl leading-relaxed tracking-wider space-y-12">
                <div className="space-y-12">
                    <p>Bienvenue à vous visiteur</p>
                    <p>
                        Dans ce monde futuriste où toutes les universites de france sont
                        tombées sous le coup de GAFAM et ne sont plus souveraines de
                        leurs technologies et données.
                    </p>
                    <p>
                        une université résiste et n’est pas encore totalement corrompue...
                    </p>
                </div>
            </div>

            {showSkip && (
                <button
                    onClick={onComplete}
                    className="absolute bottom-8 right-8 text-white/50 hover:text-white text-sm z-50 font-sans"
                >
                    [PASSER L'INTRO]
                </button>
            )}
        </div>
    );
};
