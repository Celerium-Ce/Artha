'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true);

  const fetchAccounts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('Account')
      .select(`
        accountid,
        balance,
        type,
        userid,
        User!Account_userid_fkey (
          name,
          email
        )
      `);

    if (error) {
      console.error('Error fetching accounts:', error.message);
      alert('Failed to fetch accounts');
      return;
    }

    const formattedAccounts = data.map(account => ({
      accountid: account.accountid,
      balance: parseFloat(account.balance),
      type: account.type,
      userName: account.User.name,
      userEmail: account.User.email
    }));

    setAccounts(formattedAccounts);
    setLoading(false);
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const sortAccounts = (order) => {
    const sorted = [...accounts].sort((a, b) => 
      order === 'asc' ? a.balance - b.balance : b.balance - a.balance
    );
    setAccounts(sorted);
  };

  const handleDelete = async (accountId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this account? This will delete all associated transactions and budgets.'
    );

    if (confirmed) {
      const { error } = await supabase
        .from('Account')
        .delete()
        .eq('accountid', accountId);

      if (error) {
        console.error('Error deleting account:', error.message);
        alert('Failed to delete the account.');
        return;
      }

      // Refresh accounts list
      fetchAccounts();
      alert('Account deleted successfully!');
    }
  };

  useEffect(() => {
    sortAccounts(sortOrder);
  }, [sortOrder]);

  if (loading) {
    return (
      <div className="p-6 bg-gray-800 text-gray-200 text-center">
        Loading accounts...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-800 text-gray-200 rounded-2xl border-none shadow-none max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold text-white opacity-90 mb-6 text-center">Accounts</h2>

      <div className="bg-gray-700 p-6 rounded-2xl mb-6">
        <div className="flex justify-between mb-4">
          <div>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="bg-[#4B7EFF] text-white px-4 py-2 rounded hover:bg-[#4B7EFF] transition"
            >
              Sort by Balance ({sortOrder === 'asc' ? 'Low to High' : 'High to Low'})
            </button>
          </div>
        </div>

        <table className="min-w-full text-sm text-left table-auto">
          <thead>
            <tr className="text-gray-300">
              <th className="px-4 py-2">Account ID</th>
              <th className="px-4 py-2">Balance</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-2 text-center text-gray-500">
                  No accounts available.
                </td>
              </tr>
            ) : (
              accounts.map((account) => (
                <tr key={account.accountid} className="border-t border-gray-600">
                  <td className="px-4 py-2">{account.accountid}</td>
                  <td className="px-4 py-2">₹{account.balance.toFixed(2)}</td>
                  <td className="px-4 py-2">{account.type}</td>
                  <td className="px-4 py-2">
                    {account.userName}<br/>
                    <span className="text-gray-400 text-xs">{account.userEmail}</span>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDelete(account.accountid)}
                      className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-500 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}