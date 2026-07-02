'use client';
import { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Page, Card, SectionLabel, Button } from './ui';

const XIcon = <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const LinkedInIcon = <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
const GitHubIcon = <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.6 0-12 5.4-12 12 0 5.3 3.4 9.8 8.2 11.4.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2 1-.3 2-.4 3-.4s2 .1 3 .4c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.8-1.6 8.2-6.1 8.2-11.4 0-6.6-5.4-12-12-12z"/></svg>;

const ContactApp = () => {
  const [formData, setFormData] = useState({ name: '', email: '', query: '' });
  const [errors, setErrors] = useState({ name: '', email: '', query: '' });
  const [sending, setSending] = useState(false);

  const validate = () => {
    const e = { name: '', email: '', query: '' };
    let ok = true;
    if (!formData.name.trim() || formData.name.trim().length < 2) { e.name = 'Name required (2+ chars)'; ok = false; }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { e.email = 'Valid email required'; ok = false; }
    if (!formData.query.trim() || formData.query.trim().length < 10) { e.query = 'Message required (10+ chars)'; ok = false; }
    setErrors(e);
    return ok;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSending(true);
    try {
      await axios.post('/api/contact', formData);
      toast.success('Message sent!');
      setFormData({ name: '', email: '', query: '' });
    } catch (err) {
      toast.error(err.response?.status === 429 ? 'Too many requests.' : 'Failed to send.');
    } finally { setSending(false); }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const inputBase = 'w-full rounded-[7px] px-3 py-2 text-[13px] text-white/90 placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#0A84FF]/50 transition-all';
  const inputBg = { background: '#323234', border: '1px solid rgba(255,255,255,0.08)' };
  const inputErr = { background: '#323234', border: '1px solid rgba(248,113,113,0.4)' };

  return (
    <Page>
      <p className="text-[12px] text-white/40 mb-4">Get in touch — I&apos;ll get back to you soon.</p>

      <Card className="mb-4">
        <form onSubmit={handleSubmit} className="p-3.5 space-y-3.5">
          <div>
            <SectionLabel>Name</SectionLabel>
            <input type="text" name="name" value={formData.name} onChange={handleChange} maxLength={30}
              placeholder="Your Name" className={inputBase} style={errors.name ? inputErr : inputBg} />
            {errors.name && <p className="text-red-400/80 text-[10px] mt-1">{errors.name}</p>}
          </div>
          <div>
            <SectionLabel>Email</SectionLabel>
            <input type="email" name="email" value={formData.email} onChange={handleChange} maxLength={50}
              placeholder="you@example.com" className={inputBase} style={errors.email ? inputErr : inputBg} />
            {errors.email && <p className="text-red-400/80 text-[10px] mt-1">{errors.email}</p>}
          </div>
          <div>
            <SectionLabel>Message</SectionLabel>
            <textarea name="query" value={formData.query} onChange={handleChange} rows={4} maxLength={500}
              placeholder="Your message..." className={`${inputBase} resize-none`} style={errors.query ? inputErr : inputBg} />
            {errors.query && <p className="text-red-400/80 text-[10px] mt-1">{errors.query}</p>}
            <p className="text-right text-[10px] text-white/20 mt-0.5">{formData.query.length}/500</p>
          </div>
          <button type="submit" disabled={sending}
            className={`w-full inline-flex items-center justify-center py-2.5 rounded-[7px] text-[12px] font-medium text-white bg-[#0A84FF] hover:bg-[#0a78e8] shadow-sm transition-all active:scale-[0.97] ${sending ? 'opacity-60 cursor-not-allowed' : ''}`}>
            {sending ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </Card>

      <SectionLabel>Find me on</SectionLabel>
      <Card>
        <div className="divide-y divide-white/[0.06]">
          <a href={process.env.NEXT_PUBLIC_X_URL || '#'} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3.5 py-2.5 text-[12.5px] text-white/70 hover:bg-white/[0.04] transition-colors">
            {XIcon}<span>X (Twitter)</span>
            <svg className="w-3 h-3 ml-auto text-white/25" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
          </a>
          <a href={process.env.NEXT_PUBLIC_LINKEDIN_URL || '#'} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3.5 py-2.5 text-[12.5px] text-white/70 hover:bg-white/[0.04] transition-colors">
            {LinkedInIcon}<span>LinkedIn</span>
            <svg className="w-3 h-3 ml-auto text-white/25" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
          </a>
          <a href="https://github.com/xauravww" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3.5 py-2.5 text-[12.5px] text-white/70 hover:bg-white/[0.04] transition-colors">
            {GitHubIcon}<span>GitHub</span>
            <svg className="w-3 h-3 ml-auto text-white/25" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
          </a>
        </div>
      </Card>

      <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar newestOnTop closeOnClick theme="dark" />
    </Page>
  );
};

export default ContactApp;
