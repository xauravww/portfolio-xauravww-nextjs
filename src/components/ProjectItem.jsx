'use client';
import PropTypes from "prop-types";
import React, { useState } from "react";

const techStackImages = {
  "Express.js": "/assets/techstack/express-js.webp",
  MongoDB: "/assets/techstack/mongodb.png",
  "Tailwind CSS": "/assets/tailwind.png",
  ReactJS: "/assets/techstack/react.png",
  "React Native": "/assets/techstack/react-native.png",
  NotionDB: "/assets/techstack/notion.png",
  "Sanity CMS": "/assets/techstack/sanity.png",
  VanillaJs: "/assets/techstack/js.png",
  "Node.js": "/assets/techstack/nodejs.png",
  "Redux-Toolkit": "/assets/techstack/redux-toolkit.png",
  "Redis": "/assets/techstack/redis.png",
  "GramJS": "/assets/techstack/gramjs.png",
  "N8N": "/assets/techstack/n8n.jpg"
};

const ProjectItem = ({ img, description, techStacks = [], url ,projectTitle }) => {
  const [hoverItem, setHoverItem] = useState(false);
  const repo = url.repo;
  const live = url.live;
// if( !img && !description && !techStacks && !url && !projectTitle){
//   console.log("Some project details missing")
// }

  return (
    <div
      className="relative w-full rounded-xl h-[50vw] lg:h-[20vw] "
      onMouseEnter={() => setHoverItem(true)}
      onMouseLeave={() => setHoverItem(false)}
    >
      <img
        className="rounded-xl h-full w-full object-cover "
        src={img}
        alt="Project"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/assets/techstack/image-not-found.png";
        }}
      />
      <div
        className={`absolute rounded-b-xl inset-x-0 bottom-[-1px] bg-[var(--bg-dark)] border-t border-[var(--border-color)] transition-opacity duration-300 ease-in-out ${
          hoverItem ? "opacity-100" : "opacity-0"
        }  text-white flex flex-col`}
      >
        {hoverItem && (
          <div className="flex flex-col p-4 w-full">
            <div className="flex flex-row gap-2 mb-4">
              {techStacks.map((tech, index) => (
                <img
                  key={index}
                  className="rounded-full border-2 border-[var(--accent-blue)]"
                  src={techStackImages[tech] || "default-image-path.png"} // Replace with a default image path if needed
                  alt={tech}
                  style={{
                    width: `${30}px`,
                    height: `${30}px`,
                    zIndex: techStacks.length - index,
                    margin: "-7px",
                    backgroundColor: "var(--bg-dark)",
                  }}
                />
              ))}
            </div>
            <div className="text-sm md:text-3xl mb-4">{projectTitle}</div>
            <p className="text-[var(--text-medium)] font-oregano text-sm md:text-2xl mb-4">{description.length>100?`${description.slice(0,100)}...`:description}</p>
            <div className="flex gap-2">
              {repo && (
                <img
                src="/assets/github.svg"
                alt="GitHub"
                className="w-6 h-6 cursor-pointer hover:scale-125"
                style={{
                  filter:
                    "invert(100%) sepia(0%) saturate(7499%) hue-rotate(65deg) brightness(99%) contrast(95%)",
                }}
                onClick={() => window.open(repo, "_blank")}
              />
              )}
              {live && (
                <img
                  src="/assets/arrow-up-right.svg"
                  alt="GitHub"
                  className="w-6 h-6 cursor-pointer hover:scale-125"
                  style={{
                    filter:
                      "invert(100%) sepia(0%) saturate(7499%) hue-rotate(65deg) brightness(99%) contrast(95%)",
                  }}
                  onClick={() => window.open(live, "_blank")}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

ProjectItem.propTypes = {
  img: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  techStacks: PropTypes.arrayOf(PropTypes.string),
  url: PropTypes.shape({
    repo: PropTypes.string.isRequired,
    live: PropTypes.string,
  }).isRequired,
};

export default ProjectItem;
