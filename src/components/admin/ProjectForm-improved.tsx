'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-2">
          Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          required
          value={formData.title}
          onChange={handleChange}
          className="block w-full rounded-lg border-2 border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 text-gray-900 placeholder-gray-600 bg-white px-4 py-3 text-base"
          placeholder="Enter project title"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-2">
          Description
        </label>
        <textarea
          name="description"
          id="description"
          required
          rows={4}
          value={formData.description}
          onChange={handleChange}
          className="block w-full rounded-lg border-2 border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 text-gray-900 placeholder-gray-600 bg-white px-4 py-3 text-base"
          placeholder="Describe your project in detail"
        />
      </div>

      <div>
        <label htmlFor="techStacks" className="block text-sm font-medium text-gray-900 mb-2">
          Tech Stacks (comma separated)
        </label>
        <input
          type="text"
          name="techStacks"
          id="techStacks"
          required
          value={formData.techStacks}
          onChange={handleChange}
          placeholder="ReactJS, Node.js, MongoDB"
          className="block w-full rounded-lg border-2 border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 text-gray-900 placeholder-gray-600 bg-white px-4 py-3 text-base"
        />
      </div>

      <div>
        <label htmlFor="difficulty" className="block text-sm font-medium text-gray-900 mb-2">
          Difficulty
        </label>
        <select
          name="difficulty"
          id="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
          className="block w-full rounded-lg border-2 border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 text-gray-900 bg-white px-4 py-3 text-base"
        >
          <option value="Easy">Easy</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      <div>
        <label htmlFor="img" className="block text-sm font-medium text-gray-900 mb-2">
          Image URL
        </label>
        <input
          type="url"
          name="img"
          id="img"
          required
          value={formData.img}
          onChange={handleChange}
          className="block w-full rounded-lg border-2 border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 text-gray-900 placeholder-gray-600 bg-white px-4 py-3 text-base"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div>
        <label htmlFor="repo" className="block text-sm font-medium text-gray-900 mb-2">
          Repository URL (optional)
        </label>
        <input
          type="url"
          name="repo"
          id="repo"
          value={formData.repo}
          onChange={handleChange}
          className="block w-full rounded-lg border-2 border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 text-gray-900 placeholder-gray-600 bg-white px-4 py-3 text-base"
          placeholder="https://github.com/username/project"
        />
      </div>

      <div>
        <label htmlFor="live" className="block text-sm font-medium text-gray-900 mb-2">
          Live URL (optional)
        </label>
        <input
          type="url"
          name="live"
          id="live"
          value={formData.live}
          onChange={handleChange}
          className="block w-full rounded-lg border-2 border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 text-gray-900 placeholder-gray-600 bg-white px-4 py-3 text-base"
          placeholder="https://your-project.vercel.app"
        />
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-900 mb-2">
          Status
        </label>
        <select
          name="status"
          id="status"
          value={formData.status}
          onChange={handleChange}
          className="block w-full rounded-lg border-2 border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 text-gray-900 bg-white px-4 py-3 text-base"
        >
          <option value="draft">Draft</option>
          <option value="live">Live</option>
        </select>
      </div>

      <div>
        <label htmlFor="order" className="block text-sm font-medium text-gray-900 mb-2">
          Order
        </label>
        <input
          type="number"
          name="order"
          id="order"
          required
          min="0"
          value={formData.order}
          onChange={handleChange}
          className="block w-full rounded-lg border-2 border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 text-gray-900 placeholder-gray-600 bg-white px-4 py-3 text-base"
          placeholder="0"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
        >
          {loading ? 'Saving...' : isEdit ? 'Update Project' : 'Create Project'}
        </button>
      </div>
    </form>
  );
}
