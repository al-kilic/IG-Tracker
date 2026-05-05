import { z } from 'zod';

export const stringListItemSchema = z.object({
  href: z.string(),
  value: z.string().optional(),
  timestamp: z.number(),
});

export const relationshipEntrySchema = z.object({
  title: z.string().optional(),
  media_list_data: z.array(z.unknown()).optional(),
  string_list_data: z.tuple([stringListItemSchema]),
});

export const followersFileSchema = z.array(relationshipEntrySchema);

export const followingFileSchema = z.object({
  relationships_following: z.array(relationshipEntrySchema),
});

export const accountSchema = z.object({
  username: z.string(),
  href: z.string(),
  followedAt: z.number().nullable(),
});

export const parsedSnapshotSchema = z.object({
  exportedAt: z.number(),
  followers: z.array(accountSchema),
  following: z.array(accountSchema),
});

export type StringListItem = z.infer<typeof stringListItemSchema>;
export type RelationshipEntry = z.infer<typeof relationshipEntrySchema>;
export type FollowersFile = z.infer<typeof followersFileSchema>;
export type FollowingFile = z.infer<typeof followingFileSchema>;
export type Account = z.infer<typeof accountSchema>;
export type ParsedSnapshot = z.infer<typeof parsedSnapshotSchema>;
