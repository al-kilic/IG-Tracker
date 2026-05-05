// src/parser.ts
import JSZip from "jszip";

// src/errors.ts
var InvalidZipError = class extends Error {
  code = "INVALID_ZIP";
  constructor(cause) {
    super("The file you uploaded is not a valid ZIP archive. Please try downloading it again from Instagram.");
    this.name = "InvalidZipError";
    if (cause instanceof Error) this.cause = cause;
  }
};
var MissingFilesError = class extends Error {
  code = "MISSING_FILES";
  constructor(missing) {
    super(
      `Your Instagram export is missing required files: ${missing.join(", ")}. Make sure you selected "Followers and Following" when requesting your data, and that you chose JSON format.`
    );
    this.name = "MissingFilesError";
  }
};
var MixedFormatError = class extends Error {
  code = "MIXED_FORMAT";
  constructor() {
    super(
      "Your export contains a mix of JSON and HTML files. Please re-download your Instagram data and choose a single format (JSON recommended)."
    );
    this.name = "MixedFormatError";
  }
};
var SchemaValidationError = class extends Error {
  code = "SCHEMA_VALIDATION";
  constructor(filename, detail) {
    super(
      `The file "${filename}" in your export has an unexpected format. Instagram may have changed their export structure. Detail: ${detail}`
    );
    this.name = "SchemaValidationError";
  }
};

// src/schemas.ts
import { z } from "zod";
var stringListItemSchema = z.object({
  href: z.string(),
  value: z.string().optional(),
  timestamp: z.number()
});
var relationshipEntrySchema = z.object({
  title: z.string().optional(),
  media_list_data: z.array(z.unknown()).optional(),
  string_list_data: z.tuple([stringListItemSchema])
});
var followersFileSchema = z.array(relationshipEntrySchema);
var followingFileSchema = z.object({
  relationships_following: z.array(relationshipEntrySchema)
});
var accountSchema = z.object({
  username: z.string(),
  href: z.string(),
  followedAt: z.number().nullable()
});
var parsedSnapshotSchema = z.object({
  exportedAt: z.number(),
  followers: z.array(accountSchema),
  following: z.array(accountSchema)
});

// src/parser.ts
function entryToAccount(entry) {
  const item = entry.string_list_data[0];
  const username = item.value ?? entry.title ?? "";
  return {
    username,
    href: item.href,
    followedAt: item.timestamp > 0 ? item.timestamp : null
  };
}
async function parseFollowersJson(zip, fileNames) {
  const accounts = [];
  for (const fname of fileNames) {
    const raw = await zip.files[fname].async("string");
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new SchemaValidationError(fname, "File is not valid JSON");
    }
    const result = followersFileSchema.safeParse(parsed);
    if (!result.success) {
      throw new SchemaValidationError(fname, result.error.issues[0]?.message ?? "unknown");
    }
    accounts.push(...result.data.map(entryToAccount));
  }
  return accounts;
}
async function parseFollowingJson(zip, fileName) {
  const raw = await zip.files[fileName].async("string");
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new SchemaValidationError(fileName, "File is not valid JSON");
  }
  const result = followingFileSchema.safeParse(parsed);
  if (!result.success) {
    throw new SchemaValidationError(fileName, result.error.issues[0]?.message ?? "unknown");
  }
  return result.data.relationships_following.map(entryToAccount);
}
var IG_LINK_RE = /href="(https:\/\/www\.instagram\.com\/(?:_u\/)?([^"/?#]+)[^"]*)"/gi;
function parseAccountsFromHtml(html) {
  const accounts = [];
  let match;
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
async function parseFollowersHtml(zip, fileNames) {
  const accounts = [];
  for (const fname of fileNames) {
    const html = await zip.files[fname].async("string");
    accounts.push(...parseAccountsFromHtml(html));
  }
  return accounts;
}
async function parseFollowingHtml(zip, fileName) {
  const html = await zip.files[fileName].async("string");
  return parseAccountsFromHtml(html);
}
function detectFiles(fileNames) {
  const followerJson = fileNames.filter((n) => /followers_\d+\.json$/i.test(n)).sort();
  const followingJson = fileNames.find((n) => /following\.json$/i.test(n));
  const followerHtml = fileNames.filter((n) => /followers_\d+\.html?$/i.test(n)).sort();
  const followingHtml = fileNames.find((n) => /following\.html?$/i.test(n));
  const hasJson = followerJson.length > 0 || !!followingJson;
  const hasHtml = followerHtml.length > 0 || !!followingHtml;
  if (hasJson && hasHtml) throw new MixedFormatError();
  if (hasHtml) {
    const missing2 = [];
    if (followerHtml.length === 0) missing2.push("followers_1.html");
    if (!followingHtml) missing2.push("following.html");
    if (missing2.length > 0) throw new MissingFilesError(missing2);
    return { format: "html", followerFileNames: followerHtml, followingFileName: followingHtml };
  }
  const missing = [];
  if (followerJson.length === 0) missing.push("followers_1.json");
  if (!followingJson) missing.push("following.json");
  if (missing.length > 0) throw new MissingFilesError(missing);
  return { format: "json", followerFileNames: followerJson, followingFileName: followingJson };
}
async function parseInstagramZip(zipFile) {
  const input = zipFile instanceof ArrayBuffer ? zipFile : await zipFile.arrayBuffer();
  let zip;
  try {
    zip = await JSZip.loadAsync(input);
  } catch (err) {
    throw new InvalidZipError(err);
  }
  const fileNames = Object.keys(zip.files);
  const { format, followerFileNames, followingFileName } = detectFiles(fileNames);
  let followers;
  let following;
  if (format === "html") {
    followers = await parseFollowersHtml(zip, followerFileNames);
    following = await parseFollowingHtml(zip, followingFileName);
  } else {
    followers = await parseFollowersJson(zip, followerFileNames);
    following = await parseFollowingJson(zip, followingFileName);
  }
  return {
    exportedAt: Math.floor(Date.now() / 1e3),
    followers,
    following
  };
}

// src/diff.ts
function byUsername(a, b) {
  return a.username.localeCompare(b.username);
}
function analyzeSnapshot(snapshot) {
  const followerSet = new Set(snapshot.followers.map((a) => a.username));
  const followingSet = new Set(snapshot.following.map((a) => a.username));
  const followerMap = new Map(snapshot.followers.map((a) => [a.username, a]));
  const followingMap = new Map(snapshot.following.map((a) => [a.username, a]));
  const nonFollowers = [];
  const mutuals = [];
  for (const username of followingSet) {
    if (!followerSet.has(username)) {
      nonFollowers.push(followingMap.get(username));
    } else {
      mutuals.push(followingMap.get(username));
    }
  }
  const fans = [];
  for (const username of followerSet) {
    if (!followingSet.has(username)) {
      fans.push(followerMap.get(username));
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
    ratio
  };
}
function compareSnapshots(old, current) {
  const oldFollowerSet = new Set(old.followers.map((a) => a.username));
  const currentFollowerSet = new Set(current.followers.map((a) => a.username));
  const oldFollowingSet = new Set(old.following.map((a) => a.username));
  const currentFollowingSet = new Set(current.following.map((a) => a.username));
  const currentFollowerMap = new Map(current.followers.map((a) => [a.username, a]));
  const oldFollowerMap = new Map(old.followers.map((a) => [a.username, a]));
  const currentFollowingMap = new Map(current.following.map((a) => [a.username, a]));
  const oldFollowingMap = new Map(old.following.map((a) => [a.username, a]));
  const newFollowers = [];
  for (const username of currentFollowerSet) {
    if (!oldFollowerSet.has(username)) {
      newFollowers.push(currentFollowerMap.get(username));
    }
  }
  const lostFollowers = [];
  for (const username of oldFollowerSet) {
    if (!currentFollowerSet.has(username)) {
      lostFollowers.push(oldFollowerMap.get(username));
    }
  }
  const newFollowing = [];
  for (const username of currentFollowingSet) {
    if (!oldFollowingSet.has(username)) {
      newFollowing.push(currentFollowingMap.get(username));
    }
  }
  const unfollowed = [];
  for (const username of oldFollowingSet) {
    if (!currentFollowingSet.has(username)) {
      unfollowed.push(oldFollowingMap.get(username));
    }
  }
  const periodDays = (current.exportedAt - old.exportedAt) / 86400;
  return {
    newFollowers: newFollowers.sort(byUsername),
    lostFollowers: lostFollowers.sort(byUsername),
    newFollowing: newFollowing.sort(byUsername),
    unfollowed: unfollowed.sort(byUsername),
    periodDays
  };
}
function findGhostFollowers(snapshot, options) {
  const minTenureDays = options?.minTenureDays ?? 180;
  const minTenureSeconds = minTenureDays * 86400;
  const followingSet = new Set(snapshot.following.map((a) => a.username));
  const now = Math.floor(Date.now() / 1e3);
  return snapshot.followers.filter((account) => {
    if (followingSet.has(account.username)) return false;
    if (account.followedAt === null) return false;
    return now - account.followedAt >= minTenureSeconds;
  }).sort(byUsername);
}
export {
  InvalidZipError,
  MissingFilesError,
  MixedFormatError,
  SchemaValidationError,
  analyzeSnapshot,
  compareSnapshots,
  findGhostFollowers,
  parseInstagramZip
};
