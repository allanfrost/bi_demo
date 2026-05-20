# BI Briefing Spec

## Produkt

BI Briefing er en kunde-facing Progressive Web App til CFO'er, ledere og BI-konsulenter. Brugeren logger ind og får et kompakt dashboard med centrale forretningsnøgletal, en automatisk advarsel ved afvigelser og en AI-genereret ledelsesbriefing på dansk.

Produktets kernepitch:

> En CFO åbner appen, logger ind og får en kort dansk ledelsesbriefing baseret på virksomhedens vigtigste nøgletal.

## Målgruppe

- CFO'er og økonomiledere, der vil have hurtigt overblik.
- Direktører og ledelsesteams, der skal forstå status uden at åbne BI-værktøjer.
- BI-konsulenter, der vil demonstrere AI oven på eksisterende rapporteringsdata.

## Teknisk Stack

- Framework: Next.js 16, App Router, TypeScript
- UI: React 19
- Styling: Tailwind CSS only
- Charts: Recharts
- PWA: next-pwa
- AI: Anthropic Claude via Messages API
- Auth: Mock login med cookie-session
- Data: Statisk mock data i `lib/mock-data.ts`
- Deploy: Vercel via push til `main`

## Arkitektur

```text
app/
  layout.tsx
  page.tsx
  login/
    page.tsx
  dashboard/
    page.tsx
  api/
    login/
      route.ts
    logout/
      route.ts
    briefing/
      route.ts

components/
  AnomalyBanner.tsx
  BriefingPanel.tsx
  DashboardSessionView.tsx
  KpiCard.tsx
  LoadingSpinner.tsx
  LoginForm.tsx
  RevenueChart.tsx

lib/
  mock-data.ts
  mock-users.ts

public/
  manifest.json
  icons/
    icon-192.png
    icon-512.png
```

## Runtime Flow

1. Brugeren åbner `/`.
2. `app/page.tsx` redirecter til `/dashboard`.
3. `/dashboard` læser `bi_session` cookie server-side.
4. Hvis cookie mangler, redirectes brugeren til `/login`.
5. Login sker via `POST /api/login`.
6. Ved korrekt login gemmes `bi_session` som `<name>||<title>`.
7. Dashboardet viser KPI'er, chart, anomaly banner og AI briefing-panel.
8. Når brugeren klikker "Generer Briefing", sender frontend KPI'er og bruger-kontekst til `POST /api/briefing`.
9. API-routen kalder Anthropic og streamer dansk tekst tilbage til browseren.

## Auth

Auth er bevidst mock-baseret.

Demo-brugere ligger i `lib/mock-users.ts`:

- `cfo@kunde.dk` / `demo1234`
- `demo@integrator.dk` / `demo1234`

Session gemmes i cookie:

```text
bi_session=<name>||<title>
```

Der er ingen real auth, password hashing, database eller brugeradministration i denne demo.

## Data

Alle mock forretningsdata ligger i `lib/mock-data.ts`.

Dashboardet bruger:

- Omsætning
- Bruttomargin
- Aktive kunder
- Gennemsnitlig projektstørrelse
- 12 måneders omsætningsserie

Komponenter må ikke hardcode forretningsværdier. De skal modtage data som props eller importere fra `lib/mock-data.ts` på page/server-niveau.

## Eksisterende Features

### Login

- Dansk login-side
- Mock-brugere
- Cookie-session
- Logout via `POST /api/logout`
- Server-side route protection på `/dashboard`

### Dashboard

- Header med appnavn, brugerens navn/titel og logout
- KPI-grid med fire KPI-kort
- Statusdot for `ok`, `warn`, `critical`
- Trendvisning med op/ned-indikator
- Responsivt layout

### Revenue Chart

- Recharts line chart
- 12 måneders omsætningsdata
- Dansk valutaformattering
- Tooltip med fuld værdi

### Anomaly Banner

- Viser advarsel hvis en eller flere KPI'er har `warn` eller `critical`
- Bruttomargin er sat til `warn` i mock data
- Banner kan dismisses i den aktuelle browser-session

### AI Briefing

- Sender KPI'er og den indloggede brugers navn/titel til Anthropic
- Bruger dansk system prompt
- Streamer svar tilbage til UI'et
- Viser genereringstidspunkt
- Har copy-to-clipboard knap

## AI Context

Modellen får to typer input:

1. System prompt:

```text
Du er en erfaren BI-analytiker der skriver ledelsesrapporter for danske virksomheder.
Du modtager nøgletal og skriver en kort, præcis og professionel ledelsesbriefing på dansk.
Skriv i sammenhængende afsnit — ingen bullet points, ingen overskrifter.
Max 3 afsnit. Vær konkret om tallene. Det vigtigste først.
Afslut med én konkret anbefaling til ledelsen.
```

2. User prompt:

- Indlogget brugers navn og titel
- KPI label
- KPI formatted value
- KPI trend label
- KPI status
- KPI description

Modellen får ikke chart-serien, rå login credentials eller miljøvariabler.

## Miljøvariabler

`.env.local`:

```text
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-sonnet-4-6
```

`ANTHROPIC_MODEL` er valgfri. Hvis den mangler, bruges `claude-sonnet-4-6`.

## Lokalt Development Flow

Start appen med:

```powershell
.\start_local.ps1
```

Scriptet stopper gamle lokale Next dev-processer og starter appen på:

```text
http://localhost:3000
```

Alternativt:

```powershell
npm run dev
```

## Verification

Før commit bør følgende køre:

```powershell
npm run build
npm run lint
npm audit
```

Forventet status:

- Build passer
- Lint passer
- Audit viser `0 vulnerabilities`

## Git Workflow

- Arbejd på `main`
- Commit løbende efter afsluttede ændringer
- Push til `origin/main`
- Vercel deployer fra `main`

## Regler For Fremtidig Udvikling

- Al bruger-facing tekst skal være på dansk.
- Tailwind only. Ingen inline styles og ingen CSS modules.
- Hver komponent skal ligge i sin egen fil under `components/`.
- Mock-data skal ligge i `lib/mock-data.ts`.
- Mock-brugere skal ligge i `lib/mock-users.ts`.
- Nye features skal beskrives i en spec før implementering.
- Implementer kun det, der står i den aktive spec.
- Hvis noget er uklart, vælg den simpleste rimelige løsning og tilføj en kort kommentar i koden.
- Efter en feature er færdig, kør verification, commit og push.

## Foreslået Spec-Drevet Roadmap

### Feature 1: Company Context

Tilføj en virksomhedsprofil med branche, strategi, mål, risici og ledelsesfokus. AI-briefingen skal bruge denne kontekst, så output bliver mere forretningsspecifikt.

### Feature 2: Briefing Modes

Tilføj valgbare briefing-typer:

- Kort CFO-summary
- Bestyrelsesbriefing
- BI-konsulent analyse

Samme KPI-data skal give forskelligt output afhængigt af målgruppe og beslutningsniveau.

### Feature 3: Anomaly Drilldown

Gør anomaly banner klikbart og vis mulige forklaringer på afvigelsen. For bruttomargin kan kontekst fx være leveranceomkostninger, rabatter, projektmix og timepris.

## Definition Of Done

- Login virker for begge demo-brugere.
- `/dashboard` er protected.
- KPI-kort viser korrekte værdier.
- Anomaly banner vises ved `warn`.
- Revenue chart viser 12 måneder.
- AI briefing kan genereres med Anthropic key.
- Logout rydder session.
- Build, lint og audit passer.
- Ændringer er committed og pushed til `main`.
