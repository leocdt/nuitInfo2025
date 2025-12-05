"use client";

import React, { useState } from 'react';
import { ChatCompanion, CatMood } from '@/components/ChatCompanion';

export default function ChatCompanionTestPage() {
    const [text, setText] = useState("Salut ! Je suis ton compagnon Chat'rlatan. Je suis là pour t'aider... ou pas !");
    const [mood, setMood] = useState<CatMood>('basic');
    const [key, setKey] = useState(0); // To force re-render/reset of component

    const handleTest = (newMood: CatMood, newText: string) => {
        setMood(newMood);
        setText(newText);
        setKey(prev => prev + 1); // Force restart of typing effect
    };

    return (
        <div 
            className="relative w-full h-screen bg-cover bg-center overflow-hidden"
            style={{ backgroundImage: "url('/images/background/server_room.png')" }}
        >
            {/* Overlay for better visibility of controls */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Controls for testing */}
            <div className="absolute top-10 left-10 z-50 bg-white/90 p-6 rounded-lg shadow-xl border-4 border-slate-800 max-w-md">
                <h1 className="text-2xl font-bold mb-4 font-pixel text-slate-900">Test du Chat Companion</h1>
                
                <div className="space-y-4">
                    <div>
                        <p className="font-bold mb-2 text-slate-700">Humeurs :</p>
                        <div className="grid grid-cols-2 gap-2">
                            <button 
                                onClick={() => handleTest('basic', "Tout va bien, je surveille les serveurs. Enfin, je crois.")}
                                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded font-pixel text-sm transition-colors"
                            >
                                Basic
                            </button>
                            <button 
                                onClick={() => handleTest('error', "ERREUR 404 : Mon cerveau n'a pas été trouvé ! Il y a des bugs partout !")}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded font-pixel text-sm transition-colors"
                            >
                                Error
                            </button>
                            <button 
                                onClick={() => handleTest('sad', "Personne ne me fait de câlins... C'est triste la vie de robot-chat.")}
                                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded font-pixel text-sm transition-colors"
                            >
                                Sad
                            </button>
                            <button 
                                onClick={() => handleTest('tired', "Je suis épuisé... Trop de calculs... Je vais faire une sieste sur le clavier.")}
                                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded font-pixel text-sm transition-colors"
                            >
                                Tired
                            </button>
                        </div>
                    </div>

                    <div>
                        <p className="font-bold mb-2 text-slate-700">Test Long Texte :</p>
                        <button 
                            onClick={() => handleTest('basic', "Voici un texte très long pour tester si je suis capable de parler pendant longtemps sans m'arrêter. Normalement ma bulle devrait se vider automatiquement quand elle est pleine, et je devrais continuer à parler. C'est fascinant la technologie, non ? Miaou !")}
                            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-pixel text-sm transition-colors"
                        >
                            Lancer Long Monologue
                        </button>
                    </div>
                </div>
            </div>

            {/* The Component being tested */}
            <ChatCompanion 
                key={key}
                text={text}
                mood={mood}
                speed={40}
                onComplete={() => console.log("Chat a fini de parler !")}
            />
        </div>
    );
}
