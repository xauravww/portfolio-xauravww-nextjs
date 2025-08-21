import ProjectForm from '@/components/admin/ProjectForm';

export default function NewProjectPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h1 className="text-2xl font-bold text-gray-900">Create New Project</h1>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <ProjectForm />
          </div>
        </div>
      </div>
    </div>
  );
}
