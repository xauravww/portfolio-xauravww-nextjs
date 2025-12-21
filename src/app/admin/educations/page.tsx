'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Education } from '@/models/Education';
import ClientAdminLayout from '@/components/ClientAdminLayout';

export default function EducationsPage() {
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  useEffect(() => {
    fetchEducations();
  }, []);

  const fetchEducations = async () => {
    try {
      const response = await fetch('/api/admin/educations');
      const data = await response.json();
      setEducations(data);
    } catch (error) {
      console.error('Error fetching educations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this education?')) return;

    try {
      const response = await fetch(`/api/admin/educations/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEducations(educations.filter(edu => edu.id !== id));
      }
    } catch (error) {
      console.error('Error deleting education:', error);
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

    const draggedIndex = educations.findIndex(edu => edu.id === draggedItem);
    const targetIndex = educations.findIndex(edu => edu.id === targetId);

    const newEducations = [...educations];
    const [draggedEducation] = newEducations.splice(draggedIndex, 1);
    newEducations.splice(targetIndex, 0, draggedEducation);

    setEducations(newEducations);

    // Update order in database
    try {
      await fetch('/api/admin/educations/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds: newEducations.map(edu => edu.id) }),
      });
    } catch (error) {
      console.error('Error reordering educations:', error);
    }

    setDraggedItem(null);
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center py-12">
          <div className="text-[#F0F0F0] text-xl">Loading educations...</div>
        </div>
    );
  }

  return (
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent mb-2">
              Manage Education
            </h1>
            <p className="text-[#A0A0A0] text-lg">Drag and drop to reorder your academic journey</p>
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
              href="/admin/educations/new"
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200 transform hover:scale-105 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Education
            </Link>
          </div>

          {/* Education Cards */}
          <div className="space-y-4">
            {educations.map((education) => (
              <div
                key={education.id}
                draggable
                onDragStart={(e) => handleDragStart(e, education.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, education.id)}
                className="bg-[#1A1D24]/60 backdrop-blur-xl border border-[#33373E]/50 rounded-2xl p-6 cursor-move hover:bg-[#1A1D24]/80 transition-all duration-300 group hover:shadow-2xl hover:shadow-purple-500/10"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-purple-500 rounded-full group-hover:scale-110 transition-transform duration-200"></div>
                        <h3 className="text-xl font-bold text-[#F0F0F0] group-hover:text-purple-400 transition-colors duration-200">
                          {education.degree}
                        </h3>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        education.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                      }`}>
                        {education.status}
                      </span>
                    </div>

                    {/* Institution & Field */}
                    <div className="flex flex-wrap items-center gap-4 mb-3">
                      <div className="flex items-center text-[#A0A0A0]">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        {education.institution}
                      </div>
                      <div className="flex items-center text-[#A0A0A0]">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {education.location}
                      </div>
                    </div>

                    {/* Field of Study */}
                    <div className="flex items-center text-purple-300 mb-3">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Field: {education.field}
                    </div>

                    {/* Duration */}
                    <div className="flex items-center text-[#A0A0A0] mb-4">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(education.startDate).toLocaleDateString()} - {
                        education.isCurrentlyStudying
                          ? 'Present'
                          : education.endDate
                            ? new Date(education.endDate).toLocaleDateString()
                            : 'Present'
                      }
                    </div>

                    {/* Description */}
                    {education.description && (
                      <p className="text-[#F0F0F0] mb-4 leading-relaxed line-clamp-3">
                        {education.description}
                      </p>
                    )}

                    {/* GPA and Achievements */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {education.gpa && (
                        <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-sm rounded-full border border-amber-500/30">
                          GPA: {education.gpa}
                        </span>
                      )}
                      {education.achievements && education.achievements.length > 0 && (
                        <>
                          {education.achievements.slice(0, 3).map((achievement, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full border border-purple-500/30"
                            >
                              {achievement}
                            </span>
                          ))}
                          {education.achievements.length > 3 && (
                            <span className="px-3 py-1 bg-[#33373E]/50 text-[#A0A0A0] text-sm rounded-full">
                              +{education.achievements.length - 3} more
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2 ml-6">
                    <Link
                      href={`/admin/educations/${education.id}/edit`}
                      className="bg-purple-500/20 text-purple-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-500/30 transition-all duration-200 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(education.id)}
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

            {educations.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-[#F0F0F0] mb-2">No education yet</h3>
                <p className="text-[#A0A0A0] mb-6">Add your first education entry to get started</p>
                <Link
                  href="/admin/educations/new"
                  className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200 transform hover:scale-105 inline-flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Your First Education
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
  );
}