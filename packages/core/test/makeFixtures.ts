/**
 * Generates test ZIP fixtures programmatically.
 * Run with: node --loader ts-node/esm test/makeFixtures.ts
 * Or via: pnpm --filter @ig-tracker/core run make-fixtures
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import JSZip from 'jszip';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FIXTURES_DIR = join(__dirname, 'fixtures');

function makeEntry(username: string, timestamp = 1700000000) {
  return {
    title: username,
    media_list_data: [],
    string_list_data: [
      {
        href: `https://www.instagram.com/${username}`,
        value: username,
        timestamp,
      },
    ],
  };
}

function makeFollowingWrapper(entries: ReturnType<typeof makeEntry>[]) {
  return { relationships_following: entries };
}

async function writeZip(filename: string, zip: JSZip) {
  const buf = await zip.generateAsync({ type: 'nodebuffer' });
  writeFileSync(join(FIXTURES_DIR, filename), buf);
  console.log(`✓ ${filename}`);
}

async function main() {
  mkdirSync(FIXTURES_DIR, { recursive: true });

  // 1. valid-export.zip — standard single followers file
  {
    const z = new JSZip();
    z.file(
      'connections/followers_and_following/followers_1.json',
      JSON.stringify([makeEntry('alice'), makeEntry('bob'), makeEntry('charlie')]),
    );
    z.file(
      'connections/followers_and_following/following.json',
      JSON.stringify(makeFollowingWrapper([makeEntry('alice'), makeEntry('dave')])),
    );
    await writeZip('valid-export.zip', z);
  }

  // 2. paginated-followers.zip — followers_1.json + followers_2.json
  {
    const z = new JSZip();
    z.file(
      'connections/followers_and_following/followers_1.json',
      JSON.stringify([makeEntry('user1'), makeEntry('user2'), makeEntry('user3')]),
    );
    z.file(
      'connections/followers_and_following/followers_2.json',
      JSON.stringify([makeEntry('user4'), makeEntry('user5')]),
    );
    z.file(
      'connections/followers_and_following/following.json',
      JSON.stringify(makeFollowingWrapper([makeEntry('user1'), makeEntry('user6')])),
    );
    await writeZip('paginated-followers.zip', z);
  }

  // 3. empty-export.zip — valid but new account with zero followers/following
  {
    const z = new JSZip();
    z.file('connections/followers_and_following/followers_1.json', JSON.stringify([]));
    z.file(
      'connections/followers_and_following/following.json',
      JSON.stringify(makeFollowingWrapper([])),
    );
    await writeZip('empty-export.zip', z);
  }

  // 4. missing-followers.zip — only following.json, no followers file
  {
    const z = new JSZip();
    z.file(
      'connections/followers_and_following/following.json',
      JSON.stringify(makeFollowingWrapper([makeEntry('alice')])),
    );
    await writeZip('missing-followers.zip', z);
  }

  // 5. missing-following.zip — only followers file, no following.json
  {
    const z = new JSZip();
    z.file(
      'connections/followers_and_following/followers_1.json',
      JSON.stringify([makeEntry('alice')]),
    );
    await writeZip('missing-following.zip', z);
  }

  // 6. invalid-schema.zip — followers_1.json with wrong structure
  {
    const z = new JSZip();
    z.file(
      'connections/followers_and_following/followers_1.json',
      JSON.stringify([{ bad_field: 'wrong' }]),
    );
    z.file(
      'connections/followers_and_following/following.json',
      JSON.stringify(makeFollowingWrapper([])),
    );
    await writeZip('invalid-schema.zip', z);
  }

  // 7. html-export.zip — HTML format export (real Instagram markup with attrs before href)
  {
    const z = new JSZip();
    // Followers use direct profile URLs; following uses Meta's _u/ redirect prefix
    const followersHtml = `<!DOCTYPE html><html><body>
      <div class="_a705"><ul class="_a6-g">
        <li class="_a6-h"><a class="_a6-i" target="_blank" href="https://www.instagram.com/alice">alice</a></li>
        <li class="_a6-h"><a class="_a6-i" target="_blank" href="https://www.instagram.com/bob">bob</a></li>
        <li class="_a6-h"><a class="_a6-i" target="_blank" href="https://www.instagram.com/charlie">charlie</a></li>
      </ul></div>
    </body></html>`;
    const followingHtml = `<!DOCTYPE html><html><body>
      <div class="_a705"><ul class="_a6-g">
        <li class="_a6-h"><a class="_a6-i" target="_blank" href="https://www.instagram.com/_u/alice">alice</a></li>
        <li class="_a6-h"><a class="_a6-i" target="_blank" href="https://www.instagram.com/_u/dave">dave</a></li>
      </ul></div>
    </body></html>`;
    z.file('connections/followers_and_following/followers_1.html', followersHtml);
    z.file('connections/followers_and_following/following.html', followingHtml);
    await writeZip('html-export.zip', z);
  }

  // 8. mixed-format.zip — followers.html + following.json (invalid mix)
  {
    const z = new JSZip();
    z.file(
      'connections/followers_and_following/followers_1.html',
      '<html><body><a href="https://www.instagram.com/alice">alice</a></body></html>',
    );
    z.file(
      'connections/followers_and_following/following.json',
      JSON.stringify(makeFollowingWrapper([makeEntry('alice')])),
    );
    await writeZip('mixed-format.zip', z);
  }

  console.log('\nAll fixtures generated.');
}

main().catch(console.error);
