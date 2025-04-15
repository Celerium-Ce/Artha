'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/useAuth';
import BudgetForm from './BudgetForm';
import BudgetList from './BudgetList';
import { supabase } from '@/lib/supabaseClient';
import { awardBadgeForAction } from '../gamification/page';

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

  const getAccountID = async () => {
    if (!user || !user.id) return null;
    const { data, error } = await supabase.rpc('get_accountid_by_userid', {
      _userid: user.id,
    });
  
    if (error) {
      console.error("Error fetching account ID:", error);
      return null;
    }

    console.log("data: ",data);
  
    return data;
  };
  

  const fetchBudgets = async () => {
    let accountID = await getAccountID();
    const { data, error } = await supabase.rpc('get_budget_by_account', {
      _accountid: accountID,
    });
  
    console.log(data);
    console.log(accountID);
  
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
    if (!loading && user) {
      console.log(user);
      fetchBudgets();
    }
  }, [loading, user]);

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
        <BudgetForm setBudgets={setBudgets} categories={categories} fetchBudgets={fetchBudgets} getID={getAccountID} />
        <BudgetList budgets={budgets} setBudgets={setBudgets} transactions={[]} />
        {/* After successful budget creation: */}
        {user && (
          <div>
            <button
              onClick={async () => {
                await awardBadgeForAction(user.id, "budget_initiate");
              }}
            >
              Award Badge
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
