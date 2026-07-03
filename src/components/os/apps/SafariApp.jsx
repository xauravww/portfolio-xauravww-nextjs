'use client';
import { useState, useEffect } from 'react';
import { useWindows } from '../../../context/windowContext';
import { Centered } from './ui';

const Back = <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>;
const Fwd = <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>;
const Reload = <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v6h6M20 20v-6h-6M20 8a8 8 0 00-14-3M4 16a8 8 0 0014 3" /></svg>;
const Lock = <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1a5 5 0 00-5 5v3H6a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2v-9a2 2 0 00-2-2h-1V6a5 5 0 00-5-5zm3 8H9V6a3 3 0 016 0v3z" /></svg>;
const Compass = <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><polygon points="16 8 10 10 8 16 14 14 16 8" fill="currentColor" stroke="none" /></svg>;
const OpenExt = <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>;

function hostOf(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return url; }
}

// Rendered when a live site refuses to be framed (X-Frame-Options / CSP).
const BlockedNotice = ({ url }) => (
  <Centered>
    <div className="text-center space-y-3 max-w-xs">
      <p className="text-[13px] text-white/60">This site can&apos;t be shown inside Safari.</p>
      <p className="text-[11.5px] text-white/35 leading-relaxed">
        {hostOf(url)} blocks embedding for security. Open it in a real browser tab instead.
      </p>
      <a href={url} target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3.5 py-[6px] rounded-[7px] text-[12px] font-medium text-white bg-[#0A84FF] hover:bg-[#0a78e8] transition-colors">
        Open in new tab
      </a>
    </div>
  </Centered>
);

const WebFrame = ({ url }) => {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  // Route through same-origin proxy so pages that block framing still render.
  const src = `/api/proxy?url=${encodeURIComponent(url)}`;

  useEffect(() => {
    setFailed(false); setLoaded(false);
    const t = setTimeout(() => setLoaded(l => { if (!l) setFailed(true); return l; }), 12000);
    return () => clearTimeout(t);
  }, [url]);

  if (failed) return <BlockedNotice url={url} />;

  return (
    <div className="relative w-full h-full">
      {!loaded && <div className="absolute inset-0"><Centered>Loading {hostOf(url)}…</Centered></div>}
      <iframe
        src={src}
        title={url}
        onLoad={() => setLoaded(true)}
        className="w-full h-full border-0 bg-white"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />
    </div>
  );
};

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

const ReaderGlyph = <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 5h16M4 9h16M4 13h10M4 17h10" /></svg>;

const SafariApp = () => {
  const { browser, browserBack, browserForward } = useWindows();
  const page = browser.history[browser.index] || null;
  const canBack = browser.index > 0;
  const canFwd = browser.index < browser.history.length - 1;
  const [nonce, setNonce] = useState(0); // force reload
  // Per-entry view override: user can flip a blog between real page and Reader.
  const [readerOn, setReaderOn] = useState(false);

  useEffect(() => { setReaderOn(page?.mode === 'reader'); }, [browser.index, page?.mode]);

  if (!page) return <Centered>No page open.</Centered>;

  const hasReader = !!page.content;
  const showReader = hasReader && readerOn;

  return (
    <div className="flex flex-col h-full bg-[#2a2a2c]">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 h-[42px] shrink-0 border-b border-white/[0.06]"
        style={{ background: 'linear-gradient(180deg,#343436,#2c2c2e)' }}>
        <div className="flex items-center gap-0.5">
          <button onClick={browserBack} disabled={!canBack}
            className="w-7 h-7 rounded-[6px] flex items-center justify-center text-white/70 hover:bg-white/[0.08] disabled:opacity-25 transition-colors">{Back}</button>
          <button onClick={browserForward} disabled={!canFwd}
            className="w-7 h-7 rounded-[6px] flex items-center justify-center text-white/70 hover:bg-white/[0.08] disabled:opacity-25 transition-colors">{Fwd}</button>
        </div>

        {/* Reader toggle (only when a reader version exists) */}
        {hasReader && (
          <button onClick={() => setReaderOn(v => !v)} title="Toggle Reader"
            className={`w-7 h-7 rounded-[6px] flex items-center justify-center transition-colors ${
              showReader ? 'bg-[#0A84FF] text-white' : 'text-white/60 hover:bg-white/[0.08]'}`}>{ReaderGlyph}</button>
        )}

        {/* Address bar */}
        <div className="flex-1 flex items-center gap-1.5 h-[26px] px-3 rounded-[7px] bg-black/25 text-white/60 min-w-0">
          {showReader ? Compass : Lock}
          <span className="text-[12px] truncate">{hostOf(page.url)}</span>
          {showReader && <span className="ml-auto text-[10px] text-white/30 shrink-0">Reader</span>}
        </div>

        <button onClick={() => setNonce(n => n + 1)} title="Reload"
          className="w-7 h-7 rounded-[6px] flex items-center justify-center text-white/60 hover:bg-white/[0.08] transition-colors">{Reload}</button>
        <a href={page.url} target="_blank" rel="noopener noreferrer" title="Open in new tab"
          className="w-7 h-7 rounded-[6px] flex items-center justify-center text-white/60 hover:bg-white/[0.08] transition-colors">{OpenExt}</a>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {showReader
          ? <ReaderView key={`r-${browser.index}-${nonce}`} page={page} />
          : <WebFrame key={`w-${browser.index}-${nonce}`} url={page.url} />}
      </div>
    </div>
  );
};

export default SafariApp;
