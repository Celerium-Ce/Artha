"use client";
import React from "react";

const badges = [
  "First Steps", "Budget Beginner", "Transaction Logged", "Budget Master"
];

const leaderboard = [
  { name: "Alice", points: 1200 },
  { name: "Bob", points: 1100 },
  { name: "Charlie", points: 950 },
];

// Dummy streak data (✓ for completed, X for missed)
const streakData = [
  { day: "Mon", completed: true },
  { day: "Tue", completed: true },
  { day: "Wed", completed: false },
  { day: "Thu", completed: true },
  { day: "Fri", completed: true },
  { day: "Sat", completed: true },
  { day: "Sun", completed: true },
];

export default function GamificationPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold text-[#4B7EFF] opacity-90 mb-6 pt-6 text-center">Leaderboard</h1>

      <div className="p-6 bg-gray-800 text-gray-200 rounded-2xl shadow-lg max-w-4xl mx-auto">

        {/* Streak Section */}
        <div className="bg-gray-700 p-6 rounded-2xl shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-white opacity-90 mb-2">Your Streak</h2>
          <p className="text-2xl font-bold text-white">🔥 6-day streak</p>
          <p className="text-gray-400 mt-1 text-sm">Keep it going by logging your activity daily!</p>
        </div>

        {/* Points Section */}
        <div className="bg-gray-700 p-6 rounded-2xl shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-white opacity-90">Your Points</h2>
          <p className="text-3xl font-bold mt-2 text-white">1,250</p>
        </div>

        {/* Badges Section */}
        <div className="bg-gray-700 p-6 rounded-2xl shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-white opacity-90 mb-4">Your Badges</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {badges.map((badge) => (
              <div
                key={badge}
                className="bg-gray-600 p-4 rounded-xl border border-gray-500 hover:bg-gray-500 transition"
              >
                <div className="w-16 h-16 bg-gray-500 rounded-full mx-auto mb-2">
                  <img src="/badge.png" alt="badge" className="w-full h-full object-cover rounded-full" />
                </div>
                <p className="text-center text-sm text-gray-400">{badge}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="bg-gray-700 p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold text-white opacity-90 mb-4">Leaderboard</h2>
          <ul className="divide-y divide-gray-600">
            {leaderboard.map((user, index) => (
              <li key={user.name} className="flex justify-between py-2">
                <span className="text-gray-300">{index + 1}. {user.name}</span>
                <span className="font-semibold text-white">{user.points} pts</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
