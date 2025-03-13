
"use client";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  return <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>;
}
