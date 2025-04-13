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
    <div 
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)"
      }}
    >
      <div 
        className="p-6 rounded-lg shadow-md w-96"
        style={{ backgroundColor: "var(--card-background, rgba(255, 255, 255, 0.05))" }}
      >
        <h2 
          className="text-xl font-bold text-center mb-4 opacity-90"
          style={{ color: "var(--highlight, #fff)" }}
        >
          Set New Password
        </h2>
        
        {message && (
          <p 
            className="text-center mb-4 opacity-90"
            style={{ color: message.includes("successfully") ? "var(--highlight, #4a7dfc)" : "red" }}
          >
            {message}
          </p>
        )}
        
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded border border-opacity-20"
            style={{ 
              backgroundColor: "var(--card-background, rgba(255, 255, 255, 0.05))",
              borderColor: "var(--highlight, #4a7dfc)" 
            }}
            required
          />
          <button 
            type="submit" 
            className="w-full p-2 rounded"
            style={{ backgroundColor: "var(--accent, #4a7dfc)" }}
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
