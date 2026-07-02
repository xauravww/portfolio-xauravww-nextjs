'use client';
import { useState, useEffect } from 'react';
import AboutItem from '../../AboutItem';
import LoadingSpinner from '../../LoadingSpinner';

const EducationApp = () => {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/portfolio/educations');
        if (res.ok) {
          const d = await res.json();
          setData(d);
          if (d.length > 0) setSelected(d[0].degree);
        }
      } catch (e) { console.error('Error fetching educations:', e); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-60"><LoadingSpinner text="Loading education..." /></div>;
  if (data.length === 0) return <div className="p-6 text-center text-white/30 text-sm">No education data available.</div>;

  return (
    <div className="flex flex-col lg:flex-row h-full">
      <div className="lg:w-56 shrink-0 border-b lg:border-b-0 lg:border-r border-white/[0.06] p-3 overflow-y-auto">
        {data.map(d => (
          <button key={d.id} onClick={() => setSelected(d.degree)}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-[12px] mb-1 transition-colors ${
              selected === d.degree ? 'bg-gold/10 text-gold' : 'text-white/40 hover:text-white/60 hover:bg-white/[0.04]'}`}>
            <div className="font-medium">{d.degree}</div>
            <div className="text-[10px] text-white/25 mt-0.5">{d.field}</div>
          </button>
        ))}
      </div>
      <div className="flex-1 p-5 overflow-y-auto">
        {selected && data.filter(d => d.degree === selected).map(d => (
          <AboutItem key={d.id}
            class={d.degree} school={d.institution}
            time={`${new Date(d.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - ${
              d.isCurrentlyStudying ? 'Present' : d.endDate ? new Date(d.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'
            }`}
            marks={d.gpa} field={d.field} location={d.location} achievements={d.achievements} description={d.description} />
        ))}
      </div>
    </div>
  );
};

export default EducationApp;
