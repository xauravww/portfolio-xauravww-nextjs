'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ClientAdminLayout from '@/components/ClientAdminLayout';

export default function NewExperiencePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    description: '',
    startDate: '',
    endDate: '',
    isCurrentJob: false,
    location: '',
    skills: '',
    status: 'active' as 'active' | 'inactive',
    order: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const skillsArray = formData.skills.split(',').map(skill => skill.trim()).filter(Boolean);

      const response = await fetch('/api/admin/experiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          skills: skillsArray,
          startDate: formData.startDate,
          endDate: formData.endDate || undefined,
        }),
      });

      if (response.ok) {
        router.push('/admin/experiences');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error creating experience:', error);
      alert('Failed to create experience');
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
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 bg-clip-text text-transparent mb-2">
              Add New Experience
            </h1>
            <p className="text-[#A0A0A0] text-lg">Share your professional journey</p>
          </div>

          {/* Back Button */}
          <div className="flex justify-center mb-8">
            <Link
              href="/admin/experiences"
              className="bg-[#33373E]/60 backdrop-blur-xl border border-[#33373E] text-[#F0F0F0] px-6 py-3 rounded-xl font-medium hover:bg-[#33373E]/80 transition-all duration-200 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Experiences
            </Link>
          </div>

          {/* Form */}
          <div className="bg-[#1A1D24]/60 backdrop-blur-xl border border-[#33373E]/50 rounded-2xl shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-8 p-8">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-[#F0F0F0] mb-2">
                    Company *
                  </label>
                  <input
                    type="text"
                    name="company"
                    id="company"
                    required
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full bg-[#33373E]/60 border border-[#33373E] text-[#F0F0F0] px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200 placeholder-[#A0A0A0]"
                    placeholder="Enter company name"
                  />
                </div>

                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-[#F0F0F0] mb-2">
                    Position *
                  </label>
                  <input
                    type="text"
                    name="position"
                    id="position"
                    required
                    value={formData.position}
                    onChange={handleChange}
                    className="w-full bg-[#33373E]/60 border border-[#33373E] text-[#F0F0F0] px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200 placeholder-[#A0A0A0]"
                    placeholder="Enter position title"
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
                    className="w-full bg-[#33373E]/60 border border-[#33373E] text-[#F0F0F0] px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200 placeholder-[#A0A0A0]"
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
                    className="w-full bg-[#33373E]/60 border border-[#33373E] text-[#F0F0F0] px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
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
                    className="w-full bg-[#33373E]/60 border border-[#33373E] text-[#F0F0F0] px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200"
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
                    disabled={formData.isCurrentJob}
                    className="w-full bg-[#33373E]/60 border border-[#33373E] text-[#F0F0F0] px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center">
                  <input
                    id="isCurrentJob"
                    name="isCurrentJob"
                    type="checkbox"
                    checked={formData.isCurrentJob}
                    onChange={handleChange}
                    className="h-5 w-5 text-emerald-500 bg-[#33373E]/60 border-[#33373E] rounded focus:ring-emerald-500/50 focus:ring-2"
                  />
                  <label htmlFor="isCurrentJob" className="ml-3 block text-sm text-[#F0F0F0]">
                    This is my current job
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-[#F0F0F0] mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={4}
                  required
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full bg-[#33373E]/60 border border-[#33373E] text-[#F0F0F0] px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200 placeholder-[#A0A0A0] resize-none"
                  placeholder="Describe your role and responsibilities..."
                />
              </div>

              <div>
                <label htmlFor="skills" className="block text-sm font-medium text-[#F0F0F0] mb-2">
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  name="skills"
                  id="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  className="w-full bg-[#33373E]/60 border border-[#33373E] text-[#F0F0F0] px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200 placeholder-[#A0A0A0]"
                  placeholder="React, Node.js, TypeScript, etc."
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
                  className="w-full bg-[#33373E]/60 border border-[#33373E] text-[#F0F0F0] px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200 placeholder-[#A0A0A0]"
                  placeholder="0"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Link
                  href="/admin/experiences"
                  className="bg-[#33373E]/60 backdrop-blur-xl border border-[#33373E] text-[#F0F0F0] px-6 py-3 rounded-xl font-medium hover:bg-[#33373E]/80 transition-all duration-200"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Create Experience'}
                </button>
              </div>
            </form>
          </div>
        </div>
        </div>
    </ClientAdminLayout>

  );
}