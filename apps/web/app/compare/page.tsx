'use client';

import React from 'react';
import Link from 'next/link';
import { T } from '@/components/landing/tokens';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LandingFooter } from '@/components/landing/FinalCTA';
import { COMPARISONS } from './comparisons';

export default function ComparePage() {
  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: T.sans }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: `1px solid ${T.border1}`, position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(14px)', background: T.navBg }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="/logo.png" alt="WhoUnfollowed" width={26} height={26} style={{ borderRadius: 7, objectFit: 'contain' }} />
          <span style={{ fontFamily: T.serif, fontSize: 17, color: T.ink }}>WhoUnfollowed</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/" style={{ fontSize: 13, color: T.inkDim, textDecoration: 'none' }}>Home</Link>
          <ThemeToggle />
        </div>
      </nav>

      <main className="px-4 sm:px-8" style={{ maxWidth: 720, margin: '0 auto', paddingTop: 56, paddingBottom: 80 }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 10, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 14 }}>Compare</div>
          <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 400, letterSpacing: '-0.03em', color: T.ink, marginBottom: 12 }}>
            WhoUnfollowed vs every other tracker.
          </h1>
          <p style={{ fontSize: 15, color: T.inkDim, lineHeight: 1.6 }}>
            Every popular Instagram follower tracker asks for your password. That is not a coincidence. Here is how WhoUnfollowed is different — and why it matters.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {COMPARISONS.map(c => (
            <Link
              key={c.slug}
              href={`/compare/${c.slug}`}
              style={{ textDecoration: 'none', display: 'block', padding: '22px', borderRadius: 16, background: T.surface1, border: `1px solid ${T.border1}`, transition: 'border-color 0.15s' }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.style.borderColor = T.border3}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.style.borderColor = T.border1}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: T.inkMute, fontFamily: T.mono, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                    WhoUnfollowed vs
                  </div>
                  <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(18px, 3vw, 22px)', fontWeight: 400, color: T.ink, letterSpacing: '-0.01em', marginBottom: 8 }}>
                    {c.competitorName}
                  </h2>
                  <p style={{ fontSize: 13, color: T.inkDim, lineHeight: 1.6, margin: 0 }}>{c.excerpt}</p>
                </div>
                <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
                  <div style={{ fontSize: 11, color: T.tealLight, fontWeight: 600 }}>WhoUnfollowed</div>
                  <div style={{ fontSize: 11, color: T.terra }}>requires password</div>
                </div>
              </div>
              <div style={{ marginTop: 14, fontSize: 13, color: T.tealLight, fontWeight: 500 }}>See full comparison →</div>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: 48, padding: '24px', borderRadius: 16, background: 'rgba(2,136,143,0.06)', border: '1px solid rgba(2,136,143,0.2)', textAlign: 'center' }}>
          <p style={{ fontSize: 15, color: T.ink, fontWeight: 500, marginBottom: 8 }}>Ready to see who actually stopped following you?</p>
          <p style={{ fontSize: 14, color: T.inkDim, marginBottom: 20 }}>No password. No server. No ban risk.</p>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', borderRadius: 11, background: T.teal, color: T.cream, fontSize: 13, fontWeight: 600, textDecoration: 'none', fontFamily: T.sans, boxShadow: `0 6px 20px ${T.tealGlow}` }}>
            Try WhoUnfollowed free →
          </Link>
        </div>

        <div style={{ marginTop: 40, paddingTop: 24, borderTop: `1px solid ${T.border1}` }}>
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

import React from 'react';
