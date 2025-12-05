import React, { useEffect, useRef, useState } from 'react';

interface SpaceInvadersGameProps {
  onWin: () => void;
}

const SpaceInvadersGame: React.FC<SpaceInvadersGameProps> = ({ onWin }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'WON' | 'GAME_OVER'>('START');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);

  // Ref to access the start function from outside the useEffect
  const startGameRef = useRef<() => void>(() => { });

  // Audio refs
  const shootSound = useRef<HTMLAudioElement | null>(null);
  const explosionSound = useRef<HTMLAudioElement | null>(null);
  const winSound = useRef<HTMLAudioElement | null>(null);
  const gameOverSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio
    shootSound.current = new Audio('/audio/space-invider/shoot.mp3');
    explosionSound.current = new Audio('/audio/space-invider/explosion.mp3');
    winSound.current = new Audio('/audio/space-invider/win.mp3');
    gameOverSound.current = new Audio('/audio/space-invider/game-over.mp3');

    // Preload
    shootSound.current.volume = 0.3;
    explosionSound.current.volume = 0.4;
    winSound.current.volume = 0.5;
    gameOverSound.current.volume = 0.5;
  }, []);

  const playSound = (sound: React.MutableRefObject<HTMLAudioElement | null>) => {
    if (sound.current) {
      sound.current.currentTime = 0;
      sound.current.play().catch(e => console.error("Audio play failed", e));
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Game Constants
    const CANVAS_WIDTH = 800;
    const CANVAS_HEIGHT = 600;
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    const PLAYER_WIDTH = 40;
    const PLAYER_HEIGHT = 20;
    const PLAYER_SPEED = 5;
    const BULLET_SPEED = 7;
    const ENEMY_BULLET_SPEED = 3; // Slower enemy bullets
    const ENEMY_WIDTH = 30;
    const ENEMY_HEIGHT = 20;
    const ENEMY_PADDING = 20;
    const ENEMY_ROWS = 5; // Increased rows slightly to compensate for gaps
    const ENEMY_COLS = 8; // Increased cols slightly
    const ENEMY_SPEED_X = 1; // Slow & Easy
    const ENEMY_DROP_Y = 20;

    // Game State Mutable Refs (for loop performance)
    let animationFrameId: number;
    let lastTime = 0;

    let player = {
      x: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
      y: CANVAS_HEIGHT - 50,
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
      isDead: false,
      invulnerableUntil: 0
    };

    let bullets: { x: number; y: number; width: number; height: number; dy: number; type: 'player' | 'enemy' }[] = [];

    let enemies: { x: number; y: number; width: number; height: number; row: number; col: number }[] = [];

    // Initialize Enemies
    const initEnemies = () => {
      enemies = [];
      for (let r = 0; r < ENEMY_ROWS; r++) {
        for (let c = 0; c < ENEMY_COLS; c++) {
          // Random distribution: 60% chance to spawn an enemy at each grid point
          if (Math.random() > 0.4) {
            enemies.push({
              x: 50 + c * (ENEMY_WIDTH + ENEMY_PADDING),
              y: 50 + r * (ENEMY_HEIGHT + ENEMY_PADDING),
              width: ENEMY_WIDTH,
              height: ENEMY_HEIGHT,
              row: r,
              col: c
            });
          }
        }
      }
    };

    let enemyDirection = 1; // 1 right, -1 left
    let currentScore = 0;
    let currentLives = 3;
    let gameActive = false;
    let winTriggered = false;

    // Input handling
    const keys: { [key: string]: boolean } = {};

    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.code] = true;

      // Restart
      if (e.code === 'KeyR' && !gameActive && !winTriggered) {
        resetGame();
      }

      // Start game on first interaction if needed, or just space to shoot
      if (e.code === 'Space' && gameActive) {
        // Shoot
        const now = Date.now();
        if (now - lastShotTime > 300) { // 300ms cooldown
          fireBullet();
          lastShotTime = now;
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.code] = false;
    };

    let lastShotTime = 0;

    const fireBullet = () => {
      if (player.isDead) return;
      bullets.push({
        x: player.x + player.width / 2 - 2,
        y: player.y,
        width: 4,
        height: 10,
        dy: -BULLET_SPEED,
        type: 'player'
      });
      playSound(shootSound);
    };

    const resetGame = () => {
      player.x = CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2;
      player.isDead = false;
      player.invulnerableUntil = 0;
      bullets = [];
      initEnemies();
      currentScore = 0;
      currentLives = 3;
      setScore(0);
      setLives(3);
      gameActive = true;
      winTriggered = false;
      setGameState('PLAYING');
      enemyDirection = 1;
    };

    // Expose resetGame to parent component via ref
    startGameRef.current = resetGame;

    // Sprites Drawing Helpers
    const drawPlayer = (ctx: CanvasRenderingContext2D) => {
      if (player.invulnerableUntil > Date.now()) {
        // Blink effect
        if (Math.floor(Date.now() / 100) % 2 === 0) return;
      }
      ctx.fillStyle = '#00FF00';
      // Simple ship shape
      ctx.fillRect(player.x, player.y + 10, player.width, 10); // Base
      ctx.fillRect(player.x + 15, player.y, 10, 10); // Turret
    };

    const drawAlien = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
      ctx.fillStyle = '#FFFFFF';
      // Simple alien shape (invader-ish)
      ctx.fillRect(x + 5, y, 20, 5);
      ctx.fillRect(x, y + 5, 30, 10);
      ctx.fillRect(x + 5, y + 15, 5, 5);
      ctx.fillRect(x + 20, y + 15, 5, 5);
      // Eyes
      ctx.fillStyle = '#000000';
      ctx.fillRect(x + 8, y + 8, 4, 4);
      ctx.fillRect(x + 18, y + 8, 4, 4);
    };

    const update = (deltaTime: number) => {
      if (!gameActive) return;

      // Player Movement
      if (!player.isDead) {
        if (keys['ArrowLeft'] || keys['KeyA']) {
          player.x -= PLAYER_SPEED;
        }
        if (keys['ArrowRight'] || keys['KeyD']) {
          player.x += PLAYER_SPEED;
        }
        // Clamp player
        player.x = Math.max(0, Math.min(CANVAS_WIDTH - player.width, player.x));
      }

      // Bullets
      for (let i = bullets.length - 1; i >= 0; i--) {
        let b = bullets[i];
        b.y += b.dy;

        // Remove off-screen
        if (b.y < 0 || b.y > CANVAS_HEIGHT) {
          bullets.splice(i, 1);
          continue;
        }

        // Collision with Enemies
        if (b.type === 'player') {
          for (let j = enemies.length - 1; j >= 0; j--) {
            let e = enemies[j];
            if (
              b.x < e.x + e.width &&
              b.x + b.width > e.x &&
              b.y < e.y + e.height &&
              b.y + b.height > e.y
            ) {
              // Hit!
              enemies.splice(j, 1);
              bullets.splice(i, 1);
              currentScore += 5; // Reduced points per kill
              setScore(currentScore);
              playSound(explosionSound);

              // Check Win
              if (currentScore >= 80 && !winTriggered) {
                winTriggered = true;
                gameActive = false;
                setGameState('WON');
                playSound(winSound);
                setTimeout(() => {
                  onWin();
                }, 2000);
              }
              break; // Bullet destroyed
            }
          }
        }
      }

      // Enemies Movement
      let hitEdge = false;
      enemies.forEach(e => {
        e.x += ENEMY_SPEED_X * enemyDirection;
        if (e.x <= 0 || e.x + e.width >= CANVAS_WIDTH) {
          hitEdge = true;
        }
      });

      if (hitEdge) {
        enemyDirection *= -1;
        enemies.forEach(e => {
          e.y += ENEMY_DROP_Y;
          // Check Game Over (Invasion)
          if (e.y + e.height >= player.y) {
            gameActive = false;
            setGameState('GAME_OVER');
            playSound(gameOverSound);
          }
        });
      }

      // Enemy Shooting (Random simple logic)
      if (Math.random() < 0.01 && enemies.length > 0) { // Reduced fire rate
        // Pick random enemy
        const shooter = enemies[Math.floor(Math.random() * enemies.length)];
        bullets.push({
          x: shooter.x + shooter.width / 2,
          y: shooter.y + shooter.height,
          width: 4,
          height: 10,
          dy: ENEMY_BULLET_SPEED,
          type: 'enemy'
        });
      }

      // Check Player Hit
      if (!player.isDead && player.invulnerableUntil < Date.now()) {
        for (let i = bullets.length - 1; i >= 0; i--) {
          let b = bullets[i];
          if (b.type === 'enemy') {
            if (
              b.x < player.x + player.width &&
              b.x + b.width > player.x &&
              b.y < player.y + player.height &&
              b.y + b.height > player.y
            ) {
              // Player Hit
              bullets.splice(i, 1);
              currentLives -= 1;
              setLives(currentLives);
              playSound(explosionSound); // Or a specific hurt sound

              if (currentLives <= 0) {
                gameActive = false;
                player.isDead = true;
                setGameState('GAME_OVER');
                playSound(gameOverSound);
              } else {
                // Respawn / Invulnerability
                player.invulnerableUntil = Date.now() + 2000; // 2 seconds invulnerability
              }
              break;
            }
          }
        }
      }

      if (enemies.length === 0 && !winTriggered) {
        // If all enemies dead but score < 80, respawn wave?
        // Or just win? Let's respawn a new wave to allow reaching 80
        if (currentScore < 80) {
          initEnemies();
          // Maybe increase speed slightly? Nah keep it easy.
        }
      }
    };

    const render = () => {
      // Clear
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw Player
      if (!player.isDead) {
        drawPlayer(ctx);
      }

      // Draw Enemies
      enemies.forEach(e => drawAlien(ctx, e.x, e.y));

      // Draw Bullets
      bullets.forEach(b => {
        ctx.fillStyle = b.type === 'player' ? '#00FF00' : '#FF0000';
        ctx.fillRect(b.x, b.y, b.width, b.height);
      });

      // Scanlines effect
      ctx.fillStyle = 'rgba(0, 255, 0, 0.05)';
      for (let i = 0; i < CANVAS_HEIGHT; i += 4) {
        ctx.fillRect(0, i, CANVAS_WIDTH, 2);
      }
    };

    const loop = (time: number) => {
      const deltaTime = time - lastTime;
      lastTime = time;

      update(deltaTime);
      render();
      animationFrameId = requestAnimationFrame(loop);
    };

    // Initial render (black screen)
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    animationFrameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [onWin]);

  return (
    <div className="relative w-full max-w-4xl mx-auto p-4">
      <div className="bg-gray-800 rounded-lg p-4 shadow-[0_0_50px_rgba(0,255,0,0.2)] border-4 border-gray-700 relative overflow-hidden">

        <div className="absolute top-0 left-0 w-full h-full pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.9)] z-10 rounded-lg"></div>

        <div className="flex justify-between items-center mb-2 font-mono text-[#00FF00] z-20 relative px-4">
          <div className="text-xl animate-pulse">SCORE: {score} / 80</div>
          <div className="flex gap-2">
            {Array.from({ length: Math.max(0, lives) }).map((_, i) => (
              <span key={i} className="text-red-500 text-xl">♥</span>
            ))}
          </div>
        </div>

        <div className="relative aspect-[4/3] w-full bg-black rounded border-2 border-[#003300] shadow-[0_0_20px_rgba(0,255,0,0.1)]">
          <canvas
            ref={canvasRef}
            className="w-full h-full object-contain block"
            style={{ imageRendering: 'pixelated' }}
          />

          {/* OVERLAYS */}
          {gameState === 'START' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-30">
              <h2 className="text-[#00FF00] text-4xl md:text-6xl font-mono mb-8 animate-pulse text-center">
                SPACE DEFENDER
              </h2>
              <button
                onClick={() => startGameRef.current()}
                className="px-8 py-4 bg-[#003300] border-2 border-[#00FF00] text-[#00FF00] font-mono text-xl hover:bg-[#00FF00] hover:text-black transition-colors uppercase tracking-widest"
              >
                Start Mission
              </button>
              <p className="text-[#00FF00]/60 mt-4 font-mono text-sm">
                ARROWS to Move • SPACE to Shoot
              </p>
            </div>
          )}

          {gameState === 'GAME_OVER' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/30 z-30 backdrop-blur-sm">
              <h2 className="text-red-500 text-5xl font-mono mb-4 animate-bounce">
                MISSION FAILED
              </h2>
              <p className="text-red-400 font-mono mb-8">SYSTEM COMPROMISED</p>
              <button
                onClick={() => startGameRef.current()}
                className="px-8 py-4 bg-red-900/50 border-2 border-red-500 text-red-500 font-mono text-xl hover:bg-red-500 hover:text-black transition-colors uppercase"
              >
                Retry Protocol
              </button>
            </div>
          )}

          {gameState === 'WON' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#00FF00]/20 z-30 backdrop-blur-sm">
              <h2 className="text-[#00FF00] text-5xl font-mono mb-4 animate-pulse">
                SYSTEM UNLOCKED
              </h2>
              <div className="text-[#00FF00] font-mono text-center">
                <p className="mb-2">ACCESS GRANTED</p>
                <p className="text-sm opacity-70">Proceeding to next sequence...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpaceInvadersGame;
