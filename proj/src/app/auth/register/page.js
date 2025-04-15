"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      toast.success("Check your email to confirm your account!");
    }
    
    console.log("Signing up user...");

    const user = data.user;
    if (user) {
      // Create user record in User table
      const { error: insertError } = await supabase.from("User").insert([
        { 
          userid: user.id,
          name: name, 
          email: email 
        }
      ]);

      if (insertError) {
        setError(insertError.message);
        setLoading(false);
        return;
      }
      
      // Create account for the user
      try {
        // Create a default account for the new user
        //toast.info("Creating your default account...");
        
        const { error: createError } = await supabase
          .from("Account")
          .insert([{
            userid: user.id,
            balance: 0,
            type: "Family", 
          }]);
        
        if (createError) {
          console.error("Error creating account:", createError);
          toast.error(`Account creation failed: ${createError.message}`);
          // Continue registration process even if account creation fails
        }
      } catch (err) {
        console.error("Error in account creation:", err);
        // Continue with registration even if account creation fails
      }
    }

    setLoading(false);
    
    // Redirect after successful registration
    setTimeout(() => {
      router.push("/auth"); // Redirect to login after 3 seconds
    }, 3000);
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
          className="text-2xl font-bold text-center mb-4 opacity-90"
          style={{ color: "var(--highlight, #fff)" }}
        >
          Register
        </h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-opacity-20"
            style={{ 
              backgroundColor: "var(--card-background, rgba(255, 255, 255, 0.05))",
              borderColor: "var(--highlight, #4a7dfc)" 
            }}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-opacity-20"
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
            className="w-full px-4 py-2 rounded-lg border border-opacity-20"
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
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center mt-4 opacity-90">
          Already have an account?{" "}
          <a 
            href="/auth/login" 
            style={{ color: "var(--highlight, #4a7dfc)" }}
          >
            Login
          </a>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
}
