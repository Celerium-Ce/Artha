// components/TransactionForm.js
import { useState } from "react";

const categories = ["Salary", "Groceries", "Rent", "Utilities"];

export default function TransactionForm() {
  const [category, setCategory] = useState(categories[0]);
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [tags, setTags] = useState("");
  const [transactionType, setTransactionType] = useState("income"); // Income or Expense

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic
    console.log({ transactionType, category, amount, paymentMethod, tags });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-semibold text-teal-400 opacity-90 mb-4">
        Add Transaction
      </h2>
      <div className="space-y-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-400">Transaction Type</label>
          <select
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
            className="bg-gray-700 border border-gray-500 text-gray-200 rounded-xl p-2 focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-400">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-gray-700 border border-gray-500 text-gray-200 rounded-xl p-2 focus:ring-teal-500 focus:border-teal-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-400">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-gray-700 border border-gray-500 text-gray-200 rounded-xl p-2 focus:ring-teal-500 focus:border-teal-500"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-400">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="bg-gray-700 border border-gray-500 text-gray-200 rounded-xl p-2 focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-400">Tags</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="bg-gray-700 border border-gray-500 text-gray-200 rounded-xl p-2 focus:ring-teal-500 focus:border-teal-500"
          />
        </div>

        <button
          type="submit"
          className="mt-4 bg-teal-500 text-gray-900 rounded-xl py-2 px-4 w-full hover:bg-teal-600 transition-colors"
        >
          Add Transaction
        </button>
      </div>
    </form>
  );
}
