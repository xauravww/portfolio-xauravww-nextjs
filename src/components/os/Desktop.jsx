'use client';
import { useState, useCallback, useEffect } from 'react';
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

const DESKTOP_ICONS = [
  { id: 'about', name: 'About Me' },
  { id: 'techstack', name: 'Skills' },
  { id: 'projects', name: 'Projects' },
  { id: 'experience', name: 'Experience' },
  { id: 'blogs', name: 'Blogs' },
  { id: 'education', name: 'Education' },
  { id: 'contact', name: 'Contact' },
];

const WINDOW_SIZES = {
  about: { w: 500, h: 420 },
  techstack: { w: 720, h: 520 },
  projects: { w: 900, h: 580 },
  experience: { w: 780, h: 500 },
  blogs: { w: 840, h: 540 },
  education: { w: 780, h: 500 },
  contact: { w: 460, h: 560 },
  safari: { w: 900, h: 620 },
};

const SVG = {
  open: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h14"/></svg>,
  info: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="9"/><path strokeLinecap="round" d="M12 11v5M12 8h.01"/></svg>,
  copy: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 012-2h10"/></svg>,
  refresh: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v6h6M20 20v-6h-6M20 8a8 8 0 00-14-3M4 16a8 8 0 0014 3"/></svg>,
  grid: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  close: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12"/></svg>,
  github: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.6 0-12 5.4-12 12 0 5.3 3.4 9.8 8.2 11.4.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2 1-.3 2-.4 3-.4s2 .1 3 .4c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.8-1.6 8.2-6.1 8.2-11.4 0-6.6-5.4-12-12-12z"/></svg>,
  image: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.5"/><path strokeLinecap="round" strokeLinejoin="round" d="M4 18l5-5 4 4 3-3 4 4"/></svg>,
};

function DesktopSurface() {
  const { openWindow, windows, closeWindow, getOpenWindows } = useWindows();
  const [menu, setMenu] = useState(null);
  const [selected, setSelected] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [widgetTime, setWidgetTime] = useState('');
  const [widgetDate, setWidgetDate] = useState('');

  // Icon dragging offsets (relative to initial static base positions in DOM)
  const [draggedId, setDraggedId] = useState(null);
  const [iconOffsets, setIconOffsets] = useState({
    about: { x: 0, y: 0 },
    techstack: { x: 0, y: 0 },
    projects: { x: 0, y: 0 },
    experience: { x: 0, y: 0 },
    blogs: { x: 0, y: 0 },
    education: { x: 0, y: 0 },
    contact: { x: 0, y: 0 },
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
        { label: 'View on GitHub', icon: SVG.github, action: () => window.open('https://github.com/xauravww', '_blank') },
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
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    setDraggedId(id);
    setDragStart({ x: clientX, y: clientY });
    
    const currentOffset = iconOffsets[id] || { x: 0, y: 0 };
    setInitialOffset(currentOffset);
    setPrevCleanOffset(currentOffset);

    setHasMoved(false);
    setSelected(id);
  }, [iconOffsets]);

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

    // Collision detection: Check if bounding boxes of folders overlap
    const collides = DESKTOP_ICONS.some((other, otherIdx) => {
      if (other.id === draggedId) return false;
      
      const otherOffset = iconOffsets[other.id] || { x: 0, y: 0 };

      if (isMobile) {
        // Mobile layout: left, top
        const initialColDragged = draggedIdx % 4;
        const initialRowDragged = Math.floor(draggedIdx / 4);
        const leftDragged = initialColDragged * 80 + currentOffset.x;
        const topDragged = initialRowDragged * 92 + currentOffset.y;

        const initialColOther = otherIdx % 4;
        const initialRowOther = Math.floor(otherIdx / 4);
        const leftOther = initialColOther * 80 + otherOffset.x;
        const topOther = initialRowOther * 92 + otherOffset.y;

        // Folders are roughly 72x80 on mobile. If overlapping by less than 68x76, it's a collision
        return Math.abs(leftDragged - leftOther) < 68 && Math.abs(topDragged - topOther) < 76;
      } else {
        // Desktop layout: right, top
        const initialColDragged = Math.floor(draggedIdx / 6);
        const initialRowDragged = draggedIdx % 6;
        const rightDragged = initialColDragged * 84 - currentOffset.x;
        const topDragged = initialRowDragged * 80 + currentOffset.y;

        const initialColOther = Math.floor(otherIdx / 6);
        const initialRowOther = otherIdx % 6;
        const rightOther = initialColOther * 84 - otherOffset.x;
        const topOther = initialRowOther * 80 + otherOffset.y;

        // Folders are roughly 76x80 on desktop. Overlap threshold = 70px
        return Math.abs(rightDragged - rightOther) < 70 && Math.abs(topDragged - topOther) < 70;
      }
    });

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
      window.removeEventListener('touchend', handleEnd);
    };
  }, [draggedId, handleDragMove, handleDragEnd]);

  const openList = getOpenWindows();
  const hasOpenWindow = openList.length > 0;

  return (
    <div className="os-ui">
      <Wallpaper />
      <MenuBar />

      {/* Desktop surface */}
      <div
        className="fixed inset-0 pt-7 pb-[64px]"
        onContextMenu={desktopMenu}
        onMouseDown={(e) => { if (e.target === e.currentTarget) setSelected(null); }}
      >
        {/* Desktop icons */}
        <div className="hidden md:block absolute top-10 right-3 bottom-20 left-10 pointer-events-none">
          {DESKTOP_ICONS.map((item, idx) => {
            const offset = iconOffsets[item.id] || { x: 0, y: 0 };
            const isDragged = draggedId === item.id;
            
            // Base layout matches index (0 to 5 in first column, 6+ in second)
            const initialCol = Math.floor(idx / 6);
            const initialRow = idx % 6;

            return (
              <button
                key={item.id}
                onMouseDown={(e) => {
                  if (e.button !== 0) return;
                  e.stopPropagation();
                  handleDragStart(item.id, e);
                }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  handleDragStart(item.id, e);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected(item.id);
                }}
                onDoubleClick={() => {
                  if (!hasMoved) openApp(item.id);
                }}
                onContextMenu={(e) => { setSelected(item.id); iconMenu(e, item); }}
                className={`absolute pointer-events-auto group flex flex-col items-center gap-0.5 w-[76px] cursor-default rounded-md p-1.5 transition-colors select-none ${
                  isDragged ? 'opacity-75 z-50 scale-[1.03]' : ''
                }`}
                style={{
                  right: `${initialCol * 84}px`,
                  top: `${initialRow * 80}px`,
                  transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
                  transition: isDragged ? 'none' : 'transform 150ms cubic-bezier(0.25, 0.8, 0.25, 1)',
                }}
              >
                <AppIcon appId={item.id} className="w-[48px] h-[48px] pointer-events-none" />
                <span className={`desktop-label text-[11px] font-medium text-center leading-tight px-1 rounded select-none ${
                  selected === item.id ? 'bg-[#0A84FF] text-white' : 'text-white'
                }`}>
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Mobile: iOS-style Home Screen */}
        {isMobile && !hasOpenWindow && (
          <div className="flex flex-col items-center justify-start h-full px-6 pt-8 overflow-y-auto">
            {/* iOS Calendar / Time Widget */}
            <div className="w-full max-w-[320px] bg-white/[0.08] border border-white/10 backdrop-blur-md rounded-[22px] p-5 mb-8 flex flex-col items-start gap-0.5 shadow-lg">
              <span className="text-[#0A84FF] text-[10px] font-bold tracking-widest uppercase">{widgetDate.split(',')[0]}</span>
              <span className="text-white text-3xl font-semibold tracking-tight">{widgetTime.replace(/\s[A-Z]+$/, '')}</span>
              <span className="text-white/60 text-[12px] font-medium mt-1">Saurav Maheshwari</span>
              <span className="text-white/35 text-[10px]">Full-Stack Developer</span>
            </div>

            {/* iOS App Grid Container */}
            <div className="relative w-[320px] h-[280px]">
              {DESKTOP_ICONS.map((item, idx) => {
                const offset = iconOffsets[item.id] || { x: 0, y: 0 };
                const isDragged = draggedId === item.id;

                // Base layout is row-first wrapping every 4 slots
                const initialCol = idx % 4;
                const initialRow = Math.floor(idx / 4);

                return (
                  <button
                    key={item.id}
                    onMouseDown={(e) => {
                      if (e.button !== 0) return;
                      e.stopPropagation();
                      handleDragStart(item.id, e);
                    }}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                      handleDragStart(item.id, e);
                    }}
                    onClick={() => {
                      if (!hasMoved) openApp(item.id);
                    }}
                    className={`absolute flex flex-col items-center gap-1 w-[72px] focus:outline-none select-none ${
                      isDragged ? 'opacity-75 z-50 scale-[1.03]' : ''
                    }`}
                    style={{
                      left: `${initialCol * 80}px`,
                      top: `${initialRow * 92}px`,
                      transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
                      transition: isDragged ? 'none' : 'transform 150ms cubic-bezier(0.25, 0.8, 0.25, 1)',
                    }}
                  >
                    <div className="w-[54px] h-[54px] rounded-[22%] overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.25)] pointer-events-none">
                      <AppIcon appId={item.id} className="w-full h-full" />
                    </div>
                    <span className="text-white text-[11px] font-medium leading-tight text-center truncate w-full px-0.5 select-none">
                      {item.name}
                    </span>
                  </button>
                );
              })}
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

      {/* Context Menu */}
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
