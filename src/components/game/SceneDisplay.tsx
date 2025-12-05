"use client";

import React, { useState, useEffect } from 'react';
import { Scene } from '@/lib/game/types';
import { useRouter } from 'next/navigation';
import { irishGrover } from '@/lib/fonts';
import { DialogueBox } from '@/components/DialogueBox';
import { RetroButton } from '@/components/RetroButton';
import { ChatCompanion } from '@/components/ChatCompanion';

interface SceneDisplayProps {
    scene: Scene;
    chapterId: string;
    playerName?: string;
}

export const SceneDisplay: React.FC<SceneDisplayProps> = ({ scene, chapterId, playerName = 'DSI' }) => {
    const router = useRouter();
    const [dialogueIndex, setDialogueIndex] = useState(0);
    const [effectiveName, setEffectiveName] = useState(playerName);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [showCustomCursor, setShowCustomCursor] = useState(false);

    useEffect(() => {
        // If we have a valid name from URL (and it's not the default 'DSI' unless user really typed DSI), save it
        if (playerName !== 'DSI') {
            localStorage.setItem('playerName', playerName);
            setEffectiveName(playerName);
        } else {
            // If URL has no name (defaulted to DSI), try to recover from localStorage
            const stored = localStorage.getItem('playerName');
            if (stored) {
                setEffectiveName(stored);
            }
        }
    }, [playerName]);

    useEffect(() => {
        if (scene.id === 'corridor-choice') {
            setShowCustomCursor(true);
            const updateMouse = (e: MouseEvent) => {
                setMousePos({ x: e.clientX, y: e.clientY });
            };
            window.addEventListener('mousemove', updateMouse);
            return () => window.removeEventListener('mousemove', updateMouse);
        } else {
            setShowCustomCursor(false);
        }
    }, [scene.id]);

    const isLeft = mousePos.x < (typeof window !== 'undefined' ? window.innerWidth / 2 : 0);

    const handleSceneClick = () => {
        if (scene.id === 'corridor-choice') {
            if (isLeft) {
                handleChoice('chapitre1/door-closed');
            } else {
                handleChoice('chapitre1/dead-end');
            }
        } else if (!currentDialogue.choices && !currentDialogue.input) {
            handleNext();
        }
    };

    const currentDialogue = scene.dialogues[dialogueIndex];
    const isLastDialogue = dialogueIndex === scene.dialogues.length - 1;

    // Helper to replace variables in text
    const processText = (text: string) => {
        return text.replace(/<name>/g, effectiveName).replace(/{name}/g, effectiveName);
    };

    const processedText = processText(currentDialogue.text);
    const isQuestion = !!currentDialogue.choices && currentDialogue.choices.length > 0;

    const handleNext = () => {
        if (!isLastDialogue) {
            setDialogueIndex(prev => prev + 1);
        } else if (currentDialogue.choices) {
            // Do nothing, wait for choice
        } else if (scene.nextScene) {
            const target = scene.nextScene.includes('/')
                ? scene.nextScene
                : `${chapterId}/${scene.nextScene}`;
            router.push(`/${target}?name=${encodeURIComponent(effectiveName)}`);
        } else {
            console.log("End of demo or missing nextScene");
        }
    };

    const handleChoice = (targetScene: string) => {
        const target = targetScene.includes('/')
            ? targetScene
            : `${chapterId}/${targetScene}`;
        router.push(`/${target}?name=${encodeURIComponent(effectiveName)}`);
    };

    // Handle Spacebar
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' && !currentDialogue.choices) {
                e.preventDefault(); // Prevent scrolling
                handleNext();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentDialogue, isLastDialogue, scene.nextScene]);

    return (
        <div
            className={`relative w-full h-screen bg-black text-white overflow-hidden ${irishGrover.className} cursor-pointer ${showCustomCursor ? 'no-cursor' : ''}`}
            onClick={handleSceneClick}
        >
            {/* Custom Cursor Element */}
            {showCustomCursor && (
                <div
                    className="fixed pointer-events-none z-[100] transition-transform duration-100 ease-out"
                    style={{
                        left: mousePos.x,
                        top: mousePos.y,
                        transform: `translate(-50%, -50%) ${isLeft ? 'rotate(0deg)' : 'scaleX(-1)'}`
                    }}
                >
                    <img
                        src="/images/background/feche.webp"
                        alt="Cursor"
                        className="w-16 h-16 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                    />
                </div>
            )}
            {/* Background Layer */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-500"
                style={{
                    backgroundImage: `url(${scene.background})`,
                    filter: 'brightness(0.5)'
                }}
            />

            {/* Chat Companion (Optional) */}
            {scene.showChatCompanion && (
                <ChatCompanion
                    text={isQuestion ? processedText : ''}
                    mood={currentDialogue.emotion as any || 'basic'}
                />
            )}

            {/* Dialogue Box (Optional but default true usually) */}
            {(scene.showDialogueBox !== false) && (
                <div className="absolute bottom-0 left-0 w-full z-40">

                    {currentDialogue.choices && scene.id !== 'corridor-choice' && (
                        <div className="absolute bottom-10 left-0 w-full flex flex-row justify-center gap-4 z-50 pointer-events-auto flex-wrap px-4">
                            {currentDialogue.choices.map((choice, idx) => (
                                <RetroButton
                                    key={idx}
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent main div click
                                        handleChoice(choice.targetScene);
                                    }}
                                >
                                    {choice.text}
                                </RetroButton>
                            ))}
                        </div>
                    )}

                    {!isQuestion && (
                        <DialogueBox
                            text={processedText}
                            characterName={currentDialogue.speaker}
                            avatarSrc={currentDialogue.speaker === 'Chatrlatant' ? '/images/personnages/chat/cat_basic.png' : '/images/ui/avatar_placeholder.png'}
                            audioSrc="/audio/text_scroll.mp3"
                            onComplete={undefined} // Let parent handle clicks
                            speed={40}
                        />
                    )}
                </div>
            )}
        </div>
    );
};
