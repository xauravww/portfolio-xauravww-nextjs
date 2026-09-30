'use client';
import { useState } from 'react';
import {
  CaretLeft, CaretRight, ArrowClockwise, TextAlignLeft, Globe as GlobeIcon,
  ArrowSquareOut, House,
} from '@phosphor-icons/react';
import { useWindows } from '../../../context/windowContext';
import { Centered } from './ui';
import AppIcon from '../AppIcon';

const PROXY_URL = process.env.NEXT_PUBLIC_PROXY_URL || '';

const Back = <CaretLeft size={16} weight="bold" />;
const Fwd = <CaretRight size={16} weight="bold" />;
const Reload = <ArrowClockwise size={14} weight="bold" />;
const Reader = <TextAlignLeft size={14} weight="bold" className="shrink-0" />;
const Globe = <GlobeIcon size={14} weight="bold" className="shrink-0" />;
const OpenExt = <ArrowSquareOut size={14} weight="bold" />;
const HomeIcon = <House size={18} weight="bold" />;

const BOOKMARKS = [
  { id: 'github', name: 'GitHub', url: process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/xauravww', title: 'GitHub — xauravww' },
  { id: 'linkedin', name: 'LinkedIn', url: process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://linkedin.com/in/itsmesaurav', title: 'LinkedIn — Saurav Maheshwari' },
  { id: 'x', name: 'X', url: process.env.NEXT_PUBLIC_X_URL || 'https://x.com/xauravww', title: 'X — xauravww' },
];

function hostOf(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return url; }
}

function proxyUrl(url, mode) {
  if (!PROXY_URL) return url;
  const endpoint = mode === 'web' ? '/web' : '/reader';
  return `${PROXY_URL}${endpoint}?url=${encodeURIComponent(url)}`;
}

const ReaderView = ({ page }) => (
  <div className="reader mx-auto max-w-[720px] px-6 py-8">
    <h1 className="reader-title">{page.title}</h1>
    {page.meta && <p className="reader-meta">{page.meta}</p>}
    <div dangerouslySetInnerHTML={{ __html: page.content || '' }} />
    <div className="mt-10 pt-5 border-t border-white/[0.08] text-center">
      <a href={page.url} target="_blank" rel="noopener noreferrer"
        className="text-[12px] text-[#0A84FF] hover:underline">Read on {hostOf(page.url)} ↗</a>
    </div>
  </div>
);

const WebView = ({ url, nonce }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const src = proxyUrl(url, 'web');

  return (
    <div className="relative w-full h-full">
      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#1c1c1e]">
          <div className="w-5 h-5 border-2 border-white/20 border-t-white/70 rounded-full animate-spin" />
        </div>
      )}
      {error ? (
        <div className="flex flex-col items-center justify-center h-full gap-3 text-white/50">
          <span className="text-[13px]">Failed to load page</span>
          <a href={url} target="_blank" rel="noopener noreferrer"
            className="text-[12px] text-[#0A84FF] hover:underline">Open externally ↗</a>
        </div>
      ) : (
        <iframe
          key={nonce}
          src={src}
          className="w-full h-full border-0"
          sandbox="allow-same-origin allow-forms allow-scripts"
          onLoad={() => setLoading(false)}
          onError={() => { setLoading(false); setError(true); }}
        />
      )}
    </div>
  );
};

const isBlockedOrStrict = (url) => {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return host.includes('linkedin.com') || host.includes('x.com') || host.includes('twitter.com');
  } catch {
    return false;
  }
};


const SafariApp = () => {
  const { browser, browserBack, browserForward, openBrowser, browserHome } = useWindows();
  const page = browser.history[browser.index] || null;
  const canBack = browser.index >= 0;
  const canFwd = browser.index < browser.history.length - 1;
  const [nonce, setNonce] = useState(0);
  const [viewMode, setViewMode] = useState(null); // null = use page.mode default

  if (!page) {
    return (
      <div className="flex flex-col h-full bg-[#1e1e1e] text-white select-none">
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-3 h-[42px] shrink-0 border-b border-white/[0.06]"
          style={{ background: 'linear-gradient(180deg,#343436,#2c2c2e)' }}>
          <div className="flex items-center gap-0.5">
            <button disabled className="w-7 h-7 rounded-[6px] flex items-center justify-center text-white/35">{Back}</button>
            <button disabled className="w-7 h-7 rounded-[6px] flex items-center justify-center text-white/35">{Fwd}</button>
          </div>
          <div className="flex-1 flex items-center gap-1.5 h-[26px] px-3 rounded-[7px] bg-black/25 text-white/30 min-w-0">
            {Globe}
            <span className="text-[12px] truncate">Search or enter website name</span>
          </div>
        </div>

        {/* Start Page Content */}
        <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-start mt-8">
          <div className="w-full max-w-[340px]">
            <h2 className="text-[16px] font-semibold text-white/95 mb-5 text-left px-2">Favorites</h2>
            <div className="grid grid-cols-4 gap-4 justify-items-center">
              {BOOKMARKS.map((bookmark) => (
                <button
                  key={bookmark.id}
                  onClick={() => window.open(bookmark.url, '_blank')}
                  className="flex flex-col items-center gap-1.5 group w-[72px] focus:outline-none"
                >
                  <div className="w-[50px] h-[50px] rounded-[22%] overflow-hidden shadow-md active:scale-95 group-hover:brightness-110 transition-all">
                    <AppIcon appId={bookmark.id} className="w-full h-full" />
                  </div>
                  <span className="text-[11px] text-white/55 font-medium text-center truncate w-full px-1 group-hover:text-white/80 transition-colors">
                    {bookmark.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const mode = viewMode || page.mode || 'reader';
  const isWeb = mode === 'web' && PROXY_URL;

  const toggleMode = () => {
    if (!PROXY_URL) return;
    setViewMode(prev => {
      const current = prev || page.mode || 'reader';
      return current === 'reader' ? 'web' : 'reader';
    });
  };

  return (
    <div className="flex flex-col h-full select-none">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 h-[42px] shrink-0 border-b border-white/[0.06]"
        style={{ background: 'linear-gradient(180deg,#343436,#2c2c2e)' }}>
        <div className="flex items-center gap-0.5">
          <button onClick={browserBack} disabled={!canBack}
            className="w-7 h-7 rounded-[6px] flex items-center justify-center text-white/70 hover:bg-white/[0.08] disabled:opacity-25 transition-colors" title="Back">{Back}</button>
          <button onClick={browserForward} disabled={!canFwd}
            className="w-7 h-7 rounded-[6px] flex items-center justify-center text-white/70 hover:bg-white/[0.08] disabled:opacity-25 transition-colors" title="Forward">{Fwd}</button>
          <button onClick={browserHome}
            className="w-7 h-7 rounded-[6px] flex items-center justify-center text-white/70 hover:bg-white/[0.08] transition-colors" title="Start Page">{HomeIcon}</button>
        </div>

        {/* Address bar */}
        <div className="flex-1 flex items-center gap-1.5 h-[26px] px-3 rounded-[7px] bg-black/25 text-white/60 min-w-0">
          {isWeb ? Globe : Reader}
          <span className="text-[12px] truncate">{hostOf(page.url)}</span>
          <span className="ml-auto text-[10px] text-white/30 shrink-0">{isWeb ? 'Web' : 'Reader'}</span>
        </div>

        {PROXY_URL && (
          <button onClick={toggleMode} title={isWeb ? 'Switch to Reader' : 'Switch to Web'}
            className="w-7 h-7 rounded-[6px] flex items-center justify-center text-white/60 hover:bg-white/[0.08] transition-colors">
            {isWeb ? Reader : Globe}
          </button>
        )}
        <button onClick={() => setNonce(n => n + 1)} title="Reload"
          className="w-7 h-7 rounded-[6px] flex items-center justify-center text-white/60 hover:bg-white/[0.08] transition-colors">{Reload}</button>
        <a href={page.url} target="_blank" rel="noopener noreferrer" title="Open on site"
          className="w-7 h-7 rounded-[6px] flex items-center justify-center text-white/60 hover:bg-white/[0.08] transition-colors">{OpenExt}</a>
      </div>

      {/* Warning Banner for frame-restricted sites */}
      {isWeb && isBlockedOrStrict(page.url) && (
        <div className="bg-[#FF9500]/15 border-b border-[#FF9500]/30 px-3 py-1.5 flex items-center justify-between text-[11px] text-[#FF9500] gap-2 shrink-0">
          <span className="truncate">This site restricts framing. If it appears blank, open it externally.</span>
          <a href={page.url} target="_blank" rel="noopener noreferrer" className="bg-[#FF9500] hover:bg-[#FF9500]/95 text-black px-2.5 py-0.5 rounded-[4px] font-semibold shrink-0 transition-colors">
            Open Externally ↗
          </a>
        </div>
      )}

      {/* Content */}
      <div className={`flex-1 ${isWeb ? '' : 'overflow-y-auto custom-scrollbar'}`}>
        {isWeb ? (
          <WebView url={page.url} nonce={nonce} />
        ) : (
          <ReaderView key={`${browser.index}-${nonce}`} page={page} />
        )}
      </div>
    </div>
  );
};

export default SafariApp;
