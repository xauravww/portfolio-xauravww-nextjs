'use client';
import { useState, useEffect } from 'react';
import { Page, Card, SectionLabel, Tag, SidebarItem, Centered } from './ui';
import LoadingSpinner from '../../LoadingSpinner';

const MapPinIcon = (
  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CalendarIcon = (
  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

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

  if (loading) return <Centered><LoadingSpinner text="Loading experience..." /></Centered>;
  if (data.length === 0) return <Centered>No experience data available.</Centered>;

  const exp = data.find(d => d.position === selected);
  const descriptionArray = exp
    ? Array.isArray(exp.description) ? exp.description : exp.description.split('\n').filter(l => l.trim())
    : [];
  const timeStr = exp
    ? `${formatDate(exp.startDate)} - ${exp.isCurrentJob || !exp.endDate ? 'Present' : formatDate(exp.endDate)}`
    : '';

  return (
    <div className="flex flex-col lg:flex-row h-full">
      <div className="lg:w-56 shrink-0 border-b lg:border-b-0 lg:border-r border-white/[0.06] p-2 overflow-y-auto">
        {data.map(d => (
          <SidebarItem
            key={d.id}
            active={selected === d.position}
            title={d.position}
            subtitle={d.company}
            onClick={() => setSelected(d.position)}
          />
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {exp && (
          <Page>
            <h2 className="text-[16px] font-bold text-white leading-tight">{exp.position}</h2>
            <p className="text-[12.5px] text-[#0A84FF] font-medium mt-0.5">{exp.company}</p>

            <div className="flex flex-wrap items-center gap-3 mt-2.5 text-[11.5px] text-white/45">
              <span className="flex items-center gap-1">{CalendarIcon}{timeStr}</span>
              {exp.location && <span className="flex items-center gap-1">{MapPinIcon}{exp.location}</span>}
            </div>

            <Card className="mt-4 mb-4">
              <div className="p-3.5">
                {descriptionArray.length > 1 ? (
                  <ul className="space-y-2 text-[13px] text-white/75 leading-relaxed list-disc pl-4">
                    {descriptionArray.map((point, i) => <li key={i}>{point}</li>)}
                  </ul>
                ) : (
                  <p className="text-[13px] text-white/75 leading-relaxed">{exp.description}</p>
                )}
              </div>
            </Card>

            {exp.skills?.length > 0 && (
              <>
                <SectionLabel>Technologies & Skills</SectionLabel>
                <Card>
                  <div className="p-3 flex flex-wrap gap-1.5">
                    {exp.skills.map(s => <Tag key={s}>{s}</Tag>)}
                  </div>
                </Card>
              </>
            )}
          </Page>
        )}
      </div>
    </div>
  );
};

export default ExperienceApp;
