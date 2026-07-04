'use client';
import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PropTypes from 'prop-types';
import OptimizedImage from '../components/OptimizedImage';

const About = ({ containerId }) => {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo('.about-content',
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: `#${containerId}`, start: 'top 70%', once: true }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [containerId]);

  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden py-16 md:py-24"
      id={containerId}
    >
      <div className="section-overlay" />

      <header className="section-content text-center mb-12 md:mb-16">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-heading tracking-tight">
          About Me
        </h2>
        <div className="mt-3 mx-auto w-16 h-1 bg-gold rounded-full" />
      </header>

      <div className="about-content section-content w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-surface/70 backdrop-blur-sm rounded-xl p-6 md:p-10 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-10 items-center">
            <div className="md:col-span-2 flex justify-center">
              <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden ring-2 ring-gold/30 shadow-lg">
                <OptimizedImage
                  src="/images/author.jpeg"
                  alt="Saurav Maheshwari"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 192px, 224px"
                />
              </div>
            </div>

            <div className="md:col-span-3 space-y-4">
              <h3 className="text-xl md:text-2xl font-bold text-heading">
                Saurav Maheshwari
              </h3>
              <p className="text-body text-sm md:text-base leading-relaxed">
                I&apos;m a Full-Stack Developer with a strong problem-solving mindset and a focus on automation, web scraping, and AI agents. I work daily with React, Node.js, TypeScript, and modern database designs, building everything from custom social media automations and live data agents to secure legal systems, e-commerce platforms, and international community portals.
              </p>
              <p className="text-body text-sm md:text-base leading-relaxed">
                I believe in shipping clean, simple, and high-performance code that works smoothly. Beyond development, I write about practical programming on my blog and contribute to open-source tools.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div className="bg-surface/40 border border-border/40 rounded-xl p-3.5 hover:border-gold/30 transition-colors">
                  <h4 className="text-gold font-semibold text-sm flex items-center gap-1.5">
                    <span>🤖</span> AI Agents & Data Scraping
                  </h4>
                  <p className="text-body text-xs mt-1 leading-relaxed">Building custom AI agents, LangChain workflows, and live scraping scripts.</p>
                </div>
                <div className="bg-surface/40 border border-border/40 rounded-xl p-3.5 hover:border-gold/30 transition-colors">
                  <h4 className="text-gold font-semibold text-sm flex items-center gap-1.5">
                    <span>⚙️</span> Workflow & Social Automation
                  </h4>
                  <p className="text-body text-xs mt-1 leading-relaxed">Orchestrating Telegram bots, social media automations, and cron pipelines.</p>
                </div>
                <div className="bg-surface/40 border border-border/40 rounded-xl p-3.5 hover:border-gold/30 transition-colors">
                  <h4 className="text-gold font-semibold text-sm flex items-center gap-1.5">
                    <span>💼</span> E-Commerce & Enterprise Tools
                  </h4>
                  <p className="text-body text-xs mt-1 leading-relaxed">Developing secure legal systems, project managers, and shopping platforms.</p>
                </div>
                <div className="bg-surface/40 border border-border/40 rounded-xl p-3.5 hover:border-gold/30 transition-colors">
                  <h4 className="text-gold font-semibold text-sm flex items-center gap-1.5">
                    <span>🌐</span> Communities & Rich Landing Sites
                  </h4>
                  <p className="text-body text-xs mt-1 leading-relaxed">Crafting international portal hubs and responsive, stunning landing pages.</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <a
                  href="https://github.com/xauravww"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-surface border border-border px-5 py-2.5 rounded-lg text-sm font-medium text-heading hover:bg-border/50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

About.propTypes = {
  containerId: PropTypes.string.isRequired,
};

export default About;
