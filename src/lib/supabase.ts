import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for Supabase tables
export type Database = {
  public: {
    Tables: {
      bedrijven: {
        Row: {
          id: number
          naam: string
          adres: string
          postcode: string
          stad: string
          email: string
          telefoon: string
          kvk: string
          btw: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['bedrijven']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['bedrijven']['Insert']>
      }
      contacten: {
        Row: {
          id: number
          voornaam: string
          achternaam: string
          email: string
          telefoon: string
          bedrijf_id: number | null
          functie: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['contacten']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['contacten']['Insert']>
      }
      deals: {
        Row: {
          id: number
          titel: string
          waarde: number
          stadium: 'Lead' | 'Gekwalificeerd' | 'Voorstel' | 'Onderhandeling' | 'Gewonnen' | 'Verloren'
          bedrijf_id: number | null
          contact_id: number | null
          deadline: string | null
          kans: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['deals']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['deals']['Insert']>
      }
      projecten: {
        Row: {
          id: number
          naam: string
          beschrijving: string
          bedrijf_id: number | null
          status: 'Actief' | 'On Hold' | 'Afgerond'
          voortgang: number
          deadline: string | null
          budget: number
          budget_gebruikt: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['projecten']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['projecten']['Insert']>
      }
      offertes: {
        Row: {
          id: number
          nummer: string
          klant: string
          bedrag: number
          datum: string
          geldig_tot: string
          status: 'Openstaand' | 'Geaccepteerd' | 'Afgewezen'
          bedrijf_id: number | null
          ai_fotos: unknown[]
          ai_afmetingen: Record<string, unknown>
          ai_analyse: Record<string, unknown> | null
          ai_analyse_status: string
          ai_analyse_fout: string | null
          ai_analyse_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          nummer: string
          klant: string
          bedrag: number
          datum: string
          geldig_tot: string
          status: 'Openstaand' | 'Geaccepteerd' | 'Afgewezen'
          bedrijf_id: number | null
          ai_fotos?: unknown[]
          ai_afmetingen?: Record<string, unknown>
          ai_analyse?: Record<string, unknown> | null
          ai_analyse_status?: string
          ai_analyse_fout?: string | null
          ai_analyse_at?: string | null
        }
        Update: Partial<Database['public']['Tables']['offertes']['Insert']>
      }
    }
  }
}
