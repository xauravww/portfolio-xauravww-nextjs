'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useWindows } from '../../context/windowContext';
import AppIcon from './AppIcon';

const APP_LABELS = {
  about: 'About', techstack: 'Skills', projects: 'Projects',
  experience: 'Experience', blogs: 'Blogs', education: 'Education', contact: 'Mail',
  resume: 'Resume', folderGames: 'Games', game2048: '2048',
  snake: 'Snake', tictactoe: 'TicTacToe', breakout: 'Breakout',
};

const APP_IDS = ['about', 'techstack', 'projects', 'experience', 'blogs', 'education', 'contact', 'resume', 'folderGames', 'game2048', 'snake', 'tictactoe', 'breakout'];

const MenuBar = () => {
  const { activeWindowId, openWindow, closeWindow, minimizeWindow, focusWindow, getOpenWindows, windows } = useWindows();
  const [time, setTime] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openMenu, setOpenMenu] = useState(null); // menu key currently open
  const barRef = useRef(null);

  // Mobile drawer states
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerHeight, setDrawerHeight] = useState(0);
  const [isDraggingDrawer, setIsDraggingDrawer] = useState(false);
  const [activeActionSheet, setActiveActionSheet] = useState(null);
  const touchStartY = useRef(0);
  const hasMovedTouch = useRef(false);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    const update = () => {
      const now = new Date();
      if (window.innerWidth < 768) {
        // iOS time format (e.g., 9:41)
        setTime(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false }));
      } else {
        setTime(now.toLocaleString('en-US', {
          weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
        }));
      }
    };
    update();
    const id = setInterval(update, 20000);
    window.addEventListener('resize', check);
    return () => {
      clearInterval(id);
      window.removeEventListener('resize', check);
    };
  }, []);

  // Close desktop dropdown on outside click / escape
  useEffect(() => {
    if (!openMenu) return;
    const onDown = (e) => { if (barRef.current && !barRef.current.contains(e.target)) setOpenMenu(null); };
    const onKey = (e) => { if (e.key === 'Escape') setOpenMenu(null); };
    window.addEventListener('pointerdown', onDown, true);
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('pointerdown', onDown, true); window.removeEventListener('keydown', onKey); };
  }, [openMenu]);

  const openApp = (id) => openWindow(id, {});
  const appName = activeWindowId ? APP_LABELS[activeWindowId] || 'Finder' : 'Finder';
  const hasActive = !!activeWindowId && windows[activeWindowId]?.isOpen;
  const openList = getOpenWindows();

  // Menu definitions
  const MENUS = {
    apple: {
      label: <span className="text-[13px]"></span>,
      items: [
        { label: 'About This Portfolio', action: () => openApp('about') },
        { divider: true },
        { label: 'View Source on GitHub', action: () => window.open('https://github.com/xauravww', '_blank') },
        { label: 'Read the Blog', action: () => window.open('https://xauravww.hashnode.dev', '_blank') },
        { divider: true },
        { label: 'Open All Apps', action: () => APP_IDS.forEach((id, i) => setTimeout(() => openApp(id), i * 80)) },
        { label: 'Close All Windows', disabled: openList.length === 0, action: () => openList.forEach(([id]) => closeWindow(id)) },
        { divider: true },
        { label: 'Reload', shortcut: '⌘R', action: () => window.location.reload() },
      ],
    },
    file: {
      label: 'File',
      items: [
        { label: 'Open About', shortcut: '⌘1', action: () => openApp('about') },
        { label: 'Open Projects', shortcut: '⌘2', action: () => openApp('projects') },
        { label: 'Open Blogs', shortcut: '⌘3', action: () => openApp('blogs') },
        { divider: true },
        { label: 'Close Window', shortcut: '⌘W', disabled: !hasActive, action: () => activeWindowId && closeWindow(activeWindowId) },
      ],
    },
    edit: {
      label: 'Edit',
      items: [
        { label: 'Undo', shortcut: '⌘Z', disabled: true },
        { label: 'Redo', shortcut: '⇧⌘Z', disabled: true },
        { divider: true },
        { label: 'Cut', shortcut: '⌘X', disabled: true },
        { label: 'Copy', shortcut: '⌘C', disabled: true },
        { label: 'Paste', shortcut: '⌘V', disabled: true },
      ],
    },
    view: {
      label: 'View',
      items: [
        { label: 'Minimize Window', shortcut: '⌘M', disabled: !hasActive, action: () => activeWindowId && minimizeWindow(activeWindowId) },
        { label: 'Enter Full Screen', shortcut: '⌃⌘F', action: () => { if (!document.fullscreenElement) document.documentElement.requestFullscreen?.(); else document.exitFullscreen?.(); } },
        { divider: true },
        { label: 'Change Wallpaper', action: () => window.dispatchEvent(new Event('change-wallpaper')) },
        { label: 'Reset Icon Layout', action: () => window.dispatchEvent(new Event('reset-icon-layout')) },
      ],
    },
    window: {
      label: 'Window',
      items: openList.length > 0
        ? [
            ...openList.map(([id]) => ({
              label: APP_LABELS[id] || id,
              checked: id === activeWindowId,
              action: () => focusWindow(id),
            })),
            { divider: true },
            { label: 'Close All', action: () => openList.forEach(([id]) => closeWindow(id)) },
          ]
        : [{ label: 'No Open Windows', disabled: true }],
    },
  };

  const menuOrder = ['file', 'edit', 'view', 'window'];

  const handleClick = (key) => setOpenMenu(prev => prev === key ? null : key);
  const handleEnter = (key) => { if (openMenu) setOpenMenu(key); };

  const renderDropdown = (key) => {
    const menu = MENUS[key];
    return (
      <div className="absolute top-full left-0 mt-[3px] min-w-[220px] py-1.5 rounded-[10px] bg-[#2c2c2e]/95 backdrop-blur-2xl border border-white/[0.12] shadow-[0_12px_48px_rgba(0,0,0,0.6)]"
        style={{ animation: 'ctxIn 110ms ease-out' }}>
        {menu.items.map((item, i) => {
          if (item.divider) return <div key={i} className="h-px my-1.5 mx-2 bg-white/[0.09]" />;
          return (
            <button key={i} disabled={item.disabled}
              onClick={() => { if (!item.disabled) { item.action?.(); setOpenMenu(null); } }}
              className={`w-full flex items-center gap-2 px-3 py-[6px] text-[13px] text-left transition-colors duration-75 ${
                item.disabled ? 'text-white/25 cursor-default' : 'text-white/90 hover:bg-[#0A84FF] hover:text-white cursor-default'}`}>
              <span className="w-3 shrink-0 text-[11px]">{item.checked ? '✓' : ''}</span>
              <span className="flex-1">{item.label}</span>
              {item.shortcut && <span className="text-[11px] opacity-40">{item.shortcut}</span>}
            </button>
          );
        })}
      </div>
    );
  };

  // Mobile menu drag-down handlers
  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
    setIsDraggingDrawer(true);
    hasMovedTouch.current = false;
  };

  const handleTouchMove = useCallback((e) => {
    if (!isDraggingDrawer) return;
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - touchStartY.current;

    if (Math.abs(deltaY) > 5) {
      hasMovedTouch.current = true;
    }

    let newHeight = 0;
    if (drawerOpen) {
      newHeight = Math.max(0, Math.min(480, 480 + deltaY));
    } else {
      newHeight = Math.max(0, Math.min(480, deltaY));
    }
    setDrawerHeight(newHeight);
  }, [drawerOpen, isDraggingDrawer]);

  const handleTouchEnd = useCallback(() => {
    setIsDraggingDrawer(false);

    if (!hasMovedTouch.current) {
      // It was a tap, toggle drawer state
      if (drawerOpen) {
        setDrawerOpen(false);
        setDrawerHeight(0);
      } else {
        setDrawerOpen(true);
        setDrawerHeight(480);
      }
      return;
    }

    // Drag release threshold commit
    if (drawerOpen) {
      if (drawerHeight < 380) { // Threshold for closing
        setDrawerOpen(false);
        setDrawerHeight(0);
      } else {
        setDrawerOpen(true);
        setDrawerHeight(480);
      }
    } else {
      if (drawerHeight > 100) {
        setDrawerOpen(true);
        setDrawerHeight(480);
      } else {
        setDrawerOpen(false);
        setDrawerHeight(0);
      }
    }
  }, [drawerOpen, drawerHeight]);

  if (isMobile) {
    return (
      <>
        {/* Backdrop for active drawer */}
        {drawerOpen && (
          <div 
            onClick={() => { setDrawerOpen(false); setDrawerHeight(0); }}
            className="fixed inset-0 bg-black/45 backdrop-blur-sm z-[130]"
            style={{
              opacity: drawerHeight / 480,
              transition: isDraggingDrawer ? 'none' : 'opacity 250ms ease-out',
            }}
          />
        )}

        {/* Mobile Menu Drawer (iOS Control Center Grid) */}
        <div 
          className="fixed top-0 left-0 right-0 z-[140] bg-[#1c1c1e]/90 backdrop-blur-3xl border-b border-white/[0.08] rounded-b-[24px] shadow-[0_12px_48px_rgba(0,0,0,0.5)] flex flex-col pt-8 pb-1 text-white overflow-hidden select-none"
          style={{
            height: '480px',
            transform: `translate3d(0, ${drawerHeight - 480}px, 0)`,
            transition: isDraggingDrawer ? 'none' : 'transform 250ms cubic-bezier(0.25, 0.8, 0.25, 1)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-2.5 border-b border-white/[0.06] shrink-0">
            <span className="text-[13px] font-bold text-white/95 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0A84FF] shadow-[0_0_8px_#0A84FF]" />
              Control Center
            </span>
            <button 
              onClick={() => { setDrawerOpen(false); setDrawerHeight(0); }}
              className="text-[12.5px] text-[#0A84FF] font-semibold"
            >
              Done
            </button>
          </div>

          {/* Grid Layout Content */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 custom-scrollbar">
            
            {/* Top Row: Connectivity & Active App */}
            <div className="grid grid-cols-2 gap-4">
              
              {/* Socials Connection Block (iOS Connectivity Panel Style) */}
              <div className="bg-white/[0.04] border border-white/[0.05] rounded-[22px] p-3.5 flex flex-col justify-center h-[120px]">
                <div className="grid grid-cols-2 gap-3 mx-auto">
                  <a href="mailto:sauravmaheshwari8@gmail.com" className="flex items-center justify-center bg-[#FF9500] rounded-full w-9 h-9 active:scale-90 transition-transform text-white shadow-sm" title="Email">
                    <svg className="w-[17px] h-[17px]" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </a>
                  <a href="https://github.com/xauravww" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center bg-[#34C759] rounded-full w-9 h-9 active:scale-90 transition-transform text-white shadow-sm" title="GitHub">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.6 0-12 5.4-12 12 0 5.3 3.4 9.8 8.2 11.4.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2 1-.3 2-.4 3-.4s2 .1 3 .4c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.8-1.6 8.2-6.1 8.2-11.4 0-6.6-5.4-12-12-12z"/></svg>
                  </a>
                  <a href="https://linkedin.com/in/itsmesaurav" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center bg-[#0A84FF] rounded-full w-9 h-9 active:scale-90 transition-transform text-white shadow-sm" title="LinkedIn">
                    <svg className="w-[15px] h-[15px]" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </a>
                  <a href="https://x.com/xauravww" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center bg-[#0A84FF] rounded-full w-9 h-9 active:scale-90 transition-transform text-white shadow-sm" title="X (Twitter)">
                    <svg className="w-4 h-4 text-white/95" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                </div>
              </div>

              {/* Active App Module */}
              <div className="bg-white/[0.04] border border-white/[0.05] rounded-[22px] p-3.5 flex flex-col justify-between h-[120px]">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] text-white/35 font-bold uppercase tracking-wider">Active App</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34C759] shadow-[0_0_6px_#34C759]" />
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 bg-white/[0.05] border border-white/[0.08] rounded-xl flex items-center justify-center shadow-inner shrink-0">
                    {activeWindowId ? (
                      <AppIcon appId={activeWindowId} className="w-6.5 h-6.5" />
                    ) : (
                      <svg className="w-6 h-6 text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                        <rect x="6" y="2" width="12" height="20" rx="3" />
                        <path d="M12 18h.01" strokeWidth={3} />
                      </svg>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-bold text-white/90 truncate leading-snug">{appName}</p>
                    <p className="text-[9.5px] text-white/35 truncate">System Session</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Middle Section: App Menus Grid */}
            <div className="space-y-2">
              <span className="text-[10.5px] text-white/35 uppercase tracking-wider font-bold px-1 block">Menu Actions</span>
              <div className="grid grid-cols-2 gap-2.5">
                
                {/* System Settings Button */}
                <button 
                  onClick={() => setActiveActionSheet('apple')}
                  className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.05] active:bg-white/[0.09] rounded-[16px] p-2.5 text-left w-full transition-all"
                >
                  <div className="w-7.5 h-7.5 rounded-lg bg-[#5856D6] flex items-center justify-center text-white shadow-sm shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 005 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-bold text-white/90 leading-tight">System</p>
                    <p className="text-[9.5px] text-white/35 leading-none">Settings</p>
                  </div>
                </button>

                {/* File Menu Button */}
                <button 
                  onClick={() => setActiveActionSheet('file')}
                  className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.05] active:bg-white/[0.09] rounded-[16px] p-2.5 text-left w-full transition-all"
                >
                  <div className="w-7.5 h-7.5 rounded-lg bg-[#FF9500] flex items-center justify-center text-white shadow-sm shrink-0">
                    <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-bold text-white/90 leading-tight">File</p>
                    <p className="text-[9.5px] text-white/35 leading-none">Actions</p>
                  </div>
                </button>

                {/* Edit Menu Button */}
                <button 
                  onClick={() => setActiveActionSheet('edit')}
                  className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.05] active:bg-white/[0.09] rounded-[16px] p-2.5 text-left w-full transition-all"
                >
                  <div className="w-7.5 h-7.5 rounded-lg bg-[#FF2D55] flex items-center justify-center text-white shadow-sm shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-bold text-white/90 leading-tight">Edit</p>
                    <p className="text-[9.5px] text-white/35 leading-none">Options</p>
                  </div>
                </button>

                {/* View Menu Button */}
                <button 
                  onClick={() => setActiveActionSheet('view')}
                  className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.05] active:bg-white/[0.09] rounded-[16px] p-2.5 text-left w-full transition-all"
                >
                  <div className="w-7.5 h-7.5 rounded-lg bg-[#007AFF] flex items-center justify-center text-white shadow-sm shrink-0">
                    <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-bold text-white/90 leading-tight">View</p>
                    <p className="text-[9.5px] text-white/35 leading-none">Layout</p>
                  </div>
                </button>

                {/* Window Menu Button */}
                <button 
                  onClick={() => setActiveActionSheet('window')}
                  className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.05] active:bg-white/[0.09] rounded-[16px] p-2.5 text-left w-full transition-all"
                >
                  <div className="w-7.5 h-7.5 rounded-lg bg-[#34C759] flex items-center justify-center text-white shadow-sm shrink-0">
                    <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2" />
                      <line x1="2" y1="20" x2="22" y2="20" />
                      <line x1="12" y1="17" x2="12" y2="20" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-bold text-white/90 leading-tight">Window</p>
                    <p className="text-[9.5px] text-white/35 leading-none">Task List</p>
                  </div>
                </button>
              </div>
            </div>

          </div>

          {/* Grab Handle */}
          <div 
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="w-full py-3 cursor-ns-resize shrink-0"
          >
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto" />
          </div>
        </div>

        {/* Sliding Bottom Action Sheet */}
        {activeActionSheet && (
          <>
            <div 
              onClick={() => setActiveActionSheet(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[190]"
            />
            <div 
              className="fixed bottom-0 left-0 right-0 z-[200] bg-[#1c1c1e]/95 backdrop-blur-3xl border-t border-white/[0.08] rounded-t-[22px] p-4 pb-8 space-y-3 shadow-2xl"
              style={{ animation: 'slideUp 220ms cubic-bezier(0.25, 0.8, 0.25, 1)' }}
            >
              <div className="text-center pb-1">
                <span className="text-[10.5px] text-white/35 uppercase tracking-wider font-bold">
                  {activeActionSheet === 'apple' ? 'System Settings' : MENUS[activeActionSheet]?.label}
                </span>
              </div>
              
              <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl divide-y divide-white/[0.06] overflow-hidden max-h-[240px] overflow-y-auto custom-scrollbar">
                {MENUS[activeActionSheet]?.items.map((item, i) => {
                  if (item.divider) return null;
                  return (
                    <button
                      key={i}
                      disabled={item.disabled}
                      onClick={() => {
                        if (!item.disabled) {
                          item.action?.();
                          setActiveActionSheet(null);
                          setDrawerOpen(false);
                          setDrawerHeight(0);
                        }
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3.5 text-[13.5px] text-left active:bg-white/[0.08] ${
                        item.disabled ? 'text-white/20' : 'text-white/80'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        {item.checked && <span className="text-[#30D158]">✓</span>}
                        <span>{item.label}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
              
              <button 
                onClick={() => setActiveActionSheet(null)}
                className="w-full bg-white/[0.07] border border-white/[0.05] active:bg-white/[0.12] text-[#0A84FF] rounded-2xl py-3.5 text-[14.5px] font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </>
        )}

        {/* Mobile Status Bar Trigger Zone */}
        <div 
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="fixed top-0 left-0 right-0 h-7 bg-black/15 backdrop-blur-md flex items-center justify-between px-5 z-[150] select-none text-[11.5px] font-semibold text-white/95 cursor-ns-resize"
        >
          {/* Left: Time */}
          <span className="tabular-nums tracking-tight">{time}</span>

          {/* Right: Signal, Wifi, Battery */}
          <div className="flex items-center gap-1.5 opacity-90 scale-[0.9] origin-right">
            {/* Signal Strength (4 Bars) */}
            <svg className="w-[15px] h-[10px]" viewBox="0 0 17 12" fill="currentColor">
              <rect x="0" y="8" width="2.5" height="4" rx="0.5" />
              <rect x="3.5" y="6" width="2.5" height="6" rx="0.5" />
              <rect x="7" y="3.5" width="2.5" height="8.5" rx="0.5" />
              <rect x="10.5" y="0.5" width="2.5" height="11.5" rx="0.5" />
            </svg>
            {/* Wifi */}
            <svg className="w-[14px] h-[10px]" viewBox="0 6 24 16" fill="currentColor">
              <circle cx="12" cy="19.5" r="1.5" />
              <path d="M12 15a4.5 4.5 0 013.18 1.32l-1.06 1.06A3 3 0 0012 16.5a3 3 0 00-2.12.88L8.82 16.32A4.5 4.5 0 0112 15z" />
              <path d="M12 11a8.5 8.5 0 016.01 2.49l-1.06 1.06A7 7 0 0012 12.5a7 7 0 00-4.95 2.05l-1.06-1.06A8.5 8.5 0 0112 11z" />
              <path d="M12 7a12.5 12.5 0 018.84 3.66l-1.06 1.06A11 11 0 0012 8.5a11 11 0 00-7.78 3.22L3.16 10.66A12.5 12.5 0 0112 7z" />
            </svg>
            {/* Battery */}
            <div className="flex items-center">
              <svg className="w-[22px] h-[11px]" viewBox="0 0 24 12" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <rect x="1" y="1" width="19" height="10" rx="3" />
                <path d="M21 4v4" strokeLinecap="round" />
                <rect x="3" y="3" width="13" height="6" rx="1.5" fill="currentColor" stroke="none" />
              </svg>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div ref={barRef} className="fixed top-0 left-0 right-0 h-7 bg-[#1c1c1e]/95 backdrop-blur-2xl border-b border-white/[0.06] flex items-center justify-between px-2 z-[150] select-none text-[11px]">
      {/* Left: apple + app name + menus */}
      <div className="flex items-center">
        {/* Apple menu */}
        <div className="relative">
          <button onClick={() => handleClick('apple')} onMouseEnter={() => handleEnter('apple')}
            className={`px-2.5 h-7 flex items-center rounded transition-colors ${openMenu === 'apple' ? 'bg-white/15' : 'hover:bg-white/10'}`}>
            <svg className="w-3 h-3 text-white/90" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 12.04c-.03-2.9 2.37-4.29 2.48-4.36-1.35-1.98-3.46-2.25-4.21-2.28-1.79-.18-3.5 1.05-4.41 1.05-.9 0-2.31-1.03-3.8-1-1.96.03-3.76 1.14-4.77 2.89-2.03 3.53-.52 8.75 1.46 11.61.97 1.4 2.13 2.97 3.65 2.91 1.46-.06 2.01-.94 3.78-.94 1.76 0 2.26.94 3.81.91 1.57-.03 2.57-1.43 3.53-2.83 1.11-1.62 1.57-3.19 1.6-3.27-.04-.02-3.07-1.18-3.1-4.69zM14.13 3.71c.81-.98 1.35-2.35 1.2-3.71-1.16.05-2.57.77-3.4 1.75-.75.87-1.4 2.26-1.23 3.59 1.29.1 2.62-.66 3.43-1.63z"/></svg>
          </button>
          {openMenu === 'apple' && renderDropdown('apple')}
        </div>

        {/* Active app name (bold) */}
        <span className="px-2 font-semibold text-white/90">{appName}</span>

        {/* App menus — desktop only */}
        <div className="hidden md:flex items-center">
          {menuOrder.map((key) => (
            <div key={key} className="relative">
              <button onClick={() => handleClick(key)} onMouseEnter={() => handleEnter(key)}
                className={`px-2.5 h-7 flex items-center rounded transition-colors text-white/70 ${openMenu === key ? 'bg-white/15 text-white' : 'hover:bg-white/10'}`}>
                {MENUS[key].label}
              </button>
              {openMenu === key && renderDropdown(key)}
            </div>
          ))}
        </div>
      </div>

      {/* Right: status icons + clock */}
      <div className="flex items-center gap-1 text-white/70">
        {/* Fullscreen Toggle */}
        <button onClick={() => {
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen?.();
          } else {
            document.exitFullscreen?.();
          }
        }} className="hidden sm:flex items-center px-1.5 hover:text-white transition-colors" title="Toggle Fullscreen">
          <svg className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
        {/* Battery */}
        <span className="hidden sm:flex items-center px-1.5" title="Battery">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2}>
            <rect x="2" y="9" width="16" height="8" rx="1.5"/><rect x="4" y="11" width="10" height="4" rx="0.5" fill="currentColor" stroke="none"/><path d="M20 11v4" strokeLinecap="round"/>
          </svg>
        </span>
        {/* Wifi */}
        <span className="hidden sm:flex items-center px-1.5" title="Wi-Fi">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 18a2 2 0 100 4 2 2 0 000-4zm0-5c1.7 0 3.2.7 4.3 1.7l-1.4 1.4A4 4 0 0012 15.9a4 4 0 00-2.9 1.2l-1.4-1.4A6 6 0 0112 13zm0-5c3 0 5.7 1.2 7.7 3.2l-1.4 1.4A8.9 8.9 0 0012 11a8.9 8.9 0 00-6.3 2.6L4.3 12.2A10.9 10.9 0 0112 8z"/></svg>
        </span>
        {/* Control center */}
        <button onClick={() => openApp('contact')} className="hidden sm:flex items-center px-1.5 hover:text-white transition-colors" title="Contact">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x="3" y="4" width="8" height="16" rx="3"/><rect x="13" y="4" width="8" height="16" rx="3"/></svg>
        </button>
        {/* Clock */}
        {mounted && <span className="px-2 tabular-nums">{time}</span>}
      </div>
    </div>
  );
};

export default MenuBar;
