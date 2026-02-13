# ArchonPro CRM - Interactieve Elementen Inventarisatie

## STAP 1: Inventarisatie van alle interactieve elementen

### 1. Dashboard / Ga van start (DashboardHome.tsx)
- **Knoppen:**
  - [ ] "Activiteit" knop - scrollt naar recente activiteit
  - [ ] "AI Assistant" knop - navigeert naar ai-assistant pagina
  - [ ] "Meer opties" knop (Deals Status) - toont toast
  - [ ] "Bekijk alles" knop (Recente Activiteit) - toont toast
  - [ ] "Alle taken" knop - toont toast
  - [ ] Quick Actions (6 knoppen):
    - [ ] "Nieuwe Deal" - navigeert naar deals pagina
    - [ ] "Nieuwe Factuur" - navigeert naar inkomsten pagina
    - [ ] "Nieuw Contact" - navigeert naar contacten pagina
    - [ ] "Afspraak" - navigeert naar agenda pagina
    - [ ] "Nieuw Project" - navigeert naar projecten pagina
    - [ ] "AI Hulp" - navigeert naar ai-assistant pagina

### 2. Topbar (DashboardHeader.tsx)
- **Knoppen:**
  - [ ] Mobile Menu knop - opent mobile sidebar
  - [ ] Zoekbalk - opent command palette
  - [ ] Thema wissel knop - wisselt light/dark mode
  - [ ] Meldingen knop - toont toast
  - [ ] Account knop - toont toast
  - [ ] Upgrade knop - toont toast
  - [ ] Plus knop (Nieuwe actie) - toont toast

### 3. Sidebar (DesktopSidebar.tsx & MobileSidebar.tsx)
- **Navigatie items (12):**
  - [ ] Ga van start - navigeert naar home
  - [ ] Bedrijven - navigeert naar bedrijven pagina
  - [ ] Contacten - navigeert naar contacten pagina
  - [ ] Deals - navigeert naar deals pagina
  - [ ] Offertes - navigeert naar offertes pagina
  - [ ] Projecten - navigeert naar projecten pagina
  - [ ] Agenda - navigeert naar agenda pagina
  - [ ] Inkomsten - navigeert naar inkomsten pagina
  - [ ] Uitgaven - navigeert naar uitgaven pagina
  - [ ] Artikelen - navigeert naar artikelen pagina
  - [ ] Timesheets - navigeert naar timesheets pagina
  - [ ] Betalingen - navigeert naar betalingen pagina
- **Bottom navigatie (4):**
  - [ ] AI Assistant - navigeert naar ai-assistant pagina
  - [ ] Abonnement - navigeert naar abonnement pagina
  - [ ] Instellingen - navigeert naar instellingen pagina
  - [ ] Uitloggen - logt uit
- **Sidebar toggle knop** - toont/verbergt sidebar

### 4. Bedrijven pagina (BedrijvenPage.tsx)
- **Header:**
  - [ ] "Nieuw Bedrijf" knop - moet bedrijf aanmaken modal openen
- **Filters:**
  - [ ] Zoek input - filtert bedrijven
  - [ ] Status dropdown - filtert op status
  - [ ] Sector dropdown - filtert op sector
  - [ ] Sorteren dropdown - sorteert resultaten
- **Tabel rij acties:**
  - [ ] Bekijk knop (Eye icon) - moet bedrijf details tonen
  - [ ] Bewerken knop (Pencil icon) - moet bedrijf bewerken modal openen
  - [ ] Verwijderen knop (Trash icon) - moet bedrijf verwijderen met confirm
- **Paginatie:**
  - [ ] Vorige knop - navigeert naar vorige pagina
  - [ ] Pagina nummers - navigeert naar specifieke pagina
  - [ ] Volgende knop - navigeert naar volgende pagina

### 5. Contacten pagina (ContactenPage.tsx)
- **Header:**
  - [ ] "Nieuw Contact" knop - moet contact aanmaken modal openen
- **Filters:**
  - [ ] Zoek input - filtert contacten
  - [ ] Bedrijf dropdown - filtert op bedrijf
  - [ ] Functie dropdown - filtert op functie
- **Contact kaarten:**
  - [ ] Contact naam - moet contact details tonen
  - [ ] Email link - opent email client
  - [ ] Telefoon link - opent telefoon app
  - [ ] Dropdown menu (MoreHorizontal):
    - [ ] Bekijken - moet contact details tonen
    - [ ] Bewerken - moet contact bewerken modal openen
    - [ ] Verwijderen - moet contact verwijderen met confirm

### 6. Deals pagina (DealsPage.tsx)
- **Header:**
  - [ ] "Nieuwe Deal" knop - moet deal aanmaken modal openen
- **Quick Actions:**
  - [ ] "Nieuwe Deal" knop - moet deal aanmaken modal openen
  - [ ] "Offerte Maken" knop - moet offerte aanmaken modal openen
  - [ ] "Follow-up" knop - moet follow-up actie tonen
  - [ ] "Rapportage" knop - moet rapportage tonen
- **Kanban board:**
  - [ ] Deal kaarten - moeten drag & drop ondersteunen tussen kolommen
  - [ ] Deal dropdown menu (MoreHorizontal):
    - [ ] Bewerken - moet deal bewerken modal openen
    - [ ] Kopiëren - moet deal kopiëren
    - [ ] Verwijderen - moet deal verwijderen met confirm
  - [ ] "Deal toevoegen" knop per kolom - moet deal aanmaken modal openen

### 7. Discussies paneel (StaticThreads.tsx)
- **Tabs:**
  - [ ] "Discussies" tab - toont discussies lijst
  - [ ] "Kanalen" tab - toont kanalen lijst
- **Discussies:**
  - [ ] Discussie item - moet discussie openen/detail tonen
  - [ ] "Nieuwe discussie" knop - moet nieuwe discussie aanmaken modal openen
- **Kanalen:**
  - [ ] Kanaal item - moet kanaal openen/joinen
  - [ ] "Nieuw kanaal" knop - moet nieuw kanaal aanmaken modal openen

### 8. Command Palette (DashboardCommandPalette.tsx)
- [ ] Command palette - moet zoekfunctionaliteit hebben voor navigatie

### 9. Nog te implementeren pagina's
- [ ] OffertesPage.tsx - needs implementation
- [ ] ProjectenPage.tsx - needs implementation  
- [ ] AgendaPage.tsx - needs implementation
- [ ] InkomstenPage.tsx - needs implementation
- [ ] UitgavenPage.tsx - needs implementation
- [ ] ArtikelenPage.tsx - needs implementation
- [ ] TimesheetsPage.tsx - needs implementation
- [ ] BetalingenPage.tsx - needs implementation
- [ ] AIAssistantPage.tsx - needs implementation
- [ ] AbonnementPage.tsx - needs implementation
- [ ] InstellingenPage.tsx - needs implementation

## Totaal aantal interactieve elementen: ~100+

## Volgende stap: STAP 2 - Interactie-contract implementeren
Zorg dat elke knop een actie heeft (route/modal/API/toast)