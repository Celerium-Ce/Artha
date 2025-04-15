'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function GroupExpenses() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGroups = async () => {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('GroupExpense')
      .select(`
        groupid,
        createdby,
        Creator:User!GroupExpense_createdby_fkey (
          name,
          email
        ),
        User_Group (
          balance,
          User (
            userid,
            name,
            email
          )
        )
      `);

    if (error) {
      console.error('Error fetching groups:', error.message);
      alert('Failed to fetch groups');
      setLoading(false);
      return;
    }

    const formattedGroups = data.map(group => ({
      groupID: group.groupid,
      createdBy: group.Creator.email,
      creatorName: group.Creator.name,
      members: group.User_Group.map(member => ({
        id: member.User.userid,
        email: member.User.email,
        name: member.User.name,
        balance: parseFloat(member.balance)
      })),
      totalBalance: group.User_Group.reduce((sum, member) => 
        sum + parseFloat(member.balance || 0), 0
      )
    }));

    setGroups(formattedGroups);
    setLoading(false);
  };

  const handleDeleteGroup = async (groupId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this group? This action cannot be undone.'
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from('GroupExpense')
      .delete()
      .eq('groupid', groupId);

    if (error) {
      console.error('Error deleting group:', error.message);
      alert('Failed to delete group');
      return;
    }

    await fetchGroups();
    alert('Group deleted successfully');
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-gray-800 text-gray-200 text-center">
        Loading groups...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-800 text-gray-200 rounded-2xl border-none shadow-none max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold text-white opacity-90 mb-6 text-center">Group Expenses</h2>

      {groups.length === 0 ? (
        <div className="text-center text-gray-400">No groups found</div>
      ) : (
        groups.map((group) => (
          <div key={group.groupID} className="bg-gray-700 p-6 rounded-2xl mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-[#4B7EFF] mb-2">
                  Group ID: {group.groupID}
                </h3>
                <p className="text-gray-400">
                  Created by: <span className="text-white">{group.creatorName} ({group.createdBy})</span>
                </p>
                <p className="text-gray-400">
                  Total Balance: <span className={`font-semibold ${
                    group.totalBalance >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>₹{group.totalBalance.toFixed(2)}</span>
                </p>
              </div>
              <button
                onClick={() => handleDeleteGroup(group.groupID)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 transition"
              >
                Delete Group
              </button>
            </div>

            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="text-gray-300">
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Balance (₹)</th>
                </tr>
              </thead>
              <tbody>
                {group.members.map((member) => (
                  <tr key={member.id} className="border-t border-gray-600">
                    <td className="px-4 py-2">{member.name}</td>
                    <td className="px-4 py-2">{member.email}</td>
                    <td className={`px-4 py-2 ${
                      member.balance >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {member.balance.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
}