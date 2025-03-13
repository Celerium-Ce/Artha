"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/useAuth";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import LogoutButton from "../components/logoutButton";

export default function Dashboard() {
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
        if (user) {
            getData();
        }
    }, [user]);

    if (loading) return <p>Loading...</p>;
    if (!user) return <p>Please log in.</p>;
    if (!userData) return <p>Loading user data...</p>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">Welcome, {userData.name}!</h1>
                        <LogoutButton />
                    </div>
                    
                    
                    
                </div>
            </div>
        </div>
    );
}