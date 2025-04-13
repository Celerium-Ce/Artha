'use client';

import { useState } from 'react';
import Users from './users';
import Accounts from './accounts';
import Transactions from './transactions';
import Category from './category';
import Leaderboard from './leaderboard';
import GroupExpense from './groupExpense';

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState('users');

  const toggleSection = (section) => {
    setActiveSection(section);
  };

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
              onClick={() => toggleSection(key)}
              className={`bg-teal-500 text-white px-4 py-2 rounded-xl shadow-sm transition-all duration-200 hover:bg-teal-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-teal-300 ${
                activeSection === key ? 'ring-2 ring-offset-2 ring-teal-300' : ''
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
