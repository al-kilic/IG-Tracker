import { describe, expect, it } from 'vitest';
import { analyzeSnapshot, compareSnapshots, findGhostFollowers } from './diff.js';
import type { ParsedSnapshot } from './schemas.js';

function makeSnapshot(
  followers: string[],
  following: string[],
  exportedAt = 1700000000,
): ParsedSnapshot {
  return {
    exportedAt,
    followers: followers.map((u) => ({
      username: u,
      href: `https://www.instagram.com/${u}`,
      followedAt: 1690000000,
    })),
    following: following.map((u) => ({
      username: u,
      href: `https://www.instagram.com/${u}`,
      followedAt: 1690000000,
    })),
  };
}

// ─── analyzeSnapshot ──────────────────────────────────────────────────────────

describe('analyzeSnapshot', () => {
  it('correctly separates nonFollowers, fans, and mutuals', () => {
    // followers: alice, bob, charlie
    // following: alice, dave (dave doesn't follow back = nonFollower; charlie is a fan)
    const snapshot = makeSnapshot(['alice', 'bob', 'charlie'], ['alice', 'dave']);
    const result = analyzeSnapshot(snapshot);

    expect(result.nonFollowers.map((a) => a.username)).toEqual(['dave']);
    expect(result.fans.map((a) => a.username)).toEqual(['bob', 'charlie']);
    expect(result.mutuals.map((a) => a.username)).toEqual(['alice']);
  });

  it('returns correct totals and ratio', () => {
    const snapshot = makeSnapshot(['a', 'b', 'c', 'd'], ['a', 'b']);
    const result = analyzeSnapshot(snapshot);

    expect(result.totalFollowers).toBe(4);
    expect(result.totalFollowing).toBe(2);
    expect(result.ratio).toBe(2);
  });

  it('returns ratio of 0 when following is empty', () => {
    const snapshot = makeSnapshot(['alice'], []);
    const result = analyzeSnapshot(snapshot);

    expect(result.ratio).toBe(0);
    expect(result.nonFollowers).toHaveLength(0);
    expect(result.fans).toHaveLength(1);
    expect(result.mutuals).toHaveLength(0);
  });

  it('handles empty snapshot (new account)', () => {
    const snapshot = makeSnapshot([], []);
    const result = analyzeSnapshot(snapshot);

    expect(result.nonFollowers).toHaveLength(0);
    expect(result.fans).toHaveLength(0);
    expect(result.mutuals).toHaveLength(0);
    expect(result.totalFollowers).toBe(0);
    expect(result.totalFollowing).toBe(0);
    expect(result.ratio).toBe(0);
  });

  it('returns all results sorted alphabetically', () => {
    const snapshot = makeSnapshot(['zara', 'alice', 'mike'], ['zara', 'bob', 'kate']);
    const result = analyzeSnapshot(snapshot);

    const isSorted = (arr: { username: string }[]) =>
      arr.every((v, i) => i === 0 || arr[i - 1]!.username <= v.username);

    expect(isSorted(result.nonFollowers)).toBe(true);
    expect(isSorted(result.fans)).toBe(true);
    expect(isSorted(result.mutuals)).toBe(true);
  });

  it('handles large snapshots performantly', () => {
    const size = 10_000;
    const followers = Array.from({ length: size }, (_, i) => `follower_${i}`);
    const following = Array.from({ length: size }, (_, i) => `following_${i}`);
    const snapshot = makeSnapshot(followers, following);

    const start = Date.now();
    const result = analyzeSnapshot(snapshot);
    const elapsed = Date.now() - start;

    expect(elapsed).toBeLessThan(500);
    expect(result.totalFollowers).toBe(size);
  });
});

// ─── compareSnapshots ─────────────────────────────────────────────────────────

describe('compareSnapshots', () => {
  const OLD_AT = 1700000000;
  const NEW_AT = OLD_AT + 7 * 86400; // 7 days later

  it('detects new followers, lost followers, new following, and unfollowed', () => {
    const oldSnap = makeSnapshot(['alice', 'bob'], ['alice', 'dave'], OLD_AT);
    const newSnap = makeSnapshot(['alice', 'charlie'], ['alice', 'eve'], NEW_AT);
    const result = compareSnapshots(oldSnap, newSnap);

    expect(result.newFollowers.map((a) => a.username)).toEqual(['charlie']);
    expect(result.lostFollowers.map((a) => a.username)).toEqual(['bob']);
    expect(result.newFollowing.map((a) => a.username)).toEqual(['eve']);
    expect(result.unfollowed.map((a) => a.username)).toEqual(['dave']);
  });

  it('computes periodDays correctly', () => {
    const oldSnap = makeSnapshot([], [], OLD_AT);
    const newSnap = makeSnapshot([], [], NEW_AT);
    const result = compareSnapshots(oldSnap, newSnap);

    expect(result.periodDays).toBeCloseTo(7, 5);
  });

  it('returns all empty arrays for identical snapshots', () => {
    const snap = makeSnapshot(['alice', 'bob'], ['charlie'], OLD_AT);
    const result = compareSnapshots(snap, snap);

    expect(result.newFollowers).toHaveLength(0);
    expect(result.lostFollowers).toHaveLength(0);
    expect(result.newFollowing).toHaveLength(0);
    expect(result.unfollowed).toHaveLength(0);
  });

  it('handles comparing two empty snapshots', () => {
    const oldSnap = makeSnapshot([], [], OLD_AT);
    const newSnap = makeSnapshot([], [], NEW_AT);
    const result = compareSnapshots(oldSnap, newSnap);

    expect(result.newFollowers).toHaveLength(0);
    expect(result.lostFollowers).toHaveLength(0);
    expect(result.periodDays).toBeGreaterThan(0);
  });

  it('returns results sorted alphabetically', () => {
    const oldSnap = makeSnapshot(['zara', 'mike', 'alice'], ['bob', 'kate'], OLD_AT);
    const newSnap = makeSnapshot(['zara', 'leo', 'anna'], ['bob', 'nina'], NEW_AT);
    const result = compareSnapshots(oldSnap, newSnap);

    const isSorted = (arr: { username: string }[]) =>
      arr.every((v, i) => i === 0 || arr[i - 1]!.username <= v.username);

    expect(isSorted(result.newFollowers)).toBe(true);
    expect(isSorted(result.lostFollowers)).toBe(true);
    expect(isSorted(result.newFollowing)).toBe(true);
    expect(isSorted(result.unfollowed)).toBe(true);
  });

  it('handles large snapshots performantly', () => {
    const size = 10_000;
    const baseFollowers = Array.from({ length: size }, (_, i) => `f_${i}`);
    const baseFollowing = Array.from({ length: size }, (_, i) => `fw_${i}`);
    const oldSnap = makeSnapshot(baseFollowers, baseFollowing, OLD_AT);
    // Add 100 new followers, remove 100 old ones
    const newFollowers = [...baseFollowers.slice(100), ...Array.from({ length: 100 }, (_, i) => `new_${i}`)];
    const newSnap = makeSnapshot(newFollowers, baseFollowing, NEW_AT);

    const start = Date.now();
    const result = compareSnapshots(oldSnap, newSnap);
    const elapsed = Date.now() - start;

    expect(elapsed).toBeLessThan(500);
    expect(result.newFollowers).toHaveLength(100);
    expect(result.lostFollowers).toHaveLength(100);
  });
});

// ─── findGhostFollowers ───────────────────────────────────────────────────────

describe('findGhostFollowers', () => {
  const OLD_TIMESTAMP = Math.floor(Date.now() / 1000) - 365 * 86400; // 1 year ago
  const RECENT_TIMESTAMP = Math.floor(Date.now() / 1000) - 30 * 86400; // 30 days ago

  function makeSnapshotWithTimestamps(
    followers: { username: string; followedAt: number | null }[],
    following: string[],
  ): ParsedSnapshot {
    return {
      exportedAt: Math.floor(Date.now() / 1000),
      followers: followers.map((f) => ({
        username: f.username,
        href: `https://www.instagram.com/${f.username}`,
        followedAt: f.followedAt,
      })),
      following: following.map((u) => ({
        username: u,
        href: `https://www.instagram.com/${u}`,
        followedAt: RECENT_TIMESTAMP,
      })),
    };
  }

  it('returns non-reciprocal followers with old followedAt', () => {
    const snapshot = makeSnapshotWithTimestamps(
      [
        { username: 'ghost', followedAt: OLD_TIMESTAMP },
        { username: 'recent_fan', followedAt: RECENT_TIMESTAMP },
        { username: 'mutual', followedAt: OLD_TIMESTAMP },
      ],
      ['mutual'],
    );
    const ghosts = findGhostFollowers(snapshot);

    expect(ghosts.map((g) => g.username)).toEqual(['ghost']);
  });

  it('excludes followers with null followedAt (HTML exports)', () => {
    const snapshot = makeSnapshotWithTimestamps(
      [{ username: 'unknown_date', followedAt: null }],
      [],
    );
    const ghosts = findGhostFollowers(snapshot);

    expect(ghosts).toHaveLength(0);
  });

  it('respects custom minTenureDays option', () => {
    const fiftyDaysAgo = Math.floor(Date.now() / 1000) - 50 * 86400;
    const snapshot = makeSnapshotWithTimestamps(
      [{ username: 'borderline', followedAt: fiftyDaysAgo }],
      [],
    );

    expect(findGhostFollowers(snapshot, { minTenureDays: 30 })).toHaveLength(1);
    expect(findGhostFollowers(snapshot, { minTenureDays: 60 })).toHaveLength(0);
  });

  it('returns results sorted alphabetically', () => {
    const snapshot = makeSnapshotWithTimestamps(
      [
        { username: 'zulu', followedAt: OLD_TIMESTAMP },
        { username: 'alpha', followedAt: OLD_TIMESTAMP },
        { username: 'mike', followedAt: OLD_TIMESTAMP },
      ],
      [],
    );
    const ghosts = findGhostFollowers(snapshot);

    expect(ghosts.map((g) => g.username)).toEqual(['alpha', 'mike', 'zulu']);
  });

  it('returns empty array when there are no ghost followers', () => {
    const snapshot = makeSnapshotWithTimestamps(
      [{ username: 'mutual', followedAt: OLD_TIMESTAMP }],
      ['mutual'],
    );
    expect(findGhostFollowers(snapshot)).toHaveLength(0);
  });
});
