'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TechStackSelector from './TechStackSelector';

interface ProjectFormProps {
  project?: {
    id?: string;
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
  };
  isEdit?: boolean;
}

export default function ProjectForm({ project, isEdit = false }: ProjectFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    techStacks: project?.techStacks?.join(', ') || '',
    difficulty: project?.difficulty || 'Intermediate',
    repo: project?.url?.repo || '',
    live: project?.url?.live || '',
    img: project?.img || '',
    status: project?.status || 'draft',
    order: project?.order || 0,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEdit ? `/api/admin/projects/${project?.id}` : '/api/admin/projects';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          techStacks: formData.techStacks.split(',').map(s => s.trim()).filter(s => s),
          difficulty: formData.difficulty,
          url: {
            repo: formData.repo || undefined,
            live: formData.live || undefined,
          },
          img: formData.img,
          status: formData.status,
          order: Number(formData.order),
        }),
      });

      if (response.ok) {
        router.push('/admin/projects');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save project');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="title" className="block text-sm font-medium text-[#F0F0F0] mb-2">
            Title *
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full bg-[#33373E]/60 border border-[#33373E] text-[#F0F0F0] px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#4A90E2]/50 focus:border-[#4A90E2] transition-all duration-200 placeholder-[#A0A0A0]"
            placeholder="Enter project title"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-[#F0F0F0] mb-2">
            Description *
          </label>
          <textarea
            name="description"
            id="description"
            required
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="w-full bg-[#33373E]/60 border border-[#33373E] text-[#F0F0F0] px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#4A90E2]/50 focus:border-[#4A90E2] transition-all duration-200 placeholder-[#A0A0A0] resize-none"
            placeholder="Describe your project in detail"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-[#F0F0F0] mb-2">
            Tech Stacks *
          </label>
          <div className="bg-[#33373E]/30 border border-[#33373E] rounded-xl p-4">
            <TechStackSelector
              selectedTechStacks={formData.techStacks.split(',').map(s => s.trim()).filter(s => s)}
              onChange={(techStacks) => setFormData(prev => ({ ...prev, techStacks: techStacks.join(', ') }))}
            />
          </div>
        </div>

        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-[#F0F0F0] mb-2">
            Difficulty *
          </label>
          <select
            name="difficulty"
            id="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="w-full bg-[#33373E]/60 border border-[#33373E] text-[#F0F0F0] px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#4A90E2]/50 focus:border-[#4A90E2] transition-all duration-200"
          >
            <option value="Easy">Easy</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
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
            className="w-full bg-[#33373E]/60 border border-[#33373E] text-[#F0F0F0] px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#4A90E2]/50 focus:border-[#4A90E2] transition-all duration-200"
          >
            <option value="draft">Draft</option>
            <option value="live">Live</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="img" className="block text-sm font-medium text-[#F0F0F0] mb-2">
            Image URL *
          </label>
          <input
            type="url"
            name="img"
            id="img"
            required
            value={formData.img}
            onChange={handleChange}
            className="w-full bg-[#33373E]/60 border border-[#33373E] text-[#F0F0F0] px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#4A90E2]/50 focus:border-[#4A90E2] transition-all duration-200 placeholder-[#A0A0A0]"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div>
          <label htmlFor="repo" className="block text-sm font-medium text-[#F0F0F0] mb-2">
            Repository URL (optional)
          </label>
          <input
            type="url"
            name="repo"
            id="repo"
            value={formData.repo}
            onChange={handleChange}
            className="w-full bg-[#33373E]/60 border border-[#33373E] text-[#F0F0F0] px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#4A90E2]/50 focus:border-[#4A90E2] transition-all duration-200 placeholder-[#A0A0A0]"
            placeholder="https://github.com/username/project"
          />
        </div>

        <div>
          <label htmlFor="live" className="block text-sm font-medium text-[#F0F0F0] mb-2">
            Live URL (optional)
          </label>
          <input
            type="url"
            name="live"
            id="live"
            value={formData.live}
            onChange={handleChange}
            className="w-full bg-[#33373E]/60 border border-[#33373E] text-[#F0F0F0] px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#4A90E2]/50 focus:border-[#4A90E2] transition-all duration-200 placeholder-[#A0A0A0]"
            placeholder="https://your-project.vercel.app"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="order" className="block text-sm font-medium text-[#F0F0F0] mb-2">
            Display Order
          </label>
          <input
            type="number"
            name="order"
            id="order"
            required
            min="0"
            value={formData.order}
            onChange={handleChange}
            className="w-full bg-[#33373E]/60 border border-[#33373E] text-[#F0F0F0] px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#4A90E2]/50 focus:border-[#4A90E2] transition-all duration-200 placeholder-[#A0A0A0]"
            placeholder="0"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-[#33373E]/60 backdrop-blur-xl border border-[#33373E] text-[#F0F0F0] px-6 py-3 rounded-xl font-medium hover:bg-[#33373E]/80 transition-all duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-[#4A90E2] to-[#667eea] text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-[#4A90E2]/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : isEdit ? 'Update Project' : 'Create Project'}
        </button>
      </div>
    </form>
  );
}
