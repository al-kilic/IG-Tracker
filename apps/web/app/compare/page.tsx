'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, ShieldX } from 'lucide-react';
import { T } from '@/components/landing/tokens';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LandingFooter } from '@/components/landing/FinalCTA';
import { COMPARISONS } from './comparisons';

const CARD_ACCENTS = [
  { gradient: 'linear-gradient(135deg, #1a0e0a 0%, #3d1f10 50%, #6b3520 100%)', accent: '#c07a50' },
  { gradient: 'linear-gradient(135deg, #0a1218 0%, #1a2d3d 50%, #2a4a62 100%)', accent: '#5a9ab5' },
  { gradient: 'linear-gradient(135deg, #0e180a 0%, #243d14 50%, #3d6620 100%)', accent: '#7ab55a' },
];

function CompareCard({ comparison, index }: { comparison: typeof COMPARISONS[0]; index: number }) {
  const [hovered, setHovered] = React.useState(false);
  const accent = CARD_ACCENTS[index % CARD_ACCENTS.length]!;

  const positiveCount = comparison.rows.filter(r => r.us && !r.them).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/compare/${comparison.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            borderRadius: 20,
            overflow: 'hidden',
            border: `1px solid ${hovered ? 'rgba(2,136,143,0.45)' : T.border1}`,
            background: T.bgCard,
            boxShadow: hovered ? `0 20px 60px rgba(0,0,0,0.2), 0 0 0 1px rgba(2,136,143,0.1)` : '0 2px 12px rgba(0,0,0,0.06)',
            transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
            transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
          }}
        >
          {/* Visual header */}
          <div style={{ position: 'relative', height: 140, background: accent.gradient, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.06) 0%, transparent 50%)' }} />

            {/* VS badge */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ fontSize: 13, fontFamily: T.mono, color: 'rgba(255,255,255,0.9)', fontWeight: 700, letterSpacing: '0.04em' }}>WhoUnfollowed</div>
              <div style={{ fontSize: 10, fontFamily: T.mono, color: 'rgba(255,255,255,0.4)', fontWeight: 600, padding: '3px 8px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.2)' }}>VS</div>
              <div style={{ fontSize: 13, fontFamily: T.mono, color: 'rgba(255,255,255,0.55)', fontWeight: 700, letterSpacing: '0.04em' }}>{comparison.competitorName}</div>
            </div>

            {/* Advantage count */}
            <div style={{ position: 'absolute', bottom: 12, left: 14 }}>
              <span style={{ fontSize: 10, fontFamily: T.mono, padding: '3px 9px', borderRadius: 20, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5fc4c8', background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)', border: '1px solid rgba(95,196,200,0.3)' }}>
                {positiveCount} key advantages
              </span>
            </div>

            {/* Hover overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(3px)',
              opacity: hovered ? 1 : 0,
              transition: 'opacity 0.25s ease',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#01696f', color: '#f4f0e8', padding: '10px 20px', borderRadius: 100, fontSize: 13, fontWeight: 600, fontFamily: T.sans, boxShadow: '0 4px 20px rgba(1,105,111,0.5)' }}>
                <ArrowRight size={15} />
                See Comparison
              </div>
            </div>
          </div>

          {/* Content */}
          <div style={{ padding: '18px 20px 20px' }}>
            <div style={{ fontSize: 10, color: T.inkMute, fontFamily: T.mono, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
              WhoUnfollowed vs
            </div>
            <h2 style={{ fontFamily: T.serif, fontSize: 18, fontWeight: 400, color: T.ink, letterSpacing: '-0.01em', marginBottom: 10 }}>
              {comparison.competitorName}
            </h2>
            <p style={{ fontSize: 13, color: T.inkDim, lineHeight: 1.6, marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {comparison.excerpt}
            </p>

            {/* Mini feature preview */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, borderTop: `1px solid ${T.border1}`, paddingTop: 14 }}>
              {comparison.rows.slice(0, 3).map(row => (
                <div key={row.feature} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: T.inkDim }}>{row.feature}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {row.us
                      ? <ShieldCheck size={13} style={{ color: '#5fc4c8' }} />
                      : <ShieldX size={13} style={{ color: T.terra }} />
                    }
                    {row.them
                      ? <ShieldCheck size={13} style={{ color: '#5fc4c8' }} />
                      : <ShieldX size={13} style={{ color: T.terra }} />
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

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

      <main className="px-4 sm:px-8" style={{ maxWidth: 900, margin: '0 auto', paddingTop: 56, paddingBottom: 80 }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 10, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 12 }}>Compare</div>
          <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 400, letterSpacing: '-0.03em', color: T.ink, marginBottom: 10 }}>
            WhoUnfollowed vs every other tracker.
          </h1>
          <p style={{ fontSize: 15, color: T.inkDim, lineHeight: 1.6 }}>
            Every popular Instagram follower tracker asks for your password. That is not a coincidence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 20 }}>
          {COMPARISONS.map((c, i) => <CompareCard key={c.slug} comparison={c} index={i} />)}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <div style={{ marginTop: 40, padding: '24px', borderRadius: 16, background: 'rgba(2,136,143,0.06)', border: '1px solid rgba(2,136,143,0.2)', textAlign: 'center' }}>
            <p style={{ fontSize: 15, color: T.ink, fontWeight: 500, marginBottom: 6 }}>Ready to see your list?</p>
            <p style={{ fontSize: 13, color: T.inkDim, marginBottom: 18 }}>No password. No server. No ban risk.</p>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 11, background: T.teal, color: T.cream, fontSize: 13, fontWeight: 600, textDecoration: 'none', fontFamily: T.sans, boxShadow: `0 6px 20px ${T.tealGlow}` }}>
              Try WhoUnfollowed free →
            </Link>
          </div>

          <div style={{ marginTop: 32, paddingTop: 24, borderTop: `1px solid ${T.border1}` }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: T.inkDim, textDecoration: 'none' }}>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M11 7 H3 M3 7 L6 4 M3 7 L6 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Back to WhoUnfollowed
            </Link>
          </div>
        </motion.div>
      </main>

      <LandingFooter />
    </div>
  );
}
