"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/useAuth";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import LogoutButton from "../components/logoutButton";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [accountData, setAccountData] = useState(null);
    const [isCheckingAccount, setIsCheckingAccount] = useState(false);

    const getData = async () => {
        const { data, error } = await supabase.from("User").select("*").eq("userid", user.id);
        if (error) {
            console.error("Error fetching data:", error.message);
            return;
        }
        setUserData(data[0]);
        
        // Also check if user has any accounts
        checkForAccount(false);
    };
    
    const checkForAccount = async (showToasts = true) => {
        if (!user) return;
        
        setIsCheckingAccount(true);
        
        try {
            // Check if user has an account
            const { data, error } = await supabase
                .from("Account")
                .select("*")
                .eq("userid", user.id);
                
            if (error) {
                console.error("Error checking account:", error.message);
                if (showToasts) toast.error(`Error checking account: ${error.message}`);
                setIsCheckingAccount(false);
                return;
            }
            
            if (!data || data.length === 0) {
                if (showToasts) toast.info("No account found. Creating a default account...");
                
                // Use conventional insert instead of RPC
                const { error: createError } = await supabase
                    .from("Account")
                    .insert([{
                        balance: 0,
                        type: "Family",
                        userid: user.id,
                    }]);
                
                if (createError) {
                    console.error("Error creating account:", createError);
                    if (showToasts) toast.error(`Error creating account: ${createError.message}`);
                    setIsCheckingAccount(false);
                    return;
                }
                
                // Fetch the newly created account
                const { data: newAccount, error: fetchError } = await supabase
                    .from("Account")
                    .select("*")
                    .eq("userid", user.id);
                    
                if (fetchError) {
                    console.error("Error fetching new account:", fetchError.message);
                    setIsCheckingAccount(false);
                    return;
                }
                
                setAccountData(newAccount);
                if (showToasts) toast.success("Default account created successfully!");
            } else {
                setAccountData(data);
                if (showToasts) toast.info("You already have an account!");
            }
        } catch (err) {
            console.error("Unexpected error:", err);
            if (showToasts) toast.error("An unexpected error occurred");
        } finally {
            setIsCheckingAccount(false);
        }
    };

    useEffect(() => {
        if (user) getData();
    }, [user]);

    if (loading) return <p>Loading...</p>;
    if (!user) return <p>Please log in.</p>;
    if (!userData) return <p>Loading user data...</p>;

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 p-8 space-y-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl font-bold text-white">Welcome, {userData.name}!</h1>
                    <LogoutButton />
                </div>

                {/* Account check button */}
                <div className="mb-8 flex justify-center">
                    <button
                        onClick={() => checkForAccount(true)}
                        disabled={isCheckingAccount}
                        className="px-6 py-3 rounded-xl text-white font-medium shadow-md bg-[#4B7EFF] hover:bg-opacity-90 transition-all duration-200 disabled:opacity-70"
                    >
                        {isCheckingAccount ? "Checking Account..." : "Check/Create Account"}
                    </button>
                </div>

                {/* Account information */}
                {accountData && accountData.length > 0 && (
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Your Accounts</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {accountData.map(account => (
                                <div key={account.id} className="bg-gray-700 p-4 rounded-lg">
                                    <h3 className="text-xl font-semibold text-[#4B7EFF]">{account.name || "Default Account"}</h3>
                                    <p className="text-gray-300">Balance: ${account.balance?.toFixed(2) || "0.00"}</p>
                                    <p className="text-gray-400 text-sm">Type: {account.accounttype || account.type || "Standard"}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ARTHA title and tagline */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold text-white mb-4">ARTHA</h1>
                    <p className="text-lg text-gray-400">
                        Your Personal Finance Manager. Track, analyze, and optimize your expenses with ease.
                    </p>
                </div>

                {/* Features Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    <FeatureCard title="Track Transactions" description="Easily log and categorize your daily transactions. Stay on top of your income and expenses." />
                    <FeatureCard title="Set Budgets" description="Set monthly budgets, monitor your spending, and make smarter financial decisions." />
                    <FeatureCard title="Insights & Reports" description="Gain valuable insights into your financial habits with detailed reports and graphs." />
                </div>

                {/* Footer */}
                <footer className="mt-16 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Artha - All Rights Reserved</p>
                </footer>
            </div>
            <ToastContainer />
        </div>
    );
}

function FeatureCard({ title, description }) {
    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
            <h3 className="text-2xl font-semibold text-[#4B7EFF]">{title}</h3>
            <p className="mt-4 text-gray-300">{description}</p>
        </div>
    );
}
