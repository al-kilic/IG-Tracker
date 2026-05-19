'use client';

import { useState, useEffect } from 'react';
import { T } from '@/components/landing/tokens';

const EMAIL_KEY = 'ig-tracker:captured-email';

export function getSavedEmail(): string {
  try { return localStorage.getItem(EMAIL_KEY) ?? ''; } catch { return ''; }
}

function saveEmail(email: string) {
  try { localStorage.setItem(EMAIL_KEY, email); } catch {}
}

interface Props {
  csvFilename: string;
  csvContent: string;
  onClose: () => void;
  onDownload: () => void;
}

export function EmailCaptureModal({ csvFilename, csvContent, onClose, onDownload }: Props) {
  const [email, setEmail]     = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  useEffect(() => {
    const saved = getSavedEmail();
    if (saved) setEmail(saved);
  }, []);

  const validEmail = email.trim().length > 0 && email.includes('@');

  async function handleSendEmail() {
    if (!validEmail) return;
    setStatus('sending');
    saveEmail(email.trim());
    // Only email + filename sent to server — CSV stays client-side (GDPR compliance)
    try {
      const res = await fetch('/api/capture-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), csvFilename }),
      });
      setStatus(res.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
    onDownload();
  }

  function handleDownloadOnly() {
    // Download never requires email (GDPR: consent must not be bundled with data access)
    if (validEmail) saveEmail(email.trim());
    onDownload();
    onClose();
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(8,12,12,0.8)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}
    >
      <div
        style={{
          background: 'rgba(14,18,18,0.98)', border: '1px solid rgba(244,240,232,0.1)',
          borderRadius: 20, padding: '32px 36px', maxWidth: 440, width: '100%',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.12em', marginBottom: 8 }}>EXPORT CSV</div>
          <h2 style={{ fontFamily: T.serif, fontSize: 24, fontWeight: 400, letterSpacing: '-0.02em', color: T.ink, marginBottom: 6 }}>
            Your CSV is ready.
          </h2>
          <p style={{ fontSize: 13, color: T.inkDim, lineHeight: 1.6 }}>
            Download it now, or enter your email to also receive a copy and occasional product updates. Unsubscribe anytime.
          </p>
        </div>

        {/* Email input */}
        <div style={{ marginBottom: 16 }}>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={e => { setEmail(e.target.value); setStatus('idle'); }}
            autoFocus
            style={{
              width: '100%', padding: '12px 14px', borderRadius: 10, boxSizing: 'border-box',
              border: `1px solid ${status === 'error' ? 'rgba(168,75,47,0.4)' : 'rgba(244,240,232,0.15)'}`,
              background: 'rgba(244,240,232,0.03)', color: T.ink,
              fontSize: 14, fontFamily: T.sans, outline: 'none',
            }}
          />
          {status === 'error' && (
            <p style={{ fontSize: 11, color: T.terra, marginTop: 6, fontFamily: T.mono }}>Something went wrong. Your CSV still downloaded.</p>
          )}
          {status === 'sent' && (
            <p style={{ fontSize: 11, color: T.tealLight, marginTop: 6, fontFamily: T.mono }}>Sent. Check your inbox.</p>
          )}
        </div>

        {/* Actions */}
        {status === 'sent' ? (
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => { onDownload(); onClose(); }}
              style={{
                flex: 1, padding: '11px 0', borderRadius: 10, cursor: 'pointer',
                background: T.teal, border: 'none', color: T.cream, fontSize: 13, fontWeight: 600, fontFamily: T.sans,
              }}
            >
              Download CSV too
            </button>
            <button
              onClick={onClose}
              style={{
                padding: '11px 18px', borderRadius: 10, cursor: 'pointer',
                background: 'transparent', border: '1px solid rgba(244,240,232,0.1)',
                color: T.inkDim, fontSize: 13, fontFamily: T.sans,
              }}
            >
              Done
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={handleSendEmail}
              disabled={!validEmail || status === 'sending'}
              style={{
                flex: 1, padding: '11px 0', borderRadius: 10,
                cursor: validEmail ? 'pointer' : 'not-allowed',
                background: validEmail ? T.teal : 'rgba(2,136,143,0.15)',
                border: 'none', color: validEmail ? T.cream : T.inkMute,
                fontSize: 13, fontWeight: 600, fontFamily: T.sans, transition: 'all 0.15s',
              }}
            >
              {status === 'sending' ? 'Sending…' : 'Send to email & download'}
            </button>
            <button
              onClick={handleDownloadOnly}
              style={{
                padding: '11px 16px', borderRadius: 10,
                cursor: 'pointer',
                background: 'rgba(244,240,232,0.04)',
                border: '1px solid rgba(244,240,232,0.12)',
                color: T.inkDim,
                fontSize: 13, fontFamily: T.sans, transition: 'all 0.15s',
              }}
            >
              Download only
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
