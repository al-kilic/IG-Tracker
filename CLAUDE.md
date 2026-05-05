# CLAUDE.md — IG Tracker Project Guide


> This file is read by code agent at the start of every session. It contains everything Claude or Gemini needs to understand this project, make consistent decisions, and write code in the agreed style. Keep it updated as the project evolves.


---


## 1. Project Overview


**Name:** IG Tracker (working title — final name TBD)
**One-liner:** A privacy-first Instagram follower analysis tool. Users upload the ZIP file they downloaded from Instagram's own "Download Your Information" feature — the app shows them who unfollowed them, who doesn't follow back, and tracks changes over time.


**Why this exists:** Every existing tool in this space asks users for their Instagram password (dangerous, TOS violation, gets accounts banned). This tool asks for nothing — the user exports their own data from Instagram's official settings and uploads the ZIP. 100% TOS-compliant, 100% local processing.


**Key differentiator:** Local-first + open-core. Nobody else combines all three.


---


## 2. Who's Building This


**Builder:** Solo founder. Photographer/videographer background, vibe-coder, Project and product manager. 
**Stack preference:** Claude Code / Codex / Gemini CLI driven development. Recommended stacks over DIY choices.
**Work style:** Ship fast, prefer HTML reports with visuals


---


## 3. Target Users


**Primary (B2C — Month 1-6):**
- Micro-creators (1K–50K followers)
- global creators


**Secondary (B2B — Month 6+):**
- Small influencer agencies managing 3–15 creators
- Freelance social media managers with multiple clients
- In-house brand creator teams


---


## 4. Product Scope


### In Scope (MVP)
- Upload Instagram ZIP → parse `followers_1.json` + `following.json` or html files
- Show: non-followers (people you follow who don't follow back), new followers, mutual followers
- Client-side processing only — no server, no upload to backend
- Snapshot comparison (upload two ZIPs → see who unfollowed between them)
- CSV export of any list
- Dark + light mode


### In Scope (Pro — v2)
- Cloud snapshot history (encrypted)
- Video on main page showing how to download Instagram reports and automate it with Drive export
- Email notifications when new export reveals unfollowers
- Follower timeline charts
- Ghost follower approximation (old follow timestamp + non-reciprocal)
- Profile links with "open in new tab" batch mode


### In Scope (Desktop — v3)
- Tauri app, offline
- Unlimited local snapshot history
- Semi-manual unfollow workflow (opens profiles in browser one at a time, user clicks)


### In Scope (B2B — v4)
- Multi-account dashboard
- Team seats
- Slack notifications, CSV/Airtable/Zapier exports
- White-label client reports


### Out of Scope (Never)
- Asking users for Instagram password
- Using unofficial Instagram APIs
- Scraping Instagram
- Automated unfollow inside the main app (optional separate browser extension only)
- iOS/Android native apps in v1 — web + desktop only until consumer traction is proven


---


## 5. Tech Stack (Authoritative)


**Do not deviate from this without explicit approval.**


### Frontend (Web)
- **Framework:** Next.js 15 (App Router) + React 19
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 + shadcn/ui components
- **State:** React Server Components where possible; Zustand for client state
- **Forms:** react-hook-form + zod
- **Icons:** lucide-react
- **Charts:** Recharts (lightweight, works well with SSR)


### Core Logic (Shared)
- **ZIP parsing:** jszip
- **Schema validation:** zod
- **Date handling:** date-fns (not moment, not dayjs)
- **File parsing:** native browser FileReader + DataTransfer APIs


### Storage (Client)
- **Snapshot storage:** Dexie.js (IndexedDB wrapper)
- **Preferences:** localStorage with zod validation


### Backend (self-hosted on our own VPS)
- **Hosting:** Hetzner Cloud CX22 (2 vCPU / 4GB RAM / ~€4.51/mo) in Germany or Finland region
- **OS:** Ubuntu 24.04 LTS
- **Reverse proxy:** Caddy (automatic HTTPS via Let's Encrypt)
- **Container runtime:** Docker + Docker Compose
- **Web runtime:** Next.js standalone output running in Node 20 container
- **Database:** PostgreSQL 16 (self-hosted in Docker, persistent volume)
- **Auth:** Lucia Auth v3 + argon2 (email/password or magic link, no third-party dep)
- **File storage:** Local filesystem on VPS (for encrypted snapshot blobs)
- **Payments:** Stripe — scaffolded in code but disabled behind feature flag until we're ready to charge. See Section 8.
- **Email:** Deferred. Section 4 scope, added only when Pro launches.
- **Analytics:** Plausible self-hosted (same VPS, small footprint). Privacy-friendly.
- **Backups:** nightly `pg_dump` + filesystem tarball → uploaded to cheap object storage (Hetzner Storage Box or Backblaze B2, ~€1/mo)


### Desktop (v3)
- **Framework:** Tauri v2 (Rust backend, reuse React frontend)
- **Distribution:** Direct download + GitHub Releases; Mac App Store later


### Repository Structure (Monorepo)
- **Tool:** Turborepo + pnpm workspaces
- **Shared packages:** `packages/core` (parser + diff, MIT), `packages/ui` (shadcn components)
- **Apps:** `apps/web` (AGPL), `apps/desktop` (commercial), `apps/b2b` (closed-source)

### Deploy Infrastructure
- **VPS provisioning:** manual (one-time ssh + bootstrap script)
- **CI/CD:** GitHub Actions → builds Docker image → pushes to GHCR (free) → VPS pulls on webhook or cron
- **Ops dashboard:** Dozzle (Docker log viewer) + Uptime Kuma (monitoring), self-hosted
- **Estimated monthly cost (pre-launch):** €5-7 total (VPS + backup + domain)


---


## 6. Architecture Principles


### Privacy Rules (Non-Negotiable)
1. **Client-side processing by default.** ZIP parsing happens in the browser. Files never touch a server unless the user explicitly opts into cloud sync (Pro tier).
2. **No tracking, no ads, no third-party analytics** that send data. Plausible self-hosted or none.
3. **Open-source verifiable.** The parsing code lives in `packages/core` under MIT license — anyone can verify what happens to their data.
4. **Minimum data collection.** If cloud sync is enabled, store only: encrypted snapshot blobs, user email, stripe_customer_id. Nothing else.


### Code Style Rules
- TypeScript strict mode always. No `any`. Use `unknown` and narrow.
- Prefer Server Components. Add `"use client"` only when necessary (forms, state, browser APIs).
- All user-facing strings go through `i18n` — never hard-code English in JSX.
- Every form validated with zod schemas. Schemas live in `packages/core/schemas`.
- Keep components under 200 lines. Split into smaller components or hooks beyond that.
- Use shadcn/ui primitives; do not install separate UI libraries.
- No `useEffect` for data fetching — use RSC or `useQuery` (tanstack) if client-side needed.


### File Naming
- Components: `PascalCase.tsx` (e.g., `UploadZone.tsx`)
- Hooks: `camelCase.ts` starting with `use` (e.g., `useSnapshots.ts`)
- Utilities: `camelCase.ts` (e.g., `parseInstagramZip.ts`)
- Types: colocated in files, or `types.ts` for shared
- Tests: `*.test.ts` or `*.test.tsx` next to the file being tested


---


## 7. Instagram ZIP Format (Reference)


The app must handle these files inside the user's uploaded ZIP:


```
username_YYYYMMDD.zip
└── connections/
    └── followers_and_following/
        ├── followers_1.json      # Array of relationship objects
        ├── followers_2.json      # If >5000 followers (paginated)
        └── following.json        # Wrapped in { relationships_following: [...] }
```


**Key schema fields (every entry):**
- `string_list_data[0].value` → username (string)
- `string_list_data[0].href` → `https://www.instagram.com/{username}`
- `string_list_data[0].timestamp` → Unix timestamp (when the follow happened)


**Parser must handle:**
- Both schema variants (top-level array vs `relationships_following` wrapper)
- Paginated `followers_*.json` files (merge all)
- HTML format fallback (user may have chosen HTML over JSON)
- Malformed/corrupted ZIPs (graceful error with clear message)
- Empty exports (new accounts with zero followers/following)


**Reference parser logic (TypeScript):**
```typescript
// followers_*.json → top-level array
const followers = followersJson.map(entry => entry.string_list_data[0].value);


// following.json → wrapped object
const following = followingJson.relationships_following.map(
  entry => entry.string_list_data[0].value
);


// Diff
const nonFollowers = following.filter(u => !followers.includes(u));
```


---


## 8. Business Model (For Context When Writing Copy)


**Free Beta Mode (current):** Everything is free. Pricing pages and tiers are built but payment is disabled behind a `PAYMENTS_ENABLED=false` feature flag. Users can sign up, see pricing, click "Upgrade" — they're granted Pro access automatically with a "Free during beta" banner. When we're ready, we flip the flag and real Stripe checkout kicks in.


**Free Tier (Web, post-beta):** Single-snapshot analysis. No account required. Works client-side.


**Pro ($4.99/mo or $29/yr):** Cloud snapshot history, email alerts, charts, ghost-follower approximation.


**Desktop ($19 one-time):** Tauri app, unlimited local history, offline, semi-manual unfollow workflow.


**B2B Team ($49/mo):** 5 seats, 10 accounts, Slack/Zapier integrations.


**B2B Agency ($149/mo):** 20 seats, 50 accounts, white-label reports.


**Licensing:**
- `packages/core` → MIT (maximum adoption)
- `apps/web` → AGPL-3.0 (prevents commercial forks)
- `apps/desktop`, `apps/b2b` → Commercial / closed


### Feature Flag Rules (IMPORTANT for Claude)


When building any paid feature (cloud sync, Pro-only UI, billing flows):
1. Build the full functionality — don't skip implementation
2. Gate access behind `isPaidFeaturesEnabled()` helper from `apps/web/lib/flags.ts`
3. When `PAYMENTS_ENABLED=false` (env): everyone is auto-granted Pro access
4. When `PAYMENTS_ENABLED=true`: only users with `profiles.plan='pro'` get access, and upgrade flows use real Stripe
5. Stripe code paths stay in the repo either way — just not called
6. Show a "Free during beta" badge in the UI whenever flag is false
7. Pricing page always visible (shows real prices, with disclaimer during beta)


---


## 9. Brand & UX


### Voice
- Direct, honest, a bit blunt. No marketing fluff.
- Privacy-forward — every touchpoint reinforces "your data stays with you."
- Friendly but not cute. Serious tool, approachable wrapper.


### Visual Language
- **Palette:** Warm teal primary (`#01696F`), cream background (`#F4F0E8`), terra accent (`#A84B2F`) — inherited from the deep-dive report's Nexus palette. Dark mode uses deep teal (`#0B2426`) with warm cream text.
- **Typography:** Satoshi for UI, General Sans for display. Both via Fontshare.
- **Motion:** Subtle. Tailwind transitions only. No Framer Motion unless a specific component needs it.
- **Illustrations:** Abstract geometric shapes, not people. Keep it neutral and global.


### Copy Examples
- ✅ "Upload your Instagram data. See who unfollowed you. Nothing leaves your browser."
- ✅ "You downloaded this from Instagram. We just read it."
- ❌ "The ULTIMATE follower tracker! 🔥 Join thousands of creators!"
- ❌ "Revolutionary AI-powered insights into your Instagram."


---


## 10. Legal & Compliance Notes


- **GDPR:** Required for EU users. Privacy policy must cover: no data collection by default; Pro tier data handling; cookie policy (minimal, functional only).
- **Meta TOS:** The app itself never touches Meta servers. User exports their own data — this is GDPR Article 20 data portability. Zero TOS risk for the core product.
- **Auto-unfollow extension (future, optional):** Separate repo, clear "use at your own risk" warning, rate-limited at 100/day with randomized delays.
- **App Store / Extension Store:** Out of scope for v1. Don't optimize for their policies yet.


---


## 11. Claude Code Working Agreements


When I ask you (Claude or Gemini) to do work on this project, follow these rules:


### Before Writing Code
1. **Read this file first** if you haven't in the current session.
2. **Check the current task** in `ROADMAP.md` — we work on one WBS item at a time.
3. **Ask clarifying questions** if requirements are ambiguous. Don't guess.
4. **Propose the approach** in 2-4 bullets before writing any code for non-trivial changes.


### While Writing Code
1. **Follow the stack in Section 5.** Don't introduce new dependencies without asking.
2. **TypeScript strict mode.** No `any`. No `@ts-ignore`.
3. **Reuse `packages/core` logic.** Don't duplicate parser/diff code in app layers.
4. **Write tests for `packages/core`.** Vitest. Target >80% coverage on parser logic.
5. **Apps can skip tests** except for critical paths (upload flow, auth, payments).
6. **Privacy rules from Section 6 are inviolable.** Never propose a solution that sends user data to a server by default.


### After Writing Code
1. **Run `pnpm typecheck && pnpm lint && pnpm test`** before declaring done.
2. **Summarize what you did** in 3-5 bullets — what changed, why, what to test manually.
3. **Note any follow-up work** in `TODO.md` rather than leaving it silent.
4. **Update this file** if you made an architectural decision that future sessions need to know.


### Commit Style
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`
- One logical change per commit
- Reference WBS ID when applicable: `feat(1.3): add ZIP drop zone component`


### Never Do This
- Install a new dependency without asking.
- Change the stack without updating this file.
- Add server-side data collection without explicit user opt-in.
- Copy-paste Instagram API code from the web — we don't use their API.
- Ship without testing the upload → parse → diff happy path manually.


---


## 12. How to Ask Claude for Work (For the Builder)


When you start a new session, use this template:


```
Read CLAUDE.md first.


Task: [WBS ID from ROADMAP.md, e.g., "1.3 — Build ZIP drop zone component"]


Context: [Anything new since last session, e.g., "Yesterday we finished 1.2 (parser core). Tests are passing."]


Scope for this session: [What you want done right now, e.g., "Just the component + unit tests. No styling polish yet."]


Out of scope: [What NOT to touch, e.g., "Don't wire it to the parser yet — that's task 1.4."]
```


For quick tweaks, the full template is overkill — just say "check CLAUDE.md then fix X in file Y."


---


## 13. Repository Layout (Target)


```
ig-tracker/
├── CLAUDE.md                    # ← this file
├── ROADMAP.md                   # WBS + prompts
├── TODO.md                      # running follow-ups
├── README.md                    # public-facing
├── LICENSE                      # top-level (AGPL for web)
├── package.json                 # workspace root
├── pnpm-workspace.yaml
├── turbo.json
├── packages/
│   ├── core/                    # MIT — parser, diff, schemas
│   │   ├── src/
│   │   │   ├── parser.ts
│   │   │   ├── diff.ts
│   │   │   ├── schemas.ts
│   │   │   └── index.ts
│   │   └── package.json
│   └── ui/                      # shared shadcn components
│       ├── src/
│       └── package.json
├── apps/
│   ├── web/                     # AGPL — Next.js public web app
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   └── package.json
│   ├── desktop/                 # Commercial — Tauri wrapper (added v3)
│   └── b2b/                     # Commercial — Agency dashboard (added v4)
└── docs/
    ├── instagram-zip-format.md
    └── privacy-architecture.md
```


---


## 14. Success Metrics (What We're Tracking)


**v1 launch (Week 3):**
- 500 unique visitors in first week
- 50 ZIP uploads successfully parsed
- GitHub repo gets 50+ stars
- No privacy incidents (nothing unexpectedly sent to server)


**Month 3:**
- 5,000 monthly uploads
- 100 Pro subscribers ($500 MRR)
- 20 desktop sales ($380 total)


**Month 6:**
- 15,000 monthly uploads
- 500 Pro subscribers ($2,500 MRR)
- First B2B agency customer ($49-149 MRR)


**Month 12:**
- $5-10K MRR (self-sustaining in Đà Nẵng)
- Break-even or better


---


## 15. Glossary


- **Export / ZIP:** The file Instagram emails to the user after "Download Your Information" request
- **Snapshot:** A single parsed export, saved with a timestamp for comparison later
- **Diff:** Comparison between two snapshots (who unfollowed, new followers, etc.)
- **Non-follower:** Someone you follow who doesn't follow you back
- **Unfollower:** Someone who used to follow you but stopped (requires two snapshots)
- **Ghost follower (approximated):** Long-tenure non-reciprocal follower (proxy metric)
- **Semi-manual unfollow:** App opens the profile tab; user clicks unfollow manually


---


## 16. Open Questions / Decisions to Make


Track here so we don't re-litigate in every session.


- [ ] Final product name (current working name: "IG Tracker")
- [ ] Domain name
- [ ] GitHub org name (personal account vs org)
- [ ] Stripe entity (deferred — needed before flipping PAYMENTS_ENABLED flag)
- [ ] VPS region: Hetzner Germany (NBG1) vs Finland (HEL1) — default to Germany for EU users
- [ ] Whether to launch OSS on day 1 or wait until after Product Hunt launch
- [ ] Logo + brand mark — commission or DIY


### Resolved Decisions
- [x] **Hosting:** Self-hosted on Hetzner Cloud CX22. Not Vercel. Not Railway. Cost discipline from day 1.
- [x] **Database:** Self-hosted PostgreSQL 16 in Docker on the VPS. Not Supabase, not Neon.
- [x] **Auth:** Lucia Auth v3 (own implementation, minimal deps). Not Supabase Auth, not Clerk, not Auth.js.
- [x] **Email:** Deferred until Pro launch (post-MVP).
- [x] **Payments:** Stripe scaffolding yes, real charges off until beta ends.


---


**Last updated:** 2026-04-24
**Next review:** After v1 launch
