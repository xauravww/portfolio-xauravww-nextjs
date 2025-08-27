'use client';
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";

const ProjectItem = ({ img, description, techStacks = [], url, projectTitle }) => {
  const [hoverItem, setHoverItem] = useState(false);
  const [techStackData, setTechStackData] = useState({});
  const [techStacksLoading, setTechStacksLoading] = useState(true);
  const repo = url.repo;
  const live = url.live;

  // Fetch tech stack data on component mount
  useEffect(() => {
    const fetchTechStacks = async () => {
      try {
        const response = await fetch('/api/portfolio/techstacks');
        if (response.ok) {
          const data = await response.json();
          // Create a mapping of tech stack names to their data
          const techStackMap = {};
          data.forEach(stack => {
            techStackMap[stack.name] = stack;
          });
          setTechStackData(techStackMap);
        }
      } catch (error) {
        console.error('Error fetching tech stacks:', error);
      } finally {
        setTechStacksLoading(false);
      }
    };

    fetchTechStacks();
  }, []);

  // Function to get tech stack icon
  const getTechStackIcon = (techName) => {
    const techData = techStackData[techName];
    if (techData && techData.icon) {
      return techData.icon;
    }
    // Fallback to a generic tech icon
    return "/assets/image-not-found.png";
  };

  return (
    <div
      className="group relative w-full rounded-xl h-[50vw] md:h-[35vw] lg:h-[20vw] overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300"
      onMouseEnter={() => setHoverItem(true)}
      onMouseLeave={() => setHoverItem(false)}
    >
      {/* Project Image */}
      <img
        className="rounded-xl h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        src={img}
        alt={projectTitle || "Project"}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/assets/image-not-found.png";
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Content Overlay */}
      <div
        className={`absolute inset-0 flex flex-col justify-end p-4 md:p-6 text-white transition-all duration-300 ${
          hoverItem ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {/* Tech Stack Icons */}
        <div className="flex flex-wrap gap-2 mb-3">
          {techStacksLoading ? (
            // Loading skeleton for tech stacks
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 md:w-10 md:h-10 bg-gray-600 rounded-full animate-pulse"
                />
              ))}
            </div>
          ) : (
            techStacks.slice(0, 6).map((tech, index) => (
              <div
                key={index}
                className="group/tech relative"
                title={tech}
              >
                <img
                  className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full border-2 border-cyan-400/60 bg-[var(--bg-dark)] p-1 hover:border-cyan-400 hover:scale-110 transition-all duration-200 shadow-lg"
                  src={getTechStackIcon(tech)}
                  alt={tech}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/assets/image-not-found.png";
                  }}
                />
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover/tech:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                  {tech}
                </div>
              </div>
            ))
          )}
          {techStacks.length > 6 && (
            <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full border-2 border-cyan-400/60 bg-[var(--bg-dark)] flex items-center justify-center text-xs md:text-sm font-medium text-cyan-400">
              +{techStacks.length - 6}
            </div>
          )}
        </div>

        {/* Project Title */}
        <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-2 line-clamp-1">
          {projectTitle}
        </h3>

        {/* Description */}
        <p className="text-sm md:text-base text-gray-200 mb-4 line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {repo && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(repo, "_blank");
              }}
              className="flex items-center gap-2 bg-gray-800/80 hover:bg-gray-700/80 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
              title="View Source Code"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span className="hidden sm:inline">Code</span>
            </button>
          )}
          {live && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(live, "_blank");
              }}
              className="flex items-center gap-2 bg-cyan-600/80 hover:bg-cyan-500/80 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
              title="View Live Demo"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span className="hidden sm:inline">Live</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

ProjectItem.propTypes = {
  img: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  techStacks: PropTypes.arrayOf(PropTypes.string),
  url: PropTypes.shape({
    repo: PropTypes.string.isRequired,
    live: PropTypes.string,
  }).isRequired,
};

export default ProjectItem;
