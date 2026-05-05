import JSZip from 'jszip';
import { InvalidZipError, MissingFilesError, MixedFormatError, SchemaValidationError, } from './errors.js';
import { followersFileSchema, followingFileSchema, } from './schemas.js';
// ─── JSON helpers ─────────────────────────────────────────────────────────────
function entryToAccount(entry) {
    const item = entry.string_list_data[0];
    return {
        username: item.value,
        href: item.href,
        followedAt: item.timestamp > 0 ? item.timestamp : null,
    };
}
async function parseFollowersJson(zip, fileNames) {
    const accounts = [];
    for (const fname of fileNames) {
        const raw = await zip.files[fname].async('string');
        let parsed;
        try {
            parsed = JSON.parse(raw);
        }
        catch {
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
async function parseFollowingJson(zip, fileName) {
    const raw = await zip.files[fileName].async('string');
    let parsed;
    try {
        parsed = JSON.parse(raw);
    }
    catch {
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
        const html = await zip.files[fname].async('string');
        accounts.push(...parseAccountsFromHtml(html));
    }
    return accounts;
}
async function parseFollowingHtml(zip, fileName) {
    const html = await zip.files[fileName].async('string');
    return parseAccountsFromHtml(html);
}
function detectFiles(fileNames) {
    const followerJson = fileNames.filter((n) => /followers_\d+\.json$/i.test(n)).sort();
    const followingJson = fileNames.find((n) => /following\.json$/i.test(n));
    const followerHtml = fileNames.filter((n) => /followers_\d+\.html?$/i.test(n)).sort();
    const followingHtml = fileNames.find((n) => /following\.html?$/i.test(n));
    const hasJson = followerJson.length > 0 || !!followingJson;
    const hasHtml = followerHtml.length > 0 || !!followingHtml;
    if (hasJson && hasHtml)
        throw new MixedFormatError();
    if (hasHtml) {
        const missing = [];
        if (followerHtml.length === 0)
            missing.push('followers_1.html');
        if (!followingHtml)
            missing.push('following.html');
        if (missing.length > 0)
            throw new MissingFilesError(missing);
        return { format: 'html', followerFileNames: followerHtml, followingFileName: followingHtml };
    }
    // Default: JSON (or neither — will throw below)
    const missing = [];
    if (followerJson.length === 0)
        missing.push('followers_1.json');
    if (!followingJson)
        missing.push('following.json');
    if (missing.length > 0)
        throw new MissingFilesError(missing);
    return { format: 'json', followerFileNames: followerJson, followingFileName: followingJson };
}
// ─── Public API ───────────────────────────────────────────────────────────────
export async function parseInstagramZip(zipFile) {
    // Normalize File/Blob → ArrayBuffer so jszip works consistently across envs
    const input = zipFile instanceof ArrayBuffer ? zipFile : await zipFile.arrayBuffer();
    let zip;
    try {
        zip = await JSZip.loadAsync(input);
    }
    catch (err) {
        throw new InvalidZipError(err);
    }
    const fileNames = Object.keys(zip.files);
    const { format, followerFileNames, followingFileName } = detectFiles(fileNames);
    let followers;
    let following;
    if (format === 'html') {
        followers = await parseFollowersHtml(zip, followerFileNames);
        following = await parseFollowingHtml(zip, followingFileName);
    }
    else {
        followers = await parseFollowersJson(zip, followerFileNames);
        following = await parseFollowingJson(zip, followingFileName);
    }
    return {
        exportedAt: Math.floor(Date.now() / 1000),
        followers,
        following,
    };
}
//# sourceMappingURL=parser.js.map