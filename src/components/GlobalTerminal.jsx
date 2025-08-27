'use client';
import React, { useState, useEffect } from 'react';
import InteractiveTerminal from './InteractiveTerminal';

const GlobalTerminal = () => {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        setIsTerminalOpen(true);
      }
      if (e.key === 'Escape' && isTerminalOpen) {
        setIsTerminalOpen(false);
      }
    };

    const handleCloseTerminal = () => {
      setIsTerminalOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('closeTerminal', handleCloseTerminal);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('closeTerminal', handleCloseTerminal);
    };
  }, [isTerminalOpen]);

  return (
    <>
      {/* Global Terminal Button - Fixed Position like Social Icons */}
      <div className="fixed top-1/2 right-1 sm:right-2 md:right-4 lg:right-6 xl:right-8 z-50 flex-col justify-center items-center transform -translate-y-1/2">
        <div className="flex flex-col justify-center items-center gap-2 sm:gap-3 border-2 border-[#30363d] p-2 sm:p-3 bg-[#0d1117]/90 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-lg">
          <button
            onClick={() => setIsTerminalOpen(true)}
            className="terminal-button group relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#58a6ff] to-[#1f6feb] rounded-md sm:rounded-lg flex items-center justify-center hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 border border-[#30363d]/50"
            title="Open Terminal (Ctrl + `)"
          >
            <span className="text-white text-base sm:text-lg font-bold group-hover:scale-110 transition-transform">$</span>
            
            {/* Tooltip - Hidden on very small screens */}
            <div className="hidden sm:block absolute right-full mr-3 px-3 py-2 bg-[#161b22] text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap border border-[#30363d] shadow-lg">
              Open Terminal
              <div className="absolute top-1/2 -right-1 w-2 h-2 bg-[#161b22] border-r border-b border-[#30363d] transform rotate-45 -translate-y-1/2"></div>
            </div>
          </button>
          
          {/* Keyboard shortcut indicator - Hidden on very small screens */}
          <div className="hidden sm:block text-[#8b949e] text-xs font-mono bg-[#161b22]/80 px-2 py-1 rounded border border-[#30363d]/50">
            Ctrl+`
          </div>
        </div>
      </div>

      {/* Terminal Modal */}
      {isTerminalOpen && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          style={{ zIndex: 9999999 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsTerminalOpen(false);
            }
          }}
        >
          <div 
            className="relative w-full max-w-6xl h-[80vh] overflow-hidden shadow-2xl animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Terminal Window */}
            <div className="bg-gradient-to-b from-[#1e2328] to-[#161b22] rounded-xl border border-[#30363d]/50 shadow-2xl h-full">
              {/* Terminal Header */}
              <div className="flex items-center justify-between bg-gradient-to-r from-[#21262d] to-[#161b22] px-6 py-4 border-b border-[#30363d]/50 rounded-t-xl">
                <div className="flex items-center gap-4">
                  {/* Traffic Light Buttons */}
                  <div className="flex gap-2">
                    <div 
                      className="w-3 h-3 bg-[#ff5f56] rounded-full hover:bg-[#ff5f56]/80 cursor-pointer transition-colors shadow-sm"
                      onClick={() => setIsTerminalOpen(false)}
                      title="Close"
                    ></div>
                    <div 
                      className="w-3 h-3 bg-[#ffbd2e] rounded-full hover:bg-[#ffbd2e]/80 cursor-pointer transition-colors shadow-sm"
                      onClick={() => {
                        // Send event to terminal to toggle status bar
                        window.dispatchEvent(new CustomEvent('toggleStatusBar'));
                      }}
                      title="Toggle status bar"
                    ></div>
                    <div 
                      className="w-3 h-3 bg-[#27ca3f] rounded-full hover:bg-[#27ca3f]/80 cursor-pointer transition-colors shadow-sm"
                      title="Maximize"
                    ></div>
                  </div>
                  
                  {/* Terminal Title */}
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-[#58a6ff] to-[#1f6feb] rounded-md flex items-center justify-center">
                      <span className="text-white text-xs font-bold">$</span>
                    </div>
                    <span className="text-[#e6edf3] font-semibold text-lg">
                      Interactive Terminal
                    </span>
                    <span className="text-[#8b949e] text-sm">
                      ~/saurav-portfolio
                    </span>
                  </div>
                </div>
                
                {/* Terminal Controls */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-[#8b949e] text-sm">
                    <div className="w-2 h-2 bg-[#27ca3f] rounded-full animate-pulse"></div>
                    <span>Online</span>
                  </div>
                  
                  <button
                    onClick={() => setIsTerminalOpen(false)}
                    className="text-[#8b949e] hover:text-[#ff5f56] transition-all duration-200 p-2 rounded-md hover:bg-[#30363d]/50 group"
                    aria-label="Close terminal"
                  >
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Terminal Content */}
              <div className="bg-gradient-to-b from-[#0d1117] to-[#010409] rounded-b-xl overflow-hidden border-t border-[#21262d]/50 h-[calc(80vh-70px)]">
                <InteractiveTerminal />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </>
  );
};

export default GlobalTerminal;