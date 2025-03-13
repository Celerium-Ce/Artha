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
        setUserData(data[0]); // Assuming data is an array and we need the first item
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
        <div>
            <h1>Welcome, {userData.email}!</h1>
            <p>Your Name✨: {userData.name}</p>
            <LogoutButton /> {/* Logout Button Here */}

        </div>
    );
}