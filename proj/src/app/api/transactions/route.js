// src/app/api/transactions/route.js
import { supabase } from "../../../lib/supabaseClient"; // Correct path and export name

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter");

    let query = supabase
      .from("Transaction") // Use your actual table name
      .select("*");

    if (filter === "credit" || filter === "debit") {
      query = query.eq("credit_debit", filter);
    }

    const { data, error } = await query;

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
