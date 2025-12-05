"use client";

import React, { useState, useEffect } from 'react';
import { DialogueBox } from '../components/DialogueBox';
import { RetroButton } from '../components/RetroButton';

// --- 1. DÉFINITION DU SCÉNARIO (JSON) ---
const SCENARIO = [
    {
        id: 1,
        characterName: "Narrateur",
        avatarSrc: "https://picsum.photos/id/1062/200/200",
        text: "Bonjour et bienvenue au Lycée de NIRD, le dernier lycée de France a être resté souverain de sa donnée, enfin ça c'était jusqu'à ce que notre ancien DSI fasse un burnout et démissionne depuis le directeur de l'école à payé la liscence 365 et les professeur stockent tous sur OneDrive, mais vous avez postulé dans ce Lycée afin de remplacer l'ancien DSI, voyons ce dont vous serez capable !",
        audioSrc: "/audio/intro.mp3",
        nextSceneId: null
    }
];

export default function Home() {
    const [hasStarted, setHasStarted] = useState(false);
    const [processedScenes, setProcessedScenes] = useState<any[]>([]);
    const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(-1);
    const [isLoading, setIsLoading] = useState(true);

    // --- 2. PRÉ-CHARGEMENT ET CALCULS (Au montage de l'app) ---
    useEffect(() => {
        const preloadScenarios = async () => {
            setIsLoading(true);

            const processed = await Promise.all(SCENARIO.map(async (scene) => {
                try {
                    if (typeof window === 'undefined') return scene; // Sécurité SSR

                    // Création temporaire pour lire les métadonnées
                    const audio = new Audio(scene.audioSrc);

                    await new Promise((resolve, reject) => {
                        audio.addEventListener('loadedmetadata', () => resolve(true), { once: true });
                        audio.addEventListener('error', () => reject("Erreur chargement audio"), { once: true });
                        audio.preload = "metadata";
                    });

                    const durationInSeconds = audio.duration;
                    const safeDuration = (!isFinite(durationInSeconds) || durationInSeconds === 0) ? 3 : durationInSeconds;

                    const totalDurationMs = safeDuration * 1000;
                    const charCount = scene.text.length;

                    // Calcul de la vitesse idéale (durée totale - buffer de sécurité / nombre de char)
                    const speed = Math.max(10, (totalDurationMs - 300) / charCount);

                    return { ...scene, calculatedSpeed: speed };
                } catch (e) {
                    console.error(`Erreur audio pour la scène ${scene.id}:`, e);
                    return { ...scene, calculatedSpeed: 40 };
                }
            }));

            setProcessedScenes(processed);
            setIsLoading(false);
        };

        preloadScenarios();
    }, []);

    const startExperience = () => {
        setHasStarted(true);
        setCurrentSceneIndex(0);
    };

    const handleNext = () => {
        const currentScene = processedScenes[currentSceneIndex];
        if (currentScene && currentScene.nextSceneId) {
            const nextIndex = processedScenes.findIndex((s: any) => s.id === currentScene.nextSceneId);
            if (nextIndex !== -1) setCurrentSceneIndex(nextIndex);
        } else {
            console.log("Fin du scénario");
        }
    };

    const currentSceneData = currentSceneIndex >= 0 ? processedScenes[currentSceneIndex] : null;

    return (
        <main className="relative w-full h-screen bg-gray-900 overflow-hidden font-pixel">
            {/* Background décoratif */}
            <div
                className="absolute inset-0 opacity-40"
                style={{
                    backgroundImage: `url('https://picsum.photos/1920/1080?grayscale&blur=2')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            />

            {/* Écran titre / Bouton Start */}
            {!hasStarted && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
                    <h1 className="text-4xl md:text-6xl text-white mb-4 text-center text-shadow-retro">
                        RETRO RPG ENGINE
                    </h1>

                    {isLoading ? (
                        <div className="text-xl text-yellow-400 animate-pulse">
                            CHARGEMENT DES ASSETS AUDIO...
                        </div>
                    ) : (
                        <>
                            <p className="text-gray-400 mb-8 text-xl text-center max-w-md px-4">
                                Audio chargé. Prêt pour la synchronisation.
                            </p>
                            <RetroButton onClick={startExperience}>
                                LANCER L'EXPÉRIENCE
                            </RetroButton>
                        </>
                    )}
                </div>
            )}

            {/* La boîte de dialogue */}
            {currentSceneData && (
                <DialogueBox
                    key={currentSceneData.id}
                    characterName={currentSceneData.characterName}
                    avatarSrc={currentSceneData.avatarSrc}
                    text={currentSceneData.text}
                    audioSrc={currentSceneData.audioSrc}
                    speed={currentSceneData.calculatedSpeed}
                    audioLoop={false}
                    stopAudioOnTextComplete={false}
                    onComplete={handleNext}
                />
            )}
        </main>
    );
}