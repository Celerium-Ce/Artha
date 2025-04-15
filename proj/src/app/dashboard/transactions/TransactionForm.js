'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-toastify';

export default function TransactionForm({ accountId, onSuccess, user }) {
  // Form states
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState('credit'); // credit/debit instead of income/expense
  const [date, setDate] = useState('');
  
  // New category states
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Load categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Format today's date for default value
  useEffect(() => {
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

  // Handle adding a new category
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    try {
      // Check if category already exists
      const existingCategory = categories.find(
        cat => cat.catname.toLowerCase() === newCategoryName.toLowerCase()
      );

      if (existingCategory) {
        toast.info('This category already exists');
        setCategory(existingCategory.catname);
        setIsAddingCategory(false);
        setNewCategoryName('');
        return;
      }

      // Add new category
      const { data, error } = await supabase
        .from('Category')
        .insert([{ catname: newCategoryName }])
        .select();

      if (error) {
        console.error('Error adding category:', error);
        toast.error('Failed to add category');
        return;
      }

      console.log('New category added:', data);
      toast.success('Category added successfully');
      
      // Update categories list
      await fetchCategories();
      
      // Select the newly added category
      if (data && data[0]) {
        setCategory(data[0].catname);
      }
      
      // Reset new category form
      setIsAddingCategory(false);
      setNewCategoryName('');
      
    } catch (err) {
      console.error('Exception adding category:', err);
      toast.error('An error occurred');
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
    
    if (!category || !amount || !date) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate amount is greater than 0 (matches db constraint)
    if (parseFloat(amount) <= 0) {
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

      // Format data for database insert (match exact field names from schema)
      const transactionData = {
        accountid: accountId,
        amount: parseInt(amount, 10), // DB schema uses integer, not float
        transactionwhen: new Date(date).toISOString(), // Convert to ISO format
        catid: selectedCategory.catid,
        credit_debit: transactionType // Match DB field name
      };

      console.log('Sending transaction data:', transactionData);

      // Insert transaction
      const { data, error } = await supabase
        .from('Transaction')
        .insert([transactionData])
        .select();

      if (error) {
        console.error('Error adding transaction:', error);
        toast.error('Failed to save transaction: ' + error.message);
        return;
      }

      // Success!
      console.log('Transaction added successfully:', data);
      toast.success('Transaction saved successfully');
      
      // Reset form
      setAmount('');
      setCategory('');
      
      // Keep the transaction type and date as they are for convenience
      
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

        {/* Category Selection or Add New Category */}
        <div className="flex flex-col">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-400">Category</label>
            <button
              type="button"
              onClick={() => setIsAddingCategory(!isAddingCategory)}
              className="text-xs text-[#4B7EFF] hover:underline"
            >
              {isAddingCategory ? "Select Existing Category" : "Add New Category"}
            </button>
          </div>
          
          {isAddingCategory ? (
            <div className="flex mt-1">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="bg-gray-700 border border-gray-500 text-gray-200 rounded-l-xl p-2 focus:ring-[#4B7EFF] focus:border-[#4B7EFF] flex-grow"
                placeholder="Enter new category name"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="bg-[#4B7EFF] text-white rounded-r-xl px-3 hover:bg-opacity-90"
              >
                Add
              </button>
            </div>
          ) : (
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-gray-700 border border-gray-500 text-gray-200 rounded-xl p-2 focus:ring-[#4B7EFF] focus:border-[#4B7EFF]"
              required={!isAddingCategory}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.catid} value={cat.catname}>
                  {cat.catname}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Amount - Integer Only */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-400">Amount</label>
          <input
            type="number"
            min="1" // Enforce DB constraint
            step="1" // Integer only
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-gray-700 border border-gray-500 text-gray-200 rounded-xl p-2 focus:ring-[#4B7EFF] focus:border-[#4B7EFF]"
            placeholder="Enter amount (whole number)"
            required
          />
        </div>

        {/* Date */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-400">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-gray-700 border border-gray-500 text-gray-200 rounded-xl p-2 focus:ring-[#4B7EFF] focus:border-[#4B7EFF]"
            required
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
