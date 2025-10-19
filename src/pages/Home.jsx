'use client';
import React, { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/all";
import PropTypes from 'prop-types';
import { Link as ScrollLink } from "react-scroll";
import Typewriter from "typewriter-effect";


const Home = ({ containerId }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Initial animation sequence - optimized for faster loading
    const tl = gsap.timeline({ 
      onComplete: () => setIsLoaded(true) 
    });
    
    tl.fromTo(".home-intro-overlay", 
      { opacity: 1 },
      { opacity: 0, duration: 0.4, delay: 0.1 }
    );
    
    tl.fromTo(".home-name",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
    );
    
    tl.fromTo(".home-title",
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" },
      "-=0.3"
    );
    
    tl.fromTo(".home-description",
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" },
      "-=0.2"
    );
    
    tl.fromTo(".cta-button",
      { opacity: 0, y: 15, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "back.out(1.2)" },
      "-=0.1"
    );
    
    // Scroll-based animations - faster appearance
    gsap.fromTo(".scroll-indicator",
      { opacity: 0, y: -10 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6,
        delay: 1.2,
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
        <div className="home-description text-lg md:text-xl lg:text-2xl text-[var(--text-medium)] max-w-xl md:max-w-2xl mb-8 md:mb-10">
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
        </div>

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
        </div>
        
        {/* Scroll indicator */}
        <div className="scroll-indicator absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center opacity-0">
          <p className="text-[var(--text-medium)] text-sm mb-2">Scroll Down</p>
          <svg className="w-6 h-6 text-[var(--text-medium)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

    
    </div>
  );
};

Home.propTypes = {
    containerId: PropTypes.string.isRequired,
};

export default Home;