import { useState, useEffect } from 'react'
import { supabase, Database } from '@/lib/supabase'
import { toast } from '@/hooks/use-toast'

// Generic type for Supabase queries
type QueryResult<T> = {
  data: T[] | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

// Generic hook for fetching data
export function useSupabaseQuery<T>(
  tableName: string,
  select: string = '*',
  filters?: Record<string, any>
): QueryResult<T> {
  const [data, setData] = useState<T[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      let query = supabase.from(tableName).select(select)
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          query = query.eq(key, value)
        })
      }
      
      const { data: result, error: err } = await query
      
      if (err) throw err
      
      setData(result as T[])
    } catch (err: any) {
      setError(err.message)
      console.error(`Error fetching ${tableName}:`, err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [tableName, select])

  return { data, loading, error, refetch: fetchData }
}

// Bedrijven hooks
export function useBedrijven() {
  return useSupabaseQuery<Database['public']['Tables']['bedrijven']['Row']>('bedrijven')
}

export function useBedrijf(id: number) {
  return useSupabaseQuery<Database['public']['Tables']['bedrijven']['Row']>(
    'bedrijven',
    '*',
    { id }
  )
}

// Contacten hooks
export function useContacten() {
  return useSupabaseQuery<Database['public']['Tables']['contacten']['Row']>('contacten')
}

export function useContact(id: number) {
  return useSupabaseQuery<Database['public']['Tables']['contacten']['Row']>(
    'contacten',
    '*',
    { id }
  )
}

// Deals hooks
export function useDeals() {
  return useSupabaseQuery<Database['public']['Tables']['deals']['Row']>('deals')
}

export function useDeal(id: number) {
  return useSupabaseQuery<Database['public']['Tables']['deals']['Row']>(
    'deals',
    '*',
    { id }
  )
}

// Projecten hooks
export function useProjecten() {
  return useSupabaseQuery<Database['public']['Tables']['projecten']['Row']>('projecten')
}

export function useProject(id: number) {
  return useSupabaseQuery<Database['public']['Tables']['projecten']['Row']>(
    'projecten',
    '*',
    { id }
  )
}

// Offertes hooks
export function useOffertes() {
  return useSupabaseQuery<Database['public']['Tables']['offertes']['Row']>('offertes')
}

export function useOfferte(id: number) {
  return useSupabaseQuery<Database['public']['Tables']['offertes']['Row']>(
    'offertes',
    '*',
    { id }
  )
}

// Mutation helpers
export async function createRecord<T>(
  tableName: string,
  data: T,
  successMessage: string
) {
  try {
    const { error } = await supabase.from(tableName).insert(data)
    
    if (error) throw error
    
    toast({
      title: 'Succes',
      description: successMessage,
    })
    
    return { success: true }
  } catch (error: any) {
    toast({
      title: 'Fout',
      description: error.message,
      variant: 'destructive',
    })
    
    return { success: false, error }
  }
}

export async function updateRecord<T>(
  tableName: string,
  id: number,
  data: T,
  successMessage: string
) {
  try {
    const { error } = await supabase.from(tableName).update(data).eq('id', id)
    
    if (error) throw error
    
    toast({
      title: 'Succes',
      description: successMessage,
    })
    
    return { success: true }
  } catch (error: any) {
    toast({
      title: 'Fout',
      description: error.message,
      variant: 'destructive',
    })
    
    return { success: false, error }
  }
}

export async function deleteRecord(
  tableName: string,
  id: number,
  successMessage: string
) {
  try {
    const { error } = await supabase.from(tableName).delete().eq('id', id)
    
    if (error) throw error
    
    toast({
      title: 'Succes',
      description: successMessage,
    })
    
    return { success: true }
  } catch (error: any) {
    toast({
      title: 'Fout',
      description: error.message,
      variant: 'destructive',
    })
    
    return { success: false, error }
  }
}

// Search functionality
export async function searchRecords(
  tableName: string,
  column: string,
  query: string
) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .ilike(column, `%${query}%`)
      .limit(10)
    
    if (error) throw error
    
    return { data, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}