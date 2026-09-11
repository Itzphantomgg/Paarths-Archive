const fs = require('fs');
const path = require('path');

// Helper to load simple key=value pairs from env file if not in process.env
function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key] && val) {
          process.env[key] = val;
        }
      }
    }
  } catch (err) {
    console.warn(`[prepare-db] Note: Could not parse ${filePath}:`, err.message);
  }
}

// Check .env.local first, then .env
const projectRoot = path.join(__dirname, '..');
loadEnvFile(path.join(projectRoot, '.env.local'));
loadEnvFile(path.join(projectRoot, '.env'));

// Determine the active database connection string
const dbUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL ||
  '';

// Detect whether target is PostgreSQL (Supabase, Neon, Vercel Postgres) or SQLite
const isPostgres =
  dbUrl.startsWith('postgres://') ||
  dbUrl.startsWith('postgresql://') ||
  dbUrl.includes('.supabase.co') ||
  dbUrl.includes('.pooler.supabase.com');

const targetProvider = isPostgres ? 'postgresql' : 'sqlite';

const schemaPath = path.join(projectRoot, 'prisma', 'schema.prisma');
if (!fs.existsSync(schemaPath)) {
  console.error(`[prepare-db] Error: schema.prisma not found at ${schemaPath}`);
  process.exit(1);
}

let schema = fs.readFileSync(schemaPath, 'utf8');
const providerRegex = /(datasource\s+db\s*\{[^}]*provider\s*=\s*")(\w+)(")/;
const match = schema.match(providerRegex);

if (match) {
  const currentProvider = match[2];
  if (currentProvider !== targetProvider) {
    schema = schema.replace(providerRegex, `$1${targetProvider}$3`);
    fs.writeFileSync(schemaPath, schema, 'utf8');
    console.log(`[prepare-db] Switched Prisma provider from '${currentProvider}' to '${targetProvider}' (detected DB: ${isPostgres ? 'PostgreSQL/Supabase' : 'SQLite'}).`);
  } else {
    console.log(`[prepare-db] Prisma provider verified as '${targetProvider}'.`);
  }
} else {
  console.warn('[prepare-db] Could not locate provider in datasource db block.');
}
