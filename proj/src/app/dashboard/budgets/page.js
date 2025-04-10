"use client"
import { supabase } from '@/lib/supabaseClient';

import { useEffect, useState } from "react";
import './budget.css';

function FetchBudgets() {
  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.from('Budget').select('*');

      if (error) {
        console.error('Error fetching budgets:', error);
      } else {
        console.log('Budget Data:', data);
      }
    }

    fetchData();
  }, []);

  return <h2>Check the console for budget data</h2>;
}
function BudgetTable() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const accountId = 2;

  useEffect(() => {
    async function fetchBudgets() {
      const { data, error } = await supabase.rpc("get_budget_by_account", { _accountid: accountId });
      if (error) {
        console.error("Error fetching budgets:", error);
        setError(error.message);
      } else {
        console.log(data);
        setBudgets(data);
      }
      setLoading(false);
    }

    fetchBudgets();
  }, []);

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
            <th className="p-2">Target Amount</th>
          </tr>
        </thead>
        <tbody>
          {budgets.map((budget, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="p-2 border-r text-center">{budget.catid}</td>
              <td className="p-2 border-r text-center">{budget.startdate}</td>
              <td className="p-2 border-r text-center">{budget.enddate}</td>
              <td className="p-2 text-center">${budget.targetamount}</td>
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

// export default PrintData;

function toggleMenu(){
  console.log("Navigation menu opened");
  alert("Nav");
}

function Header(){
  return (
    <header className="header">
      {/* <div className="menu-icon" onClick={toggleMenu}>☰</div> */}

      <div className="nav-left">
        <a href="#">Home</a>
        <a href="#">About</a>
        <a href="#">Services</a>
      </div>

      <div className="search-bar">
          <input type="text" placeholder="Search..." />
      </div>

      <div className="nav-right">
          <a href="#">Add</a>
          <a href="#">Login</a>
      </div>

    </header>
  );
}

function BudgetPage(){
  return (
    <>
      <Header />
      <BudgetTable />
    </>
  );
}

export default BudgetPage;