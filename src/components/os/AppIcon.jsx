'use client';

// Proper macOS Big Sur squircle (superellipse) — measured continuous-corner path on 100x100
const SQUIRCLE = 'M100,50 C100,89.5 89.5,100 50,100 C10.5,100 0,89.5 0,50 C0,10.5 10.5,0 50,0 C89.5,0 100,10.5 100,50 Z';

const AppIcon = ({ appId, className = '' }) => {
  const icon = ICONS[appId];
  if (!icon) return null;
  const cid = `sq-${appId}`;

  return (
    <div className={`relative ${className}`} style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.25)) drop-shadow(0 4px 10px rgba(0,0,0,0.3))' }}>
      <svg viewBox="0 0 100 100" className="w-full h-full block">
        <defs>
          <clipPath id={cid}><path d={SQUIRCLE} /></clipPath>
          <linearGradient id={`bg-${appId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={icon.c1} />
            <stop offset="100%" stopColor={icon.c2} />
          </linearGradient>
          <linearGradient id={`gloss-${appId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
            <stop offset="45%" stopColor="rgba(255,255,255,0.08)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        <g clipPath={`url(#${cid})`}>
          {/* Base gradient */}
          <rect width="100" height="100" fill={`url(#bg-${appId})`} />
          {/* Top gloss */}
          <rect width="100" height="52" fill={`url(#gloss-${appId})`} />
          {/* Symbol */}
          {icon.symbol}
          {/* Inner top edge highlight */}
          <path d={SQUIRCLE} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" />
        </g>
        {/* Outer 1px dark edge for crispness */}
        <path d={SQUIRCLE} fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
      </svg>
    </div>
  );
};

const white = (o) => `rgba(255,255,255,${o})`;

const ICONS = {
  about: {
    c1: '#5AC8FA', c2: '#0A84FF',
    symbol: (
      <g transform="translate(50,50)">
        <circle cx="0" cy="-11" r="11" fill={white(0.97)} />
        <path d="M-20 20 C-20 6 -11 0 0 0 C11 0 20 6 20 20 Z" fill={white(0.97)} />
      </g>
    ),
  },
  techstack: {
    c1: '#34D399', c2: '#059669',
    symbol: (
      <g transform="translate(50,50)" stroke={white(0.97)} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M-19 -12 L-5 0 L-19 12" />
        <path d="M-1 14 L19 14" />
      </g>
    ),
  },
  projects: {
    c1: '#64D2FF', c2: '#0A84FF',
    symbol: (
      <g transform="translate(50,52)">
        <path d="M-26 -8 C-26 -12 -23 -14 -20 -14 L-6 -14 C-4 -14 -2 -13 -1 -11 L2 -7 C3 -5 5 -4 7 -4 L26 -4 L26 16 C26 19 24 21 21 21 L-21 21 C-24 21 -26 19 -26 16 Z" fill={white(0.55)} />
        <path d="M-28 0 L28 0 L26 17 C26 19 24 21 21 21 L-21 21 C-24 21 -26 19 -26 17 Z" fill={white(0.97)} />
      </g>
    ),
  },
  experience: {
    c1: '#DA8FFF', c2: '#AF52DE',
    symbol: (
      <g transform="translate(50,52)">
        <path d="M-11 -10 L-11 -15 C-11 -18 -9 -20 -6 -20 L6 -20 C9 -20 11 -18 11 -15 L11 -10" fill="none" stroke={white(0.97)} strokeWidth="4.5" strokeLinecap="round" />
        <rect x="-24" y="-10" width="48" height="30" rx="6" fill={white(0.97)} />
        <rect x="-4" y="2" width="8" height="7" rx="2" fill="#AF52DE" opacity="0.5" />
      </g>
    ),
  },
  blogs: {
    c1: '#FF6482', c2: '#FF2D55',
    symbol: (
      <g transform="translate(50,50)">
        <rect x="-17" y="-23" width="34" height="46" rx="5" fill={white(0.97)} />
        <rect x="-10" y="-15" width="20" height="3" rx="1.5" fill="#FF2D55" opacity="0.35" />
        <rect x="-10" y="-7" width="20" height="3" rx="1.5" fill="#FF2D55" opacity="0.25" />
        <rect x="-10" y="1" width="13" height="3" rx="1.5" fill="#FF2D55" opacity="0.25" />
        <g transform="translate(9,13) rotate(-35)">
          <rect x="-2" y="-14" width="4" height="18" rx="1" fill="#FFB340" />
          <polygon points="-2,4 2,4 0,9" fill="#2C2C2E" />
        </g>
      </g>
    ),
  },
  education: {
    c1: '#FFB340', c2: '#FF9500',
    symbol: (
      <g transform="translate(50,48)">
        <path d="M0 -18 L-26 -6 L0 6 L26 -6 Z" fill={white(0.97)} />
        <path d="M-15 -1 L-15 13 C-15 17 -7 21 0 21 C7 21 15 17 15 13 L15 -1 L0 6 Z" fill={white(0.85)} />
        <line x1="24" y1="-6" x2="24" y2="12" stroke={white(0.97)} strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="24" cy="14" r="2.5" fill={white(0.97)} />
      </g>
    ),
  },
  contact: {
    c1: '#64D2FF', c2: '#0A84FF',
    symbol: (
      <g transform="translate(50,50)">
        <rect x="-25" y="-16" width="50" height="32" rx="6" fill={white(0.97)} />
        <path d="M-23 -12 L0 6 L23 -12" fill="none" stroke="#0A84FF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" />
      </g>
    ),
  },
};

export default AppIcon;
