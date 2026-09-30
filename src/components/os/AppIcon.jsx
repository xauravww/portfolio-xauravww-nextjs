'use client';
import { useId } from 'react';
// Phosphor — MIT-licensed icons drawn in Apple's design language
import {
  User, Code, FolderOpen, Briefcase, NotePencil, GraduationCap,
  EnvelopeSimple, FileText, MusicNotesSimple, Compass, Joystick,
  GithubLogo, LinkedinLogo, XLogo, SquaresFour, Hash, Stack,
} from '@phosphor-icons/react';

// Proper macOS Big Sur squircle (superellipse) — measured continuous-corner path on 100x100
const SQUIRCLE = 'M100,50 C100,89.5 89.5,100 50,100 C10.5,100 0,89.5 0,50 C0,10.5 10.5,0 50,0 C89.5,0 100,10.5 100,50 Z';

const white = (o) => `rgba(255,255,255,${o})`;

const AppIcon = ({ appId, className = '' }) => {
  const icon = ICONS[appId];
  const uniqueId = useId();
  if (!icon) return null;

  const idSafe = uniqueId.replace(/:/g, '-');
  const cid = `sq-${appId}-${idSafe}`;
  const bgId = `bg-${appId}-${idSafe}`;
  const shadeId = `shade-${appId}-${idSafe}`;
  const shadowId = `gshadow-${appId}-${idSafe}`;

  const Glyph = icon.Glyph;

  return (
    <div className={`relative ${className}`} style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.18)) drop-shadow(0 8px 20px rgba(0,0,0,0.22))' }}>
      <svg viewBox="0 0 100 100" className="w-full h-full block">
        <defs>
          <clipPath id={cid}><path d={SQUIRCLE} /></clipPath>
          <linearGradient id={bgId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={icon.c1} />
            <stop offset="100%" stopColor={icon.c2} />
          </linearGradient>
          {/* Matte lighting overlay */}
          <linearGradient id={shadeId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.16)" />
            <stop offset="55%" stopColor="rgba(255,255,255,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.08)" />
          </linearGradient>
          {/* Lifts the glyph off the tile */}
          <filter id={shadowId} x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1.6" floodColor="#000000" floodOpacity="0.35" />
          </filter>
        </defs>
        <g clipPath={`url(#${cid})`}>
          {/* Base gradient */}
          <rect width="100" height="100" fill={`url(#${bgId})`} />
          {/* Matte lighting overlay */}
          <rect width="100" height="100" fill={`url(#${shadeId})`} />
          {/* Phosphor glyph, foreignObject lets it keep its own duotone coloring */}
          <foreignObject x="0" y="0" width="100" height="100">
            <div
              xmlns="http://www.w3.org/1999/xhtml"
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                filter: 'drop-shadow(0 1.5px 1.6px rgba(0,0,0,0.35))',
              }}
            >
              <Glyph
                color="rgba(255,255,255,0.96)"
                weight="duotone"
                duotoneColor="rgba(255,255,255,0.35)"
                size="55%"
              />
            </div>
          </foreignObject>
          {/* Hairline top-edge light catch */}
          <path d={SQUIRCLE} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="0.8" />
        </g>
      </svg>
    </div>
  );
};

/* Apple system-color gradients (c1/c2) + a Phosphor glyph per app.
   `duotone` weight renders the interior at 35% white for Apple-style depth. */
const ICONS = {
  about:       { c1: '#5AC8FA', c2: '#0A84FF', Glyph: User },
  techstack:   { c1: '#34D399', c2: '#059669', Glyph: Code },
  projects:    { c1: '#64D2FF', c2: '#0A84FF', Glyph: FolderOpen },
  experience:  { c1: '#DA8FFF', c2: '#AF52DE', Glyph: Briefcase },
  blogs:       { c1: '#FF6482', c2: '#FF2D55', Glyph: NotePencil },
  education:   { c1: '#FFB340', c2: '#FF9500', Glyph: GraduationCap },
  contact:     { c1: '#64D2FF', c2: '#0A84FF', Glyph: EnvelopeSimple },
  safari:      { c1: '#E8EDF2', c2: '#AEB8C2', Glyph: Compass },
  music:       { c1: '#FF517F', c2: '#FF2D55', Glyph: MusicNotesSimple },
  resume:      { c1: '#5B6B82', c2: '#2D3748', Glyph: FileText },
  folderGames: { c1: '#64D2FF', c2: '#0A84FF', Glyph: Joystick },
  game2048:    { c1: '#F2C94C', c2: '#E8A400', Glyph: Hash },
  snake:       { c1: '#34D399', c2: '#059669', Glyph: Stack },
  tictactoe:   { c1: '#FF6482', c2: '#FF2D55', Glyph: SquaresFour },
  breakout:    { c1: '#0A9BD8', c2: '#005582', Glyph: SquaresFour },
  github:      { c1: '#2c2c2e', c2: '#111111', Glyph: GithubLogo },
  linkedin:    { c1: '#0077B5', c2: '#005582', Glyph: LinkedinLogo },
  x:           { c1: '#222222', c2: '#000000', Glyph: XLogo },
  showwcase:   { c1: '#000000', c2: '#1b1b1b', Glyph: SquaresFour },
};

export default AppIcon;
