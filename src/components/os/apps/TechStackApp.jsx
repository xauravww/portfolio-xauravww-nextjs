'use client';
import { useState, useEffect, useMemo } from 'react';
import { Page, Card, SectionLabel, Centered } from './ui';
import LoadingSpinner from '../../LoadingSpinner';
import { useWindows } from '../../../context/windowContext';

const CAT_LABELS = {
  frontend: 'Frontend', backend: 'Backend', database: 'Database',
  devops: 'DevOps & Tools', mobile: 'Mobile', design: 'Design', other: 'Other',
};
const CAT_ORDER = ['frontend', 'backend', 'database', 'devops', 'mobile', 'design', 'other'];

// Local fallback shown when the DB has no tech stacks seeded.
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

const TechStackApp = () => {
  const { openWindow, closeWindow } = useWindows();
  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/portfolio/techstacks');
        let dbData = res.ok ? await res.json() : [];
        if (!Array.isArray(dbData)) dbData = [];

        // Merge database data with fallback data so no key skills are missing
        const data = [...dbData];
        FALLBACK.forEach(fb => {
          if (!data.some(d => d.name.toLowerCase() === fb.name.toLowerCase())) {
            data.push(fb);
          }
        });

        const g = data.reduce((acc, t) => { (acc[t.category || 'other'] = acc[t.category || 'other'] || []).push(t); return acc; }, {});
        setGrouped(g);
      } catch (e) {
        console.error('Error fetching tech stacks:', e);
        setGrouped(FALLBACK.reduce((acc, t) => { (acc[t.category] = acc[t.category] || []).push(t); return acc; }, {}));
      }
      finally { setLoading(false); }
    })();

    // Fetch projects to list inside details popup
    (async () => {
      try {
        const res = await fetch('/api/portfolio/projects');
        if (res.ok) setProjects(await res.json());
      } catch (e) {
        console.error('Error fetching projects:', e);
      }
    })();
  }, []);

  // Helper matching function
  const skillsMatch = (pTechs, filterSkill) => {
    if (!pTechs) return false;
    const normalize = (t) => t.toLowerCase().replace(/\.js$/, '').replace(/\s+/g, '').trim();
    const cleanFilter = normalize(filterSkill);
    return pTechs.some(tech => {
      const cleanTech = normalize(tech);
      return cleanTech === cleanFilter || cleanTech.includes(cleanFilter) || cleanFilter.includes(cleanTech);
    });
  };

  if (loading) return <Centered><LoadingSpinner text="Loading skills..." /></Centered>;

  const cats = CAT_ORDER.filter(c => grouped[c]).concat(Object.keys(grouped).filter(c => !CAT_ORDER.includes(c)));

  return (
    <Page className="space-y-4 relative min-h-full">
      {/* Interactive tip hint */}
      <div className="bg-[#0A84FF]/10 border border-[#0A84FF]/20 rounded-xl p-3 flex items-center gap-2.5 text-white/90 select-none">
        <span className="text-sm shrink-0">💡</span>
        <p className="text-[11px] leading-relaxed">
          <span className="font-semibold text-[#0A84FF]">Tip:</span> Click any skill icon to view matching portfolio projects and apply instant filters.
        </p>
      </div>

      {cats.map(cat => (
        <div key={cat}>
          <SectionLabel>{CAT_LABELS[cat] || cat}</SectionLabel>
          <Card>
            <div className="p-3 grid grid-cols-4 sm:grid-cols-6 gap-x-2 gap-y-3">
              {grouped[cat].map(t => (
                <div
                  key={t.id}
                  onClick={() => setSelectedSkill(t)}
                  className="flex flex-col items-center gap-1.5 group cursor-pointer hover:scale-105 active:scale-95 transition-all select-none"
                >
                  <div className={`w-11 h-11 rounded-[10px] flex items-center justify-center group-hover:brightness-110 transition-all ${
                    (t.name.toLowerCase().includes('node') || t.name.toLowerCase().includes('prisma')) ? 'bg-white p-[3px]' : 'bg-white/[0.05] group-hover:bg-white/[0.09]'
                  }`}>
                    <img src={t.icon} alt={t.name} className="w-7 h-7 object-contain"
                      onError={(e) => { e.target.style.display='none'; if(e.target.nextSibling) e.target.nextSibling.style.display='flex'; }} />
                    <div className="hidden w-7 h-7 rounded bg-white/10 items-center justify-center text-white/60 text-[8px] font-semibold">{t.name.slice(0,2)}</div>
                  </div>
                  <span className="text-[10px] text-white/45 text-center leading-tight truncate w-full group-hover:text-white/70 transition-colors">{t.name}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      ))}

      {/* macOS Popover Details Overlay */}
      {selectedSkill && (() => {
        const matching = projects.filter(p => skillsMatch(p.techStacks, selectedSkill.name));
        return (
          <div className="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#2a2a2c] border border-white/[0.08] rounded-xl w-full max-w-[290px] overflow-hidden shadow-2xl animate-fade-in flex flex-col max-h-[85%]">
              
              {/* Popover Header */}
              <div className="flex items-center justify-between p-3 border-b border-white/[0.06] bg-[#323234] shrink-0">
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-[4px] flex items-center justify-center ${
                    (selectedSkill.name.toLowerCase().includes('node') || selectedSkill.name.toLowerCase().includes('prisma')) ? 'bg-white p-[1px]' : 'bg-white/5'
                  }`}>
                    <img src={selectedSkill.icon} alt={selectedSkill.name} className="w-4 h-4 object-contain"
                      onError={(e) => { e.target.style.display='none'; }} />
                  </div>
                  <span className="text-[13px] font-bold text-white leading-tight">{selectedSkill.name}</span>
                </div>
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="text-white/40 hover:text-white/70 transition-colors p-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Popover List */}
              <div className="flex-1 overflow-y-auto divide-y divide-white/[0.04] bg-[#2a2a2c] py-1 custom-scrollbar">
                {matching.length > 0 ? (
                  matching.map(p => (
                    <button
                      key={p.id || p.title}
                      onClick={() => {
                        const isMobileSize = typeof window !== 'undefined' && window.innerWidth < 768;
                        openWindow('projects');
                        if (isMobileSize) {
                          closeWindow('techstack');
                        }
                        window.__projectsAppInitialFilter = selectedSkill.name;
                        window.__projectsAppInitialSearch = p.title;
                        window.dispatchEvent(new CustomEvent('filter-projects-by-skill', {
                          detail: { skill: selectedSkill.name, search: p.title }
                        }));
                        setSelectedSkill(null);
                      }}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 hover:bg-white/[0.04] transition-all text-left group"
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <div className="text-[11.5px] font-semibold text-white/90 truncate group-hover:text-[#0A84FF] transition-colors">{p.title}</div>
                        <div className="text-[9.5px] text-white/40 truncate mt-0.5">{p.description}</div>
                      </div>
                      <svg className="w-3 h-3 text-white/20 shrink-0 group-hover:text-[#0A84FF] group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ))
                ) : (
                  <div className="p-6 text-center text-[11px] text-white/35">
                    No active projects listed for this skill.
                  </div>
                )}
              </div>

              {/* Popover Footer Action */}
              <div className="p-3 border-t border-white/[0.06] bg-[#323234] flex flex-col gap-2 shrink-0">
                <button
                  onClick={() => {
                    const isMobileSize = typeof window !== 'undefined' && window.innerWidth < 768;
                    openWindow('projects');
                    if (isMobileSize) {
                      closeWindow('techstack');
                    }
                    window.__projectsAppInitialFilter = selectedSkill.name;
                    window.dispatchEvent(new CustomEvent('filter-projects-by-skill', {
                      detail: { skill: selectedSkill.name }
                    }));
                    setSelectedSkill(null);
                  }}
                  className="w-full bg-[#0A84FF] hover:bg-[#0a78e8] text-white text-[11px] font-medium py-1.5 rounded-lg active:scale-[0.98] transition-all text-center select-none cursor-default"
                >
                  🎯 Filter Projects by this Skill
                </button>
              </div>

            </div>
          </div>
        );
      })()}
    </Page>
  );
};

export default TechStackApp;
