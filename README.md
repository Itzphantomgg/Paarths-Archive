# Paarth's Archive // Personal Digital Memory Vault

> *"An old collection of memories preserved inside a modern cinematic digital archive."*

A private-feeling digital archive, autobiography, and memory vault engineered with a monochrome cinematic aesthetic, editorial luxury feel, high-contrast serif typography, and contemplative film-first pacing.

---

## ✦ Aesthetic & Design System

- **Palette**: Deep monochrome tones — pure black (`#050505`), charcoal (`#0C0C0C`, `#161616`), razor-thin borders (`border-white/10`), off-white typography (`#EDEDEB`), and muted silver accents.
- **Typography**: High-contrast editorial display serif (*Cormorant Garamond* with italic swashes) paired with minimal grotesque sans (*Inter*) and tracked monospace (*JetBrains Mono*) for metadata.
- **Cinematic Film Atmosphere**: Procedural SVG 35mm film grain, radial center spotlight glow, and film vignetting.
- **Auditory Immersion**: Subtle optional analog tape hiss / vinyl warmth synthesizer powered by the Web Audio API.

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
- **Route Middleware**: Route protection requiring authenticated session cookies.
- **Writing Desk (`/admin/editor`)**:
  - Full Markdown authoring desk with word count and live dual-pane book preview.
  - Flexible memory coordinates: Approximate dates (*“Late Autumn, 2014”*), exact dates, year, location, mood/atmosphere, people involved.
  - Curated monochrome photography presets.
  - Draft vs. Published workflows.
- **Chapter Manager (`/admin/chapters`)**: Create, edit, and reorder archive chapters.
- **1-Click Archive Backup (`/api/export`)**: Instant JSON export of all stories, chapters, and metadata for personal permanence.

---

## ✦ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with `@tailwindcss/typography`
- **Database**: [Prisma ORM](https://www.prisma.io/) with zero-config SQLite relational database (`prisma/schema.prisma`)
- **Cloud Database**: [Supabase](https://supabase.com/) PostgreSQL mirror schema (`supabase/schema.sql`)
- **Authentication**: Secure bcrypt password hashing, `jose` JWT cookies, and route middleware
- **Icons**: [Lucide React](https://lucide.dev/)

---

## ✦ Getting Started

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

## ✦ Default Archivist Credentials (Local Vault)

- **Login URL**: `http://localhost:3000/login`
- **Archivist Email**: `paarth@archive.local`
- **Password**: `archive2026`

---

## ✦ License

Private Personal Archive © 2026 Paarth. All Rights Reserved.
