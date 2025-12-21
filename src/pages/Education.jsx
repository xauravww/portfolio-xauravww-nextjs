'use client';
import { useState, useEffect } from "react";
import AboutItem from "../components/AboutItem";
import PropTypes from 'prop-types';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function Education({ containerId }) {
  const [educationData, setEducationData] = useState([]);
  const [showItem, setShowItem] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Fetch education data from database
    const fetchEducations = async () => {
      try {
        const response = await fetch('/api/portfolio/educations');
        if (response.ok) {
          const data = await response.json();
          setEducationData(data);
          if (data.length > 0) {
            setShowItem(data[0].degree);
          }
        }
      } catch (error) {
        console.error('Error fetching educations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEducations();

    // Delay animation to ensure elements exist
    setTimeout(() => {
      if (document.querySelector('.education-content-box')) {
        gsap.fromTo(".education-content-box",
          { opacity: 0, y: 50, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".education-container",
              start: "top 70%",
            }
          }
        );
      }
    }, 100);

  }, []);

  const handleClick = (degree) => {
    setShowItem(degree);
  };

  if (loading) {
    return (
      <div className="education-container flex flex-col items-center justify-center min-h-screen relative py-16 md:py-24" id={containerId}>
        <div className="pattern2 absolute top-0 left-0 right-0 h-full w-full bg-[url('/assets/pattern2.png')] z-[1] backdrop-blur bg-fixed bg-center bg-no-repeat bg-cover"></div>
        <div className="mask absolute top-0 left-0 h-full w-full bg-[rgba(0,0,0,0.6)] z-[2]"></div>
        <div className="text-white text-xl z-[10] relative">Loading education...</div>
      </div>
    );
  }

  return (
    <div className="education-container flex flex-col items-center justify-center min-h-screen relative py-16 md:py-24" id={containerId}>
        <div className="pattern2 absolute top-0 left-0 right-0 h-full w-full bg-[url('/assets/pattern2.png')] z-[1] backdrop-blur bg-fixed bg-center bg-no-repeat bg-cover"></div>
      <div className="mask absolute top-0 left-0 h-full w-full bg-[rgba(0,0,0,0.6)] z-[2]"></div>
      <header className="text-3xl md:text-5xl text-white font-bold relative z-[10] text-center px-4 mb-8 md:mb-16">
        Education
        <div className="underline-below-header absolute w-3/5 h-1 bg-[#f3d800] bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1"></div>
      </header>

      {educationData.length === 0 ? (
        <div className="text-[var(--text-medium)] text-center z-[10] relative">
          No education data available.
        </div>
      ) : (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-[10] relative">
          <div className="education-content-box p-4 sm:p-6 lg:p-8 text-[var(--text-light)] grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 bg-[#1A1D24]/70 backdrop-blur-sm rounded-xl shadow-xl">
            <div className="lg:col-span-1 pb-4 lg:pb-0 lg:pr-6">
            {educationData.map((item) => (
              <div
                key={item.id}
                className={`py-3 px-4 text-lg font-medium mt-3 cursor-pointer rounded-lg transition-all duration-200 ${
                  showItem === item.degree
                    ? "bg-[#f3d800]/10 text-[#f3d800] shadow-md"
                    : "text-[var(--text-medium)] hover:text-[var(--text-light)] hover:bg-[#1A1D24]/60"
                }`}
                onClick={() => handleClick(item.degree)}
              >
                <div>{item.degree}</div>
                <div className="text-sm text-[var(--text-medium)]">{item.field}</div>
              </div>
            ))}
          </div>
            <div className="lg:col-span-2 flex flex-col justify-start mt-4 lg:mt-0 lg:pl-6">
            {showItem &&
              educationData.filter((data) => data.degree === showItem).map((data) => (
                <AboutItem
                  key={data.id}
                  class={data.degree}
                  school={data.institution}
                  time={`${new Date(data.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - ${
                    data.isCurrentlyStudying ? 'Present' : data.endDate ? new Date(data.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'
                  }`}
                  marks={data.gpa}
                  field={data.field}
                  location={data.location}
                  achievements={data.achievements}
                  description={data.description}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

Education.propTypes = {
  containerId: PropTypes.string.isRequired,
};

export default Education;
