'use client';

import SpaceInvadersGame from '@/components/minigames/SpaceInvadersGame';

export default function SpaceInvadersPage() {
  const handleWin = () => {
    console.log('Game Won! Triggering next sequence...');
    alert('VICTOIRE ! (Check console)');
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className="w-full max-w-5xl">
        <h1 className="text-[#00FF00] font-mono text-3xl text-center mb-8">
          &gt; SYSTEM_OVERRIDE_PROTOCOL_V2.exe
        </h1>
        
        <SpaceInvadersGame onWin={handleWin} />
        
        <div className="mt-8 text-center text-gray-500 font-mono text-sm">
          <p>DEBUG MODE: REACH 80 POINTS TO UNLOCK</p>
        </div>
      </div>
    </main>
  );
}
