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
  { name: 'HTML & CSS', icon: '/assets/techstack/html-css.png', category: 'frontend' },
  { name: 'JavaScript', icon: '/assets/techstack/js.png', category: 'frontend' },
  { name: 'TypeScript', icon: '/assets/typescript.png', category: 'frontend' },
  { name: 'React.js', icon: '/assets/techstack/react.png', category: 'frontend' },
  { name: 'Tailwind CSS', icon: '/assets/tailwind.png', category: 'frontend' },
  { name: 'Redux Toolkit', icon: '/assets/redux-toolkit.png', category: 'frontend' },
  { name: 'XML', icon: '/assets/techstack/xml.png', category: 'frontend' },
  { name: 'Node.js', icon: '/assets/techstack/nodejs.png', category: 'backend' },
  { name: 'Express.js', icon: '/assets/techstack/express-js.webp', category: 'backend' },
  { name: 'GraphQL', icon: '/assets/graphql.png', category: 'backend' },
  { name: 'Notion API', icon: '/assets/techstack/notion.png', category: 'backend' },
  { name: 'MongoDB', icon: '/assets/techstack/mongodb.png', category: 'database' },
  { name: 'Redis', icon: '/assets/techstack/redis.png', category: 'database' },
  { name: 'Sanity CMS', icon: '/assets/techstack/sanity.png', category: 'database' },
  { name: 'N8N', icon: '/assets/techstack/n8n.jpg', category: 'devops' },
  { name: 'Postman', icon: '/assets/postman.png', category: 'devops' },
  { name: 'React Native', icon: '/assets/techstack/react-native.png', category: 'mobile' },
  { name: 'Kotlin', icon: '/assets/techstack/kotlin.png', category: 'mobile' },
  { name: 'Android', icon: '/assets/techstack/android.png', category: 'mobile' },
  { name: 'C++', icon: '/assets/techstack/cpp.png', category: 'mobile' },
].map((t, i) => ({ ...t, id: `fb-${i}` }));

const TechStackApp = () => {
  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/portfolio/techstacks');
        let data = res.ok ? await res.json() : [];
        if (!Array.isArray(data) || data.length === 0) data = FALLBACK;
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
                  <div className="w-11 h-11 rounded-[10px] bg-white/[0.05] flex items-center justify-center group-hover:bg-white/[0.09] transition-colors">
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
