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

    tl.fromTo(".home-description",
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" },
      "-=0.3"
    );
    
    // Scroll-based animations - smoother appearance
    gsap.fromTo(".scroll-indicator",
      { opacity: 0, y: -10 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
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
      <div className="home-intro-overlay absolute top-0 left-0 h-full w-full bg-surface z-[10] flex items-center justify-center">
        <div className="text-gold text-4xl">SM</div>
      </div>
      
      <div className="section-overlay" />

      <div className="home-content-block section-content flex flex-col items-center justify-center text-center px-4">
        <h1 className="home-name font-display text-5xl md:text-6xl lg:text-7xl font-bold text-heading mb-4 md:mb-6 tracking-tight">
          Hello, I&apos;m Saurav Maheshwari
        </h1>
        <div className="home-description text-base md:text-lg text-body max-w-xl md:max-w-2xl mb-8 md:mb-10">
          Full-Stack Developer crafting AI-powered solutions where{" "}
          <span className="text-gold font-semibold">
            <Typewriter
              options={{
                strings: [
                  'code meets creativity',
                  'React builds experiences',
                  'Node powers innovation',
                  'design drives functionality'
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
            to="projects"
            spy={true}
            smooth={true}
            offset={0}
            duration={500}
            className="cta-button inline-block bg-gold text-inverse font-semibold py-3 px-8 rounded-md text-sm hover:bg-gold/90 hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg"
          >
            View My Work
          </ScrollLink>
        </div>
        
        {/* Scroll indicator */}
        <div className="scroll-indicator absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center opacity-0">
          <p className="text-body text-sm mb-2">Scroll Down</p>
          <svg className="w-6 h-6 text-body" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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