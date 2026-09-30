'use client';
import { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { XLogo, LinkedinLogo, GithubLogo, EnvelopeSimple, CaretRight } from '@phosphor-icons/react';
import { Page, Card, SectionLabel, Button } from './ui';

const XIcon = <XLogo size={16} weight="fill" />;
const LinkedInIcon = <LinkedinLogo size={16} weight="fill" />;
const GitHubIcon = <GithubLogo size={16} weight="fill" />;
const EmailIcon = <EnvelopeSimple size={16} weight="bold" />;

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

  // macOS dark-panel input style: semi-transparent white tint + focus blue ring
  const inputBase = 'w-full rounded-[6px] px-3 py-2 text-[13px] text-white placeholder:text-white/35 outline-none border transition-all duration-150 focus:border-[#007aff] focus:ring-[3px] focus:ring-[#007aff]/35';
  const inputBg = { background: 'rgba(255, 255, 255, 0.07)', borderColor: 'rgba(255, 255, 255, 0.1)' };
  const inputErr = { background: 'rgba(255, 255, 255, 0.07)', borderColor: 'rgba(248,113,113,0.4)' };

  return (
    <Page>
      <p className="text-[12px] text-white/40 mb-4">Get in touch — I&apos;ll get back to you soon.</p>

      <Card className="mb-4">
        <form onSubmit={handleSubmit} className="p-3.5 space-y-3.5">
          <div>
            <label className="block text-[11px] font-semibold text-white/50 tracking-wide uppercase mb-1">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} maxLength={30}
              placeholder="Your Name" className={inputBase} style={errors.name ? inputErr : inputBg} />
            {errors.name && <p className="text-red-400/80 text-[10px] mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-white/50 tracking-wide uppercase mb-1">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} maxLength={50}
              placeholder="you@example.com" className={inputBase} style={errors.email ? inputErr : inputBg} />
            {errors.email && <p className="text-red-400/80 text-[10px] mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-white/50 tracking-wide uppercase mb-1">Message</label>
            <textarea name="query" value={formData.query} onChange={handleChange} rows={4} maxLength={500}
              placeholder="Your message..." className={`${inputBase} resize-none`} style={errors.query ? inputErr : inputBg} />
            {errors.query && <p className="text-red-400/80 text-[10px] mt-1">{errors.query}</p>}
            <p className="text-right text-[10px] text-white/20 mt-0.5">{formData.query.length}/500</p>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={sending}
              className={`inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-[6px] text-[12px] font-semibold text-white transition-all active:scale-[0.97] ${sending ? 'opacity-60 cursor-not-allowed' : ''}`}
              style={{
                background: 'linear-gradient(180deg, #2f97ff 0%, #0a84ff 55%, #0670e0 100%)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.28)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.08)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.filter = ''; }}
            >
              {sending ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </form>
      </Card>

      <SectionLabel>Find me on</SectionLabel>
      <Card>
        <div className="divide-y divide-white/[0.06]">
          <a href={process.env.NEXT_PUBLIC_X_URL || '#'} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3.5 py-2.5 text-[12.5px] text-white/70 hover:bg-white/[0.04] transition-colors">
            {XIcon}<span>X (Twitter)</span>
            <CaretRight size={12} weight="bold" className="ml-auto text-white/25" />
          </a>
          <a href={process.env.NEXT_PUBLIC_LINKEDIN_URL || '#'} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3.5 py-2.5 text-[12.5px] text-white/70 hover:bg-white/[0.04] transition-colors">
            {LinkedInIcon}<span>LinkedIn</span>
            <CaretRight size={12} weight="bold" className="ml-auto text-white/25" />
          </a>
          <a href="https://github.com/xauravww" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3.5 py-2.5 text-[12.5px] text-white/70 hover:bg-white/[0.04] transition-colors">
            {GitHubIcon}<span>GitHub</span>
            <CaretRight size={12} weight="bold" className="ml-auto text-white/25" />
          </a>
          <a href="mailto:sauravmaheshwari8@gmail.com"
            className="flex items-center gap-2.5 px-3.5 py-2.5 text-[12.5px] text-white/70 hover:bg-white/[0.04] transition-colors">
            {EmailIcon}
            <span>Email</span>
            <CaretRight size={12} weight="bold" className="ml-auto text-white/25" />
          </a>
        </div>
      </Card>

      <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar newestOnTop closeOnClick theme="dark" />
    </Page>
  );
};

export default ContactApp;
