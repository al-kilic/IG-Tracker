import JSZip from 'jszip';
import {
  InvalidZipError,
  MissingFilesError,
  MixedFormatError,
  SchemaValidationError,
} from './errors.js';
import {
  followersFileSchema,
  followingFileSchema,
  pendingRequestsFileSchema,
  recentlyUnfollowedFileSchema,
  type Account,
  type ParsedSnapshot,
  type RelationshipEntry,
} from './schemas.js';

// ─── JSON helpers ─────────────────────────────────────────────────────────────

function entryToAccount(entry: RelationshipEntry): Account {
  const item = entry.string_list_data[0];
  const username = item.value ?? entry.title ?? '';
  return {
    username,
    href: item.href,
    followedAt: item.timestamp > 0 ? item.timestamp : null,
  };
}

async function parseFollowersJson(zip: JSZip, fileNames: string[]): Promise<Account[]> {
  const accounts: Account[] = [];
  for (const fname of fileNames) {
    const raw = await zip.files[fname]!.async('string');
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new SchemaValidationError(fname, 'File is not valid JSON');
    }
    const result = followersFileSchema.safeParse(parsed);
    if (!result.success) {
      throw new SchemaValidationError(fname, result.error.issues[0]?.message ?? 'unknown');
    }
    accounts.push(...result.data.map(entryToAccount));
  }
  return accounts;
}

async function parseFollowingJson(zip: JSZip, fileName: string): Promise<Account[]> {
  const raw = await zip.files[fileName]!.async('string');
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new SchemaValidationError(fileName, 'File is not valid JSON');
  }
  const result = followingFileSchema.safeParse(parsed);
  if (!result.success) {
    throw new SchemaValidationError(fileName, result.error.issues[0]?.message ?? 'unknown');
  }
  return result.data.relationships_following.map(entryToAccount);
}

// ─── HTML helpers ─────────────────────────────────────────────────────────────

// Instagram HTML exports contain anchor tags like:
//   <a href="https://www.instagram.com/username">username</a>
// We extract all such hrefs. Timestamps are unreliable in HTML exports → null.
// Handles both direct profile URLs and Meta's _u/ redirect prefix:
//   https://www.instagram.com/username
//   https://www.instagram.com/_u/username
const IG_LINK_RE = /href="(https:\/\/www\.instagram\.com\/(?:_u\/)?([^"/?#]+)[^"]*)"/gi;

function parseAccountsFromHtml(html: string): Account[] {
  const accounts: Account[] = [];
  let match: RegExpExecArray | null;
  IG_LINK_RE.lastIndex = 0;
  while ((match = IG_LINK_RE.exec(html)) !== null) {
    const href = match[1];
    const username = match[2];
    if (href && username) {
      accounts.push({ username, href, followedAt: null });
    }
  }
  return accounts;
}

async function parseFollowersHtml(zip: JSZip, fileNames: string[]): Promise<Account[]> {
  const accounts: Account[] = [];
  for (const fname of fileNames) {
    const html = await zip.files[fname]!.async('string');
    accounts.push(...parseAccountsFromHtml(html));
  }
  return accounts;
}

async function parseFollowingHtml(zip: JSZip, fileName: string): Promise<Account[]> {
  const html = await zip.files[fileName]!.async('string');
  return parseAccountsFromHtml(html);
}

// ─── Format detection ─────────────────────────────────────────────────────────

type Format = 'json' | 'html';

interface DetectedFiles {
  format: Format;
  followerFileNames: string[];
  followingFileName: string;
}

function detectFiles(fileNames: string[]): DetectedFiles {
  const followerJson = fileNames.filter((n) => /followers_\d+\.json$/i.test(n)).sort();
  const followingJson = fileNames.find((n) => /following\.json$/i.test(n));

  const followerHtml = fileNames.filter((n) => /followers_\d+\.html?$/i.test(n)).sort();
  const followingHtml = fileNames.find((n) => /following\.html?$/i.test(n));

  const hasJson = followerJson.length > 0 || !!followingJson;
  const hasHtml = followerHtml.length > 0 || !!followingHtml;

  if (hasJson && hasHtml) throw new MixedFormatError();

  if (hasHtml) {
    const missing: string[] = [];
    if (followerHtml.length === 0) missing.push('followers_1.html');
    if (!followingHtml) missing.push('following.html');
    if (missing.length > 0) throw new MissingFilesError(missing);
    return { format: 'html', followerFileNames: followerHtml, followingFileName: followingHtml! };
  }

  // Default: JSON (or neither — will throw below)
  const missing: string[] = [];
  if (followerJson.length === 0) missing.push('followers_1.json');
  if (!followingJson) missing.push('following.json');
  if (missing.length > 0) throw new MissingFilesError(missing);

  return { format: 'json', followerFileNames: followerJson, followingFileName: followingJson! };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function parseInstagramZip(
  zipFile: File | Blob | ArrayBuffer,
): Promise<ParsedSnapshot> {
  // Normalize File/Blob → ArrayBuffer so jszip works consistently across envs
  const input = zipFile instanceof ArrayBuffer ? zipFile : await (zipFile as Blob).arrayBuffer();

  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(input);
  } catch (err) {
    throw new InvalidZipError(err);
  }

  const fileNames = Object.keys(zip.files);
  const { format, followerFileNames, followingFileName } = detectFiles(fileNames);

  let followers: Account[];
  let following: Account[];

  if (format === 'html') {
    followers = await parseFollowersHtml(zip, followerFileNames);
    following = await parseFollowingHtml(zip, followingFileName);
  } else {
    followers = await parseFollowersJson(zip, followerFileNames);
    following = await parseFollowingJson(zip, followingFileName);
  }

  // Optional extras — gracefully skip if not present in this export
  const pendingRequests = await parseOptionalRelationships(
    zip, fileNames,
    /pending_follow_requests\.json$/i,
    (data) => {
      const r = pendingRequestsFileSchema.safeParse(data);
      return r.success ? r.data.relationships_follow_requests_sent.map(entryToAccount) : null;
    },
  );

  const recentlyUnfollowed = await parseOptionalRelationships(
    zip, fileNames,
    /recently_unfollowed_profiles\.json$/i,
    (data) => {
      const r = recentlyUnfollowedFileSchema.safeParse(data);
      return r.success ? r.data.relationships_unfollowed_users.map(entryToAccount) : null;
    },
  );

  return {
    exportedAt: Math.floor(Date.now() / 1000),
    followers,
    following,
    ...(pendingRequests ? { pendingRequests } : {}),
    ...(recentlyUnfollowed ? { recentlyUnfollowed } : {}),
  };
}

async function parseOptionalRelationships(
  zip: JSZip,
  fileNames: string[],
  pattern: RegExp,
  parse: (data: unknown) => Account[] | null,
): Promise<Account[] | null> {
  const fname = fileNames.find(n => pattern.test(n));
  if (!fname) return null;
  try {
    const raw = await zip.files[fname]!.async('string');
    return parse(JSON.parse(raw));
  } catch {
    return null;
  }
}
