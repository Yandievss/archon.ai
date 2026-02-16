'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2 } from 'lucide-react'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { toast } from '@/hooks/use-toast'

const companyFormSchema = z.object({
  name: z.string().min(1, 'Bedrijfsnaam is vereist'),
  sector: z.string().optional(),
  location: z.string().optional(),
  email: z.string().email('Geldig email adres vereist').optional().or(z.literal('')),
  phone: z.string().optional(),
  website: z.string().url('Geldig URL vereist').optional().or(z.literal('')),
  description: z.string().optional(),
})

type CompanyFormValues = z.infer<typeof companyFormSchema>

interface AddCompanyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export default function AddCompanyModal({
  open,
  onOpenChange,
  onSuccess,
}: AddCompanyModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: '',
      sector: '',
      location: '',
      email: '',
      phone: '',
      website: '',
      description: '',
    },
  })

  async function onSubmit(values: CompanyFormValues) {
    setIsSubmitting(true)
    try {
      const payload = {
        name: values.name,
        sector: values.sector || undefined,
        location: values.location || undefined,
        email: values.email || undefined,
        phone: values.phone || undefined,
        website: values.website || undefined,
        description: values.description || undefined,
        status: 'Actief',
      }

      const response = await fetch('/api/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        const details = body?.details?.[0]?.message
        throw new Error(details || body?.error || 'Kon bedrijf niet opslaan.')
      }

      toast({
        title: 'Succes!',
        description: `Bedrijf ${values.name} is aangemaakt.`,
      })
      form.reset()
      onOpenChange(false)
      onSuccess?.()
    } catch (error: any) {
      toast({
        title: 'Fout',
        description: error?.message ?? 'Kon bedrijf niet aanmaken.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-150">
        <DialogHeader>
          <DialogTitle>Nieuw Bedrijf</DialogTitle>
          <DialogDescription>
            Voeg een nieuw bedrijf toe aan je CRM systeem.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Naam *</FormLabel>
                  <FormControl>
                    <Input placeholder="Bedrijfsnaam" {...field} required aria-required={true} autoFocus />
                    {/* name field is required per schema */}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sector"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sector</FormLabel>
                    <FormControl>
                      <Input placeholder="Technologie" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Locatie</FormLabel>
                    <FormControl>
                      <Input placeholder="Amsterdam" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="info@bedrijf.nl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefoon</FormLabel>
                    <FormControl>
                      <Input placeholder="+31 20 123 4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="https://www.bedrijf.nl" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Beschrijving</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Optionele beschrijving van het bedrijf..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Annuleren
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Bedrijf Toevoegen
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
