'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { T } from './tokens';
import { Icon } from './atoms';

function HowItWorksDropdown() {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <a
        href="#flow"
        style={{
          cursor: 'pointer', color: open ? T.ink : 'inherit', textDecoration: 'none',
          display: 'inline-flex', alignItems: 'center', gap: 4, transition: 'color 0.15s',
        }}
      >
        How It Works
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ opacity: 0.5, marginTop: 1 }}>
          <path d="M2 3.5 L5 6.5 L8 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </a>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
          marginTop: 10, width: 200, borderRadius: 12,
          background: 'rgba(16,20,20,0.98)', border: '1px solid rgba(244,240,232,0.1)',
          boxShadow: '0 16px 48px rgba(0,0,0,0.5)', padding: '8px',
          zIndex: 200,
        }}>
          <div style={{
            position: 'absolute', top: -5, left: '50%',
            width: 10, height: 10, background: 'rgba(16,20,20,0.98)',
            border: '1px solid rgba(244,240,232,0.1)', borderBottom: 'none', borderRight: 'none',
            transform: 'translateX(-50%) rotate(45deg)',
          }} />
          <a href="#flow" style={{ display: 'block', padding: '9px 12px', borderRadius: 8, fontSize: 13, color: T.inkDim, textDecoration: 'none', transition: 'all 0.15s' }}
            onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.background = 'rgba(244,240,232,0.05)'; e.currentTarget.style.color = T.ink; }}
            onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.inkDim; }}>
            How It Works
          </a>
          <Link href="/how-to-export" style={{ display: 'block', padding: '9px 12px', borderRadius: 8, fontSize: 13, color: T.inkDim, textDecoration: 'none', transition: 'all 0.15s' }}
            onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.background = 'rgba(244,240,232,0.05)'; e.currentTarget.style.color = T.ink; }}
            onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.inkDim; }}>
            How to Export Your Data
          </Link>
        </div>
      )}
    </div>
  );
}

export function SiteNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav
        className="flex items-center justify-between px-4 sm:px-12 py-5 sticky top-0 z-[100]"
        style={{
          borderBottom: `1px solid rgba(244,240,232,0.05)`,
          backdropFilter: 'blur(14px)',
          background: 'rgba(13,13,13,0.7)',
        }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img
            src="/logo.png"
            alt="WhoUnfollowed Logo"
            width={28}
            height={28}
            style={{ borderRadius: 8, boxShadow: `0 4px 14px ${T.tealGlow}`, objectFit: 'contain' }}
          />
          <span style={{ fontFamily: T.serif, fontSize: 19, letterSpacing: '-0.01em', color: T.ink }}>WhoUnfollowed</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex" style={{ alignItems: 'center', gap: 32, fontSize: 13, color: T.inkDim }}>
          <HowItWorksDropdown />
          <a href="/privacy" style={{ cursor: 'pointer', color: 'inherit', textDecoration: 'none' }}>Privacy</a>
          <a href="#pricing" style={{ cursor: 'pointer', color: 'inherit', textDecoration: 'none' }}>Pricing</a>
          <a
            href="https://github.com/al-kilic/IG-Tracker"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: T.ink, padding: '7px 14px', border: '1px solid rgba(244,240,232,0.12)', borderRadius: 9, textDecoration: 'none' }}
          >
            <Icon.gh size={13} color={T.ink} />
            <span>Star · 0</span>
          </a>
        </div>

        {/* Hamburger button */}
        <button
          className="sm:hidden"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.ink, padding: 8, lineHeight: 0 }}
        >
          {menuOpen ? (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M4 4 L18 18 M18 4 L4 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M3 7 H19 M3 11 H19 M3 15 H19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div
          className="sm:hidden sticky z-[99]"
          style={{
            top: 65,
            background: 'rgba(10,10,10,0.98)',
            borderBottom: '1px solid rgba(244,240,232,0.08)',
            padding: '20px 24px',
            display: 'flex', flexDirection: 'column', gap: 20,
          }}
        >
          <a href="#flow" onClick={() => setMenuOpen(false)} style={{ fontSize: 16, color: T.inkDim, textDecoration: 'none' }}>How It Works</a>
          <Link href="/how-to-export" onClick={() => setMenuOpen(false)} style={{ fontSize: 16, color: T.inkDim, textDecoration: 'none' }}>How to Export Your Data</Link>
          <a href="/privacy" onClick={() => setMenuOpen(false)} style={{ fontSize: 16, color: T.inkDim, textDecoration: 'none' }}>Privacy</a>
          <a href="#pricing" onClick={() => setMenuOpen(false)} style={{ fontSize: 16, color: T.inkDim, textDecoration: 'none' }}>Pricing</a>
          <a
            href="https://github.com/al-kilic/IG-Tracker"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 16, color: T.ink, textDecoration: 'none' }}
          >
            <Icon.gh size={16} color={T.ink} />
            GitHub
          </a>
        </div>
      )}
    </>
  );
}
