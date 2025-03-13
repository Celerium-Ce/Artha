"use client";
import { useEffect, useState } from "react";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("debit");
  const [accountID, setAccountID] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [message, setMessage] = useState("");
  const [viewSection, setViewSection] = useState("add"); // State to track the current section
  const [deletingTxnId, setDeletingTxnId] = useState(null); // State to track the transaction to delete

  // Fetch the transactions when the component mounts
  useEffect(() => {
    const fetchTransactions = async () => {
      const response = await fetch("/api/transactions?filter=all");
      const data = await response.json();
      if (data.error) {
        console.error("Error fetching transactions:", data.error);
      } else {
        setTransactions(data);
      }
    };

    fetchTransactions();
  }, []);

  // Handle adding a transaction
  const handleAddTransaction = async (e) => {
    e.preventDefault();

    const newTransaction = {
      amount: parseInt(amount),
      catid: parseInt(category),
      credit_debit: type,
      accountid: parseInt(accountID),
      timestamp: timestamp || new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTransaction),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Error adding transaction:", data.error || "Unknown error");
        setMessage("Failed to add transaction.");
      } else {
        setTransactions([...transactions, data]);
        setAmount("");
        setCategory("");
        setAccountID("");
        setType("debit");
        setTimestamp("");
        setMessage("Transaction added successfully!");
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
      setMessage("Failed to add transaction.");
    }
  };

  // Handle deleting a transaction
  const handleDeleteTransaction = async (txnId) => {
    const confirmed = window.confirm("Are you sure you want to delete this transaction?");
    if (!confirmed) return;

    try {
        const res = await fetch(`/api/transactions?txnid=${txnId}`, {
            method: "DELETE",
          });

      if (res.ok) {
        // Remove the deleted transaction from the state
        setTransactions(transactions.filter((txn) => txn.txnid !== txnId));
        setMessage("Transaction deleted successfully!");
      } else {
        const data = await res.json();
        setMessage(data.error || "Failed to delete transaction.");
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      setMessage("Failed to delete transaction.");
    }
  };

  return (
    <div className="container">
      <h1 className="title">Transactions</h1>

      {/* Buttons to toggle between Add and View sections */}
      <div className="toggle-buttons">
        <button onClick={() => setViewSection("add")}>Add Transaction</button>
        <button onClick={() => setViewSection("view")}>View Transactions</button>
      </div>

      {/* Conditionally render the sections based on viewSection state */}
      {viewSection === "add" && (
        <div className="section">
          <div className="transaction-form">
            <h2>Add Transaction</h2>
            <form onSubmit={handleAddTransaction}>
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Category ID"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
              <select value={type} onChange={(e) => setType(e.target.value)} required>
                <option value="debit">Debit</option>
                <option value="credit">Credit</option>
              </select>
              <input
                type="number"
                placeholder="Account ID"
                value={accountID}
                onChange={(e) => setAccountID(e.target.value)}
                required
              />
              <input
                type="datetime-local"
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
              />
              <button type="submit">Add Transaction</button>
            </form>
            {message && <p>{message}</p>}
          </div>
        </div>
      )}

      {viewSection === "view" && (
        <div className="section">
          <div className="transactions-list">
            {transactions.length === 0 ? (
              <p>No transactions found.</p>
            ) : (
              transactions.map((transaction) => {
                if (!transaction || !transaction.txnid) {
                  return null; // Skip rendering this item if txnid is missing
                }
                return (
                  <div key={transaction.txnid} className="transaction-card">
                    <div className="transaction-header">
                      <span className="transaction-id">TXN #{transaction.txnid}</span>
                      <span
                        className={`transaction-type ${transaction.credit_debit.toLowerCase()}`}
                      >
                        {transaction.credit_debit.toUpperCase()}
                      </span>
                      <button
                        onClick={() => handleDeleteTransaction(transaction.txnid)}
                        className="delete-btn"
                      >
                        🗑️
                      </button>
                    </div>

                    <div className="transaction-body">
                      <div className="amount">
                        <strong>Amount: </strong>${transaction.amount}
                      </div>
                      <div className="category">
                        <strong>Category: </strong>{transaction.catid}
                      </div>
                      <div className="timestamp">
                        <strong>Date: </strong>
                        {new Date(transaction.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .title {
          text-align: center;
          font-size: 2.5rem;
          color: #333;
          margin-bottom: 30px;
        }

        .toggle-buttons {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }

        .toggle-buttons button {
          margin: 0 10px;
          padding: 10px 20px;
          background-color: #4caf50;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .toggle-buttons button:hover {
          background-color: #45a049;
        }

        .section {
          margin-bottom: 50px;
        }

        .transaction-form {
          margin-bottom: 30px;
        }

        .transaction-form input,
        .transaction-form select,
        .transaction-form button {
          width: 100%;
          padding: 10px;
          margin: 10px 0;
          border: 1px solid #ccc;
          border-radius: 5px;
        }

        .transaction-form button {
          background-color: #4caf50;
          color: #fff;
          border: none;
        }

        .transaction-form button:hover {
          background-color: #45a049;
        }

        .transactions-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .transaction-card {
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          padding: 20px;
          transition: transform 0.3s ease-in-out;
        }

        .transaction-card:hover {
          transform: translateY(-5px);
        }

        .transaction-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .transaction-id {
          font-size: 1.1rem;
          font-weight: bold;
          color: #333;
        }

        .transaction-type {
          font-size: 1.1rem;
          font-weight: bold;
          padding: 5px 10px;
          border-radius: 5px;
          text-transform: uppercase;
          color: #fff;
        }

        .debit {
          background-color: #ff6b6b;
        }

        .credit {
          background-color: #4caf50;
        }

        .transaction-body {
          display: flex;
          flex-direction: column;
        }

        .transaction-body > div {
          margin-bottom: 10px;
        }

        .amount,
        .category,
        .timestamp {
          font-size: 1rem;
          color: #666;
        }

        .amount strong,
        .category strong,
        .timestamp strong {
          color: #333;
        }

        .delete-btn {
          background: none;
          border: none;
          color: red;
          font-size: 1.5rem;
          cursor: pointer;
        }

        .delete-btn:hover {
          color: #d9534f;
        }

        @media (max-width: 768px) {
          .transaction-card {
            padding: 15px;
          }

          .title {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
}
