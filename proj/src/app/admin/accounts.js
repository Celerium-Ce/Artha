'use client';

import React, { useState, useEffect } from 'react';

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc'); // asc or desc for sorting balance

  useEffect(() => {
    // Dummy data for now
    const fetchedAccounts = [
      { accountid: 1, balance: 5000, type: 'Savings', users: 1 },
      { accountid: 2, balance: 15000, type: 'Checking', users: 1 },
      { accountid: 3, balance: 2000, type: 'Savings', users: 1 },
    ];
    setAccounts(fetchedAccounts);
  }, []);

  const sortAccounts = (order) => {
    const sorted = [...accounts].sort((a, b) => (order === 'asc' ? a.balance - b.balance : b.balance - a.balance));
    setAccounts(sorted);
  };

  const handleDelete = async (txnid) => {
    const confirmed = window.confirm('Are you sure you want to delete this transaction? This will affect associated data.');
    if (confirmed) {
      // Delete from database (Supabase)
      const { error } = await supabase
        .from('transactions')  // Ensure you're targeting the correct table
        .delete()
        .eq('txnid', txnid);  // Use txnid to delete the transaction with that ID
  
      if (error) {
        console.error('Error deleting transaction:', error.message);
        alert('Failed to delete the transaction.');
        return;
      }
  
      // Optionally, remove it from your local state (UI) as well
      setTransactions((prev) => prev.filter((transaction) => transaction.id !== txnid));
  
      alert('Transaction deleted successfully!');
    }
  };
  

  useEffect(() => {
    sortAccounts(sortOrder); // Sort when sortOrder changes
  }, [sortOrder]);

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
              <th className="px-4 py-2">Total Users</th>
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
                  <td className="px-4 py-2">₹{account.balance}</td>
                  <td className="px-4 py-2">{account.type}</td>
                  <td className="px-4 py-2">{account.users}</td>
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
