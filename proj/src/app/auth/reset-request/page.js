"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function ResetRequest() {
  const [email, setEmail] = useState("");
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
      setMessage("Password reset email sent! Check your inbox.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="p-6 bg-gray-800 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-bold text-center mb-4">Reset Password</h2>
        {message && <p className="text-center mb-4">{message}</p>}
        <form onSubmit={handleResetRequest} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
            required
          />
          <button type="submit" className="w-full bg-blue-500 p-2 rounded">
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}
