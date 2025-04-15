'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/useAuth';
import BudgetForm from './BudgetForm';
import BudgetList from './BudgetList';
import { supabase } from '@/lib/supabaseClient';

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
  const { user, loading } = useAuth();

  const fetchBudgets = async () => {
    let accountID = await supabase.rpc('get_accountid_by_userid',{
      _userid: user._userid,
    })
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
