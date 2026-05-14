import type { ParsedSnapshot } from './schemas.js';

export type DeltaReason =
  | 'small_counts'          // Signal B1: both follower+following counts suspiciously small
  | 'all_recent_timestamps' // Signal B2: all timestamps within last 14 days
  | 'massive_count_drop';   // Signal C: dropped 80%+ vs previous snapshot

export interface DeltaDetectionResult {
  isDelta: boolean;
  reasons: DeltaReason[];
}

const SMALL_COUNT_THRESHOLD  = 50;
const RECENT_WINDOW_DAYS     = 14;
const DROP_THRESHOLD         = 0.80; // 80% drop triggers C

export function detectDeltaExport(
  snapshot: ParsedSnapshot,
  previousSnapshot?: ParsedSnapshot,
): DeltaDetectionResult {
  const reasons: DeltaReason[] = [];
  const now = Math.floor(Date.now() / 1000);
  const recentCutoff = now - RECENT_WINDOW_DAYS * 86400;

  // Signal B1: follower count suspiciously small
  // Following can be large even in delta exports (Instagram sometimes sends the full
  // following list), so we check followers alone — a delta has only new followers.
  if (snapshot.followers.length < SMALL_COUNT_THRESHOLD) {
    reasons.push('small_counts');
  }

  // Signal B2: all follow timestamps are within the last 14 days
  // Only fires when there are enough entries to be meaningful (avoid triggering on empty lists)
  const withTimestamp = [
    ...snapshot.followers.filter(a => a.followedAt !== null),
    ...snapshot.following.filter(a => a.followedAt !== null),
  ];
  if (withTimestamp.length >= 3) {
    const allRecent = withTimestamp.every(a => (a.followedAt ?? 0) >= recentCutoff);
    if (allRecent) reasons.push('all_recent_timestamps');
  }

  // Signal C: count dropped 80%+ vs previous snapshot
  if (previousSnapshot) {
    const prevCount = previousSnapshot.followers.length;
    const newCount  = snapshot.followers.length;
    if (prevCount > 0 && newCount < prevCount * (1 - DROP_THRESHOLD)) {
      reasons.push('massive_count_drop');
    }
  }

  return { isDelta: reasons.length > 0, reasons };
}
