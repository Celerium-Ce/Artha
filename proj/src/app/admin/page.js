'use client';

import { useState } from 'react';
import Users from './users';
import Accounts from './accounts';
import Transactions from './transactions';
import Category from './category';
import Leaderboard from './leaderboard';
import GroupExpense from './groupExpense';

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState('users'); // Tracks which section is active

  const toggleSection = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="min-h-screen p-6 bg-dark-page" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center text-highlight opacity-90">Admin Dashboard</h1>

        {/* Navigation Buttons */}
        <div className="space-x-4 mb-6 text-center">
          <button onClick={() => toggleSection('users')} className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-400">Users</button>
          <button onClick={() => toggleSection('accounts')} className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-400">Accounts</button>
          <button onClick={() => toggleSection('transactions')} className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-400">Transactions</button>
          <button onClick={() => toggleSection('category')} className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-400">Categories</button>
          <button onClick={() => toggleSection('leaderboard')} className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-400">Leaderboard</button>
          <button onClick={() => toggleSection('groupExpense')} className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-400">Group Expenses</button>
        </div>

        {/* Sections */}
        {activeSection === 'users' && <Users />}
        {activeSection === 'accounts' && <Accounts />}
        {activeSection === 'transactions' && <Transactions />}
        {activeSection === 'category' && <Category />}
        {activeSection === 'leaderboard' && <Leaderboard />}
        {activeSection === 'groupExpense' && <GroupExpense />}
      </div>
    </div>
  );
}
