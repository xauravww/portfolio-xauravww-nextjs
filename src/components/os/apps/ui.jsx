'use client';
// Shared macOS System Settings / inspector style primitives.
// Content surface = #2a2a2c. Grouped cards = #363638. Hairline = rgba(255,255,255,0.08).

// Padded page wrapper
export const Page = ({ children, className = '' }) => (
  <div className={`p-4 md:p-5 ${className}`}>{children}</div>
);

// Grouped card — rounded container holding rows / content
export const Card = ({ children, className = '', inset = false }) => (
  <div
    className={`rounded-[10px] border border-white/[0.06] overflow-hidden ${className}`}
    style={{ background: inset ? '#323234' : '#363638' }}
  >
    {children}
  </div>
);

// A row inside a Card (label left, value/control right). Auto hairline via parent divide.
export const Row = ({ left, right, onClick, className = '' }) => (
  <div
    onClick={onClick}
    className={`flex items-center justify-between gap-3 px-3.5 py-2.5 ${onClick ? 'cursor-default hover:bg-white/[0.04] active:bg-white/[0.06] transition-colors' : ''} ${className}`}
  >
    <div className="min-w-0 flex items-center gap-2.5">{left}</div>
    {right != null && <div className="shrink-0 flex items-center gap-2 text-white/45 text-[12px]">{right}</div>}
  </div>
);

// Hairline-divided list of rows
export const List = ({ children, className = '' }) => (
  <div className={`divide-y divide-white/[0.06] ${className}`}>{children}</div>
);

// Uppercase group header above a card (macOS System Settings style)
export const SectionLabel = ({ children, className = '' }) => (
  <div className={`text-[11px] font-semibold uppercase tracking-wide text-white/35 px-1 mb-1.5 ${className}`}>
    {children}
  </div>
);

// macOS button — default (grey) or accent (blue) or tinted
export const Button = ({ children, onClick, href, variant = 'default', className = '', icon }) => {
  const base = 'inline-flex items-center justify-center gap-1.5 px-3.5 py-[6px] rounded-[7px] text-[12px] font-medium transition-all duration-100 active:scale-[0.97] select-none cursor-default';
  const styles = {
    default: 'text-white/90 border border-white/[0.12] hover:brightness-125',
    accent: 'text-white bg-[#0A84FF] hover:bg-[#0a78e8] shadow-sm',
    subtle: 'text-white/70 hover:bg-white/[0.06]',
  };
  const style = variant === 'default'
    ? { background: 'linear-gradient(180deg, #4a4a4c, #3e3e40)', boxShadow: '0 1px 1px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)' }
    : undefined;
  const cls = `${base} ${styles[variant]} ${className}`;
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer" className={cls} style={style}>{icon}{children}</a>;
  return <button onClick={onClick} className={cls} style={style}>{icon}{children}</button>;
};

// Capsule tag — neutral grey (macOS token) or accent-tinted
export const Tag = ({ children, tint }) => (
  <span
    className="px-2.5 py-[3px] rounded-full text-[11px] font-medium"
    style={tint
      ? { background: `${tint}22`, color: tint }
      : { background: 'rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.75)' }}
  >
    {children}
  </span>
);

// Rounded avatar / thumbnail
export const Avatar = ({ src, alt, size = 72, radius = 16 }) => (
  <div
    className="shrink-0 overflow-hidden ring-1 ring-white/10 bg-white/5"
    style={{ width: size, height: size, borderRadius: radius }}
  >
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={src} alt={alt} className="w-full h-full object-cover" />
  </div>
);

// Sidebar item (for master-detail apps like Experience / Education)
export const SidebarItem = ({ active, title, subtitle, onClick, showChevron }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-3 py-2.5 rounded-[7px] mb-0.5 transition-colors flex items-center justify-between gap-3 ${
      active ? 'bg-[#0A84FF] text-white' : 'text-white/70 hover:bg-white/[0.06]'}`}
  >
    <div className="min-w-0 flex-1">
      <div className="text-[12.5px] font-medium leading-tight truncate">{title}</div>
      {subtitle && <div className={`text-[11px] leading-tight truncate mt-0.5 ${active ? 'text-white/80' : 'text-white/35'}`}>{subtitle}</div>}
    </div>
    {showChevron && (
      <svg className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-white/70' : 'text-white/30'}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    )}
  </button>
);

// Empty / loading centered state
export const Centered = ({ children }) => (
  <div className="flex items-center justify-center h-full min-h-[220px] text-white/30 text-[13px]">{children}</div>
);
