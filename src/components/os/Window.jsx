'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useWindows } from '../../context/windowContext';

const Window = ({ id, title, children, defaultSize = { w: 700, h: 500 } }) => {
  const { windows, closeWindow, minimizeWindow, toggleMaximize, focusWindow, updatePosition } = useWindows();
  const win = windows[id];
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [pos, setPos] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const prevPos = useRef(null);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    const ox = Math.floor(Math.random() * 80) - 40;
    const oy = Math.floor(Math.random() * 50) - 25;
    const initial = {
      x: Math.max(10, (window.innerWidth - defaultSize.w) / 2 + ox),
      y: Math.max(35, (window.innerHeight - defaultSize.h) / 2.5 + oy),
    };
    setPos(initial);
    prevPos.current = initial;
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [defaultSize.w, defaultSize.h]);

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
      const newPos = {
        x: e.clientX - dragOffset.current.x,
        y: Math.max(28, e.clientY - dragOffset.current.y),
      };
      setPos(newPos);
    };
    const onUp = () => {
      setIsDragging(false);
      if (pos) updatePosition(id, pos);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [isDragging, id, pos, updatePosition]);

  const handleMaxToggle = (e) => {
    e.stopPropagation();
    if (isMobile) return;
    if (!win?.isMaximized) {
      prevPos.current = pos;
    } else if (prevPos.current) {
      setPos(prevPos.current);
    }
    toggleMaximize(id);
  };

  if (!mounted || !pos || !win?.isOpen) return null;

  const isMax = win.isMaximized;
  const style = isMobile
    ? { position: 'fixed', inset: 0, zIndex: win.zIndex }
    : isMax
      ? { position: 'fixed', left: 0, top: 28, right: 0, bottom: 68, zIndex: win.zIndex }
      : { position: 'fixed', left: pos.x, top: pos.y, width: defaultSize.w, height: defaultSize.h, zIndex: win.zIndex };

  return (
    <div
      className={`${win.isMinimized ? 'scale-[0.85] opacity-0 pointer-events-none' : 'scale-100 opacity-100'} ${isDragging ? '' : 'transition-all duration-[250ms] ease-out'}`}
      style={style}
      onMouseDown={() => focusWindow(id)}
    >
      <div className={`h-full flex flex-col bg-[#232326] backdrop-blur-2xl border border-white/[0.08] shadow-2xl shadow-black/60 overflow-hidden ${isMobile || isMax ? '' : 'rounded-[10px]'}`}>
        {/* Title bar */}
        <div
          className={`flex items-center relative px-3.5 h-[38px] bg-[#2c2c2e] border-b border-white/[0.04] shrink-0 select-none ${!isMobile && !isMax ? 'cursor-grab active:cursor-grabbing' : ''}`}
          onMouseDown={!isMobile ? onTitleMouseDown : undefined}
          onDoubleClick={!isMobile ? handleMaxToggle : undefined}
        >
          {isMobile ? (
            <>
              <span className="text-[12px] text-white/50 font-medium flex-1 text-center">{title}</span>
              <button onClick={() => closeWindow(id)} className="absolute right-3 text-white/40 hover:text-white/70 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-[6px] z-10">
                <button onClick={(e) => { e.stopPropagation(); closeWindow(id); }}
                  className="w-[12px] h-[12px] rounded-full bg-[#FF5F57] hover:bg-[#ff4136] transition-colors group flex items-center justify-center">
                  <svg className="w-[6px] h-[6px] opacity-0 group-hover:opacity-100 text-black/50" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2}><path d="M2 10L10 2M2 2l8 8"/></svg>
                </button>
                <button onClick={(e) => { e.stopPropagation(); minimizeWindow(id); }}
                  className="w-[12px] h-[12px] rounded-full bg-[#FEBC2E] hover:bg-[#f5a623] transition-colors group flex items-center justify-center">
                  <svg className="w-[6px] h-[6px] opacity-0 group-hover:opacity-100 text-black/50" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2}><path d="M1 6h10"/></svg>
                </button>
                <button onClick={handleMaxToggle}
                  className="w-[12px] h-[12px] rounded-full bg-[#28C840] hover:bg-[#1fb834] transition-colors group flex items-center justify-center">
                  <svg className="w-[6px] h-[6px] opacity-0 group-hover:opacity-100 text-black/50" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M2 4V2h2M10 4V2H8M2 8v2h2M10 8v2H8"/></svg>
                </button>
              </div>
              <span className="text-[12px] text-white/40 font-medium absolute left-1/2 -translate-x-1/2 pointer-events-none">{title}</span>
            </>
          )}
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-[#1e1e20]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Window;
