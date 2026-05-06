'use client';

import { useState } from 'react';
import Link from 'next/link';
import { T } from '@/components/landing/tokens';
import { LandingFooter } from '@/components/landing/FinalCTA';

export default function HowToExportPage() {
  const [tab, setTab] = useState<'device' | 'drive'>('device');

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
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 11, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.14em', marginBottom: 14 }}>STEP-BY-STEP GUIDE</div>
          <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.03em', color: T.ink, marginBottom: 16 }}>
            How to get your Instagram data.
          </h1>
          <p style={{ fontSize: 16, color: T.inkDim, lineHeight: 1.6, maxWidth: 560 }}>
            Instagram lets you export your followers and following list directly. Pick the method that works for you.
          </p>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 40, padding: 4, borderRadius: 14, background: 'rgba(244,240,232,0.04)', border: '1px solid rgba(244,240,232,0.06)', width: 'fit-content' }}>
          <TabButton active={tab === 'device'} onClick={() => setTab('device')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 16 V8 M12 8 L9 11 M12 8 L15 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.5"/></svg>
            Download to device
          </TabButton>
          <TabButton active={tab === 'drive'} onClick={() => setTab('drive')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 17 L8.5 7 L14 17 H3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M14 17 L19.5 7 M8.5 7 H19.5 L22 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Export to Google Drive
          </TabButton>
        </div>

        {/* ── TAB: DOWNLOAD TO DEVICE ── */}
        {tab === 'device' && (
          <>
            <Callout variant="tip">
              Only request <strong>Followers and Following</strong>, not your entire Instagram history. A focused export is ready in under 2 minutes.
            </Callout>

            <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 40 }}>
              <Step n={1} title="Open Instagram and go to Settings">
                <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.65 }}>
                  Open the <Kbd>Instagram app</Kbd> on your phone. Tap your <Kbd>profile picture</Kbd> in the bottom-right, then tap the <Kbd>hamburger menu (☰)</Kbd> in the top-right corner. Select <Kbd>Settings and privacy</Kbd>.
                </p>
                <NavPath steps={['Profile', 'Menu (☰)', 'Settings and privacy']} />
              </Step>

              <Step n={2} title="Open Accounts Center">
                <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.65 }}>
                  Inside Settings, scroll down and tap <Kbd>Accounts Center</Kbd>. Inside, tap <Kbd>Your information and permissions</Kbd>.
                </p>
                <NavPath steps={['Settings and privacy', 'Accounts Center', 'Your information and permissions']} />
              </Step>

              <Step n={3} title="Go to Export Your Information">
                <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.65 }}>
                  Tap <Kbd>Export your information</Kbd>. You'll see two options. Choose <Kbd>Export to device</Kbd> (not "Transfer to destination").
                </p>
                <NavPath steps={['Your information and permissions', 'Export your information', 'Export to device']} />
              </Step>

              <Step n={4} title="Select only Followers and Following">
                <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.65 }}>
                  Tap <Kbd>Create export</Kbd>. Select your Instagram account, choose "Download to device", then under <Kbd>Customize information</Kbd> deselect everything and check only <strong style={{ color: T.ink }}>Followers and Following</strong>. When asked for a date range, select <strong style={{ color: T.ink }}>All time</strong> — any shorter range will only export recent followers, not your full list.
                </p>
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
                  Within <strong style={{ color: T.ink }}>a few minutes</strong>, Instagram sends an email with a download link. Tap the link and download the ZIP to your device.
                </p>
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

            <div style={{ marginTop: 32 }}>
              <Callout variant="warning">
                The download link <strong>expires in 4 days</strong>. Download the ZIP as soon as you get the email.
              </Callout>
            </div>

            <div style={{ marginTop: 56, padding: '32px 36px', borderRadius: 20, border: `1px solid rgba(2,136,143,0.3)`, background: 'rgba(2,136,143,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontFamily: T.serif, fontSize: 24, color: T.ink, letterSpacing: '-0.01em', marginBottom: 6 }}>Got the ZIP?</div>
                <div style={{ fontSize: 14, color: T.inkDim }}>Drop it on the home page. Parsed in your browser. Nothing leaves your device.</div>
              </div>
              <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 22px', borderRadius: 12, background: T.teal, color: T.cream, fontSize: 14, fontWeight: 600, textDecoration: 'none', fontFamily: T.sans, whiteSpace: 'nowrap' }}>
                Upload your ZIP now
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7 H11 M11 7 L8 4 M11 7 L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
            </div>
          </>
        )}

        {/* ── TAB: EXPORT TO GOOGLE DRIVE ── */}
        {tab === 'drive' && (
          <>
            <Callout variant="tip">
              Instagram can automatically send your data exports to Google Drive, Dropbox, and other platforms. Once set up, your data lands there on a schedule — no manual downloading needed.
            </Callout>

            <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 40 }}>
              <Step n={1} title="Open Instagram and go to Settings">
                <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.65 }}>
                  Open the <Kbd>Instagram app</Kbd>. Tap your <Kbd>profile picture</Kbd>, then the <Kbd>hamburger menu (☰)</Kbd>, then <Kbd>Settings and privacy</Kbd>.
                </p>
                <NavPath steps={['Profile', 'Menu (☰)', 'Settings and privacy']} />
              </Step>

              <Step n={2} title="Open Accounts Center">
                <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.65 }}>
                  Scroll down and tap <Kbd>Accounts Center</Kbd>, then tap <Kbd>Your information and permissions</Kbd>.
                </p>
                <NavPath steps={['Settings and privacy', 'Accounts Center', 'Your information and permissions']} />
              </Step>

              <Step n={3} title='Choose "Transfer to destination"'>
                <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.65 }}>
                  Tap <Kbd>Export your information</Kbd>. This time, choose <Kbd>Transfer to destination</Kbd> instead of "Export to device".
                </p>
                <NavPath steps={['Your information and permissions', 'Export your information', 'Transfer to destination']} />
              </Step>

              <Step n={4} title="Connect your storage platform">
                <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.65 }}>
                  Instagram will ask you to connect a destination. Choose your platform and follow the login steps to authorise access.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[
                    { name: 'Google Drive', note: 'Recommended' },
                    { name: 'Dropbox', note: 'Supported' },
                    { name: 'OneDrive', note: 'Supported' },
                    { name: 'Box', note: 'Supported' },
                  ].map((p) => (
                    <div key={p.name} style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid rgba(244,240,232,0.08)', background: 'rgba(244,240,232,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, color: T.ink, fontWeight: 500 }}>{p.name}</span>
                      <span style={{ fontSize: 10, color: p.note === 'Recommended' ? T.tealLight : T.inkMute, fontFamily: T.mono }}>{p.note}</span>
                    </div>
                  ))}
                </div>
              </Step>

              <Step n={5} title="Select Followers and Following, set date range to All time">
                <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.65 }}>
                  Under <Kbd>Customize information</Kbd>, select only <strong style={{ color: T.ink }}>Followers and Following</strong>. Set the date range to <strong style={{ color: T.ink }}>All time</strong> to get your complete list.
                </p>
              </Step>

              <Step n={6} title="Start the transfer">
                <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.65 }}>
                  Tap <Kbd>Start transfer</Kbd>. Instagram will send your data to the connected platform. You'll get a notification when it's ready — usually within a few minutes.
                </p>
                <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.65 }}>
                  Once the ZIP appears in your cloud storage, download it and upload it here just like the device method.
                </p>
              </Step>
            </div>

            <div style={{ marginTop: 32 }}>
              <Callout variant="tip">
                You can set up recurring transfers so Instagram automatically sends fresh exports to your Drive on a schedule. This is the foundation of the automatic sync feature coming to WhoUnfollowed Pro.
              </Callout>
            </div>

            <div style={{ marginTop: 56, padding: '32px 36px', borderRadius: 20, border: `1px solid rgba(2,136,143,0.3)`, background: 'rgba(2,136,143,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontFamily: T.serif, fontSize: 24, color: T.ink, letterSpacing: '-0.01em', marginBottom: 6 }}>Got the ZIP?</div>
                <div style={{ fontSize: 14, color: T.inkDim }}>Drop it on the home page. Parsed in your browser. Nothing leaves your device.</div>
              </div>
              <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 22px', borderRadius: 12, background: T.teal, color: T.cream, fontSize: 14, fontWeight: 600, textDecoration: 'none', fontFamily: T.sans, whiteSpace: 'nowrap' }}>
                Upload your ZIP now
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7 H11 M11 7 L8 4 M11 7 L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
            </div>
          </>
        )}

        <div style={{ marginTop: 40, paddingTop: 32, borderTop: '1px solid rgba(244,240,232,0.06)' }}>
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

// ─── Sub-components ───────────────────────────────────────────────────────────

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        padding: '9px 16px', borderRadius: 10, border: 'none', cursor: 'pointer',
        fontSize: 13, fontWeight: active ? 600 : 400,
        background: active ? T.teal : 'transparent',
        color: active ? T.cream : T.inkDim,
        transition: 'all 0.15s ease',
        fontFamily: 'inherit',
      }}
    >
      {children}
    </button>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 20 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
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
      <p style={{ margin: 0 }}>{children}</p>
    </div>
  );
}

import type React from 'react';
