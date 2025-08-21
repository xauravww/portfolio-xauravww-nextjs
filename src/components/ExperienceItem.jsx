import React from "react";
import PropTypes from 'prop-types';

const ExperienceItem = ({ title, company, time, description }) => {
  return (
    <>
      <div className="flex flex-col justify-start items-start">
        <div className="text-md lg:text-lg text-[var(--text-medium)] mb-3">{time}</div>
        <ul className="list-disc pl-5 text-md lg:text-lg text-[var(--text-light)] space-y-1">
          {description.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </div>
    </>
  );
};

ExperienceItem.propTypes = {
  title: PropTypes.string.isRequired,
  company: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  description: PropTypes.arrayOf(PropTypes.string).isRequired,
};


export default ExperienceItem; 