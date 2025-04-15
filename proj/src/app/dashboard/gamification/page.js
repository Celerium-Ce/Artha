"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/useAuth";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import LogoutButton from "../../components/logoutButton";
import { toast, ToastContainer } from "react-toastify";

const badges = [
  "First Steps", "Budget Beginner", "Transaction Logged", "Budget Master"
];

const leaderboard = [
  { name: "Alice", points: 1200 },
  { name: "Bob", points: 1100 },
  { name: "Charlie", points: 950 },
];

// Dummy streak data (✓ for completed, X for missed)
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
  const router = useRouter();
  const [achievementData, setAchievementData] = useState(null);
  
  useEffect(() => {
    if (user) {
      checkAndCreateUserAchievements();
    }
  }, [user]);
  
  const checkAndCreateUserAchievements = async () => {
    if (!user) return;
    
    try {
      // Log the exact UUID format and value
      console.log("User ID type:", typeof user.id);
      console.log("User ID value:", user.id);
      console.log("User ID length:", user.id.length);
      
      // Check if user exists in achievements table
      const { data, error } = await supabase
        .from("Achievements")
        .select("*")
        .eq("userid", user.id);
        
      if (error) {
        console.error("Error checking achievements:", error);
        toast.error(`Error checking: ${error.message}`);
        return;
      }
      
      console.log("Found data:", data);
      
      if (!data || data.length === 0) {
        console.log("No achievement record found, creating new one");
        
        // Create basic record with minimal fields and log the exact values being inserted
        const achievementRecord = {
          userid: user.id,
          points: 0,
          streak: 0
        };
        
        console.log("Attempting to insert record with UUID:", user.id);
        console.log("Full record being inserted:", JSON.stringify(achievementRecord, null, 2));
        
        // Try insertion without returning data first
        const { error: insertError } = await supabase
          .from("Achievements")
          .insert(achievementRecord);
          
        if (insertError) {
          console.error("Insert error details:", insertError);
          console.error("Insert error code:", insertError.code);
          console.error("Insert error hint:", insertError.hint);
          console.error("Insert error details:", insertError.details);
          toast.error(`Insert failed: ${insertError.message}`);
          
          // Additional logging for troubleshooting
          console.log("Checking if User table has this UUID...");
          const { data: userData, error: userError } = await supabase
            .from("User")
            .select("*")
            .eq("userid", user.id);
            
          if (userError) {
            console.error("User check error:", userError);
          } else {
            console.log("User exists in User table:", userData && userData.length > 0);
            if (userData && userData.length > 0) {
              console.log("User data:", userData[0]);
            }
          }
          
          // Try alternative approach with upsert
          console.log("Trying upsert instead...");
          const { error: upsertError } = await supabase
            .from("Achievements")
            .upsert(achievementRecord)
            .select();
              
          if (upsertError) {
            console.error("Upsert also failed:", upsertError);
            toast.error(`All attempts failed: ${upsertError.message}`);
            return;
          }
        }
        
        // Fetch the newly created data regardless of insert/upsert method
        const { data: newData } = await supabase
          .from("Achievements")
          .select("*")
          .eq("userid", user.id)
          .single();
        
        if (newData) {
          console.log("Successfully created achievement record:", newData);
          setAchievementData(newData);
          toast.success("Welcome to your achievement tracker!");
        }
      } else {
        console.log("Using existing achievement data");
        setAchievementData(data[0]);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Unexpected error occurred");
    }
  };
  
  if (loading) return <p className="text-center p-6">Loading...</p>;
  if (!user) {
    router.push("/auth/login");
    return <p className="text-center p-6">Please log in first</p>;
  }
  
  return (
    <div>
      <h1 className="text-3xl font-semibold text-[#4B7EFF] opacity-90 mb-6 pt-6 text-center">Leaderboard</h1>

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