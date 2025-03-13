import { supabase } from "../../../lib/supabaseClient"; // Correct path to supabase client

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

export async function POST(request) {
  try {
    const newTransaction = await request.json();

    const { data, error } = await supabase
      .from("Transaction")
      .insert([
        {
          amount: newTransaction.amount,
          catid: newTransaction.catid,
          credit_debit: newTransaction.credit_debit,
          accountid: newTransaction.accountid,
          timestamp: newTransaction.timestamp || new Date().toISOString(),
        },
      ])
      .single();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
