'use client';

import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [categoryExpenditure, setCategoryExpenditure] = useState({});

  useEffect(() => {
    const fetchedCategories = [
      { catid: 1, catname: 'Food' },
      { catid: 2, catname: 'Entertainment' },
      { catid: 3, catname: 'Salary' },
    ];
    setCategories(fetchedCategories);

    const expenditures = {
      Food: 2000,
      Entertainment: 1500,
      Salary: 5000,
    };
    setCategoryExpenditure(expenditures);
  }, []);

  const addCategory = () => {
    if (newCategory.trim() !== '') {
      const newcatid = categories.length + 1;
      setCategories((prev) => [
        ...prev,
        { catid: newcatid, catname: newCategory },
      ]);
      setNewCategory('');
    }
  };

  const data = {
    labels: Object.keys(categoryExpenditure),
    datasets: [
      {
        data: Object.values(categoryExpenditure),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-800 text-gray-200 rounded-2xl border-none shadow-none max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold text-white opacity-90 mb-6 text-center">Categories</h2>

      <div className="bg-gray-700 p-6 rounded-2xl mb-6">
        <h3 className="text-xl font-semibold text-white opacity-90 mb-4">View All Categories</h3>
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr className="text-gray-300">
              <th className="px-4 py-2">Category ID</th>
              <th className="px-4 py-2">Category Name</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.catid} className="border-t border-gray-600">
                <td className="px-4 py-2">{category.catid}</td>
                <td className="px-4 py-2">{category.catname}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-700 p-6 rounded-2xl mb-6">
        <h3 className="text-xl font-semibold text-white opacity-90 mb-4">Add New Category</h3>
        <div className="flex items-center">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter new category name"
            className="w-full p-2 rounded bg-gray-600 text-white placeholder-gray-400"
          />
          <button
            onClick={addCategory}
            className="ml-4 bg-[#4B7EFF] text-white font-semibold px-6 py-2 rounded hover:bg-[#4B7EFF] transition"
          >
            Add Category
          </button>
        </div>
      </div>

      <div className="bg-gray-700 p-6 rounded-2xl mb-6">
        <h3 className="text-xl font-semibold text-white opacity-90 mb-4">Category-Wise Expenditure</h3>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <div className="w-48 h-48">
            <Pie data={data} options={{ plugins: { legend: { display: false } } }} />
          </div>
          <div>
            <ul className="text-sm space-y-2 text-gray-300">
              {Object.entries(categoryExpenditure).map(([category, amount], idx) => (
                <li key={category}>
                  <span
                    className="inline-block w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: data.datasets[0].backgroundColor[idx] }}
                  ></span>
                  {category}: ₹{amount}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
