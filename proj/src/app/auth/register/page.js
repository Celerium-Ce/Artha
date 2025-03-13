"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { toast,ToastContainer } from "react-toastify";
export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { name, email, password } = formData;
    const { data: edata, error: emailError } = await supabase.from("User").select("*").eq("email", email);
    if (emailError) {
      setError(emailError.message);
      setLoading(false);
      return;
    } else if (edata && edata.length > 0) {
      setError("User with this email already exists");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }, // Store name in user metadata
    });

    if (error) {
      setError(error.message);
      toast.error(error.message);
      setLoading(false);
      return;
        } else {
      toast.success("Check your email to confirm your account!!!!");
      setTimeout(() => {
        router.push("/auth"); // Redirect to login after 3 seconds
      }, 3000);
    }
    console.log("Signing up user...");

    const user = data.user;
    if (user) {
        const { error: insertError } = await supabase.from("User").insert([
        { 
            userid: user.id,
            name:name, 
            email: email }
        ]);

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }
  }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-md bg-gray-900 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-white mb-4">Register</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-400">
          Already have an account?{" "}
          <a href="/auth/login" className="text-blue-400 hover:underline">
            Login
          </a>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
}
