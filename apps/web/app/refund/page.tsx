import Link from 'next/link';
import type { Metadata } from 'next';
import { T } from '@/components/landing/tokens';

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'Our policy on refunds for IG Tracker Pro.',
};

export default function RefundPage() {
  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: T.sans }}>
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
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.14em', marginBottom: 14 }}>LEGAL</div>
          <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.03em', color: T.ink, marginBottom: 12 }}>
            Refund Policy
          </h1>
          <p style={{ fontSize: 13, color: T.inkMute, fontFamily: T.mono }}>Last updated: May 5, 2026</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
          <Section title="No Refund Policy">
            IG Tracker provides a substantial free tier that allows you to fully test the application's core functionality before ever considering an upgrade. Because the service is intangible and the free tier is always available to ensure the tool meets your needs, we do not offer refunds once a Pro subscription has been purchased.
          </Section>

          <Section title="Try Before You Buy">
            We encourage all users to use the free version of IG Tracker to its fullest extent. There are no time limits on the free tier, and it includes the primary parsing engine. Pro features are supplementary (such as cloud snapshots and history tracking) and do not change the core "IG Tracker" experience.
          </Section>

          <Section title="Exceptions">
            In exceptional circumstances (such as accidental duplicate billing due to a technical error on our part), we may issue a refund at our sole discretion. If you believe such an error has occurred, please contact us at <a href="mailto:aekilicc@gmail.com" style={{ color: T.tealLight, textDecoration: 'none' }}>aekilicc@gmail.com</a> within 14 days of the transaction.
          </Section>
        </div>

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
