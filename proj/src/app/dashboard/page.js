"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/useAuth";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import LogoutButton from "../components/logoutButton"; // correct the path as needed

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [userData, setUserData] = useState(null);

    const getData = async () => {
        const { data, error } = await supabase.from("User").select("*").eq("userid", user.id);
        if (error) {
            console.error("Error fetching data:", error.message);
            return;
        }
        setUserData(data[0]);
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

                {/* ✅ ARTHA title and tagline added below */}
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
