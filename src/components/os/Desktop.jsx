'use client';
import { useState, useCallback } from 'react';
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

  const openApp = useCallback((id) => openWindow(id, { size: WINDOW_SIZES[id] }), [openWindow]);

  const desktopMenu = (e) => {
    e.preventDefault();
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
        {/* Desktop icons — right-aligned grid, desktop only (macOS convention) */}
        <div className="hidden md:grid grid-flow-col grid-rows-6 gap-x-2 gap-y-1 absolute top-10 right-3 justify-items-center">
          {DESKTOP_ICONS.map((item) => (
            <button
              key={item.id}
              onClick={(e) => { e.stopPropagation(); setSelected(item.id); }}
              onDoubleClick={() => openApp(item.id)}
              onContextMenu={(e) => { setSelected(item.id); iconMenu(e, item); }}
              className="group flex flex-col items-center gap-0.5 w-[76px] cursor-default rounded-md p-1.5 transition-colors"
            >
              <AppIcon appId={item.id} className="w-[48px] h-[48px]" />
              <span className={`desktop-label text-[11px] font-medium text-center leading-tight px-1 rounded ${
                selected === item.id ? 'bg-[#0A84FF] text-white' : 'text-white'
              }`}>
                {item.name}
              </span>
            </button>
          ))}
        </div>

        {/* Mobile: greeting in center */}
        <div className="md:hidden flex flex-col items-center justify-center h-full px-8 -mt-8">
          <div className="w-16 h-16 rounded-2xl bg-gold/20 flex items-center justify-center mb-4">
            <span className="text-gold font-display text-2xl font-bold">SM</span>
          </div>
          <h1 className="text-white font-display text-2xl font-bold mb-1 text-center">Saurav Maheshwari</h1>
          <p className="text-white/40 text-sm">Full-Stack Developer</p>
          <p className="text-white/25 text-xs mt-4">Tap an icon below to explore</p>
        </div>
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
      <Window id="experience" title="Experience" defaultSize={WINDOW_SIZES.experience}>
        <ExperienceApp />
      </Window>
      <Window id="blogs" title="Blogs" defaultSize={WINDOW_SIZES.blogs}>
        <BlogsApp />
      </Window>
      <Window id="education" title="Education" defaultSize={WINDOW_SIZES.education}>
        <EducationApp />
      </Window>
      <Window id="contact" title="Contact" defaultSize={WINDOW_SIZES.contact}>
        <ContactApp />
      </Window>

      <Dock defaultSizes={WINDOW_SIZES} onItemContextMenu={iconMenu} />

      {menu && <ContextMenu menu={menu} onClose={() => setMenu(null)} />}
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
