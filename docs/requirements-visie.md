# Vereisten — Visie: automatisering & AI

**Doel:** Dashboard geautomatiseerd; AI overal toepasbaar; offertes vanuit korte omschrijving + afmetingen + foto’s door AI laten maken.

---

## 1. Dashboard moet geautomatiseerd zijn

- Waar mogelijk **automatisering** in het dashboard (geen handmatige stappen die de software kan doen).
- Denk aan: automatische nummering, standaardwaarden, hergebruik van klantgegevens, status-updates op basis van acties.

---

## 2. AI overal toepasbaar

- **AI** moet op meerdere plekken ingezet kunnen worden, niet alleen op één pagina.
- Voorbeelden: suggesties bij contacten/deals, samenvattingen, inschattingen, teksten genereren, offerte-opbouw.
- Architectuur en UI zo houden dat AI-stappen later overal toegevoegd kunnen worden (bijv. “AI-voorstel” of “Genereer met AI”).

---

## 3. Offerte maken: afmetingen + foto’s + AI

Voor **offertes** moet het volgende kunnen:

- **Afmetingen** toevoegen (lengte, breedte, hoogte; per ruimte indien nodig; eenheid kiezen).
- **Foto’s** toevoegen (van de locatie/ruimte/product).
- **Korte omschrijving** invoeren, bijv.:
  - “laminaat leggen”
  - “vloer renoveren”
  - “keuken plaatsen”
- **AI maakt de offerte** op basis van:
  - de korte omschrijving (bv. “laminaat leggen”),
  - de afmetingen,
  - de foto’s (optioneel),
  - en eventueel bestaande klant/offerte-context.

Resultaat: een uitgewerkte offerte (regels, beschrijvingen, prijsindicatie) die de gebruiker nog kan aanpassen.

---

## 4. Huidige stand (referentie)

- API offertes: **afmetingen** (o.a. `lengte`, `breedte`, `hoogte`, `rooms`) en **foto’s** (`fotos` / `ai_fotos`) bestaan al.
- Er is al **AI-analyse** (samenvatting, scope, aanbevelingen, risico’s, complexiteit) op bestaande offertes.
- **Nog te bouwen/uitbreiden:** flow waarbij de gebruiker alleen “korte omschrijving + afmetingen + foto’s” invult en AI de **volledige offerte** (tekst + regels) genereert.

---

## 5. Prioriteit voor ontwikkeling

1. **Offerte-flow:** UI + API voor “korte omschrijving + afmetingen + foto’s” → AI genereert offerte (tekst/regels).
2. **Dashboard-automatisering:** Bestaande flows verder automatiseren (nummering, defaults, status).
3. **AI elders:** AI-opties toevoegen op andere pagina’s (contacten, deals, projecten) binnen dezelfde architectuur.

Werk blijft binnen projectregels: max 10 bestanden, ~400 LOC per taak; grote wijzigingen opsplitsen.
