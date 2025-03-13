"use client"
import { useEffect, useState } from 'react';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);

  // Fetch the transactions when the component mounts
  useEffect(() => {
    const fetchTransactions = async () => {
      const response = await fetch('/api/transactions?filter=all');
      const data = await response.json();
      if (data.error) {
        console.error("Error fetching transactions:", data.error);
      } else {
        setTransactions(data);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="container">
      <h1 className="title">Transactions</h1>

      {/* Transactions List */}
      <div className="transactions-list">
        {transactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          transactions.map((transaction) => (
            <div key={transaction.txnid} className="transaction-card">
              <div className="transaction-header">
                <span className="transaction-id">TXN #{transaction.txnid}</span>
                <span
                  className={`transaction-type ${transaction.credit_debit.toLowerCase()}`}
                >
                  {transaction.credit_debit.toUpperCase()}
                </span>
              </div>

              <div className="transaction-body">
                <div className="amount">
                  <strong>Amount: </strong>
                  ${transaction.amount}
                </div>
                <div className="category">
                  <strong>Category: </strong>
                  {transaction.catid}
                </div>
                <div className="timestamp">
                  <strong>Date: </strong>
                  {new Date(transaction.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

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
