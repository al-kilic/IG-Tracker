import type { Account, ParsedSnapshot } from './schemas.js';

export interface SingleSnapshotAnalysis {
  nonFollowers: Account[];
  fans: Account[];
  mutuals: Account[];
  totalFollowers: number;
  totalFollowing: number;
  ratio: number;
}

export interface SnapshotComparison {
  newFollowers: Account[];
  lostFollowers: Account[];
  newFollowing: Account[];
  unfollowed: Account[];
  periodDays: number;
}

function byUsername(a: Account, b: Account): number {
  return a.username.localeCompare(b.username);
}

export function analyzeSnapshot(snapshot: ParsedSnapshot): SingleSnapshotAnalysis {
  const followerSet = new Set(snapshot.followers.map((a) => a.username));
  const followingSet = new Set(snapshot.following.map((a) => a.username));
  const followerMap = new Map(snapshot.followers.map((a) => [a.username, a]));
  const followingMap = new Map(snapshot.following.map((a) => [a.username, a]));

  const nonFollowers: Account[] = [];
  const mutuals: Account[] = [];

  for (const username of followingSet) {
    if (!followerSet.has(username)) {
      nonFollowers.push(followingMap.get(username)!);
    } else {
      mutuals.push(followingMap.get(username)!);
    }
  }

  const fans: Account[] = [];
  for (const username of followerSet) {
    if (!followingSet.has(username)) {
      fans.push(followerMap.get(username)!);
    }
  }

  const totalFollowers = snapshot.followers.length;
  const totalFollowing = snapshot.following.length;
  const ratio = totalFollowing === 0 ? 0 : totalFollowers / totalFollowing;

  return {
    nonFollowers: nonFollowers.sort(byUsername),
    fans: fans.sort(byUsername),
    mutuals: mutuals.sort(byUsername),
    totalFollowers,
    totalFollowing,
    ratio,
  };
}

export function compareSnapshots(
  old: ParsedSnapshot,
  current: ParsedSnapshot,
): SnapshotComparison {
  const oldFollowerSet = new Set(old.followers.map((a) => a.username));
  const currentFollowerSet = new Set(current.followers.map((a) => a.username));
  const oldFollowingSet = new Set(old.following.map((a) => a.username));
  const currentFollowingSet = new Set(current.following.map((a) => a.username));

  const currentFollowerMap = new Map(current.followers.map((a) => [a.username, a]));
  const oldFollowerMap = new Map(old.followers.map((a) => [a.username, a]));
  const currentFollowingMap = new Map(current.following.map((a) => [a.username, a]));
  const oldFollowingMap = new Map(old.following.map((a) => [a.username, a]));

  const newFollowers: Account[] = [];
  for (const username of currentFollowerSet) {
    if (!oldFollowerSet.has(username)) {
      newFollowers.push(currentFollowerMap.get(username)!);
    }
  }

  const lostFollowers: Account[] = [];
  for (const username of oldFollowerSet) {
    if (!currentFollowerSet.has(username)) {
      lostFollowers.push(oldFollowerMap.get(username)!);
    }
  }

  const newFollowing: Account[] = [];
  for (const username of currentFollowingSet) {
    if (!oldFollowingSet.has(username)) {
      newFollowing.push(currentFollowingMap.get(username)!);
    }
  }

  const unfollowed: Account[] = [];
  for (const username of oldFollowingSet) {
    if (!currentFollowingSet.has(username)) {
      unfollowed.push(oldFollowingMap.get(username)!);
    }
  }

  const periodDays = (current.exportedAt - old.exportedAt) / 86400;

  return {
    newFollowers: newFollowers.sort(byUsername),
    lostFollowers: lostFollowers.sort(byUsername),
    newFollowing: newFollowing.sort(byUsername),
    unfollowed: unfollowed.sort(byUsername),
    periodDays,
  };
}

export function findGhostFollowers(
  snapshot: ParsedSnapshot,
  options?: { minTenureDays?: number },
): Account[] {
  const minTenureDays = options?.minTenureDays ?? 180;
  const minTenureSeconds = minTenureDays * 86400;
  const followingSet = new Set(snapshot.following.map((a) => a.username));
  const now = Math.floor(Date.now() / 1000);

  return snapshot.followers
    .filter((account) => {
      if (followingSet.has(account.username)) return false;
      if (account.followedAt === null) return false;
      return now - account.followedAt >= minTenureSeconds;
    })
    .sort(byUsername);
}
