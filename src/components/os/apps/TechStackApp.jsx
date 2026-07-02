'use client';
import { useState, useEffect } from 'react';
import LoadingSpinner from '../../LoadingSpinner';

const CAT_LABELS = {
  frontend: 'Frontend', backend: 'Backend', database: 'Database',
  devops: 'DevOps & Tools', design: 'Design', other: 'Other',
};

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

  if (loading) return <div className="flex items-center justify-center h-60"><LoadingSpinner text="Loading skills..." /></div>;

  return (
    <div className="p-5 space-y-6">
      {Object.entries(grouped).map(([cat, techs]) => (
        <div key={cat}>
          <h3 className="text-[11px] font-semibold text-gold/80 uppercase tracking-widest mb-3">{CAT_LABELS[cat] || cat}</h3>
          <div className="flex flex-wrap gap-2.5">
            {techs.map(t => (
              <div key={t.id} className="flex flex-col items-center group w-16">
                <div className="bg-white/[0.04] rounded-lg p-2 hover:bg-white/[0.08] transition-colors w-full flex items-center justify-center">
                  <img src={t.icon} className="w-8 h-8 md:w-10 md:h-10 object-contain" alt={t.name}
                    onError={(e) => { e.target.style.display='none'; if(e.target.nextSibling) e.target.nextSibling.style.display='flex'; }} />
                  <div className="hidden w-8 h-8 md:w-10 md:h-10 bg-gold/10 rounded items-center justify-center text-gold text-[9px] font-medium">
                    {t.name.split(' ')[0]}
                  </div>
                </div>
                <span className="text-[9px] text-white/40 mt-1 text-center leading-tight group-hover:text-white/60 transition-colors truncate w-full">{t.name}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TechStackApp;
