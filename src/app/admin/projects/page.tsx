'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ClientAdminLayout from '@/components/ClientAdminLayout';

interface Project {
  id: string;
  title: string;
  description: string;
  techStacks: string[];
  difficulty: 'Easy' | 'Intermediate' | 'Advanced';
  url: {
    repo?: string;
    live?: string;
  };
  img: string;
  status: 'live' | 'draft';
  order: number;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/admin/projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProjects(projects.filter(project => project.id !== id));
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  if (loading) {
    return (
      <ClientAdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-[#F0F0F0] text-xl">Loading projects...</div>
        </div>
      </ClientAdminLayout>
    );
  }

  return (
    <ClientAdminLayout>
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#4A90E2] via-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-2">
              Manage Projects
            </h1>
            <p className="text-[#A0A0A0] text-lg">Showcase your development projects</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Link
              href="/admin/dashboard"
              className="bg-[#33373E]/60 backdrop-blur-xl border border-[#33373E] text-[#F0F0F0] px-6 py-3 rounded-xl font-medium hover:bg-[#33373E]/80 transition-all duration-200 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Link>
            <Link
              href="/admin/projects/new"
              className="bg-gradient-to-r from-[#4A90E2] to-[#667eea] text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-[#4A90E2]/25 transition-all duration-200 transform hover:scale-105 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Project
            </Link>
          </div>

          {/* Project Cards */}
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-[#1A1D24]/60 backdrop-blur-xl border border-[#33373E]/50 rounded-2xl p-6 hover:bg-[#1A1D24]/80 transition-all duration-300 group hover:shadow-2xl hover:shadow-[#4A90E2]/10"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-[#4A90E2] rounded-full group-hover:scale-110 transition-transform duration-200"></div>
                        <h3 className="text-xl font-bold text-[#F0F0F0] group-hover:text-[#4A90E2] transition-colors duration-200">
                          {project.title}
                        </h3>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        project.status === 'live'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      }`}>
                        {project.status}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-[#F0F0F0] mb-4 leading-relaxed line-clamp-2">
                      {project.description}
                    </p>

                    {/* Tech Stack */}
                    {project.techStacks.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {project.techStacks.slice(0, 6).map((tech, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-[#4A90E2]/20 text-[#4A90E2] text-sm rounded-full border border-[#4A90E2]/30"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.techStacks.length > 6 && (
                            <span className="px-3 py-1 bg-[#33373E]/50 text-[#A0A0A0] text-sm rounded-full">
                              +{project.techStacks.length - 6} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Difficulty */}
                    <div className="flex items-center text-[#A0A0A0] mb-4">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Difficulty: {project.difficulty}
                    </div>

                    {/* Links */}
                    <div className="flex items-center space-x-4">
                      {project.url.repo && (
                        <a
                          href={project.url.repo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-[#A0A0A0] hover:text-[#4A90E2] transition-colors duration-200"
                        >
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                          Repository
                        </a>
                      )}
                      {project.url.live && (
                        <a
                          href={project.url.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-[#A0A0A0] hover:text-[#4A90E2] transition-colors duration-200"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2 ml-6">
                    <Link
                      href={`/admin/projects/${project.id}/edit`}
                      className="bg-[#4A90E2]/20 text-[#4A90E2] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4A90E2]/30 transition-all duration-200 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-500/30 transition-all duration-200 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {projects.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-[#4A90E2]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#4A90E2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-[#F0F0F0] mb-2">No projects yet</h3>
                <p className="text-[#A0A0A0] mb-6">Add your first project to get started</p>
                <Link
                  href="/admin/projects/new"
                  className="bg-gradient-to-r from-[#4A90E2] to-[#667eea] text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-[#4A90E2]/25 transition-all duration-200 transform hover:scale-105 inline-flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Your First Project
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </ClientAdminLayout>
  );
}
