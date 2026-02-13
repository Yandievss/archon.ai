'use client'

import { useState } from 'react'
import { Bot, Sparkles, Send, Lightbulb, Clock3, ArrowUpRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'

const quickPrompts = [
  'Vat de openstaande deals samen en markeer risico’s.',
  'Maak een concept opvolgmail voor klanten met facturen > 30 dagen.',
  'Welke projecten lopen risico op budgetoverschrijding?',
]

export default function AIAssistantPage() {
  const [prompt, setPrompt] = useState('')

  const submitPrompt = () => {
    if (!prompt.trim()) {
      toast({
        title: 'Lege prompt',
        description: 'Voer eerst een vraag in voor de AI Assistant.',
      })
      return
    }

    toast({
      title: 'Prompt verzonden',
      description: 'De AI Assistant verwerkt uw vraag in de demo-omgeving.',
    })
    setPrompt('')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-bold text-foreground">
            <span className="rounded-xl bg-linear-to-br from-violet-500/20 to-blue-500/20 p-2">
              <Bot className="h-6 w-6 text-violet-500" />
            </span>
            AI Assistant
          </h1>
          <p className="mt-1 text-muted-foreground">Workflow-assistent voor sales, projecten en operations.</p>
        </div>

        <Button
          className="bg-linear-to-r from-violet-500 to-blue-600 text-white hover:from-violet-600 hover:to-blue-700"
          onClick={() =>
            toast({
              title: 'Nieuwe sessie',
              description: 'Een nieuwe AI-sessie wordt gestart.',
            })
          }
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Nieuwe sessie
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="bg-card/60 backdrop-blur-xl border-border/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Taken afgerond</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-foreground">18</CardContent>
        </Card>
        <Card className="bg-card/60 backdrop-blur-xl border-border/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Gem. responstijd</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2 text-2xl font-semibold text-foreground">
            <Clock3 className="h-5 w-5 text-sky-500" />
            4.2s
          </CardContent>
        </Card>
        <Card className="bg-card/60 backdrop-blur-xl border-border/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">AI suggesties</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2 text-2xl font-semibold text-foreground">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            7 actief
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/60 backdrop-blur-xl border-border/30">
        <CardHeader>
          <CardTitle>Vraag aan de assistant</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Bijv. Genereer een wekelijkse sales samenvatting..."
              className="bg-background/40"
            />
            <Button onClick={submitPrompt}>
              <Send className="mr-2 h-4 w-4" />
              Verstuur
            </Button>
          </div>

          <div className="space-y-2">
            {quickPrompts.map((item) => (
              <button
                key={item}
                type="button"
                className="flex w-full items-center justify-between rounded-lg border border-border/30 bg-background/20 px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-background/35"
                onClick={() => setPrompt(item)}
              >
                <span>{item}</span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
