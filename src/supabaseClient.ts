// supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Ensure your .env.local has:
// VITE_SUPABASE_URL=your-project-url
// VITE_SUPABASE_KEY=your-anon-key

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Supabase URL or key is missing. Make sure you have a .env.local file with VITE_SUPABASE_URL and VITE_SUPABASE_KEY'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
