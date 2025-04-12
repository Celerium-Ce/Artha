// app/budget/page.js
'use client';

import { useState } from 'react';
import BudgetForm from './BudgetForm';
import BudgetList from './BudgetList';

export default function BudgetPage() {
  const [budgets, setBudgets] = useState([]);
  const categories = ['Food', 'Entertainment', 'Utilities', 'Transport'];

  return (
    <div className="min-h-screen bg-dark-page p-6">
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
