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

// label_values format — used by pending_follow_requests.json, recently_unfollowed_profiles.json
export const labelValuesEntrySchema = z.object({
  timestamp: z.number().optional(),
  label_values: z.array(z.object({ label: z.string(), value: z.string() })),
  fbid: z.string().optional(),
});

export const labelValuesFileSchema = z.array(labelValuesEntrySchema);

// Legacy wrapper schemas (kept for future-proofing / older export formats)
export const pendingRequestsFileSchema = z.object({
  relationships_follow_requests_sent: z.array(relationshipEntrySchema),
});

export const recentlyUnfollowedFileSchema = z.object({
  relationships_unfollowed_users: z.array(relationshipEntrySchema),
});

export const parsedSnapshotSchema = z.object({
  exportedAt: z.number(),
  followers: z.array(accountSchema),
  following: z.array(accountSchema),
  pendingRequests: z.array(accountSchema).optional(),
  recentlyUnfollowed: z.array(accountSchema).optional(),
});

export type StringListItem = z.infer<typeof stringListItemSchema>;
export type RelationshipEntry = z.infer<typeof relationshipEntrySchema>;
export type FollowersFile = z.infer<typeof followersFileSchema>;
export type FollowingFile = z.infer<typeof followingFileSchema>;
export type Account = z.infer<typeof accountSchema>;
export type ParsedSnapshot = z.infer<typeof parsedSnapshotSchema>;
export type PendingRequestsFile = z.infer<typeof pendingRequestsFileSchema>;
export type RecentlyUnfollowedFile = z.infer<typeof recentlyUnfollowedFileSchema>;
export type LabelValuesEntry = z.infer<typeof labelValuesEntrySchema>;
export type LabelValuesFile = z.infer<typeof labelValuesFileSchema>;
