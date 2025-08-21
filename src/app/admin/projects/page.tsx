import { getProjects } from '@/models/Project';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Projects</h1>
          <div className="flex gap-4">
            <Link
              href="/admin/dashboard"
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              Back to Dashboard
            </Link>
            <Link
              href="/admin/projects/new"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Add New Project
            </Link>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {projects.map((project) => (
              <li key={project.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {project.title}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          project.status === 'live' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {project.status}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <p className="truncate">{project.description}</p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <p className="truncate">{project.techStacks.join(', ')}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </Link>
                    <form action="/api/admin/projects/[id]/delete" method="POST">
                      <input type="hidden" name="id" value={project.id} />
                      <button
                        type="submit"
                        className="text-red-600 hover:text-red-900"
                        onClick={(e) => {
                          if (!confirm('Are you sure you want to delete this project?')) {
                            e.preventDefault();
                          }
                        }}
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
