'use client';
import { useState, useEffect, useMemo } from 'react';
import ProjectItem from '../../ProjectItem';
import Pagination from '../../Pagination';
import FilterModal from '../../FilterModal';
import LoadingSpinner from '../../LoadingSpinner';

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

const ProjectsApp = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({ techStacks: [], difficulty: null, techFilterMode: 'AND' });
  const perPage = 4;

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/portfolio/projects');
        if (res.ok) setProjects(await res.json());
      } catch (e) { console.error('Error fetching projects:', e); }
      finally { setLoading(false); }
    })();
  }, []);

  const availableTechStacks = useMemo(() => {
    const s = new Set();
    projects.forEach(p => p.techStacks?.forEach(t => s.add(t)));
    return Array.from(s);
  }, [projects]);

  const filtered = useMemo(() => projects.filter(p => {
    if (activeFilters.techStacks.length > 0) {
      const ok = activeFilters.techFilterMode === 'AND'
        ? activeFilters.techStacks.every(f => p.techStacks?.includes(f))
        : activeFilters.techStacks.some(f => p.techStacks?.includes(f));
      if (!ok) return false;
    }
    if (activeFilters.difficulty && p.difficulty !== activeFilters.difficulty) return false;
    return true;
  }), [activeFilters, projects]);

  const posts = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  if (loading) return <div className="flex items-center justify-center h-60"><LoadingSpinner text="Loading projects..." /></div>;

  return (
    <div className="p-4 md:p-5">
      <div className="flex justify-between items-center mb-4">
        <p className="text-white/30 text-[11px]">{filtered.length} project{filtered.length !== 1 ? 's' : ''}</p>
        <button onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg text-[11px] font-medium text-white/60 hover:bg-white/10 hover:text-white/80 transition-colors">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
          Filter
          {(activeFilters.techStacks.length > 0 || activeFilters.difficulty) && <span className="w-1.5 h-1.5 bg-gold rounded-full" />}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {posts.length > 0 ? posts.map(item => (
          <ProjectItem key={item.id} img={item.img} description={item.description} techStacks={item.techStacks}
            url={item.url} projectTitle={item.title} techStackData={TECH_MAP} techStacksLoading={false} />
        )) : (
          <div className="col-span-full text-center py-10 text-white/30 text-sm">No matching projects.</div>
        )}
      </div>

      {filtered.length > perPage && (
        <div className="mt-4">
          <Pagination totalPosts={filtered.length} postPerPage={perPage} setcurrentPage={setCurrentPage} currentPage={currentPage} />
        </div>
      )}

      <FilterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
        onApplyFilters={(f) => { setActiveFilters(f); setCurrentPage(1); }}
        availableTechStacks={availableTechStacks} activeFilters={activeFilters} />
    </div>
  );
};

export default ProjectsApp;
