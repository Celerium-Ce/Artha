'use client';

import React, { useState, useEffect } from 'react';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [userEmailForStats, setUserEmailForStats] = useState('');
  const [userStats, setUserStats] = useState(null);

  useEffect(() => {
    const fetchedUsers = [
      { id: 1, name: 'Alice', email: 'alice@example.com', password: 'secret1', settings: {} },
      { id: 2, name: 'Bob', email: 'bob@example.com', password: 'secret2', settings: {} },
    ];
    setUsers(fetchedUsers);
  }, []);

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const deleteUser = (id) => {
    const confirmed = confirm('Are you sure you want to delete this user?');
    if (confirmed) {
      setUsers((prev) => prev.filter((user) => user.id !== id));
    }
  };

  const handleStats = () => {
    setUserStats({
      totalAccounts: 3,
      totalTransactions: 24,
      totalDebit: 5000,
      totalCredit: 6500,
      aboveAverageSpender: true,
    });
  };

  return (
    <div className="p-6 bg-gray-800 text-gray-200 rounded-2xl border-none shadow-none max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold text-[#4B7EFF] opacity-90 mb-6 text-center">Users</h2>

      <div className="bg-gray-700 p-6 rounded-2xl mb-6">
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr className="text-gray-300">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2 w-64">Password</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-gray-600">
                <td className="px-4 py-2">{user.id}</td>
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2 w-64">
                  <div className="flex items-center">
                    <span className="font-mono truncate">
                      {visiblePasswords[user.id] ? user.password : '*'.repeat(user.password.length)}
                    </span>
                    <button
                      onClick={() => togglePasswordVisibility(user.id)}
                      className="ml-2 text-[#4B7EFF] hover:text-[#4B7EFF] transition"
                    >
                      {visiblePasswords[user.id] ? '🙈' : '👁️'}
                    </button>
                  </div>
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-500 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-700 p-6 rounded-2xl">
        <h3 className="text-xl font-semibold text-[#4B7EFF] opacity-90 mb-4">View User Stats</h3>
        <div className="flex items-center mb-4">
          <input
            type="email"
            placeholder="Enter user email"
            value={userEmailForStats}
            onChange={(e) => setUserEmailForStats(e.target.value)}
            className="w-full p-2 rounded bg-gray-600 text-white placeholder-gray-400"
          />
          <button
            onClick={handleStats}
            className="ml-4 bg-[#4B7EFF] text-white font-semibold px-6 py-2 rounded hover:bg-[#4B7EFF] transition"
          >
            View Stats
          </button>
        </div>

        {userStats && (
          <div className="text-gray-300 space-y-2">
            <p>Total Accounts: <span className="text-white">{userStats.totalAccounts}</span></p>
            <p>Total Transactions: <span className="text-white">{userStats.totalTransactions}</span></p>
            <p>Total Debit: ₹<span className="text-red-400">{userStats.totalDebit}</span></p>
            <p>Total Credit: ₹<span className="text-green-400">{userStats.totalCredit}</span></p>
            <p>
              Above Average Spender?{' '}
              <span className={userStats.aboveAverageSpender ? 'text-yellow-400' : 'text-gray-400'}>
                {userStats.aboveAverageSpender ? 'Yes' : 'No'}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
