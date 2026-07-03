'use client';
import { useState } from 'react';
import { useWindows } from '../../context/windowContext';
import AppIcon from './AppIcon';

const DOCK_ITEMS = [
  { id: 'about', name: 'About' },
  { id: 'techstack', name: 'Skills' },
  { id: 'projects', name: 'Projects' },
  { id: 'experience', name: 'Work' },
  { id: 'blogs', name: 'Blogs' },
  { id: 'education', name: 'Edu' },
  { id: 'contact', name: 'Mail' },
];

// Magnification curve — distance in items from hovered
const scaleFor = (dist) => {
  if (dist === null) return 1;
  const a = Math.abs(dist);
  if (a === 0) return 1.5;
  if (a === 1) return 1.28;
  if (a === 2) return 1.1;
  return 1;
};
const liftFor = (dist) => {
  if (dist === null) return 0;
  const a = Math.abs(dist);
  if (a === 0) return -16;
  if (a === 1) return -9;
  if (a === 2) return -3;
  return 0;
};

const Dock = ({ defaultSizes, onItemContextMenu }) => {
  const { windows, openWindow, focusWindow } = useWindows();
  const [hovered, setHovered] = useState(null);

  const handleClick = (item) => {
    const win = windows[item.id];
    if (win?.isOpen && !win?.isMinimized) focusWindow(item.id);
    else openWindow(item.id, defaultSizes?.[item.id] ? { size: defaultSizes[item.id] } : undefined);
  };

  return (
    <div className="fixed bottom-1.5 md:bottom-2 left-1/2 -translate-x-1/2 z-[140]">
      <div
        className="flex items-end gap-1.5 px-2 py-1.5 rounded-[20px] border border-white/20 bg-white/[0.14] backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.25)]"
        onMouseLeave={() => setHovered(null)}
      >
        {DOCK_ITEMS.map((item, i) => {
          const win = windows[item.id];
          const isOpen = win?.isOpen && !win?.isMinimized;
          const dist = hovered === null ? null : i - hovered;
          const scale = scaleFor(dist);
          const lift = liftFor(dist);
          return (
            <div key={item.id} className="relative flex flex-col items-center justify-end">
              {/* Tooltip */}
              {hovered === i && (
                <div className="absolute -top-9 px-2.5 py-1 rounded-md bg-[#2c2c2e]/95 border border-white/10 text-white text-[11px] font-medium whitespace-nowrap shadow-lg pointer-events-none">
                  {item.name}
                  <span className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 rotate-45 bg-[#2c2c2e]/95 border-r border-b border-white/10" />
                </div>
              )}
              <button
                onClick={() => handleClick(item)}
                onContextMenu={(e) => onItemContextMenu?.(e, item)}
                onMouseEnter={() => setHovered(i)}
                className="outline-none origin-bottom"
                style={{
                  transform: `scale(${scale}) translateY(${lift}px)`,
                  transition: 'transform 180ms cubic-bezier(0.25,0.8,0.25,1)',
                }}
                aria-label={`Open ${item.name}`}
              >
                <div className="w-[44px] h-[44px] md:w-[48px] md:h-[48px]">
                  <AppIcon appId={item.id} className="w-full h-full" />
                </div>
              </button>
              {/* Running dot */}
              <span className={`mt-0.5 w-[3px] h-[3px] rounded-full transition-opacity duration-200 ${isOpen ? 'bg-white/70 opacity-100' : 'opacity-0'}`} />
            </div>
          );
        })}

        {/* Separator */}
        <div className="self-stretch my-1.5 w-px bg-white/20 mx-0.5" />

        {/* GitHub launcher (Finder/Trash zone equivalent) */}
        <div className="relative flex flex-col items-center justify-end">
          {hovered === 'gh' && (
            <div className="absolute -top-9 px-2.5 py-1 rounded-md bg-[#2c2c2e]/95 border border-white/10 text-white text-[11px] font-medium whitespace-nowrap shadow-lg pointer-events-none">
              GitHub
              <span className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 rotate-45 bg-[#2c2c2e]/95 border-r border-b border-white/10" />
            </div>
          )}
          <button
            onClick={() => window.open('https://github.com/xauravww', '_blank')}
            onMouseEnter={() => setHovered('gh')}
            className="outline-none origin-bottom"
            style={{ transform: `scale(${hovered === 'gh' ? 1.5 : 1}) translateY(${hovered === 'gh' ? -16 : 0}px)`, transition: 'transform 180ms cubic-bezier(0.25,0.8,0.25,1)' }}
            aria-label="GitHub"
          >
            <div className="w-[44px] h-[44px] md:w-[48px] md:h-[48px] rounded-[22%] bg-[#1a1a1a] flex items-center justify-center shadow-[0_1px_1px_rgba(0,0,0,0.25),0_4px_10px_rgba(0,0,0,0.3)]" style={{ borderRadius: '22%' }}>
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.6 0-12 5.4-12 12 0 5.3 3.4 9.8 8.2 11.4.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2 1-.3 2-.4 3-.4s2 .1 3 .4c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.8-1.6 8.2-6.1 8.2-11.4 0-6.6-5.4-12-12-12z"/></svg>
            </div>
          </button>
          <span className="mt-0.5 w-[3px] h-[3px] opacity-0" />
        </div>
      </div>
    </div>
  );
};

export default Dock;
