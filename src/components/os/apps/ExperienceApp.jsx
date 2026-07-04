'use client';
import { useState, useEffect, useMemo } from 'react';
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
  const [selected, setSelected] = useState(() => {
    const initial = typeof window !== 'undefined' ? window.__experienceAppInitialSelected : null;
    if (initial) {
      if (typeof window !== 'undefined') window.__experienceAppInitialSelected = null;
      return initial;
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileView, setMobileView] = useState(() => {
    const initial = typeof window !== 'undefined' ? window.__experienceAppInitialSelected : null;
    return initial ? 'detail' : 'list';
  });
  const [searchTerm, setSearchTerm] = useState(() => {
    const initialSearch = typeof window !== 'undefined' ? window.__experienceAppInitialSearch : null;
    if (initialSearch) {
      if (typeof window !== 'undefined') window.__experienceAppInitialSearch = null;
      return initialSearch;
    }
    return '';
  });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const handleFilterEvent = (e) => {
      const { skill, position } = e.detail;
      if (position) {
        setSelected(position);
        setMobileView('detail');
      }
      if (skill !== undefined) {
        setSearchTerm(skill);
      }
    };
    window.addEventListener('filter-experiences-by-skill', handleFilterEvent);
    return () => window.removeEventListener('filter-experiences-by-skill', handleFilterEvent);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/portfolio/experiences');
        if (res.ok) {
          const d = await res.json();
          setData(d);
          if (d.length > 0) setSelected(prev => prev || d[0].position);
        }
      } catch (e) { console.error('Error fetching experiences:', e); }
      finally { setLoading(false); }
    })();
  }, []);

  // Filter logic
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase();
    return data.filter(d => 
      d.position.toLowerCase().includes(term) ||
      d.company.toLowerCase().includes(term) ||
      (d.skills && d.skills.some(s => s.toLowerCase().includes(term)))
    );
  }, [data, searchTerm]);

  // Desktop selection sync
  useEffect(() => {
    if (!isMobile && filteredData.length > 0 && !filteredData.some(d => d.position === selected)) {
      setSelected(filteredData[0].position);
    }
  }, [filteredData, selected, isMobile]);

  if (loading) return <Centered><LoadingSpinner text="Loading experience..." /></Centered>;
  if (data.length === 0) return <Centered>No experience data available.</Centered>;

  const exp = filteredData.find(d => d.position === selected) || data.find(d => d.position === selected);
  const descriptionArray = exp
    ? Array.isArray(exp.description) ? exp.description : exp.description.split('\n').filter(l => l.trim())
    : [];
  const timeStr = exp
    ? `${formatDate(exp.startDate)} - ${exp.isCurrentJob || !exp.endDate ? 'Present' : formatDate(exp.endDate)}`
    : '';

  // Render Search Bar Component
  const renderSearchBar = () => (
    <div className="relative flex items-center w-full px-1.5 py-1">
      <div className="relative w-full">
        <span className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none text-white/30">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          className="w-full bg-white/[0.07] hover:bg-white/[0.1] focus:bg-white/[0.1] text-[12.5px] text-white placeholder-white/30 rounded-[10px] pl-8 pr-7 py-1.5 outline-none border border-transparent focus:border-white/[0.05] transition-all"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-2 flex items-center text-white/30 hover:text-white/60"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    if (mobileView === 'list') {
      return (
        <div className="h-full flex flex-col bg-[#1c1c1e]">
          <div className="px-3 pt-3 shrink-0">
            {renderSearchBar()}
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            <SectionLabel className="px-1.5 py-1">Experience List</SectionLabel>
            <div className="space-y-1">
              {filteredData.length > 0 ? (
                filteredData.map(d => (
                  <SidebarItem
                    key={d.id}
                    active={selected === d.position}
                    title={d.position}
                    subtitle={d.company}
                    showChevron={true}
                    onClick={() => {
                      setSelected(d.position);
                      setMobileView('detail');
                    }}
                  />
                ))
              ) : (
                <div className="text-[12px] text-white/30 text-center py-8">No experiences found.</div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="h-full overflow-y-auto">
        {exp && (
          <Page>
            <button
              onClick={() => setMobileView('list')}
              className="inline-flex items-center gap-1 text-[#0A84FF] text-[15px] font-normal mb-4 active:opacity-60 transition-opacity"
            >
              <svg className="w-5 h-5 -ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back</span>
            </button>

            <h2 className="text-[17px] font-bold text-white leading-tight">{exp.position}</h2>
            <p className="text-[13px] text-[#0A84FF] font-medium mt-0.5">{exp.company}</p>

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
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-full">
      <div className="lg:w-56 shrink-0 border-b lg:border-b-0 lg:border-r border-white/[0.06] p-2 flex flex-col overflow-hidden">
        <div className="pb-2 shrink-0">
          {renderSearchBar()}
        </div>
        <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
          {filteredData.length > 0 ? (
            filteredData.map(d => (
              <SidebarItem
                key={d.id}
                active={selected === d.position}
                title={d.position}
                subtitle={d.company}
                onClick={() => setSelected(d.position)}
              />
            ))
          ) : (
            <div className="text-[12px] text-white/30 text-center py-4">No results.</div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {exp ? (
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
        ) : (
          <Centered>
            <p className="text-white/30 text-[13px]">Select an experience to view details.</p>
          </Centered>
        )}
      </div>
    </div>
  );
};

export default ExperienceApp;
