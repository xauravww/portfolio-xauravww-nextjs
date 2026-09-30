'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useWindows } from '../../context/windowContext';
import AppIcon from './AppIcon';

/* ── Dock contents ─────────────────────────────────────────────────────────
   Socials are permanent. App icons appear ONLY while their window is open
   (active or minimized) — like real macOS running-app indicators — and
   clicking them focuses / un-minimizes the window. */
const DOCK_SOCIALS = [
  { id: 'github', name: 'GitHub', url: process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/xauravww' },
  { id: 'linkedin', name: 'LinkedIn', url: process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://linkedin.com/in/itsmesaurav' },
  { id: 'x', name: 'X', url: process.env.NEXT_PUBLIC_X_URL || 'https://x.com/xauravww' },
];

const APP_NAMES = {
  about: 'About', techstack: 'Skills', projects: 'Projects', experience: 'Experience',
  blogs: 'Blogs', education: 'Education', contact: 'Mail', safari: 'Safari',
  resume: 'Resume', music: 'Music', folderGames: 'Games', game2048: '2048',
  snake: 'Snake', tictactoe: 'TicTacToe', breakout: 'Breakout',
};

// Fisheye tuning (real macOS values)
const BASE = 48;        // px icon size at rest
const MAX_SCALE = 1.9;  // hovered icon peak
const RANGE = 150;      // px reach of the magnification field
const SPREAD = 72;      // px sigma of the Gaussian falloff

// Exact Mac physics: fast attack, soft settle, zero overshoot
const CURVE = 'cubic-bezier(0.25, 0.46, 0.2, 1)';
const CURVE_MS = 150;

const Dock = ({ onItemContextMenu }) => {
  const { windows, focusWindow, getOpenWindows } = useWindows();
  const [mouseX, setMouseX] = useState(null);
  const [bouncing, setBouncing] = useState(null);   // app id mid-launch-bounce
  const [isMobile, setIsMobile] = useState(false);
  const itemRefs = useRef({});
  const [centers, setCenters] = useState({});        // deterministic per-item center X
  const seenOpen = useRef({});                       // for bounce-on-appear

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Running apps = windows that are open (active OR minimized), in launch order
  const runningApps = Object.entries(windows)
    .filter(([, w]) => w.isOpen)
    .sort((a, b) => (a[1].zIndex || 0) - (b[1].zIndex || 0))
    .map(([id]) => id);
  const runningKey = runningApps.join(',');

  // Bounce the dock icon whenever an app transitions closed → open
  useEffect(() => {
    runningApps.forEach((id) => {
      if (!seenOpen.current[id]) {
        seenOpen.current[id] = true;
        setBouncing(id);
        setTimeout(() => setBouncing((cur) => (cur === id ? null : cur)), 900);
      }
    });
    // forget closed apps so re-launching bounces again
    Object.keys(seenOpen.current).forEach((id) => {
      if (!windows[id]?.isOpen) delete seenOpen.current[id];
    });
  }, [runningKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Measure each icon's resting center (and re-measure when dock contents
  // change). offsetLeft is layout-based and unaffected by transforms, so
  // scale changes never feed back into the fisheye math — no jitter.
  const measure = useCallback(() => {
    const next = {};
    Object.entries(itemRefs.current).forEach(([id, el]) => {
      if (el) next[id] = el.offsetLeft + el.offsetWidth / 2;
    });
    setCenters(next);
  }, []);

  useEffect(() => {
    measure();
  }, [runningKey, measure]);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMouseX(e.clientX - rect.left);
  };

  const handleMouseLeave = () => setMouseX(null);

  const scaleForCenter = (center) => {
    if (mouseX === null || center === undefined) return 1;
    const d = Math.abs(mouseX - center);
    if (d > RANGE) return 1;
    return 1 + (MAX_SCALE - 1) * Math.exp(-(d * d) / (2 * SPREAD * SPREAD));
  };

  const handleSocialClick = (item) => {
    window.open(item.url, '_blank');
  };

  const openList = getOpenWindows();
  const hasOpenWindow = openList.length > 0;

  // On mobile: hide dock if there is any open app window (like an active fullscreen app)
  if (isMobile && hasOpenWindow) {
    return null;
  }

  if (isMobile) {
    // Running apps can't appear here (the dock hides while apps are open on mobile),
    // so the iOS pill shows the permanent socials only.
    return (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[140] w-[70%] max-w-[240px]">
        <div className="flex justify-around items-center px-3 py-2.5 rounded-[28px] border border-white/10 bg-[#ffffff18] backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          {DOCK_SOCIALS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSocialClick(item)}
              className="outline-none active:scale-95 transition-transform"
              aria-label={`Open ${item.name}`}
            >
              <div className="w-[46px] h-[46px]">
                <AppIcon appId={item.id} className="w-full h-full" />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const renderItem = (id, onClick, hasDot) => {
    const scale = scaleForCenter(centers[id]);
    const hovered = mouseX !== null && Math.abs(mouseX - (centers[id] ?? Infinity)) < BASE / 2;
    return (
      <div
        key={id}
        ref={(el) => { itemRefs.current[id] = el; }}
        className="relative flex flex-col items-center justify-end"
        style={{ zIndex: scale > 1.001 ? Math.round(scale * 100) : 'auto' }}
      >
        {/* Tooltip rides above the magnified icon */}
        {hovered && (
          <div
            className="absolute -top-11 px-2.5 py-1 rounded-md bg-[#2c2c2e]/95 border border-white/10 text-white text-[11px] font-medium whitespace-nowrap shadow-lg pointer-events-none z-[200]"
            style={{ left: '50%', transform: `translateX(-50%) translateY(${-(scale - 1) * BASE}px)` }}
          >
            {APP_NAMES[id] || id}
            <span className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 rotate-45 bg-[#2c2c2e]/95 border-r border-b border-white/10" />
          </div>
        )}
        <button
          onClick={onClick}
          onContextMenu={(e) => { e.preventDefault(); onItemContextMenu?.(id); }}
          className="outline-none cursor-pointer"
          style={{
            width: BASE,
            height: BASE,
            transform: `scale(${scale})`,
            transformOrigin: 'bottom center',
            transition: mouseX === null ? `transform 220ms ${CURVE}` : `transform ${CURVE_MS}ms ${CURVE}`,
          }}
          aria-label={`Open ${APP_NAMES[id] || id}`}
        >
          <div
            className="w-full h-full"
            style={bouncing === id ? { animation: 'dock-launch-bounce 0.9s cubic-bezier(0.36, 0, 0.66, -0.56) 1' } : undefined}
          >
            <AppIcon appId={id} className="w-full h-full" />
          </div>
          {hasDot && <span className="dock-run-dot" />}
        </button>
      </div>
    );
  };

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-[140]">
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="flex items-end gap-2 px-2 py-1.5 rounded-[22px] border border-white/20 bg-white/[0.14] backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.25)]"
      >
        {runningApps.map((id) => renderItem(id, () => focusWindow(id), true))}
        {runningApps.length > 0 && <span className="w-px h-10 self-center bg-white/15 mx-0.5 shrink-0" />}
        {DOCK_SOCIALS.map((item) => renderItem(item.id, () => handleSocialClick(item), false))}
      </div>
    </div>
  );
};

export default Dock;
