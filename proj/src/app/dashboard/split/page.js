"use client";
import React, { useState } from "react";

const initialGroups = [
  { 
    id: 1, 
    name: "Trip to Manali", 
    createdBy: "alice@example.com", // Creator's email
    members: [{ name: "Alice", email: "alice@example.com" }, { name: "Bob", email: "bob@example.com" }, { name: "Charlie", email: "charlie@example.com" }, { name: "David", email: "david@example.com" }],
    balance: 200 
  },
  { 
    id: 2, 
    name: "Flatmates 403", 
    createdBy: "frank@example.com", // Creator's email
    members: [{ name: "Eva", email: "eva@example.com" }, { name: "Frank", email: "frank@example.com" }, { name: "Grace", email: "grace@example.com" }],
    balance: -150 
  },
];

export default function Page() {
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [editedBalances, setEditedBalances] = useState({});
  const [groups, setGroups] = useState(initialGroups);
  const [newGroupName, setNewGroupName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [userEmail] = useState("alice@example.com"); // Simulating current logged-in user's email

  const handleExpand = (groupId) => {
    setExpandedGroup((prev) => (prev === groupId ? null : groupId));
  };

  const handleBalanceChange = (groupId, value) => {
    setEditedBalances((prev) => ({ ...prev, [groupId]: value }));
  };

  const handleUpdateBalance = (groupId) => {
    alert(`Updated balance for Group ${groupId} to ₹${editedBalances[groupId]}`);
    // 🔁 Replace with Supabase update logic
  };

  const handleCreateGroup = () => {
    if (newGroupName) {
      const newGroup = {
        id: groups.length + 1,
        name: newGroupName,
        createdBy: userEmail,
        members: [{ name: "You", email: userEmail }],
        balance: 0,
      };
      setGroups((prev) => [...prev, newGroup]);
      setNewGroupName("");
    } else {
      alert("Please enter a group name.");
    }
  };

  const handleAddMember = (groupId) => {
    if (newMemberEmail) {
      setGroups((prev) =>
        prev.map((group) =>
          group.id === groupId
            ? {
                ...group,
                members: [...group.members, { name: "New Member", email: newMemberEmail }],
              }
            : group
        )
      );
      setNewMemberEmail("");
    } else {
      alert("Please enter a member's email.");
    }
  };

  const handleLeaveGroup = (groupId) => {
    setGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? {
              ...group,
              members: group.members.filter((member) => member.email !== userEmail),
            }
          : group
      )
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold text-[#4B7EFF] opacity-90 mb-6 pt-6 text-center">
        Split System
      </h1>

      <div className="p-6 bg-gray-800 text-gray-200 rounded-2xl shadow-lg max-w-4xl mx-auto">
        {/* Group Creation Section */}
        <div className="bg-gray-700 p-6 rounded-2xl shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-[#4B7EFF] opacity-90 mb-4">Create a New Group</h2>
          <div className="flex mb-4">
            <input
              type="text"
              placeholder="Group Name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="w-full p-2 rounded bg-gray-600 text-white placeholder-gray-400"
            />
            <button
              onClick={handleCreateGroup}
              className="ml-4 bg-[#4B7EFF] text-white font-semibold px-6 py-2 rounded hover:bg-[#4B7EFF] transition"
            >
              Create
            </button>
          </div>
        </div>

        {/* Groups Section */}
        <div className="bg-gray-700 p-6 rounded-2xl shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-[#4B7EFF] opacity-90 mb-4">Your Groups</h2>
          <div className="space-y-4">
            {groups.map((group) => {
              const balanceColor = group.balance < 0 ? "text-red-400" : "text-green-400";
              const isExpanded = expandedGroup === group.id;
              const isCreator = group.createdBy === userEmail;

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
                      {/* Show Members and Add Member */}
                      <h3 className="text-gray-300 mb-2">Created by: {group.createdBy}</h3>
                      <h3 className="text-gray-300 mb-2">Members:</h3>
                      <ul className="list-disc pl-6 mb-4">
                        {group.members.map((member, index) => (
                          <li key={index} className="text-gray-400">
                            {member.name} ({member.email})
                          </li>
                        ))}
                      </ul>

                      {/* Add New Member */}
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

                      {/* Update Balance Section */}
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

                      {/* Leave Group Button */}
                      <button
                        onClick={() => handleLeaveGroup(group.id)}
                        className="mt-4 bg-red-600 text-white font-semibold px-6 py-2 rounded hover:bg-red-500 transition"
                      >
                        Leave Group
                      </button>
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
