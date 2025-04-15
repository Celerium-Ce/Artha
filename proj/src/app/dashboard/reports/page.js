"use client";
import { useState, useEffect } from "react";
import { Pie, Bar } from "react-chartjs-2";
import { CSVLink } from "react-csv";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useAuth } from "@/context/useAuth";
import { supabase } from "@/lib/supabaseClient";
import { toast, ToastContainer } from "react-toastify";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement);

// Add a direct implementation to award the badge
const awardInsightBadge = async (userId) => {
  try {
    // Get current achievements
    const { data, error } = await supabase
      .from("Achievements")
      .select("badges, points")
      .eq("userid", userId)
      .single();
      
    if (error) {
      console.error("Error fetching achievements:", error);
      return;
    }
    
    // If no achievements record found
    if (!data) {
      console.log("No achievements record found");
      return;
    }
    
    // Check if user already has the badge
    const currentBadges = Array.isArray(data.badges) ? data.badges : [];
    if (currentBadges.includes("insight_seeker")) {
      return; // Already has badge
    }
    
    // Add the badge and points
    const newBadges = [...currentBadges, "insight_seeker"];
    const currentPoints = data.points || 0;
    const newPoints = currentPoints + 60; // Insight Seeker badge is worth 60 points
    
    // Update the database
    const { error: updateError } = await supabase
      .from("Achievements")
      .update({ 
        badges: newBadges,
        points: newPoints
      })
      .eq("userid", userId);
      
    if (updateError) {
      console.error("Error updating badges and points:", updateError);
      return;
    }
    
    toast.success("🏆 New Badge: Insight Seeker! +60 points");
    console.log("Insight badge awarded with 60 points");
    
  } catch (err) {
    console.error("Error awarding insight badge:", err);
  }
};

const ReportsPage = () => {
  const { user, loading } = useAuth();
  const transactions = [
    { id: 1, type: "income", category: "Food", amount: 50, date: "2025-01-01" },
    { id: 2, type: "spending", category: "Food", amount: 30, date: "2025-01-01" },
    { id: 3, type: "income", category: "Rent", amount: 1000, date: "2025-01-02" },
    { id: 4, type: "spending", category: "Rent", amount: 1200, date: "2025-01-02" },
    { id: 5, type: "income", category: "Salary", amount: 2000, date: "2025-01-05" },
    { id: 6, type: "spending", category: "Utilities", amount: 150, date: "2025-01-06" },
  ];

  const [selectedChart, setSelectedChart] = useState("categoryPie");
  const [monthlyData, setMonthlyData] = useState({});
  const [yearlyData, setYearlyData] = useState({});
  const [hasMounted, setHasMounted] = useState(false); // for hydration fix
  const [hasAwardedBadge, setHasAwardedBadge] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    
    const initializeReports = async () => {
      const calculateTrends = () => {
        const monthly = { January: 500, February: 600 };
        const yearly = { 2025: 5000 };
        setMonthlyData(monthly);
        setYearlyData(yearly);
      };
      calculateTrends();
      
      // Award the badge when the page loads if user is logged in
      if (user && !hasAwardedBadge) {
        await awardInsightBadge(user.id);
        setHasAwardedBadge(true);
      }
    };
    
    if (user) {
      initializeReports();
    }
  }, [user, hasAwardedBadge]);

  const categoryData = {
    income: { Food: 100, Rent: 1000, Salary: 2000 },
    spending: { Food: 30, Rent: 1200, Utilities: 150 },
  };

  const pieChartData = (type) => ({
    labels: Object.keys(categoryData[type]),
    datasets: [
      {
        data: Object.values(categoryData[type]),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        hoverOffset: 4,
      },
    ],
  });

  const barChartData = {
    labels: ["Income", "Spending"],
    datasets: [
      {
        label: "Amount",
        data: [2000, 1380],
        backgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  if (loading) return <p className="text-center p-6">Loading...</p>;
  if (!user) return <p className="text-center p-6">Please log in to view reports.</p>;

  return (
    <div>
      <h1 className="text-3xl font-semibold text-[#4B7EFF] opacity-90 mb-6 pt-6 text-center">Reports and Insights</h1>

      <div className="p-6 bg-gray-800 text-gray-200 rounded-2xl shadow-lg max-w-4xl mx-auto">
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-400 mr-4">Select Chart Type:</label>
          <select
            className="bg-gray-700 border border-gray-500 text-gray-200 rounded-xl p-2 focus:ring-[#4B7EFF] focus:border-[#4B7EFF]"
            value={selectedChart}
            onChange={(e) => setSelectedChart(e.target.value)}
          >
            <option value="categoryPie">Category-wise Spending (Pie Chart)</option>
            <option value="incomeSpendingBar">Income vs Spending (Bar Chart)</option>
            <option value="monthlyTrends">Monthly Spending Trends</option>
            <option value="yearlyTrends">Yearly Spending Trends</option>
          </select>
        </div>

        <div className="space-y-10">
          {selectedChart === "categoryPie" && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Category-wise Income</h2>
              <div className="h-64">
                <Pie data={pieChartData("income")} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
              <h2 className="text-xl font-semibold text-white mt-8 mb-4">Category-wise Spending</h2>
              <div className="h-64">
                <Pie data={pieChartData("spending")} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
          )}

          {selectedChart === "incomeSpendingBar" && (
            <div>
              <h2 className="text-xl font-semibold text-[#4B7EFF] mb-4">Income vs Spending Comparison</h2>
              <div className="h-64">
                <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
          )}

          {selectedChart === "monthlyTrends" && (
            <div>
              <h2 className="text-xl font-semibold text-[#4B7EFF] mb-4">Monthly Spending Trends</h2>
              <div className="h-64">
                <Bar
                  data={{
                    labels: Object.keys(monthlyData),
                    datasets: [
                      {
                        label: "Amount",
                        data: Object.values(monthlyData),
                        backgroundColor: "#FF6384",
                      },
                    ],
                  }}
                  options={{ responsive: true, maintainAspectRatio: false }}
                />
              </div>
            </div>
          )}

          {selectedChart === "yearlyTrends" && (
            <div>
              <h2 className="text-xl font-semibold text-[#4B7EFF] mb-4">Yearly Spending Trends</h2>
              <div className="h-64">
                <Bar
                  data={{
                    labels: Object.keys(yearlyData),
                    datasets: [
                      {
                        label: "Amount",
                        data: Object.values(yearlyData),
                        backgroundColor: "#36A2EB",
                      },
                    ],
                  }}
                  options={{ responsive: true, maintainAspectRatio: false }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-4 mt-10">
          {hasMounted && (
            <CSVLink
              data={transactions}
              headers={[
                { label: "ID", key: "id" },
                { label: "Type", key: "type" },
                { label: "Category", key: "category" },
                { label: "Amount", key: "amount" },
                { label: "Date", key: "date" },
              ]}
              filename="transactions_report.csv"
            >
              <button className="px-4 py-2 bg-[#4B7EFF] text-white rounded-xl hover:bg-[#4B7EFF] transition">
                Export to CSV
              </button>
            </CSVLink>
          )}

          <button
            onClick={() => {
              const doc = new jsPDF();
              doc.text("Transactions Report", 20, 20);
              autoTable(doc, {
                head: [["ID", "Type", "Category", "Amount", "Date"]],
                body: transactions.map((txn) => [
                  txn.id,
                  txn.type,
                  txn.category,
                  txn.amount,
                  txn.date,
                ]),
              });
              doc.save("transactions_report.pdf");
            }}
            className="px-4 py-2 bg-[#4B7EFF] text-white rounded-xl hover:bg-[#4B7EFF] transition"
          >
            Export to PDF
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ReportsPage;
