'use client';
import OptimizedImage from '../../OptimizedImage';

const AboutApp = () => (
  <div className="p-5 md:p-7">
    <div className="flex flex-col md:flex-row gap-5 items-center md:items-start">
      <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden ring-2 ring-gold/30 shrink-0">
        <OptimizedImage src="/images/author.jpeg" alt="Saurav Maheshwari" width={128} height={128} className="object-cover w-full h-full" />
      </div>
      <div className="space-y-2.5 text-center md:text-left flex-1 min-w-0">
        <div>
          <h2 className="text-lg font-bold text-heading">Saurav Maheshwari</h2>
          <p className="text-gold text-xs font-medium mt-0.5">Full-Stack Developer</p>
        </div>
        <p className="text-body text-[13px] leading-relaxed">
          Passionate about building AI-powered solutions and modern web applications.
          I work across the stack with React, Node.js, and cloud technologies — creating
          products that merge clean architecture with thoughtful design.
        </p>
        <p className="text-body text-[13px] leading-relaxed">
          When I&apos;m not coding, I write about web development and contribute to open-source projects.
        </p>
        <div className="flex flex-wrap gap-1.5 pt-1 justify-center md:justify-start">
          {['React', 'Node.js', 'Next.js', 'TypeScript', 'AI/ML', 'MongoDB'].map(t => (
            <span key={t} className="px-2 py-[3px] bg-gold/10 text-gold text-[10px] font-medium rounded-full border border-gold/15">{t}</span>
          ))}
        </div>
        <div className="flex gap-2 pt-2 justify-center md:justify-start">
          <a href="https://github.com/xauravww" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-[11px] font-medium text-heading hover:bg-white/10 transition-colors">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </a>
          <a href="https://xauravww.hashnode.dev" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-[11px] font-medium text-heading hover:bg-white/10 transition-colors">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.351 8.019l-6.37-6.37a5.63 5.63 0 00-7.962 0l-6.37 6.37a5.63 5.63 0 000 7.962l6.37 6.37a5.63 5.63 0 007.962 0l6.37-6.37a5.63 5.63 0 000-7.962zM12 15.953a3.953 3.953 0 110-7.906 3.953 3.953 0 010 7.906z"/></svg>
            Blog
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default AboutApp;
