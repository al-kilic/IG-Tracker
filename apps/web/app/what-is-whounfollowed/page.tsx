'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { T } from '@/components/landing/tokens';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LandingFooter } from '@/components/landing/FinalCTA';
import { Icon } from '@/components/landing/atoms';

const faqItems = [
  { q: 'Is WhoUnfollowed free?', a: 'Yes. Seeing your full non-followers list, mutual followers, and fans is free with no account required. Pro ($4.99/month) adds snapshot history, growth charts, and unfollow alerts.' },
  { q: 'Does WhoUnfollowed need my Instagram password?', a: 'No. There is no Instagram login on WhoUnfollowed. You upload a ZIP file Instagram emails directly to you. Your password is never involved.' },
  { q: 'Will Instagram ban my account for using WhoUnfollowed?', a: 'No. WhoUnfollowed uses Instagram\'s official GDPR data export. You are not using a third-party API, not scraping Instagram, and not violating any Terms of Service.' },
  { q: 'How long does it take to get results?', a: 'About 15 minutes end to end. 30 seconds to request your export, a few minutes for Instagram to email it, and 2 seconds for WhoUnfollowed to parse it.' },
  { q: 'Is WhoUnfollowed open source?', a: 'Yes. The core parser (packages/core) is MIT-licensed and public on GitHub. The web app is AGPL-3.0, which means anyone can self-host it but commercial forks must release their changes.' },
  { q: 'Does WhoUnfollowed work on iPhone and Android?', a: 'Yes. You can request your Instagram export and upload the ZIP from any mobile browser.' },
];

const COMPARE_ROWS = [
  { feature: 'Never asks for your password', us: true,  them: false },
  { feature: 'Zero risk of account ban',     us: true,  them: false },
  { feature: 'Credentials never stored',     us: true,  them: false },
  { feature: 'No signup required',           us: true,  them: false },
  { feature: 'Open source parser',           us: true,  them: false },
  { feature: 'Works offline in browser',     us: true,  them: false },
  { feature: 'Free tier available',          us: true,  them: true  },
];

function FaqItem({ item }: { item: typeof faqItems[0] }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderRadius: 12, border: `1px solid ${open ? 'rgba(2,136,143,0.2)' : T.border1}`, overflow: 'hidden', transition: 'border-color 0.2s', background: open ? 'rgba(2,136,143,0.02)' : 'transparent' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
      >
        <span style={{ fontFamily: T.serif, fontSize: 17, lineHeight: 1.3, color: T.ink, letterSpacing: '-0.01em' }}>{item.q}</span>
        <span style={{ flexShrink: 0, width: 26, height: 26, borderRadius: '50%', background: open ? T.tealMid : T.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', transform: open ? 'rotate(45deg)' : 'none' }}>
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M7 2V12M2 7H12" stroke={open ? T.cream : T.inkMute} strokeWidth="1.6" strokeLinecap="round"/></svg>
        </span>
      </button>
      <div style={{ maxHeight: open ? 200 : 0, overflow: 'hidden', transition: 'max-height 0.35s cubic-bezier(0.16,1,0.3,1)' }}>
        <div style={{ padding: '0 20px 18px', fontSize: 14, color: T.inkDim, lineHeight: 1.7 }}>{item.a}</div>
      </div>
    </div>
  );
}

export default function WhatIsWhoUnfollowed() {
  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: T.sans }}>
      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: `1px solid ${T.border1}`, position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(14px)', background: T.navBg }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="/logo.png" alt="WhoUnfollowed" width={26} height={26} style={{ borderRadius: 7, objectFit: 'contain' }} />
          <span style={{ fontFamily: T.serif, fontSize: 17, color: T.ink }}>WhoUnfollowed</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 16px', borderRadius: 9, background: T.teal, color: T.cream, fontSize: 12, fontWeight: 600, textDecoration: 'none', fontFamily: T.sans }}>
            Try it free
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M3 7H11M11 7L8 4M11 7L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
          <ThemeToggle />
        </div>
      </nav>

      <main className="px-4 sm:px-8" style={{ maxWidth: 740, margin: '0 auto', paddingTop: 64, paddingBottom: 96 }}>

        {/* Hero */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ fontSize: 10, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 16 }}>
            What is WhoUnfollowed
          </div>
          <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(34px, 6vw, 58px)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.03em', color: T.ink, marginBottom: 20 }}>
            See who doesn&apos;t follow you back on Instagram.
            <span style={{ fontStyle: 'italic', color: T.tealLight }}> Without giving anyone your password.</span>
          </h1>
          <p style={{ fontSize: 16, color: T.inkDim, lineHeight: 1.7, marginBottom: 28, maxWidth: 580 }}>
            You upload the data file Instagram already gave you. WhoUnfollowed reads it locally in your browser and shows the full list in under 2 seconds. No server. No login. No risk.
          </p>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 600, color: T.tealLight, textDecoration: 'none' }}>
            See your list now
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7H11M11 7L8 4M11 7L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>

        {/* 3 stats */}
        <div className="grid grid-cols-3" style={{ gap: 10, marginBottom: 64 }}>
          {[
            { value: '2s', label: 'to see your results' },
            { value: '0', label: 'files sent to us' },
            { value: '0', label: 'passwords needed' },
          ].map(s => (
            <div key={s.label} style={{ padding: '18px 14px', borderRadius: 14, background: T.surface1, border: `1px solid ${T.border1}`, textAlign: 'center' }}>
              <div style={{ fontFamily: T.serif, fontSize: 32, color: T.tealLight, letterSpacing: '-0.03em', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: T.inkMute, marginTop: 6, fontFamily: T.mono, letterSpacing: '0.04em' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* The problem */}
        <section style={{ paddingBottom: 56, marginBottom: 56, borderBottom: `1px solid ${T.border1}` }}>
          <div style={{ fontSize: 10, color: T.terra, fontFamily: T.mono, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 14 }}>The problem</div>
          <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em', color: T.ink, marginBottom: 20 }}>
            Every app that tries asks for your password. That&apos;s illegal, dangerous, and unnecessary.
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            {[
              { icon: '🚫', text: 'Violates Instagram\'s Terms of Service' },
              { icon: '⚠', text: 'Thousands of accounts have been permanently banned this way' },
              { icon: '💾', text: 'Several apps were caught storing and selling credentials' },
            ].map(item => (
              <div key={item.text} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 16px', borderRadius: 10, background: 'rgba(168,75,47,0.05)', border: '1px solid rgba(168,75,47,0.12)' }}>
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                <span style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.5 }}>{item.text}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 15, color: T.ink, fontWeight: 500 }}>WhoUnfollowed solves the same problem without any of that risk.</p>
        </section>

        {/* How it works */}
        <section style={{ paddingBottom: 56, marginBottom: 56, borderBottom: `1px solid ${T.border1}` }}>
          <div style={{ fontSize: 10, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 14 }}>How it works</div>
          <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em', color: T.ink, marginBottom: 24 }}>
            Instagram already has your data. We just read it.
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, borderRadius: 16, border: `1px solid ${T.border1}`, overflow: 'hidden', marginBottom: 20 }}>
            {[
              { step: '01', time: '30 sec', title: 'Request your export', body: 'Go to Instagram Settings → Accounts Center → Your Information → Download Your Information. Select Followers and Following.' },
              { step: '02', time: 'Few min', title: 'Instagram emails you the ZIP', body: 'Usually arrives within minutes. You only need the followers and following section - not the full archive.' },
              { step: '03', time: '2 sec', title: 'Drop the ZIP and see your list', body: 'Your browser reads it locally, compares the two lists, and shows every account you follow that doesn\'t follow you back.' },
            ].map((item, i) => (
              <div key={item.step} style={{ display: 'flex', gap: 20, padding: '20px 22px', borderBottom: i < 2 ? `1px solid ${T.border1}` : 'none', background: i === 2 ? 'rgba(2,136,143,0.04)' : T.surface1 }}>
                <div style={{ flexShrink: 0, textAlign: 'center', paddingTop: 2 }}>
                  <div style={{ fontFamily: T.mono, fontSize: 10, color: T.tealMid, letterSpacing: '0.1em', marginBottom: 2 }}>{item.time}</div>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: i === 2 ? T.teal : T.surface2, border: `1px solid ${i === 2 ? 'transparent' : T.border2}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontFamily: T.mono, color: i === 2 ? T.cream : T.inkMute, margin: '0 auto' }}>
                    {item.step}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: T.sans, fontWeight: 600, fontSize: 14, color: T.ink, marginBottom: 4 }}>{item.title}</div>
                  <div style={{ fontSize: 13, color: T.inkDim, lineHeight: 1.6 }}>{item.body}</div>
                </div>
              </div>
            ))}
          </div>
          <Link href="/how-to-export" style={{ fontSize: 14, color: T.tealLight, textDecoration: 'none', fontWeight: 500 }}>
            Full step-by-step export guide →
          </Link>
        </section>

        {/* WhoUnfollowed vs others comparison */}
        <section style={{ paddingBottom: 56, marginBottom: 56, borderBottom: `1px solid ${T.border1}` }}>
          <div style={{ fontSize: 10, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 14 }}>Why us</div>
          <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em', color: T.ink, marginBottom: 24 }}>
            The difference is clear.
          </h2>
          <div style={{ borderRadius: 16, border: `1px solid ${T.border1}`, overflow: 'hidden' }}>
            {/* Header */}
            <div className="grid grid-cols-3" style={{ background: T.surface1, borderBottom: `1px solid ${T.border1}` }}>
              <div style={{ padding: '12px 16px', fontSize: 11, color: T.inkMute, fontFamily: T.mono, letterSpacing: '0.08em' }}>Feature</div>
              <div style={{ padding: '12px 16px', fontSize: 11, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.08em', textAlign: 'center', borderLeft: `1px solid ${T.border1}` }}>WhoUnfollowed</div>
              <div style={{ padding: '12px 16px', fontSize: 11, color: T.terra, fontFamily: T.mono, letterSpacing: '0.08em', textAlign: 'center', borderLeft: `1px solid ${T.border1}` }}>Other apps</div>
            </div>
            {COMPARE_ROWS.map((row, i) => (
              <div key={row.feature} className="grid grid-cols-3" style={{ borderBottom: i < COMPARE_ROWS.length - 1 ? `1px solid ${T.border1}` : 'none' }}>
                <div style={{ padding: '13px 16px', fontSize: 13, color: T.inkDim }}>{row.feature}</div>
                {[row.us, row.them].map((val, ci) => (
                  <div key={ci} style={{ padding: '13px 16px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderLeft: `1px solid ${T.border1}` }}>
                    {val
                      ? <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(2,136,143,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon.check size={13} color={T.tealMid} /></span>
                      : <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(168,75,47,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon.x size={11} color={T.terra} /></span>
                    }
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* What you get */}
        <section style={{ paddingBottom: 56, marginBottom: 56, borderBottom: `1px solid ${T.border1}` }}>
          <div style={{ fontSize: 10, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 14 }}>What you get</div>
          <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em', color: T.ink, marginBottom: 20 }}>
            One upload. Full clarity.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 10 }}>
            {[
              { icon: '👥', title: 'Non-followers list', body: 'Every account you follow that doesn\'t follow you back, with timestamps.' },
              { icon: '⭐', title: 'Fans', body: 'Accounts that follow you but you don\'t follow back.' },
              { icon: '🤝', title: 'Mutuals', body: 'Accounts you both follow each other.' },
              { icon: '📊', title: 'Radar (Pro)', body: 'Health score, follow age bars, growth charts, and who unfollowed between uploads.' },
              { icon: '📋', title: 'CSV export', body: 'Download any list as a spreadsheet.' },
              { icon: '🔍', title: 'Triage workflow', body: 'Mark accounts as Dropping, Whitelist, or Skip to track your clean-up.' },
            ].map(item => (
              <div key={item.title} style={{ display: 'flex', gap: 14, padding: '16px', borderRadius: 12, background: T.surface1, border: `1px solid ${T.border1}` }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: T.ink, marginBottom: 4, fontFamily: T.sans }}>{item.title}</div>
                  <div style={{ fontSize: 13, color: T.inkDim, lineHeight: 1.55 }}>{item.body}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 10, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 14 }}>Questions</div>
          <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em', color: T.ink, marginBottom: 24 }}>
            Quick answers.
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {faqItems.map(item => <FaqItem key={item.q} item={item} />)}
          </div>
        </section>

        {/* CTA */}
        <div style={{ padding: '32px', borderRadius: 18, background: T.bgCard, border: `1px solid ${T.border1}`, textAlign: 'center' }}>
          <p style={{ fontFamily: T.serif, fontSize: 18, fontStyle: 'italic', color: T.inkDim, marginBottom: 6 }}>You already have the data. Instagram gave it to you.</p>
          <p style={{ fontSize: 14, color: T.inkMute, marginBottom: 24 }}>One ZIP. Dropped in your browser. Your list in 2 seconds.</p>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 12, background: T.teal, color: T.cream, fontSize: 14, fontWeight: 600, textDecoration: 'none', fontFamily: T.sans, boxShadow: `0 6px 20px ${T.tealGlow}` }}>
            See your list now
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7H11M11 7L8 4M11 7L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
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
