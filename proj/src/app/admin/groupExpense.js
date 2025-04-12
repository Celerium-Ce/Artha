'use client';

import React, { useState, useEffect } from 'react';

export default function GroupExpense() {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchedGroups = [
      { groupID: 1, createdBy: 'Alice', numMembers: 5, totalExpense: 10000 },
      { groupID: 2, createdBy: 'Bob', numMembers: 3, totalExpense: 5000 },
    ];
    setGroups(fetchedGroups);
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold text-teal-400 opacity-90 mb-4">Group Expenses</h2>
      <table className="min-w-full bg-gray-800 text-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Group ID</th>
            <th className="px-4 py-2 text-left">Created By</th>
            <th className="px-4 py-2 text-left">Number of Members</th>
            <th className="px-4 py-2 text-left">Total Expense</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => (
            <tr key={group.groupID}>
              <td className="px-4 py-2">{group.groupID}</td>
              <td className="px-4 py-2">{group.createdBy}</td>
              <td className="px-4 py-2">{group.numMembers}</td>
              <td className="px-4 py-2">₹{group.totalExpense}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
