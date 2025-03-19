"use client"
import { supabase } from '@/lib/supabaseClient';

// export async function getBudgets() {
//     const { data, error } = await supabase.from('Budget').select('*');
  
//     if (error) {
//       console.error('Error fetching budgets:', error);
//       return null;
//     }
  
//     return data;
// }

// ////


// import { useEffect, useState } from 'react';
// import { getBudgets } from '../utils/budgetAPI'; // Adjust path if needed

// export default function BudgetList() {
//   const [budgets, setBudgets] = useState([]);

//   useEffect(() => {
//     async function fetchBudgets() {
//       const data = await getBudgets();
//       if (data) setBudgets(data);
//     }
//     fetchBudgets();
//   }, []);

//   return (
//     <div>
//       <h2>Budgets</h2>
//       <ul>
//         {budgets.map((budget) => (
//           <li key={budget.budgetID}>
//             Budget ID: {budget.budgetID}, Target: {budget.targetAmount}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }



// export async function addBudget(accountID, startDate, endDate, targetAmount, catID) {
//     const { data, error } = await supabase.from('Budget').insert([
//       { accountID, startDate, endDate, targetAmount, catID }
//     ]);
  
//     if (error) {
//       console.error('Error inserting budget:', error);
//       return null;
//     }
  
//     return data;
// }



import { useEffect } from 'react';

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

function PrintData(){
    return (
        <>
            <FetchBudgets></FetchBudgets>
        </>
    );
}

export default PrintData;



//////////












// // "use client";

// // import React, { useState } from 'react';

// // const BudgetPage = () => {
// //     const [amount, setAmount] = useState(100);

// //     return (
// //         <div className="container">
// //             <h2>Currency Converter</h2>
// //             <form>
// //                 <div className="amount">
// //                     <p>Enter Amount</p>
// //                     <input 
// //                         value={amount} 
// //                         onChange={(e) => setAmount(e.target.value)} 
// //                         type="text" 
// //                     />
// //                 </div>
// //                 <div className="dropdown">
// //                     <div className="from">
// //                         <p>From</p>
// //                         <div className="selectContainer">
// //                             <img src="https://flagsapi.com/US/flat/64.png" alt="From Country" />
// //                             <select name="From"></select>
// //                         </div>
// //                     </div>
// //                     <i className="fa-solid fa-arrow-right-arrow-left"></i>
// //                     <div className="to">
// //                         <p>To</p>
// //                         <div className="selectContainer">
// //                             <img src="https://flagsapi.com/IN/flat/64.png" alt="To Country" />
// //                             <select name="To"></select>
// //                         </div>
// //                     </div>
// //                 </div>
// //                 <div className="msg">
// //                     <p id="result">Input your query</p>
// //                 </div>
// //                 <button type="button" id="btn">Get Exchange Rate</button>
// //             </form>
// //         </div>
// //     );
// // };

// // export default BudgetPage;

// "use client";

// import React, { useState } from "react";

// const BudgetPage = () => {
//     const [budgets, setBudgets] = useState([]);
//     const [savingsGoals, setSavingsGoals] = useState([]);
//     const [category, setCategory] = useState("food");
//     const [budgetAmount, setBudgetAmount] = useState(0);
//     const [spentAmount, setSpentAmount] = useState(0);
//     const [goalAmount, setGoalAmount] = useState(0);
//     const [deadline, setDeadline] = useState("");

//     const addBudget = () => {
//         const newBudget = { category, budgetAmount, spentAmount };
//         setBudgets([...budgets, newBudget]);
//     };

//     const addSavingsGoal = () => {
//         const newGoal = { goalAmount, deadline, saved: 0 };
//         setSavingsGoals([...savingsGoals, newGoal]);
//     };

//     return (
//         <div className="min-h-screen bg-gray-100 p-6">
//             <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
//                 <h2 className="text-xl font-bold mb-4">Budget & Savings Goals Management</h2>
                
//                 {/* Budget Section */}
//                 <div className="mb-6">
//                     <h3 className="text-lg font-semibold">Set Your Budget</h3>
//                     <label className="block mt-2">Category:</label>
//                     <select className="w-full border p-2 rounded" onChange={(e) => setCategory(e.target.value)}>
//                         <option value="food">Food</option>
//                         <option value="entertainment">Entertainment</option>
//                         <option value="transport">Transport</option>
//                     </select>
                    
//                     <label className="block mt-2">Budget Amount ($):</label>
//                     <input type="number" className="w-full border p-2 rounded" onChange={(e) => setBudgetAmount(parseFloat(e.target.value))} />
                    
//                     <label className="block mt-2">Amount Spent ($):</label>
//                     <input type="number" className="w-full border p-2 rounded" onChange={(e) => setSpentAmount(parseFloat(e.target.value))} />
                    
//                     <button onClick={addBudget} className="mt-3 bg-blue-500 text-white py-2 px-4 rounded">Set Budget</button>
//                 </div>
                
//                 {/* Display Budgets */}
//                 {budgets.map((b, index) => {
//                     const progress = (b.spentAmount / b.budgetAmount) * 100;
//                     return (
//                         <div key={index} className="mt-4 p-4 bg-gray-200 rounded">
//                             <p><strong>{b.category}</strong> - Budget: ${b.budgetAmount}, Spent: ${b.spentAmount}</p>
//                             <div className="w-full bg-gray-300 rounded h-5">
//                                 <div className={`h-5 ${progress > 100 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${Math.min(progress, 100)}%` }}></div>
//                             </div>
//                             {progress > 100 && <p className="text-red-500 font-bold">⚠️ Budget exceeded!</p>}
//                         </div>
//                     );
//                 })}
                
//                 {/* Savings Goal Section */}
//                 <div className="mt-6">
//                     <h3 className="text-lg font-semibold">Set Savings Goal</h3>
//                     <label className="block mt-2">Target Amount ($):</label>
//                     <input type="number" className="w-full border p-2 rounded" onChange={(e) => setGoalAmount(parseFloat(e.target.value))} />
                    
//                     <label className="block mt-2">Deadline:</label>
//                     <input type="date" className="w-full border p-2 rounded" onChange={(e) => setDeadline(e.target.value)} />
                    
//                     <button onClick={addSavingsGoal} className="mt-3 bg-green-500 text-white py-2 px-4 rounded">Save Goal</button>
//                 </div>
                
//                 {/* Display Savings Goals */}
//                 {savingsGoals.map((goal, index) => {
//                     return (
//                         <div key={index} className="mt-4 p-4 bg-gray-200 rounded">
//                             <p><strong>Goal:</strong> Save ${goal.goalAmount} by {goal.deadline}</p>
//                             <div className="w-full bg-gray-300 rounded h-5">
//                                 <div className="h-5 bg-blue-500" style={{ width: "50%" }}></div>
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// };

// // export default BudgetPage;
