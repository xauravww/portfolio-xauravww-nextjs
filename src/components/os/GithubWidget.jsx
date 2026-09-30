'use client';
import { GithubLogo } from '@phosphor-icons/react';
import { GitHubCalendar } from 'react-github-calendar';

const GithubWidget = ({ username, className = '' }) => {
  return (
    <div className={`bg-white/[0.08] border border-white/10 backdrop-blur-md rounded-[22px] p-5 shadow-lg flex flex-col gap-3 ${className}`}>
      <h3 className="text-white font-semibold flex items-center gap-2">
        <GithubLogo size={20} weight="fill" />
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
