"use client";

import React, { useState, useEffect } from 'react';
import { Scene } from '@/lib/game/types';
import { useRouter } from 'next/navigation';
import { irishGrover } from '@/lib/fonts';
import { DialogueBox } from '@/components/DialogueBox';
import { RetroButton } from '@/components/RetroButton';
import { ChatCompanion } from '@/components/ChatCompanion';
import SpaceInvadersGame from '@/components/minigames/SpaceInvadersGame';

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

    const handleArcadeClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        handleChoice('chapitre1/geek-arcade');
    };

    const handleArcadeWin = () => {
        handleChoice('chapitre1/geek-success');
    };

    const handleInputSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentDialogue || !currentDialogue.input) return;

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
        } else if (currentDialogue && !currentDialogue.choices && !currentDialogue.input) {
            handleNext();
        }
    };

    const currentDialogue = scene.dialogues[dialogueIndex];
    const isLastDialogue = dialogueIndex === scene.dialogues.length - 1;

    // Helper to replace variables in text
    const processText = (text: string) => {
        if (!text) return '';
        return text.replace(/<name>/g, effectiveName).replace(/{name}/g, effectiveName);
    };

    const processedText = currentDialogue ? processText(currentDialogue.text) : '';
    const isQuestion = currentDialogue ? (!!currentDialogue.choices && currentDialogue.choices.length > 0) : false;

    const handleNext = () => {
        if (!isLastDialogue) {
            setDialogueIndex(prev => prev + 1);
        } else if (currentDialogue && currentDialogue.choices) {
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
            if (e.code === 'Space' && currentDialogue && !currentDialogue.choices) {
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

            {/* Arcade Machine Hitbox for geek-arcade-intro */}
            {scene.id === 'geek-arcade-intro' && (
                <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[400px] z-30 cursor-pointer border-4 border-transparent hover:border-green-500 transition-all"
                    onClick={handleArcadeClick}
                >
                    <div className="absolute -top-10 left-0 w-full text-center text-green-500 font-pixel animate-bounce">
                        CLIQUER POUR JOUER
                    </div>
                </div>
            )}

            {/* Computer Hitbox for DSI scene */}
            {scene.id === 'DSI' && (
                <div
                    className="absolute top-1/2 left-[calc(50%+150px)] transform -translate-x-1/2 -translate-y-1/2 w-[200px] h-[150px] z-[60] cursor-pointer border-4 border-white/30 hover:border-blue-500 transition-all"
                    onClick={() => handleChoice('chapitre2/DSI-computer')}
                >
                    <div className="absolute -top-10 left-0 w-full text-center text-blue-500 font-pixel animate-bounce">
                        OUVRIR ORDINATEUR
                    </div>
                </div>
            )}

            {/* Click to enter desktop from computer view */}
            {scene.id === 'DSI-computer' && (
                <div
                    className="absolute inset-0 z-30 cursor-pointer"
                    onClick={() => handleChoice('chapitre2/DSI-desktop')}
                />
            )}

            {/* Mail Icon Hitbox for DSI-desktop */}
            {scene.id === 'DSI-desktop' && (
                <div
                    className="absolute top-[28%] left-[32%] w-[100px] h-[100px] z-30 cursor-pointer border-4 border-transparent hover:border-yellow-500 transition-all"
                    onClick={() => handleChoice('chapitre2/DSI-email-writing')}
                >
                    <div className="absolute -bottom-8 left-0 w-full text-center text-yellow-500 font-pixel text-sm bg-black/50">
                        MAIL
                    </div>
                </div>
            )}

            {/* Email Writing Interface */}
            {scene.id === 'DSI-email-writing' && (
                <EmailTyper onComplete={() => handleChoice('chapitre2/success')} />
            )}

            {/* Minigame Overlay */}
            {scene.id === 'geek-arcade' && (
                <SpaceInvadersGame onWin={handleArcadeWin} />
            )}

            {/* Chat Companion (Optional) */}
            {scene.showChatCompanion && (
                <div onClick={handleRobotClick} className="cursor-pointer pointer-events-auto relative z-40">
                    <ChatCompanion
                        text={tempRobotText || (isQuestion ? processedText : (scene.id === 'door-puzzle' ? '' : (currentDialogue && currentDialogue.speaker === 'Chatrlatant' ? processedText : '')))}
                        mood={currentDialogue ? (currentDialogue.emotion as any || 'basic') : 'basic'}
                    />
                </div>
            )}

            {/* Dialogue Box (Optional but default true usually) */}
            {(scene.showDialogueBox !== false) && (
                <div className="absolute bottom-0 left-0 w-full z-40">

                    {/* Input Field for Puzzles */}
                    {currentDialogue && currentDialogue.input && (
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

                    {currentDialogue && currentDialogue.choices && scene.id !== 'corridor-choice' && (
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

                    {currentDialogue && !isQuestion && !currentDialogue.input && currentDialogue.speaker !== 'Chatrlatant' && (
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

const EmailTyper: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const fullText = "Bonjour,\n\nSuite à une réévaluation stratégique, nous vous informons de notre volonté de résilier l'intégralité de nos abonnements pour vos solutions logicielles et cloud.\n\nNous sommes désormais une institution souveraine.\n\nCordialement.";
    const subjectText = "Résiliation de nos abonnements";

    const [typedText, setTypedText] = useState('');
    const [showSubject, setShowSubject] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        const handleKeyDown = () => {
            if (isComplete) return;

            if (!showSubject) {
                setShowSubject(true);
                return;
            }

            setTypedText(prev => {
                const remaining = fullText.slice(prev.length);
                if (remaining.length === 0) {
                    setIsComplete(true);
                    return prev;
                }
                // Type 3-5 chars at a time for satisfying feel
                const chunk = remaining.slice(0, 4);
                const newText = prev + chunk;
                if (newText.length >= fullText.length) {
                    setIsComplete(true);
                    return fullText;
                }
                return newText;
            });
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('click', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('click', handleKeyDown);
        };
    }, [isComplete, showSubject]);

    return (
        <div className="absolute inset-0 z-20 pointer-events-none">
            {/* Centered Container for Monitor Content */}
            <div className="absolute top-[52%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%] md:w-[42%] h-[45%] flex flex-col gap-2 md:gap-6">

                {/* Subject Line Area */}
                <div className="h-[15%] w-full flex items-end pl-2 md:pl-4">
                    <span className="text-black font-sans text-xs md:text-lg font-bold whitespace-nowrap translate-y-1 md:translate-y-2">
                        {showSubject && subjectText}
                    </span>
                </div>

                {/* Body Text Area */}
                <div className="flex-1 w-full text-black font-sans text-xs md:text-lg leading-relaxed whitespace-pre-wrap overflow-hidden p-2 md:p-4 pt-4">
                    {typedText}
                    {!isComplete && <span className="inline-block w-1.5 h-3 md:w-2 md:h-4 bg-black ml-1 animate-pulse" />}
                </div>
            </div>

            {/* Send Button */}
            {isComplete && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onComplete();
                    }}
                    className="absolute bottom-[15%] right-[10%] md:right-[20%] px-4 py-2 md:px-6 md:py-2 bg-blue-600 text-white text-sm md:text-base font-bold rounded hover:bg-blue-700 transition-all pointer-events-auto shadow-lg border-2 border-white"
                >
                    ENVOYER
                </button>
            )}

            {/* Instruction Overlay (fades out) */}
            {!isComplete && typedText.length === 0 && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400 text-sm md:text-xl font-bold animate-pulse pointer-events-none bg-white/80 p-2 md:p-4 rounded text-center">
                    TAPEZ SUR VOTRE CLAVIER...
                </div>
            )}
        </div>
    );
};


