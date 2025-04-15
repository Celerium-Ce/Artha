"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/useAuth";
import { supabase } from "../../../lib/supabaseClient";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const badges = [
  "First Steps", "Budget Beginner", "Transaction Logged", "Budget Master"
];

const leaderboard = [
  { name: "Alice", points: 1200 },
  { name: "Bob", points: 1100 },
  { name: "Charlie", points: 950 },
];

const streakData = [
  { day: "Mon", completed: true },
  { day: "Tue", completed: true },
  { day: "Wed", completed: false },
  { day: "Thu", completed: true },
  { day: "Fri", completed: true },
  { day: "Sat", completed: true },
  { day: "Sun", completed: true },
];

export default function GamificationPage() {
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState(null);
  const [achievementData, setAchievementData] = useState(null);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  
  // Removed automatic account creation
  // Now will be triggered by button click
  
  const checkAndCreateAccount = async () => {
    if (!user) return;
    
    setIsCreatingAccount(true);
    
    try {
      console.log("Checking if user has an account...", user.id);
      
      // Check if user has an account
      const { data: accountData, error: accountError } = await supabase
        .from("Account")
        .select("*")
        .eq("userid", user.id);
        
      if (accountError) {
        console.error("Error checking account:", accountError);
        toast.error(`Error checking account: ${accountError.message}`);
        setIsCreatingAccount(false);
        return;
      }
      
      console.log("Account check result:", accountData);
      
      if (!accountData || accountData.length === 0) {
        console.log("No account found, creating default account for user:", user.id);
        
        // Create an account object for better logging
        const newAccount = {
          
        };
        
        console.log("Attempting to insert:", newAccount);
        
        // Create default account with detailed response handling
        const response = await supabase.from("Account").insert([newAccount]);
        
        // Log the entire response
        console.log("Insert response:", response);
        
        const { error: profileError } = response;
        
        if (profileError) {
          console.error("Error creating account:", profileError);
          toast.error(`Account creation failed: ${profileError.message}`);
          setIsCreatingAccount(false);
          return;
        }
        
        // Double-check if the account was created by querying again
        const { data: checkData } = await supabase
          .from("Account")
          .select("*")
          .eq("userid", user.id);
          
        if (checkData && checkData.length > 0) {
          console.log("Verified account creation:", checkData);
          toast.success("Default account created for you!");
        } else {
          console.log("Account insertion seemed to succeed but account not found in subsequent query");
          toast.warning("Account may not have been created properly");
        }
      } else {
        console.log("Account exists:", accountData);
        toast.info("You already have an account!");
      }
      
      // Also fetch achievement data
      const { data: achievements, error: achievementError } = await supabase
        .from("Achievements")
        .select("*")
        .eq("userid", user.id)
        .single();
        
      if (!achievementError && achievements) {
        setAchievementData(achievements);
      }
      
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("An unexpected error occurred: " + err.message);
    } finally {
      setIsCreatingAccount(false);
    }
  };
  
  if (loading) return <p className="text-center p-6">Loading...</p>;
  if (!user) return <p className="text-center p-6">Please log in first</p>;
  
  return (
    <div>
      <h1 className="text-3xl font-semibold text-[#4B7EFF] opacity-90 mb-6 pt-6 text-center">Leaderboard</h1>

      {/* Account Creation Button */}
      <div className="text-center mb-6">
        <button
          onClick={checkAndCreateAccount}
          disabled={isCreatingAccount}
          className="px-6 py-3 rounded-lg bg-[#4B7EFF] text-white font-medium hover:bg-opacity-90 transition-all duration-200"
        >
          {isCreatingAccount ? "Creating Account..." : "Create Default Account"}
        </button>
      </div>

      <div className="p-6 bg-gray-800 text-gray-200 rounded-2xl shadow-lg max-w-4xl mx-auto">

        {/* Streak Section */}
        <div className="bg-gray-700 p-6 rounded-2xl shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-white opacity-90 mb-2">Your Streak</h2>
          <p className="text-2xl font-bold text-white">🔥 {achievementData?.streak || 0}-day streak</p>
          <p className="text-gray-400 mt-1 text-sm">Keep it going by logging your activity daily!</p>
        </div>

        {/* Points Section */}
        <div className="bg-gray-700 p-6 rounded-2xl shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-white opacity-90">Your Points</h2>
          <p className="text-3xl font-bold mt-2 text-white">{achievementData?.points || 0}</p>
        </div>

        {/* Badges Section */}
        <div className="bg-gray-700 p-6 rounded-2xl shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-white opacity-90 mb-4">Your Badges</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {badges.map((badge) => (
              <div
                key={badge}
                className="bg-gray-600 p-4 rounded-xl border border-gray-500 hover:bg-gray-500 transition"
              >
                <div className="w-16 h-16 bg-gray-500 rounded-full mx-auto mb-2">
                  <img src="/badge.png" alt="badge" className="w-full h-full object-cover rounded-full" />
                </div>
                <p className="text-center text-sm text-gray-400">{badge}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="bg-gray-700 p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold text-white opacity-90 mb-4">Leaderboard</h2>
          <ul className="divide-y divide-gray-600">
            {leaderboard.map((user, index) => (
              <li key={user.name} className="flex justify-between py-2">
                <span className="text-gray-300">{index + 1}. {user.name}</span>
                <span className="font-semibold text-white">{user.points} pts</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
