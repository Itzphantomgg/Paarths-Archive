# Paarth's Archive // Personal Digital Memory Vault

> *"An old collection of memories preserved inside a modern cinematic digital archive."*

A private-feeling digital archive, autobiography, and memory vault engineered with a monochrome cinematic aesthetic, editorial luxury feel, high-contrast serif typography, and contemplative film-first pacing.

---

## ✦ Aesthetic & Design System

- **Palette**: Deep monochrome tones — pure black (`#050505`), charcoal (`#0C0C0C`, `#161616`), razor-thin borders (`border-white/10`), off-white typography (`#EDEDEB`), and muted silver accents.
- **Typography**: High-contrast editorial display serif (*Cormorant Garamond* with italic swashes) paired with minimal grotesque sans (*Inter*) and tracked monospace (*JetBrains Mono*) for metadata.
- **Cinematic Film Atmosphere**: Procedural SVG 35mm film grain, radial center spotlight glow, and film vignetting.
- **Auditory Immersion**: Subtle optional analog tape hiss / vinyl warmth synthesizer powered by the browser's Web Audio API.

---

## ✦ Core Features

### Public Archive Experience
- **Cinematic Opening Hero**: Orchestrated multi-stage reveal sequence (black screen → 35mm grain → archival metadata → serif title emergence → ambient grayscale photograph → subtitle → pill CTA).
- **The Archive Vertical Timeline**: Sequential chapter index (`01 CHILDHOOD`, `02 GROWING UP`, `03 PEOPLE`, `04 INCIDENTS`, `05 FRAGMENTS`, `06 FICTION`, `07 LETTERS`) with story counts and descriptions.
- **Curated Memory Cards**: Asymmetrical editorial compositions with pull-quotes, time coordinates, and wide panoramic hero presentations.
- **Book Chapter Reading View (`/story/[slug]`)**: Formatted for maximum reading immersion with drop-cap openings, location and atmosphere metadata, pull-quotes, and previous/next chapter pagination.
- **Interactive Chronology Explorer (`/archive`)**: Filter across chapters, classifications, and time order.
- **Vault Search (`/search`)**: Real-time faceted search across titles, contents, locations, tags, and people.
- **Personal Manifesto (`/about`)**: Personal reflections on memory preservation and the philosophy of the vault.

### Private Writing Studio & Admin Suite (`/admin`)
- **Route Protection**: Server-side route middleware guarding all `/admin/*` views.
- **Writing Desk (`/admin/editor`)**:
  - Full Markdown authoring desk with word count and live dual-pane book preview.
  - Flexible memory coordinates: Approximate dates (*“Late Autumn, 2014”*), exact dates, year, location, mood/atmosphere, people involved.
  - Curated monochrome photography presets.
  - Draft vs. Published workflows.
- **Chapter Manager (`/admin/chapters`)**: Create, edit, and reorder archive chapters.
- **1-Click Archive Backup (`/api/export`)**: Instant JSON export of all stories, chapters, and metadata for personal permanence.

---

## ✦ Project Structure

```
Virtual Journal/
├── src/
│   ├── app/                 # Next.js App Router (pages, layouts, dynamic routes)
│   ├── components/          # Reusable UI, hero, timeline, navigation, editor
│   ├── lib/                 # Prisma DB singleton, session auth, utilities
│   └── middleware.ts        # Route protection for private studio
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Seeding script
├── public/
│   └── grain.svg            # Film grain overlay
├── supabase/
│   └── schema.sql           # PostgreSQL / Supabase mirror schema
├── .env.example             # Environment variable names template
├── skills.md                # Project skills & architecture reference
└── reference.md             # Technical reference & deployment runbook
```

---

## ✦ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with `@tailwindcss/typography`
- **Database**: [Prisma ORM](https://www.prisma.io/) with SQLite relational database + Supabase mirror schema
- **Authentication**: Custom session-based auth with `bcryptjs` password hashing, `jose` signed JWT cookies, and route middleware
- **Icons**: [Lucide React](https://lucide.dev/)

---

## ✦ Authentication Overview

Authentication is handled through the configured authentication provider:
- **Session Tokens**: Cryptographically signed using HMAC SHA-256 via `jose` and persisted in secure `httpOnly`, `SameSite=Lax` cookies.
- **Password Security**: Passwords are salted and hashed using `bcryptjs` before storage.
- **Archivist Access**: Public visitors can browse published stories, chapters, and manifestos. Creation, editing, draft management, and chapter organization require authenticated archivist credentials.
- **Archivist Registration**: New archivist keys can be initialized via the `/register` portal or configured directly via environment settings.

---

## ✦ Environment Variables

Configure the following variables in your local `.env` file or in your production host settings. Refer to `.env.example` for the template.

| Variable | Required | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | Optional | Database connection string. Uses local SQLite by default. |
| `JWT_SECRET` | Recommended | Minimum 32-character secret used to sign session cookies. |
| `NEXT_PUBLIC_SUPABASE_URL` | Optional | Supabase Project URL if using Supabase client. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional | Supabase public anonymous API key. |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | Supabase service role key for administrative access. |

---

## ✦ Local Development

### 1. Clone & Install
```bash
git clone https://github.com/Itzphantomgg/Paarths-Archive.git
cd Paarths-Archive
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```
*(Populate `DATABASE_URL` and `JWT_SECRET` in your `.env`)*

### 3. Initialize & Seed Database
```bash
npx prisma db push
npm run seed
```

### 4. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ✦ Vercel Deployment Guide

Deploying Paarth's Archive to Vercel takes only a few minutes:

1. **Push to GitHub**:
   Ensure your latest code is committed and pushed to your GitHub repository.
2. **Import into Vercel**:
   Go to [vercel.com/new](https://vercel.com/new) and import your `Paarths-Archive` repository.
3. **Framework Preset**:
   Select **Next.js** (detected automatically).
4. **Environment Variables**:
   In the **Environment Variables** section of the Vercel import screen, add:
   - `JWT_SECRET`: A secure 32+ character random string.
   - `DATABASE_URL`: (Optional) If connecting to Supabase or an external PostgreSQL database, provide your connection string. For standalone zero-config deployments, the built-in SQLite database adapter will auto-initialize in `/tmp`.
5. **Deploy**:
   Click **Deploy**.
6. **Check Deployment Logs**:
   Once the build finishes, your deployment will be live. You can inspect logs under the **Deployments** tab if any build-time or runtime warnings occur.

---

## ✦ License

Private Personal Archive © 2026 Paarth. All Rights Reserved.
