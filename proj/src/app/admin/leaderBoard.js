'use client';

import React, { useState, useEffect } from 'react';

export default function Leaderboard() {
  const [users, setUsers] = useState([]);

  // Fetch leaderboard data
  useEffect(() => {
    // Example leaderboard data (replace with real data fetch)
    const fetchedUsers = [
      { userID: 1, name: 'Alice', points: 200, streak: 5 },
      { userID: 2, name: 'Bob', points: 150, streak: 3 },
    ];
    setUsers(fetchedUsers);
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold text-highlight">Leaderboard</h2>
      <table className="min-w-full bg-dark-page text-white">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Rank</th>
            <th className="px-4 py-2 text-left">User</th>
            <th className="px-4 py-2 text-left">Points</th>
            <th className="px-4 py-2 text-left">Streak</th>
          </tr>
        </thead>
        <tbody>
          {users
            .sort((a, b) => b.points - a.points) // Sort by points (descending)
            .map((user, index) => (
              <tr key={user.userID}>
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.points}</td>
                <td className="px-4 py-2">{user.streak}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
