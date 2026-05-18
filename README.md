<div align="center">

<img src="https://whounfollowed-production.up.railway.app/favicon.ico" width="60" alt="WhoUnfollowed logo" />

# WhoUnfollowed

**See exactly who doesn't follow you back — without sharing your password.**

Upload the ZIP from Instagram's official data export. Your browser reads it locally and gives you the full picture in seconds. No server. No login. No risk.

[
[
[
[
[

</div>

***

## What It Does

Most Instagram follower-tracking tools ask for your password. That's a TOS violation and a real security risk. WhoUnfollowed is different.

Instagram's **"Download Your Information"** feature (required under GDPR) gives you a ZIP file containing your full follower and following data. WhoUnfollowed reads that file **entirely in your browser** — no upload, no server, no account needed.

**In one drop:**
- See every account you follow that doesn't follow you back
- Get a **Radar health score** with follow ratio and growth timeline
- **Compare snapshots** over time to see who unfollowed between dates
- Export results to CSV
- Zero bytes leave your device (on the Free plan)

***

## Demo

```
Drop the ZIP → Browser parses it in ~2s → Full results appear
```

| Metric | Value |
|--------|-------|
| Parse time | ~2 seconds |
| Data leaves device | 0 bytes (Free plan) |
| Instagram API calls | 0 |
| Passwords required | 0 |

***

## Features

### Free (No Signup)
- Full non-followers list from a single snapshot
- CSV export
- Runs entirely in your browser

### Pro 
- Unlimited snapshot history
- **Radar**: health score, follow age tracking, pending follow detection
- Snapshot comparison — see exactly who unfollowed between two dates
- Follower growth charts
- Triage workflow
- Cloud sync *(coming soon)*

### Mobile App *(coming soon)*
- iOS + Android, included with Pro
- Works offline
- Share results as an image

***

## Tech Stack

This is a **TypeScript monorepo** managed with [Turborepo](https://turbo.build/) and [pnpm workspaces](https://pnpm.io/workspaces).

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router, Turbopack) |
| Language | TypeScript 5 |
| UI | React 19, [Tailwind CSS v4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/) |
| Components | [Base UI](https://base-ui.com/), [Lucide React](https://lucide.dev/), [Recharts](https://recharts.org/) |
| State | [Zustand](https://github.com/pmndrs/zustand) |
| Local DB | [Dexie (IndexedDB)](https://dexie.org/) |
| Monorepo | [Turborepo](https://turbo.build/), pnpm workspaces |
| Linting | ESLint 10, Prettier, Husky + lint-staged |
| Deployment | [Railway](https://railway.app/) |

**Node ≥ 20 and pnpm ≥ 9 required.**

***

## Project Structure

```
WhoUnfollowed/
├── apps/
│   └── web/              # Next.js 15 app (main frontend)
├── packages/             # Shared packages (core parser, UI, config)
│   └── core/             # ZIP parsing logic, follower diff engine
├── docs/                 # Internal documentation
├── turbo.json            # Turborepo pipeline config
├── pnpm-workspace.yaml   # Workspace definition
└── railway.json          # Railway deployment config
```

***

## Getting Started

### Prerequisites

- **Node.js** ≥ 20
- **pnpm** ≥ 9 (`npm install -g pnpm`)

### Installation

```bash
# Clone the repo
git clone https://github.com/al-kilic/WhoUnfollowed.git
cd WhoUnfollowed

# Install all workspace dependencies
pnpm install
```

### Development

```bash
# Start all apps in dev mode (with Turbopack)
pnpm dev

# The web app will be available at:
# http://localhost:3000
```

### Build

```bash
# Build all packages and apps
pnpm build

# Type-check everything
pnpm typecheck

# Lint
pnpm lint
```

### Clean

```bash
pnpm clean
```

***

## How to Use the App

> You need an **Instagram data export** — here's how to get one:

1. Open [Instagram Accounts Center](https://accountscenter.instagram.com/) → **Your information and permissions** → **Download your information**
2. Select **Followers and Following**
3. Set date range to **All Time**, format to **JSON**
4. Hit **Request** — Instagram emails you a download link (usually within minutes)
5. Download the ZIP
6. **Drop the ZIP** at [whounfollowed-production.up.railway.app](https://whounfollowed-production.up.railway.app/)

Full guide: [How to Export Your Instagram Data](https://whounfollowed-production.up.railway.app/how-to-export)

***

## Privacy

**This is the entire privacy model:**

- The ZIP file is read by JavaScript inside your browser tab
- On the **Free plan**: nothing is stored, nothing is sent anywhere
- On **Pro**: snapshots you explicitly save are stored encrypted in cloud so you can compare across sessions/devices
- No Instagram login. No third-party API calls. No credential storage.

The parser source is public and MIT-licensed — you can read exactly what happens to your data.

→ [Full Privacy Policy](https://whounfollowed-production.up.railway.app/privacy)

***

## Roadmap

- [x] Single-snapshot non-follower analysis
- [x] CSV export
- [x] Radar health score
- [x] Snapshot comparison (who unfollowed between dates)
- [x] Follower growth charts
- [x] Light / dark theme
- [x] Full mobile responsive
- [ ] Cloud sync for Pro snapshots
- [ ] iOS app
- [ ] Android app

See the full [Changelog](https://whounfollowed-production.up.railway.app/changelog).

***

## Contributing

The project is under active development. Feel free to open issues for bugs or feature requests. PRs are welcome.

***

## License

MIT — see [LICENSE](./LICENSE).

The web app (`apps/web`) is licensed under **AGPL-3.0**.  
The core parser (`packages/core`) is licensed under **MIT**.

***

## Contact

Built by [Alan Kılıç](https://github.com/al-kilic) · [aekilicc@gmail.com](mailto:aekilicc@gmail.com)

Not affiliated with Instagram or Meta.

***

<div align="center">
  <sub>Made with care. Your data stays yours.</sub>
</div>
