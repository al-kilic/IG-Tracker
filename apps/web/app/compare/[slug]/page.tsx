'use client';

import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { T } from '@/components/landing/tokens';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LandingFooter } from '@/components/landing/FinalCTA';
import { getComparison, COMPARISONS } from '../comparisons';
import { Icon } from '@/components/landing/atoms';

export default function ComparePage({ params }: { params: { slug: string } }) {
  const c = getComparison(params.slug);
  if (!c) notFound();

  const others = COMPARISONS.filter(x => x.slug !== c.slug);

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: T.sans }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: `1px solid ${T.border1}`, position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(14px)', background: T.navBg }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="/logo.png" alt="WhoUnfollowed" width={26} height={26} style={{ borderRadius: 7, objectFit: 'contain' }} />
          <span style={{ fontFamily: T.serif, fontSize: 17, color: T.ink }}>WhoUnfollowed</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/compare" style={{ fontSize: 13, color: T.inkDim, textDecoration: 'none' }}>Compare</Link>
          <ThemeToggle />
        </div>
      </nav>

      <main className="px-4 sm:px-8" style={{ maxWidth: 720, margin: '0 auto', paddingTop: 56, paddingBottom: 80 }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <Link href="/compare" style={{ fontSize: 12, color: T.inkMute, fontFamily: T.mono, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
            <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><path d="M11 7 H3 M3 7 L6 4 M3 7 L6 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            All comparisons
          </Link>
          <div style={{ fontSize: 10, color: T.inkMute, fontFamily: T.mono, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
            WhoUnfollowed vs
          </div>
          <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(26px, 5vw, 42px)', fontWeight: 400, letterSpacing: '-0.03em', color: T.ink, marginBottom: 14 }}>
            {c.competitorName}
          </h1>
          <p style={{ fontSize: 15, color: T.inkDim, lineHeight: 1.65 }}>{c.excerpt}</p>
        </div>

        {/* Comparison table */}
        <div style={{ borderRadius: 16, border: `1px solid ${T.border1}`, overflow: 'hidden', marginBottom: 40 }}>
          <div className="grid grid-cols-3" style={{ background: T.surface1, borderBottom: `1px solid ${T.border1}` }}>
            <div style={{ padding: '12px 16px', fontSize: 11, color: T.inkMute, fontFamily: T.mono, letterSpacing: '0.08em' }}>Feature</div>
            <div style={{ padding: '12px 16px', fontSize: 11, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.08em', textAlign: 'center', borderLeft: `1px solid ${T.border1}` }}>WhoUnfollowed</div>
            <div style={{ padding: '12px 16px', fontSize: 11, color: T.terra, fontFamily: T.mono, letterSpacing: '0.08em', textAlign: 'center', borderLeft: `1px solid ${T.border1}` }}>{c.competitorName}</div>
          </div>
          {c.rows.map((row, i) => (
            <div key={row.feature} className="grid grid-cols-3" style={{ borderBottom: i < c.rows.length - 1 ? `1px solid ${T.border1}` : 'none' }}>
              <div style={{ padding: '12px 16px', fontSize: 13, color: T.inkDim }}>{row.feature}</div>
              {[row.us, row.them].map((val, ci) => (
                <div key={ci} style={{ padding: '12px 16px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderLeft: `1px solid ${T.border1}` }}>
                  {val
                    ? <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(2,136,143,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon.check size={13} color={T.tealMid} /></span>
                    : <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(168,75,47,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon.x size={11} color={T.terra} /></span>
                  }
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Body */}
        <article style={{ marginBottom: 40 }}>
          {c.body.split('\n\n').map((para, i) => (
            <p key={i} style={{ fontSize: 15, color: T.inkDim, lineHeight: 1.75, marginBottom: 18 }}>{para}</p>
          ))}
        </article>

        {/* Verdict */}
        <div style={{ padding: '20px 22px', borderRadius: 14, background: T.surface1, border: `1px solid ${T.border2}`, marginBottom: 32 }}>
          <div style={{ fontSize: 10, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Verdict</div>
          <p style={{ fontSize: 15, color: T.ink, lineHeight: 1.65, margin: 0 }}>{c.verdict}</p>
        </div>

        {/* CTA */}
        <div style={{ padding: '24px', borderRadius: 16, background: 'rgba(2,136,143,0.06)', border: '1px solid rgba(2,136,143,0.2)', textAlign: 'center', marginBottom: 48 }}>
          <p style={{ fontSize: 14, color: T.inkDim, marginBottom: 16 }}>{c.cta}</p>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', borderRadius: 11, background: T.teal, color: T.cream, fontSize: 13, fontWeight: 600, textDecoration: 'none', fontFamily: T.sans, boxShadow: `0 6px 20px ${T.tealGlow}` }}>
            Try WhoUnfollowed free →
          </Link>
        </div>

        {/* Other comparisons */}
        {others.length > 0 && (
          <div>
            <div style={{ fontSize: 10, color: T.inkMute, fontFamily: T.mono, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>More comparisons</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {others.map(o => (
                <Link key={o.slug} href={`/compare/${o.slug}`} style={{ textDecoration: 'none', padding: '14px 18px', borderRadius: 12, background: T.surface1, border: `1px solid ${T.border1}`, display: 'block' }}
                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.style.borderColor = T.border3}
                  onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.style.borderColor = T.border1}>
                  <div style={{ fontSize: 10, color: T.inkMute, fontFamily: T.mono, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>WhoUnfollowed vs</div>
                  <div style={{ fontSize: 15, color: T.ink, fontFamily: T.serif }}>{o.competitorName} →</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <LandingFooter />
    </div>
  );
}
