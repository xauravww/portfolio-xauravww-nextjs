import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export default function AdminLoginPage() {
  return (
    <div className="fixed inset-0 z-[9999] min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1A1D24] to-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 relative z-[9999]">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-[#4A90E2] to-[#667eea] rounded-2xl flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#4A90E2] via-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            Portfolio Admin
          </h2>
          <p className="mt-2 text-[#A0A0A0]">Sign in to manage your portfolio</p>
        </div>
        
        <div className="bg-[#1A1D24]/95 backdrop-blur-xl border border-[#33373E]/50 rounded-2xl p-8 shadow-2xl relative z-[9999]">
          <form className="space-y-6" action="/api/admin/auth/login" method="POST">
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-[#F0F0F0] mb-2">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-[#0a0a0a]/50 border border-[#33373E] rounded-xl text-[#F0F0F0] placeholder-[#A0A0A0] focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent transition-all duration-200"
                  placeholder="Enter your username"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#F0F0F0] mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-4 py-3 bg-[#0a0a0a]/50 border border-[#33373E] rounded-xl text-[#F0F0F0] placeholder-[#A0A0A0] focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#4A90E2] to-[#667eea] text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg hover:shadow-[#4A90E2]/25 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:ring-offset-2 focus:ring-offset-[#1A1D24]"
            >
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
