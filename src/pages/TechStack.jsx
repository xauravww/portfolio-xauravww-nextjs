"use client";
import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LoadingSpinner from "../components/LoadingSpinner";

const FALLBACK = [
  // Frontend
  { name: 'React.js', icon: '/assets/techstack/react.png', category: 'frontend' },
  { name: 'Next.js', icon: '/assets/techstack/next-js.svg', category: 'frontend' },
  { name: 'TypeScript', icon: '/assets/techstack/typescript.svg', category: 'frontend' },
  { name: 'JavaScript', icon: '/assets/techstack/javascript.png', category: 'frontend' },
  { name: 'HTML & CSS', icon: '/assets/techstack/html-css.png', category: 'frontend' },
  { name: 'Tailwind CSS', icon: '/assets/techstack/tailwind-css.svg', category: 'frontend' },
  { name: 'Redux Toolkit', icon: '/assets/techstack/redux-toolkit.png', category: 'frontend' },
  { name: 'XML', icon: '/assets/techstack/xml.png', category: 'frontend' },

  // Backend
  { name: 'Node.js', icon: '/assets/techstack/nodejs.png', category: 'backend' },
  { name: 'Express.js', icon: '/assets/techstack/express.webp', category: 'backend' },
  { name: 'Prisma', icon: '/assets/techstack/prisma.svg', category: 'backend' },
  { name: 'GraphQL', icon: '/assets/techstack/graphql-square.svg', category: 'backend' },
  { name: 'Notion API', icon: '/assets/techstack/notion.png', category: 'backend' },
  { name: 'Gram.js', icon: '/assets/techstack/gram-js.png', category: 'backend' },
  { name: 'JWT', icon: '/assets/techstack/jwt-colorful.svg', category: 'backend' },

  // Databases
  { name: 'MongoDB', icon: '/assets/techstack/mongodb.png', category: 'database' },
  { name: 'PostgreSQL', icon: '/assets/techstack/postgresql.svg', category: 'database' },
  { name: 'Redis', icon: '/assets/techstack/redis.png', category: 'database' },
  { name: 'Sanity CMS', icon: '/assets/techstack/sanity.png', category: 'database' },

  // DevOps & Tools
  { name: 'Docker', icon: '/assets/techstack/docker-square.png', category: 'devops' },
  { name: 'Git', icon: '/assets/techstack/git-square.png', category: 'devops' },
  { name: 'GitHub', icon: '/assets/techstack/github-square.png', category: 'devops' },
  { name: 'N8N', icon: '/assets/techstack/n8n.jpg', category: 'devops' },
  { name: 'Postman', icon: '/assets/techstack/postman-square.svg', category: 'devops' },

  // Mobile
  { name: 'React Native', icon: '/assets/techstack/react-native.png', category: 'mobile' },
  { name: 'Kotlin', icon: '/assets/techstack/kotlin.png', category: 'mobile' },
  { name: 'Android', icon: '/assets/techstack/android.png', category: 'mobile' },
  { name: 'C++', icon: '/assets/techstack/cpp.png', category: 'mobile' },

  // Design
  { name: 'Figma', icon: '/assets/techstack/figma-square.png', category: 'design' },

  // Other / AI
  { name: 'LangChain', icon: '/assets/techstack/langchain-square.png', category: 'other' },
  { name: 'OpenAI API', icon: '/assets/techstack/openai-square.png', category: 'other' },
].map((t, i) => ({ ...t, id: `fb-${i}` }));

const TechStack = ({ containerId }) => {
  const [techStackData, setTechStackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupedTechStacks, setGroupedTechStacks] = useState({});
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);

  useEffect(() => {
    // Fetch tech stack data from database
    const fetchTechStacks = async () => {
      try {
        const response = await fetch('/api/portfolio/techstacks');
        let dbData = response.ok ? await response.json() : [];
        if (!Array.isArray(dbData)) dbData = [];

        // Merge database data with fallback data so no key skills are missing
        const data = [...dbData];
        FALLBACK.forEach(fb => {
          if (!data.some(d => d.name.toLowerCase() === fb.name.toLowerCase())) {
            data.push(fb);
          }
        });

        // Group by category
        const grouped = data.reduce((acc, tech) => {
          const cat = tech.category || 'other';
          if (!acc[cat]) {
            acc[cat] = [];
          }
          acc[cat].push(tech);
          return acc;
        }, {});

        setGroupedTechStacks(grouped);
        setTechStackData(data);
      } catch (error) {
        console.error('Error fetching tech stacks:', error);
        // Fallback on error
        const grouped = FALLBACK.reduce((acc, tech) => {
          const cat = tech.category || 'other';
          if (!acc[cat]) {
            acc[cat] = [];
          }
          acc[cat].push(tech);
          return acc;
        }, {});
        setGroupedTechStacks(grouped);
        setTechStackData(FALLBACK);
      } finally {
        setLoading(false);
      }
    };

    fetchTechStacks();

    // Fetch projects
    (async () => {
      try {
        const response = await fetch('/api/portfolio/projects');
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    })();

    // Fetch experiences
    (async () => {
      try {
        const response = await fetch('/api/portfolio/experiences');
        if (response.ok) {
          const data = await response.json();
          setExperiences(data);
        }
      } catch (error) {
        console.error('Error fetching experiences:', error);
      }
    })();
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
            once: true,
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
            once: true,
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

  const skillsMatch = (pTechs, filterSkill) => {
    if (!pTechs) return false;
    const normalize = (t) => t.toLowerCase().replace(/\.js$/, '').replace(/\s+/g, '').trim();
    const cleanFilter = normalize(filterSkill);
    return pTechs.some(tech => {
      const cleanTech = normalize(tech);
      return cleanTech === cleanFilter || cleanTech.includes(cleanFilter) || cleanFilter.includes(cleanTech);
    });
  };

  const techStackItemsCss = "tech-stack-item-img w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain transition-all duration-300 hover:scale-110 hover:drop-shadow-lg";

  if (loading) {
    return (
      <div
        className="container-tech min-h-screen flex flex-col justify-center items-center relative z-1 overflow-hidden py-16 md:py-24"
        id={containerId}
      >
        <div className="section-overlay" />

        <header className="section-content text-center mb-12 md:mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-heading tracking-tight">Tech Stack</h2>
          <div className="mt-3 mx-auto w-16 h-1 bg-gold rounded-full" />
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
      <div className="section-overlay" />

      <header className="section-content text-center mb-6">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-heading tracking-tight">Tech Stack</h2>
        <div className="mt-3 mx-auto w-16 h-1 bg-gold rounded-full" />
      </header>

      {/* Interactive tip hint */}
      <div className="section-content w-full max-w-md mx-auto mb-10 px-4">
        <div className="bg-gold/10 border border-gold/20 rounded-xl p-3 flex items-center gap-2.5 text-heading text-center justify-center select-none">
          <span className="text-sm shrink-0">💡</span>
          <p className="text-[11px] leading-relaxed">
            <span className="font-semibold text-gold">Tip:</span> Click any skill icon below to view matching projects and apply instant filters.
          </p>
        </div>
      </div>

      <div className="tech-stack-container section-content w-full max-w-7xl px-4 space-y-12">
        {Object.entries(groupedTechStacks).map(([category, techs]) => (
          <div key={category} className="tech-category">
            <h3 className="text-xl md:text-2xl font-semibold text-gold mb-6 text-center uppercase tracking-wide">
              {getCategoryTitle(category)}
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 lg:gap-10">
              {techs.map((tech) => (
                <div
                  key={tech.id}
                  onClick={() => setSelectedSkill(tech)}
                  className="tech-icon-item flex flex-col items-center group cursor-pointer hover:scale-105 active:scale-95 transition-all select-none"
                >
                  <div className={`backdrop-blur-sm rounded-xl p-3 md:p-4 transition-all duration-300 hover:shadow-lg hover:shadow-gold/10 ${
                    (tech.name.toLowerCase().includes('node') || tech.name.toLowerCase().includes('prisma')) ? 'bg-white hover:bg-white/90' : 'bg-surface/80 hover:bg-surface/90'
                  }`}>
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
                    <div className="hidden w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-gold/10 rounded-lg items-center justify-center text-gold text-xs font-medium">
                      {tech.name.split(' ')[0]}
                    </div>
                  </div>
                  <span className="text-xs md:text-sm text-body mt-2 text-center group-hover:text-gold transition-colors">
                    {tech.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Standalone Details Popover Modal */}
      {selectedSkill && (() => {
        const matchingProjects = projects.filter(p => skillsMatch(p.techStacks, selectedSkill.name));
        const matchingExperiences = experiences.filter(e => skillsMatch(e.skills, selectedSkill.name));
        return (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#2a2a2c] border border-white/[0.08] rounded-2xl w-full max-w-[340px] overflow-hidden shadow-2xl animate-fade-in flex flex-col max-h-[80%] text-heading">
              
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/[0.06] bg-[#323234] shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className={`w-6 h-6 rounded-[6px] flex items-center justify-center ${
                    (selectedSkill.name.toLowerCase().includes('node') || selectedSkill.name.toLowerCase().includes('prisma')) ? 'bg-white p-[1px]' : 'bg-white/5'
                  }`}>
                    <img src={selectedSkill.icon} alt={selectedSkill.name} className="w-4.5 h-4.5 object-contain"
                      onError={(e) => { e.target.style.display='none'; }} />
                  </div>
                  <span className="text-base font-bold text-white leading-tight">{selectedSkill.name}</span>
                </div>
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="text-white/40 hover:text-white/70 transition-colors p-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Matching Projects & Experiences List */}
              <div className="flex-1 overflow-y-auto bg-[#2a2a2c] py-2 custom-scrollbar">
                {/* Projects Section */}
                <div className="px-4 py-2 text-[10px] font-bold text-white/35 uppercase tracking-wide bg-[#323234]/30 select-none">Projects ({matchingProjects.length})</div>
                <div className="divide-y divide-white/[0.04] mb-4">
                  {matchingProjects.length > 0 ? (
                    matchingProjects.map(p => (
                      <button
                        key={p.id || p.title}
                        onClick={() => {
                          window.location.href = `/ProjectOverview?filter=${encodeURIComponent(selectedSkill.name)}&search=${encodeURIComponent(p.title)}`;
                        }}
                        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.04] transition-all text-left group"
                      >
                        <div className="min-w-0 flex-1 pr-3">
                          <div className="text-[13px] font-bold text-white/95 truncate group-hover:text-gold transition-colors">{p.title}</div>
                          <div className="text-[10.5px] text-white/45 truncate mt-0.5 leading-relaxed">{p.description}</div>
                        </div>
                        <svg className="w-4 h-4 text-white/20 shrink-0 group-hover:text-gold group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs text-white/40">No related projects.</div>
                  )}
                </div>

                {/* Experiences Section */}
                <div className="px-4 py-2 text-[10px] font-bold text-white/35 uppercase tracking-wide bg-[#323234]/30 select-none">Work Experience ({matchingExperiences.length})</div>
                <div className="divide-y divide-white/[0.04]">
                  {matchingExperiences.length > 0 ? (
                    matchingExperiences.map(exp => (
                      <button
                        key={exp.id || exp.position}
                        onClick={() => {
                          window.location.href = `/Experience?filter=${encodeURIComponent(selectedSkill.name)}&search=${encodeURIComponent(exp.position)}`;
                        }}
                        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.04] transition-all text-left group"
                      >
                        <div className="min-w-0 flex-1 pr-3">
                          <div className="text-[13px] font-bold text-white/95 truncate group-hover:text-gold transition-colors">{exp.position}</div>
                          <div className="text-[10.5px] text-white/45 truncate mt-0.5 leading-relaxed">{exp.company}</div>
                        </div>
                        <svg className="w-4 h-4 text-white/20 shrink-0 group-hover:text-gold group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs text-white/40">No related work experience.</div>
                  )}
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="p-4 border-t border-white/[0.06] bg-[#323234] flex flex-col gap-2 shrink-0">
                <button
                  onClick={() => {
                    window.location.href = `/ProjectOverview?filter=${encodeURIComponent(selectedSkill.name)}`;
                  }}
                  className="w-full bg-gold hover:bg-gold/90 text-black text-xs font-bold py-2.5 rounded-xl active:scale-[0.98] transition-all text-center select-none cursor-pointer"
                >
                  🎯 Filter Projects by this Skill
                </button>
                <button
                  onClick={() => {
                    window.location.href = `/Experience?filter=${encodeURIComponent(selectedSkill.name)}`;
                  }}
                  className="w-full bg-[#323234] hover:bg-[#3d3d40] text-white text-xs font-bold py-2.5 rounded-xl active:scale-[0.98] transition-all text-center border border-white/[0.08] select-none cursor-pointer"
                >
                  💼 Filter Experience by this Skill
                </button>
              </div>

            </div>
          </div>
        );
      })()}
    </div>
  );
};

TechStack.propTypes = {
  containerId: PropTypes.string.isRequired,
};

export default TechStack;
