import Link from 'next/link';

const Sidebar = () => {
  return (
    <div className="w-60 bg-gray-800 text-gray-200 p-7 space-y-8">
      <h2 className="text-2xl font-semibold text-teal-400">Dashboard</h2>
      <ul className="space-y-4">
        {/* Home Link */}
        <li>
          <Link
            href="/"
            className="block py-2 px-4 rounded-lg hover:bg-teal-600 hover:text-white transition duration-200 transform hover:scale-105"
          >
            Home
          </Link>
        </li>
        {/* Other links */}
        <li>
          <Link
            href="/dashboard/transactions"
            className="block py-2 px-4 rounded-lg hover:bg-teal-600 hover:text-white transition duration-200 transform hover:scale-105"
          >
            Transactions
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/budgets"
            className="block py-2 px-4 rounded-lg hover:bg-teal-600 hover:text-white transition duration-200 transform hover:scale-105"
          >
            Budgets
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/reports"
            className="block py-2 px-4 rounded-lg hover:bg-teal-600 hover:text-white transition duration-200 transform hover:scale-105"
          >
            Reports & Insights
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/split"
            className="block py-2 px-4 rounded-lg hover:bg-teal-600 hover:text-white transition duration-200 transform hover:scale-105"
          >
            Split Expenses
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/gamification"
            className="block py-2 px-4 rounded-lg hover:bg-teal-600 hover:text-white transition duration-200 transform hover:scale-105"
          >
            Leaderboard
          </Link>
        </li>
        <li>
          <Link
            href="/"
            className="block py-2 px-4 rounded-lg hover:bg-teal-600 hover:text-white text-red-700 font-semibold transition duration-200 transform hover:scale-105"
          >
            Logout
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
