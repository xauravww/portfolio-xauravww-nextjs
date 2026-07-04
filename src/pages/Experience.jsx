'use client';
import { useState, useEffect, useMemo } from "react";
import ExperienceItem from "../components/ExperienceItem";
import LoadingSpinner from "../components/LoadingSpinner";
import PropTypes from 'prop-types';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function Experience({ containerId }) {
  const [showExperience, setShowExperience] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('search') || null;
    }
    return null;
  });
  const [experienceData, setExperienceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('filter') || '';
    }
    return '';
  });

  // Handle URL query parameters for cross-linking after mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const skillParam = params.get('filter');
      const positionParam = params.get('search');
      if (skillParam) {
        setSearchTerm(skillParam);
      }
      if (positionParam) {
        setShowExperience(positionParam);
      }
    }
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Fetch experience data from database
    const fetchExperiences = async () => {
      try {
        const response = await fetch('/api/portfolio/experiences');
        if (response.ok) {
          const data = await response.json();
          setExperienceData(data);
          if (data.length > 0) {
            setShowExperience(prev => prev || data[0].position);
          }
        }
      } catch (error) {
        console.error('Error fetching experiences:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();

    // Delay animation to ensure elements exist
    setTimeout(() => {
      if (document.querySelector('.experience-content-box')) {
        gsap.fromTo(".experience-content-box",
          { opacity: 0, y: 50, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".experience-container",
              start: "top 70%",
              once: true,
            }
          }
        );
      }
    }, 100);

  }, []);

  const handleClick = (position) => {
    setShowExperience(position);
  };

  // Filtered experience list
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return experienceData;
    const term = searchTerm.toLowerCase();
    return experienceData.filter(d => 
      d.position.toLowerCase().includes(term) ||
      d.company.toLowerCase().includes(term) ||
      (d.skills && d.skills.some(s => s.toLowerCase().includes(term)))
    );
  }, [experienceData, searchTerm]);

  // Auto-select first matched result when search narrows
  useEffect(() => {
    if (filteredData.length > 0 && !filteredData.some(d => d.position === showExperience)) {
      setShowExperience(filteredData[0].position);
    }
  }, [filteredData, showExperience]);

  if (loading) {
    return (
      <div className="experience-container flex flex-col items-center justify-center min-h-screen relative py-16 md:py-24" id={containerId}>
        <div className="section-overlay" />
        <LoadingSpinner text="Loading experiences..." />
      </div>
    );
  }

  return (
    <div className="experience-container flex flex-col items-center justify-center min-h-screen relative py-16 md:py-24" id={containerId}>
      <div className="section-overlay" />

      <header className="section-content text-center mb-12 md:mb-16">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-heading tracking-tight">Experience</h2>
        <div className="mt-3 mx-auto w-16 h-1 bg-gold rounded-full" />
      </header>

      {experienceData.length === 0 ? (
        <div className="text-body text-center section-content">
          No experience data available.
        </div>
      ) : (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-content">
          <div className="experience-content-box p-4 sm:p-6 lg:p-8 text-heading grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 bg-surface/70 backdrop-blur-sm rounded-xl shadow-xl">
            <div className="lg:col-span-1 pb-4 lg:pb-0 lg:pr-6 flex flex-col overflow-hidden max-h-[500px]">
              
              {/* iPhone style search bar */}
              <div className="relative flex items-center mb-3">
                <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-heading/30">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search experience..."
                  className="w-full bg-white/[0.05] border border-border/20 text-sm text-heading placeholder-body/40 rounded-xl pl-9 pr-8 py-2 outline-none focus:border-gold/40 transition-all focus:bg-white/[0.08]"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-3 flex items-center text-body/55 hover:text-heading"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1.5 custom-scrollbar">
                {filteredData.length > 0 ? (
                  filteredData.map((data) => (
                    <div
                      key={data.id}
                      className={`py-3 px-4 cursor-pointer rounded-lg transition-all duration-200 ${
                        showExperience === data.position
                          ? "bg-gold/10 text-gold shadow-md"
                          : "text-body hover:text-heading hover:bg-surface/60"
                      }`}
                      onClick={() => handleClick(data.position)}
                    >
                      <div className="text-lg font-medium leading-snug">{data.position}</div>
                      <div className="text-sm opacity-80 mt-0.5">{data.company}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-body/55 text-center py-8">No experiences found.</div>
                )}
              </div>
            </div>

            <div className="lg:col-span-2 flex flex-col justify-start mt-4 lg:mt-0 lg:pl-6">
              {showExperience && filteredData.some(d => d.position === showExperience) &&
                filteredData.filter((data) => data.position === showExperience).map((data) => (
                  <ExperienceItem
                    key={data.id}
                    title={data.position}
                    company={data.company}
                    time={`${new Date(data.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - ${
                      data.isCurrentJob ? 'Present' : data.endDate ? new Date(data.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'
                    }`}
                    description={data.description}
                    skills={data.skills}
                    location={data.location}
                  />
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

Experience.propTypes = {
  containerId: PropTypes.string.isRequired,
};

export default Experience;