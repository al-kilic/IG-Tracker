'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { T } from '@/components/landing/tokens';

export interface TutorialStep {
  title: string;
  body: string;
  targetSelector?: string;
}

const PAD = 10;
const TOOLTIP_W = 340;

interface Layout {
  rect: DOMRect | null;
  vw: number;
  vh: number;
}

export function Tutorial({
  storageKey,
  steps,
  onDismiss,
}: {
  storageKey: string;
  steps: TutorialStep[];
  onDismiss?: () => void;
}) {
  const [mounted,  setMounted]  = useState(false);
  const [visible,  setVisible]  = useState(false);
  const [step,     setStep]     = useState(0);
  const [layout,   setLayout]   = useState<Layout>({ rect: null, vw: 0, vh: 0 });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
    try {
      if (!sessionStorage.getItem(storageKey)) setVisible(true);
    } catch { setVisible(true); }
  }, [storageKey]);

  // Measure only on step change + resize (no scroll listener = no jank)
  const measure = useCallback(() => {
    const sel = steps[step]?.targetSelector;
    const el  = sel ? document.querySelector(sel) : null;
    setLayout({
      rect: el ? el.getBoundingClientRect() : null,
      vw: window.innerWidth,
      vh: window.innerHeight,
    });
  }, [step, steps]);

  useEffect(() => {
    if (!visible || !mounted) return;
    const sel = steps[step]?.targetSelector;
    const el  = sel ? document.querySelector(sel) : null;
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Single delayed measure after scroll settles — no ongoing listener
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(measure, 500);
    } else {
      measure();
    }
    // Only resize listener — scroll would cause constant re-renders
    window.addEventListener('resize', measure, { passive: true });
    return () => {
      window.removeEventListener('resize', measure);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible, mounted, step, measure]);

  function dismiss() {
    try { sessionStorage.setItem(storageKey, '1'); } catch {}
    setVisible(false);
    onDismiss?.();
  }

  function next() {
    if (step < steps.length - 1) {
      setLayout(l => ({ ...l, rect: null }));
      setStep(s => s + 1);
    } else {
      dismiss();
    }
  }

  if (!mounted || !visible) return null;

  const current = steps[step]!;
  const { rect, vw, vh } = layout;
  if (!vw || !vh) return null;

  // ── Positioning ─────────────────────────────────────────────────────────────
  const tooltipW = Math.min(TOOLTIP_W, vw - 24);
  let tooltipTop: number | undefined;
  let tooltipBottom: number | undefined;
  let tooltipLeft: number;
  let arrowPos: 'top' | 'bottom' | 'none' = 'none';
  let arrowLeft = tooltipW / 2 - 7;

  if (rect) {
    const place = (vh - rect.bottom) >= 200 || (vh - rect.bottom) >= rect.top ? 'below' : 'above';
    arrowPos    = place === 'below' ? 'top' : 'bottom';
    const idealLeft = rect.left + rect.width / 2 - tooltipW / 2;
    tooltipLeft = Math.max(12, Math.min(idealLeft, vw - tooltipW - 12));
    arrowLeft   = Math.max(16, Math.min(rect.left + rect.width / 2 - tooltipLeft - 7, tooltipW - 30));
    if (place === 'below') tooltipTop    = rect.bottom + PAD + 10;
    else                   tooltipBottom = vh - rect.top + PAD + 10;
  } else {
    tooltipLeft   = Math.max(12, vw / 2 - tooltipW / 2);
    tooltipBottom = 32;
  }

  return (
    <>
      {/* Spotlight — 4 dark panels with a hole, no transitions (performance) */}
      {rect ? (
        <>
          {([
            { top: 0, left: 0, right: 0, height: Math.max(0, rect.top - PAD) },
            { top: rect.bottom + PAD, left: 0, right: 0, bottom: 0 },
            { top: rect.top - PAD, left: 0, width: Math.max(0, rect.left - PAD), height: rect.height + PAD * 2 },
            { top: rect.top - PAD, left: rect.right + PAD, right: 0, height: rect.height + PAD * 2 },
          ] as React.CSSProperties[]).map((s, i) => (
            <div key={i} style={{ position: 'fixed', ...s, background: 'rgba(0,0,0,0.65)', zIndex: 998, pointerEvents: 'none' }} />
          ))}
          {/* Highlight ring — no backdrop-filter for perf */}
          <div style={{
            position: 'fixed',
            top: rect.top - PAD, left: rect.left - PAD,
            width: rect.width + PAD * 2, height: rect.height + PAD * 2,
            borderRadius: 14, zIndex: 999, pointerEvents: 'none',
            border: `2px solid ${T.tealMid}`,
            boxShadow: `0 0 0 4px rgba(2,136,143,0.12), 0 0 28px rgba(2,136,143,0.35)`,
            animation: 'pulse-ring 2.6s ease-out infinite',
          }} />
        </>
      ) : (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 998, pointerEvents: 'none' }} />
      )}

      {/* Tooltip card — no backdrop-filter (expensive when overlaid on page) */}
      <div
        role="dialog"
        aria-label="Feature tour"
        style={{
          position: 'fixed',
          top: tooltipTop, bottom: tooltipBottom, left: tooltipLeft,
          width: tooltipW, zIndex: 1000,
          background: '#060e10',
          border: `1px solid rgba(2,136,143,0.5)`,
          borderRadius: 18,
          boxShadow: `0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(2,136,143,0.1), 0 0 40px rgba(2,136,143,0.1)`,
          padding: '18px 20px 16px',
          animation: 'fade-up 0.35s cubic-bezier(0.16,1,0.3,1) both',
        }}
      >
        {/* Arrow */}
        {rect && arrowPos !== 'none' && (
          <div style={{
            position: 'absolute',
            [arrowPos === 'top' ? 'top' : 'bottom']: -8,
            left: arrowLeft, width: 16, height: 8, overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 2, left: 2,
              width: 12, height: 12,
              background: '#060e10',
              border: `1px solid rgba(2,136,143,0.5)`,
              transform: arrowPos === 'top' ? 'rotate(45deg)' : 'rotate(225deg)',
              transformOrigin: 'center',
            }} />
          </div>
        )}

        {/* Dots + skip */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            {steps.map((_, i) => (
              <div key={i} style={{
                height: 4, borderRadius: 2,
                width: i === step ? 22 : 4,
                background: i === step ? T.tealMid : 'rgba(244,240,232,0.18)',
                transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
              }} />
            ))}
            <span style={{ marginLeft: 4, fontSize: 10, color: 'rgba(244,240,232,0.3)', fontFamily: T.mono }}>
              {step + 1}/{steps.length}
            </span>
          </div>
          <button
            onClick={dismiss}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(244,240,232,0.3)', fontSize: 11, fontFamily: T.sans, padding: '2px 0' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(244,240,232,0.65)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(244,240,232,0.3)')}
          >
            Skip tour
          </button>
        </div>

        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 9, marginBottom: 7 }}>
          <span style={{ fontSize: 10, fontFamily: T.mono, fontWeight: 700, letterSpacing: '0.14em', color: T.tealMid, background: 'rgba(2,136,143,0.12)', padding: '2px 7px', borderRadius: 5 }}>
            {String(step + 1).padStart(2, '0')}
          </span>
          <span style={{ fontFamily: T.serif, fontSize: 17, lineHeight: 1.2, letterSpacing: '-0.01em', color: '#f4f0e8' }}>
            {current.title}
          </span>
        </div>

        <p style={{ fontSize: 13, color: 'rgba(244,240,232,0.55)', lineHeight: 1.65, margin: '0 0 16px' }}>
          {current.body}
        </p>

        <button
          onClick={next}
          style={{
            width: '100%', padding: '10px 16px', borderRadius: 11,
            background: `linear-gradient(135deg, ${T.tealMid} 0%, ${T.teal} 100%)`,
            color: '#f4f0e8', border: 'none',
            fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: T.sans,
            boxShadow: `0 4px 20px rgba(2,136,143,0.35)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          {step < steps.length - 1
            ? <><span>Next</span><span style={{ fontSize: 15 }}>→</span></>
            : <><span>Got it</span><span>✓</span></>}
        </button>
      </div>
    </>
  );
}
