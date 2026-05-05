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
export declare function analyzeSnapshot(snapshot: ParsedSnapshot): SingleSnapshotAnalysis;
export declare function compareSnapshots(old: ParsedSnapshot, current: ParsedSnapshot): SnapshotComparison;
export declare function findGhostFollowers(snapshot: ParsedSnapshot, options?: {
    minTenureDays?: number;
}): Account[];
//# sourceMappingURL=diff.d.ts.map