'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { T } from './tokens';
import { Icon } from './atoms';

// ─── Animated counter ────────────────────────────────────────────────────────

function AnimatedNumber({ to, active }: { to: number; active: boolean }) {
  const [val, setVal] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!active || started.current) return;
    started.current = true;
    const duration = 1400;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(to * e));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, to]);

  return <span>{val.toLocaleString()}</span>;
}

// ─── Preview card ────────────────────────────────────────────────────────────

const PREVIEW_ACCOUNTS = [
  { handle: '@alex.studio',   hue: 200 },
  { handle: '@marco.visuals', hue: 280 },
  { handle: '@sarah_creates', hue: 340 },
];

function PreviewCard({ active }: { active: boolean }) {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        background: 'rgba(10,18,22,0.96)',
        border: '1px solid rgba(2,136,143,0.35)',
        borderRadius: 20,
        padding: '22px 24px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(2,136,143,0.1)',
        transform: 'rotate(-1.5deg)',
        animation: active ? 'drift-1 7s ease-in-out infinite' : 'none',
      }}>
        {/* Window chrome */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 18 }}>
          <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#ff5f57' }} />
          <div style={{ width: 9, height: 9, borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />
          <div style={{ width: 9, height: 9, borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />
          <span style={{ marginLeft: 8, fontSize: 10, color: 'rgba(244,240,232,0.3)', fontFamily: T.mono, letterSpacing: '0.08em' }}>whounfollowed.app · results</span>
        </div>

        {/* Big number */}
        <div style={{ marginBottom: 4 }}>
          <span style={{ fontFamily: T.serif, fontSize: 42, lineHeight: 1, letterSpacing: '-0.03em', color: '#5fc4c8' }}>
            <AnimatedNumber to={246} active={active} />
          </span>
          <span style={{ fontFamily: T.serif, fontSize: 22, color: 'rgba(244,240,232,0.3)', marginLeft: 4 }}>/1,203</span>
        </div>
        <div style={{ fontSize: 11, color: 'rgba(244,240,232,0.45)', marginBottom: 18, fontFamily: T.mono }}>
          accounts that don't follow you back
        </div>

        {/* Account rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
          {PREVIEW_ACCOUNTS.map((a, i) => (
            <div
              key={a.handle}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '7px 10px', borderRadius: 8,
                background: 'rgba(244,240,232,0.03)',
                border: '1px solid rgba(244,240,232,0.06)',
                fontSize: 12, color: '#f4f0e8', fontFamily: T.mono,
                opacity: active ? 1 : 0,
                transform: active ? 'translateY(0)' : 'translateY(8px)',
                transition: `opacity 0.4s ${0.6 + i * 0.12}s ease, transform 0.4s ${0.6 + i * 0.12}s ease`,
              }}
            >
              <span style={{ width: 20, height: 20, borderRadius: '50%', background: `hsl(${a.hue} 55% 45%)`, flexShrink: 0 }} />
              {a.handle}
              <span style={{ marginLeft: 'auto', fontSize: 10, color: '#a84b2f', fontFamily: T.mono }}>not following</span>
            </div>
          ))}
          <div style={{
            fontSize: 12, color: '#5fc4c8', fontFamily: T.mono, fontStyle: 'italic',
            padding: '4px 10px',
            opacity: active ? 1 : 0,
            transition: 'opacity 0.4s 1.1s ease',
          }}>
            + 243 more
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          <span style={{ flex: 1, padding: '9px 10px', borderRadius: 9, background: '#01696f', color: '#f4f0e8', fontSize: 11, fontWeight: 600, textAlign: 'center', fontFamily: T.sans }}>Export CSV</span>
          <span style={{ flex: 1, padding: '9px 10px', borderRadius: 9, background: 'rgba(244,240,232,0.05)', border: '1px solid rgba(244,240,232,0.1)', color: '#f4f0e8', fontSize: 11, fontWeight: 600, textAlign: 'center', fontFamily: T.sans }}>Save snapshot</span>
        </div>
      </div>

      {/* Example badge */}
      <div style={{
        position: 'absolute', top: -14, right: -6,
        fontFamily: T.serif, fontSize: 13, fontStyle: 'italic',
        color: T.terra, padding: '3px 10px',
        border: `1px solid ${T.terra}`, borderRadius: 100,
        transform: 'rotate(8deg)', background: 'rgba(168,75,47,0.08)',
        opacity: 0.75,
      }}>
        example only
      </div>
    </div>
  );
}

// ─── Final CTA ────────────────────────────────────────────────────────────────

export function FinalCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry?.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="px-4 sm:px-12 pb-16 sm:pb-24 pt-10 relative">
      <div
        ref={ref}
        style={{
          maxWidth: 1240, margin: '0 auto',
          position: 'relative', overflow: 'hidden', borderRadius: 32,
          background: 'linear-gradient(135deg, #08161a 0%, #0b1e24 50%, #081619 100%)',
          border: '1px solid rgba(2,136,143,0.25)',
          boxShadow: '0 40px 120px rgba(0,0,0,0.35)',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(32px)',
          transition: 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* Background glows */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(2,136,143,0.18) 0%, transparent 65%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -120, left: -80, width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,75,47,0.12) 0%, transparent 60%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

        {/* Grid overlay */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(2,136,143,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(2,136,143,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none', opacity: 0.6 }} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-16 px-6 py-14 sm:px-20 sm:py-20" style={{ position: 'relative', zIndex: 2, alignItems: 'center' }}>

          {/* Left - copy */}
          <div>
            {/* Eyebrow */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '5px 14px 5px 8px',
              background: 'rgba(2,136,143,0.1)', border: '1px solid rgba(2,136,143,0.3)',
              borderRadius: 100, marginBottom: 28,
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(12px)',
              transition: 'opacity 0.5s 0.1s ease, transform 0.5s 0.1s ease',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#5fc4c8', animation: 'glow-soft 2s ease-in-out infinite' }} />
              <span style={{ fontSize: 11, color: '#5fc4c8', fontFamily: T.mono, fontWeight: 600, letterSpacing: '0.1em' }}>FREE · NO SIGNUP · NO PASSWORD</span>
            </div>

            {/* Headline */}
            <h3 style={{
              fontFamily: T.serif, fontWeight: 400,
              fontSize: 'clamp(36px, 5vw, 72px)',
              lineHeight: 1.0, letterSpacing: '-0.03em',
              marginBottom: 20, color: '#f4f0e8',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.55s 0.18s ease, transform 0.55s 0.18s ease',
            }}>
              Know exactly<br/>
              who isn&apos;t following<br/>
              <span style={{ fontStyle: 'italic', color: '#5fc4c8' }}>you back.</span>
            </h3>

            {/* Body */}
            <p style={{
              fontSize: 16, color: 'rgba(244,240,232,0.55)', lineHeight: 1.65,
              marginBottom: 32, maxWidth: 440,
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(12px)',
              transition: 'opacity 0.5s 0.28s ease, transform 0.5s 0.28s ease',
            }}>
              Drop the ZIP Instagram already sent you. Your browser reads it locally and shows you the complete list in under 2 seconds. No server. No login. No risk.
            </p>

            {/* CTAs */}
            <div style={{
              display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28,
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(12px)',
              transition: 'opacity 0.5s 0.38s ease, transform 0.5s 0.38s ease',
            }}>
              <a
                href="#upload"
                onClick={e => { e.preventDefault(); document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' }); }}
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  padding: '16px 28px', borderRadius: 14,
                  background: 'linear-gradient(135deg, #02888f, #01696f)',
                  color: '#f4f0e8', textDecoration: 'none',
                  fontSize: 16, fontWeight: 700, fontFamily: T.sans,
                  boxShadow: '0 8px 32px rgba(2,136,143,0.45), inset 0 1px 0 rgba(255,255,255,0.12)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(2,136,143,0.55), inset 0 1px 0 rgba(255,255,255,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(2,136,143,0.45), inset 0 1px 0 rgba(255,255,255,0.12)'; }}
              >
                Upload your export and see the list
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
              <Link
                href="/how-to-export"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '13px 22px', borderRadius: 12,
                  background: 'rgba(244,240,232,0.05)', border: '1px solid rgba(244,240,232,0.12)',
                  color: 'rgba(244,240,232,0.7)', textDecoration: 'none',
                  fontSize: 14, fontWeight: 500, fontFamily: T.sans,
                  transition: 'color 0.2s, border-color 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#f4f0e8'; e.currentTarget.style.borderColor = 'rgba(244,240,232,0.25)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(244,240,232,0.7)'; e.currentTarget.style.borderColor = 'rgba(244,240,232,0.12)'; }}
              >
                <Icon.code size={14} color="#5fc4c8" />
                How to request your Instagram export
              </Link>
            </div>

            {/* Trust row */}
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 11,
              color: 'rgba(244,240,232,0.35)', fontFamily: T.mono, letterSpacing: '0.06em',
              opacity: visible ? 1 : 0,
              transition: 'opacity 0.5s 0.5s ease',
            }}>
              {[
                { icon: 'shield', text: 'no login' },
                { icon: 'bolt',   text: 'runs in browser' },
                { icon: 'code',   text: 'open source' },
              ].map(({ icon, text }) => (
                <span key={text} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  {icon === 'shield' && <Icon.shield size={12} color="rgba(2,136,143,0.6)" />}
                  {icon === 'bolt'   && <Icon.bolt   size={12} color="rgba(2,136,143,0.6)" />}
                  {icon === 'code'   && <Icon.code   size={12} color="rgba(2,136,143,0.6)" />}
                  {text}
                </span>
              ))}
            </div>
          </div>

          {/* Right - preview card */}
          <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.65s 0.3s ease, transform 0.65s 0.3s ease',
          }}>
            <PreviewCard active={visible} />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

export function LandingFooter() {
  return (
    <footer className="px-4 sm:px-12 pt-14 pb-10" style={{ borderTop: `1px solid ${T.border1}`, position: 'relative' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 sm:gap-12 mb-14">
          <div>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, textDecoration: 'none' }}>
              <img src="/logo.png" alt="WhoUnfollowed Logo" width={32} height={32} style={{ borderRadius: 9, objectFit: 'contain' }} />
              <span style={{ fontFamily: T.serif, fontSize: 22, color: T.ink, letterSpacing: '-0.01em' }}>WhoUnfollowed</span>
            </Link>
            <p style={{ fontFamily: T.serif, fontSize: 16, fontStyle: 'italic', color: T.inkDim, lineHeight: 1.4, maxWidth: 320, marginBottom: 20 }}>
              A simple tool that respects what every other one of these tools quietly violated.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, color: T.inkMute, fontFamily: T.mono, letterSpacing: '0.04em' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#5fbb73' }} />
              All systems operational
            </div>
          </div>

          {[
            { title: 'Product', items: [
              { label: 'What is WhoUnfollowed?',  href: '/what-is-whounfollowed' },
              { label: 'How to Export Your Data', href: '/how-to-export' },
              { label: 'Source Code',             href: 'https://github.com/al-kilic/IG-Tracker' },
              { label: 'Changelog',               href: '/changelog' },
            ]},
            { title: 'Company', items: [
              { label: 'About',   href: '/about' },
              { label: 'Contact', href: '/contact' },
            ]},
            { title: 'Legal', items: [
              { label: 'Privacy Policy',   href: '/privacy' },
              { label: 'Refund Policy',    href: '/refund' },
              { label: 'Cookie Policy',    href: '/cookies' },
              { label: 'Terms of Service', href: '/terms' },
            ]},
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontSize: 11, color: T.inkMute, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 16, fontFamily: T.mono, fontWeight: 600 }}>{col.title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                {col.items.map(l => (
                  <a key={l.label} href={l.href} style={{ fontSize: 14, color: T.inkDim, cursor: 'pointer', textDecoration: 'none', transition: 'color 0.2s', fontFamily: T.sans }}
                    onMouseEnter={e => { e.currentTarget.style.color = T.ink; }}
                    onMouseLeave={e => { e.currentTarget.style.color = T.inkDim; }}>
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, paddingTop: 24, borderTop: `1px solid ${T.border1}` }}>
          <div style={{ fontSize: 12, color: T.inkMute, fontFamily: T.mono, letterSpacing: '0.04em' }}>
            © 2026 WhoUnfollowed · Independent · Not affiliated with Instagram or Meta
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {[
              { name: 'GitHub', href: 'https://github.com/al-kilic/IG-Tracker', icon: <Icon.gh size={16} color={T.inkDim} /> },
              { name: 'Email',  href: 'mailto:aekilicc@gmail.com', icon: (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="3" width="13" height="10" rx="1.5" stroke={T.inkDim} strokeWidth="1.3"/><path d="M2 4 L8 9 L14 4" stroke={T.inkDim} strokeWidth="1.3" fill="none" strokeLinecap="round"/></svg>
              )},
            ].map(s => (
              <a key={s.name} title={s.name} href={s.href}
                style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${T.border2}`, cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = T.border3; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border2; }}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
