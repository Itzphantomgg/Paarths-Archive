# Technical Reference & Deployment Runbook: Paarth's Archive

## 1. System Overview
"Paarth's Archive" is a Next.js App Router application providing a personal storytelling platform and private writing studio.

## 2. Environment Variables Specification

| Variable Name | Required? | Purpose | Default / Fallback |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | Optional | Prisma database connection string. Either SQLite (`file:...`) or Postgres. | Auto-configured to bundled/local database |
| `JWT_SECRET` | Recommended | Signing key for session cookies (`archive_session`). Must be 32+ characters. | Fallback secret provided in `auth.ts` |
| `NEXT_PUBLIC_SUPABASE_URL` | Optional | Supabase Project URL if using Supabase client directly. | Empty |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional | Supabase Public Anonymous Key. | Empty |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | Supabase administrative key for backend jobs. | Empty |

> **Security Rule**: Never place actual secret keys in source files, `.env.example`, or documentation. Configure production values directly in the Vercel Project Settings Dashboard under **Settings > Environment Variables**.

## 3. Vercel Deployment Architecture

### The Ephemeral Filesystem Consideration
Vercel executes Next.js server-side code within AWS Lambda serverless execution environments:
- The deployment root directory (`/var/task`) is strictly **read-only**.
- Only the `/tmp` directory (up to 512MB) provides read/write access.
- If SQLite is used directly pointing to `/var/task/prisma/dev.db`, read operations succeed, but write operations (`INSERT`, `UPDATE`, `DELETE`) fail with `EROFS: read-only file system`.

### Serverless DB Resolution Strategy
In `src/lib/db.ts`:
1. When running on Vercel (`process.env.VERCEL === "1"` or `process.env.AWS_LAMBDA_FUNCTION_NAME`):
   - Check if `/tmp/archive.db` exists.
   - If not, copy the bundled seed database from `path.join(process.cwd(), "prisma", "dev.db")` to `/tmp/archive.db`.
   - Configure Prisma's connection to `file:/tmp/archive.db`.
2. When running locally:
   - Use `file:./dev.db` or `DATABASE_URL`.
3. When using external PostgreSQL / Supabase:
   - Use the provided `DATABASE_URL`.

## 4. Key Implementation Decisions

1. **Async Dynamic APIs in Next.js 15+ / 16**:
   - Dynamic route parameters (`params`), query parameters (`searchParams`), and header/cookie access (`cookies()`) return Promises and must be awaited (`await params`, `await cookies()`).
2. **Wildcard Image Hostnames in `next.config.mjs`**:
   - `remotePatterns` configured with `hostname: "**"` for `https` and `http` to allow covers from any user-provided image host.
3. **Pure CSS & Web Audio Ambiance**:
   - 35mm film grain is rendered through an embedded SVG filter (`public/grain.svg`).
   - Analog tape hiss is synthesized directly using the browser's Web Audio API pink/brown noise buffers, eliminating external audio asset dependencies.

## 5. Security & Authentication Guidelines
- Passwords must be hashed using `bcryptjs` before storage.
- Session tokens are stored in httpOnly, SameSite=Lax cookies to mitigate XSS exposure.
- Unauthenticated requests to `/admin/*` are intercepted by `src/middleware.ts` and redirected to `/login`.
- Documentation and UI must NEVER display hardcoded passwords or mock login credentials.

## 6. Deployment Verification Checklist
- [x] `npm run build` succeeds locally without errors.
- [x] No sensitive files or databases committed in `.gitignore` (`.env`, `*.db-journal`).
- [x] Pre-seeded database (`prisma/dev.db`) bundled for zero-config Vercel startup.
- [x] Wildcard image host resolution enabled in `next.config.mjs`.
- [x] Async parameter unwrapping applied to all dynamic routes.
