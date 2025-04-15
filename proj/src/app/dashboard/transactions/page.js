"use client"

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/useAuth';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const { user, loading } = useAuth();

  const fetchTransactions = async () => {
    const accountid = 12; // TODO: Dynamically use selected account later

    const { data, error } = await supabase
      .from('Transaction')
      .select(`
        txnid,
        amount,
        transactionWhen,
        credit_debit,
        Category(catname)
      `)
      .eq('accountid', accountid)
      .order('transactionWhen', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error.message);
      return;
    }

    setTransactions(data);
  };

  useEffect(() => {
    if (user) fetchTransactions();
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Please log in to view your transactions.</p>;

  return (
    <div
      className="min-h-screen p-6"
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)',
      }}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center text-highlight opacity-90">
          Transactions
        </h1>
        <TransactionForm fetchTransactions={fetchTransactions} />
        <TransactionList
          transactions={transactions}
          setTransactions={setTransactions}  // Pass setTransactions to TransactionList
        />
      </div>
    </div>
  );
}
