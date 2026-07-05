'use client';
import { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const SPEED = 120;

export default function SnakeWidget() {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 10 });
  const [dir, setDir] = useState({ x: 0, y: -1 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const dirRef = useRef(dir);
  const touchStartRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('snake_highscore');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) });
    setDir({ x: 0, y: -1 });
    dirRef.current = { x: 0, y: -1 };
    setGameOver(false);
    setScore(0);
  };

  const handleKeyDown = useCallback((e) => {
    switch (e.key) {
      case 'ArrowUp': if (dirRef.current.y === 0) dirRef.current = { x: 0, y: -1 }; break;
      case 'ArrowDown': if (dirRef.current.y === 0) dirRef.current = { x: 0, y: 1 }; break;
      case 'ArrowLeft': if (dirRef.current.x === 0) dirRef.current = { x: -1, y: 0 }; break;
      case 'ArrowRight': if (dirRef.current.x === 0) dirRef.current = { x: 1, y: 0 }; break;
    }
  }, []);

  const handleTouchStart = (e) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e) => {
    if (!touchStartRef.current) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 30 && dirRef.current.x === 0) dirRef.current = { x: 1, y: 0 };
      else if (dx < -30 && dirRef.current.x === 0) dirRef.current = { x: -1, y: 0 };
    } else {
      if (dy > 30 && dirRef.current.y === 0) dirRef.current = { x: 0, y: 1 };
      else if (dy < -30 && dirRef.current.y === 0) dirRef.current = { x: 0, y: -1 };
    }
    touchStartRef.current = null;
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setSnake((prev) => {
        const head = { x: prev[0].x + dirRef.current.x, y: prev[0].y + dirRef.current.y };
        
        // Wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setGameOver(true);
          return prev;
        }
        
        // Self collision
        if (prev.some(segment => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true);
          return prev;
        }

        const newSnake = [head, ...prev];
        
        if (head.x === food.x && head.y === food.y) {
          const newScore = score + 10;
          setScore(newScore);
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem('snake_highscore', newScore);
          }
          let newFood;
          while (true) {
            newFood = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
            if (!newSnake.some(s => s.x === newFood.x && s.y === newFood.y)) break;
          }
          setFood(newFood);
        } else {
          newSnake.pop();
        }
        
        return newSnake;
      });
    }, SPEED);
    return () => clearInterval(interval);
  }, [gameOver, food, score, highScore]);

  return (
    <div 
      className="w-full h-full bg-[#111] flex flex-col items-center justify-center font-mono select-none overflow-hidden touch-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="w-[320px] mb-4 flex justify-between items-center text-green-400">
        <div>SCORE: {score}</div>
        <div>BEST: {highScore}</div>
      </div>
      
      <div className="relative w-[320px] h-[320px] bg-[#1a1a1a] border-2 border-green-900 rounded-sm overflow-hidden shadow-[0_0_20px_rgba(34,197,94,0.1)]">
        {snake.map((segment, i) => (
          <div 
            key={i}
            className="absolute bg-green-500 rounded-sm"
            style={{
              width: `${100 / GRID_SIZE}%`,
              height: `${100 / GRID_SIZE}%`,
              left: `${(segment.x / GRID_SIZE) * 100}%`,
              top: `${(segment.y / GRID_SIZE) * 100}%`,
              opacity: i === 0 ? 1 : 0.8
            }}
          />
        ))}
        <div 
          className="absolute bg-red-500 rounded-full"
          style={{
            width: `${100 / GRID_SIZE}%`,
            height: `${100 / GRID_SIZE}%`,
            left: `${(food.x / GRID_SIZE) * 100}%`,
            top: `${(food.y / GRID_SIZE) * 100}%`,
            boxShadow: '0 0 10px rgba(239,68,68,0.8)'
          }}
        />
        
        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
            <div className="text-red-500 text-2xl font-bold mb-4 tracking-wider text-shadow-sm">GAME OVER</div>
            <button 
              onClick={resetGame}
              className="px-6 py-2 bg-green-500/20 text-green-400 border border-green-500/50 rounded-sm hover:bg-green-500/30 transition-colors"
            >
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-8 text-green-700 text-[11px] uppercase tracking-widest">
        Use Arrow Keys or Swipe
      </div>
    </div>
  );
}
