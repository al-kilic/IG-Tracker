'use client';

import React from 'react';
import Link from 'next/link';
import { T } from '@/components/landing/tokens';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LandingFooter } from '@/components/landing/FinalCTA';
import { Icon } from '@/components/landing/atoms';

const APPS_COMING = [
  { name: 'WhoUnfollowed', initial: 'W', hue: 178, status: 'live', desc: 'See who stopped following you on Instagram. No password.' },
  { name: 'DataVault',     initial: 'D', hue: 210, status: 'soon', desc: 'See and delete everything companies know about you.' },
  { name: 'TrackOut',      initial: 'T', hue: 30,  status: 'soon', desc: 'Find hidden trackers across the apps on your phone.' },
];

function Nav() {
  return (
    <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: `1px solid ${T.border1}`, position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(14px)', background: T.navBg }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <img src="/logo.png" alt="WhoUnfollowed" width={26} height={26} style={{ borderRadius: 7, objectFit: 'contain' }} />
        <span style={{ fontFamily: T.serif, fontSize: 17, color: T.ink }}>WhoUnfollowed</span>
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link href="/" style={{ fontSize: 13, color: T.inkDim, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M11 7 H3 M3 7 L6 4 M3 7 L6 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Back
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  );
}

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: T.sans }}>
      <Nav />

      <main className="px-4 sm:px-8" style={{ maxWidth: 760, margin: '0 auto', paddingTop: 64, paddingBottom: 96 }}>

        {/* Header */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ fontSize: 10, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 16 }}>About</div>
          <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(36px, 6vw, 60px)', fontWeight: 400, lineHeight: 1.0, letterSpacing: '-0.03em', color: T.ink, marginBottom: 20 }}>
            Built by one person.<br/>
            <span style={{ fontStyle: 'italic', color: T.tealLight }}>For everyone tired of the alternative.</span>
          </h1>
          <p style={{ fontSize: 16, color: T.inkDim, lineHeight: 1.7, maxWidth: 580 }}>
            WhoUnfollowed is an independent product. No VC funding. No team of twenty. Just a developer who got tired of every Instagram tool asking for a password it had no business asking for.
          </p>
        </div>

        {/* Developer card */}
        <div style={{
          borderRadius: 20, overflow: 'hidden',
          background: T.bgCard, border: `1px solid ${T.border1}`,
          marginBottom: 56,
        }}>
          <div style={{ padding: '32px 32px 28px', display: 'flex', gap: 28, alignItems: 'flex-start' }}>
            {/* Avatar placeholder */}
            <div style={{
              width: 64, height: 64, borderRadius: 16, flexShrink: 0,
              background: `linear-gradient(135deg, ${T.teal} 0%, #014d52 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, fontFamily: T.serif, color: T.cream,
              boxShadow: `0 8px 24px ${T.tealGlow}`,
            }}>
              A
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: T.serif, fontSize: 22, color: T.ink, letterSpacing: '-0.01em' }}>Alan Kilic</span>
                <span style={{ fontSize: 11, fontFamily: T.mono, padding: '3px 9px', borderRadius: 20, background: 'rgba(2,136,143,0.1)', color: T.tealMid, letterSpacing: '0.06em' }}>Alcatraz</span>
              </div>
              <div style={{ fontSize: 13, color: T.inkDim, marginBottom: 16 }}>
                Product builder, photographer, entrepreneur.
              </div>
              <div style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.7, marginBottom: 20, maxWidth: 480 }}>
                I build privacy-first software under the name <strong style={{ color: T.ink }}>Alcatraz Studio</strong> - a one-person lab focused on giving people control over their own data. Every app I ship does one thing well and never asks for more access than it needs.
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <a href="https://github.com/al-kilic" target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 14px', borderRadius: 9, border: `1px solid ${T.border2}`, background: T.surface1, color: T.inkDim, textDecoration: 'none', fontSize: 12, fontFamily: T.mono, transition: 'color 0.15s, border-color 0.15s' }}
                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.color = T.ink; e.currentTarget.style.borderColor = T.border3; }}
                  onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.color = T.inkDim; e.currentTarget.style.borderColor = T.border2; }}
                >
                  <Icon.gh size={13} color="currentColor" />
                  al-kilic
                </a>
                <a href="mailto:aekilicc@gmail.com"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 14px', borderRadius: 9, border: `1px solid ${T.border2}`, background: T.surface1, color: T.inkDim, textDecoration: 'none', fontSize: 12, fontFamily: T.mono, transition: 'color 0.15s, border-color 0.15s' }}
                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.color = T.ink; e.currentTarget.style.borderColor = T.border3; }}
                  onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.color = T.inkDim; e.currentTarget.style.borderColor = T.border2; }}
                >
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="3" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M2 4 L8 9 L14 4" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round"/></svg>
                  Email
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Philosophy */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 10, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 14 }}>Philosophy</div>
          <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 400, letterSpacing: '-0.02em', color: T.ink, marginBottom: 20 }}>
            Privacy is not a feature.<br/>It&apos;s the baseline.
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { title: 'Minimum access', body: 'Every app I build asks for the least access necessary to do its job. If an app can work without touching your credentials, it works without your credentials.' },
              { title: 'Auditable code', body: 'The parts of my apps that touch your data are open source. You should be able to verify what happens to your information, not just trust a privacy policy.' },
              { title: 'No dark patterns', body: "No misleading defaults. No 'agree to share your data' buried in onboarding. If something is optional, it's off by default." },
            ].map(item => (
              <div key={item.title} style={{ display: 'flex', gap: 16, padding: '20px', borderRadius: 14, background: T.surface1, border: `1px solid ${T.border1}` }}>
                <div style={{ width: 4, borderRadius: 2, background: T.tealMid, flexShrink: 0, alignSelf: 'stretch' }} />
                <div>
                  <div style={{ fontFamily: T.sans, fontWeight: 600, color: T.ink, marginBottom: 6, fontSize: 14 }}>{item.title}</div>
                  <div style={{ fontSize: 13, color: T.inkDim, lineHeight: 1.65 }}>{item.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What's coming */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 10, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 14 }}>What&apos;s coming</div>
          <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(22px, 3.5vw, 32px)', fontWeight: 400, letterSpacing: '-0.02em', color: T.ink, marginBottom: 8 }}>
            More apps. Same principles.
          </h2>
          <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.6, marginBottom: 24 }}>
            WhoUnfollowed is the first of several privacy-first tools. Each one targets a space where existing apps routinely overstep.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {APPS_COMING.map(app => {
              const soon = app.status === 'soon';
              return (
                <div key={app.name} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 14, background: T.surface1, border: `1px solid ${soon ? T.border1 : 'rgba(2,136,143,0.25)'}` }}>
                  {/* Blurred layer for soon apps */}
                  {soon && (
                    <div style={{ position: 'absolute', inset: 0, borderRadius: 14, backdropFilter: 'blur(7px)', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 10, fontFamily: T.mono, padding: '4px 12px', borderRadius: 20, letterSpacing: '0.14em', fontWeight: 800, textTransform: 'uppercase', background: T.terra, color: T.cream, boxShadow: '0 2px 12px rgba(168,75,47,0.4)' }}>
                        SOON
                      </span>
                    </div>
                  )}
                  {/* App icon */}
                  <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: `linear-gradient(135deg, hsl(${app.hue} 55% 35%), hsl(${app.hue} 50% 25%))`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontFamily: T.serif, color: 'rgba(255,255,255,0.9)', boxShadow: soon ? 'none' : `0 4px 16px hsl(${app.hue} 55% 35% / 0.3)` }}>
                    {app.initial}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: T.sans, fontWeight: 600, color: T.ink, fontSize: 14, marginBottom: 2 }}>{app.name}</div>
                    <div style={{ fontSize: 12, color: T.inkDim, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{app.desc}</div>
                  </div>
                  {!soon && (
                    <Link href="/" style={{ fontSize: 11, color: T.tealLight, textDecoration: 'none', fontFamily: T.mono, whiteSpace: 'nowrap', padding: '5px 10px', borderRadius: 7, border: `1px solid rgba(2,136,143,0.25)`, background: 'rgba(2,136,143,0.06)' }}>Try it →</Link>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderRadius: 12, background: T.surface1, border: `1px solid ${T.border1}` }}>
            <Icon.gh size={16} color={T.inkMute} />
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 13, color: T.inkDim }}>Follow the work on GitHub: </span>
              <a href="https://github.com/al-kilic" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: T.tealLight, textDecoration: 'none', fontWeight: 600 }}>github.com/al-kilic</a>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ padding: '32px', borderRadius: 18, background: T.bgCard, border: `1px solid ${T.border1}`, textAlign: 'center' }}>
          <p style={{ fontFamily: T.serif, fontSize: 18, fontStyle: 'italic', color: T.inkDim, marginBottom: 16 }}>Start with WhoUnfollowed. It takes 2 minutes.</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', borderRadius: 11, background: T.teal, color: T.cream, fontSize: 13, fontWeight: 600, textDecoration: 'none', fontFamily: T.sans, boxShadow: `0 6px 20px ${T.tealGlow}` }}>
              Try it free →
            </Link>
            <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', borderRadius: 11, background: T.surface1, color: T.inkDim, fontSize: 13, fontWeight: 500, textDecoration: 'none', fontFamily: T.sans, border: `1px solid ${T.border2}` }}>
              Get in touch
            </Link>
          </div>
        </div>

        <div style={{ marginTop: 48, paddingTop: 28, borderTop: `1px solid ${T.border1}` }}>
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

