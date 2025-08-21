"use client";
import { useEffect } from "react";
import PropTypes from 'prop-types';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import techStackData from '../assets/techstackdata.json';

const TechStack = ({ containerId }) => {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(".tech-icon-item",
      { opacity: 0, scale: 0.5, y: 50 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".tech-stack-container",
          start: "top 80%",
        }
      }
    );
  }, []);

  const techStackItemsCss = "tech-stack-item-img w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain transition-transform duration-300 hover:scale-110";

  return (
    <div
      className="container-tech min-h-screen flex flex-col justify-center items-center relative z-1 overflow-hidden py-16 md:py-24"
      id={containerId}
    >
      <div className="pattern2 absolute top-0 left-0 right-0 h-full w-full bg-[url('/assets/pattern2.png')] z-[1] backdrop-blur bg-fixed bg-center bg-norepeat- bg-cover"></div>
      <div className="mask absolute top-0 left-0 h-full w-full bg-[rgba(0,0,0,0.6)] z-[2] "></div>

      <header className="text-3xl md:text-5xl text-white font-bold relative z-[3] text-center px-4 mb-12 md:mb-16">
        Tech Stack
        <div className="underline-below-header absolute w-3/5 h-1 bg-[var(--accent-blue)] bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1"></div>
      </header>

      <div className="tech-stack-container relative z-[3] w-full max-w-4xl lg:max-w-5xl flex flex-wrap justify-center items-center gap-6 md:gap-8 lg:gap-10 px-4">
        {techStackData.map((item, index) => (
          <div key={index} className="tech-icon-item flex flex-col items-center opacity-0">
             <img
               src={item.src}
               className={techStackItemsCss}
               alt={item.alt}
             />
          </div>
        ))}
      </div>
    </div>
  );
};

TechStack.propTypes = {
  containerId: PropTypes.string.isRequired,
};

export default TechStack;
