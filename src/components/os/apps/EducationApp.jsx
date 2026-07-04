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

const EducationApp = () => {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileView, setMobileView] = useState('list'); // 'list' or 'detail'

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/portfolio/educations');
        if (res.ok) {
          const d = await res.json();
          setData(d);
          if (d.length > 0) setSelected(d[0].id);
        }
      } catch (e) { console.error('Error fetching educations:', e); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <Centered><LoadingSpinner text="Loading education..." /></Centered>;
  if (data.length === 0) return <Centered>No education data available.</Centered>;

  const edu = data.find(d => d.id === selected);
  const timeStr = edu
    ? `${formatDate(edu.startDate)} - ${edu.isCurrentlyStudying || !edu.endDate ? 'Present' : formatDate(edu.endDate)}`
    : '';

  if (isMobile) {
    if (mobileView === 'list') {
      return (
        <div className="h-full overflow-y-auto p-3">
          <SectionLabel className="px-1.5 py-1">Education List</SectionLabel>
          <div className="space-y-1">
            {data.map(d => (
              <SidebarItem
                key={d.id}
                active={selected === d.id}
                title={d.degree}
                subtitle={d.field}
                showChevron={true}
                onClick={() => {
                  setSelected(d.id);
                  setMobileView('detail');
                }}
              />
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="h-full overflow-y-auto">
        {edu && (
          <Page>
            <button
              onClick={() => setMobileView('list')}
              className="inline-flex items-center gap-1.5 text-[#0A84FF] text-[15px] font-normal mb-4 active:opacity-60 transition-opacity"
            >
              <svg className="w-5 h-5 -ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back</span>
            </button>

            <h2 className="text-[17px] font-bold text-white leading-tight">{edu.institution}</h2>
            <p className="text-[13px] text-[#0A84FF] font-medium mt-0.5">
              {edu.degree}{edu.field && ` in ${edu.field}`}
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-2.5 text-[11.5px] text-white/45">
              <span className="flex items-center gap-1">{CalendarIcon}{timeStr}</span>
              {edu.location && <span className="flex items-center gap-1">{MapPinIcon}{edu.location}</span>}
            </div>

            {edu.gpa && (
              <div className="mt-3">
                <Tag tint="#0A84FF">GPA: {edu.gpa}</Tag>
              </div>
            )}

            {edu.description && (
              <Card className="mt-4 mb-4">
                <div className="p-3.5">
                  <p className="text-[13px] text-white/75 leading-relaxed">{edu.description}</p>
                </div>
              </Card>
            )}

            {edu.achievements?.length > 0 && (
              <>
                <SectionLabel>Achievements</SectionLabel>
                <Card>
                  <div className="p-3 flex flex-wrap gap-1.5">
                    {edu.achievements.map((a, i) => <Tag key={i}>{a}</Tag>)}
                  </div>
                </Card>
              </>
            )}
          </Page>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-full">
      <div className="lg:w-56 shrink-0 border-b lg:border-b-0 lg:border-r border-white/[0.06] p-2 overflow-y-auto">
        {data.map(d => (
          <SidebarItem
            key={d.id}
            active={selected === d.id}
            title={d.degree}
            subtitle={d.field}
            onClick={() => setSelected(d.id)}
          />
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {edu && (
          <Page>
            <h2 className="text-[16px] font-bold text-white leading-tight">{edu.institution}</h2>
            <p className="text-[12.5px] text-[#0A84FF] font-medium mt-0.5">
              {edu.degree}{edu.field && ` in ${edu.field}`}
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-2.5 text-[11.5px] text-white/45">
              <span className="flex items-center gap-1">{CalendarIcon}{timeStr}</span>
              {edu.location && <span className="flex items-center gap-1">{MapPinIcon}{edu.location}</span>}
            </div>

            {edu.gpa && (
              <div className="mt-3">
                <Tag tint="#0A84FF">GPA: {edu.gpa}</Tag>
              </div>
            )}

            {edu.description && (
              <Card className="mt-4 mb-4">
                <div className="p-3.5">
                  <p className="text-[13px] text-white/75 leading-relaxed">{edu.description}</p>
                </div>
              </Card>
            )}

            {edu.achievements?.length > 0 && (
              <>
                <SectionLabel>Achievements</SectionLabel>
                <Card>
                  <div className="p-3 flex flex-wrap gap-1.5">
                    {edu.achievements.map((a, i) => <Tag key={i}>{a}</Tag>)}
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

export default EducationApp;
