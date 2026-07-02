'use client';
import { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

  const inputCls = (field) => `w-full bg-white/[0.03] border ${errors[field] ? 'border-red-400/60' : 'border-white/[0.08]'} text-heading placeholder:text-white/20 px-3 py-2 rounded-lg text-[13px] focus:outline-none focus:ring-1 focus:ring-gold/40 transition-colors`;

  return (
    <div className="p-5 md:p-6">
      <p className="text-white/30 text-[11px] mb-5">Get in touch — I&apos;ll get back to you soon.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-[11px] text-white/40 font-medium mb-1 block">Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} maxLength={30} placeholder="Your Name" className={inputCls('name')} />
          {errors.name && <p className="text-red-400 text-[10px] mt-0.5">{errors.name}</p>}
        </div>
        <div>
          <label className="text-[11px] text-white/40 font-medium mb-1 block">Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} maxLength={50} placeholder="you@example.com" className={inputCls('email')} />
          {errors.email && <p className="text-red-400 text-[10px] mt-0.5">{errors.email}</p>}
        </div>
        <div>
          <label className="text-[11px] text-white/40 font-medium mb-1 block">Message</label>
          <textarea name="query" value={formData.query} onChange={handleChange} rows={4} maxLength={500} placeholder="Your message..." className={`${inputCls('query')} resize-none`} />
          {errors.query && <p className="text-red-400 text-[10px] mt-0.5">{errors.query}</p>}
          <p className="text-right text-[10px] text-white/20 mt-0.5">{formData.query.length}/500</p>
        </div>
        <button type="submit" disabled={sending}
          className={`w-full bg-gold text-inverse py-2.5 rounded-lg text-[12px] font-semibold hover:bg-gold/90 transition-colors ${sending ? 'opacity-60 cursor-not-allowed' : ''}`}>
          {sending ? 'Sending...' : 'Send Message'}
        </button>
      </form>

      {/* Social links */}
      <div className="flex items-center gap-3 mt-5 pt-4 border-t border-white/[0.06]">
        <span className="text-[10px] text-white/20">Find me on</span>
        <a href={process.env.NEXT_PUBLIC_X_URL || '#'} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/60 transition-colors">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </a>
        <a href={process.env.NEXT_PUBLIC_LINKEDIN_URL || '#'} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/60 transition-colors">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
        </a>
        <a href="https://github.com/xauravww" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/60 transition-colors">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
        </a>
      </div>

      <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar newestOnTop closeOnClick theme="dark" />
    </div>
  );
};

export default ContactApp;
