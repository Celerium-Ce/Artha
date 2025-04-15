'use client';

import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { supabase } from '@/lib/supabaseClient';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [categoryExpenditure, setCategoryExpenditure] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('Category')
      .select('*')
      .order('catid');

    if (error) {
      console.error('Error fetching categories:', error.message);
      alert('Failed to fetch categories');
      return;
    }

    setCategories(data);
    await fetchCategoryExpenditures(data);
    setLoading(false);
  };

  const fetchCategoryExpenditures = async (cats) => {
    const { data, error } = await supabase
      .from('Transaction')
      .select(`
        amount,
        catid,
        credit_debit
      `);

    if (error) {
      console.error('Error fetching transactions:', error.message);
      return;
    }

    // Calculate total expenditure per category
    const expenditures = {};
    cats.forEach(cat => {
      expenditures[cat.catname] = data
        .filter(txn => txn.catid === cat.catid && txn.credit_debit === 'debit')
        .reduce((sum, txn) => sum + txn.amount, 0);
    });

    setCategoryExpenditure(expenditures);
  };

  const addCategory = async () => {
    const trimmedCategory = newCategory.trim();
    
    if (trimmedCategory === '') {
      alert('Please enter a category name');
      return;
    }
  
    // First check if the category name already exists
    const { data: existingCategory, error: checkError } = await supabase
      .from('Category')
      .select('catname')
      .ilike('catname', trimmedCategory)
      .single();
  
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking category:', checkError.message);
      alert('Failed to check if category exists');
      return;
    }
  
    if (existingCategory) {
      alert('A category with this name already exists');
      return;
    }
  
    // Get the maximum catid
    const { data: maxCatData, error: maxError } = await supabase
      .from('Category')
      .select('catid')
      .order('catid', { ascending: false })
      .limit(1)
      .single();
  
    if (maxError) {
      console.error('Error getting max category ID:', maxError.message);
      alert('Failed to create category');
      return;
    }
  
    const nextCatId = (maxCatData?.catid || 0) + 1;
  
    // Insert new category with the next available ID
    const { error: insertError } = await supabase
      .from('Category')
      .insert({ 
        catid: nextCatId,
        catname: trimmedCategory 
      });
  
    if (insertError) {
      console.error('Error adding category:', insertError.message);
      alert('Failed to add category');
      return;
    }
  
    setNewCategory('');
    fetchCategories();
    alert('Category added successfully!');
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Generate random colors for pie chart
  const generateColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const hue = (i * 137.508) % 360; // Use golden angle approximation
      colors.push(`hsl(${hue}, 70%, 60%)`);
    }
    return colors;
  };

  const pieColors = generateColors(categories.length);

  const data = {
    labels: Object.keys(categoryExpenditure),
    datasets: [
      {
        data: Object.values(categoryExpenditure),
        backgroundColor: pieColors,
        hoverBackgroundColor: pieColors,
      },
    ],
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-800 text-gray-200 text-center">
        Loading categories...
      </div>
    );
  }

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
              <th className="px-4 py-2">Total Expenditure</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.catid} className="border-t border-gray-600">
                <td className="px-4 py-2">{category.catid}</td>
                <td className="px-4 py-2">{category.catname}</td>
                <td className="px-4 py-2">
                  ₹{categoryExpenditure[category.catname]?.toLocaleString() || '0'}
                </td>
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

      {Object.keys(categoryExpenditure).length > 0 && (
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
                      style={{ backgroundColor: pieColors[idx] }}
                    ></span>
                    {category}: ₹{amount.toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}