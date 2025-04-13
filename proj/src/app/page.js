const HomePage = () => {
  return (
    <div className="bg-gray-900 text-center text-gray-200 p-8 space-y-8">
      <h1 className="text-5xl font-extrabold text-teal-400 mb-6">Welcome to Artha</h1>
      <p className="text-lg text-gray-400 max-w-3xl mx-auto">
        Your Personal Finance Manager. Track, analyze, and optimize your expenses with ease.
      </p>

      {/* Features Section */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Feature 1 */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
          <h3 className="text-2xl font-semibold text-teal-400">Track Transactions</h3>
          <p className="mt-4 text-gray-300">
            Easily log and categorize your daily transactions. Stay on top of your income and expenses.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
          <h3 className="text-2xl font-semibold text-teal-400">Set Budgets</h3>
          <p className="mt-4 text-gray-300">
            Set monthly budgets, monitor your spending, and make smarter financial decisions.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
          <h3 className="text-2xl font-semibold text-teal-400">Insights & Reports</h3>
          <p className="mt-4 text-gray-300">
            Gain valuable insights into your financial habits with detailed reports and graphs.
          </p>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="mt-16 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} Artha - All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default HomePage;
