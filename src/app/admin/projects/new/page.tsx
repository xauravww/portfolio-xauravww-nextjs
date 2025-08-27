import ProjectForm from '@/components/admin/ProjectForm';
import ClientAdminLayout from '@/components/ClientAdminLayout';
import Link from 'next/link';

export default function NewProjectPage() {
  return (
    <ClientAdminLayout>
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#4A90E2] via-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-2">
              Create New Project
            </h1>
            <p className="text-[#A0A0A0] text-lg">Add a new project to your portfolio</p>
          </div>

          {/* Back Button */}
          <div className="flex justify-center mb-8">
            <Link
              href="/admin/projects"
              className="bg-[#33373E]/60 backdrop-blur-xl border border-[#33373E] text-[#F0F0F0] px-6 py-3 rounded-xl font-medium hover:bg-[#33373E]/80 transition-all duration-200 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Projects
            </Link>
          </div>

          {/* Form */}
          <div className="bg-[#1A1D24]/60 backdrop-blur-xl border border-[#33373E]/50 rounded-2xl shadow-2xl p-8">
            <ProjectForm />
          </div>
        </div>
      </div>
    </ClientAdminLayout>
  );
}
