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
    const [robotClickCount, setRobotClickCount] = useState(0);
    const [tempRobotText, setTempRobotText] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [showInputError, setShowInputError] = useState(false);

    // Reset input when dialogue changes
    useEffect(() => {
        setInputValue('');
        setShowInputError(false);
    }, [dialogueIndex, scene]);

    // Reset robot clicks when scene changes
    useEffect(() => {
        setRobotClickCount(0);
        setTempRobotText(null);
    }, [scene.id]);

    const handleRobotClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (scene.id === 'door-puzzle') {
            const facts = [
                "Le saviez-vous ? Le premier bug était un vrai insecte.",
                "J'ai faim. Ah non, je suis un robot.",
                "Il fait sombre ici, non ?",
                "Tu as essayé '123456' ? Non je plaisante."
            ];

            if (robotClickCount < 2) {
                setTempRobotText(facts[Math.floor(Math.random() * facts.length)]);
            } else {
                setTempRobotText("Indice : La porte a un code hexa dessus... Traduis-le !");
            }
            setRobotClickCount(prev => prev + 1);
        }
    };

    const handleDoorHitboxClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        handleNext(); // Move to door-knock-fail
    };

    const handleInputSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentDialogue.input) return;

        if (inputValue.trim().toLowerCase() === currentDialogue.input.correctValue.toLowerCase()) {
            handleChoice(currentDialogue.input.successScene);
        } else {
            setShowInputError(true);
            setTimeout(() => setShowInputError(false), 2000);
        }
    };

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
        if (scene.id === 'corridor-choice' || scene.id === 'dead-end' || scene.id === 'door-closed') {
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
                        transform: scene.id === 'corridor-choice'
                            ? `translate(-50%, -50%) ${isLeft ? 'rotate(0deg)' : 'scaleX(-1)'}`
                            : `translate(-50%, -50%)`
                    }}
                >
                    <img
                        src={
                            scene.id === 'corridor-choice' ? "/images/background/feche.webp" :
                                scene.id === 'dead-end' ? "/images/background/back_arrow.png" :
                                    "/images/background/hand.png"
                        }
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

            {/* Door Hitbox for door-closed */}
            {scene.id === 'door-closed' && (
                <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[100px] h-[600px] z-30 hover:opacity-50 transition-opacity cursor-none"
                    style={{ cursor: "none" }}
                    onClick={handleDoorHitboxClick}
                >
                </div>
            )}

            {/* Chat Companion (Optional) */}
            {scene.showChatCompanion && (
                <div onClick={handleRobotClick} className="cursor-pointer pointer-events-auto relative z-40">
                    <ChatCompanion
                        text={tempRobotText || (isQuestion ? processedText : (scene.id === 'door-puzzle' ? '' : (currentDialogue.speaker === 'Chatrlatant' ? processedText : '')))}
                        mood={currentDialogue.emotion as any || 'basic'}
                    />
                </div>
            )}

            {/* Dialogue Box (Optional but default true usually) */}
            {(scene.showDialogueBox !== false) && (
                <div className="absolute bottom-0 left-0 w-full z-40">

                    {/* Input Field for Puzzles */}
                    {currentDialogue.input && (
                        <div className="absolute bottom-32 left-0 w-full flex justify-center z-50 pointer-events-auto px-4">
                            <form onSubmit={handleInputSubmit} className="flex flex-col items-center gap-4 w-full max-w-md">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder={currentDialogue.input.placeholder || "Entrez la réponse..."}
                                    className="w-full h-16 bg-[#505050] text-white text-center text-3xl focus:outline-none focus:ring-4 focus:ring-white/50 transition-all border-4 border-white font-pixel"
                                    autoFocus
                                    onClick={(e) => e.stopPropagation()}
                                />
                                <button
                                    type="submit"
                                    className="px-8 py-2 bg-green-600 text-white text-xl border-4 border-white hover:bg-green-700 uppercase font-bold"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    Valider
                                </button>
                                {showInputError && (
                                    <div className="text-red-500 text-2xl font-bold animate-bounce bg-black/80 px-4 py-2 rounded">
                                        Accès Refusé !
                                    </div>
                                )}
                            </form>
                        </div>
                    )}

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

                    {!isQuestion && !currentDialogue.input && currentDialogue.speaker !== 'Chatrlatant' && (
                        <DialogueBox
                            text={processedText}
                            characterName={currentDialogue.speaker}
                            avatarSrc={currentDialogue.speaker === 'Chatrlatant' ? '/images/personnages/chat/cat_basic.png' : '/images/background/profilepic.png'}
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
