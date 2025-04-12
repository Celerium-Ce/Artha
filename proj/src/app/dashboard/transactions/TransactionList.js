// components/TransactionList.js
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react"; // lucide-react for icons

const mockTransactions = [
  {
    id: 1,
    type: "income",
    category: "Salary",
    amount: 50000,
    date: "2025-04-01",
    paymentMethod: "Bank Transfer",
    tags: "monthly, april",
  },
  {
    id: 2,
    type: "expense",
    category: "Groceries",
    amount: 3000,
    date: "2025-04-05",
    paymentMethod: "UPI",
    tags: "vegetables, food",
  },
];

export default function TransactionList() {
  const [transactions, setTransactions] = useState(mockTransactions);

  const handleDelete = (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this?");
    if (confirmDelete) {
      setTransactions(transactions.filter((t) => t.id !== id));
    }
  };

  const handleEdit = (transaction) => {
    console.log("Edit clicked", transaction);
    // You can lift this to parent or open a modal with prefilled form
  };

  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg p-6">
      <h2 className="text-3xl font-semibold text-teal-400 opacity-90 mb-6">
        Your Transactions
      </h2>
      <div className="space-y-4">
        {transactions.length === 0 ? (
          <p className="text-gray-500">No transactions yet.</p>
        ) : (
          transactions.map((tx) => (
            <div
              key={tx.id}
              className="border border-gray-600 p-4 rounded-xl flex justify-between items-center hover:shadow-lg transition duration-300 ease-in-out"
            >
              <div>
                <p className="font-semibold text-gray-200">
                  {tx.category} • {tx.type === "income" ? "+" : "-"}₹
                  {tx.amount}
                </p>
                <p className="text-sm text-gray-400">
                  {tx.date} • {tx.paymentMethod} • #{tx.tags}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(tx)}
                  className="text-teal-400 hover:text-teal-300 transition-colors"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(tx.id)}
                  className="text-red-600 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
