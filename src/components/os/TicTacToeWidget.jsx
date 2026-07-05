'use client';
import { useState, useEffect } from 'react';

const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

export default function TicTacToeWidget() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null); // 'X', 'O', 'Draw'
  const [scores, setScores] = useState({ player: 0, ai: 0 });

  useEffect(() => {
    const saved = localStorage.getItem('tictactoe_scores');
    if (saved) setScores(JSON.parse(saved));
  }, []);

  const checkWinner = (squares) => {
    for (let i = 0; i < WIN_LINES.length; i++) {
      const [a, b, c] = WIN_LINES[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    if (!squares.includes(null)) return 'Draw';
    return null;
  };

  const handleWin = (result) => {
    setWinner(result);
    if (result === 'X') {
      const newScores = { ...scores, player: scores.player + 1 };
      setScores(newScores);
      localStorage.setItem('tictactoe_scores', JSON.stringify(newScores));
    } else if (result === 'O') {
      const newScores = { ...scores, ai: scores.ai + 1 };
      setScores(newScores);
      localStorage.setItem('tictactoe_scores', JSON.stringify(newScores));
    }
  };

  const aiMove = (currentBoard) => {
    const emptyIndices = currentBoard.map((v, i) => v === null ? i : null).filter(v => v !== null);
    if (emptyIndices.length === 0) return;
    
    // Very simple AI: Pick random
    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    const newBoard = [...currentBoard];
    newBoard[randomIndex] = 'O';
    setBoard(newBoard);
    
    const result = checkWinner(newBoard);
    if (result) handleWin(result);
    else setIsPlayerTurn(true);
  };

  useEffect(() => {
    if (!isPlayerTurn && !winner) {
      const timer = setTimeout(() => aiMove(board), 500);
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, board, winner]);

  const handleClick = (index) => {
    if (board[index] || winner || !isPlayerTurn) return;
    
    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsPlayerTurn(false);
    
    const result = checkWinner(newBoard);
    if (result) handleWin(result);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsPlayerTurn(true);
  };

  return (
    <div className="w-full h-full bg-[#1c1c1e] flex flex-col items-center justify-center select-none font-sans overflow-hidden">
      <div className="w-[300px] flex justify-between mb-8 px-4 text-white/80 font-medium">
        <div className="flex flex-col items-center">
          <span className="text-[12px] text-white/40 uppercase tracking-widest mb-1">You (X)</span>
          <span className="text-2xl text-[#64D2FF]">{scores.player}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[12px] text-white/40 uppercase tracking-widest mb-1">AI (O)</span>
          <span className="text-2xl text-[#FF6482]">{scores.ai}</span>
        </div>
      </div>

      <div className="relative w-[300px] h-[300px] grid grid-cols-3 grid-rows-3 gap-2 bg-white/5 p-2 rounded-2xl backdrop-blur-md shadow-2xl">
        {board.map((cell, i) => (
          <button 
            key={i}
            onClick={() => handleClick(i)}
            disabled={cell !== null || winner !== null || !isPlayerTurn}
            className={`w-full h-full bg-[#2a2a2c] rounded-xl flex items-center justify-center text-6xl font-light transition-all
              ${cell === null && isPlayerTurn && !winner ? 'cursor-pointer hover:bg-white/10 active:scale-95' : 'cursor-default'}
            `}
          >
            {cell === 'X' && <span className="text-[#64D2FF] drop-shadow-[0_0_8px_rgba(100,210,255,0.5)]">×</span>}
            {cell === 'O' && <span className="text-[#FF6482] drop-shadow-[0_0_8px_rgba(255,100,130,0.5)]">○</span>}
          </button>
        ))}
        
        {winner && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
            <div className="text-3xl font-bold text-white mb-6 drop-shadow-md">
              {winner === 'Draw' ? 'It\'s a Draw!' : `${winner} Wins!`}
            </div>
            <button 
              onClick={resetGame}
              className="px-6 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-full font-medium transition-colors backdrop-blur-md"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-8 text-[13px] text-white/40">
        {!winner ? (isPlayerTurn ? 'Your turn...' : 'AI is thinking...') : 'Game Over'}
      </div>
    </div>
  );
}
