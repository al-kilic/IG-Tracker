'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { compareSnapshots } from '@ig-tracker/core';
import type { Account, SnapshotComparison } from '@ig-tracker/core';
import { db, type SnapshotRecord } from '@/lib/db';
import { T } from '@/components/landing/tokens';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AccountList } from '@/components/AccountList';
import { LandingFooter } from '@/components/landing/FinalCTA';

// ─── Simple collapsible section ───────────────────────────────────────────────

function DiffSection({
  title, label, count, accounts, csvFilename, emptyMessage, accent = false, defaultOpen = false,
}: {
  title: string; label: string; count: number; accounts: Account[]; csvFilename: string; emptyMessage: string; accent?: boolean; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  const accentColor = accent ? T.terra : T.tealMid;
  const accentBg    = accent ? 'rgba(168,75,47,0.06)' : 'rgba(2,136,143,0.06)';
  const accentBorder = accent ? 'rgba(168,75,47,0.25)' : 'rgba(2,136,143,0.25)';

  return (
    <div style={{ borderRadius: 16, border: `1px solid ${open ? accentBorder : 'var(--t-border1)'}`, overflow: 'hidden', transition: 'border-color 0.2s' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 24px',
          background: open ? accentBg : 'var(--t-surface1)',
          border: 'none', cursor: 'pointer', textAlign: 'left', gap: 12,
          transition: 'background 0.2s',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{
            fontFamily: T.serif, fontSize: 20, color: T.ink, letterSpacing: '-0.01em',
          }}>
            {title}
          </span>
          <span style={{
            fontSize: 11, fontFamily: T.mono, padding: '3px 10px', borderRadius: 20,
            background: `${accentColor}22`, color: accentColor, letterSpacing: '0.04em',
          }}>
            {label}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: T.serif, fontSize: 28, color: accentColor, letterSpacing: '-0.02em' }}>
            {count.toLocaleString()}
          </span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
            <path d="M3 6 L8 11 L13 6" stroke={T.inkMute} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </button>

      {open && (
        <div style={{ padding: '0 16px 16px' }}>
          {count === 0 ? (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: T.inkMute, fontSize: 13, fontStyle: 'italic' }}>
              {emptyMessage}
            </div>
          ) : (
            <AccountList accounts={accounts} csvFilename={csvFilename} emptyMessage={emptyMessage} />
          )}
        </div>
      )}
    </div>
  );
}

// ─── Stat chip ────────────────────────────────────────────────────────────────

function StatChip({ label, value, positive }: { label: string; value: number; positive: boolean }) {
  const color = value === 0 ? T.inkMute : positive ? T.tealLight : T.terra;
  const prefix = value > 0 ? '+' : '';
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 4,
      padding: '14px 20px', borderRadius: 14,
      background: value === 0 ? 'var(--t-surface1)' : positive ? 'rgba(2,136,143,0.07)' : 'rgba(168,75,47,0.07)',
      border: `1px solid ${value === 0 ? 'var(--t-border1)' : positive ? 'rgba(2,136,143,0.2)' : 'rgba(168,75,47,0.2)'}`,
    }}>
      <span style={{ fontFamily: T.serif, fontSize: 32, color, letterSpacing: '-0.03em', lineHeight: 1 }}>
        {prefix}{value.toLocaleString()}
      </span>
      <span style={{ fontSize: 11, color: T.inkDim, fontFamily: T.mono, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        {label}
      </span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function DiffPageInner() {
  const searchParams = useSearchParams();

  const oldId     = Number(searchParams.get('old'));
  const currentId = Number(searchParams.get('current'));

  const [oldRecord, setOldRecord]         = useState<SnapshotRecord | null>(null);
  const [currentRecord, setCurrentRecord] = useState<SnapshotRecord | null>(null);
  const [diff, setDiff]                   = useState<SnapshotComparison | null>(null);
  const [error, setError]                 = useState<string | null>(null);

  useEffect(() => {
    if (!oldId || !currentId) { setError('Missing snapshot IDs.'); return; }

    Promise.all([db.snapshots.get(oldId), db.snapshots.get(currentId)]).then(([o, c]) => {
      if (!o || !c) { setError('One or both snapshots not found.'); return; }
      setOldRecord(o);
      setCurrentRecord(c);
      setDiff(compareSnapshots(o.data, c.data));
    }).catch(() => setError('Failed to load snapshots.'));
  }, [oldId, currentId]);

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <p style={{ color: T.terra, fontFamily: T.mono, fontSize: 14 }}>{error}</p>
        <Link href="/history" style={{ color: T.tealLight, fontSize: 13, fontFamily: T.sans }}>← Back to history</Link>
      </div>
    );
  }

  if (!diff || !oldRecord || !currentRecord) {
    return (
      <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: T.mono, fontSize: 13, color: T.inkMute }}>Loading snapshots…</span>
      </div>
    );
  }

  const periodDays = Math.round(Math.abs(diff.periodDays));
  const oldDate    = format(new Date(oldRecord.exportedAt * 1000), 'MMM d, yyyy');
  const curDate    = format(new Date(currentRecord.exportedAt * 1000), 'MMM d, yyyy');
  const netFollowers = diff.newFollowers.length - diff.lostFollowers.length;

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: T.sans }}>
      {/* Nav */}
      <nav
        className="flex items-center justify-between px-4 sm:px-8 py-4 sticky top-0 z-50"
        style={{ borderBottom: `1px solid ${T.border1}`, backdropFilter: 'blur(14px)', background: T.navBg }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="/logo.png" alt="WhoUnfollowed" width={26} height={26} style={{ borderRadius: 7, objectFit: 'contain' }} />
          <span style={{ fontFamily: T.serif, fontSize: 17, color: T.ink }}>WhoUnfollowed</span>
        </Link>
        <div className="flex items-center gap-3 sm:gap-6" style={{ fontSize: 13 }}>
          <Link href="/history" style={{ color: T.inkDim, textDecoration: 'none' }}>← History</Link>
          <ThemeToggle />
        </div>
      </nav>

      <main className="px-4 sm:px-8 py-10 sm:py-12" style={{ maxWidth: 860, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.14em', marginBottom: 12 }}>SNAPSHOT COMPARISON</div>
          <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.03em', color: T.ink, marginBottom: 12 }}>
            {periodDays} day{periodDays !== 1 ? 's' : ''} of changes.
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ padding: '5px 12px', borderRadius: 8, background: 'var(--t-surface2)', border: '1px solid var(--t-border2)', fontSize: 12, color: T.inkDim, fontFamily: T.mono }}>
              {oldRecord.label} · {oldDate}
            </span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8 H13 M9 4 L13 8 L9 12" stroke={T.inkMute} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span style={{ padding: '5px 12px', borderRadius: 8, background: 'rgba(2,136,143,0.08)', border: '1px solid rgba(2,136,143,0.25)', fontSize: 12, color: T.tealLight, fontFamily: T.mono }}>
              {currentRecord.label} · {curDate}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4" style={{ gap: 10, marginBottom: 40 }}>
          <StatChip label="Unfollowed you"    value={-diff.lostFollowers.length}  positive={false} />
          <StatChip label="New followers"     value={diff.newFollowers.length}    positive={true}  />
          <StatChip label="You unfollowed"    value={-diff.unfollowed.length}     positive={false} />
          <StatChip label="Net change"        value={netFollowers}                positive={netFollowers >= 0} />
        </div>

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <DiffSection
            title="Who unfollowed you"
            label="Lost followers"
            count={diff.lostFollowers.length}
            accounts={diff.lostFollowers}
            csvFilename={`unfollowers-${oldRecord.exportedAt}-${currentRecord.exportedAt}.csv`}
            emptyMessage="Nobody unfollowed you in this period."
            accent={true}
            defaultOpen={true}
          />
          <DiffSection
            title="New followers"
            label="Gained"
            count={diff.newFollowers.length}
            accounts={diff.newFollowers}
            csvFilename={`new-followers-${oldRecord.exportedAt}-${currentRecord.exportedAt}.csv`}
            emptyMessage="No new followers in this period."
            defaultOpen={diff.lostFollowers.length === 0}
          />
          <DiffSection
            title="You unfollowed"
            label="You dropped"
            count={diff.unfollowed.length}
            accounts={diff.unfollowed}
            csvFilename={`you-unfollowed-${oldRecord.exportedAt}-${currentRecord.exportedAt}.csv`}
            emptyMessage="You didn't unfollow anyone in this period."
          />
          <DiffSection
            title="You started following"
            label="New following"
            count={diff.newFollowing.length}
            accounts={diff.newFollowing}
            csvFilename={`new-following-${oldRecord.exportedAt}-${currentRecord.exportedAt}.csv`}
            emptyMessage="You didn't follow anyone new in this period."
          />
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}

export default function DiffPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: 'var(--t-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--t-ink-mute)' }}>Loading…</span>
      </div>
    }>
      <DiffPageInner />
    </Suspense>
  );
}
