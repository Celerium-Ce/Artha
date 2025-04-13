'use client';

import React, { useState, useEffect } from 'react';

const badgeOptions = [
  'First Steps', 'Budget Beginner', 'Transaction Logged',
  'Budget Master', 'Expense Tracker', 'Minimalist',
  'Smart Saver', 'Investor Mindset', 'Wealth Builder',
  'Daily Tracker', 'Money Master', 'Streak Legend',
  'Big Spender', 'Debt Free', 'Financial Freedom'
];

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [selectedBadge, setSelectedBadge] = useState('');
  const [targetEmail, setTargetEmail] = useState('');

  useEffect(() => {
    const fetchedLeaderboard = [
      {
        userEmail: 'alice@example.com',
        points: 120,
        badges: ['Budget Beginner', 'Daily Tracker'],
        streak: 5
      },
      {
        userEmail: 'bob@example.com',
        points: 90,
        badges: ['Transaction Logged'],
        streak: 2
      }
    ];
    setUsers(fetchedLeaderboard);
  }, []);

  const awardBadge = () => {
    if (!targetEmail || !selectedBadge) return;
    setUsers((prev) =>
      prev.map((user) =>
        user.userEmail === targetEmail && !user.badges.includes(selectedBadge)
          ? { ...user, badges: [...user.badges, selectedBadge] }
          : user
      )
    );
    setTargetEmail('');
    setSelectedBadge('');
  };

  const resetStreak = (email) => {
    const confirmReset = confirm(`Reset streak for ${email}?`);
    if (confirmReset) {
      setUsers((prev) =>
        prev.map((user) =>
          user.userEmail === email ? { ...user, streak: 0 } : user
        )
      );
    }
  };

  return (
    <div className="p-6 bg-gray-800 text-gray-200 rounded-2xl border-none shadow-none max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold text-teal-400 opacity-90 mb-6 text-center">Leaderboard</h2>

      <div className="bg-gray-700 p-6 rounded-2xl mb-6">
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr className="text-gray-300">
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Points</th>
              <th className="px-4 py-2">Badges</th>
              <th className="px-4 py-2">Streak</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.userEmail} className="border-t border-gray-600">
                <td className="px-4 py-2">{user.userEmail}</td>
                <td className="px-4 py-2">{user.points}</td>
                <td className="px-4 py-2">
                  <ul className="list-disc list-inside">
                    {user.badges.map((badge, index) => (
                      <li key={index}>{badge}</li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-2">{user.streak}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => resetStreak(user.userEmail)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500 transition"
                  >
                    Reset Streak
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-700 p-6 rounded-2xl">
        <h3 className="text-xl font-semibold text-teal-400 opacity-90 mb-4">Award Badge</h3>
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <input
            type="email"
            placeholder="Enter user email"
            value={targetEmail}
            onChange={(e) => setTargetEmail(e.target.value)}
            className="w-full p-2 rounded bg-gray-600 text-white placeholder-gray-400"
          />
          <select
            value={selectedBadge}
            onChange={(e) => setSelectedBadge(e.target.value)}
            className="w-full p-2 rounded bg-gray-600 text-white"
          >
            <option value="">Select Badge</option>
            {badgeOptions.map((badge, index) => (
              <option key={index} value={badge}>
                {badge}
              </option>
            ))}
          </select>
          <button
            onClick={awardBadge}
            className="bg-teal-500 text-white font-semibold px-6 py-2 rounded hover:bg-teal-400 transition"
          >
            Award Badge
          </button>
        </div>
      </div>
    </div>
  );
}
