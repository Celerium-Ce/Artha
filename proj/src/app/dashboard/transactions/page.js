"use client"

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/useAuth';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import { awardBadgeForAction } from '../gamification/page';

export default function TransactionsPage() {
  const handleExpenseLogging = async (user) => {
    // After successful expense logging:
    await awardBadgeForAction(user.id, "expense_tracker");
  };

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
        <TransactionForm onExpenseLogged={handleExpenseLogging} />
        <TransactionList />
      </div>
    </div>
  );
}
