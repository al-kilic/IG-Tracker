'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, X, Minus } from 'lucide-react';
import { T } from '@/components/landing/tokens';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LandingFooter } from '@/components/landing/FinalCTA';

// ── Competitors ───────────────────────────────────────────────────────────────

const COMPETITORS = [
  { id: 'us',          name: 'WhoUnfollowed',              highlight: true  },
  { id: 'fau',         name: 'Followers & Unfollowers',    highlight: false },
  { id: 'followmeter', name: 'FollowMeter',                highlight: false },
  { id: 'unfollowers', name: 'Unfollowers for Instagram',  highlight: false },
  { id: 'reportplus',  name: 'Reports+',                   highlight: false },
];

type Val = true | false | 'partial' | string;

interface FeatureRow {
  label: string;
  tooltip?: string;
  values: Val[]; // order matches COMPETITORS
}

interface FeatureGroup {
  category: string;
  rows: FeatureRow[];
}

const FEATURES: FeatureGroup[] = [
  {
    category: 'Privacy & Safety',
    rows: [
      { label: 'No password required',              values: [true,  false, false, false, false] },
      { label: 'Data stays on your device',          values: [true,  false, false, false, false] },
      { label: 'Zero account ban risk',              values: [true,  false, false, false, false] },
      { label: 'Open source & auditable',            values: [true,  false, false, false, false] },
      { label: 'Works in browser, no app needed',    values: [true,  false, false, false, false] },
    ],
  },
  {
    category: 'Core Features',
    rows: [
      { label: 'Full non-followers list',            values: [true,  true,  true,  true,  true]  },
      { label: 'Who unfollowed you',                 values: [true,  true,  true,  true,  'paid'] },
      { label: 'New followers detected',             values: [true,  true,  true,  true,  true]  },
      { label: 'Fans list',                          values: [true,  true,  true,  true,  'paid'] },
      { label: 'Mutual follows',                     values: [true,  true,  true,  true,  true]  },
      { label: 'CSV export',                         values: [true,  false, 'paid', false, 'paid'] },
      { label: 'Free tier',                          values: [true,  true,  true,  true,  true]  },
      { label: 'No signup required',                 values: [true,  false, false, false, false] },
    ],
  },
  {
    category: 'Advanced Analytics',
    rows: [
      { label: 'Snapshot history & comparison',      values: [true,  false, 'paid', false, 'paid'] },
      { label: 'Triage workflow',                    values: [true,  false, false, false, false] },
      { label: 'Follow age analysis',                values: [true,  false, false, false, false] },
      { label: 'Account health score',               values: [true,  false, false, false, false] },
      { label: 'Growth charts',                      values: [true,  false, 'paid', false, 'paid'] },
      { label: 'Pending requests shown',             values: [true,  false, false, false, false] },
    ],
  },
  {
    category: 'Platform & Pricing',
    rows: [
      { label: 'Web app',                            values: [true,  false, false, false, false] },
      { label: 'iOS app',                            values: ['soon', true, true,  true,  true]  },
      { label: 'Android app',                        values: ['soon', true, true,  true,  true]  },
      { label: 'Full list on free plan',             values: [true,  'partial', 'partial', 'partial', false] },
      { label: 'Monthly price',                      values: ['$4.99', '$2.99', '$3.49', '$1.99', '$4.49'] },
    ],
  },
];

// ── Cell renderer ─────────────────────────────────────────────────────────────

function Cell({ val, highlight }: { val: Val; highlight: boolean }) {
  const base: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '13px 10px', fontSize: 12, fontFamily: T.mono,
    borderRight: `1px solid ${T.border1}`,
    background: highlight ? 'rgba(2,136,143,0.04)' : 'transparent',
    minWidth: 0,
  };

  if (val === true)  return <div style={base}><span style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(2,136,143,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={12} color={T.tealMid} strokeWidth={2.5} /></span></div>;
  if (val === false) return <div style={base}><span style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(168,75,47,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={11} color={T.terra} strokeWidth={2.5} /></span></div>;
  if (val === 'partial' || val === 'limited') return <div style={base}><span style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(160,149,107,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Minus size={11} color="#a0956b" strokeWidth={2.5} /></span></div>;
  if (val === 'paid')  return <div style={{ ...base, color: '#a0956b' }}>Paid</div>;
  if (val === 'soon')  return <div style={{ ...base, color: T.terra }}>Soon</div>;
  return <div style={{ ...base, color: T.inkDim }}>{val}</div>;
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ComparePage() {
  const headerRef = useRef<HTMLDivElement>(null);
  const scrollRef  = useRef<HTMLDivElement>(null);

  const syncScroll = () => {
    if (headerRef.current && scrollRef.current) {
      headerRef.current.scrollLeft = scrollRef.current.scrollLeft;
    }
  };

  const COL = `240px repeat(${COMPETITORS.length}, minmax(120px, 1fr))`;


  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: T.sans }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: `1px solid ${T.border1}`, position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(14px)', background: T.navBg }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="/logo.png" alt="WhoUnfollowed" width={26} height={26} style={{ borderRadius: 7, objectFit: 'contain' }} />
          <span style={{ fontFamily: T.serif, fontSize: 17, color: T.ink }}>WhoUnfollowed</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/" style={{ fontSize: 13, color: T.inkDim, textDecoration: 'none' }}>Home</Link>
          <ThemeToggle />
        </div>
      </nav>

      <main style={{ paddingBottom: 80 }}>
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="px-4 sm:px-8" style={{ maxWidth: 760, margin: '0 auto', paddingTop: 52, paddingBottom: 48, textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 14 }}>Compare</div>
          <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 400, letterSpacing: '-0.03em', color: T.ink, marginBottom: 14 }}>
            WhoUnfollowed vs every other Instagram tracker.
          </h1>
          <p style={{ fontSize: 15, color: T.inkDim, lineHeight: 1.65, maxWidth: 560, margin: '0 auto 28px' }}>
            Every other app in this space asks for your Instagram password. That is not a coincidence — your credentials are part of their business model. Here is the full breakdown.
          </p>
        </motion.div>

        {/* Sticky column headers — outside scroll container so position:sticky works */}
        <div style={{ position: 'sticky', top: 65, zIndex: 50, overflow: 'hidden', background: T.bg, boxShadow: `0 2px 12px rgba(0,0,0,0.08)` }}>
          <div ref={headerRef} style={{ minWidth: 1040, padding: '0 24px', display: 'grid', gridTemplateColumns: COL, borderBottom: `2px solid ${T.border2}`, pointerEvents: 'none', userSelect: 'none' }}>
            <div style={{ padding: '13px 14px', fontSize: 11, color: T.inkMute, fontFamily: T.mono, letterSpacing: '0.08em', borderRight: `1px solid ${T.border1}` }}>FEATURE</div>
            {COMPETITORS.map(c => (
              <div key={c.id} style={{
                padding: '12px 10px', textAlign: 'center',
                borderRight: `1px solid ${T.border1}`,
                background: c.highlight ? 'rgba(2,136,143,0.07)' : T.bg,
                borderTop: c.highlight ? `2px solid ${T.tealMid}` : `2px solid transparent`,
                marginTop: c.highlight ? -2 : 0,
              }}>
                {c.highlight && <div style={{ fontSize: 8, color: T.tealMid, fontFamily: T.mono, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 }}>You are here</div>}
                <div style={{ fontSize: 11, fontWeight: c.highlight ? 700 : 500, color: c.highlight ? T.tealLight : T.inkDim, fontFamily: T.sans, lineHeight: 1.2 }}>{c.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Table body — scrolls horizontally, syncs header */}
        <div ref={scrollRef} onScroll={syncScroll} style={{ overflowX: 'auto', paddingBottom: 32, WebkitOverflowScrolling: 'touch' }}>
          <div style={{ minWidth: 1040, padding: '0 24px' }}>

            {/* Feature groups */}
            {FEATURES.map((group, _gi) => (
              <div key={group.category}>
                {/* Category header */}
                <div style={{
                  display: 'grid', gridTemplateColumns: COL,
                  background: T.bgPanel,
                  borderTop: `2px solid ${T.border2}`,
                  borderBottom: `1px solid ${T.border2}`,
                }}>
                  <div style={{ padding: '8px 16px', fontSize: 10, fontWeight: 700, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.14em', textTransform: 'uppercase', borderRight: `1px solid ${T.border1}` }}>
                    {group.category}
                  </div>
                  {COMPETITORS.map(c => (
                    <div key={c.id} style={{ borderRight: `1px solid ${T.border1}`, background: c.highlight ? 'rgba(2,136,143,0.05)' : 'transparent' }} />
                  ))}
                </div>

                {/* Feature rows — zebra striped for readability */}
                {group.rows.map((row, ri) => (
                  <div
                    key={row.label}
                    style={{
                      display: 'grid', gridTemplateColumns: COL,
                      borderBottom: `1px solid ${T.border1}`,
                      background: ri % 2 === 0 ? 'transparent' : T.surface1,
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = `rgba(2,136,143,0.04)`)}
                    onMouseLeave={e => (e.currentTarget.style.background = ri % 2 === 0 ? 'transparent' : T.surface1)}
                  >
                    <div style={{ padding: '10px 16px', fontSize: 13, color: T.ink, borderRight: `1px solid ${T.border1}`, display: 'flex', alignItems: 'center', lineHeight: 1.3 }}>
                      {row.label}
                    </div>
                    {COMPETITORS.map((c, ci) => (
                      <Cell key={c.id} val={row.values[ci] ?? false} highlight={c.highlight} />
                    ))}
                  </div>
                ))}
              </div>
            ))}

            {/* CTA row */}
            <div style={{ display: 'grid', gridTemplateColumns: COL, borderTop: `2px solid ${T.border2}`, background: T.surface1 }}>
              <div style={{ padding: '20px 16px', borderRight: `1px solid ${T.border1}`, display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: T.inkMute, fontFamily: T.mono }}>Get started</span>
              </div>
              {COMPETITORS.map(c => (
                <div key={c.id} style={{ padding: '16px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: `1px solid ${T.border1}`, background: c.highlight ? 'rgba(2,136,143,0.06)' : 'transparent' }}>
                  {c.highlight ? (
                    <Link href="/" style={{ padding: '8px 16px', borderRadius: 9, background: T.teal, color: T.cream, fontSize: 12, fontWeight: 600, textDecoration: 'none', fontFamily: T.sans, whiteSpace: 'nowrap', boxShadow: `0 4px 16px ${T.tealGlow}` }}>
                      Try free →
                    </Link>
                  ) : (
                    <span style={{ fontSize: 11, color: T.inkMute, fontFamily: T.mono }}>requires login</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div style={{ padding: '14px 24px', display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap' }}>
          {[
            { icon: '✓', color: T.tealMid, bg: 'rgba(2,136,143,0.12)', label: 'Available' },
            { icon: '×', color: T.terra,   bg: 'rgba(168,75,47,0.1)',  label: 'Not available' },
            { icon: '–', color: '#a0956b', bg: 'rgba(160,149,107,0.12)', label: 'Limited' },
          ].map(item => (
            <span key={item.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: T.inkMute, fontFamily: T.mono }}>
              <span style={{ width: 16, height: 16, borderRadius: '50%', background: item.bg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: item.color, fontWeight: 700, flexShrink: 0 }}>{item.icon}</span>
              {item.label}
            </span>
          ))}
        </div>

        {/* Individual comparison links */}
        <div className="px-4 sm:px-8" style={{ maxWidth: 760, margin: '0 auto', paddingTop: 16 }}>
          <div style={{ fontSize: 12, color: T.inkMute, fontFamily: T.mono, marginBottom: 12 }}>Detailed comparisons:</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {[
              { label: 'vs Followers & Unfollowers', slug: 'whounfollowed-vs-followers-unfollowers' },
              { label: 'vs FollowMeter',             slug: 'whounfollowed-vs-followmeter' },
              { label: 'vs Unfollowers for Instagram', slug: 'whounfollowed-vs-unfollowers-instagram' },
            ].map(l => (
              <Link key={l.slug} href={`/compare/${l.slug}`} style={{ fontSize: 12, color: T.tealLight, textDecoration: 'none', padding: '5px 12px', borderRadius: 20, border: `1px solid rgba(2,136,143,0.2)`, background: 'rgba(2,136,143,0.04)', fontFamily: T.mono }}>
                {l.label} →
              </Link>
            ))}
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
