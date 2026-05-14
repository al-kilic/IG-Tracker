'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { analyzeSnapshot } from '@ig-tracker/core';
import type { Account } from '@ig-tracker/core';
import { useSnapshotStore } from '@/lib/store';
import { AccountList } from '@/components/AccountList';
import { TriageList } from '@/components/TriageList';
import { LandingFooter } from '@/components/landing/FinalCTA';
import { T } from '@/components/landing/tokens';
import { useTriage } from '@/hooks/useTriage';

// ─── Stat card ───────────────────────────────────────────────────────────────

function StatCard({ label, value, badge, accent = false }: {
  label: string;
  value: string | number;
  badge?: { text: string; title: string } | undefined;
  accent?: boolean;
}) {
  return (
    <div style={{
      padding: '16px 18px', borderRadius: 14,
      background: accent ? 'rgba(2,136,143,0.08)' : 'rgba(244,240,232,0.02)',
      border: `1px solid ${accent ? 'rgba(2,136,143,0.25)' : 'rgba(244,240,232,0.07)'}`,
      display: 'flex', flexDirection: 'column', gap: 6,
    }}>
      <div style={{ fontSize: 12, color: accent ? T.tealMid : T.inkDim, fontFamily: T.mono, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500 }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontFamily: T.serif, fontSize: 36, lineHeight: 1, letterSpacing: '-0.03em', color: accent ? T.tealLight : T.ink }}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {badge && (
          <span title={badge.title} style={{
            fontSize: 13, fontFamily: T.mono, color: T.terra,
            whiteSpace: 'nowrap', lineHeight: 1,
          }}>
            {badge.text}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Tab bar ──────────────────────────────────────────────────────────────────

interface Tab { id: string; label: string; description: string; count: number; accounts: Account[]; csvFilename: string; emptyMessage: string }

function InfoTooltip({ text }: { text: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <span
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <svg width="13" height="13" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, opacity: 0.5 }}>
        <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M7 6.5 V10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <circle cx="7" cy="4.5" r="0.7" fill="currentColor"/>
      </svg>
      {visible && (
        <span style={{
          position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
          marginBottom: 8, width: 200, padding: '8px 12px', borderRadius: 8,
          background: 'rgba(20,20,20,0.97)', border: '1px solid rgba(244,240,232,0.1)',
          fontSize: 12, color: 'rgba(244,240,232,0.75)', lineHeight: 1.5,
          whiteSpace: 'normal', textAlign: 'left', pointerEvents: 'none', zIndex: 100,
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
        }}>
          {text}
        </span>
      )}
    </span>
  );
}

function TabBar({ tabs, activeId, onChange }: { tabs: Tab[]; activeId: string; onChange: (id: string) => void }) {
  return (
    <div style={{ display: 'flex', gap: 4, padding: 4, borderRadius: 14, background: 'rgba(244,240,232,0.03)', border: '1px solid rgba(244,240,232,0.06)', overflowX: 'auto' }}>
      {tabs.map(tab => {
        const active = tab.id === activeId;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '10px 10px', borderRadius: 10, whiteSpace: 'nowrap', minWidth: 0,
              background: active ? 'rgba(2,136,143,0.12)' : 'transparent',
              border: `1px solid ${active ? 'rgba(2,136,143,0.3)' : 'transparent'}`,
              color: active ? T.ink : T.inkDim,
              fontSize: 12, fontWeight: active ? 600 : 400,
              fontFamily: T.sans, cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
            <InfoTooltip text={tab.description} />
            <span style={{
              fontSize: 11, padding: '2px 6px', borderRadius: 20, fontFamily: T.mono, flexShrink: 0,
              background: active ? T.tealMid : 'rgba(244,240,232,0.06)',
              color: active ? T.cream : T.inkMute,
            }}>
              {tab.count.toLocaleString()}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ResultsPage() {
  const router       = useRouter();
  const snapshot     = useSnapshotStore(s => s.currentSnapshot);
  const [activeTabId, setActiveTabId] = useState('non-followers');

  useEffect(() => { if (!snapshot) router.replace('/'); }, [snapshot, router]);

  const analysis = useMemo(() => snapshot ? analyzeSnapshot(snapshot) : null, [snapshot]);
  const { triage } = useTriage(snapshot?.exportedAt ?? 0);
  const unfollowedCount = useMemo(
    () => [...triage.values()].filter(s => s === 'done').length,
    [triage],
  );

  if (!snapshot || !analysis) return null;

  const exportedDate = format(new Date(snapshot.exportedAt * 1000), 'MMM d, yyyy');

  const tabs: Tab[] = [
    { id: 'non-followers', label: "Don't follow back", description: "Accounts you follow that don't follow you back.",       count: analysis.nonFollowers.length, accounts: analysis.nonFollowers, csvFilename: `non-followers-${snapshot.exportedAt}.csv`, emptyMessage: 'Everyone you follow also follows you back.' },
    { id: 'fans',          label: 'Fans',              description: "Accounts that follow you, but you don't follow back.",  count: analysis.fans.length,         accounts: analysis.fans,         csvFilename: `fans-${snapshot.exportedAt}.csv`,          emptyMessage: 'You follow everyone who follows you.' },
    { id: 'mutuals',       label: 'Mutuals',           description: "Accounts you both follow each other.",                  count: analysis.mutuals.length,      accounts: analysis.mutuals,      csvFilename: `mutuals-${snapshot.exportedAt}.csv`,       emptyMessage: 'No mutual follows found.' },
  ];

  const activeTab = tabs.find(t => t.id === activeTabId) ?? tabs[0]!;

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: T.sans }}>
      {/* Nav */}
      <nav
        className="flex items-center justify-between px-4 sm:px-8 py-4 sticky top-0 z-50"
        style={{ borderBottom: '1px solid rgba(244,240,232,0.06)', backdropFilter: 'blur(14px)', background: 'rgba(13,13,13,0.8)' }}
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
          <Link href="/" style={{ color: T.inkDim, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M8 2 H3 A1 1 0 0 0 2 3 V11 A1 1 0 0 0 3 12 H11 A1 1 0 0 0 12 11 V6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              <path d="M9 2 H12 V5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 7 L12 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            <span className="hidden sm:inline">New upload</span>
          </Link>
        </div>
      </nav>

      <main className="px-4 sm:px-8 py-10 sm:py-12" style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 11, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.14em' }}>RESULTS</span>
            <span style={{ fontSize: 11, color: T.inkMute, fontFamily: T.mono }}>· Export from {exportedDate}</span>
          </div>
          <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.03em', color: T.ink }}>
            <span style={{ color: T.tealLight }}>{analysis.nonFollowers.length.toLocaleString()}</span>{' '}
            {analysis.nonFollowers.length === 1 ? "person doesn't" : "people don't"} follow you back.
          </h1>
          <p style={{ fontSize: 15, color: T.inkDim, marginTop: 10 }}>
            Out of {analysis.totalFollowing.toLocaleString()} accounts you follow.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4" style={{ gap: 10, marginBottom: 40 }}>
          <StatCard label="Followers"     value={analysis.totalFollowers} />
          <StatCard
            label="Following"
            value={analysis.totalFollowing}
            badge={unfollowedCount > 0 ? {
              text: `→ now ~${(analysis.totalFollowing - unfollowedCount).toLocaleString()}`,
              title: `${unfollowedCount} marked as unfollowed`,
            } : undefined}
          />
          <StatCard label="Mutuals"       value={analysis.mutuals.length} />
          <StatCard label="Non-followers" value={analysis.nonFollowers.length} accent />
        </div>

        {/* Tabs + list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <TabBar tabs={tabs} activeId={activeTabId} onChange={setActiveTabId} />
          {activeTabId === 'non-followers' ? (
            <TriageList
              accounts={analysis.nonFollowers}
              snapshotKey={snapshot.exportedAt}
              csvFilename={activeTab.csvFilename}
            />
          ) : (
            <AccountList
              key={activeTabId}
              accounts={activeTab.accounts}
              csvFilename={activeTab.csvFilename}
              emptyMessage={activeTab.emptyMessage}
            />
          )}
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
