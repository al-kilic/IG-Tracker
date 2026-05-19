'use client';

import { useMemo, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format, differenceInDays } from 'date-fns';
import { ExternalLink } from 'lucide-react';
import {
  RadialBarChart, RadialBar, PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, CartesianGrid, ReferenceLine,
} from 'recharts';
import { useSnapshotStore } from '@/lib/store';
import { LandingFooter } from '@/components/landing/FinalCTA';
import { T } from '@/components/landing/tokens';
import { useSnapshotList } from '@/hooks/useSnapshots';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Tutorial } from '@/components/Tutorial';

// ─── Design tokens ────────────────────────────────────────────────────────────

const CARD = {
  bg: 'var(--t-surface1)',
  border: '1px solid var(--t-border1)',
  radius: 16,
  pad: '24px',
};

// ─── Shared components ────────────────────────────────────────────────────────

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: CARD.bg, border: CARD.border, borderRadius: CARD.radius, padding: CARD.pad, ...style }}>
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 10, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6 }}>
      {children}
    </div>
  );
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontFamily: T.serif, fontSize: 20, fontWeight: 400, letterSpacing: '-0.02em', color: T.ink, marginBottom: 4 }}>
      {children}
    </h2>
  );
}


function IGLink({ href, username }: { href: string; username: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      style={{ color: T.inkMute, display: 'flex', alignItems: 'center', flexShrink: 0 }}
      onMouseEnter={e => (e.currentTarget.style.color = T.tealLight)}
      onMouseLeave={e => (e.currentTarget.style.color = T.inkMute)}
      aria-label={`Open @${username} on Instagram`}
    >
      <ExternalLink size={13} />
    </a>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div style={{ padding: '32px 16px', textAlign: 'center', fontSize: 13, color: T.inkMute, fontStyle: 'italic' }}>
      {text}
    </div>
  );
}

// ─── 1. Hero stats row ────────────────────────────────────────────────────────

function HeroStats({ followers, following, mutuals, nonFollowers }: {
  followers: number; following: number; mutuals: number; nonFollowers: number;
}) {
  const ratio = following === 0 ? 0 : followers / following;
  const nonFollowerPct = following === 0 ? 0 : Math.round((nonFollowers / following) * 100);

  const stats = [
    { value: followers.toLocaleString(),    label: 'Followers',        color: T.ink },
    { value: following.toLocaleString(),    label: 'Following',        color: T.ink },
    { value: mutuals.toLocaleString(),      label: 'Mutuals',          color: T.tealLight },
    { value: nonFollowers.toLocaleString(), label: 'Non-followers',    color: T.terra },
    { value: `${nonFollowerPct}%`,          label: 'No follow-back %', color: nonFollowerPct > 30 ? T.terra : '#a0956b' },
    { value: ratio.toFixed(2),             label: 'Follow ratio',      color: ratio >= 1 ? T.tealLight : '#a0956b' },
  ];

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6" style={{ gap: 10 }}>
      {stats.map(s => (
        <Card key={s.label} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div style={{ fontSize: 10, color: T.inkMute, fontFamily: T.mono, letterSpacing: '0.06em', textTransform: 'uppercase', height: 24, display: 'flex', alignItems: 'center', marginBottom: 10 }}>{s.label}</div>
          <div style={{ fontFamily: T.serif, fontSize: 26, lineHeight: 1, letterSpacing: '-0.02em', color: s.color }}>{s.value}</div>
        </Card>
      ))}
    </div>
  );
}

// ─── 2. Audience breakdown donut ──────────────────────────────────────────────

const LABEL_MAP: Record<string, string> = { ratio: 'Ratio', count: 'Accounts' };

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  const entry = payload[0];
  if (!entry) return null;
  const displayName = LABEL_MAP[entry.name] ?? entry.name;
  const displayValue = entry.name === 'ratio' ? entry.value.toFixed(2) : entry.value.toLocaleString();
  return (
    <div style={{ background: 'rgba(16,20,20,0.97)', border: '1px solid var(--t-border3)', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: T.inkDim }}>
      {label && <div style={{ color: T.inkMute, marginBottom: 4, fontSize: 11 }}>{label}</div>}
      <span style={{ color: T.ink }}>{displayName}</span>: {displayValue}
    </div>
  );
};

function AudienceBreakdown({ followers, mutuals, fans, nonFollowers }: {
  followers: number; mutuals: number; fans: number; nonFollowers: number;
}) {
  const data = [
    { name: 'Mutuals',          value: mutuals,      color: T.tealLight },
    { name: "Don't follow back", value: nonFollowers, color: T.terra },
    { name: 'Fans (follow you)', value: fans,         color: '#a0956b' },
  ].filter(d => d.value > 0);

  return (
    <Card style={{ display: 'flex', flexDirection: 'column' }}>
      <SectionLabel>Audience</SectionLabel>
      <CardTitle>Who follows you</CardTitle>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 16 }}>
        <ResponsiveContainer width={160} height={160}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={2} dataKey="value" strokeWidth={0}>
              {data.map((d, i) => <Cell key={i} fill={d.color} opacity={0.9} />)}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
          {data.map(d => (
            <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: T.inkDim, flex: 1 }}>{d.name}</span>
              <span style={{ fontSize: 13, fontFamily: T.mono, color: T.ink }}>{d.value.toLocaleString()}</span>
              <span style={{ fontSize: 11, fontFamily: T.mono, color: T.inkMute, width: 36, textAlign: 'right' }}>
                {followers > 0 ? `${Math.round((d.value / followers) * 100)}%` : '-'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

// ─── 3. Follow ratio radial ───────────────────────────────────────────────────

function RatioInfoTooltip() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <button
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen(o => !o)}
        aria-label="What is follow ratio?"
        style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 2,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: T.inkMute, lineHeight: 0,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.3"/>
          <path d="M8 7.2 V11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          <circle cx="8" cy="5.2" r="0.75" fill="currentColor"/>
        </svg>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
          marginTop: 8, width: 260, zIndex: 200,
          background: T.overlay, border: `1px solid ${T.overlayBorder}`,
          borderRadius: 12, padding: '14px 16px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
          pointerEvents: 'none',
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.ink, fontFamily: T.sans, marginBottom: 8 }}>
            What is follow ratio?
          </div>
          <p style={{ fontSize: 12, color: T.inkDim, lineHeight: 1.6, margin: '0 0 10px' }}>
            <strong style={{ color: T.ink }}>Followers ÷ Following.</strong> A ratio of 1.0 means equal. Above 1.0 means more people follow you than you follow back.
          </p>
          <p style={{ fontSize: 12, color: T.inkDim, lineHeight: 1.6, margin: '0 0 10px' }}>
            Most accounts have a ratio well below 1.0 - that&apos;s normal. A very low ratio (like 0.00) usually means you followed many accounts that never followed back.
          </p>
          <div style={{ fontSize: 11, color: T.tealMid, fontFamily: T.mono, fontWeight: 600, marginBottom: 4 }}>HOW TO IMPROVE IT</div>
          <p style={{ fontSize: 12, color: T.inkDim, lineHeight: 1.6, margin: 0 }}>
            Use the Results page to triage non-followers. Mark them as <em>Dropping</em> and unfollow them on Instagram. As your following count drops, the ratio rises.
          </p>
        </div>
      )}
    </div>
  );
}

function FollowRatioCard({ followers, following, snapshots }: {
  followers: number; following: number;
  snapshots: { exportedAt: number; data: { followers: { username: string }[]; following: { username: string }[] } }[];
}) {
  const ratio = following === 0 ? 0 : followers / following;
  const clampedPct = Math.min(ratio * 50, 100);
  const ratioColor = ratio >= 1 ? T.tealLight : ratio >= 0.5 ? '#a0956b' : T.terra;

  const trendData = snapshots
    .slice()
    .reverse()
    .filter(s => s.data.following.length > 0)
    .map(s => ({
      date: format(new Date(s.exportedAt * 1000), 'MMM d, HH:mm'),
      ratio: parseFloat((s.data.followers.length / s.data.following.length).toFixed(2)),
    }));

  const prev = snapshots[1];
  const prevRatio = prev ? prev.data.followers.length / Math.max(prev.data.following.length, 1) : null;
  const trend = prevRatio !== null ? (ratio > prevRatio ? '↑ Improving' : ratio < prevRatio ? '↓ Declining' : '→ Stable') : null;
  const trendColor = trend?.startsWith('↑') ? T.tealLight : trend?.startsWith('↓') ? T.terra : T.inkDim;

  const radialData = [{ value: clampedPct }];

  return (
    <Card style={{ display: 'flex', flexDirection: 'column' }}>
      <SectionLabel>Follow ratio</SectionLabel>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <CardTitle>Followers vs following</CardTitle>
        <RatioInfoTooltip />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 16 }}>
        <div style={{ position: 'relative', width: 120, height: 120, flexShrink: 0 }}>
          <ResponsiveContainer width={120} height={120}>
            <RadialBarChart innerRadius={40} outerRadius={56} startAngle={225} endAngle={-45} data={radialData} barSize={10}>
              <RadialBar dataKey="value" cornerRadius={5} fill={ratioColor} background={{ fill: 'var(--t-surface2)' }} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: T.serif, fontSize: 22, letterSpacing: '-0.02em', color: ratioColor, lineHeight: 1 }}>{ratio.toFixed(2)}</span>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 13, color: T.inkDim, lineHeight: 1.5, marginBottom: 8 }}>
            {ratio >= 1 ? `${ratio.toFixed(1)}x more followers than following.` : `Following ${(1 / ratio).toFixed(1)}x more than follow you.`}
          </p>
          {trend && <span style={{ fontSize: 12, fontFamily: T.mono, color: trendColor }}>{trend}</span>}
        </div>
      </div>
      {trendData.length >= 2 && (
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 10, color: T.inkMute, fontFamily: T.mono, marginBottom: 8, letterSpacing: '0.08em' }}>RATIO OVER TIME</div>
          <ResponsiveContainer width="100%" height={60}>
            <AreaChart data={trendData} margin={{ top: 2, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="ratioGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={T.tealMid} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={T.tealMid} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--t-surface2)" />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: T.inkMute }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: T.inkMute }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="ratio" stroke={T.tealMid} strokeWidth={1.5} fill="url(#ratioGrad)" dot={{ fill: T.tealMid, r: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}

// ─── 4. Follow age analysis ───────────────────────────────────────────────────

const AGE_BUCKETS = [
  { label: '< 1 month',   minDays: 0,   maxDays: 30,       color: T.tealLight },
  { label: '1–6 months',  minDays: 30,  maxDays: 180,      color: '#6db8bc' },
  { label: '6–12 months', minDays: 180, maxDays: 365,      color: '#a0956b' },
  { label: '1–2 years',   minDays: 365, maxDays: 730,      color: '#c07a50' },
  { label: '2+ years',    minDays: 730, maxDays: Infinity,  color: T.terra },
];

function FollowAgeCard({ nonFollowers }: { nonFollowers: { username: string; href: string; followedAt: number | null }[] }) {
  const now = Math.floor(Date.now() / 1000);
  const withTs = nonFollowers.filter(a => a.followedAt !== null);
  const [selectedBucket, setSelectedBucket] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!withTs.length) {
    return (
      <Card>
        <SectionLabel>Follow age</SectionLabel>
        <CardTitle>How long you&apos;ve been waiting</CardTitle>
        <EmptyState text="Timestamps not available in HTML exports. Re-download as JSON to unlock this." />
      </Card>
    );
  }

  const buckets = AGE_BUCKETS.map(b => {
    const accounts = withTs.filter(a => {
      const days = differenceInDays(now * 1000, (a.followedAt ?? 0) * 1000);
      return days >= b.minDays && days < b.maxDays;
    });
    return { ...b, count: accounts.length, accounts };
  });

  const longTenure = buckets.filter(b => b.minDays >= 365).reduce((s, b) => s + b.count, 0);
  const oldest = withTs.reduce((a, b) => (a.followedAt! < b.followedAt! ? a : b));
  const oldestDays = differenceInDays(now * 1000, (oldest.followedAt ?? 0) * 1000);
  const activeBucket = buckets.find(b => b.label === selectedBucket);

  return (
    <Card>
      <SectionLabel>Follow age</SectionLabel>
      <CardTitle>How long you&apos;ve been waiting</CardTitle>
      {/* Two stat boxes - distinct visual treatment */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 12, marginTop: 16, marginBottom: 20 }}>
        {/* Left: count box */}
        <div style={{
          padding: '18px 20px', borderRadius: 14,
          background: 'linear-gradient(135deg, rgba(168,75,47,0.1) 0%, rgba(168,75,47,0.04) 100%)',
          border: '1px solid rgba(168,75,47,0.25)',
        }}>
          <div style={{ fontSize: 11, color: 'rgba(168,75,47,0.7)', fontFamily: T.mono, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Long wait</div>
          <div style={{ fontFamily: T.serif, fontSize: 48, lineHeight: 1, letterSpacing: '-0.03em', color: T.terra }}>{longTenure.toLocaleString()}</div>
          <div style={{ fontSize: 12, color: T.inkMute, marginTop: 8, lineHeight: 1.4 }}>accounts you&apos;ve followed for 1+ year with no follow-back</div>
        </div>

        {/* Right: oldest profile card */}
        <div style={{
          padding: '18px 20px', borderRadius: 14,
          background: 'linear-gradient(135deg, rgba(160,149,107,0.08) 0%, var(--t-surface1) 100%)',
          border: '1px solid rgba(160,149,107,0.2)',
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          <div style={{ fontSize: 11, color: 'rgba(160,149,107,0.8)', fontFamily: T.mono, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Longest wait</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, rgba(160,149,107,0.3), rgba(168,75,47,0.2))',
              border: '1px solid rgba(160,149,107,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontWeight: 700, color: '#a0956b',
            }}>
              {oldest.username[0]?.toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: T.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>@{oldest.username}</div>
              <div style={{ fontSize: 11, color: T.inkMute, marginTop: 2 }}>followed {oldestDays} days ago - still waiting</div>
            </div>
            <span style={{
              flexShrink: 0, fontFamily: T.serif, fontSize: 22, color: '#a0956b', letterSpacing: '-0.02em',
            }}>{oldestDays}d</span>
          </div>
          <a
            href={oldest.href} target="_blank" rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '8px 14px', borderRadius: 9, textDecoration: 'none',
              fontSize: 12, fontWeight: 600, fontFamily: T.sans,
              background: 'rgba(168,75,47,0.12)', border: '1px solid rgba(168,75,47,0.3)',
              color: T.terra, transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(168,75,47,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(168,75,47,0.12)'; }}
          >
            <ExternalLink size={12} />
            Visit profile to unfollow
          </a>
        </div>
      </div>

      {/* Top 10 oldest - copyable list */}
      {(() => {
        const top10 = [...withTs]
          .sort((a, b) => (a.followedAt ?? 0) - (b.followedAt ?? 0))
          .slice(0, 10);
        const usernames = top10.map(a => `@${a.username}`).join('\n');
        return (
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: T.inkDim }}>
                Top {top10.length} oldest non-followers
              </span>
              <button
                onClick={() => {
                  void navigator.clipboard.writeText(usernames);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                style={{
                  fontSize: 11, fontFamily: T.mono, padding: '5px 14px', borderRadius: 20,
                  border: `1px solid var(--t-border3)`,
                  background: copied ? 'rgba(2,136,143,0.12)' : 'transparent',
                  color: copied ? T.tealLight : T.inkDim, cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                {copied ? '✓ Copied!' : 'Copy all usernames'}
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {top10.map((a, i) => {
                const days = differenceInDays(Date.now(), (a.followedAt ?? 0) * 1000);
                const intensity = Math.max(0.15, 1 - i * 0.08);
                return (
                  <a key={a.username} href={a.href} target="_blank" rel="noopener noreferrer" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    fontSize: 11, fontFamily: T.mono, padding: '4px 11px', borderRadius: 20,
                    background: `rgba(168,75,47,${intensity * 0.08})`,
                    border: `1px solid rgba(168,75,47,${intensity * 0.25})`,
                    color: T.inkDim, textDecoration: 'none', transition: 'all 0.15s',
                  }}>
                    @{a.username}
                    <span style={{ color: `rgba(168,75,47,${intensity * 0.8})`, fontSize: 10 }}>{days}d</span>
                  </a>
                );
              })}
            </div>
          </div>
        );
      })()}

      <p style={{
        fontSize: 12, marginBottom: 12, fontStyle: 'italic', fontWeight: 600,
        background: 'linear-gradient(90deg, #01696F, #6db8bc, #a0956b, #c07a50, #A84B2F, #01696F)',
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        animation: 'rainbow-shine 3s linear infinite',
      }}>
        Click a bar to see accounts
        <style>{`@keyframes rainbow-shine { 0% { background-position: 0% center } 100% { background-position: 200% center } }`}</style>
      </p>

      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={buckets} layout="vertical" margin={{ top: 0, right: 40, left: 0, bottom: 0 }}>
          <XAxis type="number" tick={{ fontSize: 10, fill: T.inkMute }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="label" tick={{ fontSize: 11, fill: T.inkDim }} axisLine={false} tickLine={false} width={80} />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="count"
            radius={[0, 4, 4, 0]}
            name="Accounts"
            style={{ cursor: 'pointer' }}
            onClick={(data: unknown) => {
              const label = (data as { label?: string } | null)?.label;
              setSelectedBucket(prev => prev === label ? null : (label ?? null));
            }}
          >
            {buckets.map((b, i) => (
              <Cell key={i} fill={b.color} opacity={selectedBucket === null || selectedBucket === b.label ? 0.85 : 0.25} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {activeBucket && activeBucket.accounts.length > 0 && (
        <div style={{ marginTop: 16, borderRadius: 10, border: `1px solid ${activeBucket.color}30`, overflow: 'hidden' }}>
          <div style={{ padding: '10px 14px', background: `${activeBucket.color}10`, borderBottom: `1px solid ${activeBucket.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, fontFamily: T.mono, color: activeBucket.color }}>{activeBucket.label} · {activeBucket.count} accounts</span>
            <button onClick={() => setSelectedBucket(null)} style={{ background: 'none', border: 'none', color: T.inkMute, cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>×</button>
          </div>
          <div style={{ maxHeight: 240, overflowY: 'auto' }}>
            {activeBucket.accounts.map((a, i) => {
              const days = differenceInDays(now * 1000, (a.followedAt ?? 0) * 1000);
              return (
                <div key={a.username} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px',
                  borderBottom: i < activeBucket.accounts.length - 1 ? '1px solid var(--t-surface2)' : 'none',
                }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--t-surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: T.inkDim, flexShrink: 0 }}>
                    {a.username[0]?.toUpperCase()}
                  </div>
                  <span style={{ fontSize: 13, color: T.ink, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>@{a.username}</span>
                  <span style={{ fontSize: 11, fontFamily: T.mono, color: T.inkMute, flexShrink: 0 }}>{days}d</span>
                  <IGLink href={a.href} username={a.username} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}

// ─── 5. Pending requests ──────────────────────────────────────────────────────

function pendingLabel(days: number | null, username: string): { text: string; color: string } | null {
  if (days === null) return null;
  const h = username.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  if (days >= 365) {
    const t = ['Year+ and nothing.', 'Ancient request.', 'Let it go.', 'They forgot.'];
    return { text: t[h % t.length]!, color: T.terra };
  }
  if (days >= 180) {
    const t = ['Half a year.', 'Six months ignored.', 'Long silence.', 'Probably never.'];
    return { text: t[h % t.length]!, color: T.terra };
  }
  if (days >= 90) {
    const t = ['They saw it.', 'No response.', 'Still waiting.', 'Ghosted.'];
    return { text: t[h % t.length]!, color: T.terra };
  }
  if (days >= 30) {
    const t = ['Probably not.', 'Going quiet.', 'Still pending.', 'No rush apparently.'];
    return { text: t[h % t.length]!, color: '#a0956b' };
  }
  return null;
}

function PendingRequestsCard({ accounts }: { accounts: { username: string; href: string; followedAt: number | null }[] }) {
  const now = Math.floor(Date.now() / 1000);
  const [activeBucket, setActiveBucket] = useState<string | null>(null);
  const byAge = (a: typeof accounts[0]) => differenceInDays(now * 1000, (a.followedAt ?? now) * 1000);
  const sorted = [...accounts].sort((a, b) => byAge(b) - byAge(a)); // oldest first

  type PBucket = { label: string; color: string; count: number; test: (days: number) => boolean };
  const buckets: PBucket[] = [
    { label: '90+ days',   color: T.terra,   count: 0, test: d => d >= 90 },
    { label: '30–90 days', color: '#a0956b', count: 0, test: d => d >= 30 && d < 90 },
    { label: '< 30 days',  color: T.tealMid, count: 0, test: d => d < 30 },
  ];
  buckets.forEach(b => { b.count = sorted.filter(a => b.test(byAge(a))).length; });

  // Sort: bucket accounts float to top, rest below — no filtering
  const displayAccounts = activeBucket
    ? (() => {
        const b = buckets.find(bk => bk.label === activeBucket);
        if (!b) return sorted;
        const inBucket  = sorted.filter(a => b.test(byAge(a)));
        const outBucket = sorted.filter(a => !b.test(byAge(a)));
        return [...inBucket, ...outBucket];
      })()
    : sorted;

  return (
    <Card>
      <SectionLabel>Pending requests</SectionLabel>
      <CardTitle>Sent, not accepted</CardTitle>

      {!accounts.length ? (
        <EmptyState text="Nobody keeping you waiting." />
      ) : (
        <>
          <div style={{ display: 'flex', gap: 8, margin: '16px 0' }}>
            {buckets.map(b => {
              const active = activeBucket === b.label;
              return (
                <button
                  key={b.label}
                  onClick={() => setActiveBucket(prev => prev === b.label ? null : b.label)}
                  title={`Filter by ${b.label}`}
                  style={{
                    flex: 1, padding: '10px 12px', borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                    background: active ? `${b.color}18` : 'var(--t-surface1)',
                    border: `1px solid ${active ? b.color : 'var(--t-border1)'}`,
                    boxShadow: active ? `0 0 0 1px ${b.color}30` : 'none',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ fontFamily: T.serif, fontSize: 24, color: b.color, letterSpacing: '-0.02em' }}>{b.count}</div>
                  <div style={{ fontSize: 10, color: active ? b.color : T.inkMute, marginTop: 4, fontFamily: T.mono }}>{b.label}</div>
                  <div style={{ fontSize: 9, color: active ? b.color : T.inkMute, fontFamily: T.mono, marginTop: 2, opacity: 0.65 }}>{active ? 'tap to reset' : 'sort to top'}</div>
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', borderRadius: 10, border: '1px solid var(--t-border1)', overflow: 'hidden', maxHeight: 280, overflowY: 'auto' }}>
            {displayAccounts.map((a, i) => {
              const days = a.followedAt ? differenceInDays(now * 1000, a.followedAt * 1000) : null;
              const flag = pendingLabel(days, a.username);
              return (
                <div key={a.username} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                  borderBottom: i < displayAccounts.length - 1 ? '1px solid var(--t-surface2)' : 'none',
                }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--t-surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: T.inkDim, flexShrink: 0 }}>
                    {a.username[0]?.toUpperCase()}
                  </div>
                  <span style={{ fontSize: 13, color: T.ink, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>@{a.username}</span>
                  {days !== null && <span style={{ fontSize: 11, fontFamily: T.mono, color: T.inkMute, flexShrink: 0 }}>{days}d</span>}
                  {flag && <span style={{ fontSize: 11, fontFamily: T.mono, color: flag.color, flexShrink: 0 }}>{flag.text}</span>}
                  <IGLink href={a.href} username={a.username} />
                </div>
              );
            })}
          </div>
        </>
      )}
    </Card>
  );
}

// ─── 6. Recently unfollowed ───────────────────────────────────────────────────

function RecentlyUnfollowedCard({ accounts }: { accounts: { username: string; href: string; followedAt: number | null }[] }) {
  return (
    <Card>
      <SectionLabel>Recently unfollowed</SectionLabel>
      <CardTitle>Your recent clean-up</CardTitle>
      {!accounts.length ? (
        <EmptyState text="Instagram didn't include this in your export." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', borderRadius: 10, border: '1px solid var(--t-border1)', overflow: 'hidden', marginTop: 16, maxHeight: 300, overflowY: 'auto' }}>
          {accounts.map((a, i) => (
            <div key={a.username} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
              borderBottom: i < accounts.length - 1 ? '1px solid var(--t-surface2)' : 'none',
            }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--t-surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: T.inkDim, flexShrink: 0 }}>
                {a.username[0]?.toUpperCase()}
              </div>
              <span style={{ fontSize: 13, color: T.ink, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>@{a.username}</span>
              {a.followedAt && (
                <span style={{ fontSize: 11, fontFamily: T.mono, color: T.inkMute, flexShrink: 0 }}>
                  {format(new Date(a.followedAt * 1000), 'MMM d, yyyy')}
                </span>
              )}
              <IGLink href={a.href} username={a.username} />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

// ─── 7. Account health score ─────────────────────────────────────────────────

function computeHealth({
  followers, following, mutuals, nonFollowers, snapshots,
}: {
  followers: number; following: number; mutuals: number; nonFollowers: number;
  snapshots: { data: { followers: { username: string }[]; following: { username: string }[] } }[];
}): { score: number; grade: string; color: string; breakdown: { label: string; score: number; max: number; note: string; action: string }[] } {
  const ratio        = following === 0 ? 0 : followers / following;
  const mutualPct    = following === 0 ? 0 : mutuals / following;
  const nonFollowerPct = following === 0 ? 0 : nonFollowers / following;


  // Component 1: Follow ratio (0–25)
  const ratioScore = ratio >= 2 ? 25 : ratio >= 1 ? 20 : ratio >= 0.5 ? 12 : ratio >= 0.3 ? 6 : 0;
  const ratioNote =
    ratio >= 2   ? `${ratio.toFixed(2)}x ratio - top tier. Followers outnumber following 2:1.` :
    ratio >= 1   ? `${ratio.toFixed(2)}x ratio - healthy. Unfollow non-followers to push toward 2x.` :
    ratio >= 0.5 ? `${ratio.toFixed(2)}x ratio - you follow more than follow you. Triage the list.` :
    ratio >= 0.3 ? `${ratio.toFixed(2)}x ratio - significantly one-sided. Needs a cleanup session.` :
                   `${ratio.toFixed(2)}x ratio - critical imbalance. Start with the oldest non-followers.`;
  const ratioAction =
    ratio >= 2   ? 'Maintain this.' :
    ratio >= 1   ? `Unfollow ${nonFollowers} non-followers → ratio hits ${((followers) / (following - nonFollowers)).toFixed(2)}x.` :
                   `Unfollowing non-followers alone pushes ratio to ${following - nonFollowers > 0 ? (followers / (following - nonFollowers)).toFixed(2) : '∞'}x.`;

  // Component 2: Mutual health (0–25)
  const mutualScore = mutualPct >= 0.7 ? 25 : mutualPct >= 0.5 ? 20 : mutualPct >= 0.3 ? 12 : mutualPct >= 0.1 ? 6 : 0;
  const mutualNote =
    mutualPct >= 0.7 ? `${Math.round(mutualPct * 100)}% mutual - elite account hygiene. Most follows are intentional.` :
    mutualPct >= 0.5 ? `${Math.round(mutualPct * 100)}% mutual - above average. A small cleanup hits the 70% threshold.` :
    mutualPct >= 0.3 ? `${Math.round(mutualPct * 100)}% mutual - below average. Half your following doesn't follow back.` :
    mutualPct >= 0.1 ? `${Math.round(mutualPct * 100)}% mutual - most follows aren't returned. Worth a full audit.` :
                       `${Math.round(mutualPct * 100)}% mutual - almost no reciprocation. Start triaging today.`;
  const mutualAction =
    mutualPct >= 0.7 ? 'Nothing to do here.' :
    `Remove ${Math.max(0, Math.ceil(following * (1 - 0.7)) - (following - mutuals))} one-sided follows → hits 70%.`;

  // Component 3: Non-follower rate (0–25)
  const nfScore = nonFollowerPct <= 0.1 ? 25 : nonFollowerPct <= 0.2 ? 20 : nonFollowerPct <= 0.35 ? 12 : nonFollowerPct <= 0.5 ? 6 : 0;
  const toHitTen = Math.max(0, nonFollowers - Math.floor(following * 0.1));
  const nfNote =
    nonFollowerPct <= 0.1 ? `Only ${Math.round(nonFollowerPct * 100)}% don't follow back - already elite.` :
    nonFollowerPct <= 0.2 ? `${Math.round(nonFollowerPct * 100)}% don't follow back. ${toHitTen} removals hit the <10% mark.` :
    nonFollowerPct <= 0.35? `${Math.round(nonFollowerPct * 100)}% don't follow back. Triage the list - quick wins are in there.` :
    nonFollowerPct <= 0.5 ? `${Math.round(nonFollowerPct * 100)}% don't follow back. Nearly half. This is the main thing to fix.` :
                             `${Math.round(nonFollowerPct * 100)}% don't follow back - over half. This is the #1 priority.`;
  const nfAction =
    nonFollowerPct <= 0.1 ? 'Maintain this.' :
    `Unfollow ${toHitTen} accounts → non-follower rate drops to 10% (A-grade threshold).`;

  // Component 4: Growth trend (0–25)
  let growthScore = 12;
  let growthDelta = 0;
  let growthPct = 0;
  if (snapshots.length >= 2) {
    const latest = snapshots[0]!.data.followers.length;
    const prev   = snapshots[1]!.data.followers.length;
    growthDelta  = latest - prev;
    growthPct    = prev === 0 ? 0 : growthDelta / prev;
    growthScore  = growthPct > 0.05 ? 25 : growthPct > 0 ? 20 : growthPct === 0 ? 15 : growthPct > -0.05 ? 8 : 0;
  }
  const growthNote =
    snapshots.length < 2  ? 'Only 1 snapshot - no trend to measure yet.' :
    growthScore === 25     ? `+${growthDelta} followers since last snapshot. Strong growth.` :
    growthScore === 20     ? `+${growthDelta} followers since last snapshot. Positive momentum.` :
    growthScore === 15     ? `No change since last snapshot. Neither growing nor declining.` :
    growthScore === 8      ? `${growthDelta} followers since last snapshot. Slight decline.` :
                              `${growthDelta} followers since last snapshot. Significant drop.`;
  const growthAction =
    snapshots.length < 2  ? 'Upload again in 2 weeks - then trend data unlocks.' :
    growthScore >= 20      ? 'Keep the cadence. Upload every 2 weeks to track momentum.' :
    growthScore === 15     ? 'Upload more snapshots to find your real pattern over time.' :
                              'Check who unfollowed in the Compare view - find the pattern.';

  const score = ratioScore + mutualScore + nfScore + growthScore;
  const grade = score >= 85 ? 'A' : score >= 70 ? 'B' : score >= 55 ? 'C' : score >= 40 ? 'D' : 'F';
  const color = score >= 85 ? T.tealLight : score >= 70 ? '#6db8bc' : score >= 55 ? '#a0956b' : score >= 40 ? '#c07a50' : T.terra;

  return {
    score, grade, color,
    breakdown: [
      { label: 'Follow ratio',    score: ratioScore,  max: 25, note: ratioNote,  action: ratioAction  },
      { label: 'Mutual health',   score: mutualScore, max: 25, note: mutualNote, action: mutualAction },
      { label: 'Non-follower %',  score: nfScore,     max: 25, note: nfNote,     action: nfAction     },
      { label: 'Growth trend',    score: growthScore, max: 25, note: growthNote, action: growthAction },
    ],
  };
}

function scoreColor(score: number, max: number): string {
  const pct = score / max;
  return pct >= 0.8 ? T.tealLight : pct >= 0.5 ? '#a0956b' : pct >= 0.25 ? '#c07a50' : T.terra;
}

function GradeRing({ score, grade, color }: { score: number; grade: string; color: string }) {
  const r = 52, cx = 68, cy = 68, sw = 7;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <svg width={136} height={136} viewBox="0 0 136 136" style={{ filter: `drop-shadow(0 0 18px ${color}40)` }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--t-border1)" strokeWidth={sw} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw}
        strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`} />
      <text x={cx} y={cy + 18} textAnchor="middle"
        fontSize={54} fontFamily={T.serif} fontWeight={700} fill={color}>
        {grade}
      </text>
      <text x={cx} y={cy + 36} textAnchor="middle"
        fontSize={11} fontFamily="monospace" fill="rgba(244,240,232,0.3)">
        {score}/100
      </text>
    </svg>
  );
}

function MiniRing({ score, max }: { score: number; max: number }) {
  const color = scoreColor(score, max);
  const r = 20, cx = 26, cy = 26, sw = 4;
  const circ = 2 * Math.PI * r;
  const dash = (score / max) * circ;
  return (
    <svg width={52} height={52} viewBox="0 0 52 52">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--t-border1)" strokeWidth={sw} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw}
        strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`} />
      <text x={cx} y={cy + 4} textAnchor="middle"
        fontSize={10} fontFamily="monospace" fontWeight={700} fill={color}>
        {score}/{max}
      </text>
    </svg>
  );
}

const BREAKDOWN_ICONS: Record<string, string> = {
  'Follow ratio': '⚖',
  'Mutual health': '↔',
  'Non-follower %': '⊘',
  'Growth trend': '↑',
};

function AccountHealthCard(props: {
  followers: number; following: number; mutuals: number; nonFollowers: number;
  snapshots: { data: { followers: { username: string }[]; following: { username: string }[] } }[];
}) {
  const { score, grade, color, breakdown } = computeHealth(props);

  const gradeDesc: Record<string, string> = {
    A: 'Top tier. Your account is clean, growing, and well-balanced.',
    B: 'One focused cleanup session pushes this to an A.',
    C: 'Average standing. Your non-follower list needs attention - start with the oldest.',
    D: 'Multiple signals need work. Open the triage list now.',
    F: 'Account health is critical. The triage list is your first priority today.',
  };

  return (
    <div style={{
      borderRadius: 20, overflow: 'hidden',
      background: `linear-gradient(135deg, ${T.bgCard} 0%, ${color}18 100%)`,
      border: `1px solid ${color}40`,
      boxShadow: `0 0 40px ${color}12`,
    }}>
      {/* Header strip */}
      <div style={{
        padding: '14px 24px', borderBottom: `1px solid ${T.border1}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 10, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.14em' }}>ACCOUNT HEALTH</span>
        <span style={{ fontSize: 11, fontFamily: T.mono, color: T.inkMute, fontStyle: 'italic' }}>{gradeDesc[grade]}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 0 }}>
        {/* Left: Grade ring */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '32px 24px', gap: 8,
          borderRight: `1px solid ${color}15`,
          background: `radial-gradient(circle at center, ${color}08 0%, transparent 70%)`,
        }}>
          <GradeRing score={score} grade={grade} color={color} />
          <div style={{
            fontSize: 11, fontFamily: T.mono, color: T.inkMute,
            textAlign: 'center', lineHeight: 1.5, maxWidth: 120,
          }}>
            {score >= 85 ? 'Top tier' : score >= 70 ? 'Above average' : score >= 55 ? 'Room to grow' : score >= 40 ? 'Needs work' : 'Critical'}
          </div>
        </div>

        {/* Right: 2x2 component grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
          {breakdown.map((b, i) => {
            const c = scoreColor(b.score, b.max);
            const isBottom = i >= breakdown.length - 2;
            const isRight  = i % 2 === 1;
            return (
              <div key={b.label} style={{
                padding: '16px 20px',
                borderBottom: !isBottom ? `1px solid var(--t-surface2)` : 'none',
                borderRight:  !isRight  ? `1px solid var(--t-surface2)` : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
              }}>
                {/* Label + note + action stacked */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 13, lineHeight: 1, flexShrink: 0 }}>{BREAKDOWN_ICONS[b.label]}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: T.inkDim, whiteSpace: 'nowrap' }}>{b.label}</span>
                  </div>
                  <span style={{ fontSize: 11, color: c, paddingLeft: 19, lineHeight: 1.5 }}>
                    {b.note}
                  </span>
                  <span style={{ fontSize: 10, fontFamily: T.mono, color: T.inkMute, paddingLeft: 19, lineHeight: 1.4, fontStyle: 'italic' }}>
                    → {b.action}
                  </span>
                </div>
                {/* Ring */}
                <MiniRing score={b.score} max={b.max} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── 8. Follower growth chart ─────────────────────────────────────────────────

type SnapshotSummary = { exportedAt: number; data: { followers: { username: string }[]; following: { username: string }[] } };

function GrowthChart({ snapshots }: { snapshots: SnapshotSummary[] }) {
  if (snapshots.length < 2) {
    return (
      <Card>
        <SectionLabel>Growth</SectionLabel>
        <CardTitle>Follower growth over time</CardTitle>
        <EmptyState text="Upload a second snapshot to see your growth trend." />
      </Card>
    );
  }

  const ordered = snapshots.slice().reverse();

  const data = ordered.map((s, i) => {
    const prev = ordered[i - 1];
    const followers = s.data.followers.length;
    const gained = prev ? Math.max(0, followers - prev.data.followers.length) : 0;
    const lost   = prev ? Math.max(0, prev.data.followers.length - followers) : 0;
    return {
      date: format(new Date(s.exportedAt * 1000), 'MMM d'),
      followers,
      gained,
      lost,
      net: gained - lost,
    };
  });

  const latest = data[data.length - 1]!;
  const prev   = data[data.length - 2]!;
  const netChange = latest.followers - prev.followers;
  const netColor  = netChange > 0 ? T.tealLight : netChange < 0 ? T.terra : T.inkDim;
  const netPrefix = netChange > 0 ? '+' : '';

  // Biggest drop
  const biggestDrop = data.reduce((max, d) => d.lost > max.lost ? d : max, { lost: 0, date: '', followers: 0, gained: 0, net: 0 });
  const showDropAlert = biggestDrop.lost >= 5;

  const GrowthTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string }[]; label?: string }) => {
    if (!active || !payload?.length) return null;
    const entry = data.find(d => d.date === label);
    return (
      <div style={{ background: 'rgba(16,20,20,0.97)', border: '1px solid var(--t-border3)', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: T.inkDim, minWidth: 160 }}>
        <div style={{ color: T.inkMute, marginBottom: 6, fontSize: 11 }}>{label}</div>
        <div style={{ color: T.ink, fontSize: 15, fontFamily: T.serif, marginBottom: 6 }}>{payload[0]?.value.toLocaleString()} followers</div>
        {entry && entry.gained > 0 && <div style={{ color: T.tealLight }}>+{entry.gained} gained</div>}
        {entry && entry.lost > 0  && <div style={{ color: T.terra }}>−{entry.lost} lost</div>}
      </div>
    );
  };

  return (
    <Card>
      <SectionLabel>Growth</SectionLabel>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
        <CardTitle>Follower growth over time</CardTitle>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: T.serif, fontSize: 28, letterSpacing: '-0.02em', color: netColor, lineHeight: 1 }}>
            {netPrefix}{netChange.toLocaleString()}
          </div>
          <div style={{ fontSize: 11, color: T.inkMute, fontFamily: T.mono, marginTop: 3 }}>since last snapshot</div>
        </div>
      </div>

      {showDropAlert && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 14px', borderRadius: 10, marginBottom: 16,
          background: 'rgba(168,75,47,0.08)', border: '1px solid rgba(168,75,47,0.2)',
          fontSize: 12, color: T.terra,
        }}>
          <span style={{ fontSize: 16 }}>⚠</span>
          <span>Biggest drop: <strong>{biggestDrop.date}</strong> - lost {biggestDrop.lost} followers in one period.</span>
        </div>
      )}

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={T.tealMid} stopOpacity={0.3} />
              <stop offset="95%" stopColor={T.tealMid} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--t-surface2)" />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: T.inkMute }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: T.inkMute }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
          <Tooltip content={<GrowthTooltip />} />
          {showDropAlert && (
            <ReferenceLine x={biggestDrop.date} stroke={T.terra} strokeDasharray="4 2" strokeOpacity={0.5} />
          )}
          <Area type="monotone" dataKey="followers" stroke={T.tealMid} strokeWidth={2} fill="url(#growthGrad)" dot={{ fill: T.tealMid, r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: T.tealLight }} />
        </AreaChart>
      </ResponsiveContainer>

      {/* Gained / lost summary row */}
      <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
        {data.slice(1).some(d => d.gained > 0) && (
          <div style={{ flex: 1, padding: '10px 14px', borderRadius: 10, background: 'rgba(2,136,143,0.06)', border: '1px solid rgba(2,136,143,0.15)' }}>
            <div style={{ fontSize: 20, fontFamily: T.serif, color: T.tealLight, letterSpacing: '-0.02em' }}>
              +{data.slice(1).reduce((s, d) => s + d.gained, 0).toLocaleString()}
            </div>
            <div style={{ fontSize: 11, color: T.inkMute, marginTop: 3 }}>total gained</div>
          </div>
        )}
        {data.slice(1).some(d => d.lost > 0) && (
          <div style={{ flex: 1, padding: '10px 14px', borderRadius: 10, background: 'rgba(168,75,47,0.06)', border: '1px solid rgba(168,75,47,0.15)' }}>
            <div style={{ fontSize: 20, fontFamily: T.serif, color: T.terra, letterSpacing: '-0.02em' }}>
              −{data.slice(1).reduce((s, d) => s + d.lost, 0).toLocaleString()}
            </div>
            <div style={{ fontSize: 11, color: T.inkMute, marginTop: 3 }}>total lost</div>
          </div>
        )}
      </div>
    </Card>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

function RadarModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const sections = [
    { icon: '⬡', title: 'Account Health Score', body: 'Radar calculates a single A–F grade from four signals: your follow ratio, how many of your following are mutual, your non-follower rate, and your growth trend over time. One letter that tells the whole story - and gives you something to improve.' },
    { icon: '↑', title: 'Follower Growth Over Time', body: 'Every time you upload a new Instagram export, Radar plots your follower count on a timeline. You can see exactly when you gained or lost followers, and which period had the biggest drop. It turns a static number into a story.' },
    { icon: '⧗', title: 'Follow Age Analysis', body: "Radar reads the timestamps in your export to tell you how long you've been following people who never followed back. Broken into buckets: under a month, 1–6 months, 6–12, 1–2 years, and 2+ years. The longer the wait, the colder the lead." },
    { icon: '◎', title: 'Audience Breakdown', body: 'Not all followers are equal. Radar splits your audience into Mutuals (both follow each other), Non-followers (you follow them, they don\'t follow back), and Fans (they follow you, you don\'t follow back). A donut chart makes it instant.' },
    { icon: '⏳', title: 'Pending Follow Requests', body: 'Instagram tracks every follow request you\'ve sent that hasn\'t been accepted. Radar surfaces them, sorted oldest-first. Requests over 30 days get flagged. Over 90 days: "They saw it." You decide what to do.' },
    { icon: '✓', title: 'Recently Unfollowed', body: 'Instagram logs every account you\'ve recently unfollowed. Radar shows it back to you - useful for confirming you already handled someone, or for seeing patterns in who you\'re cutting.' },
  ];

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(8,12,12,0.85)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'rgba(14,18,18,0.98)', border: '1px solid var(--t-border2)',
          borderRadius: 24, padding: '40px 44px', maxWidth: 680, width: '100%',
          maxHeight: '85vh', overflowY: 'auto',
          boxShadow: '0 40px 120px rgba(0,0,0,0.7)',
          position: 'relative',
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 20, right: 20, width: 32, height: 32,
            borderRadius: '50%', border: '1px solid var(--t-border3)',
            background: 'transparent', color: T.inkMute, cursor: 'pointer',
            fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >×</button>

        <div style={{ fontSize: 10, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.14em', marginBottom: 10 }}>RADAR</div>
        <h2 style={{ fontFamily: T.serif, fontSize: 36, fontWeight: 400, letterSpacing: '-0.03em', color: T.ink, marginBottom: 8 }}>
          What is Radar?
        </h2>
        <p style={{ fontSize: 15, color: T.inkDim, lineHeight: 1.6, marginBottom: 32 }}>
          Radar is the intelligence layer on top of your Instagram export. While the results page tells you <em>who</em> doesn&apos;t follow you back right now, Radar tells you the <strong style={{ color: T.ink }}>full story</strong> - trends, health, history, and context. It turns a static snapshot into an ongoing picture of your account.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {sections.map(s => (
            <div key={s.title} style={{
              display: 'flex', gap: 16,
              padding: '16px 18px', borderRadius: 14,
              background: 'var(--t-surface1)', border: '1px solid var(--t-border1)',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: 'rgba(2,136,143,0.1)', border: '1px solid rgba(2,136,143,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, color: T.tealLight,
              }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.ink, marginBottom: 5 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: T.inkDim, lineHeight: 1.6 }}>{s.body}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 28, padding: '14px 18px', borderRadius: 12, background: 'rgba(2,136,143,0.06)', border: '1px solid rgba(2,136,143,0.15)', fontSize: 13, color: T.inkDim, lineHeight: 1.6 }}>
          <strong style={{ color: T.tealLight }}>How to get more from Radar:</strong> Upload a new export every few weeks. Each upload adds a data point to your timeline, sharpens your growth trend, and improves the accuracy of your health score.
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const storeSnapshot = useSnapshotStore(s => s.currentSnapshot);
  const setSnapshot   = useSnapshotStore(s => s.setSnapshot);
  const snapshots     = useSnapshotList();
  const [radarModalOpen, setRadarModalOpen] = useState(false);
  const [loading, setLoading] = useState(!storeSnapshot);

  // If no in-memory snapshot, load the most recent one from DB
  useEffect(() => {
    if (storeSnapshot) { setLoading(false); return; }
    if (snapshots.length === 0) return; // still loading list
    const latest = snapshots[0];
    if (latest) {
      setSnapshot(latest.data);
      setLoading(false);
    } else {
      router.replace('/');
    }
  }, [storeSnapshot, snapshots, setSnapshot, router]);

  const snapshot = storeSnapshot;

  const { nonFollowers, fans, mutuals } = useMemo(() => {
    if (!snapshot) return { nonFollowers: [], fans: [], mutuals: [] };
    const followerSet = new Set(snapshot.followers.map(f => f.username));
    const followingSet = new Set(snapshot.following.map(f => f.username));
    return {
      nonFollowers: snapshot.following.filter(f => !followerSet.has(f.username)),
      fans: snapshot.followers.filter(f => !followingSet.has(f.username)),
      mutuals: snapshot.following.filter(f => followerSet.has(f.username)),
    };
  }, [snapshot]);

  if (loading || !snapshot) return (
    <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 13, color: T.inkMute, fontFamily: T.mono }}>Loading Radar…</div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: T.sans }}>
      {/* Nav */}
      <nav
        className="flex items-center justify-between px-4 sm:px-8 py-4 sticky top-0 z-50"
        style={{ borderBottom: '1px solid var(--t-border1)', backdropFilter: 'blur(14px)', background: 'var(--t-navBg)' }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="/logo.png" alt="WhoUnfollowed" width={26} height={26} style={{ borderRadius: 7, objectFit: 'contain' }} />
          <span style={{ fontFamily: T.serif, fontSize: 17, color: T.ink }}>WhoUnfollowed</span>
        </Link>
        <div className="flex items-center gap-4 sm:gap-6" style={{ fontSize: 13 }}>
          <Link href="/results" style={{ color: T.inkDim, textDecoration: 'none' }}>Snapshot</Link>
          <Link href="/history" className="hidden sm:inline" style={{ color: T.inkDim, textDecoration: 'none' }}>History</Link>
          <Link href="/"        className="hidden sm:inline" style={{ color: T.inkDim, textDecoration: 'none' }}>Home</Link>
          <ThemeToggle />
        </div>
      </nav>

      {radarModalOpen && <RadarModal onClose={() => setRadarModalOpen(false)} />}
      <Tutorial
        storageKey="ig-tracker:tutorial-radar"
        steps={[
          {
            title: 'Account health score',
            body: 'A grade from your follow ratio, non-follower %, and triage progress. Improves as you work the list.',
            targetSelector: '#tutorial-health',
          },
          {
            title: 'Growth chart',
            body: 'Upload a second export later and this fills in - followers gained, lost, and net change over time.',
            targetSelector: '#tutorial-growth',
          },
          {
            title: 'Audience breakdown',
            body: 'Your followers split into mutuals, fans, and non-followers - with a donut chart and follow ratio.',
            targetSelector: '#tutorial-audience',
          },
          {
            title: 'Follow age bars',
            body: 'How long you\'ve been following each non-follower. Tap a bar to expand it and see the accounts in that range.',
            targetSelector: '#tutorial-follow-age',
          },
          {
            title: 'Pending requests',
            body: 'Follow requests you sent that haven\'t been accepted yet - pulled from your export.',
            targetSelector: '#tutorial-pending',
          },
          {
            title: 'Recently unfollowed',
            body: 'Accounts in your previous export but not this one - they unfollowed you between uploads.',
            targetSelector: '#tutorial-pending',
          },
        ]}
      />

      <main className="px-4 sm:px-8 py-8 sm:py-12 pb-20" style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 10, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.14em' }}>RADAR</span>
              <span style={{ fontSize: 10, color: T.inkMute, fontFamily: T.mono }}>· {format(new Date(snapshot.exportedAt * 1000), 'MMM d, yyyy')}</span>
            </div>
            <button
              onClick={() => setRadarModalOpen(true)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 14px', borderRadius: 20, cursor: 'pointer',
                fontSize: 12, fontFamily: T.mono, fontWeight: 500,
                background: 'transparent',
                border: '1px solid rgba(2,136,143,0.3)',
                color: T.tealLight, transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(2,136,143,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M7 6.5V10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                <circle cx="7" cy="4.5" r="0.7" fill="currentColor"/>
              </svg>
              What is Radar?
            </button>
          </div>
          <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.03em', color: T.ink }}>
            The full picture.
          </h1>
          <p style={{ fontSize: 14, color: T.inkDim, marginTop: 8 }}>
            {snapshot.followers.length.toLocaleString()} followers · {snapshot.following.length.toLocaleString()} following · {nonFollowers.length.toLocaleString()} don&apos;t follow back
          </p>
        </div>

        {/* Health score */}
        <div id="tutorial-health" style={{ marginBottom: 16 }}>
          <AccountHealthCard
            followers={snapshot.followers.length}
            following={snapshot.following.length}
            mutuals={mutuals.length}
            nonFollowers={nonFollowers.length}
            snapshots={snapshots as SnapshotSummary[]}
          />
        </div>

        {/* Hero stats */}
        <div style={{ marginBottom: 16 }}>
          <HeroStats
            followers={snapshot.followers.length}
            following={snapshot.following.length}
            mutuals={mutuals.length}
            nonFollowers={nonFollowers.length}
          />
        </div>

        {/* Growth chart */}
        <div id="tutorial-growth" style={{ marginBottom: 16 }}>
          <GrowthChart snapshots={snapshots as SnapshotSummary[]} />
        </div>

        {/* Row 1: Audience donut + Follow ratio */}
        <div id="tutorial-audience" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <AudienceBreakdown
            followers={snapshot.followers.length}
            mutuals={mutuals.length}
            fans={fans.length}
            nonFollowers={nonFollowers.length}
          />
          <FollowRatioCard
            followers={snapshot.followers.length}
            following={snapshot.following.length}
            snapshots={snapshots as SnapshotSummary[]}
          />
        </div>

        {/* Follow age full width */}
        <div id="tutorial-follow-age" style={{ marginBottom: 16 }}>
          <FollowAgeCard nonFollowers={nonFollowers} />
        </div>

        {/* Pending + Recently unfollowed */}
        <div id="tutorial-pending" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <PendingRequestsCard accounts={snapshot.pendingRequests ?? []} />
          <RecentlyUnfollowedCard accounts={snapshot.recentlyUnfollowed ?? []} />
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
