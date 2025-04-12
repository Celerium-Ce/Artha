import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";

const mockTransactions = [
  {
    id: 1,
    type: "income",
    category: "Salary",
    amount: 50000,
    date: "2025-04-01T12:00",
    paymentMethod: "Bank Transfer",
  },
  {
    id: 2,
    type: "expense",
    category: "Groceries",
    amount: 3000,
    date: "2025-04-05T14:00",
    paymentMethod: "UPI",
  },
];

export default function TransactionList() {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [sortOption, setSortOption] = useState("date-desc");
  const [filterOption, setFilterOption] = useState("all");

  // State to track if the component has mounted on the client
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true when the component has mounted on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDelete = (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this?");
    if (confirmDelete) {
      setTransactions(transactions.filter((t) => t.id !== id));
    }
  };

  const filtered = transactions.filter((tx) => {
    if (filterOption === "all") return true;
    return tx.type === filterOption;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortOption === "amount-asc") return a.amount - b.amount;
    if (sortOption === "amount-desc") return b.amount - a.amount;
    if (sortOption === "date-asc") return new Date(a.date) - new Date(b.date);
    if (sortOption === "date-desc") return new Date(b.date) - new Date(a.date);
    return 0;
  });

  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-3xl font-semibold text-teal-400 opacity-90">
          Your Transactions
        </h2>
        <div className="flex gap-4">
          <select
            className="bg-gray-700 text-gray-300 px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
          >
            <option value="all">All</option>
            <option value="income">Only Credit</option>
            <option value="expense">Only Debit</option>
          </select>

          <select
            className="bg-gray-700 text-gray-300 px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="amount-desc">Amount: High → Low</option>
            <option value="amount-asc">Amount: Low → High</option>
            <option value="date-desc">Date: Newest → Oldest</option>
            <option value="date-asc">Date: Oldest → Newest</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {sorted.length === 0 ? (
          <p className="text-gray-500">No transactions to show.</p>
        ) : (
          sorted.map((tx) => (
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
                  {/* Only format the date on the client side */}
                  {isClient ? new Date(tx.date).toLocaleString() : null} • {tx.paymentMethod}
                </p>
              </div>
              <button
                onClick={() => handleDelete(tx.id)}
                className="text-red-600 hover:text-red-400 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}