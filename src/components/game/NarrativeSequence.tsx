"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useVolume } from '@/lib/audio/VolumeContext';

interface NarrativeSequenceProps {
    onComplete: () => void;
}

export const NarrativeSequence: React.FC<NarrativeSequenceProps> = ({ onComplete }) => {
    const { volume } = useVolume();
    const [showSkip, setShowSkip] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const fadeOutAndComplete = (duration = 2000) => {
        const audio = audioRef.current;
        if (!audio) {
            onComplete();
            return;
        }

        const startVolume = audio.volume;
        const steps = 20;
        const stepTime = duration / steps;
        const volStep = startVolume / steps;

        const fadeInterval = setInterval(() => {
            if (audio.volume > volStep) {
                audio.volume -= volStep;
            } else {
                audio.volume = 0;
                audio.pause();
                clearInterval(fadeInterval);
                onComplete();
            }
        }, stepTime);
    };

    useEffect(() => {
        // Audio setup
        const audio = new Audio('/audio/intro/starwars.mp3');
        audio.volume = volume * 0.5;
        audioRef.current = audio;
        
        const playAudio = async () => {
            try {
                await audio.play();
            } catch (e) {
                console.warn("Audio autoplay blocked", e);
            }
        };
        playAudio();

        const timer = setTimeout(() => setShowSkip(true), 3000);
        
        // Start fading out before the end of the animation (which is 40s)
        // Let's start fading at 38s and finish at 43s
        const fadeTimer = setTimeout(() => {
            if (audioRef.current) {
                const audio = audioRef.current;
                const fadeInterval = setInterval(() => {
                    if (audio.volume > 0.01) {
                        audio.volume -= 0.01;
                    } else {
                        clearInterval(fadeInterval);
                    }
                }, 100); // Slow fade over ~5s
            }
        }, 38000);

        const endTimer = setTimeout(() => {
            onComplete();
        }, 45000); // Auto skip after 45s

        return () => {
            clearTimeout(timer);
            clearTimeout(fadeTimer);
            clearTimeout(endTimer);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [onComplete]); // Removed volume from dependency to avoid restarting audio

    // Update volume if it changes
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume * 0.5;
        }
    }, [volume]);

    const handleSkip = () => {
        fadeOutAndComplete(500); // Fast fade out on skip
    };

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

            <div className="absolute bottom-4 left-0 right-0 text-center text-white/30 text-xs font-sans z-40 pointer-events-none px-4">
                * Musique interprétée à la flûte car nous n'avions pas les droits Lucasfilm et nous ne voulions pas donner d'argent. Version maison.
            </div>

            {showSkip && (
                <button
                    onClick={handleSkip}
                    className="absolute bottom-8 right-8 text-white/50 hover:text-white text-sm z-50 font-sans"
                >
                    [PASSER L'INTRO]
                </button>
            )}
        </div>
    );
};
