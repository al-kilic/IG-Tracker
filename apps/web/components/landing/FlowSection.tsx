import React from 'react';
import Link from 'next/link';
import { T } from './tokens';

// ─── Illustrations ─────────────────────────────────────────────────────────────

function FileShape({ x, y, ext }: { x: number; y: number; ext: string }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <path d="M0 0 L20 0 L26 6 L26 24 L0 24 Z" fill={T.teal} stroke={T.tealLight} strokeWidth="0.5"/>
      <path d="M20 0 L26 6 L20 6 Z" fill={T.bg} opacity="0.3"/>
      <text x="13" y="17" textAnchor="middle" fill={T.cream} fontFamily={T.mono} fontSize="6" fontWeight="700">.{ext.toUpperCase()}</text>
    </g>
  );
}

function IllRequest() {
  return (
    <svg width="100%" height="120" viewBox="0 0 220 120" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="phone-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1a1a"/>
          <stop offset="100%" stopColor="#0d0d0d"/>
        </linearGradient>
      </defs>
      <rect x="80" y="14" width="60" height="92" rx="10" fill="url(#phone-grad)" stroke="rgba(244,240,232,0.15)" strokeWidth="1"/>
      <rect x="86" y="22" width="48" height="70" rx="3" fill="rgba(244,240,232,0.04)"/>
      <rect x="90" y="28" width="40" height="6" rx="1.5" fill="rgba(244,240,232,0.15)"/>
      <rect x="90" y="38" width="32" height="6" rx="1.5" fill="rgba(244,240,232,0.1)"/>
      <rect x="90" y="48" width="40" height="6" rx="1.5" fill={T.tealMid}/>
      <rect x="90" y="58" width="28" height="6" rx="1.5" fill="rgba(244,240,232,0.1)"/>
      <rect x="90" y="68" width="36" height="6" rx="1.5" fill="rgba(244,240,232,0.1)"/>
      <circle cx="125" cy="51" r="10" fill="none" stroke={T.tealLight} strokeWidth="1" opacity="0.7" style={{ transformOrigin: '125px 51px', animation: 'pulse-ring 2s ease-out infinite' }}/>
    </svg>
  );
}

function IllEmail() {
  return (
    <svg width="100%" height="120" viewBox="0 0 220 120" style={{ display: 'block' }}>
      <rect x="60" y="32" width="100" height="64" rx="6" fill={T.bgPanel} stroke="rgba(244,240,232,0.15)" strokeWidth="1"/>
      <path d="M60 38 L110 70 L160 38" fill="none" stroke="rgba(244,240,232,0.18)" strokeWidth="1.2"/>
      <g style={{ animation: 'drift-1 3s ease-in-out infinite' }}>
        <circle cx="110" cy="58" r="14" fill={T.teal}/>
        <path d="M110 51 V64 M110 64 L106 60 M110 64 L114 60" stroke={T.cream} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <line x1="110" y1="76" x2="110" y2="92" stroke={T.tealLight} strokeWidth="1" strokeDasharray="2 2" opacity="0.6"/>
      <FileShape x={94} y={92} ext="zip"/>
    </svg>
  );
}

function IllDrop() {
  return (
    <svg width="100%" height="120" viewBox="0 0 220 120" style={{ display: 'block' }}>
      <rect x="60" y="50" width="100" height="60" rx="10" fill="none" stroke={T.tealMid} strokeWidth="1.2" strokeDasharray="4 4"/>
      <g style={{ animation: 'file-drop-1 3.4s ease-in-out infinite' }}>
        <FileShape x={92} y={28} ext="json"/>
      </g>
      <g style={{ animation: 'file-drop-2 3.4s ease-in-out 0.4s infinite' }}>
        <FileShape x={114} y={20} ext="json"/>
      </g>
      <ellipse cx="110" cy="105" rx="40" ry="4" fill={T.tealMid} opacity="0.3" style={{ animation: 'glow-soft 2s ease-in-out infinite' }}/>
    </svg>
  );
}

// ─── FlowStep ─────────────────────────────────────────────────────────────────

function FlowStep({
  n, title, body, illustration, eta, highlight = false,
}: {
  n: string;
  title: string;
  body: string;
  illustration: React.ReactNode;
  eta: string;
  highlight?: boolean;
}) {
  return (
    <div style={{
      position: 'relative', padding: '24px 24px 28px',
      background: highlight ? 'rgba(2,136,143,0.06)' : 'rgba(244,240,232,0.02)',
      border: `1px solid ${highlight ? 'rgba(2,136,143,0.3)' : 'rgba(244,240,232,0.06)'}`,
      borderRadius: 18, overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <span style={{ fontFamily: T.mono, fontSize: 11, color: highlight ? T.tealLight : T.tealMid, letterSpacing: '0.14em', fontWeight: 600 }}>{n}</span>
        <span style={{ fontSize: 10, color: T.inkMute, fontFamily: T.mono, padding: '2px 8px', border: `1px solid rgba(244,240,232,0.08)`, borderRadius: 20 }}>{eta}</span>
      </div>
      <div style={{ marginBottom: 16, marginLeft: -10, marginRight: -10 }}>{illustration}</div>
      <h3 style={{ fontFamily: T.serif, fontSize: 24, fontWeight: 400, lineHeight: 1.15, marginBottom: 8, letterSpacing: '-0.01em', color: T.ink }}>{title}</h3>
      <p style={{ fontSize: 13, color: T.inkDim, lineHeight: 1.6 }}>{body}</p>
    </div>
  );
}

// ─── FlowSection ──────────────────────────────────────────────────────────────

export function FlowSection() {
  return (
    <section id="flow" style={{ padding: '0 48px 120px', position: 'relative' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 14 }}>
          <span style={{ fontFamily: T.mono, fontSize: 11, color: T.tealMid, letterSpacing: '0.18em' }}>03 / FLOW</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(244,240,232,0.08)' }} />
        </div>
        <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 400, lineHeight: 1.0, letterSpacing: '-0.03em', marginBottom: 56, color: T.ink }}>
          Your Instagram export,{' '}
          <span style={{ fontStyle: 'italic', color: T.tealLight }}>ready in minutes.</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18, marginBottom: 24 }}>
          <FlowStep
            n="01" title="Export your data from Instagram"
            body="Go to Instagram → Settings → Accounts Center → Your Information &amp; Permissions → Export Your Information. Select Followers &amp; Following. Set date range to All time, then hit request."
            illustration={<IllRequest />} eta="~30 sec"
          />
          <FlowStep
            n="02" title="Instagram emails you the file"
            body="Within minutes, Instagram sends you a download link. You don't need the full archive, just the followers &amp; following export is enough."
            illustration={<IllEmail />} eta="few min"
          />
          <FlowStep
            n="03" title="Drop the ZIP and see your list instantly"
            body="Drag the ZIP onto this page. Your browser reads it locally, computes who doesn't follow you back, and shows you the full list. Nothing leaves your device."
            illustration={<IllDrop />} eta="~2 sec" highlight
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <p style={{ fontSize: 13, color: T.inkMute, margin: 0 }}>Not sure how to get your Instagram export?</p>
          <Link href="/how-to-export" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: T.cream, textDecoration: 'none', padding: '13px 24px', borderRadius: 12, background: T.teal, boxShadow: `0 4px 20px ${T.tealGlow}` }}>
            Step-by-step export guide
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7 H11 M11 7 L8 4 M11 7 L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
