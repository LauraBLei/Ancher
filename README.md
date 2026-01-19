# Ancher

A cross-platform app built with Next.js (web) and Expo (mobile), powered by Supabase.

## Project Structure

```
ancher/
├─ apps/
│  ├─ web/             # Next.js website / web app
│  └─ mobile/          # Expo mobile app
├─ packages/
│  ├─ core/            # Shared business logic
│  ├─ ui/              # Shared UI components
│  └─ supabase/        # Supabase client + types
└─ supabase/           # DB schema, migrations, RLS policies
```

## Tech Stack

- **Web**: Next.js + React + Tailwind CSS
- **Mobile**: Expo + React Native + NativeWind
- **Backend**: Supabase (Auth, Database, Storage)
- **Language**: TypeScript
- **Monorepo**: Turborepo

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

```bash
pnpm install
```

### Development

```bash
# Run all apps in dev mode
pnpm dev

# Run specific app
pnpm --filter web dev
pnpm --filter mobile dev
```

### Build

```bash
pnpm build
```

## Environment Variables

Create `.env.local` files in both `apps/web` and `apps/mobile` with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```
