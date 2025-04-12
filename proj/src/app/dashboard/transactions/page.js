// app/transactions/page.js
'use client';

import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';

export default function TransactionsPage() {
  return (
    <div className="min-h-screen bg-dark-page p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center text-highlight opacity-90">
          Transactions
        </h1>
        <TransactionForm />
        <TransactionList />
      </div>
    </div>
  );
}
