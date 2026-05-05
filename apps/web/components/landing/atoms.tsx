'use client';

import React from 'react';
import { T } from './tokens';

// ─── ProfileCard ──────────────────────────────────────────────────────────────

type FollowStatus = 'not_following_back' | 'mutual' | 'fan';

const STATUS_CFG: Record<FollowStatus, { label: string; color: string; dot: string }> = {
  not_following_back: { label: "doesn't follow back", color: T.terra,     dot: T.terra    },
  mutual:             { label: 'mutual',               color: T.tealLight, dot: T.tealMid  },
  fan:                { label: 'fan',                  color: '#9aa39b',   dot: '#9aa39b'  },
};

export function ProfileCard({
  handle,
  status = 'mutual',
  small = false,
}: {
  handle: string;
  status?: FollowStatus;
  small?: boolean;
}) {
  const cfg = STATUS_CFG[status];
  const w   = small ? 168 : 196;
  const seed = [...handle].reduce((a, c) => a + c.charCodeAt(0), 0);
  const hue1 = (seed * 37) % 360;
  const hue2 = (hue1 + 60) % 360;

  return (
    <div style={{
      width: w, padding: small ? '10px 12px' : '12px 14px',
      borderRadius: 14,
      background: 'rgba(20,33,38,0.85)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(244,240,232,0.08)',
      boxShadow: '0 12px 32px rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', gap: 10,
      userSelect: 'none',
    }}>
      <div style={{
        width: small ? 32 : 38, height: small ? 32 : 38, borderRadius: '50%',
        background: `linear-gradient(135deg, hsl(${hue1} 65% 55%), hsl(${hue2} 70% 45%))`,
        flexShrink: 0,
        boxShadow: 'inset 0 0 0 1.5px rgba(244,240,232,0.15)',
      }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: T.mono, fontSize: small ? 11 : 12, color: T.ink,
          letterSpacing: '0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{handle}</div>
        <div style={{
          marginTop: 3, display: 'inline-flex', alignItems: 'center', gap: 5,
          fontSize: 9.5, color: cfg.color, fontFamily: T.mono,
          letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 600,
        }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: cfg.dot }} />
          {cfg.label}
        </div>
      </div>
    </div>
  );
}

// ─── Icon set ─────────────────────────────────────────────────────────────────

export const Icon = {
  shield: ({ size = 18, color = T.teal }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 3 L20 6 V12 C20 16.5 16.5 20.5 12 22 C7.5 20.5 4 16.5 4 12 V6 Z"
        stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M9 12 L11 14 L15 10"
        stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  bolt: ({ size = 18, color = T.teal }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M13 3 L4 14 H11 L9 21 L20 10 H13 Z"
        stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  ),
  code: ({ size = 18, color = T.teal }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M9 8 L4 12 L9 16" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15 8 L20 12 L15 16" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 5 L10 19" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  arrow: ({ size = 14, color = T.teal }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M3 7 H11 M11 7 L8 4 M11 7 L8 10"
        stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  check: ({ size = 14, color = T.teal }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M3 7 L6 10 L11 4"
        stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  x: ({ size = 14, color = 'rgba(244,240,232,0.18)' }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M4 4 L10 10 M10 4 L4 10" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  upload: ({ size = 22, color = T.cream }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 16 V4 M12 4 L7 9 M12 4 L17 9"
        stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 16 V19 A2 2 0 0 0 6 21 H18 A2 2 0 0 0 20 19 V16"
        stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  gh: ({ size = 14, color = T.teal }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.7c-2.78.62-3.37-1.36-3.37-1.36-.46-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.55 2.34 1.1 2.91.84.09-.66.35-1.1.63-1.36-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.05A9.36 9.36 0 0 1 12 7.07a9.36 9.36 0 0 1 2.5.34c1.91-1.32 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.64 1.03 2.76 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9v2.81c0 .27.18.6.69.49A10.04 10.04 0 0 0 22 12.25C22 6.58 17.52 2 12 2z"/>
    </svg>
  ),
};

// ─── CountUp ──────────────────────────────────────────────────────────────────

export function CountUp({
  to,
  prefix = '',
  suffix = '',
  duration = 1800,
  delay = 0,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  delay?: number;
}) {
  const [v, setV] = React.useState(0);
  const started  = React.useRef(false);

  React.useEffect(() => {
    if (started.current) return;
    started.current = true;
    const t = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const p     = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setV(Math.round(to * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(t);
  }, [to, duration, delay]);

  return <span>{prefix}{v.toLocaleString()}{suffix}</span>;
}

// ─── GridBg ───────────────────────────────────────────────────────────────────

export function GridBg({ opacity = 0.04 }: { opacity?: number }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      backgroundImage: `linear-gradient(${T.tealLight}10 1px, transparent 1px), linear-gradient(90deg, ${T.tealLight}10 1px, transparent 1px)`,
      backgroundSize: '40px 40px',
      maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, transparent 80%)',
      WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, transparent 80%)',
      animation: 'grid-flicker 6s ease-in-out infinite',
      opacity,
    }} />
  );
}

// ─── MagneticCTA ──────────────────────────────────────────────────────────────

export function MagneticCTA({
  children,
  primary = true,
  onClick,
}: {
  children: React.ReactNode;
  primary?: boolean;
  onClick?: () => void;
}) {
  const ref            = React.useRef<HTMLButtonElement>(null);
  const [t, setT]      = React.useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setT({ x: (e.clientX - r.left - r.width / 2) * 0.18, y: (e.clientY - r.top - r.height / 2) * 0.18 });
  };
  const onLeave = () => setT({ x: 0, y: 0 });

  return (
    <button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={{
        position: 'relative',
        background:   primary ? T.teal : 'transparent',
        color:        primary ? T.cream : T.ink,
        border:       primary ? 'none' : `1px solid rgba(244,240,232,0.18)`,
        padding:      '14px 24px',
        borderRadius: 12,
        fontSize:     14,
        fontWeight:   600,
        fontFamily:   T.sans,
        cursor:       'pointer',
        display:      'inline-flex',
        alignItems:   'center',
        gap:          8,
        transform:    `translate(${t.x}px, ${t.y}px)`,
        transition:   'transform 0.25s cubic-bezier(0.16,1,0.3,1), background 0.2s',
        boxShadow:    primary ? `0 0 0 0 ${T.tealGlow}, 0 12px 32px rgba(2,136,143,0.25)` : 'none',
      }}
    >
      {children}
      <span style={{ display: 'inline-flex', animation: 'magnetic-arrow 1.4s ease-in-out infinite' }}>
        <Icon.arrow color={primary ? T.cream : T.teal} />
      </span>
    </button>
  );
}
