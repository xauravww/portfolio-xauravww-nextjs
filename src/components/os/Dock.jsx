'use client';
import { useState, useEffect } from 'react';
import { useWindows } from '../../context/windowContext';
import AppIcon from './AppIcon';

const SOCIAL_ITEMS = [
  { id: 'github', name: 'GitHub', url: process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/xauravww' },
  { id: 'linkedin', name: 'LinkedIn', url: process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://linkedin.com/in/itsmesaurav' },
  { id: 'x', name: 'X', url: process.env.NEXT_PUBLIC_X_URL || 'https://x.com/xauravww' },
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

const Dock = ({ onItemContextMenu }) => {
  const { openBrowser, getOpenWindows } = useWindows();
  const [hovered, setHovered] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleSocialClick = (item) => {
    openBrowser({ url: item.url, title: `${item.name} — xauravww`, mode: 'web' }, { size: { w: 900, h: 600 } });
  };

  const openList = getOpenWindows();
  const hasOpenWindow = openList.length > 0;

  // On mobile: hide dock if there is any open app window (like an active fullscreen app)
  if (isMobile && hasOpenWindow) {
    return null;
  }

  if (isMobile) {
    return (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[140] w-[90%] max-w-[280px]">
        {/* iOS-styled Dock */}
        <div
          className="flex justify-around items-center px-4 py-3 rounded-[28px] border border-white/10 bg-[#ffffff18] backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
        >
          {SOCIAL_ITEMS.map((item) => (
            <div key={item.id} className="flex flex-col items-center justify-end shrink-0">
              <button
                onClick={() => handleSocialClick(item)}
                className="outline-none active:scale-95 transition-transform"
                aria-label={`Open ${item.name}`}
              >
                <div className="w-[50px] h-[50px]">
                  <AppIcon appId={item.id} className="w-full h-full" />
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-1.5 md:bottom-2 left-1/2 -translate-x-1/2 z-[140]">
      <div
        className="flex items-end gap-1.5 px-2 py-1.5 rounded-[20px] border border-white/20 bg-white/[0.14] backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.25)]"
      >
        {SOCIAL_ITEMS.map((item, i) => {
          const dist = hovered === null ? null : i - hovered;
          const scale = scaleFor(dist);
          const lift = liftFor(dist);

          return (
            <div
              key={item.id}
              className="relative flex flex-col items-center justify-end"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Tooltip */}
              {hovered === i && (
                <div className="absolute -top-12 px-2.5 py-1 rounded-md bg-[#2c2c2e]/95 border border-white/10 text-white text-[11px] font-medium whitespace-nowrap shadow-lg pointer-events-none z-[200]">
                  {item.name}
                  <span className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 rotate-45 bg-[#2c2c2e]/95 border-r border-b border-white/10" />
                </div>
              )}
              <button
                onClick={() => handleSocialClick(item)}
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dock;
