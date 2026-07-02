'use client';
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

const Dock = ({ defaultSizes, onItemContextMenu }) => {
  const { windows, openWindow, focusWindow } = useWindows();

  const handleClick = (item) => {
    const win = windows[item.id];
    if (win?.isOpen && !win?.isMinimized) {
      focusWindow(item.id);
    } else {
      const cfg = defaultSizes?.[item.id];
      openWindow(item.id, cfg ? { size: cfg } : undefined);
    }
  };

  return (
    <div className="fixed bottom-2 md:bottom-3 left-1/2 -translate-x-1/2 z-[140]">
      <div className="flex items-end gap-[5px] md:gap-[6px] px-2 md:px-2.5 py-1.5 bg-white/[0.04] backdrop-blur-2xl rounded-[18px] border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        {DOCK_ITEMS.map((item) => {
          const win = windows[item.id];
          const isOpen = win?.isOpen && !win?.isMinimized;
          return (
            <div key={item.id} className="flex flex-col items-center gap-[3px]">
              <button
                onClick={() => handleClick(item)}
                onContextMenu={(e) => onItemContextMenu?.(e, item)}
                className="group cursor-pointer outline-none"
                aria-label={`Open ${item.name}`}
                title={item.name}
              >
                <div className="w-[42px] h-[42px] md:w-[50px] md:h-[50px] transition-all duration-200 ease-out group-hover:scale-[1.35] group-hover:-translate-y-3 group-active:scale-[1.2]">
                  <AppIcon appId={item.id} className="w-full h-full" />
                </div>
              </button>
              <div className={`w-[4px] h-[4px] rounded-full transition-all duration-200 ${isOpen ? 'bg-white/50' : 'bg-transparent'}`} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dock;
