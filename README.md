# TwinVerse — Smart Campus Digital Twin (Frontend)

Premium industrial-monitoring dashboard for a Seminar Hall digital twin.
Final-year engineering project frontend.

## Tech stack
- React 19 + Vite
- Tailwind CSS v4 (`@tailwindcss/vite` plugin — no tailwind.config.js needed)
- React Router DOM · Recharts · Lucide React · Framer Motion
- React Three Fiber (reserved for the 3D twin)

## Run it
```bash
npm install
npm run dev
```
Open http://localhost:5173

## Folder structure
```
src/
  assets/        images & static media
  components/    reusable UI (StatCard, GaugeCard, charts, ...)
    ui/          small shared primitives
  layout/        Sidebar, Navbar, AppLayout, Footer
  pages/         one file per route
  services/      API layer (stubs now, FastAPI later)
  hooks/         custom hooks
  data/          realistic mock data (mirrors future API shapes)
  routes/        nav.js (single nav source of truth) + AppRoutes.jsx
  utils/         formatters & helpers
  styles/        extra style modules if needed
```

## Design tokens
Defined in `src/index.css` under `@theme`:
background `#0B1120`, card `#111827`, sidebar `#0F172A`,
hairline borders `rgba(255,255,255,0.08)`, radius `18px`,
accent blue gradient, green/yellow/red status colors, Inter + JetBrains Mono.
Use them as Tailwind classes: `bg-card`, `text-ink-dim`, `border-line`,
`text-accent`, plus utilities `card`, `glass`, `text-gradient`.
