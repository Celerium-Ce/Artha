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

const getMonthRange = (date) => {
  const startDate = new Date(date);
  startDate.setDate(1);
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date(date);
  endDate.setMonth(endDate.getMonth() + 1);
  endDate.setDate(0);
  endDate.setHours(23, 59, 59, 999);
  
  return {
    start: startDate.toISOString(),
    end: endDate.toISOString(),
    label: startDate.toLocaleString('default', { month: 'long', year: 'numeric' })
  };
};

const getLastThreeMonths = () => {
  const months = [];
  const currentDate = new Date();
  
  for (let i = 0; i < 3; i++) {
    const date = new Date(currentDate);
    date.setMonth(currentDate.getMonth() - i);
    months.push(getMonthRange(date));
  }
  
  return months;
};

const ReportsPage = () => {
  const { user, loading } = useAuth();
  const [selectedChart, setSelectedChart] = useState("categoryPie");
  const [monthlyData, setMonthlyData] = useState({});
  const [yearlyData, setYearlyData] = useState({});
  const [categoryData, setCategoryData] = useState({ income: {}, spending: {} });
  const [transactions, setTransactions] = useState([]);
  const [availableMonths, setAvailableMonths] = useState(getLastThreeMonths());
  const [selectedMonth, setSelectedMonth] = useState(availableMonths[0]?.start || '');
  const [reportDetails, setReportDetails] = useState(null);

  // Update the createMonthlyReport function
  const createMonthlyReport = async (accountId, monthDate) => {
    const range = getMonthRange(new Date(monthDate));
    const formattedStartDate = range.start.split('T')[0];
    const formattedEndDate = range.end.split('T')[0];
  
    try {
      // First check if report exists for this month
      const { data: existingReport, error: checkError } = await supabase
        .from('Report')
        .select('*')
        .eq('accountid', accountId)
        .eq('startdate', formattedStartDate)
        .maybeSingle();
  
      if (checkError) throw checkError;
      if (existingReport) {
        // Update existing report instead of creating new one
        const { data: updatedReport, error: updateError } = await supabase
          .from('Report')
          .update({
            endbalance: existingReport.endbalance,
            numoftxn: existingReport.numoftxn,
            income: existingReport.income,
            expense: existingReport.expense
          })
          .match({ accountid: accountId, startdate: formattedStartDate })
          .select()
          .single();
  
        if (updateError) throw updateError;
        return updatedReport;
      }
  
      // If no report exists, get transactions for the month
      const { data: txns, error: txnError } = await supabase
        .from('Transaction')
        .select('amount, credit_debit')
        .eq('accountid', accountId)
        .gte('transactionwhen', range.start)
        .lte('transactionwhen', range.end);
  
      if (txnError) throw txnError;
  
      // Calculate totals
      const totals = txns.reduce((acc, txn) => {
        if (txn.credit_debit === 'credit') {
          acc.income += txn.amount;
        } else {
          acc.expense += txn.amount;
        }
        return acc;
      }, { income: 0, expense: 0 });
  
      // Get current balance
      const { data: account, error: accountError } = await supabase
        .from('Account')
        .select('balance')
        .eq('accountid', accountId)
        .single();
  
      if (accountError) throw accountError;
  
      // Create new report using insert
      const { data: newReport, error: createError } = await supabase
        .from('Report')
        .insert({
          accountid: accountId,
          startdate: formattedStartDate,
          enddate: formattedEndDate,
          income: totals.income,
          expense: totals.expense,
          endbalance: account.balance,
          numoftxn: txns.length
        })
        .select()
        .single();
  
      if (createError) throw createError;
      return newReport;
  
    } catch (error) {
      console.error('Error in report creation:', error);
      toast.error('Error creating report: ' + error.message);
      return null;
    }
  };

  const fetchReportData = async () => {
    if (!user || !selectedMonth) return;
  
    try {
      const { data: account, error: accountError } = await supabase
        .from('Account')
        .select('accountid')
        .eq('userid', user.id)
        .single();
  
      if (accountError) throw accountError;
  
      const range = getMonthRange(new Date(selectedMonth));
      const formattedStartDate = range.start.split('T')[0];
      
      // First check if report exists
      let report;
      const { data: existingReport, error: checkError } = await supabase
        .from('Report')
        .select('*')
        .eq('accountid', account.accountid)
        .eq('startdate', formattedStartDate)
        .single();
  
      // Get all transactions for the month
      const { data: txns, error: txnError } = await supabase
        .from('Transaction')
        .select(`
          amount,
          credit_debit,
          transactionwhen,
          Category (catname)
        `)
        .eq('accountid', account.accountid)
        .gte('transactionwhen', range.start)
        .lte('transactionwhen', range.end);
  
      if (txnError) throw txnError;
  
      // Calculate totals
      const totals = txns?.reduce((acc, txn) => {
        if (txn.credit_debit === 'credit') {
          acc.income += txn.amount;
        } else {
          acc.expense += txn.amount;
        }
        return acc;
      }, { income: 0, expense: 0 });
  
      // Get current balance
      const { data: accountData } = await supabase
        .from('Account')
        .select('balance')
        .eq('accountid', account.accountid)
        .single();
  
      if (existingReport) {
        // Update existing report
        const { data: updatedReport, error: updateError } = await supabase
          .from('Report')
          .update({
            income: totals.income,
            expense: totals.expense,
            endbalance: accountData.balance,
            numoftxn: txns.length
          })
          .match({ 
            accountid: account.accountid,
            startdate: formattedStartDate
          })
          .select()
          .single();
  
        if (updateError) throw updateError;
        report = updatedReport;
      } else {
        // Create new report only if it doesn't exist
        const { data: newReport, error: createError } = await supabase
          .from('Report')
          .insert({
            accountid: account.accountid,
            startdate: formattedStartDate,
            enddate: range.end.split('T')[0],
            income: totals.income,
            expense: totals.expense,
            endbalance: accountData.balance,
            numoftxn: txns.length
          })
          .select()
          .single();
  
        if (createError) throw createError;
        report = newReport;
      }
  
      // Update UI with fresh data
      const catStats = { income: {}, spending: {} };
      txns?.forEach(txn => {
        const category = txn.Category.catname;
        const type = txn.credit_debit === 'credit' ? 'income' : 'spending';
        catStats[type][category] = (catStats[type][category] || 0) + txn.amount;
      });
  
      setCategoryData(catStats);
      setTransactions(txns || []);
      setReportDetails({
        startDate: report.startdate,
        endDate: report.enddate,
        income: report.income,
        expense: report.expense,
        balance: report.endbalance,
        transactions: report.numoftxn
      });
  
    } catch (error) {
      console.error('Error fetching report data:', error);
      toast.error('Error updating report: ' + error.message);
    }
  };

  useEffect(() => {
    if (user && !loading) {
      fetchReportData();

      // Set up real-time subscription for transactions
      const channel = supabase
        .channel('report-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'Transaction',
            filter: `accountid=eq.${user.id}`
          },
          async (payload) => {
            console.log('Transaction changed:', payload);
            // Refresh report data when transactions change
            await fetchReportData();
          }
        )
        .subscribe();

      // Cleanup subscription
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, loading, selectedMonth]);

  


  const pieChartData = (type) => ({
    labels: Object.keys(categoryData[type]),
    datasets: [{
      data: Object.values(categoryData[type]),
      backgroundColor: [
        "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0",
        "#9966FF", "#FF9F40", "#FF99CC", "#00CC99"
      ],
      hoverOffset: 4
    }]
  });

  if (loading) return <div className="text-center p-6">Loading...</div>;
  if (!user) return <div className="text-center p-6">Please log in to view reports.</div>;

  return (
    <div>
      <h1 className="text-3xl font-semibold text-[#4B7EFF] opacity-90 mb-6 pt-6 text-center">
        Monthly Reports
      </h1>

      <div className="p-6 bg-gray-800 text-gray-200 rounded-2xl shadow-lg max-w-4xl mx-auto">
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-400 mr-4">
            Select Month:
          </label>
          <select
            className="bg-gray-700 border border-gray-500 text-gray-200 rounded-xl p-2"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {availableMonths.map(month => (
              <option key={month.start} value={month.start}>
                {month.label}
              </option>
            ))}
          </select>
        </div>

        {reportDetails && (
          <div className="bg-gray-700 p-6 rounded-xl mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Monthly Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-600 p-4 rounded-lg">
                <p className="text-gray-400">Period</p>
                <p className="text-lg">
                  {new Date(reportDetails.startDate).toLocaleDateString()} - 
                  {new Date(reportDetails.endDate).toLocaleDateString()}
                </p>
              </div>
              <div className="bg-gray-600 p-4 rounded-lg">
                <p className="text-gray-400">Total Transactions</p>
                <p className="text-lg">{reportDetails.transactions}</p>
              </div>
              <div className="bg-gray-600 p-4 rounded-lg">
                <p className="text-gray-400">Current Balance</p>
                <p className="text-lg">₹{reportDetails.balance.toLocaleString()}</p>
              </div>
              <div className="bg-gray-600 p-4 rounded-lg">
                <p className="text-gray-400">Total Income</p>
                <p className="text-lg text-green-400">₹{reportDetails.income.toLocaleString()}</p>
              </div>
              <div className="bg-gray-600 p-4 rounded-lg">
                <p className="text-gray-400">Total Expense</p>
                <p className="text-lg text-red-400">₹{reportDetails.expense.toLocaleString()}</p>
              </div>
              <div className="bg-gray-600 p-4 rounded-lg">
                <p className="text-gray-400">Net Flow</p>
                <p className={`text-lg ${
                  reportDetails.income - reportDetails.expense >= 0 
                    ? 'text-green-400' 
                    : 'text-red-400'
                }`}>
                  ₹{(reportDetails.income - reportDetails.expense).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Category Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-2">Income Categories</h3>
                <div className="h-64">
                  <Pie 
                    data={pieChartData("income")} 
                    options={{ responsive: true, maintainAspectRatio: false }}
                  />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Expense Categories</h3>
                <div className="h-64">
                  <Pie 
                    data={pieChartData("spending")} 
                    options={{ responsive: true, maintainAspectRatio: false }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-8">
          <CSVLink
            data={transactions.map(txn => ({
              type: txn.credit_debit,
              category: txn.Category.catname,
              amount: txn.amount,
              date: new Date(txn.transactionwhen).toLocaleDateString()
            }))}
            filename={`report_${selectedMonth.split('T')[0]}.csv`}
            className="px-4 py-2 bg-[#4B7EFF] text-white rounded-xl hover:bg-[#4B7EFF] transition"
          >
            Export to CSV
          </CSVLink>

          <button
            onClick={() => {
              const doc = new jsPDF();
              doc.text(`Monthly Report - ${new Date(selectedMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}`, 20, 20);
              
              autoTable(doc, {
                head: [["Type", "Category", "Amount", "Date"]],
                body: transactions.map(txn => [
                  txn.credit_debit,
                  txn.Category.catname,
                  `₹${txn.amount.toLocaleString()}`,
                  new Date(txn.transactionwhen).toLocaleDateString()
                ])
              });
              
              doc.save(`report_${selectedMonth.split('T')[0]}.pdf`);
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