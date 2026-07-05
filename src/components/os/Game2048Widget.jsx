'use client';
import { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 4;
const CELL_COLORS = {
  2: 'bg-[#eee4da] text-[#776e65]',
  4: 'bg-[#ede0c8] text-[#776e65]',
  8: 'bg-[#f2b179] text-white',
  16: 'bg-[#f59563] text-white',
  32: 'bg-[#f67c5f] text-white',
  64: 'bg-[#f65e3b] text-white',
  128: 'bg-[#edcf72] text-white shadow-[0_0_15px_rgba(237,207,114,0.5)]',
  256: 'bg-[#edcc61] text-white shadow-[0_0_20px_rgba(237,204,97,0.6)]',
  512: 'bg-[#edc850] text-white shadow-[0_0_25px_rgba(237,200,80,0.7)]',
  1024: 'bg-[#edc53f] text-white shadow-[0_0_30px_rgba(237,197,63,0.8)]',
  2048: 'bg-[#edc22e] text-white shadow-[0_0_35px_rgba(237,194,46,0.9)]',
};

const getEmptyBoard = () => Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));

export default function Game2048Widget({ className = '' }) {
  const [board, setBoard] = useState(getEmptyBoard());
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  
  const touchStart = useRef({ x: 0, y: 0 });

  // Initialize board with 2 tiles
  useEffect(() => {
    const savedBest = localStorage.getItem('2048_best');
    if (savedBest) setBestScore(parseInt(savedBest, 10));
    resetGame();
  }, []);

  const resetGame = () => {
    let newBoard = getEmptyBoard();
    newBoard = addRandomTile(newBoard);
    newBoard = addRandomTile(newBoard);
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
  };

  const getEmptyCells = (currentBoard) => {
    const emptyCells = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (currentBoard[r][c] === 0) emptyCells.push({ r, c });
      }
    }
    return emptyCells;
  };

  const addRandomTile = (currentBoard) => {
    const emptyCells = getEmptyCells(currentBoard);
    if (emptyCells.length === 0) return currentBoard;
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newBoard = currentBoard.map(row => [...row]);
    newBoard[randomCell.r][randomCell.c] = Math.random() < 0.9 ? 2 : 4;
    return newBoard;
  };

  const checkGameOver = (currentBoard) => {
    if (getEmptyCells(currentBoard).length > 0) return false;
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const val = currentBoard[r][c];
        if (
          (r < GRID_SIZE - 1 && currentBoard[r + 1][c] === val) ||
          (c < GRID_SIZE - 1 && currentBoard[r][c + 1] === val)
        ) {
          return false;
        }
      }
    }
    return true;
  };

  const move = useCallback((direction) => {
    if (gameOver) return;
    
    let newBoard = getEmptyBoard();
    let newScore = score;
    let moved = false;

    const processRow = (row) => {
      let filtered = row.filter(val => val !== 0);
      for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] *= 2;
          newScore += filtered[i];
          filtered.splice(i + 1, 1);
        }
      }
      while (filtered.length < GRID_SIZE) filtered.push(0);
      return filtered;
    };

    for (let i = 0; i < GRID_SIZE; i++) {
      let row = [];
      if (direction === 'LEFT' || direction === 'RIGHT') {
        row = [...board[i]];
        if (direction === 'RIGHT') row.reverse();
        row = processRow(row);
        if (direction === 'RIGHT') row.reverse();
        newBoard[i] = row;
      } else {
        for (let j = 0; j < GRID_SIZE; j++) row.push(board[j][i]);
        if (direction === 'DOWN') row.reverse();
        row = processRow(row);
        if (direction === 'DOWN') row.reverse();
        for (let j = 0; j < GRID_SIZE; j++) newBoard[j][i] = row[j];
      }
    }

    // Check if moved
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (board[r][c] !== newBoard[r][c]) moved = true;
      }
    }

    if (moved) {
      newBoard = addRandomTile(newBoard);
      setBoard(newBoard);
      setScore(newScore);
      if (newScore > bestScore) {
        setBestScore(newScore);
        localStorage.setItem('2048_best', newScore);
      }
      if (checkGameOver(newBoard)) setGameOver(true);
    }
  }, [board, score, bestScore, gameOver]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault(); // Prevent scrolling
        if (e.key === 'ArrowUp') move('UP');
        if (e.key === 'ArrowDown') move('DOWN');
        if (e.key === 'ArrowLeft') move('LEFT');
        if (e.key === 'ArrowRight') move('RIGHT');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move]);

  // Touch controls
  const handleTouchStart = (e) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e) => {
    if (gameOver) return;
    const touchEnd = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    const dx = touchEnd.x - touchStart.current.x;
    const dy = touchEnd.y - touchStart.current.y;
    
    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > 30) move(dx > 0 ? 'RIGHT' : 'LEFT');
    } else {
      if (Math.abs(dy) > 30) move(dy > 0 ? 'DOWN' : 'UP');
    }
  };

  return (
    <div 
      className={`bg-[#faf8ef] rounded-2xl p-4 flex flex-col items-center justify-center shadow-xl select-none ${className}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex justify-between items-center w-full max-w-[300px] mb-4">
        <h1 className="text-3xl font-bold text-[#776e65]">2048</h1>
        <div className="flex gap-2 text-white font-bold text-center">
          <div className="bg-[#bbada0] rounded-md px-3 py-1">
            <div className="text-[10px] text-[#eee4da] uppercase">Score</div>
            <div className="text-sm">{score}</div>
          </div>
          <div className="bg-[#bbada0] rounded-md px-3 py-1">
            <div className="text-[10px] text-[#eee4da] uppercase">Best</div>
            <div className="text-sm">{bestScore}</div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="bg-[#bbada0] p-2 rounded-xl relative">
        {gameOver && (
          <div className="absolute inset-0 bg-[#eee4da]/70 z-10 rounded-xl flex flex-col items-center justify-center backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-[#776e65] mb-4">Game Over!</h2>
            <button 
              onClick={resetGame}
              className="bg-[#8f7a66] text-white font-bold px-6 py-2 rounded-md hover:bg-[#9f8b77] transition-colors"
            >
              Try again
            </button>
          </div>
        )}
        
        <div className="grid grid-cols-4 gap-2">
          {board.map((row, r) => (
            row.map((val, c) => (
              <div 
                key={`${r}-${c}`} 
                className={`w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] flex justify-center items-center rounded-md text-2xl font-bold transition-all duration-150
                  ${val === 0 ? 'bg-[#cdc1b4]' : CELL_COLORS[val] || 'bg-[#3c3a32] text-[#f9f6f2] shadow-[0_0_30px_rgba(255,255,255,0.5)]'}
                `}
              >
                {val !== 0 ? val : ''}
              </div>
            ))
          ))}
        </div>
      </div>
      
      {/* Instructions */}
      <div className="text-[#776e65] text-[11px] mt-4 w-full max-w-[300px] text-center opacity-70">
        <span className="hidden sm:inline">Use <strong>arrow keys</strong> to move tiles.</span>
        <span className="sm:hidden"><strong>Swipe</strong> to move tiles.</span>
        {' '}Join the numbers to get to 2048!
      </div>
    </div>
  );
}
