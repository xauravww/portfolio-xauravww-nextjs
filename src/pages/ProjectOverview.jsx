'use client';
import { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import ProjectItem from "../components/ProjectItem";
import Pagination from "../components/Pagination";
import FilterModal from "../components/FilterModal";
import LoadingSpinner from "../components/LoadingSpinner";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const ProjectOverview = ({ containerId }) => {
  const [isActive, setIsActive] = useState(true);
  const [projectData, setProjectData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [techStackData, setTechStackData] = useState({});
  const [techStacksLoading, setTechStacksLoading] = useState(true);

  // Simple hardcoded tech stack data for reliability
  const simpleTechStacks = {
    'React': { name: 'React', icon: '/assets/techstack/react.png' },
    'Next.js': { name: 'Next.js', icon: '/assets/techstack/next-js.svg' },
    'TypeScript': { name: 'TypeScript', icon: '/assets/techstack/typescript.svg' },
    'JavaScript': { name: 'JavaScript', icon: '/assets/techstack/javascript.png' },
    'Node.js': { name: 'Node.js', icon: '/assets/techstack/nodejs-official.png' },
    'Express': { name: 'Express', icon: '/assets/techstack/express.webp' },
    'MongoDB': { name: 'MongoDB', icon: '/assets/techstack/mongodb.png' },
    'PostgreSQL': { name: 'PostgreSQL', icon: '/assets/techstack/postgresql.svg' },
    'Prisma': { name: 'Prisma', icon: '/assets/techstack/prisma.svg' },
    'Tailwind CSS': { name: 'Tailwind CSS', icon: '/assets/techstack/tailwind-css.svg' },
    'Redux Toolkit': { name: 'Redux Toolkit', icon: '/assets/techstack/redux-toolkit.png' },
    'React Native': { name: 'React Native', icon: '/assets/techstack/react-native.png' },
    'Git': { name: 'Git', icon: '/assets/techstack/git-square.png' },
    'GitHub': { name: 'GitHub', icon: '/assets/techstack/github-square.png' },
    'Docker': { name: 'Docker', icon: '/assets/techstack/docker-square.png' },
    'GraphQL': { name: 'GraphQL', icon: '/assets/techstack/graphql-square.svg' },
    'JWT': { name: 'JWT', icon: '/assets/techstack/jwt-colorful.svg' },
    'Figma': { name: 'Figma', icon: '/assets/techstack/figma-square.png' },
    'Postman': { name: 'Postman', icon: '/assets/techstack/postman-square.svg' },
    'LangChain': { name: 'LangChain', icon: '/assets/techstack/langchain-square.png' },
    'OpenAI API': { name: 'OpenAI API', icon: '/assets/techstack/openai-square.png' },
    'HTML & CSS': { name: 'HTML & CSS', icon: '/assets/techstack/html---css.png' },
    'Gram.js': { name: 'Gram.js', icon: '/assets/techstack/gram-js.png' },
    'N8N': { name: 'N8N', icon: '/assets/techstack/n8n.jpg' },
    'Notion': { name: 'Notion', icon: '/assets/techstack/notion.png' },
    'Redis': { name: 'Redis', icon: '/assets/techstack/redis.png' },
    'Sanity': { name: 'Sanity', icon: '/assets/techstack/sanity.png' }
  };

  const [currentPage, setcurrentPage] = useState(1);
  const [postPerPage, setpostPerPage] = useState(3);

  // Updated activeFilters state to include techFilterMode
  const [activeFilters, setActiveFilters] = useState({
    techStacks: [],
    difficulty: null,
    techFilterMode: 'AND', // Default to AND mode
  });

  const availableTechStacks = useMemo(() => {
    const allStacks = projectData.reduce((acc, project) => {
      project.techStacks.forEach(stack => acc.add(stack));
      return acc;
    }, new Set());
    return Array.from(allStacks);
  }, [projectData]);

  // Updated filtering logic to use techFilterMode
  const filteredProjects = useMemo(() => {
    return projectData.filter(project => {
      // Tech Stack check (using AND or OR based on mode)
      if (activeFilters.techStacks.length > 0) {
        if (activeFilters.techFilterMode === 'AND') {
          // AND logic: Project must include ALL selected techs
          if (!activeFilters.techStacks.every(filterStack => project.techStacks.includes(filterStack))) {
            return false;
          }
        } else {
          // OR logic: Project must include AT LEAST ONE selected tech
          if (!activeFilters.techStacks.some(filterStack => project.techStacks.includes(filterStack))) {
            return false;
          }
        }
      }
      // Difficulty check
      if (activeFilters.difficulty && project.difficulty !== activeFilters.difficulty) {
        return false;
      }
      return true;
    });
  }, [activeFilters, projectData]); // Re-filter when ANY active filter changes

  const lastPageIndex = currentPage * postPerPage;
  const firstPageIndex = lastPageIndex - postPerPage;
  const currentPosts = filteredProjects.slice(firstPageIndex, lastPageIndex);

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters); // Update the entire filter state
    setcurrentPage(1);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Fetch projects data from database
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/portfolio/projects');
        if (response.ok) {
          const data = await response.json();
          setProjectData(data);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
    // Use simple hardcoded data instead of API
    setTechStackData(simpleTechStacks);
    setTechStacksLoading(false);
  }, []);



  return (
    <div
      className="min-h-screen bg-background relative overflow-hidden"
      id={containerId}
    >
      <div className="section-overlay" />

      <div className="section-content container mx-auto px-4 py-16 md:py-24">
        <header className="section-content text-center mb-12 md:mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-heading tracking-tight">My Projects</h2>
          <div className="mt-3 mx-auto w-16 h-1 bg-gold rounded-full" />
        </header>

        <div className="section-content flex justify-center mb-8">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-surface border border-border px-4 py-2 rounded-lg text-sm font-medium text-heading hover:bg-border/50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter
            {(activeFilters.techStacks.length > 0 || activeFilters.difficulty) && (
              <span className="w-2 h-2 bg-gold rounded-full" />
            )}
          </button>
        </div>

        {/* Loading State */}
        {(loading || techStacksLoading) && (
          <LoadingSpinner
            text={loading ? 'Loading projects...' : techStacksLoading ? 'Loading tech stacks...' : 'Loading...'}
          />
        )}

        {/* Projects Grid */}
        {!loading && !techStacksLoading && (
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {currentPosts.length > 0 ? (
              currentPosts.map((item) => (
                <ProjectItem
                  key={item.id}
                  img={item.img}
                  description={item.description}
                  techStacks={item.techStacks}
                  url={item.url}
                  projectTitle={item.title}
                  techStackData={techStackData}
                  techStacksLoading={techStacksLoading}
                />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center min-h-[300px] text-center space-y-4">
                <div className="w-16 h-16 bg-border/50 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-body" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-heading text-lg font-semibold">
                    {projectData.length === 0 ? 'No projects available' : 'No matching projects'}
                  </h3>
                  <p className="text-body text-sm max-w-md">
                    {projectData.length === 0
                      ? 'Projects are being loaded or none are currently available.'
                      : 'Try adjusting your filters to see more projects.'}
                  </p>
                </div>
              </div>
            )}
            </div>
          </div>
        )}
      </div>
      <div className="pagination-container section-content mt-4">
        {isActive && filteredProjects.length > postPerPage && (
          <Pagination
            totalPosts={filteredProjects.length}
            postPerPage={postPerPage}
            setcurrentPage={setcurrentPage}
            currentPage={currentPage}
          />
        )}
      </div>

      <FilterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApplyFilters={handleApplyFilters}
        availableTechStacks={availableTechStacks}
        activeFilters={activeFilters}
      />
    </div>
  );
};

ProjectOverview.propTypes = {
  containerId: PropTypes.string.isRequired,
};

export default ProjectOverview;
