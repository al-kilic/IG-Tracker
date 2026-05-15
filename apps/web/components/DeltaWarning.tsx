'use client';

import { useState, useRef } from 'react';
import type { DeltaReason } from '@ig-tracker/core';
import { T } from '@/components/landing/tokens';

const INSTAGRAM_EXPORT_URL = 'https://accountscenter.instagram.com/info_and_permissions/dyi/';

interface Props {
  reasons: DeltaReason[];
  followerCount: number;
  followingCount: number;
  onReExport: () => void;
  onNewAccount: () => void;
  onProceedAnyway: () => void;
}

function reasonText(reason: DeltaReason, followerCount: number, followingCount: number): string {
  switch (reason) {
    case 'small_counts':
      return `Only ${followerCount} follower${followerCount !== 1 ? 's' : ''} and ${followingCount} following detected. Full exports typically have hundreds or thousands.`;
    case 'all_recent_timestamps':
      return 'All follow timestamps are from the last 14 days, which is typical of a delta export.';
    case 'massive_count_drop':
      return 'Follower count dropped over 80% compared to your previous snapshot.';
  }
}

export function DeltaWarning({ reasons, followerCount, followingCount, onReExport, onNewAccount, onProceedAnyway }: Props) {
  const [showDismissOptions, setShowDismissOptions] = useState(false);
  const [showIncrementalTip, setShowIncrementalTip] = useState(false);
  const tipRef = useRef<HTMLSpanElement>(null);

  return (
    /* Backdrop */
    <div style={{
      position: 'fixed', inset: 0, zIndex: 500,
      backdropFilter: 'blur(20px) saturate(0.7)',
      WebkitBackdropFilter: 'blur(20px) saturate(0.7)',
      background: 'rgba(8,10,10,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      {/* Modal card */}
      <div style={{
        maxWidth: 520, width: '100%',
        background: 'rgba(18,24,24,0.97)',
        border: '1px solid var(--t-border2)',
        borderRadius: 24,
        boxShadow: '0 40px 120px rgba(0,0,0,0.7)',
        overflow: 'hidden',
      }}>
        {/* Top bar */}
        <div style={{
          padding: '14px 24px',
          borderBottom: '1px solid rgba(168,75,47,0.2)',
          background: 'rgba(168,75,47,0.06)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 9v5M12 17.5v.5" stroke={T.terra} strokeWidth="2" strokeLinecap="round"/>
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke={T.terra} strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontSize: 10, color: T.terra, fontFamily: T.mono, letterSpacing: '0.14em' }}>EXPORT WARNING</span>
        </div>

        <div style={{ padding: '28px 28px 24px' }}>
          {/* Heading */}
          <h2 style={{ fontFamily: T.serif, fontSize: 30, fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1.1, color: T.ink, marginBottom: 12 }}>
            This looks like an{' '}
            <span style={{ color: 'rgba(192,130,80,0.9)' }}>incremental export</span>
            <span
              ref={tipRef}
              onMouseEnter={e => {
                setShowIncrementalTip(true);
                const r = e.currentTarget.getBoundingClientRect();
                tipRef.current?.setAttribute('data-x', String(r.left + r.width / 2));
                tipRef.current?.setAttribute('data-y', String(r.top));
              }}
              onMouseLeave={() => setShowIncrementalTip(false)}
              style={{ display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle', marginLeft: 6, cursor: 'help' }}
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.45 }}>
                <circle cx="8" cy="8" r="7" stroke="rgba(192,130,80,0.9)" strokeWidth="1.3"/>
                <path d="M8 7.5V11" stroke="rgba(192,130,80,0.9)" strokeWidth="1.4" strokeLinecap="round"/>
                <circle cx="8" cy="5.5" r="0.8" fill="rgba(192,130,80,0.9)"/>
              </svg>
            </span>
          </h2>
          {showIncrementalTip && (() => {
            const el = tipRef.current;
            const x = el ? parseFloat(el.getAttribute('data-x') ?? '0') : 0;
            const y = el ? parseFloat(el.getAttribute('data-y') ?? '0') : 0;
            const TIP_W = 280;
            const left = typeof window !== 'undefined'
              ? Math.max(12, Math.min(x - TIP_W / 2, window.innerWidth - TIP_W - 12))
              : x - TIP_W / 2;
            return (
              <div style={{
                position: 'fixed', left, top: y + 22,
                width: TIP_W, padding: '12px 16px', borderRadius: 12, zIndex: 700,
                background: 'rgba(14,20,20,0.99)', border: '1px solid var(--t-border3)',
                fontSize: 13, fontFamily: T.sans, fontWeight: 400, lineHeight: 1.65,
                color: 'rgba(244,240,232,0.75)', pointerEvents: 'none',
                boxShadow: '0 12px 40px rgba(0,0,0,0.7)',
              }}>
                An <strong style={{ color: T.ink }}>incremental export</strong> is what Instagram sends on a schedule. It only contains activity since your last export, not your full account history. To get complete data, manually request a new export and select <strong style={{ color: T.tealLight }}>All Time</strong> as the date range.
              </div>
            );
          })()}
          <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.65, marginBottom: 20 }}>
            Instagram scheduled exports only include <strong style={{ color: T.ink }}>new activity since your last export</strong>, not your complete followers and following lists. Uploading this will produce incorrect results.
          </p>

          {/* Signals */}
          <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(168,75,47,0.06)', border: '1px solid rgba(168,75,47,0.15)', marginBottom: 20 }}>
            <div style={{ fontSize: 10, color: 'rgba(168,75,47,0.7)', fontFamily: T.mono, letterSpacing: '0.1em', marginBottom: 8 }}>WHY WE THINK THIS</div>
            {reasons.map(r => (
              <div key={r} style={{ fontSize: 13, color: T.inkDim, lineHeight: 1.55 }}>
                {reasonText(r, followerCount, followingCount)}
              </div>
            ))}
          </div>

          {/* What to do */}
          <div style={{ padding: '14px 16px', borderRadius: 10, background: 'rgba(2,136,143,0.05)', border: '1px solid rgba(2,136,143,0.18)', marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.1em', marginBottom: 10 }}>WHAT TO DO</div>
            <ol style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: T.inkDim, lineHeight: 1.6 }}>
              <li>
                Go to Instagram <strong style={{ color: T.ink }}>Accounts Center</strong>, then <strong style={{ color: T.ink }}>Your information and permissions</strong>, then <strong style={{ color: T.ink }}>Download your information</strong>
              </li>
              <li>
                Request a new export and set the date range to{' '}
                <span style={{
                  display: 'inline-block', fontWeight: 700, fontSize: 13,
                  color: '#0f0f0f', background: T.tealLight,
                  padding: '1px 8px', borderRadius: 6, letterSpacing: '0.02em',
                }}>
                  All Time
                </span>
              </li>
              <li>Wait for the email from Instagram, then upload the new ZIP here</li>
            </ol>
          </div>

          {/* Primary CTA */}
          <button
            onClick={() => {
              window.open(INSTAGRAM_EXPORT_URL, '_blank', 'noopener,noreferrer');
              onReExport();
            }}
            style={{
              width: '100%', padding: '13px', borderRadius: 12, cursor: 'pointer',
              background: T.teal, border: 'none', color: T.cream,
              fontSize: 14, fontWeight: 600, fontFamily: T.sans,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              marginBottom: 12,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7H11M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Take me to re-export with{' '}
            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '1px 7px', borderRadius: 5, fontWeight: 700 }}>All Time</span>
          </button>

          {/* Dismiss row */}
          {!showDismissOptions ? (
            <button
              onClick={() => setShowDismissOptions(true)}
              style={{
                width: '100%', padding: '11px 16px', borderRadius: 12, cursor: 'pointer',
                background: 'transparent',
                border: '1px solid var(--t-border3)',
                color: T.inkDim, fontSize: 13, fontFamily: T.sans,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(244,240,232,0.22)'; e.currentTarget.style.color = T.ink; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--t-border3)'; e.currentTarget.style.color = T.inkDim; }}
            >
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M11 7H3M6 4l-3 3 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              This is not an incremental export
            </button>
          ) : (
            <div style={{
              padding: '14px 16px', borderRadius: 12,
              background: 'var(--t-surface1)', border: '1px solid var(--t-border2)',
              display: 'flex', flexDirection: 'column', gap: 8,
            }}>
              <p style={{ fontSize: 12, color: T.inkMute, marginBottom: 4, lineHeight: 1.5 }}>
                Choose why you want to continue:
              </p>
              <button
                onClick={onNewAccount}
                style={{
                  padding: '10px 14px', borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                  background: 'var(--t-surface2)', border: '1px solid var(--t-border2)',
                  color: T.inkDim, fontSize: 13, fontFamily: T.sans,
                }}
              >
                My account is new. I genuinely have under 50 followers.
              </button>
              <button
                onClick={onProceedAnyway}
                style={{
                  padding: '10px 14px', borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                  background: 'var(--t-surface2)', border: '1px solid var(--t-border2)',
                  color: T.inkDim, fontSize: 13, fontFamily: T.sans,
                }}
              >
                I know the results may be incorrect. Show me anyway.
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
