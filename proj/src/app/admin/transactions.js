'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [transactionType, setTransactionType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [threshold, setThreshold] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('Transaction')
        .select(`
          txnid,
          accountid,
          amount,
          credit_debit,
          transactionwhen,
          Category (
            catid,
            catname
          )
        `)
        .order('transactionwhen', { ascending: false });

      if (error) throw error;

      setTransactions(data);
      setFilteredTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Error loading transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();

    // Set up real-time subscription
    const channel = supabase
      .channel('admin-transactions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Transaction'
        },
        (payload) => {
          console.log('Change received:', payload);
          fetchTransactions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filterTransactions = () => {
    let filtered = [...transactions];

    if (transactionType) {
      filtered = filtered.filter(txn => txn.credit_debit === transactionType);
    }

    if (startDate && endDate) {
      filtered = filtered.filter(txn => {
        const txnDate = new Date(txn.transactionwhen).toISOString().split('T')[0];
        return txnDate >= startDate && txnDate <= endDate;
      });
    }

    if (threshold) {
      filtered = filtered.filter(txn => txn.amount >= parseFloat(threshold));
    }

    setFilteredTransactions(filtered);
  };

  const handleDelete = async (txnid) => {
    const confirmed = confirm('Are you sure you want to delete this transaction?');
    if (confirmed) {
      try {
        const { error } = await supabase
          .from('Transaction')
          .delete()
          .eq('txnid', txnid);

        if (error) throw error;

        toast.success('Transaction deleted successfully');
        // Real-time subscription will handle the update
      } catch (error) {
        console.error('Error deleting transaction:', error);
        toast.error('Error deleting transaction');
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-200">
        Loading transactions...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-800 text-gray-200 rounded-2xl border-none shadow-none max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold text-white opacity-90 mb-6 text-center">
        Transactions Management
      </h2>

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
              placeholder="Amount Threshold"
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
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Account</th>
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
                  No transactions found.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((txn) => (
                <tr key={txn.txnid} className="border-t border-gray-600">
                  <td className="px-4 py-2">{txn.txnid}</td>
                  <td className="px-4 py-2">{txn.accountid}</td>
                  <td className="px-4 py-2">
                    {new Date(txn.transactionwhen).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">₹{txn.amount.toLocaleString()}</td>
                  <td className="px-4 py-2">{txn.credit_debit}</td>
                  <td className="px-4 py-2">{txn.Category.catname}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDelete(txn.txnid)}
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
      <ToastContainer />
    </div>
  );
}