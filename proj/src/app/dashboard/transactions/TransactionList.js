'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export default function TransactionList({ transactions, onUpdate }) {
  const [sortOption, setSortOption] = useState('date-desc');
  const [filterOption, setFilterOption] = useState('all');

  // Handle transaction deletion
  const handleDelete = async (transactionId) => {
    console.log('Attempting to delete transaction with id:', transactionId);
    
    // Ensure transaction ID is valid
    if (!transactionId) {
      console.error('Transaction ID is invalid:', transactionId);
      alert('Invalid transaction ID.');
      return;
    }
  
    const confirmed = window.confirm('Are you sure you want to delete this transaction?');
    if (confirmed) {
      // Delete from database (Supabase)
      const { error } = await supabase
        .from('Transaction')
        .delete()
        .eq('txnid', transactionId);
  
      if (error) {
        console.error('Error deleting transaction:', error.message);
        alert('Failed to delete the transaction.');
        return;
      }
  
      // Notify parent to refresh transactions
      if (onUpdate) onUpdate();
      
      alert('Transaction deleted successfully!');
    }
  };
  
  // Filter transactions based on selected filter option
  const filtered = transactions.filter((tx) => {
    if (filterOption === 'all') return true;
    return tx.type === filterOption;
  });

  // Sort transactions based on selected sort option
  const sorted = [...filtered].sort((a, b) => {
    if (sortOption === 'amount-asc') return a.amount - b.amount;
    if (sortOption === 'amount-desc') return b.amount - a.amount;
    if (sortOption === 'date-asc') return new Date(a.date) - new Date(b.date);
    if (sortOption === 'date-desc') return new Date(b.date) - new Date(a.date);
    return 0;
  });

  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg p-6">
      <h2 className="text-3xl font-semibold text-[#4B7EFF] opacity-90 mb-6">
        Your Transactions
      </h2>
      <div className="flex gap-4 mb-4">
        <select
          className="bg-gray-700 text-gray-300 px-3 py-1 rounded-md"
          value={filterOption}
          onChange={(e) => setFilterOption(e.target.value)}
        >
          <option value="all">All</option>
          <option value="credit">Only Credit (Income)</option>
          <option value="debit">Only Debit (Expense)</option>
        </select>
        <select
          className="bg-gray-700 text-gray-300 px-3 py-1 rounded-md"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="amount-desc">Amount: High → Low</option>
          <option value="amount-asc">Amount: Low → High</option>
          <option value="date-desc">Date: Newest → Oldest</option>
          <option value="date-asc">Date: Oldest → Newest</option>
        </select>
      </div>

      <div className="space-y-4">
        {sorted.length === 0 ? (
          <p className="text-gray-500">No transactions to show.</p>
        ) : (
          sorted.map((tx) => (
            <div
              key={tx.id}
              className="border border-gray-600 p-4 rounded-xl flex justify-between items-center hover:shadow-lg transition"
            >
              <div>
                {/* Color credit green and debit red */}
                <p className={`font-semibold ${tx.type === 'credit' ? 'text-green-500' : 'text-red-400'}`}>
                  {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">
                    {tx.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {tx.date 
                      ? new Date(tx.date).toLocaleDateString('en-IN', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) 
                      : 'No date'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleDelete(tx.id)}
                className="text-red-600 hover:text-red-400 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}