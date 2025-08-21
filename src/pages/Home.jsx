'use client';
import React, { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/all";
import PropTypes from 'prop-types';
import { Link as ScrollLink } from "react-scroll";
import Typewriter from "typewriter-effect";
import InteractiveTerminal from "../components/InteractiveTerminal";

const Home = ({ containerId }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Initial animation sequence
    const tl = gsap.timeline({ 
      onComplete: () => setIsLoaded(true) 
    });
    
    tl.fromTo(".home-intro-overlay", 
      { opacity: 1 },
      { opacity: 0, duration: 1, delay: 0.5 }
    );
    
    tl.fromTo(".home-name",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );
    
    tl.fromTo(".home-title",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
      "-=0.4"
    );
    
    tl.fromTo(".home-description",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
      "-=0.3"
    );
    
    tl.fromTo(".cta-button",
      { opacity: 0, y: 20, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.7)" },
      "-=0.2"
    );
    
    // Scroll-based animations
    gsap.fromTo(".scroll-indicator",
      { opacity: 0, y: -10 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1,
        delay: 2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
      }
    );
    
    // Clean up animations on unmount
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      gsap.killTweensOf(".home-name, .home-title, .home-description, .cta-button, .scroll-indicator");
    };
  }, []);

  // Keyboard shortcuts and terminal events
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        setIsTerminalOpen(true);
      }
      if (e.key === 'Escape' && isTerminalOpen) {
        setIsTerminalOpen(false);
      }
    };

    const handleCloseTerminal = () => {
      setIsTerminalOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('closeTerminal', handleCloseTerminal);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('closeTerminal', handleCloseTerminal);
    };
  }, [isTerminalOpen]);

  return (
    <div
      className="container-home min-h-screen flex flex-col justify-center items-center relative z-1 py-16 md:py-24 overflow-hidden"
      id={containerId}
    >
      {/* Initial loading overlay */}
      <div className="home-intro-overlay absolute top-0 left-0 h-full w-full bg-[var(--bg-dark)] z-[10] flex items-center justify-center">
        <div className="text-[var(--accent-blue)] text-4xl">SM</div>
      </div>
      
      <div className="mask absolute top-0 left-0 h-full w-full bg-[rgba(0,0,0,0.6)] z-[2]"></div>
      <div className="pattern2 absolute top-0 left-0 right-0 h-full w-full bg-[url('/assets/pattern2.png')] z-[1] backdrop-blur bg-fixed bg-center bg-norepeat- bg-cover"></div>

      <div className="home-content-block flex flex-col items-center justify-center text-center z-[3] px-4">
        <p className="home-title text-xl md:text-2xl lg:text-3xl font-medium text-[var(--text-medium)] mb-2">
          Hey, I&apos;m
        </p>
        <h1 className="home-name font-['Cyborg'] text-6xl md:text-8xl lg:text-9xl font-bold text-[var(--text-light)] mb-4 md:mb-6 tracking-tight">
          Saurav Maheshwari
        </h1>
        <p className="home-description text-lg md:text-xl lg:text-2xl text-[var(--text-medium)] max-w-xl md:max-w-2xl mb-8 md:mb-10">
          Turning ideas into interactive experiences where{" "}
          <span className="text-[#f3d800] font-semibold">
            <Typewriter
              options={{
                strings: [
                  'innovation meets interaction',
                  'creativity comes alive',
                  'design meets functionality',
                  'user experience is key'
                ],
                autoStart: true,
                loop: true,
                delay: 75,
                deleteSpeed: 50,
                cursor: "|",
              }}
            />
          </span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <ScrollLink
            to="section3"
            spy={true}
            smooth={true}
            offset={0}
            duration={500}
            className="cta-button inline-block bg-[#f3d800] text-black font-semibold py-3 px-8 rounded-md text-lg md:text-xl hover:bg-[#f3d800]/90 hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg"
          >
            View My Work
          </ScrollLink>
          
          <button
            onClick={() => setIsTerminalOpen(true)}
            className="terminal-button inline-flex items-center gap-2 bg-[#0d1117] border border-[#30363d] text-[#e6edf3] font-semibold py-3 px-8 rounded-md text-lg md:text-xl hover:bg-[#161b22] hover:border-[#58a6ff] hover:scale-105 transition-all duration-300 shadow-lg group cursor-pointer"
            title="Open Terminal (Ctrl + `)"
          >
            <span>💻</span>
            Show Terminal
            <span className="text-xs opacity-60 group-hover:opacity-100 transition-opacity">
              Ctrl+`
            </span>
          </button>
        </div>
        
        {/* Scroll indicator */}
        <div className="scroll-indicator absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center opacity-0">
          <p className="text-[var(--text-medium)] text-sm mb-2">Scroll Down</p>
          <svg className="w-6 h-6 text-[var(--text-medium)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* Terminal Modal */}
      {isTerminalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between bg-[#161b22] px-4 py-3 border-b border-[#30363d] rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-[#ff5f56] rounded-full"></div>
                  <div className="w-3 h-3 bg-[#ffbd2e] rounded-full"></div>
                  <div className="w-3 h-3 bg-[#27ca3f] rounded-full"></div>
                </div>
                <span className="text-[#e6edf3] font-medium">
                  💻 Interactive Terminal - Saurav's Portfolio
                </span>
              </div>
              
              <button
                onClick={() => setIsTerminalOpen(false)}
                className="text-[#8b949e] hover:text-[#e6edf3] transition-colors p-1"
                aria-label="Close terminal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Terminal Content */}
            <div className="bg-[#0d1117] rounded-b-lg overflow-hidden">
              <InteractiveTerminal />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

Home.propTypes = {
    containerId: PropTypes.string.isRequired,
};

export default Home;