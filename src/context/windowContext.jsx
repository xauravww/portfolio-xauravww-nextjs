'use client';
import { createContext, useContext, useState, useCallback } from 'react';

const WindowContext = createContext();

export const useWindows = () => useContext(WindowContext);

const BASE_Z = 100;

export function WindowProvider({ children }) {
  const [windows, setWindows] = useState({});
  const [topZ, setTopZ] = useState(BASE_Z);
  const [activeWindowId, setActiveWindowId] = useState(null);
  // In-app Safari browser: current page + back/forward history.
  const [browser, setBrowser] = useState({ history: [], index: -1 });

  const openWindow = useCallback((id, opts = {}) => {
    const newZ = topZ + 1;
    setWindows(prev => {
      if (prev[id]?.isOpen) {
        return { ...prev, [id]: { ...prev[id], isMinimized: false, zIndex: newZ } };
      }
      return {
        ...prev,
        [id]: {
          isOpen: true,
          isMinimized: false,
          isMaximized: false,
          zIndex: newZ,
          position: opts.position || { x: 120, y: 60 },
          size: opts.size || { w: 700, h: 500 },
        }
      };
    });
    setTopZ(newZ);
    setActiveWindowId(id);
  }, [topZ]);

  const closeWindow = useCallback((id) => {
    setWindows(prev => {
      const updated = { ...prev, [id]: { ...prev[id], isOpen: false } };
      return updated;
    });
    setActiveWindowId(prev => prev === id ? null : prev);
  }, []);

  const minimizeWindow = useCallback((id) => {
    setWindows(prev => ({ ...prev, [id]: { ...prev[id], isMinimized: true } }));
    setActiveWindowId(prev => prev === id ? null : prev);
  }, []);

  const toggleMaximize = useCallback((id) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isMaximized: !prev[id]?.isMaximized }
    }));
  }, []);

  const focusWindow = useCallback((id) => {
    const newZ = topZ + 1;
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], zIndex: newZ, isMinimized: false }
    }));
    setTopZ(newZ);
    setActiveWindowId(id);
  }, [topZ]);

  const updatePosition = useCallback((id, position) => {
    setWindows(prev => ({ ...prev, [id]: { ...prev[id], position } }));
  }, []);

  // Navigate the in-app Safari to a page and open/focus its window.
  // page = { url, title, mode: 'reader'|'web', content? }
  const openBrowser = useCallback((page, opts = {}) => {
    setBrowser(prev => {
      const trimmed = prev.history.slice(0, prev.index + 1);
      return { history: [...trimmed, page], index: trimmed.length };
    });
    openWindow('safari', { size: opts.size });
  }, [openWindow]);

  const browserBack = useCallback(() => {
    setBrowser(prev => prev.index > 0 ? { ...prev, index: prev.index - 1 } : prev);
  }, []);

  const browserForward = useCallback(() => {
    setBrowser(prev => prev.index < prev.history.length - 1 ? { ...prev, index: prev.index + 1 } : prev);
  }, []);

  const getOpenWindows = useCallback(() => {
    return Object.entries(windows)
      .filter(([, w]) => w.isOpen && !w.isMinimized)
      .sort((a, b) => a[1].zIndex - b[1].zIndex);
  }, [windows]);

  return (
    <WindowContext.Provider value={{
      windows, activeWindowId, openWindow, closeWindow, minimizeWindow,
      toggleMaximize, focusWindow, updatePosition, getOpenWindows,
      browser, openBrowser, browserBack, browserForward
    }}>
      {children}
    </WindowContext.Provider>
  );
}
