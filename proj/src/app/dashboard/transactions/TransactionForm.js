'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-toastify';

export default function TransactionForm({ accountId, onSuccess, user }) {
  // Form states
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState('credit');
  const [date, setDate] = useState('');

  // Load categories on component mount
  useEffect(() => {
    fetchCategories();
    
    // Set default date to today
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setDate(formattedDate);
  }, []);

  // Fetch categories from database
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('Category')
        .select('catid, catname')
        .order('catname', { ascending: true });

      if (error) {
        console.error('Error fetching categories:', error.message);
        toast.error('Failed to load categories');
      } else {
        console.log('Categories loaded:', data);
        setCategories(data || []);
      }
    } catch (err) {
      console.error('Exception fetching categories:', err);
    }
  };

  // Handle submitting the transaction form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!accountId) {
      toast.error('No account found. Please refresh the page.');
      return;
    }
    
    if (!category || !amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate amount is positive
    if (parseInt(amount, 10) <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }

    try {
      console.log('Submitting transaction form with values:', {
        accountId,
        amount,
        type: transactionType,
        category,
        date
      });
      
      // Find selected category ID
      const selectedCategory = categories.find(cat => cat.catname === category);
      if (!selectedCategory) {
        toast.error('Please select a valid category');
        return;
      }

      // Format data for database insert
      const transactionData = {
        accountid: accountId,
        amount: parseInt(amount, 10),
        catid: selectedCategory.catid,
        credit_debit: transactionType
      };
      
      // Only add date if provided (otherwise use default)
      if (date) {
        transactionData.transactionwhen = new Date(date).toISOString();
      }

      console.log('Sending transaction data:', transactionData);

      // Insert transaction
      const { data, error } = await supabase
        .from('Transaction')
        .insert(transactionData);

      if (error) {
        console.error('Error adding transaction:', error);
        toast.error('Failed to save transaction: ' + error.message);
        return;
      }

      // Success!
      console.log('Transaction added successfully');
      toast.success('Transaction saved successfully');
      
      // Reset form
      setAmount('');
      setCategory('');
      
      // Notify parent component to refresh data
      if (onSuccess) {
        onSuccess(amount, transactionType);
      }
      
    } catch (err) {
      console.error('Exception submitting transaction:', err);
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-semibold text-[#4B7EFF] opacity-90 mb-4">
        Add Transaction
      </h2>
      
      <div className="space-y-4">
        {/* Transaction Type */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-400">Transaction Type</label>
          <select
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
            className="bg-gray-700 border border-gray-500 text-gray-200 rounded-xl p-2 focus:ring-[#4B7EFF] focus:border-[#4B7EFF]"
            required
          >
            <option value="credit">Credit (Money In)</option>
            <option value="debit">Debit (Money Out)</option>
          </select>
        </div>

        {/* Simplified Category Selection */}
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

        {/* Amount */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-400">Amount</label>
          <input
            type="number"
            min="1"
            step="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-gray-700 border border-gray-500 text-gray-200 rounded-xl p-2 focus:ring-[#4B7EFF] focus:border-[#4B7EFF]"
            placeholder="Enter amount"
            required
          />
        </div>

        {/* Date */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-400">Date (Optional)</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-gray-700 border border-gray-500 text-gray-200 rounded-xl p-2 focus:ring-[#4B7EFF] focus:border-[#4B7EFF]"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-4 w-full bg-[#4B7EFF] hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded-xl transition-colors"
        >
          Save Transaction
        </button>
      </div>
    </form>
  );
}
