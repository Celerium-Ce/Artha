"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/useAuth";

export default function Page() {
  const { user, loading } = useAuth();
  const [groups, setGroups] = useState([]);
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [editedBalances, setEditedBalances] = useState({});
  const [newMemberEmail, setNewMemberEmail] = useState("");

  const fetchGroups = async () => {
    // First get all groups where the user is a member
    const { data, error } = await supabase
      .from("GroupExpense")
      .select(`
        groupid,
        createdby,
        User_Group!inner (
          userid,
          balance,
          User (
            userid,
            name,
            email
          )
        ),
        AllMembers:User_Group (
          userid,
          balance,
          User (
            userid,
            name,
            email
          )
        ),
        Creator:User!GroupExpense_createdby_fkey (
          name,
          email
        )
      `)
      .eq("User_Group.userid", user.id);
  
    if (error) {
      console.error("Error fetching groups:", error.message);
      return;
    }
  
    const formattedGroups = data.map((group) => ({
      id: group.groupid,
      name: `Group ${group.groupid}`,
      createdBy: group.createdby,
      creatorName: group.Creator.name,
      creatorEmail: group.Creator.email,
      isCreator: group.createdby === user.id,
      // Use AllMembers instead of User_Group for the complete list
      members: group.AllMembers.map((member) => ({
        id: member.userid,
        name: member.User.name,
        email: member.User.email,
        balance: member.balance,
      })),
      balance: group.AllMembers.reduce((sum, member) => 
        sum + parseFloat(member.balance || 0), 0),
    }));
  
    setGroups(formattedGroups);
  };

  useEffect(() => {
    if (user) fetchGroups();
  }, [user]);

  const handleExpand = (groupId) => {
    setExpandedGroup((prev) => (prev === groupId ? null : groupId));
  };

  const handleBalanceChange = (groupId, value) => {
    setEditedBalances((prev) => ({ ...prev, [groupId]: value }));
  };

  const handleUpdateBalance = async (groupId) => {
    const newBalance = editedBalances[groupId];
    if (!newBalance) {
      alert("Please enter a valid balance.");
      return;
    }

    const { error } = await supabase
      .from("User_Group")
      .update({ balance: newBalance })
      .eq("userid", user.id)
      .eq("groupid", groupId);

    if (error) {
      console.error("Error updating balance:", error.message);
      alert("Failed to update balance.");
      return;
    }

    alert(`Updated balance for Group ${groupId} to ₹${newBalance}`);
    fetchGroups();
  };

  const handleCreateGroup = async () => {
    if (!user || !user.id) {
      alert("User is not authenticated.");
      return;
    }

    const { data: group, error: groupError } = await supabase
      .from("GroupExpense")
      .insert({ createdby: user.id })
      .select()
      .single();

    if (groupError) {
      console.error("Error creating group:", groupError.message);
      alert("Failed to create group.");
      return;
    }

    const { error: memberError } = await supabase
      .from("User_Group")
      .insert({ userid: user.id, groupid: group.groupid, balance: 0 });

    if (memberError) {
      console.error("Error adding user to group:", memberError.message);
      alert("Failed to add user to group.");
      return;
    }

    alert(`Group ${group.groupid} created successfully!`);
    fetchGroups();
  };

  const handleAddMember = async (groupId) => {
    const group = groups.find((g) => g.id === groupId);
    if (!group.isCreator) {
      alert("You are not authorized to add members to this group.");
      return;
    }

    if (!newMemberEmail) {
      alert("Please enter a member's email.");
      return;
    }

    const { data: userToAdd, error: userError } = await supabase
      .from("User")
      .select("userid")
      .eq("email", newMemberEmail)
      .single();

    if (userError) {
      console.error("Error fetching user:", userError.message);
      alert("User not found.");
      return;
    }

    const { error: memberError } = await supabase
      .from("User_Group")
      .insert({ userid: userToAdd.userid, groupid: groupId, balance: 0 });

    if (memberError) {
      console.error("Error adding member to group:", memberError.message);
      alert("Failed to add member to group.");
      return;
    }

    alert("Member added successfully!");
    setNewMemberEmail("");
    fetchGroups();
  };

  const handleRemoveMember = async (groupId, memberId) => {
    const group = groups.find((g) => g.id === groupId);
    if (!group.isCreator) {
      alert("You are not authorized to remove members from this group.");
      return;
    }

    const { error } = await supabase
      .from("User_Group")
      .delete()
      .eq("userid", memberId)
      .eq("groupid", groupId);

    if (error) {
      console.error("Error removing member:", error.message);
      alert("Failed to remove member.");
      return;
    }

    alert("Member removed successfully!");
    fetchGroups();
  };

  const handleLeaveGroup = async (groupId) => {
    const group = groups.find((g) => g.id === groupId);
    if (group.createdBy === user.id) {
      alert("You cannot leave a group that you created.");
      return;
    }

    const { error } = await supabase
      .from("User_Group")
      .delete()
      .eq("userid", user.id)
      .eq("groupid", groupId);

    if (error) {
      console.error("Error leaving group:", error.message);
      alert("Failed to leave group.");
      return;
    }

    alert("You have left the group.");
    fetchGroups();
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;

  return (
    <div>
      <h1 className="text-3xl font-semibold text-[#4B7EFF] opacity-90 mb-6 pt-6 text-center">
        Split System
      </h1>

      <div className="p-6 bg-gray-800 text-gray-200 rounded-2xl shadow-lg max-w-4xl mx-auto">
        <div className="bg-gray-700 p-6 rounded-2xl shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-white opacity-90 mb-4">Create a New Group</h2>
          <button
            onClick={handleCreateGroup}
            className="bg-[#4B7EFF] text-white font-semibold px-6 py-2 rounded hover:bg-[#4B7EFF] transition"
          >
            Create Group
          </button>
        </div>

        <div className="bg-gray-700 p-6 rounded-2xl shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-white opacity-90 mb-4">Your Groups</h2>
          <div className="space-y-4">
            {groups.map((group) => {
              const balanceColor = group.balance < 0 ? "text-red-400" : "text-green-400";
              const isExpanded = expandedGroup === group.id;

              return (
                <div key={group.id} className="bg-gray-600 p-4 rounded-xl">
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => handleExpand(group.id)}
                  >
                    <div>
                      <p className="text-white font-semibold">{group.name}</p>
                      <p className="text-gray-400 text-sm">{group.members.length} members</p>
                    </div>
                    <p className={`font-bold ${balanceColor}`}>₹{group.balance}</p>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 bg-gray-700 p-4 rounded-xl">
                      <h3 className="text-gray-300 mb-2">
                        Created by: {group.creatorName} ({group.creatorEmail})
                      </h3>
                      <h3 className="text-gray-300 mb-2">Members:</h3>
                      <ul className="list-disc pl-6 mb-4">
                        {group.members.map((member, index) => (
                          <li key={index} className="text-gray-400">
                            {member.name} ({member.email})
                            {group.isCreator && member.id !== user.id && (
                              <button
                                onClick={() => handleRemoveMember(group.id, member.id)}
                                className="ml-4 text-red-500 hover:text-red-400"
                              >
                                Remove
                              </button>
                            )}
                          </li>
                        ))}
                      </ul>

                      {group.isCreator && (
                        <div className="flex items-center mb-4">
                          <input
                            type="email"
                            placeholder="Enter new member's email"
                            value={newMemberEmail}
                            onChange={(e) => setNewMemberEmail(e.target.value)}
                            className="w-full p-2 rounded bg-gray-600 text-white placeholder-gray-400"
                          />
                          <button
                            onClick={() => handleAddMember(group.id)}
                            className="ml-4 w-1/3 bg-[#4B7EFF] text-white font-semibold px-6 py-2 rounded hover:bg-[#4B7EFF] transition"
                          >
                            Add Member
                          </button>
                        </div>
                      )}

                      <div className="flex items-center mb-4">
                        <input
                          type="number"
                          placeholder="Enter new balance"
                          value={editedBalances[group.id] || ""}
                          onChange={(e) => handleBalanceChange(group.id, e.target.value)}
                          className="w-full p-2 rounded bg-gray-600 text-white placeholder-gray-400 mr-4"
                        />
                        <button
                          onClick={() => handleUpdateBalance(group.id)}
                          className="w-1/3 bg-[#4B7EFF] text-white font-semibold px-6 py-2 rounded hover:bg-[#4B7EFF] transition"
                        >
                          Update Balance
                        </button>
                      </div>

                      {!group.isCreator && (
                        <button
                          onClick={() => handleLeaveGroup(group.id)}
                          className="mt-4 bg-red-600 text-white font-semibold px-6 py-2 rounded hover:bg-red-500 transition"
                        >
                          Leave Group
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}