'use client';
import { useState, useEffect } from 'react';

// Curated Unsplash macOS-style wallpapers (direct CDN, no API key needed)
const WALLPAPERS = [
  'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=2400&q=80', // mountains dusk
  'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=2400&q=80', // aurora
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2400&q=80', // mountain range
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2400&q=80', // forest
  'https://images.unsplash.com/photo-1444080748397-f442aa95c3e5?auto=format&fit=crop&w=2400&q=80', // sunset field
  'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&w=2400&q=80', // misty valley
  'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=2400&q=80', // lake reflection
];

const ROTATE_MS = 20000;

const Wallpaper = () => {
  const [idx, setIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState(null);
  const [loaded, setLoaded] = useState({});

  // Preload all
  useEffect(() => {
    WALLPAPERS.forEach((src, i) => {
      const img = new Image();
      img.src = src;
      img.onload = () => setLoaded(p => ({ ...p, [i]: true }));
    });
  }, []);

  // Rotate + manual advance via window event
  useEffect(() => {
    const advance = () => setIdx(cur => { setPrevIdx(cur); return (cur + 1) % WALLPAPERS.length; });
    const id = setInterval(advance, ROTATE_MS);
    window.addEventListener('change-wallpaper', advance);
    return () => { clearInterval(id); window.removeEventListener('change-wallpaper', advance); };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 bg-[#0a0a0f] overflow-hidden">
      {/* Previous layer (fades out) */}
      {prevIdx !== null && (
        <div
          key={`prev-${prevIdx}`}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${WALLPAPERS[prevIdx]})` }}
        />
      )}
      {/* Current layer (fades in) */}
      <div
        key={`cur-${idx}`}
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-[1500ms] ease-in-out"
        style={{ backgroundImage: `url(${WALLPAPERS[idx]})`, opacity: loaded[idx] ? 1 : 0 }}
      />
      {/* Darkening overlay for readability */}
      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.25) 100%)' }} />
    </div>
  );
};

export default Wallpaper;
