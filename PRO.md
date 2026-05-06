# PRO.md — WhoUnfollowed Pro (Radar) Roadmap

> This document defines the Pro tier product — features, copy, tech requirements, and phasing.
> "Pro" is the product name. "Radar" is the marketing language for what Pro unlocks.
> Keep this file updated as decisions are made.

**Last updated:** 2026-05-06
**Status:** Planning

---

## 1. Vision & Positioning

Free tier tells you the snapshot: who doesn't follow you back right now.
**Pro (Radar) tells you the full story:** who left, who's ignoring your request, how long you've been following people who were never going to follow back, and lets you work through your list like a professional.

> *"Turn on Radar. See everything."*

Radar is not a gimmick — it's the difference between a number and an action plan. The free tier gives you the list. Radar gives you the workflow, the history, and the intelligence to actually do something about it.

**Who pays:**
- Micro-creators (1K–50K followers) who check their follow health regularly, not just once
- People who want to actually work through their list, not just look at it
- Anyone who has uploaded the ZIP more than once and wishes it remembered last time

---

## 2. Pricing

| Plan | Price | Billing |
|---|---|---|
| Free | $0 | — |
| Pro (Radar) | $4.99/mo | Monthly |
| Pro (Radar) | $29/yr | Annual (save ~50%) |

**Paywall placement: soft gate**
- Free = full analysis on every upload, always. No artificial limits on the core feature.
- Pro = everything that requires memory, history, workflow, or deeper data.
- Upgrade moment: triggered naturally when a user tries to compare, triage, or access the dashboard.

**Beta:** `PAYMENTS_ENABLED=false` → everyone gets Pro automatically with "Free during beta — Radar is on us" banner.

---

## 3. Pro MVP Features

### 3.1 Snapshot History & Comparison
The foundation. Without this, nothing else in Pro works.

**What it does:**
- Every ZIP upload is saved as a named snapshot (date + account name)
- User can compare any two snapshots: who unfollowed since then, who is new
- Unfollower diff is the killer view: "These 23 people followed you on April 1st and don't anymore"

**Acceptance criteria:**
- Snapshots stored in IndexedDB (Dexie.js) locally for now; cloud sync in V2
- Snapshot list on `/history` page with date, follower count, following count
- Compare page at `/compare` — select two snapshots, see diff
- Unfollowers list, new followers list, mutuals change
- Free users can still upload; they just can't save or compare (prompt to upgrade)

---

### 3.2 Triage Workflow
Turns a static list into an action queue. The core Pro experience.

**Triage states per account:**

| State | UI Label | Witty Copy | Meaning |
|---|---|---|---|
| `untriaged` | — | — | Default, not yet acted on |
| `not_a_fan` | "Not your fan" | "They made their choice." | Confirmed non-follower, noted |
| `let_it_slide` | "Let it slide" | "You follow them for the content. Fair." | Goes to whitelist / ignored section |
| `done` | "Already done" | "Gone. Next." | You went and unfollowed them manually |
| `check_later` | "Check later" | "Not today." | Snoozed, comes back next session |

**UX:**
- Triage buttons appear on hover/tap per row
- Row styling changes per state (muted for `let_it_slide`, strikethrough+dim for `done`, teal highlight for `not_a_fan`)
- Keyboard shortcut support: arrow keys to navigate, 1/2/3/4 to triage
- Progress bar: "Triaged 340 of 1,485" with satisfying fill animation
- Completion state: *"Radar's got nothing new. You're clean."*

**Persistence:** triage states saved in IndexedDB, keyed by username + snapshot ID

**Free users:** can see the list but triage is locked — prompt: *"Turn on Radar to start triaging."*

---

### 3.3 Visited Row Highlighting
**This one is FREE** — small enough, good enough UX win for everyone, drives Pro desire.

- Any row you've clicked on gets a subtle left-border highlight (visited state)
- Stored in localStorage, no account needed
- Resets when a new snapshot is loaded
- Copy on hover: "You've been here."

---

### 3.4 Whitelist — "Let it Slide" Section
Permanent per-account setting across all snapshots.

**What it does:**
- Any account triaged as `let_it_slide` is moved to a collapsed "Let it Slide" section at the bottom
- They never appear in the main triage queue again
- User can un-whitelist at any time
- Brands, celebs, accounts followed for content — out of your way

**UI:**
- Collapsed by default: "47 accounts you follow for the content. ›"
- Expand to see the list, remove anyone with one click
- Copy: *"These accounts never followed back. You already knew that."*

---

### 3.5 Radar Dashboard
A single page giving the full picture of your follow ecosystem. Goes beyond the basic diff.

**Sections:**

#### Pending Follow Requests
> Instagram exports this data. We're just surfacing it.

- Accounts you've requested to follow but haven't been accepted
- Sorted by how long they've been pending (oldest first)
- Flag: pending 30+ days → *"Probably not happening."*
- Flag: pending 90+ days → *"They saw it."*
- Triage action: withdraw request (links to their profile)

#### Recently Unfollowed (by Instagram)
> Instagram tracks who you've recently unfollowed. We show it back to you.

- Sourced from `recently_unfollowed_profiles.json` in the export
- Useful for: did I already unfollow them? Confirmation.
- Copy: *"Your recent clean-up. In case you forgot."*

#### Follow Age Analysis
> Uses timestamps from JSON exports. Not available in HTML exports.

- Distribution: how long you've been following people who don't follow back
- Buckets: < 1 month / 1–6 months / 6–12 months / 1+ year
- Insight copy: *"You've been following 84 accounts for over a year. They haven't followed back."*
- Ghost follower approximation: long follow tenure + non-reciprocal = likely ghost

#### Follow Ratio
- Simple ratio card: followers / following
- Sub-copy based on ratio: *"You're following 3x more than follow you."*
- Trend if 2+ snapshots exist: improving / declining

---

### 3.6 Gamification Layer
Keeps users coming back, makes triage feel rewarding.

**Progress mechanics:**
- Triage completion bar per session: 0 → 100%
- Streak: "3rd week checking in" badge
- Milestone messages at 25%, 50%, 100%:
  - 25%: *"You're getting somewhere."*
  - 50%: *"Halfway through. Radar's warming up."*
  - 100%: *"List cleared. Radar is clean."*

**Completion animations:**
- Confetti-lite (CSS only, no Framer Motion) on 100% triage
- Empty state after full triage: illustration + *"Nothing left to review. Suspiciously loyal bunch."*

---

## 4. Pro V2 Features (Post-MVP)

### 4.1 Auto Cloud Storage Parse ⚡ FLAGSHIP
> Instagram natively exports to Google Drive and Dropbox on a schedule.
> We connect to their storage, detect new exports, parse automatically, email them the diff.

**Flow:**
1. User sets up scheduled Instagram export → Google Drive (Instagram native feature)
2. User connects their Drive to WhoUnfollowed (OAuth)
3. We watch for new ZIP files matching the export pattern
4. On detection: parse, diff against last snapshot, send email digest
5. User wakes up to: *"Your Radar report is ready. 12 new unfollowers since last week."*

**Supported platforms (in order):**
1. Google Drive (Instagram's primary export target)
2. Dropbox

**Tech requirements:**
- Google Drive API (OAuth 2.0, watch/webhook on folder)
- Background job runner (queue on VPS)
- Email delivery (Resend or Postmark — pick one when Pro launches)
- Encrypted snapshot storage on VPS filesystem

**Important:** Web only. Not on desktop app. Cloud-dependent by nature.

---

### 4.2 Weekly Email Digest
Goes hand-in-hand with auto-parse.

**Email content:**
- New unfollowers since last week (with triage CTA)
- New followers gained
- Pending requests still unanswered
- One-line insight: *"Your follow ratio improved. Keep going."*

**Subject line examples:**
- *"Radar report: 7 new unfollowers this week"*
- *"Your Radar is clean. Nothing new."*
- *"12 people left. Your Radar caught them."*

---

### 4.3 Account Grouping & Labels
User-defined labels across their follow list.

- Create groups: "Brands", "Photographers", "Actually care about"
- Filter triage queue by group
- Useful for agency users managing multiple niches

---

## 5. Marketing & Copy Language

### Upgrade prompts (in-app)
| Context | Copy |
|---|---|
| Visiting /history | *"Radar remembers. You don't have to."* |
| Trying to compare | *"Turn on Radar to compare snapshots."* |
| Triage locked | *"Turn on Radar to start triaging."* |
| Dashboard teaser | *"Radar sees more. Upgrade to unlock the full picture."* |

### Post-upgrade
- Dashboard header: **"Radar is active."**
- Badge on Pro features: small `RADAR` pill in teal

### Witty empty states
| State | Copy |
|---|---|
| No unfollowers | *"Everyone here earned their spot. Radar's got nothing."* |
| Triage complete | *"List cleared. Suspiciously loyal bunch."* |
| No pending requests | *"Nobody's keeping you waiting."* |
| Whitelist empty | *"Nothing to let slide. You're selective."* |

---

## 6. Tech Requirements

### Database (PostgreSQL)
```sql
-- Snapshots (cloud-synced in V2, local IndexedDB for MVP)
snapshots (id, user_id, exported_at, follower_count, following_count, created_at)
snapshot_accounts (id, snapshot_id, username, href, followed_at, type) -- type: follower|following|pending

-- Triage
triage_states (id, user_id, username, state, updated_at)

-- Whitelist
whitelist (id, user_id, username, added_at)

-- Pro access
profiles (id, user_id, plan, plan_expires_at, stripe_customer_id)
```

### Feature flag
```ts
// apps/web/lib/flags.ts
isPaidFeaturesEnabled() // false = everyone gets Pro (beta)
isRadarEnabled(userId)  // checks profiles.plan
```

### Auth
- Lucia Auth v3 (already scaffolded)
- Account required for: snapshot history, triage persistence, whitelist
- No account needed for: single upload analysis, visited row highlighting

### Stripe
- Already scaffolded, behind `PAYMENTS_ENABLED=false`
- Products to create: Pro Monthly ($4.99), Pro Annual ($29)
- Webhook: `customer.subscription.created/deleted` → update `profiles.plan`

---

## 7. Build Sequence (MVP)

1. **Snapshot save + history page** — core data model, IndexedDB
2. **Compare page** — diff two snapshots
3. **Triage states** — UI + persistence
4. **Visited highlighting** — free, ship fast
5. **Whitelist / Let it slide** — filter + section
6. **Radar Dashboard** — pending, recently unfollowed, follow age
7. **Gamification** — progress bar, milestones, empty states
8. **Auth gate** — lock Pro features behind account + plan check
9. **Stripe** — flip `PAYMENTS_ENABLED=true`, real checkout
10. **V2: Cloud storage integration**

---

## 8. Open Questions

- [ ] Do we require an account for triage, or allow anonymous triage via localStorage only?
- [ ] Snapshot storage: keep local-only (IndexedDB) for MVP or go straight to cloud?
- [ ] Which email provider to use for digest emails (Resend vs Postmark)?
- [ ] "Radar" — do we trademark/protect this name or keep it informal brand language?
- [ ] Annual plan discount messaging: "Save 50%" or "2 months free"?
