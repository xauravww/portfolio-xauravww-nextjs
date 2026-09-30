'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Minus, Plus, CaretLeft } from '@phosphor-icons/react';
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
    ? { position: 'fixed', left: 0, right: 0, top: 28, bottom: 0, zIndex: win.zIndex }
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
        transform: isMobile
          ? (hidden ? 'translateY(100%)' : appeared ? 'translateY(0)' : 'translateY(100%)')
          : (hidden ? 'scale(0.9) translateY(40px)' : appeared ? 'scale(1)' : 'scale(0.96)'),
        transformOrigin: 'center bottom',
        transition: isDragging ? 'none' : 'opacity 200ms ease-out, transform 300ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      onMouseDown={() => focusWindow(id)}
    >
      <div
        className={`h-full flex flex-col overflow-hidden ${isMobile || isMax ? '' : 'rounded-[12px]'}`}
        style={{
          // macOS frosted glass: semi-transparent dark canvas over the wallpaper
          background: 'rgba(30, 30, 30, 0.65)',
          backdropFilter: 'blur(25px) saturate(160%)',
          WebkitBackdropFilter: 'blur(25px) saturate(160%)',
          // Crisp 1px edge where light catches the glass
          border: isMobile ? 'none' : '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: isMobile ? 'none' : isActive
            ? '0 0 1px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.15), 0 20px 40px rgba(0,0,0,0.3)'
            : '0 0 1px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.15), 0 20px 40px rgba(0,0,0,0.3)',
        }}
      >
        {/* Title bar — same material as the content, seamlessly integrated */}
        <div
          className={`flex items-center relative select-none ${
            isMobile ? 'h-[44px] bg-white/[0.04] border-b border-white/[0.07]' : 'px-3 h-[30px] cursor-grab active:cursor-grabbing'
          }`}
          onMouseDown={!isMobile ? onTitleMouseDown : undefined}
          onDoubleClick={!isMobile ? handleMaxToggle : undefined}
        >
          {isMobile ? (
            <div className="w-full flex items-center justify-between px-3 h-[44px]">
              {/* Left: Home Button */}
              <button
                onClick={() => closeWindow(id)}
                className="flex items-center gap-1 text-[#0A84FF] text-[15px] font-normal active:opacity-60 transition-opacity"
              >
                <CaretLeft size={20} weight="bold" className="-ml-1.5" />
                <span>Home</span>
              </button>

              {/* Center: Title */}
              <span className="absolute left-1/2 -translate-x-1/2 text-[16px] text-white font-semibold tracking-tight">
                {title}
              </span>

              {/* Right: Dummy spacer for symmetry */}
              <div className="w-12" />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-[8px] z-10 group/lights">
                <button onClick={(e) => { e.stopPropagation(); closeWindow(id); }}
                  className={`${lightBase} ${dim ? 'bg-[#4d4d4f]' : 'bg-[#FF5F57]'}`}>
                  <X size={8} weight="bold" className="opacity-0 group-hover/lights:opacity-100 text-black/55" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); minimizeWindow(id); }}
                  className={`${lightBase} ${dim ? 'bg-[#4d4d4f]' : 'bg-[#FEBC2E]'}`}>
                  <Minus size={8} weight="bold" className="opacity-0 group-hover/lights:opacity-100 text-black/55" />
                </button>
                <button onClick={handleMaxToggle}
                  className={`${lightBase} ${dim ? 'bg-[#4d4d4f]' : 'bg-[#28C840]'}`}>
                  <Plus size={8} weight="bold" className="opacity-0 group-hover/lights:opacity-100 text-black/55" />
                </button>
              </div>
              <span className="text-[13px] text-white/55 font-semibold absolute left-1/2 -translate-x-1/2 pointer-events-none tracking-tight">{title}</span>
            </>
          )}
        </div>
        {/* Content — transparent so the window's vibrancy shows through */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {children}
        </div>
        {/* iOS Home Indicator */}
        {isMobile && (
          <div
            onClick={() => closeWindow(id)}
            className="h-[34px] flex items-end justify-center pb-2 shrink-0 select-none cursor-pointer"
          >
            <div className="w-[134px] h-[5px] bg-white/25 rounded-full hover:bg-white/40 active:bg-white/50 transition-colors" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Window;
