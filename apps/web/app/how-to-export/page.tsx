import Link from 'next/link';
import type { Metadata } from 'next';
import { T } from '@/components/landing/tokens';
import { LandingFooter } from '@/components/landing/FinalCTA';

export const metadata: Metadata = {
  title: 'How to Download Your Instagram Data',
  description:
    'Step-by-step guide to downloading your Instagram followers and following list — without sharing your password.',
};

export default function HowToExportPage() {
  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: T.sans }}>
      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px', borderBottom: '1px solid rgba(244,240,232,0.06)', position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(14px)', background: 'rgba(13,13,13,0.8)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="/logo.png" alt="WhoUnfollowed Logo" width={26} height={26} style={{ borderRadius: 7, objectFit: 'contain' }} />
          <span style={{ fontFamily: T.serif, fontSize: 17, color: T.ink }}>WhoUnfollowed</span>
        </Link>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 18px', borderRadius: 10, background: T.teal, color: T.cream, fontSize: 13, fontWeight: 600, textDecoration: 'none', fontFamily: T.sans }}>
          Upload ZIP
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M3 7 H11 M11 7 L8 4 M11 7 L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </Link>
      </nav>

      <main style={{ maxWidth: 720, margin: '0 auto', padding: '56px 32px 80px' }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.14em', marginBottom: 14 }}>STEP-BY-STEP GUIDE</div>
          <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.03em', color: T.ink, marginBottom: 16 }}>
            How to download your Instagram data.
          </h1>
          <p style={{ fontSize: 16, color: T.inkDim, lineHeight: 1.6, maxWidth: 560 }}>
            Instagram lets you export your own followers and following list directly from the app. The whole process takes about 2 minutes. No third-party tools, no password sharing.
          </p>
          <div style={{ marginTop: 20, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 100, border: '1px solid rgba(244,240,232,0.1)', background: 'rgba(244,240,232,0.03)', fontSize: 13, color: T.inkDim }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={T.tealMid} strokeWidth="1.5"/><path d="M12 7 V12 L15 15" stroke={T.tealMid} strokeWidth="1.5" strokeLinecap="round"/></svg>
            Takes about <strong style={{ color: T.ink, fontWeight: 600 }}>2–5 minutes</strong> total
          </div>
        </div>

        {/* Tip */}
        <Callout variant="tip">
          Only request <strong>Followers and Following</strong>, not your entire Instagram history. Requesting everything can take 48+ hours. A focused export is ready in under 2 minutes.
        </Callout>

        {/* Steps */}
        <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 40 }}>
          <Step n={1} title="Open Instagram and go to Settings">
            <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.65 }}>
              Open the <Kbd>Instagram app</Kbd> on your phone. Tap your <Kbd>profile picture</Kbd> in the bottom-right, then tap the <Kbd>hamburger menu (☰)</Kbd> in the top-right corner. Select <Kbd>Settings and privacy</Kbd>.
            </p>
            <NavPath steps={['Profile', 'Menu (☰)', 'Settings and privacy']} />
          </Step>

          <Step n={2} title="Open Accounts Center">
            <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.65 }}>
              Inside Settings, scroll down and tap <Kbd>Accounts Center</Kbd>. This is Meta's unified settings hub. Inside, tap <Kbd>Your information and permissions</Kbd>.
            </p>
            <NavPath steps={['Settings and privacy', 'Accounts Center', 'Your information and permissions']} />
          </Step>

          <Step n={3} title="Go to Export Your Information">
            <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.65 }}>
              Tap <Kbd>Export your information</Kbd>. You'll see two options. Choose <Kbd>Export to device</Kbd> (not "Transfer to destination").
            </p>
            <NavPath steps={['Your information and permissions', 'Export your information', 'Export to device']} />
          </Step>

          <Step n={4} title="Configure your export: select only Followers and Following">
            <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.65 }}>
              Tap <Kbd>Create export</Kbd>. Select your Instagram account, choose "Download to device", then under <Kbd>Customize information</Kbd> deselect everything and check only <strong style={{ color: T.ink }}>Followers and Following</strong>. When asked for a date range, select <strong style={{ color: T.ink }}>All time</strong> — any shorter range will only export recent followers, not your full list.
            </p>
            {/* Checkbox mock */}
            <div style={{ borderRadius: 14, border: '1px solid rgba(244,240,232,0.08)', background: 'rgba(244,240,232,0.02)', overflow: 'hidden' }}>
              <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(244,240,232,0.06)', fontSize: 11, color: T.inkMute, fontFamily: T.mono, letterSpacing: '0.1em' }}>CUSTOMIZE INFORMATION — SELECT ONLY:</div>
              {[
                { label: 'Followers and Following', checked: true },
                { label: 'Posts', checked: false },
                { label: 'Stories', checked: false },
                { label: 'Messages', checked: false },
                { label: 'Comments', checked: false },
              ].map((item, i) => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderBottom: i < 4 ? '1px solid rgba(244,240,232,0.04)' : 'none', background: item.checked ? 'rgba(2,136,143,0.06)' : 'transparent' }}>
                  <div style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${item.checked ? T.tealMid : 'rgba(244,240,232,0.2)'}`, background: item.checked ? T.tealMid : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {item.checked && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5 L4 7 L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <span style={{ fontSize: 13, color: item.checked ? T.ink : T.inkMute, fontWeight: item.checked ? 600 : 400 }}>{item.label}</span>
                  {item.checked && <span style={{ marginLeft: 'auto', fontSize: 10, color: T.tealLight, fontFamily: T.mono, padding: '2px 8px', borderRadius: 20, background: 'rgba(2,136,143,0.15)' }}>Required</span>}
                </div>
              ))}
            </div>
          </Step>

          <Step n={5} title='Choose JSON format, then tap "Start export"'>
            <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.65 }}>
              Instagram will ask for a format. Choose <strong style={{ color: T.ink }}>JSON</strong>, not HTML. JSON includes timestamps and our parser handles it fully.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={{ padding: '14px 16px', borderRadius: 12, border: `2px solid ${T.tealMid}`, background: 'rgba(2,136,143,0.08)' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.tealLight, marginBottom: 4 }}>JSON</div>
                <div style={{ fontSize: 12, color: T.inkDim }}>Recommended. Includes timestamps.</div>
              </div>
              <div style={{ padding: '14px 16px', borderRadius: 12, border: '1px solid rgba(244,240,232,0.08)', background: 'rgba(244,240,232,0.02)', opacity: 0.5 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: T.inkDim, marginBottom: 4 }}>HTML</div>
                <div style={{ fontSize: 12, color: T.inkMute }}>No timestamps</div>
              </div>
            </div>
            <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.65 }}>
              Then tap <Kbd>Start export</Kbd>. Instagram will process your request in the background.
            </p>
          </Step>

          <Step n={6} title="Download the ZIP from your email">
            <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.65 }}>
              Within <strong style={{ color: T.ink }}>a few minutes</strong>, Instagram usually sends an email to the address linked to your account with a download link. Tap the link, then download the ZIP to your device.
            </p>
            {/* Email mock */}
            <div style={{ padding: '16px', borderRadius: 14, border: '1px solid rgba(244,240,232,0.08)', background: 'rgba(244,240,232,0.02)', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(2,136,143,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke={T.tealMid} strokeWidth="1.5"/><path d="M3 8 L12 13 L21 8" stroke={T.tealMid} strokeWidth="1.5" strokeLinecap="round"/></svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>Your Instagram data is ready</div>
                <div style={{ fontSize: 11, color: T.inkMute, marginTop: 2 }}>From: security-noreply@instagram.com</div>
                <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(244,240,232,0.08)', fontSize: 11, color: T.inkDim, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>instagram-username-20260428.zip</div>
                  <div style={{ padding: '8px 14px', borderRadius: 8, background: T.tealMid, fontSize: 11, fontWeight: 600, color: T.cream, whiteSpace: 'nowrap' }}>Download</div>
                </div>
              </div>
            </div>
          </Step>
        </div>

        {/* Warning */}
        <div style={{ marginTop: 32 }}>
          <Callout variant="warning">
            The download link <strong>expires in 4 days</strong>. Download the ZIP to your device as soon as you get the email.
          </Callout>
        </div>

        {/* Bottom CTA */}
        <div style={{ marginTop: 56, padding: '32px 36px', borderRadius: 20, border: `1px solid rgba(2,136,143,0.3)`, background: 'rgba(2,136,143,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontFamily: T.serif, fontSize: 24, color: T.ink, letterSpacing: '-0.01em', marginBottom: 6 }}>Got the ZIP?</div>
            <div style={{ fontSize: 14, color: T.inkDim }}>Drop it on the home page. Parsed in your browser. No upload, no account.</div>
          </div>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 22px', borderRadius: 12, background: T.teal, color: T.cream, fontSize: 14, fontWeight: 600, textDecoration: 'none', fontFamily: T.sans, whiteSpace: 'nowrap' }}>
            Upload your ZIP now
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7 H11 M11 7 L8 4 M11 7 L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 20 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, flexShrink: 0 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: T.teal, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.mono, fontSize: 13, fontWeight: 700, color: T.cream }}>{n}</div>
        <div style={{ flex: 1, width: 1, background: 'rgba(244,240,232,0.07)', minHeight: 24, marginTop: 8 }} />
      </div>
      <div style={{ flex: 1, paddingBottom: 8, minWidth: 0 }}>
        <h2 style={{ fontFamily: T.serif, fontSize: 20, fontWeight: 400, color: T.ink, letterSpacing: '-0.01em', marginBottom: 14, lineHeight: 1.2 }}>{title}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
      </div>
    </div>
  );
}

function NavPath({ steps }: { steps: string[] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
      {steps.map((step, i) => (
        <span key={step} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ padding: '4px 10px', borderRadius: 6, background: 'rgba(244,240,232,0.04)', border: '1px solid rgba(244,240,232,0.08)', fontSize: 12, color: T.inkDim, fontFamily: T.mono }}>{step}</span>
          {i < steps.length - 1 && <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M3 7 H11 M11 7 L8 4 M11 7 L8 10" stroke={T.inkMute} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        </span>
      ))}
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return <strong style={{ color: T.ink, fontWeight: 600 }}>{children}</strong>;
}

function Callout({ variant, children }: { variant: 'warning' | 'tip'; children: React.ReactNode }) {
  const isTip = variant === 'tip';
  return (
    <div style={{ padding: '14px 18px', borderRadius: 12, border: `1px solid ${isTip ? 'rgba(2,136,143,0.3)' : 'rgba(168,75,47,0.3)'}`, background: isTip ? 'rgba(2,136,143,0.06)' : 'rgba(168,75,47,0.06)', display: 'flex', gap: 12, fontSize: 13, color: T.inkDim, lineHeight: 1.6 }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
        {isTip
          ? <><circle cx="12" cy="12" r="9" stroke={T.tealMid} strokeWidth="1.5"/><path d="M12 8 V12 M12 15.5 V16" stroke={T.tealMid} strokeWidth="1.8" strokeLinecap="round"/></>
          : <><path d="M12 4 L21 20 H3 Z" stroke={T.terra} strokeWidth="1.5" strokeLinejoin="round"/><path d="M12 10 V14 M12 17 V17.5" stroke={T.terra} strokeWidth="1.8" strokeLinecap="round"/></>
        }
      </svg>
      <p>{children}</p>
    </div>
  );
}

import type React from 'react';
