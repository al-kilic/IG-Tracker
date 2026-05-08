'use client';

import { useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format, formatDistanceToNow, differenceInDays } from 'date-fns';
import { ExternalLink } from 'lucide-react';
import { useSnapshotStore } from '@/lib/store';
import { LandingFooter } from '@/components/landing/FinalCTA';
import { T } from '@/components/landing/tokens';
import { useSnapshotList } from '@/hooks/useSnapshots';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SectionHeader({ label, count, sub }: { label: string; count?: number | undefined; sub?: string | undefined }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
        <h2 style={{ fontFamily: T.serif, fontSize: 24, fontWeight: 400, letterSpacing: '-0.02em', color: T.ink }}>
          {label}
        </h2>
        {count !== undefined && (
          <span style={{ fontSize: 13, fontFamily: T.mono, color: T.inkMute }}>
            {count.toLocaleString()}
          </span>
        )}
      </div>
      {sub && <p style={{ fontSize: 13, color: T.inkMute }}>{sub}</p>}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div style={{
      padding: '32px', borderRadius: 14, border: '1px dashed rgba(244,240,232,0.08)',
      textAlign: 'center', fontSize: 13, color: T.inkMute, fontStyle: 'italic',
    }}>
      {text}
    </div>
  );
}

function IGLink({ href, username }: { href: string; username: string }) {
  return (
    <a
      href={href} target="_blank" rel="noopener noreferrer"
      style={{ color: T.inkMute, display: 'flex', alignItems: 'center' }}
      onMouseEnter={e => (e.currentTarget.style.color = T.tealLight)}
      onMouseLeave={e => (e.currentTarget.style.color = T.inkMute)}
      aria-label={`Open @${username} on Instagram`}
    >
      <ExternalLink size={13} />
    </a>
  );
}

// ─── Section 1: Pending requests ──────────────────────────────────────────────

function PendingRequests({ accounts }: { accounts: { username: string; href: string; followedAt: number | null }[] }) {
  const sorted = [...accounts].sort((a, b) => (a.followedAt ?? 0) - (b.followedAt ?? 0));
  const now = Math.floor(Date.now() / 1000);

  if (!accounts.length) return <EmptyState text="Nobody keeping you waiting." />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', borderRadius: 14, border: '1px solid rgba(244,240,232,0.07)', overflow: 'hidden' }}>
      {sorted.map((a, i) => {
        const days = a.followedAt ? differenceInDays(now * 1000, a.followedAt * 1000) : null;
        const flag = days !== null && days >= 90 ? { text: 'They saw it.', color: T.terra } :
                     days !== null && days >= 30 ? { text: 'Probably not happening.', color: '#a0956b' } : null;
        return (
          <div key={a.username} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
            borderBottom: i < sorted.length - 1 ? '1px solid rgba(244,240,232,0.05)' : 'none',
            background: i % 2 === 0 ? 'transparent' : 'rgba(244,240,232,0.01)',
          }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(244,240,232,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: T.inkDim, flexShrink: 0 }}>
              {a.username[0]?.toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: T.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>@{a.username}</p>
              {days !== null && (
                <p style={{ fontSize: 11, color: T.inkMute, marginTop: 1 }}>
                  Pending {days === 0 ? 'today' : `${days} day${days !== 1 ? 's' : ''}`}
                </p>
              )}
            </div>
            {flag && (
              <span style={{ fontSize: 11, fontFamily: T.mono, color: flag.color, whiteSpace: 'nowrap' }}>
                {flag.text}
              </span>
            )}
            <IGLink href={a.href} username={a.username} />
          </div>
        );
      })}
    </div>
  );
}

// ─── Section 2: Recently unfollowed ───────────────────────────────────────────

function RecentlyUnfollowed({ accounts }: { accounts: { username: string; href: string; followedAt: number | null }[] }) {
  if (!accounts.length) return <EmptyState text="Your recent clean-up. In case you forgot." />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', borderRadius: 14, border: '1px solid rgba(244,240,232,0.07)', overflow: 'hidden' }}>
      {accounts.map((a, i) => (
        <div key={a.username} style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
          borderBottom: i < accounts.length - 1 ? '1px solid rgba(244,240,232,0.05)' : 'none',
          background: i % 2 === 0 ? 'transparent' : 'rgba(244,240,232,0.01)',
        }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(244,240,232,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: T.inkDim, flexShrink: 0 }}>
            {a.username[0]?.toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: T.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>@{a.username}</p>
            {a.followedAt && (
              <p style={{ fontSize: 11, color: T.inkMute, marginTop: 1 }}>
                {formatDistanceToNow(new Date(a.followedAt * 1000), { addSuffix: true })}
              </p>
            )}
          </div>
          <IGLink href={a.href} username={a.username} />
        </div>
      ))}
    </div>
  );
}

// ─── Section 3: Follow age analysis ───────────────────────────────────────────

const AGE_BUCKETS = [
  { label: '< 1 month',   maxDays: 30,   color: T.tealLight },
  { label: '1-6 months',  maxDays: 180,  color: T.tealMid },
  { label: '6-12 months', maxDays: 365,  color: '#a0956b' },
  { label: '1+ year',     maxDays: Infinity, color: T.terra },
];

function FollowAgeAnalysis({ nonFollowers }: { nonFollowers: { username: string; followedAt: number | null }[] }) {
  const now = Math.floor(Date.now() / 1000);
  const withTimestamp = nonFollowers.filter(a => a.followedAt !== null);

  if (!withTimestamp.length) {
    return <EmptyState text="Follow age data requires a JSON export. HTML exports don't include timestamps." />;
  }

  const buckets = AGE_BUCKETS.map(b => ({
    ...b,
    accounts: withTimestamp.filter(a => {
      const days = differenceInDays(now * 1000, (a.followedAt ?? 0) * 1000);
      return days < b.maxDays && (b.maxDays === 30 ? true : days >= (AGE_BUCKETS[AGE_BUCKETS.indexOf(b) - 1]?.maxDays ?? 0));
    }),
  }));

  const maxCount = Math.max(...buckets.map(b => b.accounts.length), 1);
  const longTenure = buckets.find(b => b.label === '1+ year')?.accounts.length ?? 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {longTenure > 0 && (
        <div style={{
          padding: '12px 16px', borderRadius: 10,
          background: 'rgba(168,75,47,0.06)', border: '1px solid rgba(168,75,47,0.18)',
          fontSize: 13, color: T.inkDim,
        }}>
          You have been following{' '}
          <span style={{ color: T.ink, fontWeight: 600 }}>{longTenure.toLocaleString()} account{longTenure !== 1 ? 's' : ''}</span>
          {' '}for over a year. They haven&apos;t followed back.
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {buckets.map(b => (
          <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 12, fontFamily: T.mono, color: T.inkDim, width: 90, flexShrink: 0 }}>{b.label}</span>
            <div style={{ flex: 1, height: 8, borderRadius: 4, background: 'rgba(244,240,232,0.05)', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 4,
                background: b.color,
                width: `${(b.accounts.length / maxCount) * 100}%`,
                transition: 'width 0.6s ease',
              }} />
            </div>
            <span style={{ fontSize: 12, fontFamily: T.mono, color: T.inkMute, width: 32, textAlign: 'right', flexShrink: 0 }}>
              {b.accounts.length}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Section 4: Follow ratio ───────────────────────────────────────────────────

function FollowRatio({
  followers, following, snapshots,
}: {
  followers: number;
  following: number;
  snapshots: { exportedAt: number; data: { followers: unknown[]; following: unknown[] } }[];
}) {
  const ratio = following === 0 ? 0 : followers / following;
  const ratioLabel = ratio >= 1 ? `${ratio.toFixed(1)}x more followers than following` :
                     ratio === 0 ? 'No data' :
                     `Following ${(1 / ratio).toFixed(1)}x more than follow you`;
  const ratioColor = ratio >= 1 ? T.tealLight : ratio >= 0.5 ? '#a0956b' : T.terra;

  const prev = snapshots.length >= 2 ? snapshots[1] : null;
  const prevRatio = prev ? (prev.data.followers.length / Math.max(prev.data.following.length, 1)) : null;
  const trend = prevRatio !== null ? (ratio > prevRatio ? 'improving' : ratio < prevRatio ? 'declining' : 'stable') : null;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      <div style={{ padding: '20px', borderRadius: 14, background: 'rgba(244,240,232,0.02)', border: '1px solid rgba(244,240,232,0.07)' }}>
        <div style={{ fontSize: 11, color: T.inkMute, fontFamily: T.mono, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Ratio</div>
        <div style={{ fontFamily: T.serif, fontSize: 40, letterSpacing: '-0.03em', lineHeight: 1, color: ratioColor }}>{ratio.toFixed(2)}</div>
        <div style={{ fontSize: 12, color: T.inkDim, marginTop: 8 }}>{ratioLabel}</div>
      </div>
      <div style={{ padding: '20px', borderRadius: 14, background: 'rgba(244,240,232,0.02)', border: '1px solid rgba(244,240,232,0.07)' }}>
        <div style={{ fontSize: 11, color: T.inkMute, fontFamily: T.mono, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Trend</div>
        {trend ? (
          <>
            <div style={{ fontFamily: T.serif, fontSize: 24, letterSpacing: '-0.02em', lineHeight: 1, color: trend === 'improving' ? T.tealLight : trend === 'declining' ? T.terra : T.inkDim }}>
              {trend === 'improving' ? 'Improving' : trend === 'declining' ? 'Declining' : 'Stable'}
            </div>
            <div style={{ fontSize: 12, color: T.inkMute, marginTop: 8 }}>
              Was {prevRatio?.toFixed(2)} in previous snapshot
            </div>
          </>
        ) : (
          <div style={{ fontSize: 13, color: T.inkMute, fontStyle: 'italic', marginTop: 4 }}>
            Upload a second snapshot to see trend.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();
  const snapshot = useSnapshotStore(s => s.currentSnapshot);
  const snapshots = useSnapshotList();

  useEffect(() => { if (!snapshot) router.replace('/'); }, [snapshot, router]);

  const nonFollowers = useMemo(() => {
    if (!snapshot) return [];
    const followerSet = new Set(snapshot.followers.map(f => f.username));
    return snapshot.following.filter(f => !followerSet.has(f.username));
  }, [snapshot]);

  if (!snapshot) return null;

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: T.sans }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 32px', borderBottom: '1px solid rgba(244,240,232,0.06)',
        position: 'sticky', top: 0, zIndex: 50,
        backdropFilter: 'blur(14px)', background: 'rgba(13,13,13,0.8)',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="/logo.png" alt="WhoUnfollowed" width={26} height={26} style={{ borderRadius: 7, objectFit: 'contain' }} />
          <span style={{ fontFamily: T.serif, fontSize: 17, color: T.ink }}>WhoUnfollowed</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, fontSize: 13 }}>
          <Link href="/results" style={{ color: T.inkDim, textDecoration: 'none' }}>Results</Link>
          <Link href="/history" style={{ color: T.inkDim, textDecoration: 'none' }}>History</Link>
        </div>
      </nav>

      <main style={{ maxWidth: 820, margin: '0 auto', padding: '48px 32px 80px' }}>
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.14em', marginBottom: 12 }}>RADAR</div>
          <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.03em', color: T.ink }}>
            The full picture.
          </h1>
          <p style={{ fontSize: 15, color: T.inkDim, marginTop: 10 }}>
            Export from {format(new Date(snapshot.exportedAt * 1000), 'MMM d, yyyy')}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 56 }}>
          {/* Follow ratio */}
          <section>
            <SectionHeader label="Follow ratio" sub="How your followers and following balance out." />
            <FollowRatio
              followers={snapshot.followers.length}
              following={snapshot.following.length}
              snapshots={snapshots as { exportedAt: number; data: { followers: unknown[]; following: unknown[] } }[]}
            />
          </section>

          {/* Follow age */}
          <section>
            <SectionHeader
              label="Follow age"
              count={nonFollowers.filter(a => a.followedAt !== null).length}
              sub="How long you've been following people who don't follow back."
            />
            <FollowAgeAnalysis nonFollowers={nonFollowers} />
          </section>

          {/* Pending requests */}
          <section>
            <SectionHeader
              label="Pending requests"
              count={snapshot.pendingRequests?.length}
              sub="Follow requests you've sent that haven't been accepted."
            />
            {snapshot.pendingRequests
              ? <PendingRequests accounts={snapshot.pendingRequests} />
              : <EmptyState text="Not found in this export. Re-download your data to include pending requests." />
            }
          </section>

          {/* Recently unfollowed */}
          <section>
            <SectionHeader
              label="Recently unfollowed"
              count={snapshot.recentlyUnfollowed?.length}
              sub="Accounts Instagram knows you recently unfollowed."
            />
            {snapshot.recentlyUnfollowed
              ? <RecentlyUnfollowed accounts={snapshot.recentlyUnfollowed} />
              : <EmptyState text="Not found in this export. Re-download your data to include this." />
            }
          </section>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
