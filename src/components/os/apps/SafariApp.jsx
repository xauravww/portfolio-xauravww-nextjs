'use client';
import { useState } from 'react';
import { useWindows } from '../../../context/windowContext';
import { Centered } from './ui';

const Back = <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>;
const Fwd = <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>;
const Reload = <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v6h6M20 20v-6h-6M20 8a8 8 0 00-14-3M4 16a8 8 0 0014 3" /></svg>;
const Reader = <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 5h16M4 9h16M4 13h10M4 17h10" /></svg>;
const OpenExt = <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>;

function hostOf(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return url; }
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

const SafariApp = () => {
  const { browser, browserBack, browserForward } = useWindows();
  const page = browser.history[browser.index] || null;
  const canBack = browser.index > 0;
  const canFwd = browser.index < browser.history.length - 1;
  const [nonce, setNonce] = useState(0); // force re-render / scroll reset

  if (!page) return <Centered>No page open.</Centered>;

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

        {/* Address bar */}
        <div className="flex-1 flex items-center gap-1.5 h-[26px] px-3 rounded-[7px] bg-black/25 text-white/60 min-w-0">
          {Reader}
          <span className="text-[12px] truncate">{hostOf(page.url)}</span>
          <span className="ml-auto text-[10px] text-white/30 shrink-0">Reader</span>
        </div>

        <button onClick={() => setNonce(n => n + 1)} title="Reload"
          className="w-7 h-7 rounded-[6px] flex items-center justify-center text-white/60 hover:bg-white/[0.08] transition-colors">{Reload}</button>
        <a href={page.url} target="_blank" rel="noopener noreferrer" title="Open on site"
          className="w-7 h-7 rounded-[6px] flex items-center justify-center text-white/60 hover:bg-white/[0.08] transition-colors">{OpenExt}</a>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <ReaderView key={`${browser.index}-${nonce}`} page={page} />
      </div>
    </div>
  );
};

export default SafariApp;
