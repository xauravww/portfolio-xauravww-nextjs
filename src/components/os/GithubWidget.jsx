'use client';
import { GitHubCalendar } from 'react-github-calendar';

const GithubWidget = ({ username, className = '' }) => {
  return (
    <div className={`bg-white/[0.08] border border-white/10 backdrop-blur-md rounded-[22px] p-5 shadow-lg flex flex-col gap-3 ${className}`}>
      <h3 className="text-white font-semibold flex items-center gap-2">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 0c-6.6 0-12 5.4-12 12 0 5.3 3.4 9.8 8.2 11.4.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2 1-.3 2-.4 3-.4s2 .1 3 .4c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.8-1.6 8.2-6.1 8.2-11.4 0-6.6-5.4-12-12-12z"/></svg>
        GitHub Activity
      </h3>
      <div className="text-white/80 overflow-hidden w-full max-w-full">
        <div className="overflow-x-auto custom-scrollbar pb-2 w-full max-w-full hidden md:block">
          <GitHubCalendar 
            username={username} 
            colorScheme="dark"
            blockSize={9}
            blockMargin={2}
            fontSize={11}
          />
        </div>
        <div className="overflow-x-auto custom-scrollbar pb-2 w-full max-w-full md:hidden">
          <GitHubCalendar 
            username={username} 
            colorScheme="dark"
            blockSize={8}
            blockMargin={3}
            fontSize={10}
            hideTotalCount={true}
            hideColorLegend={true}
          />
        </div>
      </div>
    </div>
  );
};

export default GithubWidget;
