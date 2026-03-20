/**
 * repair-votes.mjs
 *
 * One-time script to recalculate gameVotes/{slug} counters from the ground-truth
 * userVotes/{sessionId}/{slug} entries using the Firebase Admin SDK (bypasses rules).
 *
 * Usage:
 *   GOOGLE_APPLICATION_CREDENTIALS=path/to/serviceAccount.json node scripts/repair-votes.mjs
 *
 * Get a service account key from:
 *   Firebase Console → Project Settings → Service Accounts → Generate new private key
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const envPath = resolve(__dirname, '../.env.production');
const env = {};
try {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i === -1) continue;
    env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
} catch (e) {
  console.error('Could not read .env.production:', e.message);
  process.exit(1);
}

const databaseURL = env.VITE_FIREBASE_DATABASE_URL;
if (!databaseURL) {
  console.error('Missing VITE_FIREBASE_DATABASE_URL in .env.production');
  process.exit(1);
}

const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!serviceAccountPath) {
  console.error(`
ERROR: GOOGLE_APPLICATION_CREDENTIALS is not set.

Steps:
  1. Firebase Console → Project Settings → Service Accounts
  2. Click "Generate new private key" → download the JSON file
  3. Run: GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccount.json node scripts/repair-votes.mjs
`);
  process.exit(1);
}

const { default: admin } = await import('firebase-admin');
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({ credential: admin.credential.cert(serviceAccount), databaseURL });
const db = admin.database();

console.log('🔍 Reading userVotes from Firebase...');
const userVotesSnap = await db.ref('userVotes').once('value');

if (!userVotesSnap.exists()) {
  console.log('No userVotes data found — nothing to repair.');
  process.exit(0);
}

// Tally votes per slug from the per-user records (ground truth)
const tallies = {};
userVotesSnap.forEach((sessionSnap) => {
  sessionSnap.forEach((gameSnap) => {
    const slug = gameSnap.key;
    const vote = gameSnap.val();
    if (!tallies[slug]) tallies[slug] = { likes: 0, dislikes: 0 };
    if (vote === 'like') tallies[slug].likes++;
    else if (vote === 'dislike') tallies[slug].dislikes++;
  });
});

const slugs = Object.keys(tallies);
console.log(`📊 Found votes for ${slugs.length} games. Comparing with gameVotes counters...`);

const gameVotesSnap = await db.ref('gameVotes').once('value');
const currentCounters = {};
if (gameVotesSnap.exists()) {
  gameVotesSnap.forEach((child) => { currentCounters[child.key] = child.val(); });
}

let repaired = 0;

for (const slug of slugs) {
  const correct = tallies[slug];
  const current = currentCounters[slug] ?? { likes: 0, dislikes: 0 };
  if (current.likes !== correct.likes || current.dislikes !== correct.dislikes) {
    console.log(`  ✏️  ${slug}: { likes: ${current.likes}, dislikes: ${current.dislikes} } → { likes: ${correct.likes}, dislikes: ${correct.dislikes} }`);
    await db.ref(`gameVotes/${slug}`).set(correct);
    repaired++;
  }
}

for (const slug of Object.keys(currentCounters)) {
  if (!tallies[slug]) {
    const c = currentCounters[slug];
    if (c.likes > 0 || c.dislikes > 0) {
      console.log(`  🗑️  ${slug}: orphaned { likes: ${c.likes}, dislikes: ${c.dislikes} } → zeroing`);
      await db.ref(`gameVotes/${slug}`).set({ likes: 0, dislikes: 0 });
      repaired++;
    }
  }
}

console.log(repaired === 0 ? '✅ All counters already accurate.' : `\n✅ Repaired ${repaired} counter(s).`);
process.exit(0);
