# Projectrules — systematisch overzicht

**Doel:** Eén plek om te zien welke regels er zijn en waar ze staan.
**Cursor:** Regels in `.cursor/rules/*.mdc` worden automatisch toegepast (altijd of per bestandstype).

---

## 1. Altijd van toepassing (alwaysApply: true)

| Regel | Bestand | Inhoud |
|-------|---------|--------|
| **Missie & communicatie** | `.cursor/rules/archonpro-mission.mdc` | Missie, Nederlands, rapportage (wat veranderd/gevalideerd/pending), Definition of Done |
| **Veiligheidslimieten** | `.cursor/rules/archonpro-safety.mdc` | Max 10 bestanden, ~400 LOC, geen deps, stop & vraag, niet-onderhandelbare punten |
| **Quality gates** | `.cursor/rules/archonpro-quality-gates.mdc` | typecheck, lint, build, e2e; nooit claimen zonder te runnen; nuttige commando’s |
| **Projectcontext** | `.cursor/rules/archonpro-context.mdc` | Stack, paden (page.tsx, dashboard, api), navigatie-sync |
| **Visie (automatisering & AI)** | `.cursor/rules/archonpro-visie.mdc` | Dashboard geautomatiseerd; AI overal; offerte = afmetingen + foto's + korte tekst → AI maakt offerte. Zie `docs/requirements-visie.md`. |

---

## 2. Per bestandstype (globs)

| Regel | Bestand | Van toepassing op | Inhoud |
|-------|---------|-------------------|--------|
| **UI & controls** | `.cursor/rules/archonpro-ui-controls.mdc` | `**/*.tsx` | Clickable = nav/state/mutatie; Binnenkort; skeleton/toast; uitvoerprotocol |
| **API** | `.cursor/rules/archonpro-api.mdc` | `src/app/api/**/*.ts` | Input validatie, statuscodes, Prisma/Supabase, data-protocol |
| **Task queue** | `.cursor/rules/archonpro-tasks.mdc` | `tasks/**/*.md`, `docs/task-queue.md` | Eén task per run, TASK-nummering, task-queue.md bijwerken, inhoud TASK-bestand |

---

## 3. Volgorde van toepassing (logisch)

1. **Context** — weet waar je werkt (stack, paden).
2. **Missie** — weet wat “klaar” is (rapportage, DoD).
3. **Safety** — respecteer limieten en stop-regels.
4. **Quality** — run checks en rapporteer bewijs.
5. **UI of API of Tasks** — afhankelijk van de bestanden waar je in werkt.

---

## 4. Volledige referentie

Voor de volledige tekst van alle agent-instructies (inclusief prompt voor Codex): **`AGENTS.md`** in de projectroot.

---

## 5. Wijzigingen aan regels

- **Cursor-rules aanpassen:** bestanden in `.cursor/rules/` bewerken (`.mdc` met YAML frontmatter).
- **Dit overzicht bijwerken:** `docs/project-rules.md` (dit bestand) aanpassen wanneer je regels toevoegt, verwijdert of hernoemt.
