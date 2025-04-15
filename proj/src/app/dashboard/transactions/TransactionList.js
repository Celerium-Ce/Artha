'use client';

import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export default function TransactionList({ accountid, transactions, setTransactions }) {
  const [sortOption, setSortOption] = useState('date-desc');
  const [filterOption, setFilterOption] = useState('all');

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!accountid) return;

      // Query transactions directly via SQL
      const { data, error } = await supabase
        .from('Transaction') // Replace with your actual table name
        .select('txnid, accountid, amount, timestamp, catid, credit_debit')
        .eq('accountid', accountid);

      if (error) {
        console.error('Error fetching transactions:', error.message);
        return;
      }

      // Map the data to your required format
      const formatted = data.map((tx) => ({
        id: tx.txnid,
        accountid: tx.accountid,
        amount: tx.amount,
        date: tx.timestamp,
        catid: tx.catid,
        type: tx.credit_debit === 'credit' ? 'income' : 'expense',
      }));

      setTransactions(formatted);
    };

    fetchTransactions();
  }, [accountid, setTransactions]);  // Add setTransactions as a dependency

  const handleDelete = async (txnid) => {
    console.log('Attempting to delete transaction with txnid:', txnid); // Log txnid for debugging
    
    // Ensure txnid is valid
    if (!txnid) {
      console.error('Transaction ID is invalid:', txnid);
      alert('Invalid transaction ID.');
      return;
    }
  
    const confirmed = window.confirm('Are you sure you want to delete this transaction? This will affect associated data.');
    if (confirmed) {
      // Delete from database (Supabase)
      const { error } = await supabase
        .from('Transaction')  // Ensure you're targeting the correct table name (case-sensitive)
        .delete()
        .eq('txnid', txnid);  // Use txnid to delete the transaction with that ID
  
      if (error) {
        console.error('Error deleting transaction:', error.message);
        alert('Failed to delete the transaction.');
        return;
      }
  
      // Optionally, remove it from your local state (UI) as well
      setTransactions((prev) => prev.filter((transaction) => transaction.txnid !== txnid));
  
      alert('Transaction deleted successfully!');
    }
  };
  
  const filtered = transactions.filter((tx) => {
    if (filterOption === 'all') return true;
    return tx.type === filterOption;
  });

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
          <option value="income">Only Credit</option>
          <option value="expense">Only Debit</option>
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
                <p className="font-semibold text-gray-200">
                  {tx.type === 'income' ? '+' : '-'}₹{tx.amount}
                </p>
                <p className="text-sm text-gray-400">{new Date(tx.date).toLocaleString()}</p>
              </div>
              <button
                onClick={() => handleDelete(tx.txnid)}  // Pass txnid here
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
y