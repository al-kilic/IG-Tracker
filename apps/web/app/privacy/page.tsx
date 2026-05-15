import Link from 'next/link';
import type { Metadata } from 'next';
import { T } from '@/components/landing/tokens';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LandingFooter } from '@/components/landing/FinalCTA';
import type React from 'react';

export const metadata: Metadata = {
  title: 'Privacy Policy - WhoUnfollowed',
  description: 'Privacy Policy for WhoUnfollowed. How we handle your data and our relationship with Instagram and Meta.',
};

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: T.sans }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: `1px solid ${T.border1}`, position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(14px)', background: T.navBg }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="/logo.png" alt="WhoUnfollowed Logo" width={26} height={26} style={{ borderRadius: 7, objectFit: 'contain' }} />
          <span style={{ fontFamily: T.serif, fontSize: 17, color: T.ink }}>WhoUnfollowed</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/" style={{ fontSize: 13, color: T.inkDim, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M11 7 H3 M3 7 L6 4 M3 7 L6 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Back to home
          </Link>
          <ThemeToggle />
        </div>
      </nav>

      <main style={{ maxWidth: 680, margin: '0 auto', padding: '56px 24px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.14em', marginBottom: 14 }}>LEGAL</div>
          <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.03em', color: T.ink, marginBottom: 12 }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: 13, color: T.inkMute, fontFamily: T.mono }}>Effective date: April 28, 2026 · Last updated: May 15, 2026</p>
        </div>

        {/* Disclaimer box */}
        <div style={{ padding: '16px 20px', borderRadius: 12, border: `1px solid ${T.border2}`, background: T.surface1, marginBottom: 24 }}>
          <p style={{ fontSize: 13, color: T.inkMute, lineHeight: 1.65, margin: 0 }}>
            <strong style={{ color: T.ink }}>WhoUnfollowed is an independent service.</strong> It is not affiliated with, endorsed by, sponsored by, or in any way officially connected with Instagram, Meta Platforms, Inc., or any of their subsidiaries or affiliates. &ldquo;Instagram&rdquo; is a registered trademark of Meta Platforms, Inc. All references to Instagram are for descriptive purposes only.
          </p>
        </div>

        {/* TL;DR */}
        <div style={{ padding: '20px 24px', borderRadius: 16, border: '1px solid rgba(2,136,143,0.3)', background: 'rgba(2,136,143,0.06)', marginBottom: 40 }}>
          <div style={{ fontSize: 11, color: T.tealLight, fontFamily: T.mono, letterSpacing: '0.1em', marginBottom: 8 }}>THE SHORT VERSION</div>
          <p style={{ fontSize: 15, color: T.ink, lineHeight: 1.6, margin: 0 }}>
            By default, WhoUnfollowed collects nothing. Your Instagram data export is processed entirely within your browser. No data is transmitted to our servers. We cannot see what you upload or what results you receive.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>

          <Section title="1. About this Service">
            WhoUnfollowed (&ldquo;the Service,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;) provides a tool that allows users to analyse their own Instagram data exports to identify follower and following relationships. The Service operates exclusively by processing data files that users have lawfully obtained directly from Instagram via Instagram&apos;s official data export feature, as permitted under applicable data protection legislation including GDPR Article 20 (Right to Data Portability).
          </Section>

          <Section title="2. Legal basis for data processing">
            Our processing relies on the following legal bases:
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
              {[
                { label: 'Legitimate interest', text: 'Providing the analytical service you have explicitly requested.' },
                { label: 'GDPR Article 20', text: 'Supporting your right to receive and reuse your own personal data from a controller, in a structured, commonly used, and machine-readable format.' },
                { label: 'Performance of contract', text: 'Providing the features of the Pro tier to paying subscribers.' },
              ].map(item => (
                <li key={item.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: T.inkDim }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: T.tealMid, flexShrink: 0, marginTop: 7 }} />
                  <span><strong style={{ color: T.ink }}>{item.label}:</strong> {item.text}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="3. Data processed by the Service">
            When you use WhoUnfollowed, the data you provide (your Instagram export ZIP file) is processed exclusively within your own browser using client-side JavaScript. No file contents, follower lists, usernames, or any portion of the data export are transmitted to our servers at any time during the analysis process.
            <br /><br />
            If you elect to save snapshots using the Free tier, those snapshots are stored exclusively in your browser&apos;s local IndexedDB storage on your device. We have no access to this data.
          </Section>

          <Section title="4. Data we do not collect">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
              {[
                'Instagram credentials, usernames, or passwords',
                'Follower lists, following lists, or any content from your data export',
                'The files you upload in any form',
                'Personal data beyond what is strictly necessary to provide the Pro tier service',
                'Tracking cookies, advertising identifiers, or cross-site tracking data',
              ].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px', borderRadius: 10, background: 'rgba(168,75,47,0.04)', border: '1px solid rgba(168,75,47,0.12)' }}>
                  <span style={{ fontSize: 13, fontFamily: T.mono, fontWeight: 800, color: T.terra, flexShrink: 0, letterSpacing: '0.06em' }}>NEVER</span>
                  <span style={{ fontSize: 14, color: T.ink }}>{item}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title="5. Pro tier data processing">
            Users who create a Pro account provide an email address and password. Passwords are hashed using argon2id and are never stored in plaintext. Snapshot data uploaded for cloud sync is encrypted client-side before transmission using a key derived from the user&apos;s password. This key is never stored on our servers, and we are technically unable to decrypt user snapshot data.
            <br /><br />
            Pro account data is stored on infrastructure located within the European Union (Germany), and processing is governed by GDPR. The Pro tier is not yet active. During the beta period, all users receive Pro features at no charge and no payment data is collected or stored.
          </Section>

          <Section title="6. Relationship with Meta and Instagram">
            WhoUnfollowed does not interact with Instagram&apos;s servers, APIs, or infrastructure in any way. The Service does not use Instagram&apos;s Graph API or any other Instagram or Meta API. Users obtain their own data directly from Instagram pursuant to Instagram&apos;s &ldquo;Download Your Information&rdquo; feature, which Instagram provides in compliance with GDPR Article 20.
            <br /><br />
            WhoUnfollowed does not facilitate any action that violates Instagram&apos;s Terms of Service. The Service does not automate any interactions with Instagram, does not scrape Instagram, and does not perform any action on behalf of users within the Instagram platform.
          </Section>

          <Section title="7. Analytics">
            We may use self-hosted Plausible Analytics to collect aggregate, anonymised page view statistics. Plausible Analytics does not use cookies, does not collect personal data, and does not track users across websites. No personally identifiable information is collected. Full details are available at{' '}
            <a href="https://plausible.io/data-policy" target="_blank" rel="noopener noreferrer" style={{ color: T.tealLight, textDecoration: 'none' }}>plausible.io/data-policy</a>.
          </Section>

          <Section title="8. Data retention">
            <strong style={{ color: T.ink }}>Free tier:</strong> All data is stored exclusively in your browser&apos;s local storage (IndexedDB). We hold no copy of this data. Clearing your browser&apos;s site data permanently removes all locally stored snapshots.
            <br /><br />
            <strong style={{ color: T.ink }}>Pro tier:</strong> Encrypted account data is retained for the duration of the account. You may request complete account deletion at any time via your account settings. Deletion is processed immediately and is irreversible.
          </Section>

          <Section title="9. Your rights (GDPR)">
            If you are located in the European Economic Area, you have the following rights regarding any personal data we process:
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12 }}>
              {['Right of access (Article 15)', 'Right to rectification (Article 16)', 'Right to erasure (Article 17)', 'Right to data portability (Article 20)', 'Right to object to processing (Article 21)'].map(r => (
                <li key={r} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: T.inkDim }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: T.tealMid, flexShrink: 0, marginTop: 7 }} />
                  {r}
                </li>
              ))}
            </ul>
            <br />
            As the Free tier processes no personal data on our servers, most rights are not practically applicable. Pro users may exercise all rights by contacting us at the address below.
          </Section>

          <Section title="10. Limitation of liability">
            WhoUnfollowed is provided &ldquo;as is&rdquo; without warranty of any kind, express or implied. We are not responsible for any actions taken by users based on results produced by the Service. Users are solely responsible for how they use the information provided and for compliance with any applicable platform terms of service, including those of Instagram and Meta Platforms, Inc.
          </Section>

          <Section title="11. Changes to this policy">
            We may update this Privacy Policy from time to time. Material changes will be communicated via the changelog. Continued use of the Service after changes constitutes acceptance of the updated policy.
          </Section>

          <Section title="12. Contact">
            Data protection enquiries and rights requests:<br />
            <a href="mailto:aekilicc@gmail.com" style={{ color: T.tealLight, textDecoration: 'none' }}>aekilicc@gmail.com</a>
            <br /><br />
            <span style={{ fontSize: 13, color: T.inkMute }}>WhoUnfollowed · Independent · Not affiliated with Instagram or Meta Platforms, Inc.</span>
          </Section>

        </div>

        <div style={{ marginTop: 56, paddingTop: 32, borderTop: `1px solid ${T.border1}` }}>
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 style={{ fontFamily: T.serif, fontSize: 19, fontWeight: 400, color: T.ink, letterSpacing: '-0.01em', marginBottom: 12 }}>{title}</h2>
      <div style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.75 }}>{children}</div>
    </div>
  );
}
