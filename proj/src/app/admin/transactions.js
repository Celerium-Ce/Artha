'use client';

import React, { useState, useEffect } from 'react';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchedTransactions = [
      { transactionID: 1, category: 'Food', subcategory: 'Groceries', amount: 1200, date: '2023-04-01', paymentMethod: 'Credit Card' },
      { transactionID: 2, category: 'Entertainment', subcategory: 'Movies', amount: 800, date: '2023-04-02', paymentMethod: 'Debit Card' },
    ];
    setTransactions(fetchedTransactions);
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold text-teal-400 opacity-90 mb-4">Transactions</h2>
      <table className="min-w-full bg-gray-800 text-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Transaction ID</th>
            <th className="px-4 py-2 text-left">Category</th>
            <th className="px-4 py-2 text-left">Subcategory</th>
            <th className="px-4 py-2 text-left">Amount</th>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Payment Method</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.transactionID}>
              <td className="px-4 py-2">{transaction.transactionID}</td>
              <td className="px-4 py-2">{transaction.category}</td>
              <td className="px-4 py-2">{transaction.subcategory}</td>
              <td className="px-4 py-2">₹{transaction.amount}</td>
              <td className="px-4 py-2">{transaction.date}</td>
              <td className="px-4 py-2">{transaction.paymentMethod}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
