'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { T } from './tokens';
import { Icon } from './atoms';
import { ThemeToggle } from '@/components/ThemeToggle';

function HowItWorksDropdown() {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleEnter() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }
  function handleLeave() {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }

  return (
    <div style={{ position: 'relative' }} onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
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
        <>
          {/* Transparent bridge fills the gap so mouse doesn't leave the hover zone */}
          <div style={{ position: 'absolute', top: '100%', left: '-20px', right: '-20px', height: 10 }} />
          <div style={{
            position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
            marginTop: 6, width: 210, borderRadius: 12,
            background: T.overlay,
            border: `1px solid ${T.overlayBorder}`,
            boxShadow: '0 16px 48px rgba(0,0,0,0.22)', padding: '8px',
            zIndex: 200,
          }}>
            <div style={{
              position: 'absolute', top: -5, left: '50%',
              width: 10, height: 10, background: T.overlay,
              border: `1px solid ${T.overlayBorder}`, borderBottom: 'none', borderRight: 'none',
              transform: 'translateX(-50%) rotate(45deg)',
            }} />
            <Link href="/how-to-export"
              style={{ display: 'block', padding: '9px 12px', borderRadius: 8, fontSize: 13, color: T.inkDim, textDecoration: 'none', transition: 'all 0.15s' }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.background = T.surface2; e.currentTarget.style.color = T.ink; }}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.inkDim; }}>
              How to Export Your Data
            </Link>
            <a
              href="https://accountscenter.instagram.com/info_and_permissions/dyi/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 12px', borderRadius: 8, fontSize: 13, color: T.tealLight, textDecoration: 'none', transition: 'all 0.15s' }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.background = 'rgba(2,136,143,0.08)'; }}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                <path d="M3 7H11M11 7L8 4M11 7L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Export on Instagram
            </a>
          </div>
        </>
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
          borderBottom: `1px solid ${T.border1}`,
          backdropFilter: 'blur(14px)',
          background: T.navBg,
          transition: 'background 0.3s ease, border-color 0.3s ease',
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
        <div className="hidden sm:flex items-center" style={{ gap: 32, fontSize: 13, color: T.inkDim }}>
          <a href="/what-is-whounfollowed" style={{ cursor: 'pointer', color: 'inherit', textDecoration: 'none', whiteSpace: 'nowrap' }}>What is WhoUnfollowed?</a>
          <HowItWorksDropdown />
          <a href="/privacy" style={{ cursor: 'pointer', color: 'inherit', textDecoration: 'none' }}>Privacy</a>
          <a
            href="https://github.com/al-kilic/IG-Tracker"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: T.ink, padding: '7px 14px', border: `1px solid ${T.border3}`, borderRadius: 9, textDecoration: 'none' }}
          >
            <Icon.gh size={13} color={T.ink} />
          </a>
          <ThemeToggle />
        </div>

        {/* Mobile: toggle + hamburger */}
        <div className="sm:hidden flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.ink, padding: 6, lineHeight: 0 }}
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
        </div>
      </nav>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div
          className="sm:hidden sticky z-[99]"
          style={{
            top: 65,
            background: T.navBg,
            backdropFilter: 'blur(14px)',
            borderBottom: `1px solid ${T.border1}`,
            padding: '20px 24px',
            display: 'flex', flexDirection: 'column', gap: 20,
          }}
        >
          <a href="#flow" onClick={() => setMenuOpen(false)} style={{ fontSize: 16, color: T.inkDim, textDecoration: 'none' }}>How It Works</a>
          <Link href="/how-to-export" onClick={() => setMenuOpen(false)} style={{ fontSize: 16, color: T.inkDim, textDecoration: 'none' }}>How to Export Your Data</Link>
          <a href="https://accountscenter.instagram.com/info_and_permissions/dyi/" target="_blank" rel="noopener noreferrer" style={{ fontSize: 16, color: T.tealLight, textDecoration: 'none' }}>
            Export on Instagram ↗
          </a>
          <Link href="/what-is-whounfollowed" onClick={() => setMenuOpen(false)} style={{ fontSize: 16, color: T.inkDim, textDecoration: 'none' }}>What is WhoUnfollowed?</Link>
          <a href="/privacy" onClick={() => setMenuOpen(false)} style={{ fontSize: 16, color: T.inkDim, textDecoration: 'none' }}>Privacy</a>
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
