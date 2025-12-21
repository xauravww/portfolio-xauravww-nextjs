import React from "react";
import PropTypes from 'prop-types';

const ExperienceItem = ({ title, company, time, description, skills, location }) => {
  // Handle description as either string or array
  const descriptionArray = Array.isArray(description) 
    ? description 
    : description.split('\n').filter(line => line.trim());

  return (
    <>
      <div className="flex flex-col justify-start items-start">
        <div className="text-md lg:text-lg text-[var(--text-medium)] mb-2">{time}</div>
        {location && (
          <div className="text-sm lg:text-md text-[var(--text-medium)] mb-3 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {location}
          </div>
        )}
        
        <div className="text-md lg:text-lg text-[var(--text-light)] mb-6 leading-relaxed">
          {descriptionArray.length > 1 ? (
            <ul className="list-disc pl-5 space-y-2 text-[var(--text-light)]/90">
              {descriptionArray.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          ) : (
            <p className="text-[var(--text-light)]/90">{description}</p>
          )}
        </div>

        {skills && skills.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-[var(--text-light)] mb-3 uppercase tracking-wide">Technologies & Skills</h4>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-[#f3d800]/15 text-[#f3d800] text-sm rounded-full font-medium hover:bg-[#f3d800]/25 hover:scale-105 transition-all duration-200 border border-[#f3d800]/20"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

ExperienceItem.propTypes = {
  title: PropTypes.string.isRequired,
  company: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  description: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]).isRequired,
  skills: PropTypes.arrayOf(PropTypes.string),
  location: PropTypes.string,
};


export default ExperienceItem; 