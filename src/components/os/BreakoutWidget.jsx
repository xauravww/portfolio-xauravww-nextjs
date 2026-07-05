'use client';
import { useRef, useEffect, useState, useCallback } from 'react';

export default function BreakoutWidget() {
  const canvasRef = useRef(null);
  const requestRef = useRef();
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  
  // Game state refs
  const state = useRef({
    ball: { x: 200, y: 300, dx: 3, dy: -3, radius: 6 },
    paddle: { x: 160, y: 380, width: 80, height: 10 },
    bricks: [],
    score: 0
  });

  const initBricks = () => {
    const bricks = [];
    const rows = 5;
    const cols = 8;
    const padding = 10;
    const w = 40;
    const h = 15;
    const offsetTop = 40;
    const offsetLeft = 10;
    
    for (let c = 0; c < cols; c++) {
      bricks[c] = [];
      for (let r = 0; r < rows; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }
    return { bricks, rows, cols, padding, w, h, offsetTop, offsetLeft };
  };

  const resetGame = () => {
    const b = initBricks();
    state.current = {
      ball: { x: 200, y: 300, dx: 3, dy: -3, radius: 6 },
      paddle: { x: 160, y: 380, width: 80, height: 10 },
      bricks: b.bricks,
      brickConfig: b,
      score: 0
    };
    setScore(0);
    setGameOver(false);
    setGameWon(false);
    setGameStarted(true);
  };

  useEffect(() => {
    const b = initBricks();
    state.current.bricks = b.bricks;
    state.current.brickConfig = b;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { ball, paddle, bricks, brickConfig } = state.current;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw bricks
    let activeBricks = 0;
    for (let c = 0; c < brickConfig.cols; c++) {
      for (let r = 0; r < brickConfig.rows; r++) {
        if (bricks[c][r].status === 1) {
          activeBricks++;
          const brickX = (c * (brickConfig.w + brickConfig.padding)) + brickConfig.offsetLeft;
          const brickY = (r * (brickConfig.h + brickConfig.padding)) + brickConfig.offsetTop;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
          
          ctx.beginPath();
          ctx.rect(brickX, brickY, brickConfig.w, brickConfig.h);
          ctx.fillStyle = `hsl(${r * 40 + c * 10}, 80%, 60%)`;
          ctx.fill();
          ctx.closePath();
        }
      }
    }
    
    if (activeBricks === 0 && gameStarted && !gameOver && !gameWon) {
      setGameWon(true);
      return;
    }

    // Draw paddle
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = '#64D2FF';
    ctx.fill();
    ctx.closePath();
    
    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();
    
    // Collision detection
    for (let c = 0; c < brickConfig.cols; c++) {
      for (let r = 0; r < brickConfig.rows; r++) {
        const b = bricks[c][r];
        if (b.status === 1) {
          if (ball.x > b.x && ball.x < b.x + brickConfig.w && ball.y > b.y && ball.y < b.y + brickConfig.h) {
            ball.dy = -ball.dy;
            b.status = 0;
            state.current.score += 10;
            setScore(state.current.score);
          }
        }
      }
    }
    
    // Wall collision
    if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
      ball.dx = -ball.dx;
    }
    if (ball.y + ball.dy < ball.radius) {
      ball.dy = -ball.dy;
    } else if (ball.y + ball.dy > canvas.height - ball.radius - 15) { // bottom
      if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
        ball.dy = -ball.dy;
        // Add a bit of spin based on where it hit paddle
        ball.dx = ball.dx + ((ball.x - (paddle.x + paddle.width/2)) * 0.1);
      } else if (ball.y + ball.dy > canvas.height - ball.radius) {
        setGameOver(true);
        return;
      }
    }
    
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    if (!gameOver && !gameWon && gameStarted) {
      requestRef.current = requestAnimationFrame(draw);
    }
  }, [gameOver, gameWon, gameStarted]);

  useEffect(() => {
    if (gameStarted && !gameOver && !gameWon) {
      requestRef.current = requestAnimationFrame(draw);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameStarted, gameOver, gameWon, draw]);

  const handlePointerMove = (e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const relativeX = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    if (relativeX > 0 && relativeX < canvasRef.current.width) {
      state.current.paddle.x = relativeX - state.current.paddle.width / 2;
    }
  };

  return (
    <div className="w-full h-full bg-[#1c1c1e] flex flex-col items-center justify-center select-none overflow-hidden touch-none font-sans">
      <div className="w-[400px] flex justify-between mb-2 px-2 text-white/80 font-medium">
        <span>SCORE: {score}</span>
      </div>
      
      <div className="relative w-[400px] h-[400px] bg-black border border-white/10 shadow-2xl rounded-lg overflow-hidden">
        <canvas 
          ref={canvasRef}
          width={400} 
          height={400}
          onMouseMove={handlePointerMove}
          onTouchMove={handlePointerMove}
          className="cursor-crosshair w-full h-full block"
        />
        
        {!gameStarted && !gameOver && !gameWon && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
            <button onClick={resetGame} className="px-6 py-2 bg-white text-black font-semibold rounded-full hover:scale-105 transition-transform">
              START GAME
            </button>
          </div>
        )}
        
        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm">
            <div className="text-red-500 text-3xl font-bold mb-4">GAME OVER</div>
            <button onClick={resetGame} className="px-6 py-2 bg-white text-black font-semibold rounded-full hover:scale-105 transition-transform">
              TRY AGAIN
            </button>
          </div>
        )}

        {gameWon && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm">
            <div className="text-green-400 text-3xl font-bold mb-4">YOU WIN!</div>
            <button onClick={resetGame} className="px-6 py-2 bg-white text-black font-semibold rounded-full hover:scale-105 transition-transform">
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
