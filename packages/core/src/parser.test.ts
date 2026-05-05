import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { InvalidZipError, MissingFilesError, MixedFormatError, SchemaValidationError } from './errors.js';
import { parseInstagramZip } from './parser.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FIXTURES = join(__dirname, '../test/fixtures');

function fixture(name: string): ArrayBuffer {
  const buf = readFileSync(join(FIXTURES, name));
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
}

describe('parseInstagramZip', () => {
  it('parses a valid single-file export correctly', async () => {
    const snapshot = await parseInstagramZip(fixture('valid-export.zip'));

    expect(snapshot.followers).toHaveLength(3);
    expect(snapshot.following).toHaveLength(2);

    const alice = snapshot.followers.find((f) => f.username === 'alice');
    expect(alice).toBeDefined();
    expect(alice!.href).toBe('https://www.instagram.com/alice');
    expect(alice!.followedAt).toBe(1700000000);

    expect(snapshot.exportedAt).toBeGreaterThan(0);
  });

  it('merges paginated followers files (followers_1.json + followers_2.json)', async () => {
    const snapshot = await parseInstagramZip(fixture('paginated-followers.zip'));

    expect(snapshot.followers).toHaveLength(5);
    const usernames = snapshot.followers.map((f) => f.username);
    expect(usernames).toContain('user1');
    expect(usernames).toContain('user4');
    expect(usernames).toContain('user5');
  });

  it('parses an empty export (new account with zero followers)', async () => {
    const snapshot = await parseInstagramZip(fixture('empty-export.zip'));

    expect(snapshot.followers).toHaveLength(0);
    expect(snapshot.following).toHaveLength(0);
  });

  it('throws MissingFilesError when followers_*.json is absent', async () => {
    await expect(parseInstagramZip(fixture('missing-followers.zip'))).rejects.toThrow(
      MissingFilesError,
    );
    await expect(parseInstagramZip(fixture('missing-followers.zip'))).rejects.toMatchObject({
      code: 'MISSING_FILES',
    });
  });

  it('throws MissingFilesError when following.json is absent', async () => {
    await expect(parseInstagramZip(fixture('missing-following.zip'))).rejects.toThrow(
      MissingFilesError,
    );
  });

  it('throws InvalidZipError on a malformed ZIP buffer', async () => {
    const notAZip = new TextEncoder().encode('this is not a zip file').buffer;
    await expect(parseInstagramZip(notAZip)).rejects.toThrow(InvalidZipError);
    await expect(parseInstagramZip(notAZip)).rejects.toMatchObject({
      code: 'INVALID_ZIP',
    });
  });

  it('throws SchemaValidationError when followers JSON has wrong structure', async () => {
    await expect(parseInstagramZip(fixture('invalid-schema.zip'))).rejects.toThrow(
      SchemaValidationError,
    );
    await expect(parseInstagramZip(fixture('invalid-schema.zip'))).rejects.toMatchObject({
      code: 'SCHEMA_VALIDATION',
    });
  });

  it('sets followedAt to null when timestamp is 0', async () => {
    // The makeFixtures script uses timestamp 1700000000 (non-zero) for all entries,
    // so here we test the sentinel-zero path via a hand-crafted buffer using JSZip.
    const JSZip = (await import('jszip')).default;
    const z = new JSZip();
    z.file(
      'connections/followers_and_following/followers_1.json',
      JSON.stringify([
        {
          title: 'ghost',
          media_list_data: [],
          string_list_data: [{ href: 'https://instagram.com/ghost', value: 'ghost', timestamp: 0 }],
        },
      ]),
    );
    z.file(
      'connections/followers_and_following/following.json',
      JSON.stringify({ relationships_following: [] }),
    );
    const buf = await z.generateAsync({ type: 'arraybuffer' });
    const snapshot = await parseInstagramZip(buf);

    expect(snapshot.followers[0]?.followedAt).toBeNull();
  });

  it('exportedAt is a recent unix timestamp', async () => {
    const before = Math.floor(Date.now() / 1000) - 1;
    const snapshot = await parseInstagramZip(fixture('valid-export.zip'));
    const after = Math.floor(Date.now() / 1000) + 1;

    expect(snapshot.exportedAt).toBeGreaterThanOrEqual(before);
    expect(snapshot.exportedAt).toBeLessThanOrEqual(after);
  });

  it('accepts a Blob input in addition to ArrayBuffer', async () => {
    const buf = readFileSync(join(FIXTURES, 'valid-export.zip'));
    const blob = new Blob([buf], { type: 'application/zip' });
    const snapshot = await parseInstagramZip(blob);
    expect(snapshot.followers).toHaveLength(3);
  });
});

describe('parseInstagramZip — HTML format', () => {
  it('parses an HTML export correctly', async () => {
    const snapshot = await parseInstagramZip(fixture('html-export.zip'));

    expect(snapshot.followers).toHaveLength(3);
    expect(snapshot.following).toHaveLength(2);

    const alice = snapshot.followers.find((f) => f.username === 'alice');
    expect(alice).toBeDefined();
    expect(alice!.href).toBe('https://www.instagram.com/alice');
  });

  it('sets followedAt to null for all accounts in HTML exports', async () => {
    const snapshot = await parseInstagramZip(fixture('html-export.zip'));

    for (const account of [...snapshot.followers, ...snapshot.following]) {
      expect(account.followedAt).toBeNull();
    }
  });

  it('throws MixedFormatError when followers.html and following.json are mixed', async () => {
    await expect(parseInstagramZip(fixture('mixed-format.zip'))).rejects.toThrow(MixedFormatError);
    await expect(parseInstagramZip(fixture('mixed-format.zip'))).rejects.toMatchObject({
      code: 'MIXED_FORMAT',
    });
  });
});
