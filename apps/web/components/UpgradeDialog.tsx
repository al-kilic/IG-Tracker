'use client';

import { useEffect } from 'react';
import { T } from '@/components/landing/tokens';

interface UpgradeDialogProps {
  oldestLabel: string;
  onDeleteOldest: () => void;
  onUpgrade: () => void;
  onClose: () => void;
}

export function UpgradeDialog({ oldestLabel, onDeleteOldest, onUpgrade, onClose }: UpgradeDialogProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="upgrade-title"
      style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
      />

      {/* Panel */}
      <div style={{
        position: 'relative', width: '100%', maxWidth: 400,
        borderRadius: 20, overflow: 'hidden',
        background: T.bgCard,
        border: '1px solid rgba(244,240,232,0.08)',
        boxShadow: `0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(244,240,232,0.04)`,
        animation: 'ig-scale-in 0.25s cubic-bezier(0.16,1,0.3,1) both',
      }}>
        {/* Header bar */}
        <div style={{ background: `linear-gradient(135deg, ${T.teal}, ${T.tealMid})`, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <rect x="5" y="11" width="14" height="11" rx="2" stroke="white" strokeWidth="1.8"/>
                <path d="M8 11 V7 A4 4 0 0 1 16 7 V11" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.9)', fontFamily: T.mono, textTransform: 'uppercase' }}>
              Free plan limit reached
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ width: 28, height: 28, borderRadius: 8, border: 'none', background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.22)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.12)'; }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 2 L10 10 M10 2 L2 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 24px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <h2 id="upgrade-title" style={{ fontFamily: T.serif, fontSize: 22, fontWeight: 400, color: T.ink, letterSpacing: '-0.01em', marginBottom: 8 }}>
              {"You've"} used all 3 snapshot slots
            </h2>
            <p style={{ fontSize: 13, color: T.inkDim, lineHeight: 1.55 }}>
              The free plan stores up to 3 snapshots locally. Free up a slot or upgrade to save unlimited history.
            </p>
          </div>

          {/* Oldest snapshot */}
          <div style={{ padding: '12px 16px', borderRadius: 12, background: 'rgba(244,240,232,0.03)', border: '1px solid rgba(244,240,232,0.07)' }}>
            <div style={{ fontSize: 10, color: T.inkMute, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: T.mono, marginBottom: 6 }}>Oldest snapshot</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.ink, fontFamily: T.sans, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{oldestLabel}</div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={onDeleteOldest}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 12, border: '1px solid rgba(244,240,232,0.1)', background: 'rgba(244,240,232,0.03)', color: T.ink, fontSize: 13, fontWeight: 500, cursor: 'pointer', textAlign: 'left', fontFamily: T.sans, transition: 'background 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(244,240,232,0.07)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(244,240,232,0.03)'; }}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ flexShrink: 0, color: T.inkDim }}>
                <path d="M2 4 H13 M5 4 V2.5 A0.5 0.5 0 0 1 5.5 2 H9.5 A0.5 0.5 0 0 1 10 2.5 V4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                <path d="M4 4 L5 13 H10 L11 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Delete oldest &amp; save new upload
            </button>

            <button
              onClick={onUpgrade}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 12, border: 'none', background: T.teal, color: T.cream, fontSize: 13, fontWeight: 700, cursor: 'pointer', textAlign: 'left', fontFamily: T.sans, boxShadow: `0 8px 24px rgba(2,136,143,0.35)`, transition: 'background 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = T.tealMid; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = T.teal; }}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ flexShrink: 0 }}>
                <path d="M7.5 1 L9 5.5 H13.5 L10 8 L11.5 12.5 L7.5 10 L3.5 12.5 L5 8 L1.5 5.5 H6 Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
              </svg>
              Upgrade to Pro
              <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.65)', background: 'rgba(255,255,255,0.12)', borderRadius: 20, padding: '3px 9px' }}>
                Free during beta
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
