"use client";

import React, { useState } from 'react';
import { MainMenu } from '@/components/game/MainMenu';
import { NarrativeSequence } from '@/components/game/NarrativeSequence';
import { CharacterCreation } from '@/components/game/CharacterCreation';

type GameStep = 'MENU' | 'INTRO' | 'NAME' | 'GAME';

export default function Home() {
  const [step, setStep] = useState<GameStep>('MENU');
  const [playerName, setPlayerName] = useState('');

  const handleStart = () => {
    setStep('INTRO');
  };

  const handleIntroComplete = () => {
    setStep('NAME');
  };

  const handleNameConfirmed = (name: string) => {
    setPlayerName(name);
    setStep('GAME');
  };

  return (
    <main className="min-h-screen bg-black">
      {step === 'MENU' && (
        <MainMenu onStart={handleStart} />
      )}

      {step === 'INTRO' && (
        <NarrativeSequence onComplete={handleIntroComplete} />
      )}

      {step === 'NAME' && (
        <CharacterCreation onConfirm={handleNameConfirmed} />
      )}

      {step === 'GAME' && (
        <div className="min-h-screen flex items-center justify-center text-white font-pixel">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Bienvenue, DSI {playerName}</h1>
            <p className="text-xl">La suite arrive bientôt...</p>
          </div>
        </div>
      )}
    </main>
  );
}