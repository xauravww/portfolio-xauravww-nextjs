'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ClientAdminLayout from '@/components/ClientAdminLayout';

export default function NewEducationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    field: '',
    description: '',
    startDate: '',
    endDate: '',
    isCurrentlyStudying: false,
    location: '',
    gpa: '',
    achievements: '',
    status: 'active' as 'active' | 'inactive',
    order: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const achievementsArray = formData.achievements.split(',').map(achievement => achievement.trim()).filter(Boolean);
      
      const response = await fetch('/api/admin/educations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          achievements: achievementsArray,
          startDate: formData.startDate,
          endDate: formData.endDate || undefined,
          gpa: formData.gpa || undefined,
          description: formData.description || undefined,
        }),
      });

      if (response.ok) {
        router.push('/admin/educations');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error creating education:', error);
      alert('Failed to create education');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <ClientAdminLayout>
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent mb-2">
              Add New Education
            </h1>
            <p className="text-[#A0A0A0] text-lg">Share your academic journey</p>
          </div>

          {/* Back Button */}
          <div className="flex justify-center mb-8">
            <Link
              href="/admin/educations"
              className="bg-[#33373E]/60 backdrop-blur-xl border border-[#33373E] text-[#F0F0F0] px-6 py-3 rounded-xl font-medium hover:bg-[#33373E]/80 transition-all duration-200 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Education
            </Link>
          </div>

          {/* Form */}
          <div className="bg-[#1A1D24]/60 backdrop-blur-xl border border-[#33373E]/50 rounded-2xl shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-8 p-8">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="institution" className="block text-sm font-medium text-[#F0F0F0] mb-2">
                    Institution *
                  </label>
                  <input
                    type="text"
                    name="institution"
                    id="institution"
                    required
                    value={formData.institution}
                    onChange={handleChange}
                    className="w-full bg-[#33373E]/60 border border-[#33373E] text-[#F0F0F0] px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 placeholder-[#A0A0A0]"
                    placeholder="Enter institution name"
                  />
                </div>

                <div>
                  <label htmlFor="degree" className="block text-sm font-medium text-[#F0F0F0] mb-2">
                    Degree *
                  </label>
                  <input
                    type="text"
                    name="degree"
                    id="degree"
                    required
                    value={formData.degree}
                    onChange={handleChange}
                    placeholder="Bachelor's, Master's, PhD, etc."
                    className="w-full bg-[#33373E]/60 border border-[#33373E] text-[#F0F0F0] px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 placeholder-[#A0A0A0]"
                  />
                </div>

                <div>
                  <label htmlFor="field" className="block text-sm font-medium text-[#F0F0F0] mb-2">
                    Field of Study *
                  </label>
                  <input
                    type="text"
                    name="field"
                    id="field"
                    required
                    value={formData.field}
                    onChange={handleChange}
                    placeholder="Computer Science, Engineering, etc."
                    className="w-full bg-[#33373E]/60 border border-[#33373E] text-[#F0F0F0] px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 placeholder-[#A0A0A0]"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-[#F0F0F0] mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    id="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full bg-[#33373E]/60 border border-[#33373E] text-[#F0F0F0] px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 placeholder-[#A0A0A0]"
                    placeholder="Enter location"
                  />
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-[#F0F0F0] mb-2">
                    Status *
                  </label>
                  <select
                    name="status"
                    id="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full bg-[#33373E]/60 border border-[#33373E] text-[#F0F0F0] px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="gpa" className="block text-sm font-medium text-[#F0F0F0] mb-2">
                    GPA (optional)
                  </label>
                  <input
                    type="text"
                    name="gpa"
                    id="gpa"
                    value={formData.gpa}
                    onChange={handleChange}
                    placeholder="3.8/4.0"
                    className="w-full bg-[#33373E]/60 border border-[#33373E] text-[#F0F0F0] px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 placeholder-[#A0A0A0]"
                  />
                </div>

                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-[#F0F0F0] mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    id="startDate"
                    required
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full bg-[#33373E]/60 border border-[#33373E] text-[#F0F0F0] px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-[#F0F0F0] mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    id="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    disabled={formData.isCurrentlyStudying}
                    className="w-full bg-[#33373E]/60 border border-[#33373E] text-[#F0F0F0] px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center">
                  <input
                    id="isCurrentlyStudying"
                    name="isCurrentlyStudying"
                    type="checkbox"
                    checked={formData.isCurrentlyStudying}
                    onChange={handleChange}
                    className="h-5 w-5 text-purple-500 bg-[#33373E]/60 border-[#33373E] rounded focus:ring-purple-500/50 focus:ring-2"
                  />
                  <label htmlFor="isCurrentlyStudying" className="ml-3 block text-sm text-[#F0F0F0]">
                    I am currently studying here
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-[#F0F0F0] mb-2">
                  Description (optional)
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full bg-[#33373E]/60 border border-[#33373E] text-[#F0F0F0] px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 placeholder-[#A0A0A0] resize-none"
                  placeholder="Describe your studies, coursework, or any additional details..."
                />
              </div>

              <div>
                <label htmlFor="achievements" className="block text-sm font-medium text-[#F0F0F0] mb-2">
                  Achievements (comma-separated)
                </label>
                <input
                  type="text"
                  name="achievements"
                  id="achievements"
                  value={formData.achievements}
                  onChange={handleChange}
                  className="w-full bg-[#33373E]/60 border border-[#33373E] text-[#F0F0F0] px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 placeholder-[#A0A0A0]"
                  placeholder="Dean's List, Magna Cum Laude, etc."
                />
              </div>

              <div>
                <label htmlFor="order" className="block text-sm font-medium text-[#F0F0F0] mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  name="order"
                  id="order"
                  value={formData.order}
                  onChange={handleChange}
                  className="w-full bg-[#33373E]/60 border border-[#33373E] text-[#F0F0F0] px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 placeholder-[#A0A0A0]"
                  placeholder="0"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Link
                  href="/admin/educations"
                  className="bg-[#33373E]/60 backdrop-blur-xl border border-[#33373E] text-[#F0F0F0] px-6 py-3 rounded-xl font-medium hover:bg-[#33373E]/80 transition-all duration-200"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Create Education'}
                </button>
              </div>
          </form>
        </div>
      </div>
      </div>
    </ClientAdminLayout>
  );
}