'use client';

import React, { useState, useEffect } from 'react';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [transactionType, setTransactionType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [threshold, setThreshold] = useState('');

  useEffect(() => {
    const fetchedTransactions = [
      { txnID: 1, accountID: 1, timeStamp: '2025-04-10', amount: 500, type: 'debit', category: 'Food' },
      { txnID: 2, accountID: 2, timeStamp: '2025-04-09', amount: 1500, type: 'credit', category: 'Salary' },
      { txnID: 3, accountID: 3, timeStamp: '2025-04-08', amount: 200, type: 'debit', category: 'Entertainment' },
      { txnID: 4, accountID: 1, timeStamp: '2025-04-07', amount: 5000, type: 'credit', category: 'Refund' },
    ];
    setTransactions(fetchedTransactions);
    setFilteredTransactions(fetchedTransactions);
  }, []);

  const filterTransactions = () => {
    let filtered = [...transactions];

    if (transactionType) {
      filtered = filtered.filter(txn => txn.type === transactionType);
    }

    if (startDate && endDate) {
      filtered = filtered.filter(txn => txn.timeStamp >= startDate && txn.timeStamp <= endDate);
    }

    if (threshold) {
      filtered = filtered.filter(txn => txn.amount >= parseFloat(threshold));
    }

    setFilteredTransactions(filtered);
  };

  const handleDelete = (txnID) => {
    const confirmed = confirm('Are you sure you want to delete this transaction?');
    if (confirmed) {
      setTransactions((prev) => prev.filter((txn) => txn.txnID !== txnID));
      setFilteredTransactions((prev) => prev.filter((txn) => txn.txnID !== txnID));
    }
  };

  return (
    <div className="p-6 bg-gray-800 text-gray-200 rounded-2xl border-none shadow-none max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold text-white opacity-90 mb-6 text-center">Transactions</h2>

      <div className="bg-gray-700 p-6 rounded-2xl mb-6">
        <div className="flex justify-between mb-4 space-x-4">
          <div className="flex flex-1 space-x-4">
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              className="bg-gray-600 text-white p-2 rounded w-full"
            >
              <option value="">Filter by Type</option>
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
            </select>

            <div className="flex flex-1 space-x-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-gray-600 text-white p-2 rounded w-full"
              />
              <span className="text-gray-300 self-center">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-gray-600 text-white p-2 rounded w-full"
              />
            </div>
          </div>

          <div className="flex flex-1 space-x-4">
            <input
              type="number"
              placeholder="Threshold"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              className="bg-gray-600 text-white p-2 rounded w-full"
            />
            <button
              onClick={filterTransactions}
              className="bg-[#4B7EFF] text-white px-4 py-2 rounded hover:bg-[#4B7EFF] transition w-full"
            >
              Apply Filters
            </button>
          </div>
        </div>

        <table className="min-w-full text-sm text-left table-auto">
          <thead>
            <tr className="text-gray-300">
              <th className="px-4 py-2">Transaction ID</th>
              <th className="px-4 py-2">Account ID</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-2 text-center text-gray-500">
                  No transactions available.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((txn) => (
                <tr key={txn.txnID} className="border-t border-gray-600">
                  <td className="px-4 py-2">{txn.txnID}</td>
                  <td className="px-4 py-2">{txn.accountID}</td>
                  <td className="px-4 py-2">{txn.timeStamp}</td>
                  <td className="px-4 py-2">₹{txn.amount}</td>
                  <td className="px-4 py-2">{txn.type}</td>
                  <td className="px-4 py-2">{txn.category}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDelete(txn.txnID)}
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
