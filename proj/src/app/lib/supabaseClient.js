import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


// Make a .env.local file in the root of your project and add the following:
// NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-url.com
// NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key