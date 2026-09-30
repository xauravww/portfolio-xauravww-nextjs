'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import {
  ArrowRight, Info, Copy, ArrowClockwise, SquaresFour, X,
  GithubLogo, Image as ImageIcon, HandPointing,
} from '@phosphor-icons/react';
import { WindowProvider, useWindows } from '../../context/windowContext';
import MenuBar from './MenuBar';
import Dock from './Dock';
import Window from './Window';
import BootScreen from './BootScreen';
import AppIcon from './AppIcon';
import ContextMenu from './ContextMenu';
import Wallpaper from './Wallpaper';
import AboutApp from './apps/AboutApp';
import TechStackApp from './apps/TechStackApp';
import ProjectsApp from './apps/ProjectsApp';
import ExperienceApp from './apps/ExperienceApp';
import BlogsApp from './apps/BlogsApp';
import EducationApp from './apps/EducationApp';
import ContactApp from './apps/ContactApp';
import SafariApp from './apps/SafariApp';
import ResumeApp from './apps/ResumeApp';
import MusicApp from './apps/MusicApp';
import GithubWidget from './GithubWidget';
import Game2048Widget from './Game2048Widget';
import SnakeWidget from './SnakeWidget';
import TicTacToeWidget from './TicTacToeWidget';
import BreakoutWidget from './BreakoutWidget';

const DESKTOP_ICONS = [
  { id: 'about', name: 'About Me' },
  { id: 'techstack', name: 'Skills' },
  { id: 'projects', name: 'Projects' },
  { id: 'experience', name: 'Experience' },
  { id: 'blogs', name: 'Blogs' },
  { id: 'education', name: 'Education' },
  { id: 'contact', name: 'Contact' },
  { id: 'resume', name: 'Resume' },
  { id: 'music', name: 'Music' },
  { id: 'folderGames', name: 'Games' },
];

/* ── One-time workspace hint (macOS notification style) ──────────────────
   Shows once per browser until the user switches workspaces (or dismisses
   it). Re-triggerable from the View menu via a custom window event. */
const WorkspaceHint = ({ onSwitch }) => {
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let hideTimer;
    const maybeShow = () => {
      let seen = false;
      try { seen = localStorage.getItem('workspace_hint_seen') === '1'; } catch (e) {}
      if (!seen) {
        const t = setTimeout(() => {
          setShow(true);
          hideTimer = setTimeout(() => setLeaving(true), 9000); // auto-leave
        }, 2500);
        return () => clearTimeout(t);
      }
    };
    const dismiss = () => {
      try { localStorage.setItem('workspace_hint_seen', '1'); } catch (e) {}
      setLeaving(true);
    };
    const reshow = () => {
      try { localStorage.removeItem('workspace_hint_seen'); } catch (e) {}
      setLeaving(false);
      setShow(true);
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => setLeaving(true), 9000);
    };
    const cleanup = maybeShow();
    window.addEventListener('workspace-hint-dismiss', dismiss);
    window.addEventListener('workspace-hint-reshow', reshow);
    return () => {
      if (cleanup) cleanup();
      clearTimeout(hideTimer);
      window.removeEventListener('workspace-hint-dismiss', dismiss);
      window.removeEventListener('workspace-hint-reshow', reshow);
    };
  }, []);

  // Mark as seen the first time the user actually switches workspaces
  useEffect(() => {
    if (onSwitch == null) return;
    try { localStorage.setItem('workspace_hint_seen', '1'); } catch (e) {}
  }, [onSwitch]);

  if (!show) return null;

  return (
    <button
      onClick={() => { window.dispatchEvent(new Event('workspace-hint-accept')); window.dispatchEvent(new Event('workspace-hint-dismiss')); }}
      className="fixed top-9 right-3 z-[125] w-[300px] text-left rounded-[14px] border border-white/15 bg-[#2c2c2e]/80 backdrop-blur-xl shadow-[0_10px_36px_rgba(0,0,0,0.5)] p-3.5 pr-9 transition-all duration-300"
      style={{
        opacity: leaving ? 0 : 1,
        transform: leaving ? 'translateX(24px)' : 'translateX(0)',
        pointerEvents: leaving ? 'none' : 'auto',
      }}
      aria-label="Show hint for switching workspaces"
    >
      <span className="absolute top-3 right-3 text-white/30 hover:text-white/70 text-[13px] leading-none">✕</span>
      <div className="flex items-start gap-2.5">
        <span className="w-7 h-7 rounded-lg bg-gradient-to-b from-[#5AC8FA] to-[#0A84FF] flex items-center justify-center shrink-0 shadow-sm">
          <HandPointing size={15} weight="fill" color="white" />
        </span>
        <div className="min-w-0">
          <p className="text-[12px] font-semibold text-white/95 leading-tight">Multiple Desktops</p>
          <p className="text-[11.5px] text-white/60 leading-snug mt-0.5">
            Swipe with a trackpad or press <kbd className="px-1 py-px mx-0.5 rounded bg-white/10 border border-white/10 text-[10px] font-sans">Ctrl</kbd>
            +<kbd className="px-1 py-px mx-0.5 rounded bg-white/10 border border-white/10 text-[10px] font-sans">←</kbd>
            /<kbd className="px-1 py-px mx-0.5 rounded bg-white/10 border border-white/10 text-[10px] font-sans">→</kbd> to switch desktops.
          </p>
        </div>
      </div>
    </button>
  );
};

const WINDOW_SIZES = {
  about: { w: 500, h: 420 },
  techstack: { w: 720, h: 520 },
  projects: { w: 900, h: 580 },
  experience: { w: 780, h: 500 },
  blogs: { w: 840, h: 540 },
  education: { w: 780, h: 500 },
  contact: { w: 460, h: 560 },
  safari: { w: 900, h: 620 },
  resume: { w: 750, h: 850 },
  music: { w: 900, h: 650 },
  folderGames: { w: 600, h: 400 },
  game2048: { w: 500, h: 660 },
  snake: { w: 500, h: 600 },
  tictactoe: { w: 450, h: 550 },
  breakout: { w: 500, h: 600 },
};

const SVG = {
  open: <ArrowRight size={14} weight="bold" />,
  info: <Info size={14} weight="bold" />,
  copy: <Copy size={14} weight="bold" />,
  refresh: <ArrowClockwise size={14} weight="bold" />,
  grid: <SquaresFour size={14} weight="bold" />,
  close: <X size={14} weight="bold" />,
  github: <GithubLogo size={14} weight="bold" />,
  image: <ImageIcon size={14} weight="bold" />,
};

function DesktopSurface() {
  const { openWindow, windows, closeWindow, getOpenWindows } = useWindows();
  const [menu, setMenu] = useState(null);
  const [selected, setSelected] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [widgetTime, setWidgetTime] = useState('');
  const [widgetDate, setWidgetDate] = useState('');
  const [desktopWorkspace, setDesktopWorkspace] = useState(0);
  const [mobilePage, setMobilePage] = useState(0);

  // Icon dragging offsets (relative to initial static base positions in DOM)
  const [draggedId, setDraggedId] = useState(null);
  const [iconOffsets, setIconOffsets] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('desktop_icon_offsets');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch(e) {}
      }
    }
    return {
      about: { x: 0, y: 0 },
      techstack: { x: 0, y: 0 },
      projects: { x: 0, y: 0 },
      experience: { x: 0, y: 0 },
      blogs: { x: 0, y: 0 },
      education: { x: 0, y: 0 },
      contact: { x: 0, y: 0 },
      resume: { x: 0, y: 0 },
      folderGames: { x: 0, y: 0 },
      githubWidget: { x: 0, y: 0 },
    };
  });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialOffset, setInitialOffset] = useState({ x: 0, y: 0 });
  const [prevCleanOffset, setPrevCleanOffset] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setWidgetTime(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
      setWidgetDate(now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }));
    };
    update();
    const timer = setInterval(update, 30000);
    return () => clearInterval(timer);
  }, []);

  const openApp = useCallback((id) => openWindow(id, { size: WINDOW_SIZES[id] }), [openWindow]);

  const handleResetLayout = useCallback(() => {
    const reset = {
      about: { x: 0, y: 0 },
      techstack: { x: 0, y: 0 },
      projects: { x: 0, y: 0 },
      experience: { x: 0, y: 0 },
      blogs: { x: 0, y: 0 },
      education: { x: 0, y: 0 },
      contact: { x: 0, y: 0 },
      resume: { x: 0, y: 0 },
      music: { x: 0, y: 0 },
      folderGames: { x: 0, y: 0 },
      githubWidget: { x: 0, y: 0 },
    };
    setIconOffsets(reset);
    localStorage.setItem('desktop_icon_offsets', JSON.stringify(reset));
  }, []);

  useEffect(() => {
    window.addEventListener('reset-icon-layout', handleResetLayout);
    return () => window.removeEventListener('reset-icon-layout', handleResetLayout);
  }, [handleResetLayout]);

  useEffect(() => {
    if (!draggedId && typeof window !== 'undefined') {
      localStorage.setItem('desktop_icon_offsets', JSON.stringify(iconOffsets));
    }
  }, [iconOffsets, draggedId]);

  const desktopMenu = (e) => {
    e.preventDefault();
    if (isMobile) return;
    const anyOpen = getOpenWindows().length > 0;
    setMenu({
      x: e.clientX, y: e.clientY,
      items: [
        { label: 'Open All Apps', icon: SVG.grid, action: () => DESKTOP_ICONS.forEach((it, i) => setTimeout(() => openApp(it.id), i * 90)) },
        { label: 'Close All Windows', icon: SVG.close, disabled: !anyOpen, action: () => getOpenWindows().forEach(([id]) => closeWindow(id)) },
        { divider: true },
        { label: 'Change Desktop Background', icon: SVG.image, action: () => window.dispatchEvent(new Event('change-wallpaper')) },
        { label: 'Reset Icon Layout', icon: SVG.grid, action: handleResetLayout },
        { label: 'View on GitHub', icon: SVG.github, action: () => window.open('https://github.com/xauravww', '_blank') },
        { divider: true },
        { label: 'Switch to Workspace 1', icon: SVG.grid, action: () => setDesktopWorkspace(0) },
        { label: 'Switch to Workspace 2', icon: SVG.grid, action: () => setDesktopWorkspace(1) },
        { label: 'Refresh', icon: SVG.refresh, shortcut: '⌘R', action: () => window.location.reload() },
      ],
    });
  };

  const iconMenu = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    if (isMobile) return;
    const isOpen = windows[item.id]?.isOpen && !windows[item.id]?.isMinimized;
    setMenu({
      x: e.clientX, y: e.clientY,
      items: [
        { label: `Open ${item.name}`, icon: SVG.open, action: () => openApp(item.id) },
        { label: isOpen ? 'Close Window' : 'Close', icon: SVG.close, disabled: !isOpen, action: () => closeWindow(item.id) },
        { divider: true },
        { label: 'Get Info', icon: SVG.info, action: () => openApp(item.id) },
      ],
    });
  };

  // Dragging event callbacks
  const handleDragStart = useCallback((id, e) => {
    if (isMobile) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    setDraggedId(id);
    setDragStart({ x: clientX, y: clientY });
    
    const currentOffset = iconOffsets[id] || { x: 0, y: 0 };
    setInitialOffset(currentOffset);
    setPrevCleanOffset(currentOffset);

    setHasMoved(false);
    setSelected(id);
  }, [iconOffsets, isMobile]);

  const handleDragMove = useCallback((clientX, clientY) => {
    if (!draggedId) return;

    const dx = clientX - dragStart.x;
    const dy = clientY - dragStart.y;

    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      setHasMoved(true);
    }

    setIconOffsets(prev => ({
      ...prev,
      [draggedId]: {
        x: initialOffset.x + dx,
        y: initialOffset.y + dy
      }
    }));
  }, [draggedId, dragStart, initialOffset]);

  const handleDragEnd = useCallback(() => {
    if (!draggedId) return;

    const currentOffset = iconOffsets[draggedId] || { x: 0, y: 0 };
    const draggedIdx = DESKTOP_ICONS.findIndex(it => it.id === draggedId);

    let collides = false;

    if (draggedId === 'githubWidget') {
      const widgetLeft = 40 + currentOffset.x;
      const widgetTop = 40 + currentOffset.y;
      const widgetWidth = isMobile ? 320 : 640; 
      const widgetHeight = isMobile ? 220 : 180;

      collides = DESKTOP_ICONS.some((other, otherIdx) => {
        if (otherIdx >= 4 && isMobile) return false; // Widget is only on page 0
        if (otherIdx >= 4 && !isMobile) return false; // Widget is only on workspace 0

        const otherOffset = iconOffsets[other.id] || { x: 0, y: 0 };
        if (isMobile) {
          const initialColOther = otherIdx % 4;
          const initialRowOther = 0; // All on row 0 for first 4
          const leftOther = initialColOther * 80 + otherOffset.x + 24; 
          const topOther = initialRowOther * 92 + otherOffset.y + 240; 
          return widgetLeft < leftOther + 72 && widgetLeft + widgetWidth > leftOther && widgetTop < topOther + 80 && widgetTop + widgetHeight > topOther;
        } else {
          const initialColOther = Math.floor(otherIdx / 6);
          const initialRowOther = otherIdx % 6;
          const rightOther = initialColOther * 84 - otherOffset.x + 12; 
          const topOther = initialRowOther * 80 + otherOffset.y + 40; 
          const leftOther = window.innerWidth - rightOther - 76;
          return widgetLeft < leftOther + 76 && widgetLeft + widgetWidth > leftOther && widgetTop < topOther + 80 && widgetTop + widgetHeight > topOther;
        }
      });
    } else {
      // It's an icon
      const widgetOffset = iconOffsets['githubWidget'] || { x: 0, y: 0 };
      const widgetLeft = 40 + widgetOffset.x;
      const widgetTop = 40 + widgetOffset.y;
      const widgetWidth = isMobile ? 320 : 640;
      const widgetHeight = isMobile ? 220 : 180;

      // Check collision with other icons
      collides = DESKTOP_ICONS.some((other, otherIdx) => {
        if (other.id === draggedId) return false;
        // If they are on different pages, they can't collide
        if (isMobile && ((draggedIdx < 4 && otherIdx >= 4) || (draggedIdx >= 4 && otherIdx < 4))) return false;
        if (!isMobile && ((draggedIdx < 4 && otherIdx >= 4) || (draggedIdx >= 4 && otherIdx < 4))) return false;

        const otherOffset = iconOffsets[other.id] || { x: 0, y: 0 };
        if (isMobile) {
          const localDraggedIdx = draggedIdx < 4 ? draggedIdx : draggedIdx - 4;
          const localOtherIdx = otherIdx < 4 ? otherIdx : otherIdx - 4;

          const initialColDragged = localDraggedIdx % 4;
          const initialRowDragged = Math.floor(localDraggedIdx / 4);
          const leftDragged = initialColDragged * 80 + currentOffset.x;
          const topDragged = initialRowDragged * 92 + currentOffset.y;

          const initialColOther = localOtherIdx % 4;
          const initialRowOther = Math.floor(localOtherIdx / 4);
          const leftOther = initialColOther * 80 + otherOffset.x;
          const topOther = initialRowOther * 92 + otherOffset.y;
          return Math.abs(leftDragged - leftOther) < 68 && Math.abs(topDragged - topOther) < 76;
        } else {
          const localDraggedIdx = draggedIdx < 4 ? draggedIdx : draggedIdx - 4;
          const localOtherIdx = otherIdx < 4 ? otherIdx : otherIdx - 4;

          const initialColDragged = Math.floor(localDraggedIdx / 6);
          const initialRowDragged = localDraggedIdx % 6;
          const rightDragged = initialColDragged * 84 - currentOffset.x;
          const topDragged = initialRowDragged * 80 + currentOffset.y;

          const initialColOther = Math.floor(localOtherIdx / 6);
          const initialRowOther = localOtherIdx % 6;
          const rightOther = initialColOther * 84 - otherOffset.x;
          const topOther = initialRowOther * 80 + otherOffset.y;
          return Math.abs(rightDragged - rightOther) < 70 && Math.abs(topDragged - topOther) < 70;
        }
      });

      // Also check collision with widget (if on desktop)
      if (!collides && !isMobile && draggedIdx < 4) { // Only icons on workspace 0 can collide with widget
        const localDraggedIdx = draggedIdx;
        const initialColDragged = Math.floor(localDraggedIdx / 6);
        const initialRowDragged = localDraggedIdx % 6;
        const rightDragged = initialColDragged * 84 - currentOffset.x + 12;
        const topDragged = initialRowDragged * 80 + currentOffset.y + 40;
        const leftDragged = window.innerWidth - rightDragged - 76;
        
        if (leftDragged < widgetLeft + widgetWidth && leftDragged + 76 > widgetLeft && topDragged < widgetTop + widgetHeight && topDragged + 80 > widgetTop) {
          collides = true;
        }
      }
    }

    if (collides) {
      // Collision detected! Snap back to previous clean position
      setIconOffsets(prev => ({
        ...prev,
        [draggedId]: prevCleanOffset
      }));
    } else {
      // No collision! Keep free-form coordinates exactly where dropped
    }

    setDraggedId(null);
  }, [draggedId, iconOffsets, prevCleanOffset, isMobile]);

  // Bind move/end events globally
  useEffect(() => {
    if (!draggedId) return;

    const handleMove = (e) => {
      if (e.cancelable) e.preventDefault();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      handleDragMove(clientX, clientY);
    };

    const handleEnd = () => {
      handleDragEnd();
    };
    window.addEventListener('mousemove', handleMove, { passive: false });
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchmove', handleEnd);
    };
  }, [draggedId, handleDragMove, handleDragEnd]);

  // ── macOS Spaces: workspace carousel engine ────────────────────────────
  const WORKSPACE_COUNT = 2;
  const surfaceRef = useRef(null);
  const wheelAccum = useRef(0);
  const wheelTimer = useRef(null);
  const swipeCooldown = useRef(false);
  const [swipeX, setSwipeX] = useState(null); // null = idle, number = live drag preview (px)

  const goToWorkspace = useCallback((i) => {
    setDesktopWorkspace(Math.max(0, Math.min(WORKSPACE_COUNT - 1, i)));
  }, []);

  // MenuBar's 'Desktops' menu asks us to switch (sibling-component bridge)
  useEffect(() => {
    const onSwitch = (e) => goToWorkspace(Number(e.detail));
    window.addEventListener('switch-workspace', onSwitch);
    return () => window.removeEventListener('switch-workspace', onSwitch);
  }, [goToWorkspace]);

  // Broadcast workspace changes so MenuBar can show a live checkmark
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('workspace-changed', { detail: desktopWorkspace }));
  }, [desktopWorkspace]);

  // Hint toast "try it" click: play a short swipe demo to Desktop 2 and back
  useEffect(() => {
    const accept = () => {
      goToWorkspace(1);
      setTimeout(() => goToWorkspace(0), 1400);
    };
    window.addEventListener('workspace-hint-accept', accept);
    return () => window.removeEventListener('workspace-hint-accept', accept);
  }, [goToWorkspace]);

  // Trackpad/mouse horizontal swipe: live rubber-band preview + threshold snap
  useEffect(() => {
    const el = surfaceRef.current;
    if (!el || isMobile) return;

    const finishSwipe = () => {
      wheelAccum.current = 0;
      setSwipeX(null);
    };

    const onWheel = (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; // vertical scroll untouched
      e.preventDefault();
      if (swipeCooldown.current) return;

      wheelAccum.current += e.deltaX;
      const vw = window.innerWidth;

      // Live preview of the slide (drag the strip with the fingers)
      const atStart = desktopWorkspace === 0;
      const atEnd = desktopWorkspace === WORKSPACE_COUNT - 1;
      let preview = wheelAccum.current * 0.45;
      if ((atStart && preview > 0) || (atEnd && preview < 0)) preview *= 0.25; // edge rubber-band
      setSwipeX(Math.max(-vw * 0.28, Math.min(vw * 0.28, preview)));

      // Threshold crossed → commit the switch (like releasing a 30%-width swipe)
      if (wheelAccum.current < -100) {
        if (!atEnd) { swipeCooldown.current = true; goToWorkspace(desktopWorkspace + 1); }
        finishSwipe();
        setTimeout(() => { swipeCooldown.current = false; }, 420);
      } else if (wheelAccum.current > 100) {
        if (!atStart) { swipeCooldown.current = true; goToWorkspace(desktopWorkspace - 1); }
        finishSwipe();
        setTimeout(() => { swipeCooldown.current = false; }, 420);
      }

      // Released before threshold → bounce back to current workspace
      clearTimeout(wheelTimer.current);
      wheelTimer.current = setTimeout(finishSwipe, 140);
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
      clearTimeout(wheelTimer.current);
    };
  }, [desktopWorkspace, isMobile, goToWorkspace]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isMobile) {
        if (e.ctrlKey && e.key === 'ArrowRight') goToWorkspace(desktopWorkspace + 1);
        if (e.ctrlKey && e.key === 'ArrowLeft') goToWorkspace(desktopWorkspace - 1);
        // Ctrl + [number] → jump straight to that workspace
        if (e.ctrlKey && (e.key === '1' || e.key === '2')) goToWorkspace(Number(e.key) - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobile, desktopWorkspace, goToWorkspace]);

  const openList = getOpenWindows();
  const hasOpenWindow = openList.length > 0;

  return (
    <div className="os-ui">
      <Wallpaper />
      <MenuBar />

      {/* Desktop surface */}
      <div
        ref={surfaceRef}
        className="fixed inset-0 pt-7 pb-[64px] overflow-hidden"
        onContextMenu={desktopMenu}
        onMouseDown={(e) => { if (e.target === e.currentTarget) setSelected(null); }}
      >
        {/* Desktop Workspaces (Mac style) — 380ms glide, live swipe preview */}
        {!isMobile && (
          <div 
            className={`absolute inset-0 flex pointer-events-none ${swipeX === null ? 'transition-transform duration-[380ms] ease-[cubic-bezier(0.32,0.72,0,1)]' : ''}`}
            style={{ transform: `translateX(calc(-${desktopWorkspace * 100}vw + ${swipeX ?? 0}px))` }}
          >
            {/* Workspace 0 */}
            <div className="w-screen h-full relative flex-shrink-0">
              <div className="absolute top-10 right-3 bottom-20 left-10 pointer-events-none">
                {DESKTOP_ICONS.slice(0, 4).map((item, idx) => {
                  const offset = iconOffsets[item.id] || { x: 0, y: 0 };
                  const isDragged = draggedId === item.id;
                  const initialCol = Math.floor(idx / 6);
                  const initialRow = idx % 6;

                  return (
                    <button
                      key={item.id}
                      onMouseDown={(e) => { if (e.button !== 0) return; e.stopPropagation(); handleDragStart(item.id, e); }}
                      onClick={(e) => { e.stopPropagation(); setSelected(item.id); }}
                      onDoubleClick={() => { if (!hasMoved) openApp(item.id); }}
                      onContextMenu={(e) => { setSelected(item.id); iconMenu(e, item); }}
                      className={`absolute pointer-events-auto group flex flex-col items-center gap-0.5 w-[76px] cursor-default rounded-md p-1.5 transition-colors select-none ${isDragged ? 'opacity-75 z-50 scale-[1.03]' : ''}`}
                      style={{
                        right: `${initialCol * 84}px`,
                        top: `${initialRow * 80}px`,
                        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
                        transition: isDragged ? 'none' : 'transform 150ms cubic-bezier(0.25, 0.8, 0.25, 1)',
                      }}
                    >
                      <AppIcon appId={item.id} className="w-[48px] h-[48px] pointer-events-none" />
                      <span className={`desktop-label text-[11px] font-medium text-center leading-tight px-1 rounded select-none ${selected === item.id ? 'bg-[#0A84FF] text-white' : 'text-white'}`}>{item.name}</span>
                    </button>
                  );
                })}
              </div>

              <div 
                className={`absolute flex-col gap-4 pointer-events-auto select-none flex ${draggedId === 'githubWidget' ? 'opacity-75 z-50 scale-[1.03]' : 'z-10'}`}
                style={{
                  top: '40px', left: '40px',
                  transform: `translate3d(${(iconOffsets.githubWidget || {x:0,y:0}).x}px, ${(iconOffsets.githubWidget || {x:0,y:0}).y}px, 0)`,
                  transition: draggedId === 'githubWidget' ? 'none' : 'transform 150ms cubic-bezier(0.25, 0.8, 0.25, 1)',
                  cursor: draggedId === 'githubWidget' ? 'grabbing' : 'grab'
                }}
                onMouseDown={(e) => { if (e.button !== 0) return; e.stopPropagation(); handleDragStart('githubWidget', e); }}
              >
                 <GithubWidget username="xauravww" className="pointer-events-none" />
              </div>
            </div>

            {/* Workspace 1 */}
            <div className="w-screen h-full relative flex-shrink-0">
              <div className="absolute top-10 right-3 bottom-20 left-10 pointer-events-none">
                {DESKTOP_ICONS.slice(4).map((item, idx) => {
                  const offset = iconOffsets[item.id] || { x: 0, y: 0 };
                  const isDragged = draggedId === item.id;
                  const initialCol = Math.floor(idx / 6);
                  const initialRow = idx % 6;

                  return (
                    <button
                      key={item.id}
                      onMouseDown={(e) => { if (e.button !== 0) return; e.stopPropagation(); handleDragStart(item.id, e); }}
                      onClick={(e) => { e.stopPropagation(); setSelected(item.id); }}
                      onDoubleClick={() => { if (!hasMoved) openApp(item.id); }}
                      onContextMenu={(e) => { setSelected(item.id); iconMenu(e, item); }}
                      className={`absolute pointer-events-auto group flex flex-col items-center gap-0.5 w-[76px] cursor-default rounded-md p-1.5 transition-colors select-none ${isDragged ? 'opacity-75 z-50 scale-[1.03]' : ''}`}
                      style={{
                        right: `${initialCol * 84}px`,
                        top: `${initialRow * 80}px`,
                        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
                        transition: isDragged ? 'none' : 'transform 150ms cubic-bezier(0.25, 0.8, 0.25, 1)',
                      }}
                    >
                      <AppIcon appId={item.id} className="w-[48px] h-[48px] pointer-events-none" />
                      <span className={`desktop-label text-[11px] font-medium text-center leading-tight px-1 rounded select-none ${selected === item.id ? 'bg-[#0A84FF] text-white' : 'text-white'}`}>{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Mobile: iOS-style Home Screen */}
        {isMobile && !hasOpenWindow && (
          <div className="relative w-full h-full">
            <style>{`.hide-scroll::-webkit-scrollbar { display: none; }`}</style>
            <div 
              className="flex w-full h-full overflow-x-auto snap-x snap-mandatory hide-scroll pb-[64px]"
              onScroll={(e) => {
                const page = Math.round(e.target.scrollLeft / e.target.clientWidth);
                if (page !== mobilePage) setMobilePage(page);
              }}
            >
              {/* Page 0: Widgets + first 4 icons */}
              <div className="w-full h-full flex-shrink-0 snap-center flex flex-col items-center justify-start px-6 pt-8 overflow-y-auto hide-scroll pb-10">
                {/* iOS Calendar / Time Widget */}
                <div className="w-full max-w-[320px] bg-white/[0.08] border border-white/10 backdrop-blur-md rounded-[22px] p-5 mb-4 flex flex-col items-start gap-0.5 shadow-lg">
                  <span className="text-[#0A84FF] text-[10px] font-bold tracking-widest uppercase">{widgetDate.split(',')[0]}</span>
                  <span className="text-white text-3xl font-semibold tracking-tight">{widgetTime.replace(/\s[A-Z]+$/, '')}</span>
                  <span className="text-white/60 text-[12px] font-medium mt-1">Saurav Maheshwari</span>
                  <span className="text-white/35 text-[10px]">Full-Stack Developer</span>
                </div>

                <GithubWidget username="xauravww" className="w-full max-w-[320px] mb-6" />

                {/* iOS App Grid Container - Row 1 */}
                <div className="relative w-[320px] h-[92px]">
                  {DESKTOP_ICONS.slice(0, 4).map((item, idx) => {
                    const offset = iconOffsets[item.id] || { x: 0, y: 0 };
                    const isDragged = draggedId === item.id;
                    const initialCol = idx % 4;
                    const initialRow = 0; // all on first row

                    return (
                      <button
                        key={item.id}
                        onTouchStart={(e) => { e.stopPropagation(); handleDragStart(item.id, e); }}
                        onClick={() => { if (!hasMoved) openApp(item.id); }}
                        className={`absolute flex flex-col items-center gap-1 w-[72px] focus:outline-none select-none`}
                        style={{
                          left: `${initialCol * 80}px`,
                          top: `${initialRow * 92}px`,
                        }}
                      >
                        <div className="w-[54px] h-[54px] rounded-[22%] overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.25)] pointer-events-none">
                          <AppIcon appId={item.id} className="w-full h-full" />
                        </div>
                        <span className="text-white text-[11px] font-medium leading-tight text-center truncate w-full px-0.5 select-none">{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Page 1: Remaining icons */}
              <div className="w-full h-full flex-shrink-0 snap-center flex flex-col items-center justify-start px-6 pt-8 overflow-y-auto hide-scroll pb-10">
                <div className="relative w-[320px] h-full">
                  {DESKTOP_ICONS.slice(4).map((item, idx) => {
                    const offset = iconOffsets[item.id] || { x: 0, y: 0 };
                    const isDragged = draggedId === item.id;
                    const initialCol = idx % 4;
                    const initialRow = Math.floor(idx / 4);

                    return (
                      <button
                        key={item.id}
                        onTouchStart={(e) => { e.stopPropagation(); handleDragStart(item.id, e); }}
                        onClick={() => { if (!hasMoved) openApp(item.id); }}
                        className={`absolute flex flex-col items-center gap-1 w-[72px] focus:outline-none select-none`}
                        style={{
                          left: `${initialCol * 80}px`,
                          top: `${initialRow * 92}px`,
                        }}
                      >
                        <div className="w-[54px] h-[54px] rounded-[22%] overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.25)] pointer-events-none">
                          <AppIcon appId={item.id} className="w-full h-full" />
                        </div>
                        <span className="text-white text-[11px] font-medium leading-tight text-center truncate w-full px-0.5 select-none">{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Mobile Page Indicators */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex justify-center gap-2 pointer-events-none">
              <div className={`w-[6px] h-[6px] rounded-full transition-colors ${mobilePage === 0 ? 'bg-white' : 'bg-white/40'}`}></div>
              <div className={`w-[6px] h-[6px] rounded-full transition-colors ${mobilePage === 1 ? 'bg-white' : 'bg-white/40'}`}></div>
            </div>
          </div>
        )}
      </div>

      {/* Windows */}
      <Window id="about" title="About Me" defaultSize={WINDOW_SIZES.about}>
        <AboutApp />
      </Window>
      <Window id="techstack" title="Skills" defaultSize={WINDOW_SIZES.techstack}>
        <TechStackApp />
      </Window>
      <Window id="projects" title="Projects" defaultSize={WINDOW_SIZES.projects}>
        <ProjectsApp />
      </Window>
      <Window id="experience" title="Work Experience" defaultSize={WINDOW_SIZES.experience}>
        <ExperienceApp />
      </Window>
      <Window id="blogs" title="Blog Posts" defaultSize={WINDOW_SIZES.blogs}>
        <BlogsApp />
      </Window>
      <Window id="education" title="Education History" defaultSize={WINDOW_SIZES.education}>
        <EducationApp />
      </Window>
      <Window id="contact" title="Mail" defaultSize={WINDOW_SIZES.contact}>
        <ContactApp />
      </Window>
      <Window id="safari" title="Safari" defaultSize={WINDOW_SIZES.safari}>
        <SafariApp />
      </Window>
      <Window id="resume" title="Resume" defaultSize={WINDOW_SIZES.resume}>
        <ResumeApp />
      </Window>
      <Window id="music" title="Music" defaultSize={WINDOW_SIZES.music}>
        <MusicApp />
      </Window>
      <Window id="folderGames" title="Games" defaultSize={WINDOW_SIZES.folderGames}>
        <div className="w-full h-full p-6 flex flex-wrap content-start items-start justify-start gap-6">
          <button
            onDoubleClick={() => openWindow('game2048', { size: WINDOW_SIZES.game2048 })}
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col items-center gap-1 w-[76px] cursor-pointer rounded-md p-1.5 hover:bg-white/10 transition-colors"
          >
            <AppIcon appId="game2048" className="w-[48px] h-[48px] pointer-events-none" />
            <span className="text-white text-[11px] font-medium text-center">2048</span>
          </button>
          
          <button
            onDoubleClick={() => openWindow('snake', { size: WINDOW_SIZES.snake })}
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col items-center gap-1 w-[76px] cursor-pointer rounded-md p-1.5 hover:bg-white/10 transition-colors"
          >
            <AppIcon appId="snake" className="w-[48px] h-[48px] pointer-events-none" />
            <span className="text-white text-[11px] font-medium text-center">Snake</span>
          </button>

          <button
            onDoubleClick={() => openWindow('tictactoe', { size: WINDOW_SIZES.tictactoe })}
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col items-center gap-1 w-[76px] cursor-pointer rounded-md p-1.5 hover:bg-white/10 transition-colors"
          >
            <AppIcon appId="tictactoe" className="w-[48px] h-[48px] pointer-events-none" />
            <span className="text-white text-[11px] font-medium text-center">TicTacToe</span>
          </button>

          <button
            onDoubleClick={() => openWindow('breakout', { size: WINDOW_SIZES.breakout })}
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col items-center gap-1 w-[76px] cursor-pointer rounded-md p-1.5 hover:bg-white/10 transition-colors"
          >
            <AppIcon appId="breakout" className="w-[48px] h-[48px] pointer-events-none" />
            <span className="text-white text-[11px] font-medium text-center">Breakout</span>
          </button>
        </div>
      </Window>
      <Window id="game2048" title="2048" defaultSize={WINDOW_SIZES.game2048}>
        <div className="w-full h-full bg-[#faf8ef] flex items-center justify-center overflow-auto hide-scroll">
          <Game2048Widget className="w-[340px] sm:w-[420px] scale-90 sm:scale-100 shadow-none border border-[#776e65]/10" />
        </div>
      </Window>
      <Window id="snake" title="Snake" defaultSize={WINDOW_SIZES.snake}>
        <SnakeWidget />
      </Window>
      <Window id="tictactoe" title="TicTacToe" defaultSize={WINDOW_SIZES.tictactoe}>
        <TicTacToeWidget />
      </Window>
      <Window id="breakout" title="Breakout" defaultSize={WINDOW_SIZES.breakout}>
        <BreakoutWidget />
      </Window>

      {/* Context Menu */}
      {!isMobile && <WorkspaceHint onSwitch={desktopWorkspace} />}

      {menu && <ContextMenu x={menu.x} y={menu.y} items={menu.items} onClose={() => setMenu(null)} />}

      <Dock defaultSizes={WINDOW_SIZES} />
    </div>
  );
}

const Desktop = () => {
  const [booted, setBooted] = useState(false);
  const handleBoot = useCallback(() => setBooted(true), []);

  return (
    <WindowProvider>
      {!booted && <BootScreen onComplete={handleBoot} />}
      <DesktopSurface />
    </WindowProvider>
  );
};

export default Desktop;
