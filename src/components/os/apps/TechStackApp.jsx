'use client';
import { useState, useEffect } from 'react';
import { Page, Card, SectionLabel, Centered } from './ui';
import LoadingSpinner from '../../LoadingSpinner';

const CAT_LABELS = {
  frontend: 'Frontend', backend: 'Backend', database: 'Database',
  devops: 'DevOps & Tools', design: 'Design', other: 'Other',
};
const CAT_ORDER = ['frontend', 'backend', 'database', 'devops', 'design', 'other'];

const TechStackApp = () => {
  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/portfolio/techstacks');
        if (res.ok) {
          const data = await res.json();
          const g = data.reduce((acc, t) => { (acc[t.category] = acc[t.category] || []).push(t); return acc; }, {});
          setGrouped(g);
        }
      } catch (e) { console.error('Error fetching tech stacks:', e); }
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
