"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

export default function ResetRequest() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [message, setMessage] = useState(null);

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setMessage(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/auth/update-password", // Change for production
    });

    if (error) {
      setMessage(error.message);
    } else {
      toast.success("Password reset email sent!");
      setTimeout(() => {
        router.push("/auth");
      }, 3000);
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
          Reset Password
        </h2>
        
        {message && (
          <p 
            className="text-center mb-4 opacity-90" 
            style={{ color: "red" }}
          >
            {message}
          </p>
        )}
        
        <form onSubmit={handleResetRequest} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            Send Reset Link
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
