'use client';
import { useState, useEffect } from 'react';
import { Page, Card, SectionLabel, Centered } from './ui';
import LoadingSpinner from '../../LoadingSpinner';

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
  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(true);

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
  }, []);

  if (loading) return <Centered><LoadingSpinner text="Loading skills..." /></Centered>;

  const cats = CAT_ORDER.filter(c => grouped[c]).concat(Object.keys(grouped).filter(c => !CAT_ORDER.includes(c)));

  return (
    <Page className="space-y-4">
      {cats.map(cat => (
        <div key={cat}>
          <SectionLabel>{CAT_LABELS[cat] || cat}</SectionLabel>
          <Card>
            <div className="p-3 grid grid-cols-4 sm:grid-cols-6 gap-x-2 gap-y-3">
              {grouped[cat].map(t => (
                <div key={t.id} className="flex flex-col items-center gap-1.5 group">
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
    </Page>
  );
};

export default TechStackApp;
