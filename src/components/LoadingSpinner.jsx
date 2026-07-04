"use client";
import { useState, useEffect } from 'react';

const LoadingSpinner = ({ text = "Loading...", className = "" }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div className={`flex items-center justify-center py-12 md:py-20 select-none ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        {/* Authentic Apple Activity Indicator */}
        <div className={isMobile ? "text-white/40" : "text-white/60"}>
          <svg
            viewBox="0 0 120 120"
            style={{
              width: isMobile ? '22px' : '32px',
              height: isMobile ? '22px' : '32px',
              animation: 'spin 1s steps(12) infinite',
            }}
          >
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = i * 30;
              // Radial spokes opacity gradient to mimic the fading trail
              const opacity = 0.15 + (i / 11) * 0.85;
              return (
                <line
                  key={i}
                  x1="60"
                  y1="16"
                  x2="60"
                  y2="34"
                  transform={`rotate(${angle} 60 60)`}
                  stroke="currentColor"
                  strokeWidth="9"
                  strokeLinecap="round"
                  style={{ opacity }}
                />
              );
            })}
          </svg>
        </div>

        {/* Loading Text */}
        {text && (
          <div className={`${isMobile ? 'text-[11px] text-white/35 font-normal' : 'text-[12.5px] text-white/50 font-medium'} tracking-wide`}>
            {text}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;
