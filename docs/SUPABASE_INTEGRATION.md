# Supabase Integration Guide

This document explains how to use the Supabase integration in the ArchonPro Dashboard.

## Table of Contents

1. [Setup](#setup)
2. [Database Schema](#database-schema)
3. [Using Data Hooks](#using-data-hooks)
4. [Command Palette Search](#command-palette-search)
5. [Mutations](#mutations)
6. [Search Functionality](#search-functionality)

## Setup

### 1. Database Migration

1. Go to your Supabase project: https://bpgcfjrxtjcmjruhcngn.supabase.co
2. Open SQL Editor in Supabase dashboard
3. Execute the migration file: `supabase/migrations/001_initial_schema.sql`
4. The tables and sample data will be created automatically

### 2. Environment Variables

Your `.env.local` file should contain:

```env
NEXT_PUBLIC_SUPABASE_URL="https://bpgcfjrxtjcmjruhcngn.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

**Security Note**: Never commit your service role key to version control!

## Database Schema

The database contains 5 main tables:

### 1. Bedrijven (Companies)
- `id` (BIGSERIAL, Primary Key)
- `naam` (VARCHAR(255)) - Company name
- `adres` (TEXT) - Address
- `postcode` (VARCHAR(10)) - Postal code
- `stad` (VARCHAR(100)) - City
- `email` (VARCHAR(255)) - Email
- `telefoon` (VARCHAR(20)) - Phone number
- `kvk` (VARCHAR(20)) - KvK number
- `btw` (VARCHAR(20)) - VAT number
- `created_at`, `updated_at` (TIMESTAMP)

### 2. Contacten (Contacts)
- `id` (BIGSERIAL, Primary Key)
- `voornaam` (VARCHAR(100)) - First name
- `achternaam` (VARCHAR(100)) - Last name
- `email` (VARCHAR(255)) - Email
- `telefoon` (VARCHAR(20)) - Phone
- `bedrijf_id` (BIGINT, Foreign Key → bedrijven.id)
- `functie` (VARCHAR(100)) - Job title
- `created_at`, `updated_at` (TIMESTAMP)

### 3. Deals
- `id` (BIGSERIAL, Primary Key)
- `titel` (VARCHAR(255)) - Deal title
- `waarde` (DECIMAL(12,2)) - Deal value
- `stadium` (VARCHAR(50)) - Stage: Lead, Gekwalificeerd, Voorstel, Onderhandeling, Gewonnen, Verloren
- `bedrijf_id` (BIGINT, Foreign Key → bedrijven.id)
- `contact_id` (BIGINT, Foreign Key → contacten.id)
- `deadline` (DATE) - Deal deadline
- `kans` (INTEGER, 0-100) - Win probability
- `created_at`, `updated_at` (TIMESTAMP)

### 4. Projecten (Projects)
- `id` (BIGSERIAL, Primary Key)
- `naam` (VARCHAR(255)) - Project name
- `beschrijving` (TEXT) - Description
- `bedrijf_id` (BIGINT, Foreign Key → bedrijven.id)
- `status` (VARCHAR(50)) - Status: Actief, On Hold, Afgerond
- `voortgang` (INTEGER, 0-100) - Progress percentage
- `deadline` (DATE) - Project deadline
- `budget` (DECIMAL(12,2)) - Budget
- `budget_gebruikt` (DECIMAL(12,2)) - Budget used
- `created_at`, `updated_at` (TIMESTAMP)

### 5. Offertes (Quotes)
- `id` (BIGSERIAL, Primary Key)
- `nummer` (VARCHAR(50), Unique) - Quote number
- `klant` (VARCHAR(255)) - Customer name
- `bedrag` (DECIMAL(12,2)) - Amount
- `datum` (DATE) - Quote date
- `geldig_tot` (DATE) - Valid until
- `status` (VARCHAR(50)) - Status: Openstaand, Geaccepteerd, Afgewezen
- `bedrijf_id` (BIGINT, Foreign Key → bedrijven.id)
- `created_at`, `updated_at` (TIMESTAMP)

## Using Data Hooks

### Import the hooks

```typescript
import { 
  useBedrijven, 
  useBedrijf,
  useContacten,
  useDeals,
  useProjecten,
  useOffertes
} from '@/hooks/use-supabase'
```

### Basic Usage

```typescript
export default function BedrijvenPage() {
  // Fetch all companies
  const { data: bedrijven, loading, error, refetch } = useBedrijven()
  
  // Fetch a single company
  const { data: bedrijf } = useBedrijf(1)
  
  if (loading) return <div>Laden...</div>
  if (error) return <div>Fout: {error}</div>
  
  return (
    <div>
      {bedrijven?.map(bedrijf => (
        <div key={bedrijf.id}>
          <h2>{bedrijf.naam}</h2>
          <p>{bedrijf.stad}</p>
        </div>
      ))}
    </div>
  )
}
```

### All Available Hooks

- `useBedrijven()` - Get all companies
- `useBedrijf(id)` - Get single company by ID
- `useContacten()` - Get all contacts
- `useContact(id)` - Get single contact by ID
- `useDeals()` - Get all deals
- `useDeal(id)` - Get single deal by ID
- `useProjecten()` - Get all projects
- `useProject(id)` - Get single project by ID
- `useOffertes()` - Get all quotes
- `useOfferte(id)` - Get single quote by ID

## Mutations

### Create Record

```typescript
import { createRecord } from '@/hooks/use-supabase'

const handleCreateBedrijf = async () => {
  const result = await createRecord(
    'bedrijven',
    {
      naam: 'Nieuw Bedrijf',
      adres: 'Straat 1',
      postcode: '1000AA',
      stad: 'Amsterdam',
      email: 'info@nieuw.nl',
      telefoon: '020-1234567',
      kvk: '12345678',
      btw: 'NL123456789B01'
    },
    'Bedrijf succesvol aangemaakt'
  )
  
  if (result.success) {
    // Refetch data to show new record
    refetch()
  }
}
```

### Update Record

```typescript
import { updateRecord } from '@/hooks/use-supabase'

const handleUpdateBedrijf = async (bedrijfId: number) => {
  const result = await updateRecord(
    'bedrijven',
    bedrijfId,
    {
      naam: 'Bijgewerkte naam',
      email: 'nieuw@email.com'
    },
    'Bedrijf succesvol bijgewerkt'
  )
  
  if (result.success) {
    refetch()
  }
}
```

### Delete Record

```typescript
import { deleteRecord } from '@/hooks/use-supabase'

const handleDeleteBedrijf = async (bedrijfId: number) => {
  const result = await deleteRecord(
    'bedrijven',
    bedrijfId,
    'Bedrijf succesvol verwijderd'
  )
  
  if (result.success) {
    refetch()
  }
}
```

## Search Functionality

### Command Palette Search

The Command Palette (Ctrl/Cmd + K) now searches across all Supabase tables:

- **Bedrijven**: Searches by company name
- **Contacten**: Searches by last name
- **Deals**: Searches by deal title
- **Projecten**: Searches by project name
- **Offertes**: Searches by quote number

Features:
- Debounced search (300ms delay)
- Shows loading state while searching
- Displays up to 5 results per category
- Shows relevant metadata (city, function, value, status)
- Navigates to the relevant page when a result is selected

### Programmatic Search

```typescript
import { searchRecords } from '@/hooks/use-supabase'

const handleSearch = async () => {
  const result = await searchRecords('bedrijven', 'naam', 'ACME')
  
  if (result.data) {
    console.log('Found companies:', result.data)
  }
  
  if (result.error) {
    console.error('Search error:', result.error)
  }
}
```

## Toast Notifications

All mutation hooks automatically show toast notifications:

- **Success**: Green toast with success message
- **Error**: Red toast with error message

Example:
```typescript
toast({
  title: 'Succes',
  description: 'Bedrijf succesvol aangemaakt'
})
```

## Real-time Updates (Optional)

To add real-time subscriptions, you can extend the hooks:

```typescript
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

useEffect(() => {
  const subscription = supabase
    .channel('bedrijven_changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'bedrijven'
    }, (payload) => {
      console.log('Change received!', payload)
      refetch()
    })
    .subscribe()

  return () => {
    subscription.unsubscribe()
  }
}, [])
```

## Type Safety

All hooks are fully typed with TypeScript:

```typescript
// Type information is automatically inferred
const { data: bedrijven } = useBedrijven()
// bedrijven is typed as: Database['public']['Tables']['bedrijven']['Row'][] | null

bedrijven?.forEach(bedrijf => {
  // bedrijf.naam is string
  // bedrijf.kvk is string
  // TypeScript will warn if you access non-existent properties
})
```

## Performance

- **Debounced Search**: 300ms delay to reduce API calls
- **Parallel Queries**: Search queries run in parallel using Promise.all
- **Result Limiting**: Maximum 5 results per category
- **Indexes**: Database indexes on frequently searched columns

## Security

- Row Level Security (RLS) is enabled on all tables
- Currently set to allow all operations (demo mode)
- In production, update policies to enforce proper access control

Example RLS policy:

```sql
CREATE POLICY "Users can only see their own companies"
ON bedrijven
FOR SELECT
USING (auth.uid() = user_id);
```

## Troubleshooting

### Connection Issues

1. Check that environment variables are set correctly
2. Verify Supabase project URL and API keys
3. Check browser console for error messages
4. Ensure migration was executed successfully

### Search Not Working

1. Verify database tables exist
2. Check that sample data was inserted
3. Ensure Supabase client is properly configured
4. Check browser console for API errors

### Type Errors

1. Make sure to import types from `@/lib/supabase`
2. Use `Database['public']['Tables']['tableName']['Row']` for row types
3. Use `Database['public']['Tables']['tableName']['Insert']` for insert types
4. Use `Database['public']['Tables']['tableName']['Update']` for update types

## Next Steps

1. ✅ Execute SQL migration in Supabase
2. ✅ Test command palette search (Ctrl/Cmd + K)
3. ✅ Integrate data hooks into page components
4. ✅ Implement create/edit forms
5. ✅ Add real-time subscriptions
6. ✅ Update RLS policies for production

## Support

For issues or questions:
- Check Supabase documentation: https://supabase.com/docs
- Review the code in `src/hooks/use-supabase.ts`
- Look at example implementations in existing pages