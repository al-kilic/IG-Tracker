'use client';

import { useState } from 'react';
import Link from 'next/link';
import { T } from '@/components/landing/tokens';
import { LandingFooter } from '@/components/landing/FinalCTA';

// ─── Shared CTA card ─────────────────────────────────────────────────────────

function ZipCTA() {
  return (
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
  );
}

export function HowToExportContent() {
  const [tab, setTab] = useState<'device' | 'drive'>('device');

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: T.sans }}>
      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px', borderBottom: '1px solid var(--t-border1)', position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(14px)', background: 'var(--t-navBg)' }}>
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
          <p style={{ fontSize: 16, color: T.inkDim, lineHeight: 1.6, maxWidth: 560, marginBottom: 12 }}>
            Instagram lets you export your followers and following list directly. Pick the method that works for you.
          </p>
          <Link href="/what-is-whounfollowed" style={{ fontSize: 13, color: T.inkDim, textDecoration: 'none', borderBottom: '1px solid var(--t-border3)', paddingBottom: 1 }}>
            New here? Learn what WhoUnfollowed does →
          </Link>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 40, padding: 4, borderRadius: 14, background: 'var(--t-surface2)', border: '1px solid var(--t-border1)', width: 'fit-content' }}>
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
              <Step n={1} title="Go to Instagram Accounts Center">
                <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.65 }}>
                  You can do this on any device - phone, tablet, or desktop browser. The quickest way is to go directly to{' '}
                  <a href="https://accountscenter.instagram.com/info_and_permissions/dyi/" target="_blank" rel="noopener noreferrer" style={{ color: T.tealLight, textDecoration: 'none', fontWeight: 600 }}>
                    accountscenter.instagram.com
                  </a>
                  . Or navigate there manually: open Instagram, go to your <Kbd>Profile</Kbd>, then <Kbd>Settings and privacy</Kbd>, then <Kbd>Accounts Center</Kbd>.
                </p>
                <a href="https://accountscenter.instagram.com/info_and_permissions/dyi/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 10, background: 'rgba(2,136,143,0.1)', border: '1px solid rgba(2,136,143,0.3)', color: T.tealLight, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                  Open Instagram Accounts Center
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M3 7H11M11 7L8 4M11 7L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
                <NavPath steps={['Profile', 'Settings and privacy', 'Accounts Center']} />
              </Step>

              <Step n={2} title="Open Your Information and Permissions">
                <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.65 }}>Inside Accounts Center, tap or click <Kbd>Your information and permissions</Kbd>.</p>
                <NavPath steps={['Accounts Center', 'Your information and permissions']} />
              </Step>

              <Step n={3} title="Go to Export Your Information">
                <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.65 }}>Tap <Kbd>Export your information</Kbd>. You&apos;ll see two options. Choose <Kbd>Export to device</Kbd> (not &quot;Transfer to destination&quot;).</p>
                <NavPath steps={['Your information and permissions', 'Export your information', 'Export to device']} />
              </Step>

              <Step n={4} title="Select only Followers and Following">
                <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.65 }}>
                  Tap <Kbd>Create export</Kbd>. Select your Instagram account, choose &quot;Download to device&quot;, then under <Kbd>Customize information</Kbd> deselect everything and check only <strong style={{ color: T.ink }}>Followers and Following</strong>. When asked for a date range, select <strong style={{ color: T.ink }}>All time</strong> - any shorter range will only export recent followers, not your full list.
                </p>
                <div style={{ borderRadius: 14, border: '1px solid var(--t-border2)', background: 'var(--t-surface1)', overflow: 'hidden' }}>
                  <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--t-border1)', fontSize: 11, color: T.inkMute, fontFamily: T.mono, letterSpacing: '0.1em' }}>CUSTOMIZE INFORMATION - SELECT ONLY:</div>
                  {[{ label: 'Followers and Following', checked: true },{ label: 'Posts', checked: false },{ label: 'Stories', checked: false },{ label: 'Messages', checked: false },{ label: 'Comments', checked: false }].map((item, i) => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderBottom: i < 4 ? '1px solid var(--t-surface2)' : 'none', background: item.checked ? 'rgba(2,136,143,0.06)' : 'transparent' }}>
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
                <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.65 }}>Instagram will ask for a format. Choose <strong style={{ color: T.ink }}>JSON</strong>, not HTML. JSON includes timestamps and our parser handles it fully.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div style={{ padding: '14px 16px', borderRadius: 12, border: `2px solid ${T.tealMid}`, background: 'rgba(2,136,143,0.08)' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: T.tealLight, marginBottom: 4 }}>JSON</div>
                    <div style={{ fontSize: 12, color: T.inkDim }}>Recommended. Includes timestamps.</div>
                  </div>
                  <div style={{ padding: '14px 16px', borderRadius: 12, border: '1px solid var(--t-border2)', background: 'var(--t-surface1)', opacity: 0.5 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: T.inkDim, marginBottom: 4 }}>HTML</div>
                    <div style={{ fontSize: 12, color: T.inkMute }}>No timestamps</div>
                  </div>
                </div>
                <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.65 }}>Then tap <Kbd>Start export</Kbd>. Instagram will process your request in the background.</p>
              </Step>

              <Step n={6} title="Download the ZIP from your email">
                <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.65 }}>Within <strong style={{ color: T.ink }}>a few minutes</strong>, Instagram sends an email with a download link. Tap the link and download the ZIP to your device.</p>
                <div style={{ padding: '16px', borderRadius: 14, border: '1px solid var(--t-border2)', background: 'var(--t-surface1)', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(2,136,143,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke={T.tealMid} strokeWidth="1.5"/><path d="M3 8 L12 13 L21 8" stroke={T.tealMid} strokeWidth="1.5" strokeLinecap="round"/></svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>Your Instagram data is ready</div>
                    <div style={{ fontSize: 11, color: T.inkMute, marginTop: 2 }}>From: security-noreply@instagram.com</div>
                    <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--t-border2)', fontSize: 11, color: T.inkDim, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>instagram-username-20260428.zip</div>
                      <div style={{ padding: '8px 14px', borderRadius: 8, background: T.tealMid, fontSize: 11, fontWeight: 600, color: T.cream, whiteSpace: 'nowrap' }}>Download</div>
                    </div>
                  </div>
                </div>
              </Step>
            </div>

            <div style={{ marginTop: 32 }}>
              <Callout variant="warning">The download link <strong>expires in 4 days</strong>. Download the ZIP as soon as you get the email.</Callout>
            </div>
            <ZipCTA />
          </>
        )}

        {/* ── TAB: EXPORT TO GOOGLE DRIVE ── */}
        {tab === 'drive' && (
          <>
            <Callout variant="tip">
              Instagram can automatically send your data exports to Google Drive, Dropbox, and other platforms. Once set up, your data lands there on a schedule - no manual downloading needed.
            </Callout>

            <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 40 }}>
              <Step n={1} title="Go to Instagram Accounts Center">
                <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.65 }}>Works on any browser or device. Go directly to{' '}<a href="https://accountscenter.instagram.com/info_and_permissions/dyi/" target="_blank" rel="noopener noreferrer" style={{ color: T.tealLight, textDecoration: 'none', fontWeight: 600 }}>accountscenter.instagram.com</a>, or navigate via your profile to <Kbd>Settings and privacy</Kbd>, then <Kbd>Accounts Center</Kbd>.</p>
                <a href="https://accountscenter.instagram.com/info_and_permissions/dyi/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 10, background: 'rgba(2,136,143,0.1)', border: '1px solid rgba(2,136,143,0.3)', color: T.tealLight, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                  Open Instagram Accounts Center
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M3 7H11M11 7L8 4M11 7L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
                <NavPath steps={['Profile', 'Settings and privacy', 'Accounts Center']} />
              </Step>
              <Step n={2} title="Open Your Information and Permissions">
                <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.65 }}>Inside Accounts Center, tap or click <Kbd>Your information and permissions</Kbd>.</p>
                <NavPath steps={['Accounts Center', 'Your information and permissions']} />
              </Step>
              <Step n={3} title='Choose "Transfer to destination"'>
                <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.65 }}>Tap <Kbd>Export your information</Kbd>. This time, choose <Kbd>Transfer to destination</Kbd> instead of &quot;Export to device&quot;.</p>
                <NavPath steps={['Your information and permissions', 'Export your information', 'Transfer to destination']} />
              </Step>
              <Step n={4} title="Connect your storage platform">
                <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.65 }}>Instagram will ask you to connect a destination. Choose your platform and follow the login steps to authorise access.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[{ name: 'Google Drive', note: 'Recommended' },{ name: 'Dropbox', note: 'Supported' },{ name: 'OneDrive', note: 'Supported' },{ name: 'Box', note: 'Supported' }].map((p) => (
                    <div key={p.name} style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid var(--t-border2)', background: 'var(--t-surface1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, color: T.ink, fontWeight: 500 }}>{p.name}</span>
                      <span style={{ fontSize: 10, color: p.note === 'Recommended' ? T.tealLight : T.inkMute, fontFamily: T.mono }}>{p.note}</span>
                    </div>
                  ))}
                </div>
              </Step>
              <Step n={5} title="Select Followers and Following, set date range to All time">
                <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.65 }}>Under <Kbd>Customize information</Kbd>, select only <strong style={{ color: T.ink }}>Followers and Following</strong>. Set the date range to <strong style={{ color: T.ink }}>All time</strong> to get your complete list.</p>
              </Step>
              <Step n={6} title="Start the transfer">
                <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.65 }}>Tap <Kbd>Start transfer</Kbd>. Instagram will send your data to the connected platform. You&apos;ll get a notification when it&apos;s ready - usually within a few minutes.</p>
                <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.65 }}>Once the ZIP appears in your cloud storage, download it and upload it here just like the device method.</p>
              </Step>
            </div>

            <div style={{ marginTop: 32 }}>
              <Callout variant="tip">You can set up recurring transfers so Instagram automatically sends fresh exports to your Drive on a schedule. This is the foundation of the automatic sync feature coming to WhoUnfollowed Pro.</Callout>
            </div>
            <ZipCTA />
          </>
        )}

        {/* ── SECTION A: How long does it take? ── */}
        <div style={{ marginTop: 72, paddingTop: 56, borderTop: '1px solid var(--t-border1)' }}>
          <div style={{ fontSize: 11, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.14em', marginBottom: 12 }}>TIMING</div>
          <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 400, letterSpacing: '-0.02em', color: T.ink, marginBottom: 20, lineHeight: 1.1 }}>How long does the export take?</h2>
          <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.7, marginBottom: 20 }}>Most exports arrive within 1–5 minutes. If yours has not appeared after 15 minutes, here is what to check:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            {[
              'Check your spam or promotions folder. Instagram sends from security-noreply@instagram.com',
              'Make sure you selected JSON format, not HTML - HTML exports sometimes take longer',
              'Instagram throttles export requests. If you requested recently, wait 14 days before trying again',
              'On rare occasions Instagram can take up to 48 hours, especially during high-traffic periods',
            ].map((item) => (
              <div key={item} style={{ display: 'flex', gap: 12, padding: '12px 16px', borderRadius: 10, background: 'var(--t-surface1)', border: '1px solid var(--t-border1)', fontSize: 14, color: T.inkDim, lineHeight: 1.6 }}>
                <span style={{ color: T.tealMid, flexShrink: 0, marginTop: 2 }}>·</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
          <Callout variant="warning">The download link in the email <strong>expires in 4 days</strong>. Download the ZIP as soon as it arrives.</Callout>
        </div>

        {/* ── SECTION B: What's inside the ZIP? ── */}
        <div style={{ marginTop: 72, paddingTop: 56, borderTop: '1px solid var(--t-border1)' }}>
          <div style={{ fontSize: 11, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.14em', marginBottom: 12 }}>FILE STRUCTURE</div>
          <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 400, letterSpacing: '-0.02em', color: T.ink, marginBottom: 20, lineHeight: 1.1 }}>What&apos;s actually inside the file you download?</h2>

          {/* Folder tree */}
          <div style={{ borderRadius: 14, border: '1px solid var(--t-border2)', background: 'var(--t-surface1)', overflow: 'hidden', marginBottom: 20 }}>
            <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--t-border1)', fontSize: 10, color: T.inkMute, fontFamily: T.mono, letterSpacing: '0.1em' }}>FOLDER STRUCTURE</div>
            <pre style={{ margin: 0, padding: '16px', fontFamily: T.mono, fontSize: 13, color: T.inkDim, lineHeight: 1.8, overflowX: 'auto' }}>{`instagram-username-20260428.zip
└── followers_and_following/
    ├── followers_1.json      ← everyone who follows you
    └── following.json        ← everyone you follow`}</pre>
          </div>

          <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.7, marginBottom: 20 }}>
            You only need this ZIP. You do not need to unzip it or open the files yourself. Just drop the ZIP on WhoUnfollowed and the parser reads it in your browser in about 2 seconds.
          </p>

          {/* JSON sample */}
          <div style={{ borderRadius: 14, border: '1px solid var(--t-border2)', background: 'var(--t-surface1)', overflow: 'hidden', marginBottom: 20 }}>
            <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--t-border1)', fontSize: 10, color: T.inkMute, fontFamily: T.mono, letterSpacing: '0.1em' }}>WHAT THE JSON LOOKS LIKE</div>
            <pre style={{ margin: 0, padding: '16px', fontFamily: T.mono, fontSize: 12, color: T.inkDim, lineHeight: 1.8, overflowX: 'auto' }}>{`[
  {
    "string_list_data": [{
      "value": "username",
      "timestamp": 1714512000
    }]
  }
]`}</pre>
          </div>

          <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.7, marginBottom: 32 }}>
            This is what our parser reads. The <code style={{ fontFamily: T.mono, fontSize: 13, color: T.tealLight, background: 'rgba(2,136,143,0.08)', padding: '1px 6px', borderRadius: 4 }}>timestamp</code> tells you exactly when someone followed you.
          </p>

          {/* Mini CTA */}
          <div style={{ padding: '20px 24px', borderRadius: 14, border: `1px solid rgba(2,136,143,0.25)`, background: 'rgba(2,136,143,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 14, color: T.inkDim }}>Got the ZIP?</span>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600, color: T.tealLight, textDecoration: 'none' }}>
              Drop it here
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M3 7H11M11 7L8 4M11 7L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </div>
        </div>

        {/* ── SECTION C: Troubleshooting ── */}
        <div style={{ marginTop: 72, paddingTop: 56, borderTop: '1px solid var(--t-border1)' }}>
          <div style={{ fontSize: 11, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.14em', marginBottom: 12 }}>TROUBLESHOOTING</div>
          <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 400, letterSpacing: '-0.02em', color: T.ink, marginBottom: 32, lineHeight: 1.1 }}>Common problems and how to fix them.</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              {
                q: "I didn't receive the Instagram export email",
                a: "Check your spam folder first. The sender is security-noreply@instagram.com. If it's not there after 15 minutes, go back to Accounts Center and confirm your request was submitted. Try requesting again - sometimes the first request silently fails.",
              },
              {
                q: "The download link in the email has expired",
                a: "Export links expire after 4 days. Go back to Accounts Center and request a new export. You'll get a fresh link within minutes.",
              },
              {
                q: "My export only shows recent followers, not my full list",
                a: "You selected the wrong date range. Go back and request again - under \"Date range\" select All time, not Last month or Last year. Any shorter range gives you a partial list.",
              },
              {
                q: "Instagram is asking me to export my full archive",
                a: "You navigated to the wrong option. Make sure you choose \"Export to device\" (not \"Transfer to destination\") and then under Customize information, deselect everything except Followers and Following.",
              },
              {
                q: "The ZIP file won't open or shows an error on WhoUnfollowed",
                a: "Make sure you're uploading the original ZIP Instagram sent - don't unzip and re-zip it, and don't rename the file. If you're on iOS, make sure you downloaded it with the Files app, not the Mail app.",
              },
            ].map((item, i, arr) => (
              <div key={item.q} style={{ padding: '24px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--t-border1)' : 'none' }}>
                <h3 style={{ fontFamily: T.serif, fontSize: 18, fontWeight: 400, color: T.ink, letterSpacing: '-0.01em', marginBottom: 10, lineHeight: 1.3 }}>{item.q}</h3>
                <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.7, margin: 0 }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── FAQ ── */}
        <div style={{ marginTop: 72, paddingTop: 56, borderTop: '1px solid var(--t-border1)' }}>
          <div style={{ fontSize: 11, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.14em', marginBottom: 12 }}>FAQ</div>
          <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 400, letterSpacing: '-0.02em', color: T.ink, marginBottom: 32, lineHeight: 1.1 }}>Frequently asked questions.</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              {
                q: "Does requesting an Instagram data export notify my followers?",
                a: "No. The export is completely private. Your followers have no way of knowing you requested or downloaded your data.",
              },
              {
                q: "How often can I request an Instagram data export?",
                a: "Instagram allows one export request approximately every 14 days per account.",
              },
              {
                q: "Is it safe to request my Instagram data export?",
                a: "Yes. It is an official Instagram feature required under GDPR. No third-party app is involved at any point.",
              },
              {
                q: "What format should I choose - JSON or HTML?",
                a: "Always choose JSON. It includes timestamps showing when each person followed you, and it's the format our parser is built for. HTML is only for human reading and contains less data.",
              },
              {
                q: "Can I request an Instagram data export on desktop?",
                a: "Yes. Go to accountscenter.instagram.com → Your information and permissions → Export your information. The process is identical to mobile.",
              },
              {
                q: "Why do I only need the Followers and Following export, not my full archive?",
                a: "The full Instagram archive can be several gigabytes and takes much longer. Followers and Following is a small, focused export - usually under 1MB - and ready in minutes.",
              },
            ].map((item, i, arr) => (
              <div key={item.q} style={{ padding: '20px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--t-border1)' : 'none' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.ink, marginBottom: 8, lineHeight: 1.4 }}>{item.q}</div>
                <div style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.7 }}>{item.a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Second CTA */}
        <ZipCTA />

        <div style={{ marginTop: 40, paddingTop: 32, borderTop: '1px solid var(--t-border1)' }}>
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
    <button onClick={onClick} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: active ? 600 : 400, background: active ? T.teal : 'transparent', color: active ? T.cream : T.inkDim, transition: 'all 0.15s ease', fontFamily: 'inherit' }}>
      {children}
    </button>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 20 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: T.teal, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.mono, fontSize: 13, fontWeight: 700, color: T.cream }}>{n}</div>
        <div style={{ flex: 1, width: 1, background: 'var(--t-border1)', minHeight: 24, marginTop: 8 }} />
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
          <span style={{ padding: '4px 10px', borderRadius: 6, background: 'var(--t-surface2)', border: '1px solid var(--t-border2)', fontSize: 12, color: T.inkDim, fontFamily: T.mono }}>{step}</span>
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
        {isTip ? <><circle cx="12" cy="12" r="9" stroke={T.tealMid} strokeWidth="1.5"/><path d="M12 8 V12 M12 15.5 V16" stroke={T.tealMid} strokeWidth="1.8" strokeLinecap="round"/></> : <><path d="M12 4 L21 20 H3 Z" stroke={T.terra} strokeWidth="1.5" strokeLinejoin="round"/><path d="M12 10 V14 M12 17 V17.5" stroke={T.terra} strokeWidth="1.8" strokeLinecap="round"/></>}
      </svg>
      <p style={{ margin: 0 }}>{children}</p>
    </div>
  );
}

import type React from 'react';
