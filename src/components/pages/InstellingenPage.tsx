'use client'

import { useState } from 'react'
import {
  Settings,
  User,
  Building2,
  Bell,
  Puzzle,
  Camera,
  Mail,
  Phone,
  Lock,
  Globe,
  Image as ImageIcon,
  FileText,
  Check,
  ChevronRight,
  CreditCard,
  MapPin
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

// Sample Data
const userSettings = {
  profiel: {
    naam: "Innovars",
    email: "info@innovars.nl",
    telefoon: "+31 6 12345678",
    taal: "Nederlands",
  },
  bedrijf: {
    naam: "Innovars BV",
    adres: "Straatnaam 123, 1012 AB Amsterdam",
    kvk: "12345678",
    btw: "NL123456789B01",
  },
  notificaties: {
    emailNieuweDeal: true,
    emailFactuur: true,
    pushAfspraken: true,
    pushTaken: false,
    weeklyDigest: true,
    marketingEmails: false,
  },
}

const integraties = [
  { naam: "Slack", status: "Verbonden", icon: "💬", color: "bg-purple-500" },
  { naam: "Google Calendar", status: "Verbonden", icon: "📅", color: "bg-blue-500" },
  { naam: "Microsoft Teams", status: "Niet verbonden", icon: "👥", color: "bg-muted" },
  { naam: "Dropbox", status: "Niet verbonden", icon: "📦", color: "bg-muted" },
  { naam: "Zapier", status: "Verbonden", icon: "⚡", color: "bg-orange-500" },
  { naam: "QuickBooks", status: "Niet verbonden", icon: "📊", color: "bg-muted" },
]

export default function InstellingenPage() {
  const [activeTab, setActiveTab] = useState("profiel")
  const [notifications, setNotifications] = useState(userSettings.notificaties)

  const notifySave = (section: string) =>
    toast({
      title: 'Instellingen opgeslagen',
      description: `${section} instellingen zijn opgeslagen (demo).`,
    })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Instellingen</h1>
        <p className="text-muted-foreground">Beheer uw account en voorkeuren</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-card/60 backdrop-blur-xl border border-border/30 p-1 rounded-xl">
          <TabsTrigger
            value="profiel"
            className="data-[state=active]:bg-linear-to-r data-[state=active]:from-blue-500 data-[state=active]:to-sky-600 data-[state=active]:text-white rounded-lg transition-[background-color,box-shadow,border-color] duration-200"
          >
            <User className="w-4 h-4 mr-2" />
            Profiel
          </TabsTrigger>
          <TabsTrigger
            value="bedrijf"
            className="data-[state=active]:bg-linear-to-r data-[state=active]:from-blue-500 data-[state=active]:to-sky-600 data-[state=active]:text-white rounded-lg transition-[background-color,box-shadow,border-color] duration-200"
          >
            <Building2 className="w-4 h-4 mr-2" />
            Bedrijf
          </TabsTrigger>
          <TabsTrigger
            value="notificaties"
            className="data-[state=active]:bg-linear-to-r data-[state=active]:from-blue-500 data-[state=active]:to-sky-600 data-[state=active]:text-white rounded-lg transition-[background-color,box-shadow,border-color] duration-200"
          >
            <Bell className="w-4 h-4 mr-2" />
            Notificaties
          </TabsTrigger>
          <TabsTrigger
            value="integraties"
            className="data-[state=active]:bg-linear-to-r data-[state=active]:from-blue-500 data-[state=active]:to-sky-600 data-[state=active]:text-white rounded-lg transition-[background-color,box-shadow,border-color] duration-200"
          >
            <Puzzle className="w-4 h-4 mr-2" />
            Integraties
          </TabsTrigger>
        </TabsList>

        {/* Profiel Tab */}
        <TabsContent value="profiel">
          <div className="bg-card/60 backdrop-blur-xl border border-border/30 rounded-2xl p-6 hover:shadow-xl hover:bg-card/75 transition-[background-color,box-shadow,border-color] duration-300">
            <h2 className="text-lg font-semibold text-foreground mb-6">Profiel instellingen</h2>
            
            {/* Avatar */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border/30">
              <div className="relative">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-linear-to-br from-blue-500 to-sky-600 text-white text-xl">
                    IN
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-card border border-border/30 shadow-md hover:bg-muted/40"
                  onClick={() =>
                    toast({
                      title: 'Profielfoto',
                      description: 'Uploaden wordt geïmplementeerd.',
                    })
                  }
                >
                  <Camera className="w-4 h-4 text-muted-foreground" />
                </Button>
              </div>
              <div>
                <p className="font-medium text-foreground">{userSettings.profiel.naam}</p>
                <p className="text-sm text-muted-foreground">{userSettings.profiel.email}</p>
              </div>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="naam" className="text-foreground/80">Naam</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="naam"
                    defaultValue={userSettings.profiel.naam}
                    className="pl-10 bg-background/30 border-border/30 focus-visible:ring-2 focus-visible:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground/80">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    defaultValue={userSettings.profiel.email}
                    className="pl-10 bg-background/30 border-border/30 focus-visible:ring-2 focus-visible:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefoon" className="text-foreground/80">Telefoon</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="telefoon"
                    defaultValue={userSettings.profiel.telefoon}
                    className="pl-10 bg-background/30 border-border/30 focus-visible:ring-2 focus-visible:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="taal" className="text-foreground/80">Taal</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                  <Select defaultValue="nl">
                    <SelectTrigger className="pl-10 bg-background/30 border-border/30 focus:ring-2 focus:ring-blue-500/20">
                      <SelectValue placeholder="Selecteer taal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nl">🇳🇱 Nederlands</SelectItem>
                      <SelectItem value="en">🇬🇧 English</SelectItem>
                      <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                      <SelectItem value="fr">🇫🇷 Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div className="mt-6 pt-6 border-t border-border/30">
              <h3 className="font-medium text-foreground mb-4">Wachtwoord wijzigen</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="huidig-wachtwoord" className="text-foreground/80">Huidig wachtwoord</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="huidig-wachtwoord"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 bg-background/30 border-border/30 focus-visible:ring-2 focus-visible:ring-blue-500/20"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nieuw-wachtwoord" className="text-foreground/80">Nieuw wachtwoord</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="nieuw-wachtwoord"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 bg-background/30 border-border/30 focus-visible:ring-2 focus-visible:ring-blue-500/20"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                className="bg-linear-to-r from-blue-500 to-sky-600 hover:from-blue-600 hover:to-sky-700 text-white shadow-lg shadow-blue-500/25 transition-[background-color,box-shadow,border-color] duration-200"
                onClick={() => notifySave('Profiel')}
              >
                <Check className="w-4 h-4 mr-2" />
                Wijzigingen opslaan
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Bedrijf Tab */}
        <TabsContent value="bedrijf">
          <div className="bg-card/60 backdrop-blur-xl border border-border/30 rounded-2xl p-6 hover:shadow-xl hover:bg-card/75 transition-[background-color,box-shadow,border-color] duration-300">
            <h2 className="text-lg font-semibold text-foreground mb-6">Bedrijfsgegevens</h2>

            {/* Logo */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border/30">
              <div className="w-16 h-16 rounded-xl bg-muted border border-border/30 flex items-center justify-center">
                <Building2 className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-card/60 border-border/30"
                  onClick={() =>
                    toast({
                      title: 'Bedrijfslogo',
                      description: 'Uploaden wordt geïmplementeerd.',
                    })
                  }
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Logo uploaden
                </Button>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG tot 2MB</p>
              </div>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="bedrijfsnaam" className="text-foreground/80">Bedrijfsnaam</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="bedrijfsnaam"
                    defaultValue={userSettings.bedrijf.naam}
                    className="pl-10 bg-background/30 border-border/30 focus-visible:ring-2 focus-visible:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adres" className="text-foreground/80">Adres</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="adres"
                    defaultValue={userSettings.bedrijf.adres}
                    className="pl-10 bg-background/30 border-border/30 focus-visible:ring-2 focus-visible:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="kvk" className="text-foreground/80">KvK-nummer</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="kvk"
                    defaultValue={userSettings.bedrijf.kvk}
                    className="pl-10 bg-background/30 border-border/30 focus-visible:ring-2 focus-visible:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="btw" className="text-foreground/80">BTW-nummer</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="btw"
                    defaultValue={userSettings.bedrijf.btw}
                    className="pl-10 bg-background/30 border-border/30 focus-visible:ring-2 focus-visible:ring-blue-500/20"
                  />
                </div>
              </div>
            </div>

            {/* Invoice Settings */}
            <div className="mt-6 pt-6 border-t border-border/30">
              <h3 className="font-medium text-foreground mb-4">Factuur instellingen</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="prefix" className="text-foreground/80">Factuurnummer prefix</Label>
                  <Input
                    id="prefix"
                    defaultValue="FACT-"
                    className="bg-background/30 border-border/30 focus-visible:ring-2 focus-visible:ring-blue-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="betaaltermijn" className="text-foreground/80">Standaard betaaltermijn</Label>
                  <Select defaultValue="14">
                    <SelectTrigger className="bg-background/30 border-border/30 focus:ring-2 focus:ring-blue-500/20">
                      <SelectValue placeholder="Selecteer termijn" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="14">14 dagen</SelectItem>
                      <SelectItem value="30">30 dagen</SelectItem>
                      <SelectItem value="60">60 dagen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                className="bg-linear-to-r from-blue-500 to-sky-600 hover:from-blue-600 hover:to-sky-700 text-white shadow-lg shadow-blue-500/25 transition-[background-color,box-shadow,border-color] duration-200"
                onClick={() => notifySave('Bedrijf')}
              >
                <Check className="w-4 h-4 mr-2" />
                Wijzigingen opslaan
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Notificaties Tab */}
        <TabsContent value="notificaties">
          <div className="bg-card/60 backdrop-blur-xl border border-border/30 rounded-2xl p-6 hover:shadow-xl hover:bg-card/75 transition-[background-color,box-shadow,border-color] duration-300">
            <h2 className="text-lg font-semibold text-foreground mb-6">Notificatie voorkeuren</h2>

            {/* Email Notifications */}
            <div className="mb-6">
              <h3 className="font-medium text-foreground/80 mb-4 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email notificaties
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-card/40 border border-border/30">
                  <div>
                    <p className="font-medium text-foreground">Nieuwe deal</p>
                    <p className="text-sm text-muted-foreground">Ontvang een email bij elke nieuwe deal</p>
                  </div>
                  <Switch
                    checked={notifications.emailNieuweDeal}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, emailNieuweDeal: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-card/40 border border-border/30">
                  <div>
                    <p className="font-medium text-foreground">Factuur status</p>
                    <p className="text-sm text-muted-foreground">Ontvang updates over factuur betalingen</p>
                  </div>
                  <Switch
                    checked={notifications.emailFactuur}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, emailFactuur: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-card/40 border border-border/30">
                  <div>
                    <p className="font-medium text-foreground">Wekelijks overzicht</p>
                    <p className="text-sm text-muted-foreground">Ontvang een wekelijkse samenvatting per email</p>
                  </div>
                  <Switch
                    checked={notifications.weeklyDigest}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyDigest: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-card/40 border border-border/30">
                  <div>
                    <p className="font-medium text-foreground">Marketing emails</p>
                    <p className="text-sm text-muted-foreground">Ontvang tips en product updates</p>
                  </div>
                  <Switch
                    checked={notifications.marketingEmails}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, marketingEmails: checked })}
                  />
                </div>
              </div>
            </div>

            {/* Push Notifications */}
            <div className="pt-6 border-t border-border/30">
              <h3 className="font-medium text-foreground/80 mb-4 flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Push notificaties
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-card/40 border border-border/30">
                  <div>
                    <p className="font-medium text-foreground">Afspraak herinneringen</p>
                    <p className="text-sm text-muted-foreground">Ontvang herinneringen voor aankomende afspraken</p>
                  </div>
                  <Switch
                    checked={notifications.pushAfspraken}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, pushAfspraken: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-card/40 border border-border/30">
                  <div>
                    <p className="font-medium text-foreground">Taak deadlines</p>
                    <p className="text-sm text-muted-foreground">Ontvang notificaties voor taken met deadlines</p>
                  </div>
                  <Switch
                    checked={notifications.pushTaken}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, pushTaken: checked })}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                className="bg-linear-to-r from-blue-500 to-sky-600 hover:from-blue-600 hover:to-sky-700 text-white shadow-lg shadow-blue-500/25 transition-[background-color,box-shadow,border-color] duration-200"
                onClick={() => notifySave('Notificaties')}
              >
                <Check className="w-4 h-4 mr-2" />
                Voorkeuren opslaan
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Integraties Tab */}
        <TabsContent value="integraties">
          <div className="bg-card/60 backdrop-blur-xl border border-border/30 rounded-2xl p-6 hover:shadow-xl hover:bg-card/75 transition-[background-color,box-shadow,border-color] duration-300">
            <h2 className="text-lg font-semibold text-foreground mb-6">App integraties</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {integraties.map((integratie) => (
                <div
                  key={integratie.naam}
                  className="flex items-center justify-between p-4 rounded-xl bg-card/40 border border-border/30 hover:border-border/50 hover:bg-card/60 hover:shadow-md transition-[background-color,box-shadow,border-color] duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-xl">
                      {integratie.icon}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{integratie.naam}</p>
                      <p className={cn(
                        "text-xs",
                        integratie.status === "Verbonden" ? "text-emerald-600" : "text-muted-foreground"
                      )}>
                        {integratie.status}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      integratie.status === "Verbonden"
                        ? "border-emerald-500/20 text-emerald-600 hover:bg-emerald-500/10"
                        : "border-border/30 text-muted-foreground hover:bg-muted/40"
                    )}
                    onClick={() =>
                      toast({
                        title: integratie.status === 'Verbonden' ? 'Integratie' : 'Integratie Verbinden',
                        description:
                          integratie.status === 'Verbonden'
                            ? `${integratie.naam} is al verbonden (demo).`
                            : `${integratie.naam} verbinden wordt geïmplementeerd.`,
                      })
                    }
                  >
                    {integratie.status === "Verbonden" ? (
                      <>
                        <Check className="w-4 h-4 mr-1" />
                        Verbonden
                      </>
                    ) : (
                      <>
                        Verbinden
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
