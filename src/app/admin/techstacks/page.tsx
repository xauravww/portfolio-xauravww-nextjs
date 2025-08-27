'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ClientAdminLayout from '@/components/ClientAdminLayout';

interface TechStack {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'mobile' | 'other';
  icon: string;
  color?: string;
  description?: string;
  status: 'active' | 'inactive';
  order: number;
}

export default function TechStacksPage() {
  const [techStacks, setTechStacks] = useState<TechStack[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  useEffect(() => {
    fetchTechStacks();
  }, []);

  const fetchTechStacks = async () => {
    try {
      const response = await fetch('/api/admin/techstacks');
      const data = await response.json();
      setTechStacks(data);
    } catch (error) {
      console.error('Error fetching tech stacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tech stack?')) return;

    try {
      const response = await fetch(`/api/admin/techstacks/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTechStacks(techStacks.filter(stack => stack.id !== id));
      }
    } catch (error) {
      console.error('Error deleting tech stack:', error);
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

    const draggedIndex = techStacks.findIndex(stack => stack.id === draggedItem);
    const targetIndex = techStacks.findIndex(stack => stack.id === targetId);

    const newTechStacks = [...techStacks];
    const [draggedStack] = newTechStacks.splice(draggedIndex, 1);
    newTechStacks.splice(targetIndex, 0, draggedStack);

    setTechStacks(newTechStacks);

    try {
      await fetch('/api/admin/techstacks/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds: newTechStacks.map(stack => stack.id) }),
      });
    } catch (error) {
      console.error('Error reordering tech stacks:', error);
    }

    setDraggedItem(null);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      frontend: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      backend: 'bg-green-500/20 text-green-400 border-green-500/30',
      database: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      devops: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      mobile: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      other: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center py-12">
          <div className="text-[#F0F0F0] text-xl">Loading tech stacks...</div>
        </div>
    );
  }

  return (
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 bg-clip-text text-transparent mb-2">
              Manage Tech Stack
            </h1>
            <p className="text-[#A0A0A0] text-lg">Drag and drop to reorder your technologies</p>
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
              href="/admin/techstacks/new"
              className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-200 transform hover:scale-105 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Tech Stack
            </Link>
          </div>

          {/* Tech Stack Cards */}
          <div className="space-y-4">
            {techStacks.map((stack) => (
              <div
                key={stack.id}
                draggable
                onDragStart={(e) => handleDragStart(e, stack.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stack.id)}
                className="bg-[#1A1D24]/60 backdrop-blur-xl border border-[#33373E]/50 rounded-2xl p-6 cursor-move hover:bg-[#1A1D24]/80 transition-all duration-300 group hover:shadow-2xl hover:shadow-cyan-500/10"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-3 h-3 bg-cyan-500 rounded-full group-hover:scale-110 transition-transform duration-200"></div>
                        {stack.icon && (
                          <img 
                            src={stack.icon} 
                            alt={stack.name}
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                        )}
                        <h3 className="text-xl font-bold text-[#F0F0F0] group-hover:text-cyan-400 transition-colors duration-200">
                          {stack.name}
                        </h3>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        stack.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                      }`}>
                        {stack.status}
                      </span>
                    </div>

                    {/* Category */}
                    <div className="flex items-center mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(stack.category)}`}>
                        {stack.category}
                      </span>
                    </div>

                    {/* Description */}
                    {stack.description && (
                      <p className="text-[#F0F0F0] mb-4 leading-relaxed line-clamp-2">
                        {stack.description}
                      </p>
                    )}

                    {/* Color */}
                    {stack.color && (
                      <div className="flex items-center text-[#A0A0A0] mb-4">
                        <div 
                          className="w-4 h-4 rounded-full mr-2 border border-white/20"
                          style={{ backgroundColor: stack.color }}
                        ></div>
                        Color: {stack.color}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2 ml-6">
                    <Link
                      href={`/admin/techstacks/${stack.id}/edit`}
                      className="bg-cyan-500/20 text-cyan-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-cyan-500/30 transition-all duration-200 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(stack.id)}
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

            {techStacks.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-[#F0F0F0] mb-2">No tech stacks yet</h3>
                <p className="text-[#A0A0A0] mb-6">Add your first technology to get started</p>
                <Link
                  href="/admin/techstacks/new"
                  className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-200 transform hover:scale-105 inline-flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m-6 0h6m0 0h6" />
                  </svg>
                  Add Your First Tech Stack
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
  );
}