"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/useAuth";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import LogoutButton from "../../components/logoutButton";
import { toast, ToastContainer } from "react-toastify";

export default function Dashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [userData, setUserData] = useState(null);

    const getData = async () => {
        // Using email instead of id to avoid type mismatch errors
        const { data, error } = await supabase.from("User").select("*").eq("email", user.email);
        if (error) {
            console.error("Error fetching data:", error.message);
            return;
        }
        setUserData(data[0]); 
    };

    const handleChangePassword = async () => {
        const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
            redirectTo: "http://localhost:3000/auth/update-password",
        });
        if (error) {
            console.error("Error sending password reset email:", error.message);
            return;
        }
        toast.success("Password reset email sent!");
    };

    useEffect(() => {
        if (user) {
            getData();
        }
    }, [user]);

    if (loading) return <p className="text-center p-6" style={{ color: "var(--foreground)" }}>Loading...</p>;
    if (!user) return <p className="text-center p-6" style={{ color: "var(--foreground)" }}>Please log in.</p>;
    if (!userData) return <p className="text-center p-6" style={{ color: "var(--foreground)" }}>Loading user data...</p>;

    return (
        <div 
            className="min-h-screen p-6"
            style={{
                backgroundColor: "var(--background)",
                color: "var(--foreground)"
            }}
        >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div 
                    className="rounded-lg shadow-lg p-8"
                    style={{ backgroundColor: "var(--card-background, rgba(255, 255, 255, 0.05))" }}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold opacity-90" style={{ color: "var(--highlight, #fff)" }}>
                            Welcome, {userData.name}!
                        </h1>
                        <LogoutButton />
                    </div>
                    
                    <div 
                        className="border-l-4 p-4 rounded-md mb-6" 
                        style={{ 
                            backgroundColor: "var(--card-background, rgba(255, 255, 255, 0.05))",
                            borderColor: "var(--highlight, #4a7dfc)"
                        }}
                    >
                        <p className="text-lg opacity-90">
                            <span className="font-semibold">Your Email:</span> {userData.email || 'Not set'} 
                        </p>
                        <button 
                            className="mt-2 px-4 py-2 rounded-md" 
                            style={{ backgroundColor: "var(--accent, #4a7dfc)" }}
                        >
                            Change Email
                        </button>
                    </div>
                    
                    <div 
                        className="border-l-4 p-4 rounded-md mb-6"
                        style={{ 
                            backgroundColor: "var(--card-background, rgba(255, 255, 255, 0.05))",
                            borderColor: "var(--highlight, #4a7dfc)"
                        }}
                    >
                        <p className="text-lg opacity-90">
                            <span className="font-semibold">Password:</span> ********
                        </p>
                        <button 
                            className="mt-2 px-4 py-2 rounded-md"
                            style={{ backgroundColor: "var(--accent, #4a7dfc)" }}
                            onClick={handleChangePassword}
                        >
                            Change Password
                        </button>
                    </div>

                    <div 
                        className="border-l-4 p-4 rounded-md mb-6"
                        style={{ 
                            backgroundColor: "var(--card-background, rgba(255, 255, 255, 0.05))",
                            borderColor: "var(--highlight, #4a7dfc)"
                        }}
                    >
                        <button 
                            className="mt-2 px-4 py-2 rounded-md"
                            style={{ backgroundColor: "var(--accent, #4a7dfc)" }}
                        >
                            Toggle Dark/Light Theme
                        </button>
                    </div>

                    <div 
                        className="border-l-4 p-4 rounded-md mb-6"
                        style={{ 
                            backgroundColor: "var(--card-background, rgba(255, 255, 255, 0.05))",
                            borderColor: "var(--highlight, #4a7dfc)"
                        }}
                    >
                        <select 
                            className="mt-2 px-4 py-2 rounded-md"
                            style={{ backgroundColor: "var(--accent, #4a7dfc)" }}
                        >
                            <option>Change Language (Show current language later)</option>
                        </select>
                    </div>

                    <div 
                        className="border-l-4 p-4 rounded-md mb-6"
                        style={{ 
                            backgroundColor: "var(--card-background, rgba(255, 255, 255, 0.05))",
                            borderColor: "var(--highlight, #4a7dfc)"
                        }}
                    >
                        <select 
                            className="mt-2 px-4 py-2 rounded-md"
                            style={{ backgroundColor: "var(--accent, #4a7dfc)" }}
                        >
                            <option>Change Currency (Show current currency later)</option> 
                        </select>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}