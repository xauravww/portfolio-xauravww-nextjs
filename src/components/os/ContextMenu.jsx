'use client';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const ContextMenu = ({ x, y, items, onClose }) => {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x, y, ready: false });

  useEffect(() => {
    if (!ref.current) return;
    const { offsetWidth: w, offsetHeight: h } = ref.current;
    let cx = x, cy = y;
    if (cx + w > window.innerWidth - 8) cx = window.innerWidth - w - 8;
    if (cy + h > window.innerHeight - 8) cy = window.innerHeight - h - 8;
    setPos({ x: Math.max(8, cx), y: Math.max(32, cy), ready: true });
  }, [x, y]);

  useEffect(() => {
    const onPointer = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    const onScroll = () => onClose();
    const id = setTimeout(() => {
      window.addEventListener('pointerdown', onPointer, true);
      window.addEventListener('keydown', onKey);
      window.addEventListener('resize', onClose);
      window.addEventListener('blur', onClose);
      window.addEventListener('scroll', onScroll, true);
    }, 0);
    return () => {
      clearTimeout(id);
      window.removeEventListener('pointerdown', onPointer, true);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onClose);
      window.removeEventListener('blur', onClose);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [onClose]);

  const node = (
    <div
      ref={ref}
      className="fixed z-[9999] min-w-[210px] py-1.5 rounded-[10px] bg-[#2c2c2e]/95 backdrop-blur-2xl border border-white/[0.12] shadow-[0_12px_48px_rgba(0,0,0,0.6)]"
      style={{
        left: pos.x, top: pos.y,
        opacity: pos.ready ? 1 : 0,
        transform: pos.ready ? 'scale(1)' : 'scale(0.96)',
        transformOrigin: 'top left',
        transition: 'opacity 110ms ease-out, transform 110ms ease-out',
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {items.map((item, i) => {
        if (item.divider) return <div key={i} className="h-px my-1.5 mx-2 bg-white/[0.09]" />;
        return (
          <button
            key={i}
            disabled={item.disabled}
            onClick={() => { if (!item.disabled) { item.action?.(); onClose(); } }}
            className={`w-full flex items-center gap-2.5 px-3 py-[6px] mx-0 text-[13px] text-left transition-colors duration-75 rounded-[5px] ${
              item.disabled
                ? 'text-white/25 cursor-default'
                : 'text-white/90 hover:bg-[#0A84FF] hover:text-white cursor-default'
            }`}
          >
            {item.icon && <span className="w-[15px] h-[15px] flex items-center justify-center shrink-0 opacity-80">{item.icon}</span>}
            <span className="flex-1">{item.label}</span>
            {item.shortcut && <span className="text-[11px] opacity-40">{item.shortcut}</span>}
          </button>
        );
      })}
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(node, document.body);
};

export default ContextMenu;
