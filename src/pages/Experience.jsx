'use client';
import { useState, useEffect } from "react";
import ExperienceItem from "../components/ExperienceItem";
import EXPERIENCEDATA from "../utils/experiencedata";
import PropTypes from 'prop-types';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function Experience({ containerId }) {
  const [showExperience, setShowExperience] = useState(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(".experience-content-box",
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".experience-container",
          start: "top 70%",
        }
      }
    );

    if (EXPERIENCEDATA.length > 0) {
      setShowExperience(EXPERIENCEDATA[0].title);
    }

  }, []);

  const handleClick = (title) => {
    setShowExperience(title);
  };

  return (
    <div className="experience-container flex flex-col items-center justify-center min-h-screen relative py-16 md:py-24" id={containerId}>
      <div className="pattern2 absolute top-0 left-0 right-0 h-full w-full bg-[url('/assets/pattern2.png')] z-[1] backdrop-blur bg-fixed bg-center bg-norepeat- bg-cover"></div>
      <div className="mask absolute top-0 left-0 h-full w-full bg-[rgba(0,0,0,0.6)] z-[2]"></div>

      <header className="text-3xl md:text-5xl text-white font-bold relative z-[3] text-center px-4 mb-8 md:mb-16">
        Experience
        <div className="underline-below-header absolute w-3/5 h-1 bg-[var(--accent-blue)] bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1"></div>
      </header>

      <div className="experience-content-box border border-[var(--border-color)] max-w-[75vw] mx-6 md:mx-8 p-4 text-[var(--text-light)] grid grid-cols-1 md:grid-cols-3 gap-4 z-[3] bg-[#1A1D24]/70 backdrop-blur-sm rounded-xl opacity-0">
         <div className="md:col-span-1 m-2 md:m-4 border-r border-[var(--border-color)] pr-4">
          {EXPERIENCEDATA.map((data) => (
            <div
              key={data.id}
              className={`py-2 md:py-3 px-2 md:px-4 mt-2 md:mt-3 cursor-pointer rounded transition-colors duration-150 ${
                showExperience === data.title
                  ? "border-l-4 border-[var(--accent-blue)] bg-[var(--border-color)] text-[var(--text-light)]"
                  : "text-[var(--text-medium)] hover:text-[var(--text-light)] hover:bg-[#33373E]/50"
              }`}
              onClick={() => handleClick(data.title)}
            >
              <div className="text-lg md:text-xl font-medium">{data.title}</div>
              <div className="text-sm md:text-base text-[var(--text-medium)]">{data.company}</div>
            </div>
          ))}
        </div>
        <div className="md:col-span-2 flex flex-col justify-start mt-2 md:mt-4 pl-4">
          {showExperience &&
            EXPERIENCEDATA.filter((data) => data.title === showExperience).map((data) => (
              <ExperienceItem
                key={data.id}
                title={data.title}
                company={data.company}
                time={data.time}
                description={data.description}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

Experience.propTypes = {
  containerId: PropTypes.string.isRequired,
};

export default Experience; 