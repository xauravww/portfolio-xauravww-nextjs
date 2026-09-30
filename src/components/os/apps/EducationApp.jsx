'use client';
import { useState, useEffect } from 'react';
import { MapPin, CalendarBlank, CaretLeft } from '@phosphor-icons/react';
import { Page, Card, SectionLabel, Tag, SidebarItem, Centered } from './ui';
import LoadingSpinner from '../../LoadingSpinner';

const MapPinIcon = <MapPin size={14} weight="bold" className="shrink-0" />;
const CalendarIcon = <CalendarBlank size={14} weight="bold" className="shrink-0" />;

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
              <CaretLeft size={20} weight="bold" className="-ml-1.5" />
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
