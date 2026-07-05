'use client';
import { useState } from 'react';

const STATIONS = [
  { id: 'jfKfPfyJRdk', name: 'Lofi Girl', subtitle: 'Beats to relax/study to' },
  { id: '4xDzrUhVKVA', name: 'Synthwave Radio', subtitle: 'Chillwave & Retrowave' },
  { id: '7NOSDKb0HlU', name: 'Chillhop Music', subtitle: 'Jazzy & Lofi Hip Hop' },
  { id: '5yx6BWlEVcU', name: 'Chillout Lounge', subtitle: 'Ambient & Relaxing' },
  { id: '7nosCcdTPhM', name: 'Coffee Shop Radio', subtitle: 'Smooth Jazz Beats' },
];

export default function MusicApp() {
  const [active, setActive] = useState(STATIONS[0]);

  return (
    <div className="w-full h-full bg-[#1c1c1e] text-white flex flex-col md:flex-row overflow-hidden font-sans select-none">
      {/* Sidebar */}
      <div className="w-full h-[140px] md:h-full md:w-[240px] bg-[#2a2a2c] flex-shrink-0 flex flex-col border-b md:border-b-0 md:border-r border-white/10">
        <div className="p-4 font-bold text-[15px] text-white/90 tracking-wide uppercase">Stations</div>
        <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1 custom-scrollbar">
          {STATIONS.map(station => (
            <button
              key={station.id}
              onClick={() => setActive(station)}
              className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors flex flex-col gap-0.5 ${active.id === station.id ? 'bg-[#FF2D55] text-white shadow-md' : 'hover:bg-white/5 text-white/70'}`}
            >
              <div className="font-medium text-[13px] truncate">{station.name}</div>
              <div className={`text-[11px] ${active.id === station.id ? 'text-white/80' : 'text-white/40'} truncate`}>{station.subtitle}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-black relative">
        <iframe
          src={`https://www.youtube.com/embed/${active.id}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0`}
          className="w-full h-full border-0"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          title={active.name}
        ></iframe>
        
        {/* Gradient Overlay for title */}
        <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/90 via-black/40 to-transparent pointer-events-none">
          <h2 className="text-2xl font-bold drop-shadow-md text-white/95">{active.name}</h2>
          <p className="text-sm text-white/70 drop-shadow-md mt-1">{active.subtitle}</p>
        </div>
      </div>
    </div>
  );
}
