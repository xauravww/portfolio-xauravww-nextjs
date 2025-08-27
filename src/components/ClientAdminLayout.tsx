'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ClientAdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/auth/check');
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          router.push('/admin/login');
        }
      } catch (error) {
        setIsAuthenticated(false);
        router.push('/admin/login');
      }
    };

    checkAuth();
  }, [router]);

  if (isAuthenticated === null) {
    return (
      <div className="fixed inset-0 z-[9999] min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1A1D24] to-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#F0F0F0] text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1A1D24] to-[#0a0a0a]">
      {/* Modern Glassmorphism Navbar */}
      <nav className="sticky top-0 z-40 bg-[#1A1D24]/80 backdrop-blur-xl border-b border-[#33373E]/50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/admin/dashboard" className="text-2xl font-bold bg-gradient-to-r from-[#4A90E2] to-[#667eea] bg-clip-text text-transparent">
                Portfolio Admin
              </Link>
              <div className="hidden md:flex space-x-1">
                <Link
                  href="/admin/dashboard"
                  className="text-[#F0F0F0] hover:text-[#4A90E2] px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-[#4A90E2]/10"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/projects"
                  className="text-[#F0F0F0] hover:text-[#4A90E2] px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-[#4A90E2]/10"
                >
                  Projects
                </Link>
                <Link
                  href="/admin/experiences"
                  className="text-[#F0F0F0] hover:text-[#4A90E2] px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-[#4A90E2]/10"
                >
                  Experience
                </Link>
                <Link
                  href="/admin/educations"
                  className="text-[#F0F0F0] hover:text-[#4A90E2] px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-[#4A90E2]/10"
                >
                  Education
                </Link>
                <Link
                  href="/admin/techstacks"
                  className="text-[#F0F0F0] hover:text-[#4A90E2] px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-[#4A90E2]/10"
                >
                  Tech Stack
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href="/"
                target="_blank"
                className="text-[#A0A0A0] hover:text-[#F0F0F0] px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/5"
              >
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View Site
              </Link>
              <form action="/api/admin/auth/logout" method="POST">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-red-500/25"
                >
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>
      <main className="relative">{children}</main>
    </div>
  );
}