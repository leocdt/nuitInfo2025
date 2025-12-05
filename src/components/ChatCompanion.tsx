"use client";

import React, { useState, useEffect, useRef } from 'react';

export type CatMood = 'basic' | 'error' | 'sad' | 'tired';

interface ChatCompanionProps {
    text: string;
    mood?: CatMood;
    onComplete?: () => void;
    speed?: number; // ms par caractère
}

const CAT_SOUNDS = [
    '/audio/cat/cat1.mp3',
    '/audio/cat/cat2.mp3',
    '/audio/cat/cat3.mp3',
    '/audio/cat/cat4.mp3'
];

const MOOD_IMAGES: Record<CatMood, string> = {
    basic: '/images/personnages/chat/cat_basic.png',
    error: '/images/personnages/chat/cat_error.png',
    sad: '/images/personnages/chat/cat_sad.png',
    tired: '/images/personnages/chat/cat_tired.png',
};

export const ChatCompanion: React.FC<ChatCompanionProps> = ({
    text,
    mood = 'basic',
    onComplete,
    speed = 70,
}) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isFinished, setIsFinished] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const indexRef = useRef(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Refs for measuring text overflow
    const hiddenTextRef = useRef<HTMLParagraphElement>(null);
    const currentDisplayedTextRef = useRef('');
    const isFinishedRef = useRef(false);

    // Random flip on text change
    useEffect(() => {
        setIsFlipped(Math.random() < 0.5);
    }, [text]);

    // Sync ref with state
    useEffect(() => {
        isFinishedRef.current = isFinished;
        if (isFinished && audioRef.current) {
            const audio = audioRef.current;
            // Fade out audio
            const fadeInterval = setInterval(() => {
                if (audio.volume > 0.05) {
                    audio.volume = Math.max(0, audio.volume - 0.1);
                } else {
                    audio.volume = 0;
                    audio.pause();
                    audio.currentTime = 0;
                    clearInterval(fadeInterval);
                }
            }, 100);
        }
    }, [isFinished]);

    // 1. Audio Logic - Random pick on mount/text change
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const playRandomSound = () => {
            if (isFinishedRef.current) return;

            const randomSound = CAT_SOUNDS[Math.floor(Math.random() * CAT_SOUNDS.length)];
            const audio = new Audio(randomSound);
            audio.volume = 0.6;
            audioRef.current = audio;

            audio.addEventListener('ended', () => {
                if (!isFinishedRef.current) {
                    playRandomSound();
                }
            });

            audio.play().catch(error => {
                console.warn("Chat audio autoplay blocked:", error);
            });
        };

        if (text.length > 0) {
            // Stop previous audio if any
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
            playRandomSound();
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
                audioRef.current = null;
            }
        };
    }, [text]); // Re-run when text changes (new dialogue line)

    // 2. Typewriter Logic (Adapted from DialogueBox)
    useEffect(() => {
        setDisplayedText('');
        currentDisplayedTextRef.current = '';
        indexRef.current = 0;
        setIsFinished(false);

        if (intervalRef.current) clearInterval(intervalRef.current);
    }, [text]);

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
                if (onComplete) onComplete();
            }
        }, speed);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [text, speed, isFinished, onComplete]);

    return (
        <div className="fixed top-4 right-4 md:right-10 z-50 flex flex-col items-end max-w-[480px] md:max-w-[700px]">

            {/* Bubble */}
            {text && (
                <div className="bg-white border-4 border-black p-4 mb-4 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-pixel text-black w-full z-20">
                    {/* Hidden measurement div */}
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none invisible p-4" aria-hidden="true">
                        <p
                            ref={hiddenTextRef}
                            className="text-sm md:text-xl leading-relaxed whitespace-pre-wrap font-pixel"
                            style={{ maxHeight: '4.5em', overflow: 'hidden' }} // ~3 lines max for smaller bubble
                        >
                        </p>
                    </div>

                    <div className="relative z-10 min-h-[3em]">
                        <p
                            className="text-sm md:text-xl leading-relaxed whitespace-pre-wrap font-pixel"
                            style={{ maxHeight: '4.5em', overflow: 'hidden' }}
                        >
                            {displayedText}
                            {!isFinished && <span className="inline-block w-2 h-4 bg-black ml-1 animate-pulse align-middle" />}
                        </p>
                    </div>

                    {/* Triangle pointer for bubble */}
                    <div className="absolute -bottom-4 right-36 md:right-60 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[16px] border-t-black"></div>
                    <div className="absolute -bottom-[10px] right-36 md:right-60 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[12px] border-t-white"></div>
                </div>
            )}

            {/* Cat Image */}
            <div className={`w-64 h-64 md:w-96 md:h-96 relative mr-4 md:mr-12 -mt-16 md:-mt-24 z-10 ${!isFinished ? 'animate-talk' : ''}`}>
                <img
                    src={MOOD_IMAGES[mood]}
                    alt={`Chat ${mood}`}
                    className={`w-full h-full object-contain drop-shadow-[4px_4px_0px_rgba(0,0,0,0.5)] ${isFlipped ? 'scale-x-[-1]' : ''}`}
                    style={{ imageRendering: 'pixelated' }}
                />
            </div>
        </div>
    );
};
