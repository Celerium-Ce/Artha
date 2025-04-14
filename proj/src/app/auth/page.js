'use client';
import Link from 'next/link';

export default function AuthPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        backgroundColor: '#1e1e1e',
        color: '#e2e8f0',
      }}
    >
      <div className="bg-[#2a2a2a] p-10 rounded-2xl shadow-2xl max-w-md w-full space-y-6 text-center">
        <h1
          className="text-4xl font-bold tracking-wide opacity-90"
          style={{ color: '#4B7EFF' }}
        >
          Welcome
        </h1>

        <p className="text-sm text-[#a0aec0] opacity-80">
          Please choose an option to continue
        </p>

        <div className="flex justify-center gap-6 mt-6">
          <Link
            href="/auth/login"
            className="px-6 py-3 rounded-xl text-white font-medium shadow-md transition-all duration-200 hover:bg-opacity-90 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4B7EFF]"
            style={{ backgroundColor: '#4B7EFF' }}
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            className="px-6 py-3 rounded-xl text-white font-medium shadow-md transition-all duration-200 hover:bg-opacity-90 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4B7EFF]"
            style={{ backgroundColor: '#4B7EFF' }}
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
