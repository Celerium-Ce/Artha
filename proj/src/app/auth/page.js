'use client';
import Link from 'next/link';

export default function AuthPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ backgroundColor: '#1e1e1e', color: 'var(--foreground)' }}
    >
      <div className="bg-[#2a2a2a] rounded-2xl shadow-lg p-10 w-full max-w-md text-center space-y-6">
        <h1 className="text-3xl font-bold text-highlight opacity-90">
          Welcome
        </h1>
        <div className="flex justify-center gap-4">
          <Link
            href="/auth/login"
            className="bg-[#4B7EFF] text-white px-6 py-3 rounded-xl shadow-md transition-all duration-200 hover:bg-[#4B7EFF] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#4B7EFF]"
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            className="bg-[#4B7EFF] text-white px-6 py-3 rounded-xl shadow-md transition-all duration-200 hover:bg-[#4B7EFF] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#4B7EFF]"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
