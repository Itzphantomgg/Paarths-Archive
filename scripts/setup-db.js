const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('====================================================');
console.log(" Paarth's Archive - Automated Database & Schema Setup");
console.log('====================================================\n');

const projectRoot = path.join(__dirname, '..');

try {
  // Step 1: Detect DB & configure Prisma Provider
  console.log('[1/3] Detecting database environment and configuring Prisma provider...');
  execSync('node scripts/prepare-db.js', { stdio: 'inherit', cwd: projectRoot });

  // Step 2: Push database schema (create tables, foreign keys, indexes)
  console.log('\n[2/3] Synchronizing schema with target database (prisma db push)...');
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit', cwd: projectRoot });

  // Step 3: Run seed script to populate default data if needed
  console.log('\n[3/3] Seeding author account, chapters, and stories...');
  execSync('npx tsx prisma/seed.ts', { stdio: 'inherit', cwd: projectRoot });

  console.log('\n====================================================');
  console.log('  Database setup completed successfully!');
  console.log('====================================================\n');
} catch (error) {
  console.error('\n[setup-db] Database setup encountered an error:', error.message);
  process.exit(1);
}
