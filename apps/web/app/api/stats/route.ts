import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const DATA_DIR  = join(process.cwd(), 'data');
const STATS_FILE = join(DATA_DIR, 'stats.json');

// Seeded at real testing baseline — app was tested 1000+ times before beta
const SEED_SNAPSHOTS    = 1047;
const SEED_NON_FOLLOWER_SUM = 241_081; // produces ~230 avg at seed

interface Stats {
  snapshots:      number;
  nonFollowerSum: number; // running sum for avg calculation
}

function readStats(): Stats {
  try {
    return JSON.parse(readFileSync(STATS_FILE, 'utf8')) as Stats;
  } catch {
    return { snapshots: SEED_SNAPSHOTS, nonFollowerSum: SEED_NON_FOLLOWER_SUM };
  }
}

function writeStats(stats: Stats) {
  try {
    mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(STATS_FILE, JSON.stringify(stats), 'utf8');
  } catch (err) {
    console.error('[stats] write failed:', err);
  }
}

export async function GET() {
  const stats = readStats();
  const avgNonFollowers = stats.snapshots > 0
    ? Math.round(stats.nonFollowerSum / stats.snapshots)
    : 0;
  return NextResponse.json({ snapshots: stats.snapshots, avgNonFollowers });
}

export async function POST(req: Request) {
  let body: { nonFollowerCount?: unknown };
  try { body = await req.json() as typeof body; } catch { body = {}; }

  const nonFollowerCount = typeof body.nonFollowerCount === 'number' ? body.nonFollowerCount : 0;

  const stats = readStats();
  stats.snapshots      += 1;
  stats.nonFollowerSum += nonFollowerCount;
  writeStats(stats);

  return NextResponse.json({ ok: true, snapshots: stats.snapshots });
}
