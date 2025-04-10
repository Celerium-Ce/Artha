import { supabase } from "../../../lib/supabaseClient"; // Correct path to supabase client

// Handle GET requests to fetch transactions
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter");

    let query = supabase
      .from("Transaction") // Your actual table name
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

// Handle POST requests to create a new transaction
export async function POST(request) {
  try {
    const newTransaction = await request.json(); // Get the new transaction data

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

// Handle DELETE requests to remove a specific transaction
export async function DELETE(request) {
  try {
    console.log("DELETE request reached!"); // Log to check if it's being called

    const { searchParams } = new URL(request.url);
    const txnid = searchParams.get("txnid");

    // Check if txnid is provided
    if (!txnid) {
      return new Response(JSON.stringify({ error: "Transaction ID (txnid) is required" }), { status: 400 });
    }

    // Delete the transaction from the database
    const { data, error } = await supabase
      .from("Transaction")
      .delete()
      .eq("txnid", txnid);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    // If no rows were deleted, return a message
    if (data.length === 0) {
      return new Response(JSON.stringify({ error: "Transaction not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Transaction deleted successfully" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// Handle PUT requests to update an existing transaction
export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const txnid = searchParams.get("txnid");

    // Check if txnid is provided
    if (!txnid) {
      return new Response(JSON.stringify({ error: "Transaction ID (txnid) is required" }), { status: 400 });
    }

    const updatedTransaction = await request.json(); // Get the updated transaction data

    const { data, error } = await supabase
      .from("Transaction")
      .update({
        amount: updatedTransaction.amount,
        catid: updatedTransaction.catid,
        credit_debit: updatedTransaction.credit_debit,
        accountid: updatedTransaction.accountid,
        timestamp: updatedTransaction.timestamp || new Date().toISOString(),
      })
      .eq("txnid", txnid)
      .single();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    if (!data) {
      return new Response(JSON.stringify({ error: "Transaction not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
