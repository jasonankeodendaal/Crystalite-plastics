
import { createClient } from '@supabase/supabase-js';

// These environment variables should be set in Vercel or your local .env file
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

/**
 * Note for Deployment:
 * 1. Create a Supabase project.
 * 2. Run the following SQL in the Supabase SQL Editor:
 * 
 * create table inquiries (
 *   id uuid primary key default gen_random_uuid(),
 *   created_at timestamp with time zone default now(),
 *   full_name text not null,
 *   email text not null,
 *   phone text,
 *   type text,
 *   message text,
 *   status text default 'New',
 *   assigned_to text,
 *   admin_notes text,
 *   chat_history jsonb default '[]'::jsonb
 * );
 * 
 * 3. Set SUPABASE_URL and SUPABASE_ANON_KEY in Vercel environment variables.
 */
