'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Experience } from '@/models/Experience';
import ClientAdminLayout from '@/components/ClientAdminLayout';

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await fetch('/api/admin/experiences');
      const data = await response.json();
      setExperiences(data);
    } catch (error) {
      console.error('Error fetching experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;

    try {
      const response = await fetch(`/api/admin/experiences/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setExperiences(experiences.filter(exp => exp.id !== id));
      }
    } catch (error) {
      console.error('Error deleting experience:', error);
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItem(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault();

    if (!draggedItem || draggedItem === targetId) return;

    const draggedIndex = experiences.findIndex(exp => exp.id === draggedItem);
    const targetIndex = experiences.findIndex(exp => exp.id === targetId);

    const newExperiences = [...experiences];
    const [draggedExperience] = newExperiences.splice(draggedIndex, 1);
    newExperiences.splice(targetIndex, 0, draggedExperience);

    setExperiences(newExperiences);

    // Update order in database
    try {
      await fetch('/api/admin/experiences/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds: newExperiences.map(exp => exp.id) }),
      });
    } catch (error) {
      console.error('Error reordering experiences:', error);
    }

    setDraggedItem(null);
  };

  if (loading) {
    return (
      <ClientAdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-[#F0F0F0] text-xl">Loading experiences...</div>
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
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 bg-clip-text text-transparent mb-2">
              Manage Experience
            </h1>
            <p className="text-[#A0A0A0] text-lg">Drag and drop to reorder your work experience</p>
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
              href="/admin/experiences/new"
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 transform hover:scale-105 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Experience
            </Link>
          </div>

          {/* Experience Cards */}
          <div className="space-y-4">
            {experiences.map((experience) => (
              <div
                key={experience.id}
                draggable
                onDragStart={(e) => handleDragStart(e, experience.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, experience.id)}
                className="bg-[#1A1D24]/60 backdrop-blur-xl border border-[#33373E]/50 rounded-2xl p-6 cursor-move hover:bg-[#1A1D24]/80 transition-all duration-300 group hover:shadow-2xl hover:shadow-emerald-500/10"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full group-hover:scale-110 transition-transform duration-200"></div>
                        <h3 className="text-xl font-bold text-[#F0F0F0] group-hover:text-emerald-400 transition-colors duration-200">
                          {experience.position}
                        </h3>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        experience.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                      }`}>
                        {experience.status}
                      </span>
                    </div>

                    {/* Company & Location */}
                    <div className="flex flex-wrap items-center gap-4 mb-3">
                      <div className="flex items-center text-[#A0A0A0]">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {experience.company}
                      </div>
                      <div className="flex items-center text-[#A0A0A0]">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {experience.location}
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="flex items-center text-[#A0A0A0] mb-4">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(experience.startDate).toLocaleDateString()} - {
                        experience.isCurrentJob
                          ? 'Present'
                          : experience.endDate
                            ? new Date(experience.endDate).toLocaleDateString()
                            : 'Present'
                      }
                    </div>

                    {/* Description */}
                    <p className="text-[#F0F0F0] mb-4 leading-relaxed line-clamp-3">
                      {experience.description}
                    </p>

                    {/* Skills */}
                    {experience.skills.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {experience.skills.slice(0, 6).map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-[#4A90E2]/20 text-[#4A90E2] text-sm rounded-full border border-[#4A90E2]/30"
                            >
                              {skill}
                            </span>
                          ))}
                          {experience.skills.length > 6 && (
                            <span className="px-3 py-1 bg-[#33373E]/50 text-[#A0A0A0] text-sm rounded-full">
                              +{experience.skills.length - 6} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2 ml-6">
                    <Link
                      href={`/admin/experiences/${experience.id}/edit`}
                      className="bg-[#4A90E2]/20 text-[#4A90E2] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4A90E2]/30 transition-all duration-200 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(experience.id)}
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

            {experiences.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-[#F0F0F0] mb-2">No experiences yet</h3>
                <p className="text-[#A0A0A0] mb-6">Add your first work experience to get started</p>
                <Link
                  href="/admin/experiences/new"
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 transform hover:scale-105 inline-flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Your First Experience
                </Link>
              </div>
            )}
          </div>
        </div>
        </div>
    </ClientAdminLayout>
  );
}