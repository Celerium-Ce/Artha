'use client';

import { useState } from 'react';
import Users from './users';
import Accounts from './accounts';
import Transactions from './transactions';
import Category from './category';
import Leaderboard from './leaderBoard';
import GroupExpense from './groupExpense';

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState('users');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const correctPassword = 'admin123'; // 🔐 Replace with env or secure check in production

  const handleLogin = () => {
    if (password === correctPassword) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password. Try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg max-w-sm w-full space-y-4">
          <h2 className="text-2xl font-bold text-center text-highlight">Admin Access</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#4B7EFF]"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            onClick={handleLogin}
            className="w-full bg-[#4B7EFF] text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Enter Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#1e1e1e', color: 'var(--foreground)' }}>
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center text-highlight opacity-90">Admin Dashboard</h1>

        {/* Navigation Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {[
            ['users', 'Users'],
            ['accounts', 'Accounts'],
            ['transactions', 'Transactions'],
            ['category', 'Categories'],
            ['leaderboard', 'Leaderboard'],
            ['groupExpense', 'Group Expenses']
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className={`bg-[#4B7EFF] text-white px-4 py-2 rounded-xl shadow-sm transition-all duration-200 hover:bg-[#4B7EFF] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#4B7EFF] ${
                activeSection === key ? 'ring-2 ring-offset-2 ring-[#4B7EFF]' : ''
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Sections */}
        <div className="bg-[#1e1e1e] p-4 rounded-xl shadow-md">
          {activeSection === 'users' && <Users />}
          {activeSection === 'accounts' && <Accounts />}
          {activeSection === 'transactions' && <Transactions />}
          {activeSection === 'category' && <Category />}
          {activeSection === 'leaderboard' && <Leaderboard />}
          {activeSection === 'groupExpense' && <GroupExpense />}
        </div>
      </div>
    </div>
  );
}
