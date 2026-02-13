'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bot,
  Send,
  FileText,
  Calendar,
  TrendingUp,
  FileBarChart,
  Sparkles,
  User,
  Copy,
  ThumbsUp,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface Message {
  id: number
  role: 'assistant' | 'user'
  content: string
}

// Sample Data
const quickActions = [
  { label: "Genereer Offerte", icon: FileText, color: "from-blue-500 to-blue-600" },
  { label: "Samenvatting Week", icon: Calendar, color: "from-emerald-500 to-emerald-600" },
  { label: "Analyseer Deals", icon: TrendingUp, color: "from-purple-500 to-purple-600" },
  { label: "Maak Rapport", icon: FileBarChart, color: "from-amber-500 to-amber-600" },
]

const initialMessages: Message[] = [
  { id: 1, role: "assistant", content: "Hallo! Ik ben je AI Assistant. Ik kan je helpen met het genereren van offertes, analyseren van data en het maken van rapporten. Hoe kan ik je vandaag helpen?" },
  { id: 2, role: "user", content: "Geef me een overzicht van deze week" },
  { id: 3, role: "assistant", content: `Natuurlijk! Hier is je weekoverzicht:

📊 **Statistieken**
- 8 afspraken gepland
- 3 nieuwe deals (waarde: €45.000)
- 5 taken voltooid

💡 **Aanbevelingen**
- Follow-up met ACME BV (laatste contact: 5 dagen geleden)
- Factuur #2025-001 vervalt over 3 dagen` },
]

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>(() => initialMessages)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      toast({ title: 'Gekopieerd', description: 'Tekst is gekopieerd naar klembord.' })
    } catch {
      toast({ title: 'Kopiëren mislukt', description: 'Clipboard toegang is niet beschikbaar.', variant: 'destructive' })
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!inputValue.trim()) return

    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        role: 'user',
        content: inputValue,
      },
    ])
    setInputValue('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        "Ik heb je verzoek ontvangen en ben het aan het verwerken. Een moment geduld alsjeblieft...",
        "Dit is een interessante vraag! Laat me de relevante data analyseren om je het beste antwoord te geven.",
        "Ik heb de informatie gevonden die je nodig hebt. Hier zijn de details:\n\n💼 **Resultaten**\n- Alle systemen werken naar behoren\n- Geen kritieke problemen gedetecteerd\n- 3 optimisatie suggesties beschikbaar",
      ]
      
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)]
      
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          role: 'assistant',
          content: randomResponse,
        },
      ])
      setIsTyping(false)
    }, 1500)
  }

  const handleQuickAction = (action: string) => {
    setInputValue(action)
  }

  return (
    <div className="h-[calc(100vh-180px)] flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 shadow-lg shadow-purple-500/25">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">AI Assistant</h1>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-sm text-muted-foreground">Actief en klaar om te helpen</span>
            </div>
          </div>
        </div>
        <Badge className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-purple-600 border-purple-500/20 px-3 py-1">
          <Sparkles className="w-3 h-3 mr-1" />
          Archon AI
        </Badge>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-card/60 backdrop-blur-xl border border-border/30 rounded-2xl overflow-hidden flex flex-col hover:shadow-xl hover:bg-card/75 transition-[background-color,box-shadow,border-color] duration-300">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          <AnimatePresence>
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3",
                    message.role === 'user'
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                      : "bg-muted text-foreground/80"
                  )}
                >
                  <div className="whitespace-pre-line text-sm">
                    {message.content.split('\n').map((line, i) => {
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return <strong key={i} className="font-semibold">{line.replace(/\*\*/g, '')}</strong>
                      }
                      if (line.startsWith('- ')) {
                        return <div key={i} className="flex items-start gap-2"><span>•</span><span>{line.substring(2)}</span></div>
                      }
                      return <div key={i}>{line}</div>
                    })}
                  </div>
                  
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/30">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-muted-foreground hover:text-foreground"
                        onClick={() => handleCopy(message.content)}
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Kopieer
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-muted-foreground hover:text-foreground"
                        onClick={() =>
                          toast({
                            title: 'Feedback ontvangen',
                            description: 'Bedankt! We gebruiken dit om te verbeteren.',
                          })
                        }
                      >
                        <ThumbsUp className="w-3 h-3 mr-1" />
                        Nuttig
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-muted-foreground hover:text-foreground"
                        onClick={() =>
                          toast({
                            title: 'Opnieuw genereren',
                            description: 'Deze actie wordt binnenkort gekoppeld.',
                          })
                        }
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Opnieuw
                      </Button>
                    </div>
                  )}
                </div>
                {message.role === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    <User className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-muted rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-t border-border/30 bg-card/40">
          <p className="text-xs text-muted-foreground mb-3">Snelle acties</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction(action.label)}
                className="bg-card/60 backdrop-blur-xl border-border/30 hover:border-border/50"
              >
                <div className={cn("p-1 rounded mr-2 bg-gradient-to-br text-white", action.color)}>
                  <action.icon className="w-3 h-3" />
                </div>
                {action.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border/30">
          <div className="flex gap-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Typ je bericht..."
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-background/30 border-border/30 focus-visible:ring-2 focus-visible:ring-blue-500/20"
            />
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 transition-all duration-200"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
