'use client';

import { Trash2 } from 'lucide-react';
import ProgressBar from './ProgressBar'; // Make sure the path is correct based on your project structure

export default function BudgetList({ budgets, setBudgets }) {
  const handleDelete = (id) => {
    const confirmDelete = confirm('Are you sure you want to delete this budget?');
    if (confirmDelete) {
      setBudgets((prev) => prev.filter((b) => b.id !== id));
    }
  };

  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg p-6">
      <h2 className="text-3xl font-semibold text-teal-400 opacity-90 mb-6">
        Your Budgets
      </h2>
      <div className="space-y-4">
        {budgets.length === 0 ? (
          <p className="text-gray-500">No budgets set yet.</p>
        ) : (
          budgets.map((budget) => {
            const spent = budget.spent || 0; // fallback if spent not defined
            return (
              <div
                key={budget.id}
                className="border border-gray-600 p-4 rounded-xl hover:shadow-lg transition duration-300 ease-in-out"
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="font-semibold text-gray-200">
                      {budget.category} • ₹{budget.amount}
                    </p>
                    <p className="text-sm text-gray-400">
                      {budget.startDate} to {budget.endDate}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(budget.id)}
                    className="text-red-600 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <ProgressBar value={spent} max={budget.amount} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
