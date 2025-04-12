"use client";
import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from "react";
import './budget.css';

// Component to display list of budgets with delete functionality
function BudgetTable({ accountId, refreshToggle, onBudgetDeleted }) {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBudgets() {
      const { data, error } = await supabase.rpc("get_budget_by_account", { _accountid: accountId });
      if (error) {
        console.error("Error fetching budgets:", error);
        setError(error.message);
      } else {
        setBudgets(data);
      }
      setLoading(false);
    }

    fetchBudgets();
  }, [accountId, refreshToggle]);

  async function handleDelete(budget) {
    // Call the RPC function passing the proper parameters
    const { data, error } = await supabase.rpc("delete_budget_entry", {
      _accountid: accountId,
      _catid: budget.catid,
      _startdate: budget.startdate
    });
    if (error) {
      console.error("Error deleting budget:", error);
      alert("Failed to delete the budget.");
    } else {
      // Notify the parent to refresh the list
      onBudgetDeleted();
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Budget Overview ({budgets.length})</h2>
      {loading ? (
        <p>Loading budgets...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : budgets.length > 0 ? (
        <table className="min-w-full border border-gray-300 bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-2 border-r">Category ID</th>
              <th className="p-2 border-r">Start Date</th>
              <th className="p-2 border-r">End Date</th>
              <th className="p-2 border-r">Target Amount</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {budgets.map((budget, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="p-2 border-r text-center">{budget.catid}</td>
                <td className="p-2 border-r text-center">{budget.startdate}</td>
                <td className="p-2 border-r text-center">{budget.enddate}</td>
                <td className="p-2 border-r text-center">${budget.targetamount}</td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => handleDelete(budget)}
                    className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No budgets found for this account.</p>
      )}
    </div>
  );
}

// Component to add a new budget entry
function AddBudgetForm({ onBudgetAdded, accountId }) {
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    targetAmount: "",
    catID: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Helper function that calls Supabase RPC for adding budget
  async function addBudgetEntry() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.rpc('add_budget_entry', {
      _accountid: accountId,
      _catid: parseInt(formData.catID),
      _startdate: formData.startDate,
      _enddate: formData.endDate,
      _targetamount: parseFloat(formData.targetAmount)
    });
    
    if (error) {
      console.error("Error adding budget:", error);
      setError(error.message);
    } else {
      console.log("Budget added:", data);
      onBudgetAdded(); // Notify parent to refresh list
      setFormData({ startDate: "", endDate: "", targetAmount: "", catID: "" });
    }
    setLoading(false);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    addBudgetEntry();
  };

  return (
    <div className="p-4 border-t mt-4">
      <h3 className="text-lg font-semibold mb-2">Add New Budget</h3>
      {error && <p className="text-red-500 mb-2">Error: {error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          placeholder="Start Date"
          required
          className="p-2 border rounded"
        />
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          placeholder="End Date"
          required
          className="p-2 border rounded"
        />
        <input
          type="number"
          name="targetAmount"
          value={formData.targetAmount}
          onChange={handleChange}
          placeholder="Target Amount"
          required
          className="p-2 border rounded"
        />
        <input
          type="number"
          name="catID"
          value={formData.catID}
          onChange={handleChange}
          placeholder="Category ID"
          required
          className="p-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? "Adding..." : "Add Budget"}
        </button>
      </form>
    </div>
  );
}

// Main Page Header
function Header() {
  return (
    <header className="header p-4 bg-gray-800 text-white flex justify-between items-center">
      <div className="nav-left flex gap-4">
        <a href="#" className="hover:underline">Home</a>
        <a href="#" className="hover:underline">About</a>
        <a href="#" className="hover:underline">Services</a>
      </div>
      <div className="search-bar">
        <input type="text" placeholder="Search..." className="p-1 rounded" />
      </div>
      <div className="nav-right flex gap-4">
        <a href="#" className="hover:underline">Add</a>
        <a href="#" className="hover:underline">Login</a>
      </div>
    </header>
  );
}

// Main Budget Page Component
function BudgetPage() {
  const accountId = 2;  // set your account id here

  // Toggle state to refresh budgets list
  const [refreshToggle, setRefreshToggle] = useState(false);

  // Handler for when a budget is added or deleted
  const handleBudgetUpdated = () => {
    setRefreshToggle(!refreshToggle);
  };

  return (
    <>
      <Header />
      <main className="container mx-auto mt-4">
        <BudgetTable accountId={accountId} refreshToggle={refreshToggle} onBudgetDeleted={handleBudgetUpdated} />
        <AddBudgetForm onBudgetAdded={handleBudgetUpdated} accountId={accountId} />
      </main>
    </>
  );
}

export default BudgetPage;
