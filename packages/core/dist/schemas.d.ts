import { z } from 'zod';
export declare const stringListItemSchema: z.ZodObject<{
    href: z.ZodString;
    value: z.ZodString;
    timestamp: z.ZodNumber;
}, z.core.$strip>;
export declare const relationshipEntrySchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    media_list_data: z.ZodArray<z.ZodUnknown>;
    string_list_data: z.ZodTuple<[z.ZodObject<{
        href: z.ZodString;
        value: z.ZodString;
        timestamp: z.ZodNumber;
    }, z.core.$strip>], null>;
}, z.core.$strip>;
export declare const followersFileSchema: z.ZodArray<z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    media_list_data: z.ZodArray<z.ZodUnknown>;
    string_list_data: z.ZodTuple<[z.ZodObject<{
        href: z.ZodString;
        value: z.ZodString;
        timestamp: z.ZodNumber;
    }, z.core.$strip>], null>;
}, z.core.$strip>>;
export declare const followingFileSchema: z.ZodObject<{
    relationships_following: z.ZodArray<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        media_list_data: z.ZodArray<z.ZodUnknown>;
        string_list_data: z.ZodTuple<[z.ZodObject<{
            href: z.ZodString;
            value: z.ZodString;
            timestamp: z.ZodNumber;
        }, z.core.$strip>], null>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const accountSchema: z.ZodObject<{
    username: z.ZodString;
    href: z.ZodString;
    followedAt: z.ZodNullable<z.ZodNumber>;
}, z.core.$strip>;
export declare const parsedSnapshotSchema: z.ZodObject<{
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
export type StringListItem = z.infer<typeof stringListItemSchema>;
export type RelationshipEntry = z.infer<typeof relationshipEntrySchema>;
export type FollowersFile = z.infer<typeof followersFileSchema>;
export type FollowingFile = z.infer<typeof followingFileSchema>;
export type Account = z.infer<typeof accountSchema>;
export type ParsedSnapshot = z.infer<typeof parsedSnapshotSchema>;
//# sourceMappingURL=schemas.d.ts.map