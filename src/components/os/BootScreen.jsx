'use client';
import { useState, useEffect, useRef } from 'react';

const BootScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('logo');
  const done = useRef(false);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('loading'), 500);

    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + Math.random() * 18 + 4;
      });
    }, 70);

    const t2 = setTimeout(() => {
      setPhase('done');
      setTimeout(() => {
        if (!done.current) { done.current = true; onComplete(); }
      }, 400);
    }, 2000);

    return () => { clearTimeout(t1); clearTimeout(t2); clearInterval(interval); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center transition-opacity duration-500 ${phase === 'done' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className={`transition-all duration-600 ${phase === 'logo' ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
        <span className="text-gold font-display text-5xl md:text-6xl font-bold tracking-tight">SM</span>
      </div>
      <div className={`mt-8 w-48 h-[2px] bg-white/10 rounded-full overflow-hidden transition-opacity duration-300 ${phase !== 'logo' ? 'opacity-100' : 'opacity-0'}`}>
        <div className="h-full bg-gold/70 rounded-full transition-all duration-100 ease-out" style={{ width: `${Math.min(progress, 100)}%` }} />
      </div>
    </div>
  );
};

export default BootScreen;
