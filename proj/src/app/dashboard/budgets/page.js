'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import BudgetForm from './BudgetForm';
import BudgetList from './BudgetList';

const catName = async (id) => {
  const { data, error } = await supabase.rpc('get_category_name', { _catid: id });
  if (error) {
    console.error('Error fetching category name:', error.message);
    return 'Unknown'; // fallback
  }
  return data;
};



export default function BudgetPage() {
  const [budgets, setBudgets] = useState([]);
  const categories = ['Food', 'Entertainment', 'Utilities', 'Transport'];

  const fetchBudgets = async () => {
    const accountID = 2;
    const { data, error } = await supabase.rpc('get_budget_by_account', {
      _accountid: accountID,
    });
  
    console.log(data);
  
    if (error) {
      console.error('Error fetching budgets:', error.message);
      return;
    }
    const enrichedBudgets = await Promise.all(
      data.map(async (item) => {
        const category = await catName(item.catid);
        return {
          id: item.budgetid, // fallback key
          accountID: item.accountid,
          startDate: item.startdate,
          endDate: item.enddate,
          amount: item.targetamount,
          catID: item.catid,
          category,
          spent: 0, // Placeholder
        };
      })
    );
    setBudgets(enrichedBudgets);
  }

  useEffect(() => {   
    fetchBudgets();
  }, []);

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
          Budget Management
        </h1>
        <BudgetForm setBudgets={setBudgets} categories={categories} fetchBudgets={fetchBudgets} />
        <BudgetList budgets={budgets} setBudgets={setBudgets} transactions={[]} />
      </div>
    </div>
  );
}
