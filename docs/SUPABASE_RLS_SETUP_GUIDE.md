# Supabase RLS Manual Setup Guide

This guide explains how to apply Row-Level Security (RLS) policies manually via the Supabase Console, since CLI migration push encountered DNS connectivity issues.

## Overview

All tables in your Supabase project have been created with RLS enabled. However, the default RLS policies need to be updated to be more restrictive for security.

**Default Policy (currently in place):**
- `Allow all operations for public` — allows anonymous and authenticated users to read/write.

**Target Policies (for security):**
- Allow authenticated users to **SELECT** (read) only.
- Restrict **INSERT, UPDATE, DELETE** to service role (server-side only).

## Tables to Update

Apply the following policies to these tables:
1. `bedrijven`
2. `contacten`
3. `deals`
4. `projecten`
5. `offertes`
6. `inkomsten`
7. `uitgaven`
8. `artikelen`
9. `timesheets`
10. `betalingen`
11. `afspraken`
12. `abonnementen`

## Step-by-Step Instructions

### 1. Log into Supabase Console
- Go to https://app.supabase.com
- Select your project (bpgcfjrxtjcmjruhcngn)

### 2. Navigate to SQL Editor
- In the left sidebar, click **SQL Editor**
- Click **New Query**

### 3. Run the RLS Policy SQL

Copy and paste the SQL below into the query editor. This will drop any existing open policies and apply the new restrictive ones.

```sql
-- Drop old permissive policies
DROP POLICY IF EXISTS "Enable all operations for public" ON bedrijven;
DROP POLICY IF EXISTS "Enable all operations for public" ON contacten;
DROP POLICY IF EXISTS "Enable all operations for public" ON deals;
DROP POLICY IF EXISTS "Enable all operations for public" ON projecten;
DROP POLICY IF EXISTS "Enable all operations for public" ON offertes;
DROP POLICY IF EXISTS "Enable all operations for public" ON inkomsten;
DROP POLICY IF EXISTS "Enable all operations for public" ON uitgaven;
DROP POLICY IF EXISTS "Enable all operations for public" ON artikelen;
DROP POLICY IF EXISTS "Enable all operations for public" ON timesheets;
DROP POLICY IF EXISTS "Enable all operations for public" ON betalingen;
DROP POLICY IF EXISTS "Enable all operations for public" ON afspraken;
DROP POLICY IF EXISTS "Enable all operations for public" ON abonnementen;

-- Create restrictive SELECT-only policies for bedrijven
CREATE POLICY "Allow authenticated select on bedrijven" ON bedrijven
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create restrictive SELECT-only policies for contacten
CREATE POLICY "Allow authenticated select on contacten" ON contacten
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create restrictive SELECT-only policies for deals
CREATE POLICY "Allow authenticated select on deals" ON deals
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create restrictive SELECT-only policies for projecten
CREATE POLICY "Allow authenticated select on projecten" ON projecten
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create restrictive SELECT-only policies for offertes
CREATE POLICY "Allow authenticated select on offertes" ON offertes
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create restrictive SELECT-only policies for inkomsten
CREATE POLICY "Allow authenticated select on inkomsten" ON inkomsten
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create restrictive SELECT-only policies for uitgaven
CREATE POLICY "Allow authenticated select on uitgaven" ON uitgaven
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create restrictive SELECT-only policies for artikelen
CREATE POLICY "Allow authenticated select on artikelen" ON artikelen
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create restrictive SELECT-only policies for timesheets
CREATE POLICY "Allow authenticated select on timesheets" ON timesheets
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create restrictive SELECT-only policies for betalingen
CREATE POLICY "Allow authenticated select on betalingen" ON betalingen
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create restrictive SELECT-only policies for afspraken
CREATE POLICY "Allow authenticated select on afspraken" ON afspraken
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create restrictive SELECT-only policies for abonnementen
CREATE POLICY "Allow authenticated select on abonnementen" ON abonnementen
  FOR SELECT USING (auth.role() = 'authenticated');
```

### 4. Execute the Query
- Click the **Execute** button (or press `Cmd+Enter`)
- Wait for the query to complete (you should see a success message)

### 5. Verify Policies Were Applied
- In the left sidebar, navigate to **Authentication** → **Policies**
- Or use SQL Editor to query:
  ```sql
  SELECT schemaname, tablename, policyname, permissive, roles, qual FROM pg_policies
  WHERE schemaname = 'public'
  ORDER BY tablename, policyname;
  ```

## What These Policies Do

- **FOR SELECT**: Authenticated users can read (SELECT) from any table.
- **USING (auth.role() = 'authenticated')**: Only allow if user is authenticated (not anonymous).
- **No INSERT/UPDATE/DELETE policies**: Write operations are denied to client; use service role (server-side) for writes.

## Next Steps: Owner-Based Access (Optional)

For more granular control, you can later add owner-based policies. For example:

```sql
-- Allow INSERT if the new row's user_id matches the authenticated user
CREATE POLICY "Allow insert for own data" ON inkomsten
  FOR INSERT WITH CHECK (auth.uid()::text = created_by::text);

-- Allow UPDATE/DELETE on own data
CREATE POLICY "Allow update for own data" ON inkomsten
  FOR UPDATE USING (auth.uid()::text = created_by::text);
```

This requires adding a `created_by` or `user_id` column to tables.

## Troubleshooting

- **Error: "policy already exists"**: The policies may already be in place. You can drop and recreate, or check the Policies tab in the console.
- **No changes visible**: RLS policies can take a few seconds to take effect. Refresh your browser or try reconnecting.
- **Writes still work from client**: If you added only SELECT policies, server-side requests (via service role) can still write. This is by design.

## Reference Files

The migration files with these policies are stored in:
- `supabase/migrations/001_initial_schema.sql` (for bedrijven, contacten, deals, projecten, offertes)
- `supabase/migrations/002_add_missing_tables.sql` (for inkomsten, uitgaven, artikelen, timesheets, betalingen, afspraken, abonnementen)

These will be pushed to Supabase automatically once networking is restored.
