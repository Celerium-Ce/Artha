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

  // Step 2: Fetch transactions
  const fetchTransactions = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      console.log("Fetching transactions...");
      
      // Get account ID if we don't have it yet
      const currentAccountId = accountId || await getAccountId();
      
      if (!currentAccountId) {
        console.log("No account ID available");
        setIsLoading(false);
        return;
      }
      
      console.log("Using account ID for transactions:", currentAccountId);
      
      // Direct query to Transaction table - use exact field names from your database
      const { data, error } = await supabase
        .from('Transaction')
        .select('*')
        .eq('accountid', currentAccountId);
      
      if (error) {
        console.error("Error fetching transactions:", error);
        toast.error("Failed to load transactions");
        setIsLoading(false);
        return;
      }
      
      console.log("Raw transactions data:", data);
      
      // Map the data to a consistent format
      const formattedTransactions = Array.isArray(data) ? data.map(item => ({
        id: item.transactionid,
        date: item.transactiondate,
        amount: item.amount,
        description: item.description || '',
        category: item.catid,
        type: item.type
      })) : [];
      
      console.log("Formatted transactions:", formattedTransactions);
      setTransactions(formattedTransactions);
      
      // Award badge if we have transactions
      if (formattedTransactions.length > 0) {
        checkAndAwardExpenseBadge();
      }
    } catch (err) {
      console.error("Error in fetchTransactions:", err);
      toast.error("An error occurred while fetching transactions");
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
  
  // Callback for when a transaction is created
  const handleTransactionCreated = () => {
    console.log("Transaction created, refreshing list");
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
