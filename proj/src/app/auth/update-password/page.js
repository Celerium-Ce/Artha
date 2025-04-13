"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function UpdatePassword() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setMessage(null);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Password updated successfully! Redirecting...");
      await supabase.auth.signOut();
      setTimeout(() => router.push("/auth/login"), 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="p-6 bg-gray-800 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-bold text-center mb-4">Set New Password</h2>
        {message && <p className="text-center mb-4">{message}</p>}
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
            required
          />
          <button type="submit" className="w-full bg-green-500 p-2 rounded">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
