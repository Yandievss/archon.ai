'use client'

import { useEffect } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global app error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-2xl border border-red-500/20 bg-card/70 p-8 text-center shadow-xl backdrop-blur-xl">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
          <AlertTriangle className="h-5 w-5 text-red-500" />
        </div>
        <h1 className="text-xl font-semibold text-foreground">Er ging iets mis</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          De applicatie kon deze actie niet voltooien. Probeer opnieuw.
        </p>
        <div className="mt-5 flex justify-center">
          <Button onClick={reset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Opnieuw laden
          </Button>
        </div>
      </div>
    </div>
  )
}
