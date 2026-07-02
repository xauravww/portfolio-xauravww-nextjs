'use client';
import { useState, useEffect, useRef } from 'react';
import { useWindows } from '../../context/windowContext';

const APP_LABELS = {
  about: 'About', techstack: 'Skills', projects: 'Projects',
  experience: 'Experience', blogs: 'Blogs', education: 'Education', contact: 'Mail',
};

const APP_IDS = ['about', 'techstack', 'projects', 'experience', 'blogs', 'education', 'contact'];

const MenuBar = () => {
  const { activeWindowId, openWindow, closeWindow, minimizeWindow, focusWindow, getOpenWindows, windows } = useWindows();
  const [time, setTime] = useState('');
  const [mounted, setMounted] = useState(false);
  const [openMenu, setOpenMenu] = useState(null); // menu key currently open
  const barRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const update = () => setTime(new Date().toLocaleString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
    }));
    update();
    const id = setInterval(update, 20000);
    return () => clearInterval(id);
  }, []);

  // Close on outside click / escape
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
