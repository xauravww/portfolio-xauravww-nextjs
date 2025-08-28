'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { TechStack } from '@/models/TechStack';
import ClientAdminLayout from '@/components/ClientAdminLayout';

export default function EditTechStackPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    category: 'frontend' as 'frontend' | 'backend' | 'database' | 'devops' | 'mobile' | 'other',
    icon: '',
    color: '',
    description: '',
    status: 'active' as 'active' | 'inactive',
    order: 0,
  });

  const fetchTechStack = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/techstacks/${params?.id}`);
      if (response.ok) {
        const techStack: TechStack = await response.json();
        setFormData({
          name: techStack.name,
          category: techStack.category,
          icon: techStack.icon,
          color: techStack.color || '',
          description: techStack.description || '',
          status: techStack.status,
          order: techStack.order,
        });
      }
    } catch (error) {
      console.error('Error fetching tech stack:', error);
    } finally {
      setInitialLoading(false);
    }
  }, [params?.id]);

  useEffect(() => {
    fetchTechStack();
  }, [fetchTechStack]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/techstacks/${params?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          color: formData.color || undefined,
          description: formData.description || undefined,
        }),
      });

      if (response.ok) {
        router.push('/admin/techstacks');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating tech stack:', error);
      alert('Failed to update tech stack');
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

  if (initialLoading) {
    return (
        <div className="flex items-center justify-center py-12">
          <div className="text-lg">Loading...</div>
        </div>
    );
  }

  return (
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 bg-clip-text text-transparent mb-2">
              Edit Tech Stack
            </h1>
            <p className="text-[#A0A0A0] text-lg">Update your technology stack</p>
          </div>

          {/* Back Button */}
          <div className="flex justify-center mb-8">
            <Link
              href="/admin/techstacks"
              className="bg-[#33373E]/60 backdrop-blur-xl border border-[#33373E] text-[#F0F0F0] px-6 py-3 rounded-xl font-medium hover:bg-[#33373E]/80 transition-all duration-200 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Tech Stacks
            </Link>
          </div>

          {/* Form */}
          <div className="bg-[#1A1D24]/60 backdrop-blur-xl border border-[#33373E]/50 rounded-2xl shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-8 p-8">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[#F0F0F0] mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-[#33373E]/60 border border-[#33373E] text-[#F0F0F0] px-4 py-3 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-200 placeholder-[#A0A0A0]"
                    placeholder="Enter technology name"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-[#F0F0F0] mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    id="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-[#33373E]/60 border border-[#33373E] text-[#F0F0F0] px-4 py-3 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-200"
                  >
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="database">Database</option>
                    <option value="devops">DevOps</option>
                    <option value="mobile">Mobile</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="icon" className="block text-sm font-medium text-[#F0F0F0] mb-2">
                    Icon URL *
                  </label>
                  <input
                    type="url"
                    name="icon"
                    id="icon"
                    required
                    value={formData.icon}
                    onChange={handleChange}
                    className="w-full bg-[#33373E]/60 border border-[#33373E] text-[#F0F0F0] px-4 py-3 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-200 placeholder-[#A0A0A0]"
                    placeholder="https://example.com/icon.png"
                  />
                </div>

                <div>
                  <label htmlFor="color" className="block text-sm font-medium text-[#F0F0F0] mb-2">
                    Color (optional)
                  </label>
                  <input
                    type="color"
                    name="color"
                    id="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="w-full bg-[#33373E]/60 border border-[#33373E] text-[#F0F0F0] px-4 py-3 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-200 h-12"
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
                    className="w-full bg-[#33373E]/60 border border-[#33373E] text-[#F0F0F0] px-4 py-3 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-200"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
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
                    className="w-full bg-[#33373E]/60 border border-[#33373E] text-[#F0F0F0] px-4 py-3 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-200 placeholder-[#A0A0A0]"
                    placeholder="0"
                  />
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
                  className="w-full bg-[#33373E]/60 border border-[#33373E] text-[#F0F0F0] px-4 py-3 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-200 placeholder-[#A0A0A0] resize-none"
                  placeholder="Describe this technology..."
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Link
                  href="/admin/techstacks"
                  className="bg-[#33373E]/60 backdrop-blur-xl border border-[#33373E] text-[#F0F0F0] px-6 py-3 rounded-xl font-medium hover:bg-[#33373E]/80 transition-all duration-200"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Updating...' : 'Update Tech Stack'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
}
