import { getExperiences, Experience } from '@/models/Experience';
import { getEducations, Education } from '@/models/Education';
import { getProjects, Project } from '@/models/Project';
import { getAllTechStacks, TechStack } from '@/models/TechStack';
import { getQueries, getQueryCount, getNewQueryCount, Query } from '@/models/Query';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const [projects, experiences, educations, techStacks, queries, totalQueries, newQueries]: [Project[], Experience[], Education[], TechStack[], Query[], number, number] = await Promise.all([
    getProjects(),
    getExperiences(),
    getEducations(),
    getAllTechStacks(),
    getQueries(),
    getQueryCount(),
    getNewQueryCount()
  ]);

  return (
      <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#4A90E2] via-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
            Portfolio Dashboard
          </h1>
          <p className="text-[#A0A0A0] text-lg max-w-2xl mx-auto">
            Manage your portfolio content with ease. Create, edit, and organize your projects, experience, and education.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Link
            href="/admin/projects"
            className="group bg-gradient-to-r from-[#4A90E2] to-[#667eea] text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-[#4A90E2]/25 transition-all duration-200 transform hover:scale-105"
          >
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Manage Projects
          </Link>
          <Link
            href="/admin/experiences"
            className="group bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 transform hover:scale-105"
          >
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
            </svg>
            Manage Experience
          </Link>
          <Link
            href="/admin/educations"
            className="group bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200 transform hover:scale-105"
          >
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Manage Education
          </Link>
          <Link
            href="/admin/techstacks"
            className="group bg-gradient-to-r from-cyan-500 to-cyan-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-200 transform hover:scale-105"
          >
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Manage Tech Stack
          </Link>
          <Link
            href="/admin/queries"
            className="group bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-200 transform hover:scale-105"
          >
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Manage Queries
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          <div className="bg-[#1A1D24]/60 backdrop-blur-xl border border-[#33373E]/50 rounded-2xl overflow-hidden shadow-2xl hover:shadow-[#4A90E2]/10 transition-all duration-300 group">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#4A90E2] to-[#667eea] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-[#A0A0A0] truncate">Projects</dt>
                    <dd className="text-2xl font-bold text-[#F0F0F0]">{projects.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-[#33373E]/20 px-6 py-4">
              <div className="text-sm">
                <span className="text-emerald-400 font-medium">{projects.filter(p => p.status === 'live').length} live</span>
                <span className="text-[#A0A0A0] mx-2">•</span>
                <span className="text-amber-400 font-medium">{projects.filter(p => p.status === 'draft').length} draft</span>
              </div>
            </div>
          </div>

          <div className="bg-[#1A1D24]/60 backdrop-blur-xl border border-[#33373E]/50 rounded-2xl overflow-hidden shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 group">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-[#A0A0A0] truncate">Experience</dt>
                    <dd className="text-2xl font-bold text-[#F0F0F0]">{experiences.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-[#33373E]/20 px-6 py-4">
              <div className="text-sm">
                <span className="text-emerald-400 font-medium">{experiences.filter(e => e.status === 'active').length} active</span>
                <span className="text-[#A0A0A0] mx-2">•</span>
                <span className="text-[#A0A0A0] font-medium">{experiences.filter(e => e.status === 'inactive').length} inactive</span>
              </div>
            </div>
          </div>

          <div className="bg-[#1A1D24]/60 backdrop-blur-xl border border-[#33373E]/50 rounded-2xl overflow-hidden shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 group">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-[#A0A0A0] truncate">Education</dt>
                    <dd className="text-2xl font-bold text-[#F0F0F0]">{educations.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-[#33373E]/20 px-6 py-4">
              <div className="text-sm">
                <span className="text-emerald-400 font-medium">{educations.filter(e => e.status === 'active').length} active</span>
                <span className="text-[#A0A0A0] mx-2">•</span>
                <span className="text-[#A0A0A0] font-medium">{educations.filter(e => e.status === 'inactive').length} inactive</span>
              </div>
            </div>
          </div>

          <div className="bg-[#1A1D24]/60 backdrop-blur-xl border border-[#33373E]/50 rounded-2xl overflow-hidden shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 group">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-[#A0A0A0] truncate">Tech Stack</dt>
                    <dd className="text-2xl font-bold text-[#F0F0F0]">{techStacks.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-[#33373E]/20 px-6 py-4">
              <div className="text-sm">
                <span className="text-emerald-400 font-medium">{techStacks.filter(t => t.status === 'active').length} active</span>
                <span className="text-[#A0A0A0] mx-2">•</span>
                <span className="text-[#A0A0A0] font-medium">{techStacks.filter(t => t.status === 'inactive').length} inactive</span>
              </div>
            </div>
          </div>

          <div className="bg-[#1A1D24]/60 backdrop-blur-xl border border-[#33373E]/50 rounded-2xl overflow-hidden shadow-2xl hover:shadow-pink-500/10 transition-all duration-300 group">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-[#A0A0A0] truncate">Queries</dt>
                    <dd className="text-2xl font-bold text-[#F0F0F0]">{totalQueries}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-[#33373E]/20 px-6 py-4">
              <div className="text-sm">
                <span className="text-pink-400 font-medium">{newQueries} new</span>
                <span className="text-[#A0A0A0] mx-2">•</span>
                <span className="text-[#A0A0A0] font-medium">{totalQueries - newQueries} responded</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Items */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="bg-[#1A1D24]/60 backdrop-blur-xl border border-[#33373E]/50 rounded-2xl overflow-hidden shadow-2xl">
            <div className="px-6 py-5 border-b border-[#33373E]/30">
              <h3 className="text-lg font-semibold text-[#F0F0F0] flex items-center">
                <svg className="w-5 h-5 mr-2 text-[#4A90E2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Recent Projects
              </h3>
            </div>
            <div className="max-h-80 overflow-y-auto">
              <ul className="divide-y divide-[#33373E]/30">
                {projects.slice(0, 5).map((project) => (
                  <li key={project.id} className="px-6 py-4 hover:bg-[#33373E]/20 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-[#F0F0F0] truncate">{project.title}</p>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        project.status === 'live' 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </li>
                ))}
                {projects.length === 0 && (
                  <li className="px-6 py-8 text-center">
                    <p className="text-[#A0A0A0]">No projects yet</p>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="bg-[#1A1D24]/60 backdrop-blur-xl border border-[#33373E]/50 rounded-2xl overflow-hidden shadow-2xl">
            <div className="px-6 py-5 border-b border-[#33373E]/30">
              <h3 className="text-lg font-semibold text-[#F0F0F0] flex items-center">
                <svg className="w-5 h-5 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
                Recent Experience
              </h3>
            </div>
            <div className="max-h-80 overflow-y-auto">
              <ul className="divide-y divide-[#33373E]/30">
                {experiences.slice(0, 5).map((experience) => (
                  <li key={experience.id} className="px-6 py-4 hover:bg-[#33373E]/20 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#F0F0F0] truncate">{experience.position}</p>
                        <p className="text-sm text-[#A0A0A0] truncate">{experience.company}</p>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        experience.status === 'active' 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }`}>
                        {experience.status}
                      </span>
                    </div>
                  </li>
                ))}
                {experiences.length === 0 && (
                  <li className="px-6 py-8 text-center">
                    <p className="text-[#A0A0A0]">No experience yet</p>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="bg-[#1A1D24]/60 backdrop-blur-xl border border-[#33373E]/50 rounded-2xl overflow-hidden shadow-2xl">
            <div className="px-6 py-5 border-b border-[#33373E]/30">
              <h3 className="text-lg font-semibold text-[#F0F0F0] flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Recent Education
              </h3>
            </div>
            <div className="max-h-80 overflow-y-auto">
              <ul className="divide-y divide-[#33373E]/30">
                {educations.slice(0, 5).map((education) => (
                  <li key={education.id} className="px-6 py-4 hover:bg-[#33373E]/20 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#F0F0F0] truncate">{education.degree}</p>
                        <p className="text-sm text-[#A0A0A0] truncate">{education.institution}</p>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        education.status === 'active' 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }`}>
                        {education.status}
                      </span>
                    </div>
                  </li>
                ))}
                {educations.length === 0 && (
                  <li className="px-6 py-8 text-center">
                    <p className="text-[#A0A0A0]">No education yet</p>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="bg-[#1A1D24]/60 backdrop-blur-xl border border-[#33373E]/50 rounded-2xl overflow-hidden shadow-2xl">
            <div className="px-6 py-5 border-b border-[#33373E]/30">
              <h3 className="text-lg font-semibold text-[#F0F0F0] flex items-center">
                <svg className="w-5 h-5 mr-2 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Recent Tech Stack
              </h3>
            </div>
            <div className="max-h-80 overflow-y-auto">
              <ul className="divide-y divide-[#33373E]/30">
                {techStacks.slice(0, 5).map((stack) => (
                  <li key={stack.id} className="px-6 py-4 hover:bg-[#33373E]/20 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {stack.icon && (
                          <img 
                            src={stack.icon} 
                            alt={stack.name}
                            className="w-6 h-6 rounded mr-3 object-cover"
                          />
                        )}
                        <div>
                          <p className="text-sm font-medium text-[#F0F0F0] truncate">{stack.name}</p>
                          <p className="text-sm text-[#A0A0A0] truncate">{stack.category}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        stack.status === 'active' 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }`}>
                        {stack.status}
                      </span>
                    </div>
                  </li>
                ))}
                {techStacks.length === 0 && (
                  <li className="px-6 py-8 text-center">
                    <p className="text-[#A0A0A0]">No tech stacks yet</p>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="bg-[#1A1D24]/60 backdrop-blur-xl border border-[#33373E]/50 rounded-2xl overflow-hidden shadow-2xl">
            <div className="px-6 py-5 border-b border-[#33373E]/30">
              <h3 className="text-lg font-semibold text-[#F0F0F0] flex items-center">
                <svg className="w-5 h-5 mr-2 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Recent Queries
              </h3>
            </div>
            <div className="max-h-80 overflow-y-auto">
              <ul className="divide-y divide-[#33373E]/30">
                {queries.slice(0, 5).map((query) => (
                  <li key={query.id} className="px-6 py-4 hover:bg-[#33373E]/20 transition-colors duration-200">
                    <div>
                      <p className="text-sm font-medium text-[#F0F0F0] truncate">{query.name}</p>
                      <p className="text-sm text-[#A0A0A0] truncate">{query.email}</p>
                      <p className="text-xs text-[#888] mt-1 line-clamp-2">{query.message}</p>
                    </div>
                  </li>
                ))}
                {queries.length === 0 && (
                  <li className="px-6 py-8 text-center">
                    <p className="text-[#A0A0A0]">No queries yet</p>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
      </div>
  );
}
