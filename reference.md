# Technical Reference & Deployment Runbook: Paarth's Archive

## 1. System Overview
"Paarth's Archive" is a Next.js App Router personal memory archive and private writing studio. It operates under a strict **private-by-default** model where personal narratives remain confidential unless intentionally shared via unguessable cryptographic tokens.

---

## 2. Environment Variables Specification

| Variable Name | Required? | Purpose | Default / Fallback |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | Optional | Prisma database connection string. Either SQLite (`file:...`) or Postgres. | Auto-configured to bundled `/tmp` database on Vercel |
| `JWT_SECRET` | Recommended | Signing key for session cookies (`archive_session`). Must be 32+ characters. | Fallback secret provided in `auth.ts` |
| `NEXT_PUBLIC_SUPABASE_URL` | Optional | Supabase Project URL if using Supabase client directly. | Empty |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional | Supabase Public Anonymous Key. | Empty |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | Supabase administrative key for backend jobs. | Empty |

> **Security Rule**: Never place actual secret keys in source files, `.env.example`, or documentation. Configure production values directly in the Vercel Project Settings Dashboard under **Settings > Environment Variables**.

---

## 3. Story Privacy & Sharing Architecture

### Access Control Matrix

| Surface | Unauthenticated Visitor | Authenticated Archivist |
| :--- | :--- | :--- |
| `/` (Homepage) | Split Editorial Hero, Lore & Concept | Split Hero + Direct Vault Entry CTA |
| `/archive` | Conceptual Architecture Manifesto | Direct redirect to `/admin` |
| `/chapter/[slug]` | Thematic Volume Overview | Private stories in that chapter |
| `/story/[slug]` | **404 Not Found** (Hidden) | Full Book Reader |
| `/shared/[token]` | **Single Shared Story** (Isolated) | Single Shared Story |
| `/search` | Index Lock Prompt | Full private archive search |
| `/admin/*` | Redirected to `/login` | Writing Studio & Vault Dashboard |
| `/api/stories` | **401 Unauthorized** | Full story CRUD |

### Sharing & Revocation Model
1. **Generation**: When the archivist clicks "Share" in the Writing Desk or Dashboard, `POST /api/stories/[id]/share` produces an unguessable 32-character hexadecimal token using `crypto.randomBytes(16)`.
2. **Access URL**: The dispatch is accessible at `/shared/<token>`. This route only queries `where: { shareToken: token, shareStatus: "SHARED" }`.
3. **Isolation**: The shared page does not include chapter links, pagination to other stories, author dashboard access, or search.
4. **Revocation**: The archivist can click "Revoke" at any time (`DELETE /api/stories/[id]/share`), which transitions the status to `"REVOKED"`. Subsequent visits to `/shared/<token>` immediately render a sealed/unavailable notification.

---

## 4. Vercel Deployment Architecture

### Ephemeral Filesystem & SQLite Persistence
Vercel executes Next.js server-side code within AWS Lambda serverless execution environments:
- The deployment root directory (`/var/task`) is strictly **read-only**.
- Only the `/tmp` directory (up to 512MB) provides read/write access.
- If SQLite is accessed directly in `/var/task`, write operations (`INSERT`, `UPDATE`, `DELETE`) fail with `EROFS: read-only file system`.

### Serverless DB Resolution Strategy (`src/lib/db.ts`)
1. **Serverless Detection**: Checks `process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME`.
2. **Seed Database Copy**: Automatically copies the bundled `prisma/dev.db` to `/tmp/archive.db` if `/tmp/archive.db` does not exist or is empty.
3. **Dynamic URL Binding**: Sets `process.env.DATABASE_URL = "file:/tmp/archive.db"` and passes `datasources: { db: { url: "file:/tmp/archive.db" } }` to `new PrismaClient()`.
4. **External Database Compatibility**: If an external PostgreSQL / Supabase URL is supplied in `process.env.DATABASE_URL`, the adapter directly connects without SQLite `/tmp` copying.

---

## 5. Key Implementation Decisions

1. **Split Editorial Hero**:
   - Replaced previous centered layout with an asymmetrical split: Left column features the grand italic serif title (*Paarth's Archive*), while the right column features the lore quote, narrative description, metadata dividers, and the `ENTER ARCHIVE →` CTA.
   - Completely eliminated all gaming/controller imagery in favor of pure dark atmospheric depth (`#050505`) with center spotlight and film grain.
2. **Async Dynamic APIs in Next.js 15+ / 16**:
   - Dynamic route parameters (`params`), query parameters (`searchParams`), and header/cookie access (`cookies()`) return Promises and are awaited (`await params`, `await cookies()`).
3. **Wildcard Image Hostnames in `next.config.mjs`**:
   - `remotePatterns` configured with `hostname: "**"` for `https` and `http` to allow covers from any user-provided image host.
4. **NFT Asset Inclusion**:
   - `outputFileTracingIncludes` in `next.config.mjs` traces `./prisma/dev.db` for serverless function bundles.

---

## 6. Deployment Verification Checklist
- [x] `npm run build` succeeds with zero errors.
- [x] TypeScript type checking passes 100%.
- [x] Stories are private by default; public visitors cannot access personal writings.
- [x] Share link generation and revocation verified.
- [x] Gaming/controller imagery eliminated from hero and presets.
- [x] Zero exposed credentials in README or UI components.
- [x] Pre-seeded database (`prisma/dev.db`) bundled in git (`!prisma/dev.db`).
