'use client';

import React, { useState, useEffect } from 'react';

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchedUsers = [
      { id: 1, name: 'Alice', email: 'alice@example.com', role: 'Admin', createdAt: '2023-01-01' },
      { id: 2, name: 'Bob', email: 'bob@example.com', role: 'User', createdAt: '2023-02-15' },
    ];
    setUsers(fetchedUsers);
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold text-teal-400 opacity-90 mb-4">Users</h2>
      <table className="min-w-full bg-gray-800 text-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Role</th>
            <th className="px-4 py-2 text-left">Created At</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-4 py-2">{user.id}</td>
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">{user.role}</td>
              <td className="px-4 py-2">{user.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
