'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/useAuth';
import BudgetForm from './BudgetForm';
import BudgetList from './BudgetList';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Remove the direct import from gamification page to avoid potential circular dependencies

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
  
  // Check if user has achievement and award it if not
  const checkAndAwardBudgetBadge = async () => {
    if (!user) return;
    
    try {
      // First, check if user has an achievements record
      const { data, error } = await supabase
        .from("Achievements")
        .select("badges")
        .eq("userid", user.id)
        .single();
        
      if (error) {
        console.error("Error checking achievements:", error);
        return;
      }
      
      // If no achievements record or no badges array, create achievements record
      if (!data || !data.badges) {
        console.log("No achievements record found");
        return; // User needs to visit gamification page first
      }
      
      // Check if user already has the badge
      if (Array.isArray(data.badges) && !data.badges.includes("budget_initiate")) {
        // User doesn't have the badge, award it
        const newBadges = [...data.badges, "budget_initiate"];
        
        const { error: updateError } = await supabase
          .from("Achievements")
          .update({ badges: newBadges })
          .eq("userid", user.id);
          
        if (updateError) {
          console.error("Error awarding badge:", updateError);
          return;
        }
        
        toast.success("🏆 New Badge: Budget Initiate! You've created your first budget.");
      }
    } catch (err) {
      console.error("Error in badge check:", err);
    }
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
    
    // If budgets exist now, check and award the badge
    if (enrichedBudgets.length > 0) {
      checkAndAwardBudgetBadge();
    }
  }

  useEffect(() => {
    if (!loading && user) {
      console.log(user);
      fetchBudgets();
    }
  }, [loading, user]);

  // Function to pass to BudgetForm that will be called after budget creation
  const handleBudgetCreated = async () => {
    await fetchBudgets(); // Update the budgets list
    await checkAndAwardBudgetBadge(); // Check and award the badge
  };

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
        <BudgetForm 
          setBudgets={setBudgets} 
          categories={categories} 
          fetchBudgets={handleBudgetCreated} // Use the new handler that also awards badges
          getID={getAccountID} 
        />
        <BudgetList budgets={budgets} setBudgets={setBudgets} transactions={[]} />
        {/* Removed the test button */}
      </div>
    </div>
  );
}
