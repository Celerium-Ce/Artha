'use client';

import React, { useState, useEffect } from 'react';

export default function Category() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchedCategories = [
      { catID: 1, catName: 'Food', totalExpenditure: 5000, subcategory: 'Groceries', expenseType: 'Essential' },
      { catID: 2, catName: 'Entertainment', totalExpenditure: 2000, subcategory: 'Movies', expenseType: 'Non-Essential' },
    ];
    setCategories(fetchedCategories);
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold text-teal-400 opacity-90 mb-4">Categories</h2>
      <table className="min-w-full bg-gray-800 text-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Category ID</th>
            <th className="px-4 py-2 text-left">Category</th>
            <th className="px-4 py-2 text-left">Total Expenditure</th>
            <th className="px-4 py-2 text-left">Subcategory</th>
            <th className="px-4 py-2 text-left">Expense Type</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.catID}>
              <td className="px-4 py-2">{category.catID}</td>
              <td className="px-4 py-2">{category.catName}</td>
              <td className="px-4 py-2">₹{category.totalExpenditure}</td>
              <td className="px-4 py-2">{category.subcategory}</td>
              <td className="px-4 py-2">{category.expenseType}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
