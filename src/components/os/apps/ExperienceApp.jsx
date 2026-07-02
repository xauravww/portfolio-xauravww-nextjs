'use client';
import { useState, useEffect } from 'react';
import ExperienceItem from '../../ExperienceItem';
import LoadingSpinner from '../../LoadingSpinner';

const ExperienceApp = () => {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/portfolio/experiences');
        if (res.ok) {
          const d = await res.json();
          setData(d);
          if (d.length > 0) setSelected(d[0].position);
        }
      } catch (e) { console.error('Error fetching experiences:', e); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-60"><LoadingSpinner text="Loading experience..." /></div>;
  if (data.length === 0) return <div className="p-6 text-center text-white/30 text-sm">No experience data available.</div>;

  return (
    <div className="flex flex-col lg:flex-row h-full">
      <div className="lg:w-56 shrink-0 border-b lg:border-b-0 lg:border-r border-white/[0.06] p-3 overflow-y-auto">
        {data.map(d => (
          <button key={d.id} onClick={() => setSelected(d.position)}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-[12px] mb-1 transition-colors ${
              selected === d.position ? 'bg-gold/10 text-gold' : 'text-white/40 hover:text-white/60 hover:bg-white/[0.04]'}`}>
            <div className="font-medium">{d.position}</div>
            <div className="text-[10px] text-white/25 mt-0.5">{d.company}</div>
          </button>
        ))}
      </div>
      <div className="flex-1 p-5 overflow-y-auto">
        {selected && data.filter(d => d.position === selected).map(d => (
          <ExperienceItem key={d.id} title={d.position} company={d.company}
            time={`${new Date(d.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - ${
              d.isCurrentJob ? 'Present' : d.endDate ? new Date(d.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'
            }`}
            description={d.description} skills={d.skills} location={d.location} />
        ))}
      </div>
    </div>
  );
};

export default ExperienceApp;
