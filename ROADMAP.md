# ROADMAP.md — IG Tracker WBS + Agent Prompts

> This file is the master build plan. It contains the Work Breakdown Structure (WBS) for the entire project, estimates, and copy-paste-ready prompts for Claude Code / Gemini CLI. Work through items **in order**. Mark `[x]` when done.

**How to use:**

1. Find the next unchecked WBS item
2. Open VS Code + Claude CLI in the project root
3. Copy the prompt block under that item → paste into the agent
4. Review output, run tests, commit
5. Mark item `[x]` and move to the next

**Estimates** are for a solo vibe-coder using Claude Code. Add 30% buffer if unfamiliar with the stack.

---

## Phase Overview

| Phase       | Scope                            | Duration  | Target                 |
| ----------- | -------------------------------- | --------- | ---------------------- |
| **Phase 0** | Project setup & tooling          | 1 day     | Working monorepo       |
| **Phase 1** | Core parser package (MIT)        | 2-3 days  | Tested `packages/core` |
| **Phase 2** | Web MVP (client-side only)       | 5-7 days  | Deployable on Vercel   |
| **Phase 3** | Launch prep + ship               | 2-3 days  | Live product           |
| **Phase 4** | Pro tier (cloud sync + payments) | 2-3 weeks | Paying customers       |
| **Phase 5** | Desktop app (Tauri)              | 1-2 weeks | $19 one-time sale      |
| **Phase 6** | B2B agency dashboard             | 3-4 weeks | First agency customer  |

**Critical path to revenue:** Phase 0 → 1 → 2 → 3 (ship free) → 4 (enable Pro) ≈ 5-7 weeks

---

# PHASE 0 — Project Setup

Goal: Clean monorepo with tooling, CI, licensing, and documentation scaffolding.

---

## [ ] 0.1 — Initialize monorepo

**Estimate:** 1-2 hours

**Prompt:**

```
Read CLAUDE.md first.

Task: 0.1 — Initialize the monorepo structure.

Scope for this session:
- Create pnpm-workspace.yaml with packages/* and apps/*
- Create root package.json with scripts: dev, build, typecheck, lint, test
- Install turbo as root devDependency
- Create turbo.json with pipeline for build, dev, typecheck, lint, test
- Create .gitignore, .editorconfig, .nvmrc (node 20)
- Create empty folders: packages/core, packages/ui, apps/web, docs

Out of scope:
- Don't install app/package-specific deps yet
- No code logic yet, just the scaffolding

Deliverable: `pnpm install` works at root and `pnpm typecheck` runs (even with nothing to check).
```

---

## [ ] 0.2 — Licensing and docs skeleton

**Estimate:** 30 min

**Prompt:**

```
Read CLAUDE.md first.

Task: 0.2 — Set up licensing and documentation files.

Scope:
- Root LICENSE file: AGPL-3.0 (since top-level web app is AGPL)
- packages/core/LICENSE: MIT
- Create README.md at root with: project name, one-liner, "under construction" notice, local-first claim, link to CLAUDE.md
- Create empty TODO.md with "# Running Follow-ups" heading
- Create docs/instagram-zip-format.md — paste the Instagram ZIP format section from CLAUDE.md Section 7

Out of scope:
- No privacy policy yet (that's Phase 2)
- No fancy README — keep it minimal
```

---

## [ ] 0.3 — Configure TypeScript, ESLint, Prettier

**Estimate:** 1 hour

**Prompt:**

```
Read CLAUDE.md first.

Task: 0.3 — Add linting and formatting.

Scope:
- Root tsconfig.base.json with strict mode, noUncheckedIndexedAccess, moduleResolution: bundler
- ESLint flat config (eslint.config.js) with:
  - @typescript-eslint/recommended
  - no-explicit-any: error
  - no-unused-vars: error
- Prettier config (.prettierrc) with 2-space indent, single quotes, trailing comma all
- Husky + lint-staged for pre-commit: typecheck + lint + prettier
- Add scripts: "lint", "format", "typecheck" that work across the monorepo via turbo

Out of scope:
- Don't add app-specific configs yet
- Don't add tests yet

Verify: `pnpm lint` and `pnpm typecheck` exit 0 on empty workspace.
```

---

## [ ] 0.4 — Set up Git + GitHub repo

**Estimate:** 15 min (manual, no agent needed)

**Checklist (do manually):**

- [ ] `git init`
- [ ] Create GitHub repo (private for now, make public at Phase 3)
- [ ] `git remote add origin ...`
- [ ] First commit: `chore: initialize monorepo`
- [ ] Push to `main`
- [ ] Enable branch protection on `main` (require PR, require checks)

---

# PHASE 1 — Core Parser Package

Goal: A standalone `packages/core` library that parses Instagram ZIPs, computes diffs, and is thoroughly tested. This is the open-source heart of the product.

---

## [ ] 1.1 — Define zod schemas for Instagram export

**Estimate:** 1-2 hours

**Prompt:**

```
Read CLAUDE.md first, especially Section 7 (Instagram ZIP Format).

Task: 1.1 — Build zod schemas for Instagram export data.

Scope for this session:
Create packages/core/src/schemas.ts with:

1. `relationshipEntrySchema` — validates a single entry:
   { title: string, media_list_data: unknown[], string_list_data: [{ href, value, timestamp }] }

2. `followersFileSchema` — top-level array of relationshipEntrySchema

3. `followingFileSchema` — { relationships_following: relationshipEntrySchema[] }

4. `parsedSnapshotSchema` — the normalized internal format:
   {
     exportedAt: number (unix),
     followers: { username, href, followedAt }[],
     following: { username, href, followedAt }[]
   }

5. Export TypeScript types inferred from each schema.

Write tests (packages/core/src/schemas.test.ts) with vitest:
- Valid followers JSON passes
- Valid following JSON passes
- Missing fields fail with clear zod error
- Edge case: empty array/empty relationships_following

Use vitest. Add vitest as devDep and "test" script to packages/core/package.json.

Out of scope:
- Don't write the parser yet (that's 1.2)
- No ZIP extraction logic yet
```

---

## [ ] 1.2 — ZIP extraction and parsing

**Estimate:** 3-4 hours

**Prompt:**

````
Read CLAUDE.md first.

Task: 1.2 — Parse an Instagram ZIP file into the normalized snapshot format.

Scope:
Create packages/core/src/parser.ts exporting:

```ts
export async function parseInstagramZip(
  zipFile: File | Blob | ArrayBuffer
): Promise<ParsedSnapshot>
````

Behavior:

1. Uses jszip to extract the archive
2. Finds files matching:
   - `**/followers_*.json` (may be paginated: followers_1.json, followers_2.json, ...)
   - `**/following.json`
3. Validates each file against schemas from 1.1
4. Merges all followers\_\*.json entries into a single array
5. Returns ParsedSnapshot with `exportedAt` = current timestamp

Error handling:

- Throw typed errors: `InvalidZipError`, `MissingFilesError`, `SchemaValidationError`
- Each error has a user-friendly `.message` in English (i18n later)

Tests (parser.test.ts):

- Parses a valid ZIP (create fixture under packages/core/test/fixtures/valid-export.zip)
- Throws MissingFilesError when followers\_\*.json absent
- Throws MissingFilesError when following.json absent
- Handles paginated followers (followers_1.json + followers_2.json merged)
- Throws InvalidZipError on malformed ZIP
- Empty arrays are valid (new accounts)

For fixtures: write a small node script `packages/core/test/makeFixtures.ts` that generates test ZIPs programmatically using jszip. Don't commit real user data.

Install jszip in packages/core.

Out of scope:

- HTML format parsing (that's 1.3)
- Diff logic (that's 1.4)

```

---

## [ ] 1.3 — HTML format fallback parser

**Estimate:** 2-3 hours

**Prompt:**
```

Read CLAUDE.md first.

Task: 1.3 — Add HTML format fallback to the parser.

Context: Users can choose JSON or HTML when downloading their Instagram data. We default to JSON, but must gracefully parse HTML exports too.

Scope:

1. Extend `parseInstagramZip` to detect HTML vs JSON based on file extension
2. If HTML: extract usernames and hrefs from the HTML structure (cheerio or native DOMParser)
3. Since HTML export lacks reliable timestamps, set followedAt to 0 (sentinel for "unknown")
4. Normalize output to the same ParsedSnapshot shape

Add tests:

- HTML export parses correctly
- Mixed ZIP (followers.html + following.json) is rejected with clear error ("use a single format")
- Timestamps of 0 are flagged in parsed output as `followedAt: null`

Update ParsedSnapshot type: `followedAt: number | null`.

Update CLAUDE.md Section 7 if any schema details change.

Out of scope:

- Don't re-parse existing JSON fixtures (they still work)

```

---

## [ ] 1.4 — Diff engine

**Estimate:** 2 hours

**Prompt:**
```

Read CLAUDE.md first.

Task: 1.4 — Build the diff logic.

Scope:
Create packages/core/src/diff.ts exporting:

```ts
export function analyzeSnapshot(snapshot: ParsedSnapshot): SingleSnapshotAnalysis;
export function compareSnapshots(old: ParsedSnapshot, current: ParsedSnapshot): SnapshotComparison;
```

SingleSnapshotAnalysis shape:
{
nonFollowers: Account[], // you follow them, they don't follow you
fans: Account[], // they follow you, you don't follow them
mutuals: Account[], // both follow each other
totalFollowers: number,
totalFollowing: number,
ratio: number // followers / following
}

SnapshotComparison shape:
{
newFollowers: Account[], // in current.followers but not in old.followers
lostFollowers: Account[], // in old.followers but not in current.followers (= UNFOLLOWERS)
newFollowing: Account[], // you followed since last snapshot
unfollowed: Account[], // you unfollowed since last snapshot
periodDays: number // (current.exportedAt - old.exportedAt) / 86400
}

Use Set operations for performance. Return accounts sorted alphabetically.

Write comprehensive tests with fixture snapshots:

- 100% coverage on diff.ts is the target
- Edge cases: identical snapshots, empty snapshots, huge snapshots (10k entries)

Out of scope:

- Ghost follower approximation (that's Pro, later)
- UI rendering

```

---

## [ ] 1.5 — Public package API

**Estimate:** 30 min

**Prompt:**
```

Read CLAUDE.md first.

Task: 1.5 — Finalize packages/core public API.

Scope:

- Create packages/core/src/index.ts that re-exports:
  - parseInstagramZip
  - analyzeSnapshot, compareSnapshots
  - All types: ParsedSnapshot, Account, SingleSnapshotAnalysis, SnapshotComparison
  - Error classes: InvalidZipError, MissingFilesError, SchemaValidationError
- Do NOT re-export internal helpers or zod schemas
- Update packages/core/package.json:
  - "main": "./dist/index.js"
  - "types": "./dist/index.d.ts"
  - "exports" field with proper ESM/CJS conditions
  - "files": ["dist"]
- Add tsup as devDep for bundling; add "build" script: `tsup src/index.ts --format esm,cjs --dts`

Verify:

- `pnpm --filter @ig-tracker/core build` produces dist/
- Import test: from apps/web (empty file), `import { parseInstagramZip } from '@ig-tracker/core'` resolves

Out of scope:

- No publishing to npm yet (we'll decide at launch)

```

---

# PHASE 2 — Web MVP

Goal: A deployable Next.js app where a user uploads a ZIP and sees their analysis. Client-side only, zero server state.

---

## [ ] 2.1 — Bootstrap Next.js app

**Estimate:** 1 hour

**Prompt:**
```

Read CLAUDE.md first.

Task: 2.1 — Initialize apps/web as a Next.js 15 + Tailwind 4 project.

Scope:

- Use `create-next-app` with TypeScript, App Router, Tailwind, ESLint, src directory: no (use top-level app/)
- Remove default boilerplate (public/\*.svg, example page content)
- Configure Tailwind v4 with the palette from CLAUDE.md Section 9:
  - primary: #01696F
  - background: #F4F0E8 (light), #0B2426 (dark)
  - accent: #A84B2F
- Add Fontshare imports for Satoshi + General Sans in app/layout.tsx
- Set up theme provider with next-themes for dark mode
- Add @ig-tracker/core as workspace dep
- Make a placeholder app/page.tsx with just "<h1>IG Tracker</h1>"

Out of scope:

- No shadcn setup yet (that's 2.2)
- No real UI yet

```

---

## [ ] 2.2 — Install and configure shadcn/ui

**Estimate:** 45 min

**Prompt:**
```

Read CLAUDE.md first.

Task: 2.2 — Set up shadcn/ui in apps/web.

Scope:

- Run shadcn init with our palette (customize CSS variables in globals.css to match CLAUDE.md Section 9)
- Install these components to start: button, card, input, label, dialog, toast, tabs, badge, table, progress
- Create apps/web/components/theme-toggle.tsx (sun/moon icon toggle using next-themes)
- Update app/layout.tsx to include <Toaster /> and <ThemeProvider>

Out of scope:

- No shared packages/ui extraction yet — keep components local to apps/web until we need reuse

```

---

## [ ] 2.3 — Build the upload zone

**Estimate:** 2-3 hours

**Prompt:**
```

Read CLAUDE.md first.

Task: 2.3 — Build the ZIP upload component.

Scope:
Create apps/web/components/upload-zone.tsx — a client component that:

- Accepts drag-and-drop OR click-to-select
- Only accepts .zip files (validate by MIME + extension)
- Shows clear states: idle, dragging, processing, success, error
- Uses @ig-tracker/core's parseInstagramZip to process
- On success: stores ParsedSnapshot in Zustand store + navigates to /results
- On error: shows error toast with the error's user-friendly message
- Max file size: 500MB (show error above this)
- Shows a progress bar during processing (even if fake — feels better)

Create apps/web/lib/store.ts (Zustand) with:

- currentSnapshot: ParsedSnapshot | null
- setSnapshot(s)
- clearSnapshot()

Put the component on app/page.tsx as the hero section.

Accessibility:

- Keyboard accessible (Enter/Space to open file picker)
- ARIA labels on drop zone
- Screen reader announcement on success/error

Out of scope:

- No results page yet (that's 2.4)
- No historical snapshots yet (that's 2.5)

```

---

## [ ] 2.4 — Results page

**Estimate:** 3-4 hours

**Prompt:**
```

Read CLAUDE.md first.

Task: 2.4 — Build the results page (/results) showing snapshot analysis.

Scope:
Create app/results/page.tsx — a client component that:

- Reads currentSnapshot from Zustand store
- If no snapshot: redirects to "/" with toast "Upload a file first"
- Calls analyzeSnapshot() from @ig-tracker/core

Layout:

- Stats header: 4 cards (Total Followers, Total Following, Mutuals, Ratio)
- 3 tabs (shadcn Tabs):
  1. "Non-followers" — list of accounts you follow who don't follow back
  2. "Fans" — list of accounts who follow you but you don't follow back
  3. "Mutuals" — list of mutual follows
- Each list row: avatar placeholder, @username, followedAt date (if not null), "Open on Instagram" link (new tab)
- Search input above the list (filter by username)
- "Export CSV" button above the list (downloads current tab's data)

Use shadcn Table for the lists. Virtualize if over 500 rows (use @tanstack/react-virtual).

CSV export util: apps/web/lib/csv.ts — takes array of Account objects, triggers browser download.

Out of scope:

- No historical comparison yet (that's 2.5)
- No charts yet (that's Pro)

```

---

## [ ] 2.5 — Snapshot history (IndexedDB)

**Estimate:** 3 hours

**Prompt:**
```

Read CLAUDE.md first.

Task: 2.5 — Persist snapshots locally and enable comparison.

Scope:

1. Install Dexie in apps/web
2. Create apps/web/lib/db.ts — Dexie setup with one table:
   snapshots: ++id, exportedAt, label (user-provided or auto), data (JSON blob)
3. Create apps/web/hooks/useSnapshots.ts with:
   - list() — all snapshots, newest first
   - save(snapshot, label?) — persist
   - remove(id)
   - get(id)
4. After successful upload in UploadZone: auto-save to Dexie with label = "Upload YYYY-MM-DD HH:mm"
5. Free tier cap: store max 3 snapshots. When adding 4th: show dialog "Upgrade to Pro for unlimited history" + option to delete oldest. (Pro gating is just a UI teaser for now — no real paywall yet.)
6. Create app/history/page.tsx — list all saved snapshots with:
   - Label, date, "View" button, "Delete" button
   - "Compare with..." dropdown — select another snapshot → routes to /compare?old=X&current=Y
7. Create app/compare/page.tsx — loads both snapshots, calls compareSnapshots(), shows 4 sections:
   - Lost followers (unfollowers)
   - New followers
   - You unfollowed
   - You started following

Each section: same Table UI as 2.4, own CSV export.

Out of scope:

- No cloud sync (that's Pro, Phase 4)
- No charts

```

---

## [ ] 2.6 — Landing page polish

**Estimate:** 3-4 hours

**Prompt:**
```

Read CLAUDE.md first, especially Section 9 (Brand & UX).

Task: 2.6 — Build a proper landing page.

Scope for app/page.tsx (redesign fully):

1. Hero: big headline ("See who unfollowed you. Without giving anyone your password."), subhead, UploadZone component, "How it works" link
2. "How it works" section (3 steps with icons):
   - Request your data from Instagram (link to official IG settings)
   - Download the ZIP they email you (1-2 min)
   - Drop it here — we parse it in your browser
3. "Why this isn't like the other tools" section:
   - Comparison table: our tool vs FollowMeter vs Reports+ (login required, cloud storage, open source)
4. "Privacy architecture" section — 3 cards: client-side processing, no account required, open source (link to GitHub)
5. Pricing teaser: Free / Pro $4.99 / Desktop $19 — with "Free is enough for most people"
6. Footer: GitHub link, privacy policy link, contact email

Follow the voice rules in CLAUDE.md Section 9. No emojis. No "revolutionary" language.

Create a /privacy page with the privacy policy (minimal: we store nothing unless you upgrade to Pro, contact email for questions).

Out of scope:

- No blog yet
- No internationalization yet (English only for MVP; Turkish/Vietnamese when Pro launches)

```

---

## [ ] 2.7 — How-to-export page

**Estimate:** 2 hours

**Prompt:**
```

Read CLAUDE.md first.

Task: 2.7 — Build the "How to download your Instagram data" walkthrough.

Scope:
Create app/how-to-export/page.tsx with:

- Step-by-step instructions with screenshots/illustrations:
  1. Open Instagram app → Profile → Menu → Settings and Privacy
  2. Accounts Center → Your Information and Permissions → Export Your Information
  3. Select "Export your information" → Create Export > Choose Profile > Choose where to Export > Customize Information > (make sure you have Followers and Following) > START EXPORT
  4. Format: JSON (highlight why JSON)
  5. "Send to: Download to Device" → Create Files
  6. Wait 1-2 minutes → download link arrives by email
- Callout: "The link expires in 4 days, so download soon."
- Callout: "Only request Followers + Following — don't request everything (48hr wait)"
- At the bottom: "Got the ZIP? Upload it now" button → scrolls to UploadZone on home page

Use placeholder screenshot boxes for now (real screenshots added before launch).

Link to this page from the landing page "How it works" section.

Out of scope:

- Video walkthrough (that's Pro v2)
- Turkish/Vietnamese translations

```

---

## [ ] 2.8 — SEO + metadata

**Estimate:** 1-2 hours

**Prompt:**
```

Read CLAUDE.md first.

Task: 2.8 — Add metadata, Open Graph, and basic SEO.

Scope:

- Set metadata in app/layout.tsx: title template, description, keywords, OG image path, twitter card
- Generate a simple OG image (apps/web/public/og.png) — 1200x630, dark teal background, headline "See who unfollowed you. Privately."
- Add sitemap.ts and robots.ts in app/
- Add JSON-LD (SoftwareApplication schema) to landing page
- Configure metadataBase in layout
- Add favicon + apple-touch-icon (simple geometric mark, can use a generator for now)

Out of scope:

- No Google Search Console setup yet (do at launch)
- No advanced SEO/content yet

```

---

# PHASE 3 — Launch

Goal: Go live, get first 100 users, validate that the product works in the wild.

---

## [ ] 3.1 — Pre-launch QA

**Estimate:** 1 day

**Prompt:**
```

Read CLAUDE.md first.

Task: 3.1 — Full manual QA pass before shipping.

Scope:
Run this full checklist and report findings as a markdown table. Fix any P0 bugs immediately; create TODO items for P1/P2.

1. Happy path: upload valid ZIP → see results → export CSV
2. Happy path: upload two ZIPs, compare → see diff
3. Error: upload non-ZIP file → see helpful error
4. Error: upload ZIP without Instagram structure → see clear error
5. Error: upload 600MB ZIP → rejected with size error
6. Mobile (Safari iOS): landing renders, upload works (at least file picker), results page is responsive
7. Mobile (Chrome Android): same
8. Dark mode: every page renders correctly
9. Keyboard navigation: can I tab through everything?
10. Screen reader (VoiceOver or NVDA): announcements make sense
11. No console errors or warnings in production build
12. `pnpm build && pnpm start` serves without error
13. Lighthouse score: target 95+ for performance, 100 for accessibility, 100 for best practices

Report:

- Table with columns: Test | Result (pass/fail) | Notes | Action
- List of bugs by priority

```

---

## [ ] 3.2 — Provision VPS and deploy

**Estimate:** 1 day (first time), 2-3 hours (subsequent deploys are automated)

**3.2.a — Rent and bootstrap VPS (manual)**

**Checklist:**
- [ ] Create Hetzner Cloud account
- [ ] Create CX22 server (2 vCPU, 4GB RAM, ~€4.51/mo) in Germany (NBG1) or Finland (HEL1)
- [ ] OS: Ubuntu 24.04 LTS
- [ ] Add your SSH public key during creation
- [ ] Reserve a domain name (Namecheap, Porkbun, Spaceship — ~$10/year)
- [ ] Point domain A record to VPS IPv4, AAAA to IPv6
- [ ] Create non-root sudo user, disable root SSH login, enable ufw (allow 22, 80, 443)
- [ ] Enable automatic security updates: `unattended-upgrades`

**3.2.b — Server bootstrap script**

**Prompt:**
```

Read CLAUDE.md first.

Task: 3.2.b — Write a server bootstrap script.

Scope:
Create ops/bootstrap.sh — idempotent bash script run once on a fresh Ubuntu 24.04 VPS:

1. Install Docker + Docker Compose plugin (official Docker repo, not distro version)
2. Install fail2ban, ufw (allow 22, 80, 443 only)
3. Create /srv/ig-tracker as app directory with subdirs: data/postgres, data/snapshots, data/caddy, data/backups
4. Create a deploy user `deploy` added to docker group, with its own SSH authorized_keys
5. Print post-install checklist (swap file, timezone, hostname)

Also create ops/README.md with step-by-step instructions: how to run the bootstrap, how to SSH as deploy user, how to deploy, how to rollback.

Out of scope:

- No Ansible or Terraform — keep it simple, one bash script
- No Kubernetes, ever

```

**3.2.c — Production Docker Compose stack**

**Prompt:**
```

Read CLAUDE.md first.

Task: 3.2.c — Build the production docker-compose stack.

Scope:
Create ops/docker-compose.yml with these services:

1. `web` — Next.js standalone output (built by GitHub Actions, pulled from GHCR). Env from .env file. Internal port 3000.
2. `postgres` — postgres:16-alpine. Volume: /srv/ig-tracker/data/postgres. Env: POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB (from .env). Healthcheck.
3. `caddy` — caddy:2-alpine. Reverse proxy for web service. Ports 80+443. Auto HTTPS via Let's Encrypt. Volumes: /srv/ig-tracker/data/caddy, ./Caddyfile:/etc/caddy/Caddyfile
4. `plausible` — plausible/analytics (optional, commented out for now)
5. `uptime-kuma` — louislam/uptime-kuma (commented out for now)

Create ops/Caddyfile with:

- yourdomain.com reverse_proxy to web:3000
- automatic HTTPS
- basic security headers (HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)

Create ops/.env.example with all required env vars documented.

Create ops/Dockerfile (multi-stage for the Next.js web app):

- Stage 1: pnpm build with output: 'standalone' in next.config.js
- Stage 2: node:20-alpine with just the standalone output and public/.next/static
- Expose 3000, run as non-root user

Update apps/web/next.config.js: set `output: 'standalone'` conditionally via env.

Out of scope:

- No Kubernetes
- No Portainer / CasaOS — raw docker compose is fine

```

**3.2.d — GitHub Actions: build + deploy**

**Prompt:**
```

Read CLAUDE.md first.

Task: 3.2.d — Set up CI/CD via GitHub Actions.

Scope:
Create .github/workflows/deploy.yml that:

1. Triggers on push to main
2. Runs typecheck + lint + test
3. Builds Docker image from ops/Dockerfile
4. Tags with commit SHA + latest
5. Pushes to GHCR (ghcr.io/<user>/ig-tracker-web) — GHCR is free for public repos, small cost for private
6. SSHs to VPS as deploy user, runs: `cd /srv/ig-tracker && docker compose pull && docker compose up -d && docker image prune -f`

Required secrets in GitHub repo:

- VPS_HOST, VPS_USER (deploy), VPS_SSH_KEY (private key)
- GHCR_TOKEN (auto-provided via GITHUB_TOKEN for public repo)

Also add .github/workflows/db-backup.yml:

- Runs daily at 03:00 UTC
- SSHs to VPS, runs pg_dump | gzip, uploads to Backblaze B2 (or Hetzner Storage Box)
- Retains last 30 daily + 12 monthly backups

Update ops/README.md with rollback procedure (redeploy specific SHA).

Out of scope:

- No staging env yet (later, Phase 4)
- No blue/green deploy yet — brief downtime on deploy is acceptable

```

**3.2.e — Smoke test production**

- [ ] Visit domain → app loads over HTTPS
- [ ] Upload test ZIP → parses correctly
- [ ] Check `docker compose logs` — no errors
- [ ] Test DB connection: `docker exec -it postgres psql -U ...`
- [ ] Verify backup runs and creates a file on B2

**Prompt for any deploy issues:**
```

Read CLAUDE.md first.

Task: 3.2 debugging — Fix deploy.

Context: [paste error log or compose ps output]

Scope: Diagnose and fix. Do not change the stack or switch to a managed platform.

```

---

## [ ] 3.3 — Open-source the repo

**Estimate:** 1 hour

**Prompt:**
```

Read CLAUDE.md first.

Task: 3.3 — Prepare the repo for public open-source release.

Scope:

- Rewrite README.md to be a proper OSS README:
  - Project name + badge strip (license, stars, build status)
  - One-paragraph "what is this"
  - Screenshots (placeholder boxes OK for now)
  - "Try it now" link (production URL)
  - "How it works" short section
  - "Development" section: clone, install, dev server
  - "License" section explaining MIT core / AGPL web split
  - "Security" section: link to SECURITY.md for responsible disclosure
  - "Contributing" section: link to CONTRIBUTING.md
- Create CONTRIBUTING.md with: code of conduct link, dev setup, commit style, PR process
- Create SECURITY.md with: how to report vulnerabilities (email), response SLA
- Create CODE_OF_CONDUCT.md (use Contributor Covenant 2.1)
- Create .github/ISSUE_TEMPLATE/bug_report.md and feature_request.md
- Create .github/pull_request_template.md
- Create .github/workflows/ci.yml: on PR, run typecheck + lint + test

Do not make the repo public yet — wait for my confirmation after I review.

Out of scope:

- No npm publish yet
- No release automation yet

```

---

## [ ] 3.4 — Launch announcements

**Estimate:** 1-2 days (mostly manual)

**Checklist:**
- [ ] Product Hunt: draft listing (title, tagline, description, gallery, first comment)
- [ ] Hacker News: "Show HN: [Name] — See who unfollowed you on Instagram, no password needed"
- [ ] Twitter/X thread (or LinkedIn post if that's your vibe)
- [ ] Reddit: /r/SideProject, /r/InstagramMarketing, /r/OpenSource (read rules, tailor per sub)
- [ ] Dev.to blog post: "How I built an Instagram follower tracker that doesn't need your password"
- [ ] Submit to: BetaList, SaaSHub, alternativeto.net

**Prompt for drafts:**
```

Read CLAUDE.md first, especially Section 9 (voice) and Section 8 (pricing).

Task: 3.4 — Draft launch copy for [Product Hunt / HN / Twitter / Reddit — specify one].

Context: Free version is live at [URL]. GitHub repo is [URL]. No Pro tier yet — that's Phase 4.

Scope:

- Write 3 variants of the launch post
- Follow the voice in CLAUDE.md: direct, honest, no fluff
- Highlight privacy angle (local-first, no password, open source)
- Don't overhype — let the product speak

Out of scope:

- Don't design graphics
- Don't create a press kit (yet)

```

---

# PHASE 4 — Pro Tier (Cloud Sync + Payments)

Goal: Paying customers. Monthly recurring revenue.

---

## [ ] 4.1 — Set up self-hosted Postgres + Drizzle ORM

**Estimate:** 3-4 hours

**Prompt:**
```

Read CLAUDE.md first.

Task: 4.1 — Add Postgres schema and Drizzle ORM to apps/web.

Scope:

1. Postgres is already running via docker-compose (Phase 3.2.c)
2. Install in apps/web: drizzle-orm, drizzle-kit, postgres
3. Create apps/web/lib/db/index.ts — drizzle client using DATABASE_URL env
4. Create apps/web/lib/db/schema.ts with tables:
   - users: id (uuid, pk), email (unique), created_at
   - sessions: id (text, pk), user_id (fk), expires_at (timestamp)
   - profiles: user_id (pk+fk), plan (enum: free, pro, team, agency), stripe_customer_id (nullable), created_at
   - cloud_snapshots: id (uuid, pk), user_id (fk), label, exported_at, encrypted_blob (bytea), iv (bytea), salt (bytea), created_at
   - sync_settings: user_id (pk+fk), passphrase_salt, passphrase_set_at
5. Set up drizzle-kit with config pointing to schema.ts
6. Create scripts in package.json: db:generate, db:migrate, db:studio
7. Generate and run initial migration
8. Add DATABASE_URL to ops/.env.example and CLAUDE.md Open Questions if not already there

Out of scope:

- No UI yet (4.2+)
- No RLS — we enforce access in application code (not Supabase)

```

---

## [ ] 4.2 — Auth with Lucia v3

**Estimate:** 1 day

**Prompt:**
```

Read CLAUDE.md first.

Task: 4.2 — Build authentication using Lucia v3 (self-hosted, no third-party auth service).

Scope:

1. Install in apps/web: lucia, @oslojs/crypto, @oslojs/encoding, argon2 (or @node-rs/argon2)
2. Create apps/web/lib/auth/lucia.ts — Lucia setup with Drizzle adapter using our sessions + users tables
3. Create apps/web/lib/auth/session.ts — helpers: validateRequest(), createSession(userId), invalidateSession(sessionId)
4. Email/password auth flow (magic link adds email dependency which we've deferred):
   - app/signup/page.tsx: email + password form, creates user with hashed password
   - app/login/page.tsx: email + password form
   - app/logout/route.ts: invalidates session, redirects to /
5. Add password_hash column to users table (migration)
6. Server action on signup: insert user + insert profiles row with plan='free'
7. apps/web/components/user-menu.tsx: shows email + logout if authed, else login/signup links
8. Middleware for /app/_ and /settings/_: validate session, redirect to /login if invalid
9. After login, land on /history

Security:

- Argon2id for password hashing (memory cost 19MB, iterations 2, parallelism 1 — OWASP 2024 defaults)
- Session cookies: httpOnly, secure, sameSite=lax, 30-day expiry with sliding renewal
- Basic rate limiting on login/signup (use Upstash-free-tier alternative: in-memory with Map for now, note to replace later)

Out of scope:

- No OAuth yet (Google/GitHub later)
- No email verification yet (deferred with email system)
- No 2FA yet
- No password reset via email yet (manual DB fix until email is set up)

```

---

## [ ] 4.3 — Client-side encryption for cloud snapshots

**Estimate:** 1 day

**Prompt:**
```

Read CLAUDE.md first, especially privacy rules in Section 6.

Task: 4.3 — Implement client-side encryption for cloud-synced snapshots.

Scope:
The goal: even if our database is breached, snapshot data is unreadable without the user's passphrase.

1. On first login, prompt user to set a "sync passphrase" (minimum 12 chars, client-only, never sent to server)
2. Derive an encryption key with PBKDF2 or Argon2 from the passphrase + a random salt (salt stored per user in localStorage and redundantly in a `sync_settings` table for recovery)
3. Before uploading a snapshot to cloud_snapshots: encrypt the JSON blob with AES-GCM using derived key
4. On download: decrypt in browser; if wrong passphrase, show clear error

Use Web Crypto API (SubtleCrypto). No external crypto libs unless necessary.

Create apps/web/lib/crypto.ts with typed helpers:

- deriveKey(passphrase, salt): Promise<CryptoKey>
- encrypt(data, key): Promise<{ciphertext, iv}>
- decrypt(ciphertext, iv, key): Promise<data>

Write thorough tests with vitest + jsdom.

Warning flow: if user forgets passphrase, their cloud snapshots are unrecoverable. Show clear warning at passphrase setup, recap in settings.

Out of scope:

- Don't add sync UI yet (that's 4.4)

```

---

## [ ] 4.4 — Cloud sync UI

**Estimate:** 1 day

**Prompt:**
```

Read CLAUDE.md first.

Task: 4.4 — Wire cloud sync into the snapshot workflow.

Scope:
For Pro users only:

1. On new snapshot upload: show toggle "Also save to cloud" (default: on for Pro)
2. In /history: each snapshot shows "Device" or "Synced" badge
3. Add "Sync all local to cloud" button (bulk)
4. Add "Download from cloud" option on /history for items not on current device
5. Multi-device support: when logging in on a new device, user enters passphrase → can download cloud snapshots
6. Settings page at /settings with:
   - Account email
   - Plan badge (Free/Pro)
   - Passphrase management (change passphrase = re-encrypt all)
   - Delete account + all data button

Free users see the cloud toggle but it's disabled with "Upgrade to Pro" tooltip.

Out of scope:

- No Stripe yet (that's 4.5)
- No email notifications yet (that's 4.6)

```

---

## [ ] 4.5 — Stripe scaffolding behind feature flag

**Estimate:** 1 day (scaffolding) + 2 hours later to flip the flag on

**Prompt:**
```

Read CLAUDE.md first, especially Section 8 Feature Flag Rules.

Task: 4.5 — Build Stripe integration fully — but keep it disabled behind a feature flag.

Scope:

1. Create apps/web/lib/flags.ts:
   - `isPaidFeaturesEnabled()` returns process.env.PAYMENTS_ENABLED === 'true'
   - `getUserPlan(userId)` returns 'pro' if payments disabled (everyone is pro in beta), else reads from DB
   - `isProUser(userId)` convenience wrapper

2. Install stripe + @stripe/stripe-js (keep installed even if unused — we'll need it soon)

3. app/pricing/page.tsx:
   - Show all tiers with real prices
   - Above the fold, if !isPaidFeaturesEnabled(): show banner "Free during beta — full Pro access for all signed-in users"
   - "Upgrade" button behavior:
     - If payments disabled: just redirects to signup (or /history if already signed in) with toast "You're already on Pro during beta"
     - If payments enabled: creates Stripe checkout session

4. Stripe code paths (written but only called if flag is on):
   - API route app/api/stripe/checkout/route.ts — checkout session creator
   - API route app/api/stripe/portal/route.ts — billing portal
   - API route app/api/stripe/webhook/route.ts — webhook handler updating profiles.plan
   - All routes early-return 404 when isPaidFeaturesEnabled() is false

5. Env vars in ops/.env.example:
   - PAYMENTS_ENABLED=false
   - STRIPE_SECRET_KEY=
   - STRIPE_WEBHOOK_SECRET=
   - STRIPE_PRICE_MONTHLY=
   - STRIPE_PRICE_YEARLY=

6. UI badge: whenever flag is false, show a subtle "Free Beta" badge in the header of every authed page

7. When I'm ready to go live (later task, not now):
   - Create Stripe account, products, prices
   - Fill Stripe env vars on VPS
   - Set PAYMENTS_ENABLED=true
   - Redeploy — flag flip activates Stripe

Out of scope:

- Don't create the actual Stripe products yet — I'll do that when I'm ready to charge
- No one-time desktop payment yet (Phase 5)
- No B2B pricing yet (Phase 6)

```

---

## [ ] 4.6 — Email notifications (DEFERRED)

**Estimate:** 1 day — tackle only when we're ready to invest in email infra

**Status:** Deferred until post-beta. Email system requires deliverability setup (SPF, DKIM, DMARC), choice of provider (Resend vs self-hosted Postal vs SES), and ongoing sender reputation management. Not worth it until we have paying users demanding it.

**When the time comes, prompt:**
```

Read CLAUDE.md first.

Task: 4.6 — Add email notifications for unfollower alerts.

Scope:

- Decide provider (default recommendation: Resend free tier 3k/mo, fastest setup; Amazon SES if we outgrow it)
- Install resend + @react-email/components
- Create apps/web/emails/unfollower-alert.tsx
- Trigger: after new cloud snapshot, if unfollowers.length > 0, send email with top 10 + link
- User settings: toggle, default on
- Unsubscribe link updates pref
- Rate limit: max 1 email/user/24h
- SPF/DKIM/DMARC DNS records documented in ops/README.md

Out of scope:

- SMS / push
- Digest emails

```

---

## [ ] 4.7 — Follower timeline chart

**Estimate:** 1 day

**Prompt:**
```

Read CLAUDE.md first.

Task: 4.7 — Build the follower growth chart for Pro users.

Scope:

- On /results for Pro users: add a "Growth" tab
- Fetch all historical snapshots (local + cloud, deduped)
- Render a Recharts line chart: x = exportedAt, y = totalFollowers (primary line) + totalFollowing (secondary)
- Annotations on significant events (biggest unfollow day, biggest gain day)
- Empty state for <2 snapshots: "Upload more snapshots over time to see trends"
- Export chart as PNG button

Free users see a teaser screenshot with "Unlock growth charts with Pro".

Out of scope:

- Ghost follower chart (4.8)
- Daily/weekly heatmaps

```

---

## [ ] 4.8 — Ghost follower approximation

**Estimate:** 4 hours

**Prompt:**
```

Read CLAUDE.md first. See Glossary for ghost follower definition.

Task: 4.8 — Implement ghost follower approximation.

Scope:
In packages/core/src/diff.ts, add:

```ts
export function findGhostFollowers(
  snapshot: ParsedSnapshot,
  options?: { minTenureDays?: number },
): Account[];
```

Returns followers where:

- followedAt is more than minTenureDays ago (default 180)
- They are not in snapshot.following (you don't follow them back)

This is an approximation — true ghost detection requires Graph API post engagement data (out of scope).

Render in /results for Pro as a "Ghosts" tab with:

- List + CSV export
- Tooltip explaining "This is a proxy — we can't see their actual engagement without Instagram Graph API access"

Write tests for the pure function in packages/core.

Out of scope:

- No real engagement data
- No auto-unfollow of ghosts (that's desktop, Phase 5)

```

---

# PHASE 5 — Desktop App (Tauri)

Goal: $19 one-time sale, truly offline local-first experience, semi-manual unfollow workflow.

---

## [ ] 5.1 — Scaffold Tauri app

**Estimate:** 1 day

**Prompt:**
```

Read CLAUDE.md first.

Task: 5.1 — Initialize apps/desktop as a Tauri v2 project wrapping the web app.

Scope:

- Install Rust toolchain prereqs (manual)
- Create apps/desktop with Tauri v2, pointing to apps/web's build output
- Share @ig-tracker/core via workspace
- Separate Tauri build config: targets = macOS (universal), Windows (x64), Linux (deb + AppImage)
- Code signing setup (placeholder — real certs added at ship time)
- Custom window chrome (title bar, traffic lights on macOS)

Out of scope:

- No Tauri-specific features yet (5.2)
- No auto-updater yet (5.5)

```

---

## [ ] 5.2 — Native filesystem snapshot storage

**Estimate:** 1 day

**Prompt:**
```

Read CLAUDE.md first.

Task: 5.2 — Replace IndexedDB with native filesystem storage on desktop.

Scope:

- Detect Tauri runtime (via window.**TAURI**)
- When on desktop, use Tauri's fs plugin to store snapshots as JSON files in app data dir
- Unlimited snapshot history (no 3-snapshot cap)
- Path shown in settings: "Snapshots saved to: /Users/.../Library/Application Support/ig-tracker"
- "Open folder" button in settings

Out of scope:

- No cloud sync on desktop (keep it offline-first — that's the value prop)

```

---

## [ ] 5.3 — Semi-manual unfollow workflow

**Estimate:** 2 days

**Prompt:**
```

Read CLAUDE.md first.

Task: 5.3 — Build the semi-manual unfollow workflow for desktop.

Scope:

- On non-followers / ghost tabs, add "Start unfollow session" button
- Opens a modal with queue: list of accounts, "Next" button
- Clicking "Next" opens the user's default browser to that profile URL (via Tauri shell)
- User manually clicks Unfollow in Instagram
- Returns to app, clicks "Done" or "Skip" — moves to next
- Progress bar: X / Y processed
- Rate limit warning: after 30 per hour, show warning "Slow down to avoid Instagram action blocks"
- Audit log of what was processed (saved locally)

Critical: we never automate the click. The user clicks manually. This is TOS-compliant.

Out of scope:

- No browser extension yet (separate future project)
- No automated unfollow (never, per CLAUDE.md Section 4)

```

---

## [ ] 5.4 — Desktop license + activation

**Estimate:** 1 day

**Prompt:**
```

Read CLAUDE.md first.

Task: 5.4 — Implement desktop license verification.

Scope:

- Stripe one-time product: "IG Tracker Desktop" $19
- After purchase: Stripe sends a license key via Resend email
- Desktop app on first launch: requires license key entry
- License verification: call our API (/api/licenses/verify) with key → returns valid/invalid + email
- Store license locally once verified; online recheck weekly (offline grace period 30 days)
- Refund → webhook deactivates license

Create migrations/002_licenses.sql:

- licenses: id, key (unique), email, stripe_session_id, status (active/refunded), activated_at

Out of scope:

- No trial period (buy or nothing)
- No multi-device licensing yet (1 license = 1 activation)

```

---

## [ ] 5.5 — Auto-updater + release pipeline

**Estimate:** 1 day

**Prompt:**
```

Read CLAUDE.md first.

Task: 5.5 — Set up Tauri auto-updater and GitHub Releases pipeline.

Scope:

- Configure Tauri updater: checks a manifest JSON hosted on our CDN
- GitHub Actions: on tag push (v\*), build for all 3 platforms, sign, publish to GitHub Releases, update manifest
- Download page on web: /download → detects OS → direct link to latest build
- Release notes displayed in-app when update applied

Out of scope:

- No Sparkle for macOS (Tauri built-in updater is fine)
- No Microsoft Store distribution

```

---

# PHASE 6 — B2B Agency Dashboard

Goal: First paying agency customer. $49-149/mo MRR addition.

---

## [ ] 6.1 — Multi-tenant schema

**Estimate:** 1 day

**Prompt:**
```

Read CLAUDE.md first.

Task: 6.1 — Extend database for multi-account / team use.

Scope:
migrations/003_teams.sql:

- teams: id, name, plan (team/agency/enterprise), stripe_customer_id, created_at
- team_members: team_id, user_id, role (owner/admin/member), invited_at
- managed_accounts: id, team_id, instagram_handle, notes, created_at
- cloud_snapshots gets team_id (nullable — personal snapshots stay user-owned)
- RLS policies: team members can see team data based on role

Create apps/b2b as a new Next.js app (similar setup to apps/web but separate):

- Different domain (e.g., agencies.ourdomain.com)
- Shares @ig-tracker/core and auth with apps/web
- Different landing page targeted at agencies

Out of scope:

- No UI yet (6.2+)

```

---

## [ ] 6.2 — Agency dashboard UI

**Estimate:** 1 week

**Prompt:**
```

Read CLAUDE.md first.

Task: 6.2 — Build the agency multi-account dashboard.

Scope for apps/b2b:

- Login → team selector (if user is in multiple teams)
- Main dashboard: grid of managed accounts (avatar, handle, last snapshot date, unfollower delta badge)
- Click account → single-account view (same analysis as consumer /results but scoped to one managed account)
- "Upload snapshot for [account]" flow — assigns ZIP to that managed account
- Team settings: invite members, remove members, role management
- Billing page: current plan, seats used, upgrade/downgrade

Minimum viable agency dashboard. No bells and whistles.

Out of scope:

- No white-label yet (6.3)
- No Slack/Zapier yet (6.4)

```

---

## [ ] 6.3 — White-label client reports

**Estimate:** 3-4 days

**Prompt:**
```

Read CLAUDE.md first.

Task: 6.3 — Build white-label PDF client reports.

Scope:

- Team settings: upload custom logo, set primary color, set contact email
- On account view: "Generate client report" button → creates a branded PDF with:
  - Agency logo on cover
  - Snapshot summary
  - Top 20 new followers, top 20 lost followers
  - Growth chart
  - Recommended actions
- PDF generation: react-pdf (server-side)
- PDF saved to team's storage + downloadable

Out of scope:

- No scheduled recurring reports yet (future feature)
- No email-to-client yet

```

---

## [ ] 6.4 — Integrations (Slack, Zapier)

**Estimate:** 1 week

**Prompt:**
```

Read CLAUDE.md first.

Task: 6.4 — Build Slack + Zapier/generic webhook integrations.

Scope:

- Team settings > Integrations
- Slack: OAuth flow, choose channel, trigger on new unfollower threshold
- Zapier: publish a Zapier app (OAuth + triggers: new snapshot, unfollower alert) — this is a separate multi-week submission to Zapier marketplace
- Generic webhook: team provides a URL, we POST events (JSON) with signature for verification

Out of scope:

- No Airtable direct integration (Zapier covers it)
- No Discord (later based on demand)

```

---

## [ ] 6.5 — B2B pricing + Stripe for teams

**Estimate:** 2-3 days

**Prompt:**
```

Read CLAUDE.md first, Section 8 B2B pricing.

Task: 6.5 — Stripe subscriptions for team plans.

Scope:

- Stripe products: Team ($49/mo), Agency ($149/mo), Enterprise (custom contact)
- On /pricing (B2B domain): show tiers with "Start Team" / "Start Agency" buttons
- Checkout sets team.plan on webhook
- Enforce seat limits and managed account limits per plan
- Prorated upgrades/downgrades
- Invoice emails via Stripe

Out of scope:

- No enterprise SSO yet
- No annual discounts (add if demand)

```

---

# Backlog / Future

Not scheduled — park here until demand signal.

- Browser extension (auto-unfollow, separate repo, v0 feasible from Week 4 of Phase 5)
- iOS app (only if mobile traffic > 40% of visits and file picker UX is solved)
- Android app (same gate)
- Weekly digest emails (batched, less intrusive than per-event)
- Team activity log / audit
- Content performance analytics (requires Graph API approval — huge effort)
- Localization: Turkish, Vietnamese (worth it if traffic from those regions is significant)

---

# Decision Log

Track major decisions so we don't redebate them.

| Date | Decision | Rationale |
|---|---|---|
| 2026-04-24 | MVP = web only, no mobile | ZIP UX on mobile is bad; users download from laptop anyway |
| 2026-04-24 | Open-core license split: MIT core / AGPL web / Commercial desktop+b2b | Maximize adoption of parser; prevent commercial forks of app; retain desktop/agency revenue |
| 2026-04-24 | **Self-hosted on Hetzner VPS** (not Vercel) | €4.51/mo for 2vCPU/4GB is 10-20x cheaper; full control; no vendor lock-in |
| 2026-04-24 | **Self-hosted Postgres in Docker** (not Supabase/Neon) | Zero extra cost; same VPS; full control over data and backups |
| 2026-04-24 | **Lucia v3 for auth** (not Supabase Auth/Clerk) | Minimal deps, self-hosted, no third-party call path, aligns with privacy-first story |
| 2026-04-24 | **Stripe scaffolded but flag-gated** (PAYMENTS_ENABLED=false in beta) | Build now, charge later; free beta mode lets us test at zero cost; flip one env var to go live |
| 2026-04-24 | **Email system deferred to post-beta** | Avoid deliverability headache until actual paying users need it |
| | | |

---

**Last updated:** 2026-04-24
```
