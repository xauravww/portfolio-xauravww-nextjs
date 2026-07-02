'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useWindows } from '../../context/windowContext';

const Window = ({ id, title, children, defaultSize = { w: 700, h: 500 } }) => {
  const { windows, activeWindowId, closeWindow, minimizeWindow, toggleMaximize, focusWindow, updatePosition } = useWindows();
  const win = windows[id];
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [pos, setPos] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [appeared, setAppeared] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const prevPos = useRef(null);

  const isActive = activeWindowId === id;

  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    const ox = Math.floor(Math.random() * 80) - 40;
    const oy = Math.floor(Math.random() * 50) - 25;
    const initial = {
      x: Math.max(10, (window.innerWidth - defaultSize.w) / 2 + ox),
      y: Math.max(40, (window.innerHeight - defaultSize.h) / 2.5 + oy),
    };
    setPos(initial);
    prevPos.current = initial;
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [defaultSize.w, defaultSize.h]);

  // Scale-in open animation
  useEffect(() => {
    if (win?.isOpen && !win?.isMinimized) {
      setAppeared(false);
      const r = requestAnimationFrame(() => setAppeared(true));
      return () => cancelAnimationFrame(r);
    }
  }, [win?.isOpen, win?.isMinimized]);

  const onTitleMouseDown = useCallback((e) => {
    if (isMobile || win?.isMaximized) return;
    e.preventDefault();
    focusWindow(id);
    setIsDragging(true);
    dragOffset.current = { x: e.clientX - (pos?.x || 0), y: e.clientY - (pos?.y || 0) };
  }, [id, pos, focusWindow, isMobile, win?.isMaximized]);

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e) => {
      setPos({ x: e.clientX - dragOffset.current.x, y: Math.max(30, e.clientY - dragOffset.current.y) });
    };
    const onUp = () => { setIsDragging(false); if (pos) updatePosition(id, pos); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [isDragging, id, pos, updatePosition]);

  const handleMaxToggle = (e) => {
    e.stopPropagation();
    if (isMobile) return;
    if (!win?.isMaximized) prevPos.current = pos;
    else if (prevPos.current) setPos(prevPos.current);
    toggleMaximize(id);
  };

  if (!mounted || !pos || !win?.isOpen) return null;

  const isMax = win.isMaximized;
  const hidden = win.isMinimized;
  const style = isMobile
    ? { position: 'fixed', inset: 0, zIndex: win.zIndex }
    : isMax
      ? { position: 'fixed', left: 0, top: 28, right: 0, bottom: 64, zIndex: win.zIndex }
      : { position: 'fixed', left: pos.x, top: pos.y, width: defaultSize.w, height: defaultSize.h, zIndex: win.zIndex };

  // Traffic light: colored when active, grey when inactive (macOS behavior)
  const lightBase = 'w-[12px] h-[12px] rounded-full flex items-center justify-center transition-colors';
  const dim = !isActive && !isMobile;

  return (
    <div
      className={hidden ? 'pointer-events-none' : ''}
      style={{
        ...style,
        opacity: hidden ? 0 : appeared ? 1 : 0,
        transform: hidden ? 'scale(0.9) translateY(40px)' : appeared ? 'scale(1)' : 'scale(0.96)',
        transformOrigin: 'center bottom',
        transition: isDragging ? 'none' : 'opacity 200ms ease-out, transform 220ms cubic-bezier(0.2,0.9,0.3,1)',
      }}
      onMouseDown={() => focusWindow(id)}
    >
      <div
        className={`h-full flex flex-col overflow-hidden ${isMobile || isMax ? '' : 'rounded-[12px]'}`}
        style={{
          background: '#2a2a2c',
          boxShadow: isMobile ? 'none' : isActive
            ? '0 0 0 0.5px rgba(255,255,255,0.12), 0 22px 70px rgba(0,0,0,0.65), 0 8px 20px rgba(0,0,0,0.4)'
            : '0 0 0 0.5px rgba(255,255,255,0.06), 0 12px 40px rgba(0,0,0,0.45)',
        }}
      >
        {/* Title bar */}
        <div
          className={`flex items-center relative px-3 h-[30px] shrink-0 select-none ${!isMobile && !isMax ? 'cursor-grab active:cursor-grabbing' : ''}`}
          style={{ background: 'linear-gradient(180deg, #3a3a3c 0%, #303032 100%)' }}
          onMouseDown={!isMobile ? onTitleMouseDown : undefined}
          onDoubleClick={!isMobile ? handleMaxToggle : undefined}
        >
          {isMobile ? (
            <>
              <span className="text-[13px] text-white/70 font-semibold flex-1 text-center">{title}</span>
              <button onClick={() => closeWindow(id)} className="absolute right-2 text-white/50 hover:text-white/80 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-[8px] z-10 group/lights">
                <button onClick={(e) => { e.stopPropagation(); closeWindow(id); }}
                  className={`${lightBase} ${dim ? 'bg-[#4d4d4f]' : 'bg-[#FF5F57]'}`}>
                  <svg className="w-[7px] h-[7px] opacity-0 group-hover/lights:opacity-100 text-black/55" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2}><path d="M2.5 9.5L9.5 2.5M2.5 2.5l7 7"/></svg>
                </button>
                <button onClick={(e) => { e.stopPropagation(); minimizeWindow(id); }}
                  className={`${lightBase} ${dim ? 'bg-[#4d4d4f]' : 'bg-[#FEBC2E]'}`}>
                  <svg className="w-[7px] h-[7px] opacity-0 group-hover/lights:opacity-100 text-black/55" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2}><path d="M2.5 6h7"/></svg>
                </button>
                <button onClick={handleMaxToggle}
                  className={`${lightBase} ${dim ? 'bg-[#4d4d4f]' : 'bg-[#28C840]'}`}>
                  <svg className="w-[8px] h-[8px] opacity-0 group-hover/lights:opacity-100 text-black/55" viewBox="0 0 12 12" fill="currentColor"><path d="M3.5 2.5L2.5 3.5v3l3.5-4zM8.5 9.5l1-1v-3l-3.5 4z"/></svg>
                </button>
              </div>
              <span className="text-[13px] text-white/55 font-semibold absolute left-1/2 -translate-x-1/2 pointer-events-none tracking-tight">{title}</span>
            </>
          )}
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar" style={{ background: '#2a2a2c' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Window;
