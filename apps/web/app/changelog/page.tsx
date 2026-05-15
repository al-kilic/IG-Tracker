import Link from 'next/link';
import type { Metadata } from 'next';
import { T } from '@/components/landing/tokens';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LandingFooter } from '@/components/landing/FinalCTA';

export const metadata: Metadata = {
  title: 'Changelog - WhoUnfollowed',
  description: 'What\'s new in WhoUnfollowed. Updates, fixes, and improvements.',
};

const entries: { version: string; date: string; tag: 'launch' | 'fix' | 'improvement' | 'feature'; items: string[] }[] = [
  {
    version: '0.6',
    date: 'May 15, 2026',
    tag: 'improvement',
    items: [
      'Light and dark mode. Toggle in the nav on every page.',
      'Works on mobile. Every page, every section.',
      'First-time feature tour on Results and Radar. Highlights what each section does, once per session.',
      'Tap any date range box on Pending Requests to sort those accounts to the top.',
      'Pending request labels vary by actual wait time now instead of showing the same text for everyone.',
      'Follow Ratio card on Radar now has an explanation of what the number means and the one thing you can do to improve it.',
      'Hover any filter pill on your results list to see what the label actually does.',
      'Blog added. Three posts on Instagram follower tracking, account bans, and follow ratio.',
      'Compare page added. Full feature table: WhoUnfollowed against every major tracker in one view.',
      'About and Contact pages added.',
      'Nav has a Learn menu with quick links to the explainer, compare table, and blog.',
      'Privacy Policy rewritten with proper legal language and a clear statement that we are not affiliated with Instagram or Meta.',
    ],
  },
  {
    version: '0.5',
    date: 'May 12, 2026',
    tag: 'improvement',
    items: [
      'If you upload a scheduled Instagram export by mistake, we now catch it before saving and walk you through requesting the correct full export',
      'Fixed: Pending Requests and Recently Unfollowed on the Radar page were always showing empty. They now populate correctly from your export',
      'Radar works when you open it directly or navigate from Snapshot History, not only after uploading',
      'Export guide completely rewritten - works on any browser or device, no app needed. One-click link to open Instagram Accounts Center',
      'How It Works menu now includes a direct shortcut to start your Instagram export',
      'Pricing updated to reflect what is actually available now. Mobile app added to the roadmap, included with Pro',
      'How to Export page expanded with a timing guide, file structure explainer, full troubleshooting section, and FAQ with 6 common questions',
    ],
  },
  {
    version: '0.4',
    date: 'May 8, 2026',
    tag: 'feature',
    items: [
      'Triage workflow on non-followers - Dropping, Whitelist, Unfollowed, Skip for now',
      'Triage states persist per snapshot in IndexedDB',
      'Keyboard nav: arrow keys to move, 1-4 to triage',
      'Progress bar showing triage completion with milestone messages',
      'Witty copy under each triage badge, unique per account',
      'Whitelist section collapsed at the bottom with expandable account list',
      'Toast with Undo when adding to Whitelist',
      'Filter pills with live counts and info tooltips: All, Untriaged, Dropping, Unfollowed, Skip for now',
      'A-Z / Z-A sort on the non-followers list',
      'Visited row highlighting scoped per snapshot',
      'Carry over triage from a previous snapshot - optional, with per-state checkboxes and snapshot picker',
      'Live following estimate next to the Following count, updates as you triage',
      'Free tier capped at 1 snapshot, Pro is unlimited',
      'Upload always works during beta regardless of snapshot count',
    ],
  },
  {
    version: '0.3',
    date: 'May 6, 2026',
    tag: 'improvement',
    items: [
      'New logo',
      'Fixed a parsing issue with newer Instagram exports - some ZIPs were failing to upload',
      'Added clearer guidance on selecting "All time" when downloading your Instagram data',
      'Step-by-step export guide is now easier to find from the home page',
    ],
  },
  {
    version: '0.2',
    date: 'May 5, 2026',
    tag: 'improvement',
    items: [
      'Rebranded to WhoUnfollowed',
      'Various copy and layout fixes',
    ],
  },
  {
    version: '0.1',
    date: 'April 28, 2026',
    tag: 'launch',
    items: [
      'Launch - upload your Instagram export, see who doesn\'t follow you back',
      'Your data never leaves your browser',
      'Followers, following, mutuals, and non-followers breakdown',
      'CSV export',
      'Snapshot history and comparison',
      'Step-by-step guide on how to download your Instagram data',
    ],
  },
];

const tagStyles: Record<string, { label: string; color: string; bg: string }> = {
  launch:      { label: 'Launch',      color: T.tealLight,  bg: 'rgba(2,136,143,0.12)' },
  feature:     { label: 'Feature',     color: '#a8d4b0',    bg: 'rgba(168,212,176,0.1)' },
  improvement: { label: 'Improvement', color: T.inkDim,     bg: 'var(--t-border1)' },
  fix:         { label: 'Fix',         color: '#e0a070',    bg: 'rgba(168,75,47,0.1)' },
};

export default function ChangelogPage() {
  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: T.sans }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid var(--t-border1)', position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(14px)', background: 'var(--t-navBg)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="/logo.png" alt="WhoUnfollowed Logo" width={26} height={26} style={{ borderRadius: 7, objectFit: 'contain' }} />
          <span style={{ fontFamily: T.serif, fontSize: 17, color: T.ink }}>WhoUnfollowed</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/" style={{ fontSize: 13, color: T.inkDim, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M11 7 H3 M3 7 L6 4 M3 7 L6 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Back to home
          </Link>
          <ThemeToggle />
        </div>
      </nav>

      <main style={{ maxWidth: 680, margin: '0 auto', padding: '56px 32px 80px' }}>
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 11, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.14em', marginBottom: 14 }}>CHANGELOG</div>
          <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.03em', color: T.ink, marginBottom: 12 }}>
            What&apos;s new.
          </h1>
          <p style={{ fontSize: 15, color: T.inkDim, lineHeight: 1.6 }}>
            Updates, fixes, and improvements to WhoUnfollowed.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {entries.map((entry, i) => {
            const tag = tagStyles[entry.tag]!;
            return (
              <div key={entry.version} style={{ display: 'flex', gap: 24 }}>
                {/* Timeline */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 12 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: T.tealMid, flexShrink: 0, marginTop: 6 }} />
                  {i < entries.length - 1 && (
                    <div style={{ flex: 1, width: 1, background: 'var(--t-border2)', minHeight: 32, marginTop: 6 }} />
                  )}
                </div>

                {/* Content */}
                <div style={{ flex: 1, paddingBottom: 48 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: T.serif, fontSize: 22, color: T.ink, letterSpacing: '-0.01em' }}>
                      v{entry.version}
                    </span>
                    <span style={{ fontSize: 10, fontFamily: T.mono, padding: '3px 9px', borderRadius: 20, color: tag.color, background: tag.bg, letterSpacing: '0.06em' }}>
                      {tag.label.toUpperCase()}
                    </span>
                    <span style={{ fontSize: 12, color: T.inkMute, fontFamily: T.mono, marginLeft: 'auto' }}>
                      {entry.date}
                    </span>
                  </div>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {entry.items.map((item) => (
                      <li key={item} style={{ display: 'flex', gap: 10, fontSize: 14, color: T.inkDim, lineHeight: 1.6 }}>
                        <span style={{ color: T.tealMid, flexShrink: 0, marginTop: 2 }}>–</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 8, paddingTop: 32, borderTop: '1px solid var(--t-border1)' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: T.inkDim, textDecoration: 'none' }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M11 7 H3 M3 7 L6 4 M3 7 L6 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Back to WhoUnfollowed
          </Link>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
