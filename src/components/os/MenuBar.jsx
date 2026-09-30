'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  AppleLogo, CellSignalFull, WifiHigh, BatteryHigh,
  Gear, FolderOpen, PencilSimple, Eye, Desktop, EnvelopeSimple, DeviceMobile,
  CornersOut, GithubLogo, LinkedinLogo, XLogo,
} from '@phosphor-icons/react';
import { useWindows } from '../../context/windowContext';
import AppIcon from './AppIcon';

const APP_LABELS = {
  about: 'About', techstack: 'Skills', projects: 'Projects',
  experience: 'Experience', blogs: 'Blogs', education: 'Education', contact: 'Mail',
  resume: 'Resume', music: 'Music', folderGames: 'Games', game2048: '2048',
  snake: 'Snake', tictactoe: 'TicTacToe', breakout: 'Breakout',
};

const APP_IDS = ['about', 'techstack', 'projects', 'experience', 'blogs', 'education', 'contact', 'resume', 'music', 'folderGames', 'game2048', 'snake', 'tictactoe', 'breakout'];

const MenuBar = () => {
  const { activeWindowId, openWindow, closeWindow, minimizeWindow, focusWindow, getOpenWindows, windows } = useWindows();
  const [time, setTime] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openMenu, setOpenMenu] = useState(null); // menu key currently open
  const [currentWorkspace, setCurrentWorkspace] = useState(0);
  const barRef = useRef(null);

  // Live workspace indicator (state lives in DesktopSurface; bridged via events)
  useEffect(() => {
    const onChanged = (e) => setCurrentWorkspace(Number(e.detail) || 0);
    window.addEventListener('workspace-changed', onChanged);
    return () => window.removeEventListener('workspace-changed', onChanged);
  }, []);

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
        { label: 'Workspace Switching Hint', action: () => window.dispatchEvent(new Event('workspace-hint-reshow')) },
        { label: 'Reset Icon Layout', action: () => window.dispatchEvent(new Event('reset-icon-layout')) },
      ],
    },
    desktops: {
      label: <span className="flex items-center gap-1.5"><Desktop size={12} weight="bold" /><span className="hidden lg:inline">{`Desktop ${currentWorkspace + 1}`}</span></span>,
      items: [
        { label: 'Switch to Desktop 1', checked: currentWorkspace === 0, shortcut: '⌃1', action: () => window.dispatchEvent(new CustomEvent('switch-workspace', { detail: 0 })) },
        { label: 'Switch to Desktop 2', checked: currentWorkspace === 1, shortcut: '⌃2', action: () => window.dispatchEvent(new CustomEvent('switch-workspace', { detail: 1 })) },
        { divider: true },
        { label: 'Workspace Switching Hint', action: () => window.dispatchEvent(new Event('workspace-hint-reshow')) },
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

  const menuOrder = ['file', 'edit', 'view', 'desktops', 'window'];

  const handleClick = (key) => setOpenMenu(prev => prev === key ? null : key);
  const handleEnter = (key) => { if (openMenu) setOpenMenu(key); };

  const renderDropdown = (key) => {
    const menu = MENUS[key];
    return (
      <div className="absolute top-full left-0 mt-[3px] min-w-[220px] p-1 rounded-[6px] bg-[#1e1e1e]/75 backdrop-blur-xl border border-white/12 shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
        style={{ animation: 'ctxIn 110ms ease-out' }}>
        {menu.items.map((item, i) => {
          if (item.divider) return <div key={i} className="h-px my-1.5 mx-2 bg-white/[0.09]" />;
          return (
            <button key={i} disabled={item.disabled}
              onClick={() => { if (!item.disabled) { item.action?.(); setOpenMenu(null); } }}
              className={`w-full flex items-center gap-2 px-3 py-1.5 text-[13px] text-left transition-colors duration-100 rounded-[4px] ${
                item.disabled ? 'text-white/25 cursor-default' : 'text-[#e5e5e5] hover:bg-[#007aff] hover:text-white cursor-default'}`}>
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
                    <EnvelopeSimple size={17} weight="fill" />
                  </a>
                  <a href="https://github.com/xauravww" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center bg-[#34C759] rounded-full w-9 h-9 active:scale-90 transition-transform text-white shadow-sm" title="GitHub">
                    <GithubLogo size={20} weight="fill" />
                  </a>
                  <a href="https://linkedin.com/in/itsmesaurav" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center bg-[#0A84FF] rounded-full w-9 h-9 active:scale-90 transition-transform text-white shadow-sm" title="LinkedIn">
                    <LinkedinLogo size={17} weight="fill" />
                  </a>
                  <a href="https://x.com/xauravww" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center bg-[#0A84FF] rounded-full w-9 h-9 active:scale-90 transition-transform text-white shadow-sm" title="X (Twitter)">
                    <XLogo size={17} weight="fill" />
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
                      <DeviceMobile size={24} weight="regular" className="text-white/30" />
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
                  <div className="w-7.5 h-7.5 rounded-lg bg-[#5856D6] flex items-center justify-center text-white shadow-sm shrink-0">                      <Gear size={16} weight="fill" />
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
                    <FolderOpen size={18} weight="fill" />
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
                    <PencilSimple size={16} weight="fill" />
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
                    <Eye size={18} weight="fill" />
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
                    <Desktop size={18} weight="fill" />
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
            {/* Signal Strength */}
            <CellSignalFull size={13} weight="fill" />
            {/* Wifi */}
            <WifiHigh size={13} weight="bold" />
            {/* Battery */}
            <BatteryHigh size={17} weight="fill" />
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
            <AppleLogo size={13} weight="fill" />
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
          <CornersOut size={14} weight="bold" />
        </button>
        {/* Battery */}
        <span className="hidden sm:flex items-center px-1.5" title="Battery">
          <BatteryHigh size={18} weight="bold" />
        </span>
        {/* Wifi */}
        <span className="hidden sm:flex items-center px-1.5" title="Wi-Fi">
          <WifiHigh size={15} weight="bold" />
        </span>
        {/* Control center */}
        <button onClick={() => openApp('contact')} className="hidden sm:flex items-center px-1.5 hover:text-white transition-colors" title="Contact">
          <DeviceMobile size={15} weight="bold" />
        </button>
        {/* Clock */}
        {mounted && <span className="px-2 tabular-nums">{time}</span>}
      </div>
    </div>
  );
};

export default MenuBar;
