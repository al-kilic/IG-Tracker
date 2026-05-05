import { z } from 'zod';

declare const followersFileSchema: z.ZodArray<z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    media_list_data: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
    string_list_data: z.ZodTuple<[z.ZodObject<{
        href: z.ZodString;
        value: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodNumber;
    }, z.core.$strip>], null>;
}, z.core.$strip>>;
declare const followingFileSchema: z.ZodObject<{
    relationships_following: z.ZodArray<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        media_list_data: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
        string_list_data: z.ZodTuple<[z.ZodObject<{
            href: z.ZodString;
            value: z.ZodOptional<z.ZodString>;
            timestamp: z.ZodNumber;
        }, z.core.$strip>], null>;
    }, z.core.$strip>>;
}, z.core.$strip>;
declare const accountSchema: z.ZodObject<{
    username: z.ZodString;
    href: z.ZodString;
    followedAt: z.ZodNullable<z.ZodNumber>;
}, z.core.$strip>;
declare const parsedSnapshotSchema: z.ZodObject<{
    exportedAt: z.ZodNumber;
    followers: z.ZodArray<z.ZodObject<{
        username: z.ZodString;
        href: z.ZodString;
        followedAt: z.ZodNullable<z.ZodNumber>;
    }, z.core.$strip>>;
    following: z.ZodArray<z.ZodObject<{
        username: z.ZodString;
        href: z.ZodString;
        followedAt: z.ZodNullable<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>;
type FollowersFile = z.infer<typeof followersFileSchema>;
type FollowingFile = z.infer<typeof followingFileSchema>;
type Account = z.infer<typeof accountSchema>;
type ParsedSnapshot = z.infer<typeof parsedSnapshotSchema>;

declare function parseInstagramZip(zipFile: File | Blob | ArrayBuffer): Promise<ParsedSnapshot>;

interface SingleSnapshotAnalysis {
    nonFollowers: Account[];
    fans: Account[];
    mutuals: Account[];
    totalFollowers: number;
    totalFollowing: number;
    ratio: number;
}
interface SnapshotComparison {
    newFollowers: Account[];
    lostFollowers: Account[];
    newFollowing: Account[];
    unfollowed: Account[];
    periodDays: number;
}
declare function analyzeSnapshot(snapshot: ParsedSnapshot): SingleSnapshotAnalysis;
declare function compareSnapshots(old: ParsedSnapshot, current: ParsedSnapshot): SnapshotComparison;
declare function findGhostFollowers(snapshot: ParsedSnapshot, options?: {
    minTenureDays?: number;
}): Account[];

declare class InvalidZipError extends Error {
    readonly code: "INVALID_ZIP";
    constructor(cause?: unknown);
}
declare class MissingFilesError extends Error {
    readonly code: "MISSING_FILES";
    constructor(missing: string[]);
}
declare class MixedFormatError extends Error {
    readonly code: "MIXED_FORMAT";
    constructor();
}
declare class SchemaValidationError extends Error {
    readonly code: "SCHEMA_VALIDATION";
    constructor(filename: string, detail: string);
}

export { type Account, type FollowersFile, type FollowingFile, InvalidZipError, MissingFilesError, MixedFormatError, type ParsedSnapshot, SchemaValidationError, type SingleSnapshotAnalysis, type SnapshotComparison, analyzeSnapshot, compareSnapshots, findGhostFollowers, parseInstagramZip };
