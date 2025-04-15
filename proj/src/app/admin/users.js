'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [userEmailForStats, setUserEmailForStats] = useState('');
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('User')
      .select(`
        userid,
        name,
        email,
        settings
      `);

    if (error) {
      console.error('Error fetching users:', error.message);
      alert('Failed to fetch users');
      return;
    }

    setUsers(data);
    setLoading(false);

    
  };

  useEffect(() => {
    fetchUsers();

    // Set up real-time subscription
    const channel = supabase
      .channel('custom-users-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'User'
        },
        (payload) => {
          console.log('Change received:', payload);
          fetchUsers(); // Refresh the users list
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const deleteUser = async (userId) => {
    const confirmed = window.confirm(
      'Are you sure? This will delete ALL data associated with this user including their accounts, transactions, and group memberships.'
    );
    
    if (!confirmed) return;

    const { error } = await supabase
      .from('User')
      .delete()
      .eq('userid', userId);

    if (error) {
      console.error('Error deleting user:', error.message);
      alert('Failed to delete user');
      return;
    }

    alert('User deleted successfully');
  };

  const fetchUserStats = async (email) => {
    if (!email) {
      alert('Please enter a user email');
      return;
    }
  
    // First get the user's ID
    const { data: userData, error: userError } = await supabase
      .from('User')
      .select('userid')
      .eq('email', email)
      .single();
  
    if (userError) {
      console.error('Error finding user:', userError.message);
      alert('User not found');
      return;
    }
  
    // Then get user's accounts using the userid
    const { data: accounts, error: accountsError } = await supabase
      .from('Account')
      .select(`
        accountid,
        balance,
        Transaction (
          amount,
          credit_debit
        )
      `)
      .eq('userid', userData.userid);
  
    if (accountsError) {
      console.error('Error fetching user stats:', accountsError.message);
      alert('Failed to fetch user statistics');
      return;
    }
  
    // Calculate user's debit statistics
  // Calculate user's total debit amount
  let totalAccounts = accounts?.length || 0;
  let totalTransactions = 0;
  let totalDebit = 0;
  let totalCredit = 0;

  accounts?.forEach(account => {
    if (account.Transaction) {
      totalTransactions += account.Transaction.length;
      account.Transaction.forEach(txn => {
        if (txn.credit_debit === 'debit') {
          totalDebit += txn.amount;
        } else {
          totalCredit += txn.amount;
        }
      });
    }
  });

  // Get all users' total debit amounts
  // Get all users' total debit amounts with their userids
const { data: allDebits, error: debitsError } = await supabase
.from('Transaction')
.select(`
  amount,
  Account!inner (
    userid
  )
`)
.eq('credit_debit', 'debit');

if (debitsError) {
console.error('Error calculating platform average:', debitsError.message);
return;
}

// Calculate platform average by first summing per user, then averaging
const userTotals = {};
allDebits.forEach(txn => {
const userid = txn.Account.userid;
userTotals[userid] = (userTotals[userid] || 0) + txn.amount;
});

const totalUsers = Object.keys(userTotals).length;
const platformTotalDebit = Object.values(userTotals).reduce((sum, userTotal) => sum + userTotal, 0);
const platformAvgDebit = totalUsers > 0 ? platformTotalDebit / totalUsers : 0;

  console.log('Debug:', {
    userTotalDebit: totalDebit,
    platformAvgDebit,
    totalUsers
  });

  setUserStats({
    totalAccounts,
    totalTransactions,
    totalDebit,
    totalCredit,
    aboveAverageSpender: totalDebit > platformAvgDebit
  });
};

  if (loading) {
    return (
      <div className="p-6 bg-gray-800 text-gray-200 text-center">
        Loading users...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-800 text-gray-200 rounded-2xl border-none shadow-none max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold text-white opacity-90 mb-6 text-center">Users</h2>

      <div className="bg-gray-700 p-6 rounded-2xl mb-6">
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr className="text-gray-300">
              <th className="px-4 py-2">User ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Settings</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.userid} className="border-t border-gray-600">
                <td className="px-4 py-2">{user.userid}</td>
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">
                  <div className="text-xs">
                    <p>Currency: {user.settings.currency}</p>
                    <p>Theme: {user.settings.theme}</p>
                    <p>Language: {user.settings.language}</p>
                  </div>
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => deleteUser(user.userid)}
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
        <h3 className="text-xl font-semibold text-white opacity-90 mb-4">View User Stats</h3>
        <div className="flex items-center mb-4">
          <input
            type="email"
            placeholder="Enter user email"
            value={userEmailForStats}
            onChange={(e) => setUserEmailForStats(e.target.value)}
            className="w-full p-2 rounded bg-gray-600 text-white placeholder-gray-400"
          />
          <button
            onClick={() => fetchUserStats(userEmailForStats)}
            className="ml-4 bg-[#4B7EFF] text-white font-semibold px-6 py-2 rounded hover:bg-[#4B7EFF] transition"
          >
            View Stats
          </button>
        </div>

        {userStats && (
          <div className="text-gray-300 space-y-2">
            <p>Total Accounts: <span className="text-white">{userStats.totalAccounts}</span></p>
            <p>Total Transactions: <span className="text-white">{userStats.totalTransactions}</span></p>
            <p>Total Debit: ₹<span className="text-red-400">{userStats.totalDebit.toLocaleString()}</span></p>
            <p>Total Credit: ₹<span className="text-green-400">{userStats.totalCredit.toLocaleString()}</span></p>
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