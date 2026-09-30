# Spidey Connect — Client Web Application

A responsive web application built for Apex Webworks featuring a modern signup experience, hero confirmation section, and an authenticated administrative portal with Supabase database integration.

## Design Identity & Palette
- **Canvas / Background**: White (`#FFFFFF`)
- **Headings & Core UI**: Blue (`#0B2A4A`)
- **Primary Buttons & Highlights**: Red (`#E30613`)

## Features

### 1. User Sign Up
- Minimalist, responsive registration form
- Email, Password, and Confirm Password fields with inline validation
- Clear error handling and accessible feedback
- Immediate redirection to the Hero section upon successful registration

### 2. Hero Section
- Exact heading: **"Thanks for Connecting"**
- Display of registered user details and activation status
- Dedicated **Spider-Man Visual Asset Frame** on the right side on desktop (stacked on mobile)
- Client image upload and preview support with an architectural placeholder when empty

### 3. Admin Portal
- Separate authenticated portal with security clearance gate
- **Total Users** statistic counter
- User registration audit table with **Email** and **Signup Date & Time**
- Search and filtering capabilities
- Direct Supabase configuration and ready-to-run SQL schema migration script

## Supabase Database Setup

To connect to Supabase:
1. Create a project in [Supabase](https://supabase.com).
2. Go to **SQL Editor** and run the following script:

```sql
CREATE TABLE IF NOT EXISTS public.registrations (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert"
  ON public.registrations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public read"
  ON public.registrations FOR SELECT
  USING (true);
```

3. Copy your **Project URL** and **Anon Public Key** from **Project Settings → API**.
4. Set them in your environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ADMIN_PASSKEY` (default: `apex-admin-secure`)

## Deploy to Vercel

1. Push this repository to GitHub.
2. Import the repository into [Vercel](https://vercel.com).
3. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ADMIN_PASSKEY`
4. Click **Deploy**.
Deploy trigger 1
