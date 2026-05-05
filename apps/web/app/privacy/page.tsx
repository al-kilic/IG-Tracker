import Link from 'next/link';
import type { Metadata } from 'next';
import { T } from '@/components/landing/tokens';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How IG Tracker handles your data — which is almost nothing.',
};

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: T.sans }}>
      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px', borderBottom: '1px solid rgba(244,240,232,0.06)', position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(14px)', background: 'rgba(13,13,13,0.8)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: `linear-gradient(135deg, ${T.tealMid}, ${T.teal})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 5 L4 10 L9 15 M20 10 H4" stroke={T.cream} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={{ fontFamily: T.serif, fontSize: 17, color: T.ink }}>IG Tracker</span>
        </div>
        <Link href="/" style={{ fontSize: 13, color: T.inkDim, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M11 7 H3 M3 7 L6 4 M3 7 L6 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Back to home
        </Link>
      </nav>

      <main style={{ maxWidth: 680, margin: '0 auto', padding: '56px 32px 80px' }}>
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.14em', marginBottom: 14 }}>LEGAL</div>
          <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.03em', color: T.ink, marginBottom: 12 }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: 13, color: T.inkMute, fontFamily: T.mono }}>Last updated: April 28, 2026</p>
        </div>

        {/* Highlight card */}
        <div style={{ padding: '20px 24px', borderRadius: 16, border: `1px solid rgba(2,136,143,0.3)`, background: 'rgba(2,136,143,0.06)', marginBottom: 40 }}>
          <div style={{ fontSize: 11, color: T.tealLight, fontFamily: T.mono, letterSpacing: '0.1em', marginBottom: 8 }}>THE SHORT VERSION</div>
          <p style={{ fontSize: 15, color: T.ink, lineHeight: 1.6 }}>
            By default, IG Tracker collects nothing. Your Instagram export is parsed entirely in your browser. No data is transmitted to any server. We have no visibility into what you upload or what results you see.
          </p>
        </div>

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
          <Section title="What we process">
            When you drop a ZIP file onto the page, JavaScript running in your browser reads the file. The follower and following lists are parsed locally. The results are stored in your browser's IndexedDB (a local database on your device) if you choose to save snapshots. None of this data leaves your device.
          </Section>

          <Section title="What we don't collect">
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                'Your Instagram username or password',
                'Your follower or following lists',
                'Any file you upload',
                'Your IP address (beyond what your ISP and CDN see for serving the page)',
                'Cookies for tracking',
              ].map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: T.inkDim }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: T.tealMid, flexShrink: 0, marginTop: 7 }} />
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Pro tier (when enabled)">
            If you create a Pro account, we store: your email address, a hashed password (using argon2), and encrypted snapshot blobs on our self-hosted server in Germany. The encryption key is derived from your password and never stored server-side. We cannot read your snapshot data.
            <br /><br />
            Pro is not yet active. The feature flag is off. If you click "Upgrade to Pro," you receive Pro access for free during the beta period. No payment information is collected.
          </Section>

          <Section title="Analytics">
            We may use self-hosted Plausible Analytics to count page views. Plausible does not use cookies and does not collect personal data. Visit{' '}
            <a href="https://plausible.io/data-policy" target="_blank" rel="noopener noreferrer" style={{ color: T.tealLight, textDecoration: 'none' }}>plausible.io/data-policy</a>{' '}
            for details. If analytics are not enabled on this instance, no data is sent.
          </Section>

          <Section title="Data retention">
            <strong style={{ color: T.ink }}>Free tier:</strong> all data lives in your browser's IndexedDB. Clearing site data removes it. We have no copy.
            <br /><br />
            <strong style={{ color: T.ink }}>Pro tier:</strong> encrypted snapshots are retained until you delete your account. Account deletion is immediate and permanent.
          </Section>

          <Section title="Your rights">
            Under GDPR Article 20, you have the right to data portability. Since we don't hold your data by default, there's nothing to request. Pro users can export and delete their data from their account settings.
          </Section>

          <Section title="Contact">
            Questions about this policy:{' '}
            <a href="mailto:aekilicc@gmail.com" style={{ color: T.tealLight, textDecoration: 'none' }}>aekilicc@gmail.com</a>
          </Section>
        </div>

        {/* Back link */}
        <div style={{ marginTop: 56, paddingTop: 32, borderTop: '1px solid rgba(244,240,232,0.06)' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: T.inkDim, textDecoration: 'none' }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M11 7 H3 M3 7 L6 4 M3 7 L6 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Back to IG Tracker
          </Link>
        </div>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 style={{ fontFamily: T.serif, fontSize: 20, fontWeight: 400, color: T.ink, letterSpacing: '-0.01em', marginBottom: 12 }}>{title}</h2>
      <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.7 }}>{children}</p>
    </div>
  );
}

import React from 'react';
