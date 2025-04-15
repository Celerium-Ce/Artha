"use client"

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/useAuth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';

export default function TransactionsPage() {
  const { user, loading } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [accountId, setAccountId] = useState(null);
  const [filterOption, setFilterOption] = useState("all");

  // Step 1: Get the account ID
  const getAccountId = async () => {
    if (!user) return null;
    
    try {
      console.log("Getting account ID for user:", user.id);
      
      // Direct query to Account table
      const { data, error } = await supabase
        .from('Account')
        .select('accountid')
        .eq('userid', user.id)
        .single();
      
      if (error) {
        console.error("Error fetching account ID:", error);
        toast.error("Failed to get account information");
        return null;
      }
      
      const id = data?.accountid;
      console.log("Account ID retrieved:", id);
      setAccountId(id);
      return id;
    } catch (err) {
      console.error("Error in getAccountId:", err);
      return null;
    }
  };

  // Alternative approach - separate queries
  const fetchTransactions = async () => {
    if (!accountId) return;
    
    setIsLoading(true);
    try {
      // 1. First get transactions
      const { data: txData, error: txError } = await supabase
        .from('Transaction')
        .select('*')
        .eq('accountid', accountId)
        .order('transactionwhen', { ascending: false });
      
      if (txError) {
        console.error("Error fetching transactions:", txError);
        toast.error("Could not load your transactions");
        setIsLoading(false);
        return;
      }
      
      if (!txData || txData.length === 0) {
        setTransactions([]);
        setIsLoading(false);
        return;
      }
      
      // 2. Get all categories in one query
      const catIds = [...new Set(txData.map(tx => tx.catid))];
      const { data: catData, error: catError } = await supabase
        .from('Category')
        .select('catid, catname')
        .in('catid', catIds);
      
      if (catError) {
        console.error("Error fetching categories:", catError);
      }
      
      // 3. Create a lookup map
      const categoryMap = {};
      if (catData) {
        catData.forEach(cat => {
          categoryMap[cat.catid] = cat.catname;
        });
      }
      
      // 4. Format transactions with category names
      const formattedTransactions = txData.map(tx => ({
        id: tx.txnid,
        amount: tx.amount,
        date: tx.transactionwhen,
        type: tx.credit_debit,
        category: categoryMap[tx.catid] || `Category ${tx.catid}`
      }));
      
      setTransactions(formattedTransactions);
    } catch (err) {
      console.error("Error in fetchTransactions:", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Step 3: Badge award function
  const checkAndAwardExpenseBadge = async () => {
    if (!user) return;
    
    try {
      console.log("Checking if user qualifies for expense badge");
      
      // Check for existing achievements
      const { data, error } = await supabase
        .from("Achievements")
        .select("badges, points")
        .eq("userid", user.id)
        .single();
      
      if (error) {
        console.error("Error checking achievements:", error);
        return;
      }
      
      // Exit if no achievements record or already has badge
      if (!data || !data.badges) {
        console.log("No achievements record found");
        return;
      }
      
      const currentBadges = Array.isArray(data.badges) ? data.badges : [];
      
      if (currentBadges.includes("expense_tracker")) {
        console.log("User already has expense tracker badge");
        return;
      }
      
      console.log("Awarding expense tracker badge");
      
      // Award the badge and add points
      const newBadges = [...currentBadges, "expense_tracker"];
      const currentPoints = data.points || 0;
      const newPoints = currentPoints + 75; // 75 points for Expense Tracker badge
      
      const { error: updateError } = await supabase
        .from("Achievements")
        .update({ 
          badges: newBadges,
          points: newPoints 
        })
        .eq("userid", user.id);
        
      if (updateError) {
        console.error("Error awarding badge:", updateError);
        return;
      }
      
      toast.success("🏆 New Badge: Expense Tracker! +75 points");
      console.log("Expense tracker badge awarded successfully with 75 points");
      
    } catch (err) {
      console.error("Error in checkAndAwardExpenseBadge:", err);
    }
  };
  
  // Step 4: Initialize on component mount
  useEffect(() => {
    if (!loading && user) {
      console.log("Component mounted, initializing with user:", user.id);
      getAccountId().then(() => fetchTransactions());
    }
  }, [loading, user]);
  
  const updateAccountBalance = async (transactionAmount, transactionType) => {
    if (!accountId || !user) return;
    
    try {
      console.log("Updating account balance for transaction:", {
        amount: transactionAmount,
        type: transactionType
      });
      
      // First get current account balance
      const { data: accountData, error: accountError } = await supabase
        .from('Account')
        .select('balance')
        .eq('accountid', accountId)
        .single();
        
      if (accountError) {
        console.error("Error fetching account balance:", accountError);
        toast.error("Failed to update account balance");
        return;
      }
      
      // Calculate new balance based on transaction type
      const currentBalance = accountData.balance || 0;
      let newBalance = currentBalance;
      
      if (transactionType === 'credit') {
        newBalance = currentBalance + parseInt(transactionAmount, 10);
      } else if (transactionType === 'debit') {
        newBalance = currentBalance - parseInt(transactionAmount, 10);
      }
      
      console.log("Balance update:", {
        currentBalance,
        newBalance,
        difference: newBalance - currentBalance
      });
      
      // Update account with new balance
      const { error: updateError } = await supabase
        .from('Account')
        .update({ balance: newBalance })
        .eq('accountid', accountId);
        
      if (updateError) {
        console.error("Error updating account balance:", updateError);
        toast.error("Failed to update account balance");
        return;
      }
      
      console.log("Account balance updated successfully to:", newBalance);
      
    } catch (err) {
      console.error("Error in updateAccountBalance:", err);
      toast.error("An error occurred while updating balance");
    }
  };

  const handleTransactionCreated = (amount, type) => {
    console.log("Transaction created, updating balance and refreshing list");
    
    // Update the balance
    updateAccountBalance(amount, type);
    
    // Refresh the transactions list
    fetchTransactions();
  };

  if (loading) return <p className="text-center p-6">Loading...</p>;
  if (!user) return <p className="text-center p-6">Please log in to view transactions.</p>;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center mb-6">
          Transactions
        </h1>
        
        <TransactionForm 
          accountId={accountId}
          onSuccess={handleTransactionCreated}
          user={user}
        />

        <div className="flex justify-end mb-4">
          <select
            className="bg-gray-700 text-gray-300 px-3 py-1 rounded-md"
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
          >
            <option value="all">All</option>
            <option value="credit">Only Credit (Income)</option>
            <option value="debit">Only Debit (Expense)</option>
          </select>
        </div>
        
        {isLoading ? (
          <p className="text-center">Loading transactions...</p>
        ) : (
          <TransactionList 
            transactions={transactions}
            onUpdate={fetchTransactions}
          />
        )}
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}
