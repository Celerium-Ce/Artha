'use client';

import React, { useState, useEffect } from 'react';

export default function GroupExpenses() {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchedGroups = [
      {
        groupID: 1,
        createdBy: 'alice@example.com',
        members: [
          { email: 'alice@example.com', name: 'Alice', balance: 500 },
          { email: 'bob@example.com', name: 'Bob', balance: -250 },
        ],
      },
      {
        groupID: 2,
        createdBy: 'bob@example.com',
        members: [
          { email: 'bob@example.com', name: 'Bob', balance: 1000 },
          { email: 'charlie@example.com', name: 'Charlie', balance: -1000 },
        ],
      },
    ];
    setGroups(fetchedGroups);
  }, []);

  return (
    <div className="p-6 bg-gray-800 text-gray-200 rounded-2xl border-none shadow-none max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold text-[#4B7EFF] opacity-90 mb-6 text-center">Group Expenses</h2>

      {groups.map((group) => (
        <div key={group.groupID} className="bg-gray-700 p-6 rounded-2xl mb-6">
          <h3 className="text-xl font-semibold text-[#4B7EFF] mb-2">Group ID: {group.groupID}</h3>
          <p className="text-gray-400 mb-4">Created by: <span className="text-white">{group.createdBy}</span></p>
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="text-gray-300">
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Balance (₹)</th>
              </tr>
            </thead>
            <tbody>
              {group.members.map((member) => (
                <tr key={member.email} className="border-t border-gray-600">
                  <td className="px-4 py-2">{member.email}</td>
                  <td className="px-4 py-2">{member.name}</td>
                  <td
                    className={`px-4 py-2 ${
                      member.balance >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {member.balance}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
