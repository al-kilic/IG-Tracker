import type { Metadata } from 'next';
import Link from 'next/link';
import { LandingFooter } from '@/components/landing/FinalCTA';
import { T } from '@/components/landing/tokens';

export const metadata: Metadata = {
  title: 'What is WhoUnfollowed? — Instagram Unfollow Tracker Explained',
  description: 'WhoUnfollowed shows you who doesn\'t follow you back on Instagram — without your password. Upload your Instagram data export. See the list in 2 seconds. Free.',
  alternates: { canonical: 'https://whounfollowed.app/what-is-whounfollowed' },
  openGraph: {
    title: 'What is WhoUnfollowed? — Instagram Unfollow Tracker Explained',
    description: 'WhoUnfollowed shows you who doesn\'t follow you back on Instagram — without your password. Upload your Instagram data export. See the list in 2 seconds. Free.',
    url: 'https://whounfollowed.app/what-is-whounfollowed',
  },
};

const faqItems = [
  { q: 'Is WhoUnfollowed free?', a: 'Yes. Seeing your full non-followers list, mutual followers, and fans is free with no account required. Pro ($4.99/month) adds snapshot history, growth charts, and unfollow alerts.' },
  { q: 'Does WhoUnfollowed need my Instagram password?', a: 'No. There is no login form on WhoUnfollowed. You upload a ZIP file Instagram emails directly to you. Your password is never involved.' },
  { q: 'Will Instagram ban my account for using WhoUnfollowed?', a: 'No. WhoUnfollowed uses Instagram\'s official GDPR data export. You are not using a third-party API, not scraping Instagram, and not violating any Terms of Service.' },
  { q: 'How long does it take to get results?', a: 'About 15 minutes end to end. 30 seconds to request your export, a few minutes for Instagram to email it, and 2 seconds for WhoUnfollowed to parse it.' },
  { q: 'Is WhoUnfollowed open source?', a: 'Yes. The source code is MIT-licensed and public on GitHub.' },
  { q: 'Does WhoUnfollowed work on iPhone and Android?', a: 'Yes. You can request your Instagram export and upload the ZIP from any mobile browser.' },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map(item => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
};

// ─── Shared primitives ────────────────────────────────────────────────────────

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 14 }}>
      {children}
    </div>
  );
}

function Section({ children, first = false }: { children: React.ReactNode; first?: boolean }) {
  return (
    <section style={{
      paddingTop: first ? 0 : 64,
      marginTop: first ? 0 : 64,
      borderTop: first ? 'none' : '1px solid rgba(244,240,232,0.06)',
    }}>
      {children}
    </section>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 16, color: T.inkDim, lineHeight: 1.75, maxWidth: 620 }}>
      {children}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WhatIsWhoUnfollowed() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: T.sans }}>
        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px', borderBottom: '1px solid rgba(244,240,232,0.06)', position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(14px)', background: 'rgba(13,13,13,0.8)' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <img src="/logo.png" alt="WhoUnfollowed" width={26} height={26} style={{ borderRadius: 7, objectFit: 'contain' }} />
            <span style={{ fontFamily: T.serif, fontSize: 17, color: T.ink }}>WhoUnfollowed</span>
          </Link>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 18px', borderRadius: 10, background: T.teal, color: T.cream, fontSize: 13, fontWeight: 600, textDecoration: 'none', fontFamily: T.sans }}>
            Try it free
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M3 7H11M11 7L8 4M11 7L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </nav>

        <main style={{ maxWidth: 720, margin: '0 auto', padding: '72px 32px 96px' }}>

          {/* ── Section 1: What it is ── */}
          <Section first>
            <Eyebrow>What is WhoUnfollowed</Eyebrow>
            <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.03em', color: T.ink, marginBottom: 28 }}>
              WhoUnfollowed shows you exactly who doesn&apos;t follow you back on Instagram.
            </h1>
            <Body>
              <p>No password. No app to download. No account to create. You upload the data file Instagram already gave you, and WhoUnfollowed shows you the full list in under 2 seconds — all inside your browser, nothing sent to a server.</p>
            </Body>
            <div style={{ marginTop: 32 }}>
              <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 600, color: T.tealLight, textDecoration: 'none' }}>
                See who doesn&apos;t follow you back
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7H11M11 7L8 4M11 7L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
            </div>
          </Section>

          {/* ── Section 2: The problem ── */}
          <Section>
            <Eyebrow>The Problem</Eyebrow>
            <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em', color: T.ink, marginBottom: 24 }}>
              Instagram won&apos;t tell you who unfollowed you. Every app that tries asks for your password.
            </h2>
            <Body>
              <p style={{ marginBottom: 16 }}>Instagram deliberately hides unfollow events. There are no notifications, no logs, no built-in way to see who stopped following you. The only way to know is to compare your follower list over time — and Instagram doesn&apos;t offer that tool.</p>
              <p style={{ marginBottom: 16 }}>So people turn to third-party apps. Almost all of them ask for your Instagram username and password. Handing that over violates Instagram&apos;s Terms of Service. Thousands of accounts have been flagged or permanently banned this way. Several of these apps have been caught storing and selling those credentials.</p>
              <p>WhoUnfollowed solves the same problem without any of that risk.</p>
            </Body>
          </Section>

          {/* ── Section 3: How it works ── */}
          <Section>
            <Eyebrow>How It Works</Eyebrow>
            <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em', color: T.ink, marginBottom: 24 }}>
              Instagram already has your data. WhoUnfollowed just reads it.
            </h2>
            <Body>
              <p style={{ marginBottom: 16 }}>Under GDPR, Instagram is legally required to give you your own data on request. That includes your full followers list and your full following list — every account, with timestamps.</p>
              <p style={{ marginBottom: 16 }}>You request it in Instagram settings. They email you a ZIP file, usually within minutes. You drop that ZIP on WhoUnfollowed. Your browser reads it locally, compares the two lists, and shows you every account you follow that doesn&apos;t follow you back.</p>
              <p style={{ marginBottom: 32 }}>That&apos;s the whole thing. Instagram does the data collection. WhoUnfollowed does the comparison. Your device does the processing. Nothing leaves your browser.</p>
            </Body>

            {/* 3-step inline flow */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, borderRadius: 14, border: '1px solid rgba(244,240,232,0.07)', overflow: 'hidden', marginBottom: 28 }}>
              {[
                { time: '30 sec', label: 'Request your export from Instagram settings' },
                { time: 'Few min', label: 'Instagram emails you the ZIP file' },
                { time: '2 sec',  label: 'Drop the ZIP. See your full list instantly.' },
              ].map((step, i) => (
                <div key={step.label} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '16px 20px', borderBottom: i < 2 ? '1px solid rgba(244,240,232,0.05)' : 'none', background: 'rgba(244,240,232,0.02)' }}>
                  <span style={{ fontFamily: T.mono, fontSize: 11, color: T.tealMid, width: 52, flexShrink: 0, letterSpacing: '0.04em' }}>{step.time}</span>
                  <span style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.5 }}>{step.label}</span>
                </div>
              ))}
            </div>

            <Link href="/how-to-export" style={{ fontSize: 14, color: T.inkDim, textDecoration: 'none', borderBottom: '1px solid rgba(244,240,232,0.15)', paddingBottom: 1 }}>
              Not sure how to request your export? Step-by-step guide →
            </Link>
          </Section>

          {/* ── Section 4: What you get ── */}
          <Section>
            <Eyebrow>What You Get</Eyebrow>
            <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em', color: T.ink, marginBottom: 24 }}>
              Full clarity on your Instagram following list. In one upload.
            </h2>
            <Body>
              <p style={{ marginBottom: 20 }}>After one ZIP upload, WhoUnfollowed shows you:</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  'Every account you follow that doesn\'t follow you back',
                  'Every account that follows you that you don\'t follow back (fans)',
                  'Every mutual follow',
                  'A CSV export of any of the above',
                  'A saved snapshot you can compare to future uploads (Pro)',
                ].map(item => (
                  <li key={item} style={{ display: 'flex', gap: 12, fontSize: 15, color: T.inkDim, lineHeight: 1.5 }}>
                    <span style={{ color: T.tealMid, flexShrink: 0, marginTop: 2 }}>·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p>That&apos;s it. No recommendations. No vague graphs. The actual list, with usernames, so you can act on it.</p>
            </Body>
          </Section>

          {/* ── Section 5: Who it's for ── */}
          <Section>
            <Eyebrow>Who It&apos;s For</Eyebrow>
            <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em', color: T.ink, marginBottom: 24 }}>
              Anyone who wants to know the truth about their following list.
            </h2>
            <Body>
              <p style={{ marginBottom: 16 }}>WhoUnfollowed is for two kinds of people.</p>
              <p style={{ marginBottom: 16 }}>Creators and influencers who want to understand their audience — who&apos;s genuinely loyal, who followed for a follow-back and left, and how their follower count actually changed over time.</p>
              <p style={{ marginBottom: 16 }}>Regular users who just want to know. You&apos;ve been following someone for two years. You want to know if they follow you back. Instagram won&apos;t tell you. WhoUnfollowed will.</p>
              <p>Both use cases are free. No account needed.</p>
            </Body>
          </Section>

          {/* ── Section 6: Why it's safe ── */}
          <Section>
            <Eyebrow>Why It&apos;s Safe</Eyebrow>
            <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em', color: T.ink, marginBottom: 24 }}>
              There is no login form. We couldn&apos;t take your password even if we wanted to.
            </h2>
            <Body>
              <p style={{ marginBottom: 16 }}>Most Instagram tools get accounts banned because they log in as you using your credentials — which Instagram detects and flags as unauthorized third-party access.</p>
              <p style={{ marginBottom: 16 }}>WhoUnfollowed never touches Instagram&apos;s servers. It reads a file on your device, in your browser, locally. There is no API call, no login, no session token. Instagram has no way of knowing WhoUnfollowed exists, because from Instagram&apos;s perspective, nothing happened.</p>
              <p>The parser is open source. Every line of code is public on GitHub. You don&apos;t have to trust us — you can read exactly what runs when you drop your ZIP.</p>
            </Body>
          </Section>

          {/* ── Section 7: FAQ ── */}
          <Section>
            <Eyebrow>Questions</Eyebrow>
            <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em', color: T.ink, marginBottom: 32 }}>
              Quick answers.
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {faqItems.map((item, i) => (
                <div key={item.q} style={{ paddingTop: 20, paddingBottom: 20, borderBottom: i < faqItems.length - 1 ? '1px solid rgba(244,240,232,0.06)' : 'none' }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: T.ink, marginBottom: 8, lineHeight: 1.4 }}>{item.q}</div>
                  <div style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.7 }}>{item.a}</div>
                </div>
              ))}
            </div>
          </Section>

          {/* ── Section 8: Final CTA ── */}
          <Section>
            <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em', color: T.ink, marginBottom: 16 }}>
              You already have the data. Instagram gave it to you.
            </h2>
            <p style={{ fontSize: 16, color: T.inkDim, lineHeight: 1.7, marginBottom: 36 }}>
              One ZIP file. Dropped in your browser.<br/>
              Every non-follower, listed, in 2 seconds.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
              <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', borderRadius: 12, background: T.teal, color: T.cream, fontSize: 15, fontWeight: 600, textDecoration: 'none', fontFamily: T.sans }}>
                See your list
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7H11M11 7L8 4M11 7L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
              <Link href="/how-to-export" style={{ fontSize: 14, color: T.inkDim, textDecoration: 'none', borderBottom: '1px solid rgba(244,240,232,0.15)', paddingBottom: 1 }}>
                How to get your Instagram export →
              </Link>
            </div>
          </Section>

          {/* Back link */}
          <div style={{ marginTop: 64, paddingTop: 32, borderTop: '1px solid rgba(244,240,232,0.06)' }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: T.inkDim, textDecoration: 'none' }}>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M11 7H3M3 7L6 4M3 7L6 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Back to WhoUnfollowed
            </Link>
          </div>
        </main>

        <LandingFooter />
      </div>
    </>
  );
}

import type React from 'react';
