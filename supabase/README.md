# Supabase & Database Guide - Paarth's Archive

This project supports two database modes:
1. **Local SQLite** (Default, zero setup required for local development)
2. **Cloud PostgreSQL / Supabase** (For production persistence across serverless recycles)

The application features **automatic provider switching**: you never have to manually edit `prisma/schema.prisma`. When a PostgreSQL connection string is detected in `DATABASE_URL` (or `POSTGRES_PRISMA_URL` / `POSTGRES_URL`), the project automatically configures the Prisma provider to `postgresql`.

---

## Option A: Automated 1-Command Setup (Recommended)

If you have a Supabase project created:

1. Copy your Supabase PostgreSQL connection string from your Supabase Dashboard:
   - Go to **Project Settings** -> **Database** -> **Connection string** -> **URI** (or Transaction Pooler mode).
   - Format: `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true`

2. Add it to your `.env.local` or `.env` file (or in your Vercel Project Environment Variables):
   ```env
   DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
   ```

3. In your terminal, run:
   ```bash
   npm run db:setup
   ```

This single command will:
- Detect the PostgreSQL database.
- Configure the Prisma datasource provider automatically.
- Push all schemas, tables, unique constraints, and indexes (`prisma db push`).
- Seed the default author account (`paarth@archive.local` / `archive2026`), 7 chapters, and initial stories.

---

## Option B: Direct Supabase SQL Editor Setup

If you prefer to run SQL directly in the Supabase web console:

1. Open your Supabase Dashboard.
2. Click on **SQL Editor** on the left menu.
3. Click **New query**.
4. Open [supabase/schema.sql](./schema.sql) in this repository, copy its entire contents, and paste it into the SQL editor.
5. Click **Run**.

### What `supabase/schema.sql` Configures:
- **Tables**: `users`, `chapters`, `stories`, `tags`, `story_tags`.
- **Private-by-Default Architecture**:
  - `status TEXT DEFAULT 'PRIVATE'`
  - `share_token TEXT UNIQUE`
  - `share_status TEXT DEFAULT 'PRIVATE'`
- **Row Level Security (RLS)**:
  - **Public Visitors**: Can **only** read stories where `share_status = 'SHARED'`. Private and draft stories are completely shielded from public discovery.
  - **Author**: Authenticated user (`auth.uid() = author_id`) has full CRUD rights.
- **Seed Data**: Creates the 7 chapters, default tags, and the initial author profile.

---

## Available NPM Database Scripts

| Command | Description |
| :--- | :--- |
| `npm run prepare:db` | Inspects `DATABASE_URL` and syncs Prisma datasource provider (`sqlite` vs `postgresql`). |
| `npm run db:push` | Syncs Prisma models with the target database without losing data. |
| `npm run db:setup` | Full 1-command initialization: prepares provider, pushes schema, and seeds data. |
| `npm run seed` | Re-runs the seed script to populate author, chapters, and stories. |
