
# Industrial Plastics Hub - Deployment Guide

This guide explains how to launch this application using GitHub, Vercel, and Supabase.

## 1. GitHub Setup
1. Create a new repository on GitHub.
2. Push this project code to your new repository.

## 2. Supabase Setup (Database)
1. Sign up/Log in to [Supabase](https://supabase.com/).
2. Create a new Project.
3. Open the **SQL Editor** in the Supabase dashboard.
4. Paste and run the following SQL to create the `inquiries` table:

```sql
create table inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  full_name text not null,
  email text not null,
  phone text,
  type text,
  message text,
  status text default 'New',
  assigned_to text,
  ai_summary text,
  admin_notes text,
  chat_history jsonb default '[]'::jsonb
);
```

5. Go to **Project Settings > API** to find your `Project URL` and `anon public` Key.

## 3. Vercel Setup (Hosting)
1. Import your GitHub repository into [Vercel](https://vercel.com/).
2. In the **Environment Variables** section, add:
   - `API_KEY`: Your Google Gemini API Key.
   - `SUPABASE_URL`: Your Supabase Project URL.
   - `SUPABASE_ANON_KEY`: Your Supabase `anon public` key.
3. Click **Deploy**.

## 4. UI/UX Consistency
This update only modifies the data layer (persistence) and configuration. No visual or interaction changes were made to the frontend, ensuring complete UI/UX consistency with the original industrial design.
