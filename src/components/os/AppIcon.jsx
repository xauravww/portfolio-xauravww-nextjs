'use client';
import { useId } from 'react';

// Proper macOS Big Sur squircle (superellipse) — measured continuous-corner path on 100x100
const SQUIRCLE = 'M100,50 C100,89.5 89.5,100 50,100 C10.5,100 0,89.5 0,50 C0,10.5 10.5,0 50,0 C89.5,0 100,10.5 100,50 Z';

const AppIcon = ({ appId, className = '' }) => {
  const icon = ICONS[appId];
  const uniqueId = useId();
  if (!icon) return null;

  const idSafe = uniqueId.replace(/:/g, '-');
  const cid = `sq-${appId}-${idSafe}`;
  const bgId = `bg-${appId}-${idSafe}`;
  const glossId = `gloss-${appId}-${idSafe}`;

  return (
    <div className={`relative ${className}`} style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.25)) drop-shadow(0 4px 10px rgba(0,0,0,0.3))' }}>
      <svg viewBox="0 0 100 100" className="w-full h-full block">
        <defs>
          <clipPath id={cid}><path d={SQUIRCLE} /></clipPath>
          <linearGradient id={bgId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={icon.c1} />
            <stop offset="100%" stopColor={icon.c2} />
          </linearGradient>
          <linearGradient id={glossId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
            <stop offset="45%" stopColor="rgba(255,255,255,0.08)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        <g clipPath={`url(#${cid})`}>
          {/* Base gradient */}
          <rect width="100" height="100" fill={`url(#${bgId})`} />
          {/* Top gloss */}
          <rect width="100" height="52" fill={`url(#${glossId})`} />
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
  safari: {
    c1: '#E8EDF2', c2: '#AEB8C2',
    symbol: (
      <g transform="translate(50,50)">
        <circle cx="0" cy="0" r="30" fill="#1E88E5" />
        <g stroke={white(0.85)} strokeWidth="1.6">
          {Array.from({ length: 24 }).map((_, i) => {
            const a = (i * 15 * Math.PI) / 180;
            const r1 = 27, r2 = i % 6 === 0 ? 22 : 24.5;
            return <line key={i} x1={Math.sin(a) * r1} y1={-Math.cos(a) * r1} x2={Math.sin(a) * r2} y2={-Math.cos(a) * r2} />;
          })}
        </g>
        <polygon points="0,-16 5,0 0,16 -5,0" fill="#F5F5F7" />
        <polygon points="0,-16 5,0 0,0" fill="#FF3B30" />
        <polygon points="0,16 -5,0 0,0" fill="#FF6B60" />
        <circle cx="0" cy="0" r="2.2" fill="#1E88E5" stroke={white(0.9)} strokeWidth="1" />
      </g>
    ),
  },
  github: {
    c1: '#2c2c2e', c2: '#111111',
    symbol: (
      <g transform="translate(26,26) scale(2)">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" fill={white(0.95)} />
      </g>
    ),
  },
  linkedin: {
    c1: '#0077B5', c2: '#005582',
    symbol: (
      <g transform="translate(26,26) scale(2)">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" fill={white(0.95)} />
      </g>
    ),
  },
  x: {
    c1: '#222222', c2: '#000000',
    symbol: (
      <g transform="translate(26,26) scale(2)">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill={white(0.95)} />
      </g>
    ),
  },
  showwcase: {
    c1: '#000000', c2: '#1b1b1b',
    symbol: (
      <g transform="translate(26,26) scale(2)">
        <rect x="2" y="2" width="8" height="8" rx="1.5" fill={white(0.95)} />
        <rect x="14" y="2" width="8" height="8" rx="1.5" fill={white(0.5)} />
        <rect x="2" y="14" width="8" height="8" rx="1.5" fill={white(0.5)} />
        <rect x="14" y="14" width="8" height="8" rx="1.5" fill={white(0.95)} />
      </g>
    ),
  },
};

export default AppIcon;
