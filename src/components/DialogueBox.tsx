"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useVolume } from '@/lib/audio/VolumeContext';

interface DialogueBoxProps {
    text: string;
    audioSrc: string;
    characterName: string;
    avatarSrc: string;
    speed?: number; // ms par caractère
    audioLoop?: boolean;
    stopAudioOnTextComplete?: boolean;
    onComplete?: () => void;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({
    text,
    audioSrc,
    characterName,
    avatarSrc,
    speed = 40,
    audioLoop = false,
    stopAudioOnTextComplete = false,
    onComplete,
}) => {
    const { volume } = useVolume();
    const [displayedText, setDisplayedText] = useState('');
    const [isFinished, setIsFinished] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const indexRef = useRef(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Refs for measuring text overflow
    const hiddenTextRef = useRef<HTMLParagraphElement>(null);
    const currentDisplayedTextRef = useRef('');

    // 1. Initialisation de l'Audio
    useEffect(() => {
        // Vérification SSR
        if (typeof window === 'undefined') return;

        const audio = new Audio(audioSrc);
        audio.volume = volume;
        audio.loop = audioLoop;
        audioRef.current = audio;

        // Tentative de lecture immédiate
        const playAudio = async () => {
            try {
                await audio.play();
            } catch (error) {
                console.warn("Autoplay bloqué:", error);
            }
        };
        playAudio();

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
                audioRef.current = null;
            }
        };
    }, [audioSrc, audioLoop]);

    // Update volume if it changes
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    // 2. Logique Typewriter
    // Reset state when text changes
    useEffect(() => {
        setDisplayedText('');
        currentDisplayedTextRef.current = '';
        indexRef.current = 0;
        setIsFinished(false);

        if (intervalRef.current) clearInterval(intervalRef.current);
    }, [text]);

    // Typewriter interval
    useEffect(() => {
        if (isFinished) return;

        intervalRef.current = setInterval(() => {
            if (indexRef.current < text.length) {
                const char = text.charAt(indexRef.current);

                // Check for word overflow at the start of a word
                const isStartOfWord = indexRef.current === 0 || (text.charAt(indexRef.current - 1) === ' ' && char !== ' ');

                if (isStartOfWord && hiddenTextRef.current) {
                    // Look ahead to find the full word
                    let endOfWord = indexRef.current;
                    while (endOfWord < text.length && text.charAt(endOfWord) !== ' ') {
                        endOfWord++;
                    }
                    const word = text.substring(indexRef.current, endOfWord);

                    // Check if adding this word would overflow
                    hiddenTextRef.current.innerText = currentDisplayedTextRef.current + word;
                    if (hiddenTextRef.current.scrollHeight > hiddenTextRef.current.clientHeight) {
                        // Overflow detected! Clear screen immediately to start fresh page
                        setDisplayedText('');
                        currentDisplayedTextRef.current = '';
                    }
                }

                const nextText = currentDisplayedTextRef.current + char;
                currentDisplayedTextRef.current = nextText;
                setDisplayedText(nextText);
                indexRef.current++;
            } else {
                if (intervalRef.current) clearInterval(intervalRef.current);
                setIsFinished(true);

                if (stopAudioOnTextComplete && audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.currentTime = 0;
                }
            }
        }, speed);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [text, speed, stopAudioOnTextComplete, isFinished]);

    const handleNextClick = () => {
        if (isFinished && onComplete) {
            onComplete();
        }
    };

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-10 md:right-10 z-40">

            <div className="flex flex-row items-stretch bg-slate-900 border-4 border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] min-h-40 md:min-h-48 max-h-[45vh]">

                {/* Avatar */}
                <div className="flex-shrink-0 w-28 sm:w-32 md:w-48 border-r-4 border-white bg-blue-900 relative overflow-hidden">
                    <img
                        src={avatarSrc}
                        alt={characterName}
                        className="w-full h-full object-cover"
                        style={{ imageRendering: 'pixelated' }}
                    />
                </div>

                {/* Text Area */}
                <div className="flex-grow p-4 md:p-6 relative flex flex-col">

                    <div className="absolute -top-9 left-0 bg-white text-black px-4 py-1 text-lg md:text-xl font-bold uppercase tracking-widest border-4 border-white border-b-0 font-pixel">
                        {characterName}
                    </div>

                    <div className="flex-1 overflow-hidden relative">
                        {/* Hidden measurement div */}
                        <div className="absolute top-0 left-0 w-full h-full pointer-events-none invisible pr-6" aria-hidden="true">
                            <p
                                ref={hiddenTextRef}
                                className="text-lg sm:text-xl md:text-3xl leading-relaxed whitespace-pre-wrap font-pixel"
                                style={{ maxHeight: '3.3em', overflow: 'hidden' }}
                            >
                            </p>
                        </div>

                        <div className="h-full overflow-hidden flex items-start pr-6">
                            <p
                                className="text-lg sm:text-xl md:text-3xl text-white leading-relaxed whitespace-pre-wrap font-pixel drop-shadow-md"
                                style={{ maxHeight: '3.3em', overflow: 'hidden' }}
                            >
                                {displayedText}
                                {!isFinished && <span className="inline-block w-3 h-6 bg-white ml-1 animate-pulse align-middle" />}
                            </p>
                        </div>
                    </div>

                    {isFinished && (
                        <div
                            onClick={handleNextClick}
                            className="absolute bottom-4 right-4 animate-bounce cursor-pointer hover:scale-110 transition-transform"
                        >
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-8 h-8 text-red-500"
                            >
                                <path d="M12 21L21 9H3L12 21Z" fill="currentColor" />
                            </svg>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};