import React from 'react';
import { T } from './tokens';
import { Icon } from './atoms';

export function SiteNav() {
  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 48px',
      borderBottom: `1px solid rgba(244,240,232,0.05)`,
      position: 'sticky', top: 0, zIndex: 100,
      backdropFilter: 'blur(14px)',
      background: 'rgba(13,13,13,0.7)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: `linear-gradient(135deg, ${T.tealMid}, ${T.teal})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 4px 14px ${T.tealGlow}`,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M9 5 L4 10 L9 15 M20 10 H4" stroke={T.cream} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span style={{ fontFamily: T.serif, fontSize: 19, letterSpacing: '-0.01em', color: T.ink }}>IG&nbsp;Tracker</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 32, fontSize: 13, color: T.inkDim }}>
        <a href="#flow" style={{ cursor: 'pointer', color: 'inherit', textDecoration: 'none' }}>How it works</a>
        <a href="/privacy" style={{ cursor: 'pointer', color: 'inherit', textDecoration: 'none' }}>Privacy</a>
        <a href="#pricing" style={{ cursor: 'pointer', color: 'inherit', textDecoration: 'none' }}>Pricing</a>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: T.ink, padding: '7px 14px', border: '1px solid rgba(244,240,232,0.12)', borderRadius: 9, textDecoration: 'none' }}
        >
          <Icon.gh size={13} color={T.ink} />
          <span>Star · 0</span>
        </a>
      </div>
    </nav>
  );
}
