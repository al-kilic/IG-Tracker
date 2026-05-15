'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { T } from '@/components/landing/tokens';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LandingFooter } from '@/components/landing/FinalCTA';

const TOPICS = [
  { id: 'bug',     label: 'Bug report',        desc: 'Something is broken or not working as expected' },
  { id: 'feature', label: 'Feature request',   desc: 'Something you want WhoUnfollowed to do' },
  { id: 'privacy', label: 'Privacy question',  desc: 'Questions about data handling or this policy' },
  { id: 'press',   label: 'Press / media',     desc: 'Journalist or publication inquiry' },
  { id: 'other',   label: 'Anything else',     desc: 'Whatever is on your mind' },
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

export default function ContactPage() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const EMAIL = 'aekilicc@gmail.com';

  function copyEmail() {
    navigator.clipboard.writeText(EMAIL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const subject = selectedTopic
    ? `[${TOPICS.find(t => t.id === selectedTopic)?.label}] WhoUnfollowed`
    : 'WhoUnfollowed';

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: T.sans }}>
      <Nav />

      <main className="px-4 sm:px-8" style={{ maxWidth: 640, margin: '0 auto', paddingTop: 64, paddingBottom: 96 }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 10, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 16 }}>Contact</div>
          <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.03em', color: T.ink, marginBottom: 16 }}>
            Get in touch.
          </h1>
          <p style={{ fontSize: 15, color: T.inkDim, lineHeight: 1.65 }}>
            One person reads every email. Response time is usually within 24 hours.
          </p>
        </div>

        {/* Topic selector */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, color: T.inkMute, fontFamily: T.mono, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>What is this about?</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {TOPICS.map(topic => {
              const active = selectedTopic === topic.id;
              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(active ? null : topic.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                    borderRadius: 12, cursor: 'pointer', textAlign: 'left',
                    background: active ? 'rgba(2,136,143,0.08)' : T.surface1,
                    border: `1px solid ${active ? 'rgba(2,136,143,0.3)' : T.border1}`,
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: active ? T.tealMid : T.border2, flexShrink: 0, transition: 'background 0.15s' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: active ? 600 : 400, color: active ? T.ink : T.inkDim, fontFamily: T.sans, marginBottom: 2 }}>{topic.label}</div>
                    <div style={{ fontSize: 12, color: T.inkMute }}>{topic.desc}</div>
                  </div>
                  {active && <span style={{ fontSize: 16, color: T.tealMid, lineHeight: 1 }}>✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Email card */}
        <div style={{ borderRadius: 16, background: T.bgCard, border: `1px solid ${T.border1}`, overflow: 'hidden', marginBottom: 32 }}>
          <div style={{ padding: '20px 22px 16px' }}>
            <div style={{ fontSize: 11, color: T.inkMute, fontFamily: T.mono, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Email</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: T.mono, fontSize: 15, color: T.ink }}>{EMAIL}</span>
              <button
                onClick={copyEmail}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, border: `1px solid ${T.border2}`, background: T.surface1, color: copied ? T.tealLight : T.inkMute, fontSize: 12, fontFamily: T.mono, cursor: 'pointer', transition: 'all 0.15s' }}
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>
          <div style={{ padding: '14px 22px', borderTop: `1px solid ${T.border1}`, background: T.surface1 }}>
            <a
              href={`mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 20px', borderRadius: 10,
                background: T.teal, color: T.cream, textDecoration: 'none',
                fontSize: 13, fontWeight: 600, fontFamily: T.sans,
                boxShadow: `0 4px 16px ${T.tealGlow}`,
              }}
            >
              Open in mail app
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M3 7H11M11 7L8 4M11 7L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
            {selectedTopic && (
              <span style={{ fontSize: 12, color: T.inkMute, marginLeft: 12, fontFamily: T.mono }}>
                Subject pre-filled
              </span>
            )}
          </div>
        </div>

        {/* Response expectations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 48 }}>
          {[
            { label: 'Bug reports', detail: 'Acknowledged within 24h. Fix timeline depends on severity.' },
            { label: 'Feature requests', detail: 'Read every one. Not all are built, but all are considered.' },
            { label: 'Privacy questions', detail: 'Responded same day when possible.' },
            { label: 'Press inquiries', detail: 'Happy to respond. Please include publication name.' },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', gap: 12, padding: '12px 16px', borderRadius: 10, background: T.surface1, border: `1px solid ${T.border1}` }}>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: T.tealMid, flexShrink: 0, marginTop: 6 }} />
              <div>
                <span style={{ fontSize: 13, fontWeight: 600, color: T.ink, fontFamily: T.sans }}>{row.label}: </span>
                <span style={{ fontSize: 13, color: T.inkDim }}>{row.detail}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ paddingTop: 28, borderTop: `1px solid ${T.border1}` }}>
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
