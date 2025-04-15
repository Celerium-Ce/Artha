'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

const badgeOptions = [
  'First Steps', 'Budget Beginner', 'Transaction Logged',
  'Budget Master', 'Expense Tracker', 'Minimalist',
  'Smart Saver', 'Investor Mindset', 'Wealth Builder',
  'Daily Tracker', 'Money Master', 'Streak Legend',
  'Big Spender', 'Debt Free', 'Financial Freedom'
];

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [selectedBadge, setSelectedBadge] = useState('');
  const [targetEmail, setTargetEmail] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('Achievements')
      .select(`
        points,
        streak,
        badges,
        User (
          userid,
          email,
          name
        )
      `)
      .order('points', { ascending: false });

    if (error) {
      console.error('Error fetching leaderboard:', error.message);
      alert('Failed to fetch leaderboard');
      return;
    }

    const formattedUsers = data.map(achievement => ({
      userid: achievement.User.userid,
      userEmail: achievement.User.email,
      userName: achievement.User.name,
      points: achievement.points || 0,
      streak: achievement.streak || 0,
      badges: achievement.badges || []
    }));

    setUsers(formattedUsers);
    setLoading(false);
  };

  // ...existing code...

  useEffect(() => {
    fetchLeaderboard();
  
    // Set up real-time subscription
    const channel = supabase
      .channel('custom-all-channel')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events
          schema: 'public',
          table: 'Achievements'
        },
        async (payload) => {
          console.log('Change received:', payload);
          
          // Fetch the updated user data immediately
          const { data, error } = await supabase
            .from('Achievements')
            .select(`
              points,
              streak,
              badges,
              User (
                userid,
                email,
                name
              )
            `)
            .eq('userid', payload.new.userid)
            .single();
  
          if (error) {
            console.error('Error fetching updated user:', error);
            return;
          }
  
          // Update the specific user in the state
          setUsers(currentUsers => {
            const updatedUsers = [...currentUsers];
            const userIndex = updatedUsers.findIndex(u => u.userid === payload.new.userid);
            
            if (userIndex !== -1) {
              updatedUsers[userIndex] = {
                userid: data.User.userid,
                userEmail: data.User.email,
                userName: data.User.name,
                points: data.points || 0,
                streak: data.streak || 0,
                badges: data.badges || []
              };
  
              // Re-sort by points
              updatedUsers.sort((a, b) => b.points - a.points);
            }
            
            return updatedUsers;
          });
        }
      )
      .subscribe();
  
    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

// ...existing code...

  const awardBadge = async () => {
    if (!targetEmail || !selectedBadge) {
      alert('Please select both email and badge');
      return;
    }

    // First get the user's ID from their email
    const { data: userData, error: userError } = await supabase
      .from('User')
      .select('userid')
      .eq('email', targetEmail)
      .single();

    if (userError) {
      console.error('Error finding user:', userError.message);
      alert('User not found');
      return;
    }

    // Get current badges
    const { data: achievementData, error: achievementError } = await supabase
      .from('Achievements')
      .select('badges')
      .eq('userid', userData.userid)
      .single();

    if (achievementError) {
      console.error('Error fetching achievements:', achievementError.message);
      alert('Failed to fetch current badges');
      return;
    }

    const currentBadges = achievementData.badges || [];
    if (currentBadges.includes(selectedBadge)) {
      alert('User already has this badge');
      return;
    }

    // Update badges
    const { error: updateError } = await supabase
      .from('Achievements')
      .update({ 
        badges: [...currentBadges, selectedBadge],
        points: achievementData.points + 10 // Award points for new badge
      })
      .eq('userid', userData.userid);

    if (updateError) {
      console.error('Error awarding badge:', updateError.message);
      alert('Failed to award badge');
      return;
    }

    setTargetEmail('');
    setSelectedBadge('');
    alert('Badge awarded successfully!');
  };

  const resetStreak = async (userId) => {
    const confirmed = window.confirm('Are you sure you want to reset this user\'s streak?');
    if (!confirmed) return;

    const { error } = await supabase
      .from('Achievements')
      .update({ streak: 0 })
      .eq('userid', userId);

    if (error) {
      console.error('Error resetting streak:', error.message);
      alert('Failed to reset streak');
      return;
    }

    alert('Streak reset successfully');
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-800 text-gray-200 text-center">
        Loading leaderboard...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-800 text-gray-200 rounded-2xl border-none shadow-none max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold text-white opacity-90 mb-6 text-center">Leaderboard</h2>

      <div className="bg-gray-700 p-6 rounded-2xl mb-6">
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr className="text-gray-300">
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Points</th>
              <th className="px-4 py-2">Badges</th>
              <th className="px-4 py-2">Streak</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.userid} className="border-t border-gray-600">
                <td className="px-4 py-2">
                  {user.userName}<br/>
                  <span className="text-gray-400 text-xs">{user.userEmail}</span>
                </td>
                <td className="px-4 py-2">{user.points}</td>
                <td className="px-4 py-2">
                  <ul className="list-disc list-inside">
                    {user.badges.map((badge, index) => (
                      <li key={index}>{badge}</li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-2">{user.streak}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => resetStreak(user.userid)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500 transition"
                  >
                    Reset Streak
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-700 p-6 rounded-2xl">
        <h3 className="text-xl font-semibold text-white opacity-90 mb-4">Award Badge</h3>
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <input
            type="email"
            placeholder="Enter user email"
            value={targetEmail}
            onChange={(e) => setTargetEmail(e.target.value)}
            className="w-full p-2 rounded bg-gray-600 text-white placeholder-gray-400"
          />
          <select
            value={selectedBadge}
            onChange={(e) => setSelectedBadge(e.target.value)}
            className="w-full p-2 rounded bg-gray-600 text-white"
          >
            <option value="">Select Badge</option>
            {badgeOptions.map((badge, index) => (
              <option key={index} value={badge}>
                {badge}
              </option>
            ))}
          </select>
          <button
            onClick={awardBadge}
            className="bg-[#4B7EFF] text-white font-semibold px-6 py-2 rounded hover:bg-[#4B7EFF] transition"
          >
            Award Badge
          </button>
        </div>
      </div>
    </div>
  );
}