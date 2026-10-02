'use client';
import { useState, useEffect, useMemo, useRef } from 'react';
import {
  GithubLogo, ArrowSquareOut, Funnel, CaretLeft, CaretRight,
  MagnifyingGlass, XCircle, Check, LockKey,
} from '@phosphor-icons/react';
import { useWindows } from '../../../context/windowContext';
import { Page, Card, Tag, Button, SectionLabel, Centered } from './ui';
import LoadingSpinner from '../../LoadingSpinner';
import OptimizedImage from '../../OptimizedImage';

const TECH_MAP = {
  'React': { name: 'React', icon: '/assets/techstack/react.png' },
  'Next.js': { name: 'Next.js', icon: '/assets/techstack/next-js.svg' },
  'TypeScript': { name: 'TypeScript', icon: '/assets/techstack/typescript.svg' },
  'JavaScript': { name: 'JavaScript', icon: '/assets/techstack/javascript.png' },
  'Node.js': { name: 'Node.js', icon: '/assets/techstack/nodejs-official.png' },
  'Express': { name: 'Express', icon: '/assets/techstack/express.webp' },
  'MongoDB': { name: 'MongoDB', icon: '/assets/techstack/mongodb.png' },
  'PostgreSQL': { name: 'PostgreSQL', icon: '/assets/techstack/postgresql.svg' },
  'Prisma': { name: 'Prisma', icon: '/assets/techstack/prisma.svg' },
  'Tailwind CSS': { name: 'Tailwind CSS', icon: '/assets/techstack/tailwind-css.svg' },
  'Redux Toolkit': { name: 'Redux Toolkit', icon: '/assets/techstack/redux-toolkit.png' },
  'React Native': { name: 'React Native', icon: '/assets/techstack/react-native.png' },
  'Git': { name: 'Git', icon: '/assets/techstack/git-square.png' },
  'GitHub': { name: 'GitHub', icon: '/assets/techstack/github-square.png' },
  'Docker': { name: 'Docker', icon: '/assets/techstack/docker-square.png' },
  'GraphQL': { name: 'GraphQL', icon: '/assets/techstack/graphql-square.svg' },
  'JWT': { name: 'JWT', icon: '/assets/techstack/jwt-colorful.svg' },
  'Figma': { name: 'Figma', icon: '/assets/techstack/figma-square.png' },
  'Postman': { name: 'Postman', icon: '/assets/techstack/postman-square.svg' },
  'LangChain': { name: 'LangChain', icon: '/assets/techstack/langchain-square.png' },
  'OpenAI API': { name: 'OpenAI API', icon: '/assets/techstack/openai-square.png' },
  'HTML & CSS': { name: 'HTML & CSS', icon: '/assets/techstack/html---css.png' },
  'Gram.js': { name: 'Gram.js', icon: '/assets/techstack/gram-js.png' },
  'N8N': { name: 'N8N', icon: '/assets/techstack/n8n.jpg' },
  'Notion': { name: 'Notion', icon: '/assets/techstack/notion.png' },
  'Redis': { name: 'Redis', icon: '/assets/techstack/redis.png' },
  'Sanity': { name: 'Sanity', icon: '/assets/techstack/sanity.png' },
};

const GitHubIcon = <GithubLogo size={14} weight="fill" />;
const PrivateIcon = <LockKey size={14} weight="fill" />;
const ExternalIcon = <ArrowSquareOut size={14} weight="bold" />;
const FilterIcon = <Funnel size={12} weight="fill" />;
const ChevronLeft = <CaretLeft size={12} weight="bold" />;
const ChevronRight = <CaretRight size={12} weight="bold" />;

// macOS-style alert shown when a project's repo is not public — a 404 for visitors,
// so the card explains it instead of opening a dead link.
const PrivateRepoDialog = ({ projectTitle, onClose }) => {
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/40 flex items-center justify-center z-[110] p-4">
      <div onClick={e => e.stopPropagation()}
        className="w-[270px] rounded-[12px] overflow-hidden border border-white/[0.1] shadow-2xl text-center"
        style={{ background: 'rgba(44, 44, 46, 0.86)', backdropFilter: 'blur(24px) saturate(150%)', WebkitBackdropFilter: 'blur(24px) saturate(150%)' }}>
        <div className="px-5 pt-5 pb-4">
          <div className="mx-auto mb-3 w-[52px] h-[52px] rounded-[12px] flex items-center justify-center"
            style={{ background: 'linear-gradient(180deg, #5c5c60, #454548)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.14), 0 2px 6px rgba(0,0,0,0.3)' }}>
            <LockKey size={26} weight="fill" className="text-white/85" />
          </div>
          <h3 className="text-[13px] font-semibold text-white">Private Repository</h3>
          <p className="text-[11px] text-white/55 leading-relaxed mt-1.5">
            The source for {projectTitle || 'this project'} isn&apos;t public. Contact the owner to request access.
          </p>
        </div>
        <button onClick={onClose}
          className="w-full py-2.5 text-[13px] font-medium text-[#0A84FF] border-t border-white/[0.08] hover:bg-white/[0.05] active:bg-white/[0.08] transition-colors">
          OK
        </button>
      </div>
    </div>
  );
};

const ProjectCard = ({ project, onOpenUrl }) => {
  const repo = project.url?.repo;
  const live = project.url?.live;
  const [showPrivate, setShowPrivate] = useState(false);

  return (
    <>
    <Card className="flex flex-col overflow-hidden">
      <div className="relative w-full aspect-[16/10] overflow-hidden">
        <OptimizedImage
          className="transition-transform duration-300 hover:scale-105"
          src={project.img}
          alt={project.title || 'Project'}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <div className="p-3.5 flex flex-col gap-2.5 flex-1">
        <div>
          <h3 className="text-[14px] font-semibold text-white leading-tight truncate">{project.title}</h3>
          <p className="text-[12px] text-white/50 leading-relaxed mt-1 line-clamp-2">{project.description}</p>
        </div>

        {project.techStacks?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.techStacks.slice(0, 4).map(t => {
              const icon = TECH_MAP[t]?.icon;
              return (
                <span key={t} className="inline-flex items-center gap-1 px-2 py-[2px] rounded-full text-[10px] font-medium" style={{ background: 'rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.75)' }}>
                  {icon && (
                    <OptimizedImage 
                      src={icon} 
                      alt={t} 
                      width={12} 
                      height={12} 
                      className={`w-3 h-3 object-contain ${
                        (t.toLowerCase().includes('node') || t.toLowerCase().includes('prisma')) ? 'bg-white rounded-full p-[1px]' : ''
                      }`} 
                    />
                  )}
                  {t}
                </span>
              );
            })}
            {project.techStacks.length > 4 && (
              <span className="px-2 py-[2px] rounded-full text-[10px] font-medium" style={{ background: 'rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.5)' }}>
                +{project.techStacks.length - 4}
              </span>
            )}
          </div>
        )}

        <div className="flex gap-2 mt-auto pt-1">
          {repo && <Button onClick={() => (project.repoPrivate ? setShowPrivate(true) : window.open(repo, '_blank'))} variant="default" icon={project.repoPrivate ? PrivateIcon : GitHubIcon} className="text-[11px] !px-2.5 !py-[4px]">Code</Button>}
          {live && <Button onClick={() => window.open(live, '_blank')} variant="accent" icon={ExternalIcon} className="text-[11px] !px-2.5 !py-[4px]">Live</Button>}
        </div>
      </div>
    </Card>
    {showPrivate && <PrivateRepoDialog projectTitle={project.title} onClose={() => setShowPrivate(false)} />}
    </>
  );
};

const MacPagination = ({ total, perPage, current, onChange }) => {
  const pages = Math.ceil(total / perPage);
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-1 mt-4">
      <button onClick={() => onChange(Math.max(1, current - 1))} disabled={current === 1}
        className="w-6 h-6 rounded-[5px] flex items-center justify-center text-white/50 hover:bg-white/[0.06] disabled:opacity-20 transition-colors">
        {ChevronLeft}
      </button>
      {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
        <button key={p} onClick={() => onChange(p)}
          className={`min-w-[24px] h-6 rounded-[5px] text-[11px] font-medium transition-colors ${
            p === current ? 'bg-[#0A84FF] text-white' : 'text-white/50 hover:bg-white/[0.06]'}`}>
          {p}
        </button>
      ))}
      <button onClick={() => onChange(Math.min(pages, current + 1))} disabled={current === pages}
        className="w-6 h-6 rounded-[5px] flex items-center justify-center text-white/50 hover:bg-white/[0.06] disabled:opacity-20 transition-colors">
        {ChevronRight}
      </button>
    </div>
  );
};

const FilterSheet = ({ isOpen, onClose, availableTechs, activeFilters, onApply }) => {
  const [techs, setTechs] = useState([]);
  const [difficulty, setDifficulty] = useState(null);
  const [mode, setMode] = useState('AND');

  useEffect(() => {
    if (isOpen) {
      setTechs(activeFilters.techStacks || []);
      setDifficulty(activeFilters.difficulty || null);
      setMode(activeFilters.techFilterMode || 'AND');
    }
  }, [isOpen, activeFilters]);

  const toggleTech = t => setTechs(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  const reset = () => { onApply({ techStacks: [], difficulty: null, techFilterMode: 'AND' }); onClose(); };
  const apply = () => { onApply({ techStacks: techs, difficulty, techFilterMode: mode }); onClose(); };

  if (!isOpen) return null;

  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <div onClick={e => e.stopPropagation()} className="w-full max-w-sm rounded-xl overflow-hidden border border-white/[0.1] shadow-2xl flex flex-col max-h-[75vh]" style={{ background: 'rgba(44, 44, 46, 0.88)', backdropFilter: 'blur(24px) saturate(150%)', WebkitBackdropFilter: 'blur(24px) saturate(150%)' }}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
          <button onClick={reset} className="text-[13px] text-white/50 hover:text-white/80 transition-colors">Reset</button>
          <span className="text-[13px] font-semibold text-white">Filters</span>
          <button onClick={apply} className="text-[13px] text-[#0A84FF] font-semibold hover:brightness-125 transition">Apply</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          <div>
            <SectionLabel>Difficulty</SectionLabel>
            <Card>
              <div className="divide-y divide-white/[0.06]">
                {[null, 'Easy', 'Intermediate', 'Advanced'].map(d => (
                  <button key={d ?? 'all'} onClick={() => setDifficulty(d)}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 text-[12.5px] text-white/80 hover:bg-white/[0.04] transition-colors">
                    <span>{d ?? 'All'}</span>
                    {difficulty === d && <Check size={16} weight="bold" className="text-[#0A84FF]" />}
                  </button>
                ))}
              </div>
            </Card>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <SectionLabel className="!mb-0">Technology</SectionLabel>
              <div className="flex rounded-[6px] overflow-hidden border border-white/[0.1]">
                {['AND', 'OR'].map(m => (
                  <button key={m} onClick={() => setMode(m)}
                    className={`px-2.5 py-0.5 text-[10px] font-semibold transition-colors ${
                      mode === m ? 'bg-[#0A84FF] text-white' : 'text-white/40 hover:bg-white/[0.06]'}`}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <Card>
              <div className="divide-y divide-white/[0.06]">
                {availableTechs.sort().map(t => (
                  <button key={t} onClick={() => toggleTech(t)}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 text-[12.5px] text-white/80 hover:bg-white/[0.04] transition-colors">
                    <span className="flex items-center gap-2">
                      {TECH_MAP[t]?.icon && (
                        <OptimizedImage 
                          src={TECH_MAP[t].icon} 
                          alt={t} 
                          width={16} 
                          height={16} 
                          className={`w-4 h-4 object-contain ${
                            (t.toLowerCase().includes('node') || t.toLowerCase().includes('prisma')) ? 'bg-white rounded-full p-[1px]' : ''
                          }`} 
                        />
                      )}
                      {t}
                    </span>
                    {techs.includes(t) && <Check size={16} weight="bold" className="text-[#0A84FF]" />}
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectsApp = () => {
  const { openBrowser } = useWindows();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState(() => {
    const initial = typeof window !== 'undefined' ? window.__projectsAppInitialFilter : null;
    if (initial) {
      if (typeof window !== 'undefined') window.__projectsAppInitialFilter = null;
      return { techStacks: [initial], difficulty: null, techFilterMode: 'AND' };
    }
    return { techStacks: [], difficulty: null, techFilterMode: 'AND' };
  });
  const [searchTerm, setSearchTerm] = useState(() => {
    const initialSearch = typeof window !== 'undefined' ? window.__projectsAppInitialSearch : null;
    if (initialSearch) {
      if (typeof window !== 'undefined') window.__projectsAppInitialSearch = null;
      return initialSearch;
    }
    return '';
  });
  const scrollRef = useRef(null);
  const perPage = 4;

  const openUrl = (url, title) => {
    openBrowser({ url, title: title || url, mode: 'web' }, { size: { w: 900, h: 600 } });
  };

  const changePage = (page) => {
    setCurrentPage(page);
    const scrollParent = scrollRef.current?.closest('.custom-scrollbar');
    if (scrollParent) scrollParent.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleFilterEvent = (e) => {
      const { skill, search } = e.detail;
      if (skill) {
        setActiveFilters(prev => ({ ...prev, techStacks: [skill] }));
      }
      if (search !== undefined) {
        setSearchTerm(search);
      } else {
        setSearchTerm('');
      }
      setCurrentPage(1);
    };
    window.addEventListener('filter-projects-by-skill', handleFilterEvent);
    return () => window.removeEventListener('filter-projects-by-skill', handleFilterEvent);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/portfolio/projects');
        if (res.ok) setProjects(await res.json());
      } catch (e) { console.error('Error fetching projects:', e); }
      finally { setLoading(false); }
    })();
  }, []);

  // Reset page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const availableTechs = useMemo(() => {
    const s = new Set();
    projects.forEach(p => p.techStacks?.forEach(t => s.add(t)));
    return Array.from(s);
  }, [projects]);

  const filtered = useMemo(() => projects.filter(p => {
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchTitle = p.title?.toLowerCase().includes(term);
      const matchDesc = p.description?.toLowerCase().includes(term);
      const matchTech = p.techStacks?.some(t => t.toLowerCase().includes(term));
      if (!matchTitle && !matchDesc && !matchTech) return false;
    }
    if (activeFilters.techStacks.length > 0) {
      const normalize = (t) => t.toLowerCase().replace(/\.js$/, '').replace(/\s+/g, '').trim();
      const matchStack = (f, pStacks) => pStacks.some(s => {
        const nf = normalize(f);
        const ns = normalize(s);
        return nf === ns || nf.includes(ns) || ns.includes(nf);
      });
      const ok = activeFilters.techFilterMode === 'AND'
        ? activeFilters.techStacks.every(f => matchStack(f, p.techStacks || []))
        : activeFilters.techStacks.some(f => matchStack(f, p.techStacks || []));
      if (!ok) return false;
    }
    if (activeFilters.difficulty && p.difficulty !== activeFilters.difficulty) return false;
    return true;
  }), [activeFilters, projects, searchTerm]);

  const posts = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);
  const hasActiveFilter = activeFilters.techStacks.length > 0 || activeFilters.difficulty || searchTerm.trim();

  if (loading) return <Centered><LoadingSpinner text="Loading projects..." /></Centered>;

  return (
    <Page>
      <div ref={scrollRef} />
      <div className="flex items-center gap-3 mb-3 select-none">
        <span className="text-[11px] text-white/35 shrink-0">{filtered.length} project{filtered.length !== 1 ? 's' : ''}</span>
        
        {/* iPhone-style Search Bar */}
        <div className="flex-1 relative flex items-center">
          <span className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none text-white/30">
            <MagnifyingGlass size={14} weight="bold" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search projects..."
            className="w-full bg-white/[0.07] hover:bg-white/[0.1] focus:bg-white/[0.1] text-[11px] text-white placeholder-white/30 rounded-[7px] pl-8 pr-7 py-1.5 outline-none border border-transparent focus:border-white/[0.05] transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-2 flex items-center text-white/30 hover:text-white/60"
            >
              <XCircle size={14} weight="fill" />
            </button>
          )}
        </div>

        <button onClick={() => setFilterOpen(true)}
          className="inline-flex items-center gap-1.5 px-2.5 py-[5px] rounded-[7px] text-[11px] font-medium text-white/60 border border-white/[0.1] hover:bg-white/[0.06] transition-colors shrink-0"
          style={{ background: 'linear-gradient(180deg, #4a4a4c, #3e3e40)', boxShadow: '0 1px 1px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)' }}>
          {FilterIcon}
          Filter
          {(activeFilters.techStacks.length > 0 || activeFilters.difficulty) && <span className="w-1.5 h-1.5 bg-[#0A84FF] rounded-full" />}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {posts.length > 0 ? posts.map(p => (
          <ProjectCard key={p.id} project={p} onOpenUrl={openUrl} />
        )) : (
          <div className="col-span-full py-10 text-center text-white/30 text-[13px]">No matching projects.</div>
        )}
      </div>

      <MacPagination total={filtered.length} perPage={perPage} current={currentPage} onChange={changePage} />

      <FilterSheet isOpen={filterOpen} onClose={() => setFilterOpen(false)}
        availableTechs={availableTechs} activeFilters={activeFilters}
        onApply={f => { setActiveFilters(f); changePage(1); }} />
    </Page>
  );
};

export default ProjectsApp;
