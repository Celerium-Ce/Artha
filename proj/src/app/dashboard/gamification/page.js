"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../context/useAuth";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import LogoutButton from "../../components/logoutButton";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Replace static badges with detailed badge definitions
const badgeDefinitions = [
  { id: "first_step", name: "First Step", description: "Logged into the app for the first time" },
  { id: "budget_initiate", name: "Budget Initiate", description: "Created your first budget" },
  { id: "expense_tracker", name: "Expense Tracker", description: "Logged your first expense" },
  { id: "insight_seeker", name: "Insight Seeker", description: "Viewed your first financial report" },
  { id: "daily_streaker", name: "Daily Streaker", description: "Checked in for 7 consecutive days" },
  { id: "consistency_champ", name: "Consistency Champ", description: "Maintained a budget streak for 30 days" },
  { id: "legacy_keeper", name: "Legacy Keeper", description: "Maintained your budget streak for a full year" }
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
  const [hasCheckedStreak, setHasCheckedStreak] = useState(false);
  const streakCheckedRef = useRef(false);

  // Check for and award badges based on current achievements
  const checkAndAwardBadges = async (currentAchievements) => {
    if (!user || !currentAchievements) return;

    let badgesToAward = [];
    let currentBadges = currentAchievements.badges || [];

    // Helper to check if user already has a badge
    const hasBadge = (badgeId) =>
      Array.isArray(currentBadges) &&
      currentBadges.includes(badgeId);

    // First Step badge - always awarded on first login
    if (!hasBadge("first_step")) {
      badgesToAward.push("first_step");
    }

    // Daily Streaker - awarded for 7 consecutive days
    if (!hasBadge("daily_streaker") && currentAchievements.streak >= 7) {
      badgesToAward.push("daily_streaker");
    }

    // Consistency Champ - awarded for 30 consecutive days
    if (!hasBadge("consistency_champ") && currentAchievements.streak >= 30) {
      badgesToAward.push("consistency_champ");
    }

    // Legacy Keeper - awarded for 365 consecutive days
    if (!hasBadge("legacy_keeper") && currentAchievements.streak >= 365) {
      badgesToAward.push("legacy_keeper");
    }

    // If we have badges to award, update the database
    if (badgesToAward.length > 0) {
      console.log("Awarding new badges:", badgesToAward);

      // Make sure currentBadges is always an array
      if (!Array.isArray(currentBadges)) {
        currentBadges = [];
      }

      // Add to current badges
      const newBadges = [...currentBadges, ...badgesToAward];

      // Update in database
      const { error } = await supabase
        .from("Achievements")
        .update({ badges: newBadges })
        .eq("userid", user.id);

      if (error) {
        console.error("Error updating badges:", error);
        return;
      }

      // Update local state
      setAchievementData({
        ...currentAchievements,
        badges: newBadges
      });

      // Show toast for each new badge
      badgesToAward.forEach(badgeId => {
        const badge = badgeDefinitions.find(b => b.id === badgeId);
        if (badge) {
          toast.success(`🏆 New Badge: ${badge.name}!`);
        }
      });
    }
  };

  useEffect(() => {
    // Only run if user exists and we haven't checked already THIS SESSION
    if (user && !streakCheckedRef.current) {
      // Mark as checked for this browser session
      streakCheckedRef.current = true;
      // Also set the state variable to prevent duplicate effect runs
      setHasCheckedStreak(true);

      const initializeData = async () => {
        await checkAndCreateUserAchievements();
        await updateStreakOnLoad();
      };

      initializeData();
    }
  }, [user]);

  // Separate function that only runs on page load (doesn't show toasts)
  const updateStreakOnLoad = async () => {
    if (!user) return;

    try {
      console.log("Checking streak on page load for user:", user.id);

      const { data, error } = await supabase
        .from("Achievements")
        .select("*")
        .eq("userid", user.id)
        .single();

      if (error || !data) {
        console.error("Error or no data when checking streak on load:", error);
        return;
      }

      // Get today's date WITHOUT time
      const today = new Date();
      const todayDateOnly = today.toISOString().split('T')[0]; // YYYY-MM-DD

      // Get last activity date WITHOUT time
      const lastActivityDate = data.logdate ? new Date(data.logdate) : null;
      const lastActivityDateOnly = lastActivityDate ?
        lastActivityDate.toISOString().split('T')[0] : null;

      console.log("Today's date:", todayDateOnly);
      console.log("Last logged date:", lastActivityDateOnly);

      // If last activity was today, don't update anything
      if (lastActivityDateOnly === todayDateOnly) {
        console.log("Already logged in today - not updating streak");
        setAchievementData(data);
        return; // Exit early - no need to update
      }

      // Get yesterday's date
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayDateOnly = yesterday.toISOString().split('T')[0];

      let newStreak = data.streak || 1;
      let shouldUpdate = false;

      // Check if last activity was EXACTLY yesterday
      if (lastActivityDateOnly === yesterdayDateOnly) {
        // Last activity was yesterday, increment streak
        newStreak = (data.streak || 0) + 1;
        shouldUpdate = true;
        console.log("Last activity was yesterday - incrementing streak to:", newStreak);
      } else if (lastActivityDateOnly && lastActivityDateOnly !== todayDateOnly) {
        // Last activity was some other day (not today, not yesterday)
        // Reset streak
        newStreak = 1;
        shouldUpdate = true;
        console.log("Streak broken - resetting to 1");
      }

      if (shouldUpdate) {
        // Update database without showing toasts
        const { error: updateError } = await supabase
          .from("Achievements")
          .update({
            streak: newStreak,
            logdate: new Date().toISOString()
          })
          .eq("userid", user.id);

        if (updateError) {
          console.error("Error updating streak on load:", updateError);
          return;
        }

        // Update local state
        const updatedData = {
          ...data,
          streak: newStreak,
          logdate: new Date().toISOString()
        };

        setAchievementData(updatedData);

        // Check if user earned streak-based badges
        checkAndAwardBadges(updatedData);
      } else {
        // Just set the data without updating
        setAchievementData(data);

        // Still check for badges they might have earned but not received
        checkAndAwardBadges(data);
      }

    } catch (err) {
      console.error("Error in updateStreakOnLoad:", err);
    }
  };

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

        // Create basic record with minimal fields and add logdate
        const achievementRecord = {
          userid: user.id,
          points: 0,
          badges: ["first_step"], // Start with First Step badge automatically
          streak: 1,  // Start with streak of 1 for first visit
          logdate: new Date().toISOString()  // Initialize with current date
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
          toast.success("Welcome to your achievement tracker! Your streak starts today.");
          toast.success("🏆 New Badge: First Step! You've logged in for the first time.");
        }
      } else {
        console.log("Using existing achievement data");
        setAchievementData(data[0]);

        // Check for badges they may have earned but not received yet
        checkAndAwardBadges(data[0]);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Unexpected error occurred");
    }
  };

  const updateStreak = async () => {
    if (!user) return;

    try {
      console.log("Updating streak for user:", user.id);

      // Get current achievement data
      const { data, error } = await supabase
        .from("Achievements")
        .select("*")
        .eq("userid", user.id)
        .single();

      if (error) {
        console.error("Error fetching achievements:", error);
        toast.error("Could not update streak: " + error.message);
        return;
      }

      if (!data) {
        console.log("No achievement record found, creating one with initial streak");
        await checkAndCreateUserAchievements();
        return;
      }

      // Get dates in YYYY-MM-DD format to ignore time portion
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];

      // Parse logdate as UTC then convert to YYYY-MM-DD
      const lastActivityDate = data.logdate ? new Date(data.logdate) : null;
      const lastActivityStr = lastActivityDate ? lastActivityDate.toISOString().split('T')[0] : null;

      console.log("Today's date:", todayStr);
      console.log("Last activity date:", lastActivityStr);

      // Compare as Date objects to get accurate day difference
      const todayObj = new Date(todayStr);
      const lastActivityObj = lastActivityStr ? new Date(lastActivityStr) : null;

      // Calculate day difference properly
      let diffDays = null;
      if (lastActivityObj) {
        // Get time difference in milliseconds and convert to days
        const diffTime = todayObj.getTime() - lastActivityObj.getTime();
        diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        console.log("Days since last activity (rounded):", diffDays);
      }

      let newStreak = 1; // Default to 1 if reset or first time

      if (diffDays === 1) {
        // Last activity was yesterday, increment streak
        newStreak = (data.streak || 0) + 1;
        console.log("Streak continued! New streak:", newStreak);
      } else if (diffDays === 0) {
        // Already logged in today, keep current streak
        newStreak = data.streak || 1;
        console.log("Already logged today. Maintaining streak:", newStreak);
      } else {
        // Streak broken (more than 1 day passed)
        console.log("Streak reset to 1 (previous: " + (data.streak || 0) + ")");
      }

      // Get the current timestamp in a consistent format
      const nowTimestamp = new Date().toISOString();
      console.log("Updating logdate to:", nowTimestamp);

      // Update the achievement record
      const { error: updateError, data: updateData } = await supabase
        .from("Achievements")
        .update({
          streak: newStreak,
          logdate: nowTimestamp
        })
        .eq("userid", user.id)
        .select();

      if (updateError) {
        console.error("Error updating streak:", updateError);
        toast.error("Could not update streak: " + updateError.message);
        return;
      }

      console.log("Database update result:", updateData);

      // Update local state with the updated data
      const updatedData = {
        ...data,
        streak: newStreak,
        logdate: nowTimestamp
      };

      setAchievementData(updatedData);

      if (diffDays === 1) {
        toast.success(`Streak increased to ${newStreak}! 🔥`);
      } else if (diffDays === 0) {
        toast.info(`You've already logged in today. Streak: ${newStreak}`);
      } else {
        toast.info(`Welcome back! New streak started.`);
      }

      // Check for badges after updating streak
      checkAndAwardBadges(updatedData);

    } catch (err) {
      console.error("Error updating streak:", err);
      toast.error("An unexpected error occurred");
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

        {/* Check In Button */}
        <div className="text-center mb-6">
          <button
            onClick={updateStreak}
            className="px-4 py-2 bg-[#4B7EFF] text-white rounded-lg hover:bg-opacity-90 transition-all"
          >
            Check In Today
          </button>
        </div>

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

        {/* Badges Section - Updated to show earned/unearned status */}
        <div className="bg-gray-700 p-6 rounded-2xl shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-white opacity-90 mb-4">Your Badges</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {badgeDefinitions.map((badge) => {
              const earned = achievementData?.badges?.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`${earned ? 'bg-gray-600' : 'bg-gray-800'} p-4 rounded-xl border ${earned ? 'border-[#4B7EFF]' : 'border-gray-700'} hover:bg-gray-700 transition`}
                >
                  <div className={`w-16 h-16 ${earned ? 'bg-[#4B7EFF]' : 'bg-gray-700'} rounded-full mx-auto mb-2 flex items-center justify-center`}>
                    {earned ? (
                      <span className="text-2xl">🏆</span>
                    ) : (
                      <span className="text-2xl opacity-30">🔒</span>
                    )}
                  </div>
                  <p className="text-center text-sm font-medium mb-1 text-white">{badge.name}</p>
                  <p className="text-center text-xs text-gray-400">{badge.description}</p>
                </div>
              );
            })}
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

// Function to be exported and used in other pages to award badges
export const awardBadgeForAction = async (userId, badgeId) => {
  if (!userId || !badgeId) return false;

  try {
    // Get current achievements
    const { data, error } = await supabase
      .from("Achievements")
      .select("*")
      .eq("userid", userId)
      .single();

    if (error || !data) {
      console.error("Error fetching achievements for badge award:", error);
      return false;
    }

    const currentBadges = Array.isArray(data.badges) ? data.badges : [];

    // If user already has this badge, do nothing
    if (currentBadges.includes(badgeId)) {
      return true; // Already has badge
    }

    // Add the badge
    const newBadges = [...currentBadges, badgeId];

    // Update the database
    const { error: updateError } = await supabase
      .from("Achievements")
      .update({ badges: newBadges })
      .eq("userid", userId);

    if (updateError) {
      console.error("Error updating badges:", updateError);
      return false;
    }

    // Find badge details for potential toast
    const badge = badgeDefinitions.find(b => b.id === badgeId);
    console.log(`🏆 Badge awarded: ${badge?.name || badgeId}`);

    return true;
  } catch (err) {
    console.error("Error awarding badge:", err);
    return false;
  }
};