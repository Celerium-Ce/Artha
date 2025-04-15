'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/useAuth';
import BudgetForm from './BudgetForm';
import BudgetList from './BudgetList';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
// Remove the direct import from gamification page to avoid potential circular dependencies

const catName = async (id) => {
  const { data, error } = await supabase.rpc('get_category_name', { _catid: id });
  if (error) {
    console.error('Error fetching category name:', error.message);
    return 'Unknown'; // fallback
  }
  return data;
};

// Create a utility function to award badges directly
const awardBudgetBadge = async (userId) => {
  try {
    // Get current achievements
    const { data, error } = await supabase
      .from("Achievements")
      .select("badges, points")
      .eq("userid", userId)
      .single();
      
    if (error) {
      console.error("Error fetching achievements:", error);
      return;
    }
    
    // If no achievements record found
    if (!data) {
      console.log("No achievements record found");
      return;
    }
    
    // Check if user already has the badge
    const currentBadges = Array.isArray(data.badges) ? data.badges : [];
    if (currentBadges.includes("budget_initiate")) {
      return; // Already has badge
    }
    
    // Add the badge and points
    const newBadges = [...currentBadges, "budget_initiate"];
    const currentPoints = data.points || 0;
    const newPoints = currentPoints + 75; // Budget Initiate badge is worth 75 points
    
    // Update the database
    const { error: updateError } = await supabase
      .from("Achievements")
      .update({ 
        badges: newBadges,
        points: newPoints
      })
      .eq("userid", userId);
      
    if (updateError) {
      console.error("Error updating badges and points:", updateError);
      return;
    }
    
    toast.success("🏆 New Badge: Budget Initiate! +75 points");
    console.log("Budget badge awarded with 75 points");
    
  } catch (err) {
    console.error("Error awarding budget badge:", err);
  }
};

export default function BudgetPage() {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const { user, loading } = useAuth();

  // New function to fetch categories
  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('Category')
      .select('catname')
      .order('catid');

    if (error) {
      console.error('Error fetching categories:', error.message);
      return;
    }

    // Extract category names from the response
    const categoryNames = data.map(cat => cat.catname);
    setCategories(categoryNames);
  };

  // Update useEffect to fetch both budgets and categories
  useEffect(() => {
    if (!loading && user) {
      fetchBudgets();
      fetchCategories(); // Add this line
    }
  }, [loading, user]);


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

  // Function to pass to BudgetForm that will be called after budget creation
  const handleBudgetCreated = async () => {
    await fetchBudgets(); // Update the budgets list
    
    if (user) {
      await awardBudgetBadge(user.id);
    }
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
        <ToastContainer /> {/* Make sure this is added */}
      </div>
    </div>
  );
}
