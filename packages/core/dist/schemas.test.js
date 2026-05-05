import { describe, expect, it } from 'vitest';
import { followersFileSchema, followingFileSchema, parsedSnapshotSchema } from './schemas.js';
const validEntry = {
    title: 'test_user',
    media_list_data: [],
    string_list_data: [
        {
            href: 'https://www.instagram.com/test_user',
            value: 'test_user',
            timestamp: 1700000000,
        },
    ],
};
describe('followersFileSchema', () => {
    it('parses a valid followers array', () => {
        const result = followersFileSchema.safeParse([validEntry]);
        expect(result.success).toBe(true);
    });
    it('parses an empty array', () => {
        const result = followersFileSchema.safeParse([]);
        expect(result.success).toBe(true);
    });
    it('fails when string_list_data is missing', () => {
        const invalid = { title: 'x', media_list_data: [] };
        const result = followersFileSchema.safeParse([invalid]);
        expect(result.success).toBe(false);
    });
    it('fails when entry is not an array', () => {
        const result = followersFileSchema.safeParse({ not: 'an array' });
        expect(result.success).toBe(false);
    });
});
describe('followingFileSchema', () => {
    it('parses a valid following object', () => {
        const result = followingFileSchema.safeParse({
            relationships_following: [validEntry],
        });
        expect(result.success).toBe(true);
    });
    it('parses empty relationships_following', () => {
        const result = followingFileSchema.safeParse({ relationships_following: [] });
        expect(result.success).toBe(true);
    });
    it('fails when relationships_following is missing', () => {
        const result = followingFileSchema.safeParse({ other_key: [] });
        expect(result.success).toBe(false);
    });
});
describe('parsedSnapshotSchema', () => {
    it('parses a valid snapshot', () => {
        const snapshot = {
            exportedAt: 1700000000,
            followers: [{ username: 'a', href: 'https://instagram.com/a', followedAt: 1699000000 }],
            following: [{ username: 'b', href: 'https://instagram.com/b', followedAt: null }],
        };
        const result = parsedSnapshotSchema.safeParse(snapshot);
        expect(result.success).toBe(true);
    });
    it('allows followedAt: null', () => {
        const account = { username: 'x', href: 'https://instagram.com/x', followedAt: null };
        const snapshot = { exportedAt: 1700000000, followers: [account], following: [] };
        const result = parsedSnapshotSchema.safeParse(snapshot);
        expect(result.success).toBe(true);
    });
    it('fails when exportedAt is missing', () => {
        const result = parsedSnapshotSchema.safeParse({ followers: [], following: [] });
        expect(result.success).toBe(false);
    });
});
//# sourceMappingURL=schemas.test.js.map