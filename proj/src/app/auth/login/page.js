"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import Cookies from "js-cookie";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { email, password } = formData;

    // Sign in user
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      Cookies.set("supabase-session", JSON.stringify(data.session), { expires: 7 });
      router.push("/dashboard"); // Redirect to user
    }
    setLoading(false);
  };

  return (
    <div 
      className="flex min-h-screen items-center justify-center p-6"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)"
      }}
    >
      <div 
        className="w-full max-w-md p-6 rounded-lg shadow-lg"
        style={{ backgroundColor: "var(--card-background, rgba(255, 255, 255, 0.05))" }}
      >
        <h2 
          className="text-2xl font-bold mb-4 text-center opacity-90"
          style={{ color: "var(--highlight, #fff)" }}
        >
          Login
        </h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-opacity-20"
            style={{ 
              backgroundColor: "var(--card-background, rgba(255, 255, 255, 0.05))",
              borderColor: "var(--highlight, #4a7dfc)" 
            }}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-opacity-20"
            style={{ 
              backgroundColor: "var(--card-background, rgba(255, 255, 255, 0.05))",
              borderColor: "var(--highlight, #4a7dfc)" 
            }}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 rounded-md"
            style={{ backgroundColor: "var(--accent, #4a7dfc)" }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center mt-4 opacity-90">
          <a 
            href="/auth/reset-request" 
            style={{ color: "var(--highlight, #4a7dfc)" }}
          >
            Forgot password?
          </a>
        </p>
        <p className="text-center mt-4 opacity-90">
          Don&apos;t have an account?{" "}
          <a 
            href="/auth/register" 
            style={{ color: "var(--highlight, #4a7dfc)" }}
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
