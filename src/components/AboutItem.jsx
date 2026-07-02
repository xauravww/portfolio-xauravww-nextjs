import React from "react";
import PropTypes from 'prop-types';

const AboutItem = ({ class: classNameSchool, school, time, marks, field, location, achievements, description }) => {
  return (
    <div className="flex flex-col justify-start items-start">
      <div className="text-2xl lg:text-4xl font-bold text-heading mb-4">{school}</div>
      <div className="flex items-center bg-gold text-lg text-inverse rounded-lg py-2.5 px-5 mb-3 font-semibold shadow-md">
        {classNameSchool} {field && `in ${field}`}
      </div>

      {location && (
        <div className="text-sm lg:text-base text-body mb-2 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {location}
        </div>
      )}

      <div className="text-base lg:text-lg text-body mb-2">{time}</div>

      {marks && (
        <div className="text-base lg:text-lg mb-3 text-gold font-medium">
          GPA: {marks}
        </div>
      )}

      {description && (
        <div className="text-sm lg:text-base text-heading/90 mb-6 leading-relaxed">
          {description}
        </div>
      )}

      {achievements && achievements.length > 0 && (
        <div className="mt-6">
          <h4 className="text-xs font-semibold text-heading mb-3 uppercase tracking-wide">Achievements</h4>
          <div className="flex flex-wrap gap-2">
            {achievements.map((achievement, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-gold/15 text-gold text-xs font-medium rounded-full hover:bg-gold/25 hover:scale-105 transition-all duration-200 border border-gold/20"
              >
                {achievement}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

AboutItem.propTypes = {
  class: PropTypes.string.isRequired,
  school: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  marks: PropTypes.string,
  field: PropTypes.string,
  location: PropTypes.string,
  achievements: PropTypes.arrayOf(PropTypes.string),
  description: PropTypes.string,
};

export default AboutItem;
