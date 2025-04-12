'use client';

import React, { useState, useEffect } from 'react';

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const fetchedAccounts = [
      { accountID: 1, accountName: 'Main Account', accountType: 'Checking', balance: 5000 },
      { accountID: 2, accountName: 'Savings Account', accountType: 'Savings', balance: 15000 },
    ];
    setAccounts(fetchedAccounts);
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold text-teal-400 opacity-90 mb-4">Accounts</h2>
      <table className="min-w-full bg-gray-800 text-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Account ID</th>
            <th className="px-4 py-2 text-left">Account Name</th>
            <th className="px-4 py-2 text-left">Account Type</th>
            <th className="px-4 py-2 text-left">Balance</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.accountID}>
              <td className="px-4 py-2">{account.accountID}</td>
              <td className="px-4 py-2">{account.accountName}</td>
              <td className="px-4 py-2">{account.accountType}</td>
              <td className="px-4 py-2">₹{account.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
