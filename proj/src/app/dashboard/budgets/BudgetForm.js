'use client';

import { useState } from 'react';

export default function BudgetForm({ setBudgets, categories }) {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category || !amount || !startDate || !endDate) return;

    setBudgets((prev) => [
      ...prev,
      {
        id: Date.now(),
        category,
        amount,
        spent: 0,
        startDate,
        endDate,
      },
    ]);

    setCategory('');
    setAmount('');
    setStartDate('');
    setEndDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-semibold text-teal-400 opacity-90 mb-4">
        Set a Budget
      </h2>
      <div className="space-y-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-400">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-gray-700 border border-gray-500 text-gray-200 rounded-xl p-2 focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-400">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-gray-700 border border-gray-500 text-gray-200 rounded-xl p-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="Budget amount"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-400">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-gray-700 border border-gray-500 text-gray-200 rounded-xl p-2 focus:ring-teal-500 focus:border-teal-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-400">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-gray-700 border border-gray-500 text-gray-200 rounded-xl p-2 focus:ring-teal-500 focus:border-teal-500"
          />
        </div>

        <button
          type="submit"
          className="mt-4 bg-teal-500 text-gray-900 rounded-xl py-2 px-4 w-full hover:bg-teal-600 transition-colors"
        >
          Save Budget
        </button>
      </div>
    </form>
  );
}
