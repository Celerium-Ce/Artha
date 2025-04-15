'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

const accountid = 12; // Assuming the account ID is static for now

export default function TransactionForm({ fetchTransactions }) {
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState('credit');
  const [timestamp, setTimestamp] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('Category')
        .select('catid, catname')
        .order('catname', { ascending: true });

      if (error) {
        console.error('Error fetching categories:', error.message);
      } else {
        setCategories(data);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category || !amount || !transactionType || !timestamp) return;

    const parsedAmount = parseFloat(amount);
    const parsedTimestamp = new Date(timestamp).toISOString();
    const castedTransactionType = transactionType === 'credit' ? 'credit' : 'debit';

    const selectedCategory = categories.find((c) => c.catname === category);
    if (!selectedCategory) {
      alert('Invalid category selected.');
      return;
    }

    const { error: insertError } = await supabase
      .from('Transaction')
      .insert([{
        accountid: accountid,
        amount: parsedAmount,
        transactionWhen: parsedTimestamp,
        catid: selectedCategory.catid,
        credit_debit: castedTransactionType,
      }]);

    if (insertError) {
      console.error('Failed to add transaction:', insertError.message);
      alert('Failed to save transaction. Please try again.');
    } else {
      await fetchTransactions();
      setCategory('');
      setAmount('');
      setTransactionType('credit');
      setTimestamp('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-semibold text-[#4B7EFF] opacity-90 mb-4">
        Add Transaction
      </h2>
      <div className="space-y-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-400">Transaction Type</label>
          <select
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
            className="bg-gray-700 border border-gray-500 text-gray-200 rounded-xl p-2 focus:ring-[#4B7EFF] focus:border-[#4B7EFF]"
            required
          >
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-400">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-gray-700 border border-gray-500 text-gray-200 rounded-xl p-2 focus:ring-[#4B7EFF] focus:border-[#4B7EFF]"
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.catid} value={cat.catname}>
                {cat.catname}
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
            className="bg-gray-700 border border-gray-500 text-gray-200 rounded-xl p-2 focus:ring-[#4B7EFF] focus:border-[#4B7EFF]"
            placeholder="Transaction amount"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-400">Timestamp</label>
          <input
            type="datetime-local"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            className="bg-gray-700 border border-gray-500 text-gray-200 rounded-xl p-2 focus:ring-[#4B7EFF] focus:border-[#4B7EFF]"
            required
          />
        </div>

        <button
          type="submit"
          className="mt-4 bg-[#4B7EFF] text-gray-900 rounded-xl py-2 px-4 w-full hover:bg-[#4B7EFF] transition-colors"
        >
          Save Transaction
        </button>
      </div>
    </form>
  );
}
