'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';

type Phase = 'idle' | 'falling' | 'rising';

const DURATION = 480;
const EASING = 'cubic-bezier(0.76, 0, 0.24, 1)';

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="1"  x2="12" y2="3"  />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22"  y1="4.22"  x2="5.64"  y2="5.64"  />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1"  y1="12" x2="3"  y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36" />
      <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"  />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<Phase>('idle');
  const [hovered, setHovered] = useState(false);
  const curtainColor = useRef('');

  useEffect(() => { setMounted(true); }, []);

  const toggle = useCallback(() => {
    if (phase !== 'idle') return;
    const next = resolvedTheme === 'dark' ? 'light' : 'dark';
    curtainColor.current = next === 'light' ? '#f4f0e8' : '#0d0d0d';
    setPhase('falling');
    setTimeout(() => {
      setTheme(next);
      setPhase('rising');
      setTimeout(() => setPhase('idle'), DURATION + 80);
    }, DURATION);
  }, [phase, resolvedTheme, setTheme]);

  // Placeholder keeps nav layout stable during SSR
  if (!mounted) {
    return <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0 }} />;
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <>
      {/* Full-screen curtain wipe */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0,
          background: curtainColor.current,
          transformOrigin: 'top',
          transform: phase === 'falling' ? 'scaleY(1)' : 'scaleY(0)',
          transition: phase !== 'idle' ? `transform ${DURATION}ms ${EASING}` : 'none',
          zIndex: 9997,
          pointerEvents: 'none',
        }}
      />

      {/* Toggle button */}
      <button
        onClick={toggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        aria-pressed={isDark}
        style={{
          width: 32, height: 32,
          borderRadius: '50%',
          border: `1px solid var(--t-border2)`,
          background: `var(--t-surface2)`,
          color: 'var(--t-ink)',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          transform: hovered ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.15s ease',
          outline: 'none',
        }}
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
      </button>
    </>
  );
}
