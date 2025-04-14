'use client';

import { useState } from 'react';
import { useAuth } from '@/context/useAuth';
import BudgetForm from './BudgetForm';
import BudgetList from './BudgetList';

export default function BudgetPage() {
  const [budgets, setBudgets] = useState([]);
  const categories = ['Food', 'Entertainment', 'Utilities', 'Transport'];
  const { user, loading } = useAuth();

  console.log(user);
  if (loading) return <p>Loading...</p>;

  if (!user) return <p>Please log in to view your budgets.</p>;

  return (
    <div
      className="min-h-screen p-6"
      style={{
        backgroundColor: 'var(--background)', // Reference to the global background variable
        color: 'var(--foreground)', // Reference to the global foreground variable
      }}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center text-highlight opacity-90">
          Budget Management
        </h1>
        <BudgetForm setBudgets={setBudgets} categories={categories} />
        <BudgetList budgets={budgets} setBudgets={setBudgets} transactions={[]} />
      </div>
    </div>
  );
}
