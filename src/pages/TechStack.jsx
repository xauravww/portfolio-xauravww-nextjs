"use client";
import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LoadingSpinner from "../components/LoadingSpinner";

const TechStack = ({ containerId }) => {
  const [techStackData, setTechStackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupedTechStacks, setGroupedTechStacks] = useState({});

  useEffect(() => {
    // Fetch tech stack data from database
    const fetchTechStacks = async () => {
      try {
        const response = await fetch('/api/portfolio/techstacks');
        if (response.ok) {
          const data = await response.json();

          // Group by category
          const grouped = data.reduce((acc, tech) => {
            if (!acc[tech.category]) {
              acc[tech.category] = [];
            }
            acc[tech.category].push(tech);
            return acc;
          }, {});

          setGroupedTechStacks(grouped);
          setTechStackData(data);
        }
      } catch (error) {
        console.error('Error fetching tech stacks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTechStacks();
  }, []);

  useEffect(() => {
    if (!loading && techStackData.length > 0) {
      gsap.registerPlugin(ScrollTrigger);

      gsap.fromTo(".tech-category",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: ".tech-stack-container",
            start: "top 70%",
          }
        }
      );

      gsap.fromTo(".tech-icon-item",
        { opacity: 0, scale: 0.5, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.4,
          ease: "power3.out",
          stagger: 0.05,
          scrollTrigger: {
            trigger: ".tech-stack-container",
            start: "top 70%",
          }
        }
      );
    }
  }, [loading, techStackData]);

  const getCategoryTitle = (category) => {
    const titles = {
      frontend: 'Frontend',
      backend: 'Backend',
      database: 'Database',
      devops: 'DevOps & Tools',
      design: 'Design',
      other: 'Other Technologies'
    };
    return titles[category] || category;
  };



  const techStackItemsCss = "tech-stack-item-img w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain transition-all duration-300 hover:scale-110 hover:drop-shadow-lg";

  if (loading) {
    return (
      <div
        className="container-tech min-h-screen flex flex-col justify-center items-center relative z-1 overflow-hidden py-16 md:py-24"
        id={containerId}
      >
        <div className="pattern2 absolute top-0 left-0 right-0 h-full w-full bg-[url('/assets/pattern2.png')] z-[1] backdrop-blur bg-fixed bg-center bg-no-repeat bg-cover"></div>
        <div className="mask absolute top-0 left-0 h-full w-full bg-[rgba(0,0,0,0.6)] z-[2]"></div>

        <header className="text-3xl md:text-5xl text-white font-bold relative z-[3] text-center px-4 mb-12 md:mb-16">
          Tech Stack
          <div className="underline-below-header absolute w-3/5 h-1 bg-[#f3d800] bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1"></div>
        </header>

        <LoadingSpinner text="Loading tech stacks..." />
      </div>
    );
  }

  return (
    <div
      className="container-tech min-h-screen flex flex-col justify-center items-center relative z-1 overflow-hidden py-16 md:py-24"
      id={containerId}
    >
      <div className="pattern2 absolute top-0 left-0 right-0 h-full w-full bg-[url('/assets/pattern2.png')] z-[1] backdrop-blur bg-fixed bg-center bg-no-repeat bg-cover"></div>
      <div className="mask absolute top-0 left-0 h-full w-full bg-[rgba(0,0,0,0.6)] z-[2]"></div>

      <header className="text-3xl md:text-5xl text-white font-bold relative z-[3] text-center px-4 mb-12 md:mb-16">
        Tech Stack
        <div className="underline-below-header absolute w-3/5 h-1 bg-[#f3d800] bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1"></div>
      </header>

      <div className="tech-stack-container relative z-[3] w-full max-w-7xl px-4 space-y-12">
        {Object.entries(groupedTechStacks).map(([category, techs]) => (
          <div key={category} className="tech-category opacity-0">
            <h3 className="text-xl md:text-2xl font-semibold text-[#f3d800] mb-6 text-center uppercase tracking-wide">
              {getCategoryTitle(category)}
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 lg:gap-10">
              {techs.map((tech) => (
                <div key={tech.id} className="tech-icon-item flex flex-col items-center opacity-0 group">
                  <div className="bg-[#1A1D24]/80 backdrop-blur-sm rounded-xl p-3 md:p-4 hover:bg-[#1A1D24]/90 transition-all duration-300 hover:shadow-lg hover:shadow-[#f3d800]/10">
                    <img
                      src={tech.icon}
                      className={techStackItemsCss}
                      alt={tech.name}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    {/* Fallback for broken images */}
                    <div className="hidden w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-[#f3d800]/10 rounded-lg items-center justify-center text-[#f3d800] text-xs font-medium">
                      {tech.name.split(' ')[0]}
                    </div>
                  </div>
                  <span className="text-xs md:text-sm text-[var(--text-medium)] mt-2 text-center group-hover:text-[#f3d800] transition-colors">
                    {tech.name}
                  </span>
                </div>
              ))}
            </div>
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
