'use client';
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import OptimizedImage from "./OptimizedImage";

const ProjectItem = ({ img, description, techStacks = [], url, projectTitle, techStackData, techStacksLoading }) => {
  const [hoverItem, setHoverItem] = useState(false);
  const repo = url.repo;
  const live = url.live;



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
    <article
      className="group relative w-full h-full min-h-[400px] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-[var(--accent-blue)]/25 transition-all duration-500 bg-[#1A1D24]/70 backdrop-blur-sm flex flex-col"
      onMouseEnter={() => setHoverItem(true)}
      onMouseLeave={() => setHoverItem(false)}
    >
      {/* Project Image Container - Fixed aspect ratio */}
      <div className="relative w-full aspect-video overflow-hidden">
        <OptimizedImage
          className="transition-transform duration-500 group-hover:scale-110"
          src={img}
          alt={projectTitle || "Project"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={false}
        />
        
        {/* Enhanced Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4 z-10">
          <div className="flex items-center gap-2 bg-[#1A1D24]/80 backdrop-blur-sm px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-[#f3d800] rounded-full animate-pulse"></div>
            <span className="text-[var(--text-light)] text-xs font-medium">Active</span>
          </div>
        </div>
      </div>

      {/* Content Section - Always visible with better hierarchy */}
      <div className="flex-1 p-4 sm:p-6 space-y-4 flex flex-col">
        {/* Project Title and Description - Top section */}
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-[var(--text-light)] group-hover:text-[#f3d800] transition-colors duration-300 line-clamp-1">
              {projectTitle}
            </h3>
            
            {/* Description - Always visible with better contrast */}
            <p className="text-[var(--text-medium)] text-sm leading-relaxed line-clamp-2 group-hover:text-[var(--text-light)] transition-colors duration-300">
              {description}
            </p>
          </div>

          {/* Tech Stack Icons - Always visible */}
        <div className="flex flex-wrap gap-2">
          {techStacksLoading ? (
            // Loading skeleton for tech stacks
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 bg-[var(--border-color)]/50 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : (
            techStacks.slice(0, 5).map((tech, index) => (
              <div
                key={index}
                className="group/tech relative"
                title={tech}
              >
                <div className="w-8 h-8 rounded-lg bg-[#1A1D24]/80 p-1.5 hover:bg-[var(--border-color)]/80 transition-all duration-200 flex items-center justify-center">
                  <OptimizedImage
                    className="w-full h-full object-contain"
                    src={getTechStackIcon(tech)}
                    alt={tech}
                    width={24}
                    height={24}
                  />
                </div>
                {/* Enhanced Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-[#1A1D24]/95 backdrop-blur-sm text-[var(--text-light)] text-xs rounded-md opacity-0 group-hover/tech:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-20">
                  {tech}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#1A1D24]/95"></div>
                </div>
              </div>
            ))
          )}
          {techStacks.length > 5 && (
            <div className="w-8 h-8 rounded-lg bg-[#1A1D24]/80 flex items-center justify-center text-xs font-medium text-[#f3d800] hover:bg-[var(--border-color)]/80 transition-colors duration-200">
              +{techStacks.length - 5}
            </div>
          )}
        </div>

        </div>

        {/* Action Buttons - Enhanced visibility - Bottom section */}
        <div className="flex gap-3 pt-4 mt-auto">
          {repo && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(repo, "_blank");
              }}
              className="flex items-center gap-2 bg-[#1A1D24]/80 hover:bg-[var(--border-color)]/80 text-[var(--text-light)] px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 flex-1 justify-center"
              title="View Source Code"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span>Code</span>
            </button>
          )}
          {live && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(live, "_blank");
              }}
              className="flex items-center gap-2 bg-[#f3d800] hover:bg-[#f3d800]/90 text-[#1A1D24] px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 flex-1 justify-center"
              title="View Live Demo"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span>Live</span>
            </button>
          )}
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-[var(--accent-blue)]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl`} />
    </article>
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
