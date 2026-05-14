'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { format, differenceInDays } from 'date-fns';
import { compareSnapshots } from '@ig-tracker/core';
import type { SnapshotComparison } from '@ig-tracker/core';
import { db, type SnapshotRecord } from '@/lib/db';
import { AccountList } from '@/components/AccountList';
import { LandingFooter } from '@/components/landing/FinalCTA';
import { T } from '@/components/landing/tokens';
import { ThemeToggle } from '@/components/ThemeToggle';

interface Section {
  id: string;
  label: string;
  count: number;
  accounts: SnapshotComparison[keyof Omit<SnapshotComparison, 'periodDays'>];
  csvFilename: string;
  emptyMessage: string;
  color: string;
  symbol: string;
}

export default function ComparePage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ComparePageInner />
    </Suspense>
  );
}

function LoadingSpinner() {
  return (
    <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: 48, height: 48 }}>
        <svg width="48" height="48" viewBox="0 0 48 48" style={{ animation: 'ring-rotate 1.8s linear infinite' }}>
          <circle cx="24" cy="24" r="20" fill="none" stroke={T.tealMid} strokeWidth="2" strokeDasharray="4 6" opacity="0.6"/>
        </svg>
      </div>
    </div>
  );
}

function ComparePageInner() {
  const searchParams  = useSearchParams();
  const oldId         = Number(searchParams.get('old'));
  const currentId     = Number(searchParams.get('current'));

  const [oldRecord,     setOldRecord]     = useState<SnapshotRecord | null>(null);
  const [currentRecord, setCurrentRecord] = useState<SnapshotRecord | null>(null);
  const [loading,       setLoading]       = useState(true);
  const [activeSection, setActiveSection] = useState('lost');

  useEffect(() => {
    if (!oldId || !currentId) { setLoading(false); return; }
    const timeout = setTimeout(() => setLoading(false), 8000);
    Promise.all([db.snapshots.get(oldId), db.snapshots.get(currentId)])
      .then(([old, cur]) => {
        setOldRecord(old ?? null);
        setCurrentRecord(cur ?? null);
      })
      .catch(() => {
        setOldRecord(null);
        setCurrentRecord(null);
      })
      .finally(() => { clearTimeout(timeout); setLoading(false); });
    return () => clearTimeout(timeout);
  }, [oldId, currentId]);

  if (loading) return <LoadingSpinner />;

  if (!oldRecord || !currentRecord) {
    return (
      <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: T.sans, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center', padding: 32 }}>
        <div style={{ fontFamily: T.serif, fontSize: 28, color: T.ink }}>Snapshots not found</div>
        <div style={{ fontSize: 14, color: T.inkDim }}>One or both snapshots were deleted. Go back and try again.</div>
        <Link href="/history" style={{ color: T.tealLight, fontSize: 13, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          Back to history
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path d="M3 7 H11 M11 7 L8 4 M11 7 L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    );
  }

  const diff  = compareSnapshots(oldRecord.data, currentRecord.data);
  const days  = differenceInDays(new Date(currentRecord.data.exportedAt * 1000), new Date(oldRecord.data.exportedAt * 1000));
  const periodLabel = days === 0 ? 'same day' : days === 1 ? '1 day apart' : `${days} days apart`;

  const sections: Section[] = [
    { id: 'lost',       label: 'Unfollowed you', count: diff.lostFollowers.length, accounts: diff.lostFollowers, csvFilename: `unfollowers-${currentRecord.data.exportedAt}.csv`,    emptyMessage: 'Nobody unfollowed you in this period.',         color: T.terra,     symbol: '−' },
    { id: 'gained',     label: 'New followers',  count: diff.newFollowers.length,  accounts: diff.newFollowers,  csvFilename: `new-followers-${currentRecord.data.exportedAt}.csv`,  emptyMessage: 'No new followers in this period.',              color: T.tealLight, symbol: '+' },
    { id: 'unfollowed', label: 'You unfollowed', count: diff.unfollowed.length,    accounts: diff.unfollowed,    csvFilename: `you-unfollowed-${currentRecord.data.exportedAt}.csv`, emptyMessage: "You didn't unfollow anyone in this period.",    color: T.inkDim,    symbol: '−' },
    { id: 'followed',   label: 'You followed',   count: diff.newFollowing.length,  accounts: diff.newFollowing,  csvFilename: `you-followed-${currentRecord.data.exportedAt}.csv`,   emptyMessage: "You didn't follow anyone new in this period.", color: T.inkDim,    symbol: '+' },
  ];

  const active = sections.find(s => s.id === activeSection) ?? sections[0]!;

  const netChange  = diff.newFollowers.length - diff.lostFollowers.length;
  const netColor   = netChange > 0 ? T.tealLight : netChange < 0 ? T.terra : T.inkDim;
  const netPrefix  = netChange > 0 ? '+' : '';

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: T.sans }}>
      {/* Nav */}
      <nav
        className="flex items-center justify-between px-4 sm:px-8 py-4 sticky top-0 z-50"
        style={{ borderBottom: `1px solid ${T.border1}`, backdropFilter: 'blur(14px)', background: T.navBg }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="/logo.png" alt="WhoUnfollowed Logo" width={26} height={26} style={{ borderRadius: 7, objectFit: 'contain' }} />
          <span style={{ fontFamily: T.serif, fontSize: 17, color: T.ink }}>WhoUnfollowed</span>
        </Link>
        <div className="flex items-center gap-3 sm:gap-6" style={{ fontSize: 13 }}>
          <Link href="/dashboard" style={{
            color: T.tealLight, textDecoration: 'none', fontWeight: 600,
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '5px 12px', borderRadius: 8,
            background: 'rgba(2,136,143,0.1)', border: '1px solid rgba(2,136,143,0.25)',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.tealLight, display: 'inline-block' }} />
            Radar
          </Link>
          <Link href="/history" className="hidden sm:inline" style={{ color: T.inkDim, textDecoration: 'none' }}>History</Link>
          <Link href="/" className="hidden sm:inline" style={{ color: T.inkDim, textDecoration: 'none' }}>Home</Link>
          <ThemeToggle />
        </div>
      </nav>

      <main style={{ maxWidth: 900, margin: '0 auto', padding: '48px 32px' }}>
        {/* Back + period */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36 }}>
          <Link href="/history" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: T.inkDim, textDecoration: 'none' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M11 7 H3 M3 7 L6 4 M3 7 L6 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            History
          </Link>
          <span style={{ fontSize: 12, color: T.inkMute, fontFamily: T.mono }}>{periodLabel}</span>
        </div>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 11, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.14em', marginBottom: 12 }}>COMPARISON</div>
          <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.03em', color: T.ink }}>
            What changed between<br/>these two snapshots.
          </h1>
        </div>

        {/* Period card */}
        <div style={{ padding: '20px 24px', borderRadius: 16, background: 'rgba(244,240,232,0.02)', border: '1px solid rgba(244,240,232,0.06)', marginBottom: 32 }}>
          <div style={{ fontSize: 10, color: T.inkMute, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: T.mono, marginBottom: 10 }}>Comparing</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
            <div style={{ padding: '8px 16px', borderRadius: 10, background: 'rgba(244,240,232,0.04)', border: '1px solid rgba(244,240,232,0.08)', fontFamily: T.mono, fontSize: 13, color: T.ink }}>
              {format(new Date(oldRecord.data.exportedAt * 1000), 'MMM d, yyyy')}
            </div>
            <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
              <path d="M1 5 H17 M13 1 L17 5 L13 9" stroke={T.tealMid} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div style={{ padding: '8px 16px', borderRadius: 10, background: 'rgba(2,136,143,0.08)', border: `1px solid rgba(2,136,143,0.25)`, fontFamily: T.mono, fontSize: 13, color: T.ink }}>
              {format(new Date(currentRecord.data.exportedAt * 1000), 'MMM d, yyyy')}
            </div>
          </div>

          {/* Summary stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {sections.map(s => (
              <div key={s.id} style={{ textAlign: 'center', padding: '12px 8px', borderRadius: 10, background: 'rgba(244,240,232,0.02)', border: '1px solid rgba(244,240,232,0.05)' }}>
                <div style={{ fontFamily: T.serif, fontSize: 28, lineHeight: 1, color: s.color, letterSpacing: '-0.02em' }}>
                  {s.symbol}{s.count.toLocaleString()}
                </div>
                <div style={{ fontSize: 10, color: T.inkMute, marginTop: 4, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: T.mono }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Net change */}
          {netChange !== 0 && (
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(244,240,232,0.05)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: T.inkMute, fontFamily: T.mono }}>Net follower change:</span>
              <span style={{ fontFamily: T.serif, fontSize: 18, color: netColor, letterSpacing: '-0.01em' }}>{netPrefix}{netChange.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Tabs + list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', gap: 4, padding: 4, borderRadius: 14, background: 'rgba(244,240,232,0.03)', border: '1px solid rgba(244,240,232,0.06)' }}>
            {sections.map(s => {
              const active = s.id === activeSection;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '10px 12px', borderRadius: 10,
                    background: active ? 'rgba(2,136,143,0.12)' : 'transparent',
                    border: `1px solid ${active ? 'rgba(2,136,143,0.3)' : 'transparent'}`,
                    color: active ? T.ink : T.inkDim,
                    fontSize: 13, fontWeight: active ? 600 : 400,
                    fontFamily: T.sans, cursor: 'pointer', transition: 'all 0.2s',
                  }}
                >
                  <span style={{ color: active ? s.color : T.inkMute, fontFamily: T.mono, fontWeight: 700, fontSize: 14 }}>{s.symbol}</span>
                  <span style={{ display: 'none' }} className="sm-inline">{s.label}</span>
                  {s.label}
                  <span style={{ fontSize: 11, padding: '2px 7px', borderRadius: 20, fontFamily: T.mono, background: active ? T.tealMid : 'rgba(244,240,232,0.06)', color: active ? T.cream : T.inkMute }}>
                    {s.count.toLocaleString()}
                  </span>
                </button>
              );
            })}
          </div>

          <AccountList
            key={activeSection}
            accounts={active.accounts}
            csvFilename={active.csvFilename}
            emptyMessage={active.emptyMessage}
          />
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
