# Fight Lab Trainer

Coach-facing PWA for building, running, and tracking martial arts training sessions.

## Owner
Yaniv — Fight Lab gym, Ramat HaHayal, Tel Aviv. BJJ / Muay Thai / MMA / Bags / Fitness.

## Stack
- React + Vite (PWA)
- Supabase (auth + PostgreSQL)
- Tailwind CSS
- React Router

## Run
```
npm run dev
```

## Supabase
- Project URL and anon key go in `.env.local` (not committed)
- Schema: see `supabase/schema.sql`

## Structure
```
src/
  components/   shared UI components
  pages/        route-level pages
  lib/          supabase client, helpers
  hooks/        custom React hooks
```

## Categories
- BJJ / Grappling
- Muay Thai / Kickboxing
- MMA
- Bags
- Fitness

## Session structure
A session has sections (warmup, techniques, sparring, cardio etc.)
Each section has items (technique name + optional notes)
