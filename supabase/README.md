# Supabase

This directory contains your Supabase configuration, database schema, and migrations.

## Getting Started

### Prerequisites

Install the Supabase CLI:

```bash
npm install -g supabase
```

### Local Development

1. Start Supabase locally:

```bash
supabase start
```

2. View the Supabase Studio:

```
http://localhost:54323
```

3. Get your local credentials:

```bash
supabase status
```

### Migrations

Create a new migration:

```bash
supabase migration new migration_name
```

Apply migrations:

```bash
supabase db push
```

Reset database:

```bash
supabase db reset
```

### Type Generation

Generate TypeScript types from your database schema:

```bash
supabase gen types typescript --local > ../packages/supabase/src/types.ts
```

Or for production:

```bash
supabase gen types typescript --project-id <project-id> > ../packages/supabase/src/types.ts
```

### Production

Link to your remote project:

```bash
supabase link --project-ref <project-id>
```

Push migrations to production:

```bash
supabase db push
```

## Structure

- `config.toml` - Supabase configuration
- `migrations/` - Database migration files
- `seed.sql` - Optional seed data for development
