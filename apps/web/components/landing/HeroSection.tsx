'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  parseInstagramZip,
  InvalidZipError,
  MissingFilesError,
  SchemaValidationError,
  MixedFormatError,
  type ParsedSnapshot,
} from '@ig-tracker/core';
import { useSnapshotStore } from '@/lib/store';
import { useSnapshotList, saveSnapshot, deleteSnapshot, FREE_SNAPSHOT_LIMIT } from '@/hooks/useSnapshots';
import { UpgradeDialog } from '@/components/UpgradeDialog';
import { createPortal } from 'react-dom';
import { T } from './tokens';
import { Icon, CountUp, GridBg, MagneticCTA } from './atoms';
import { ProfileCard } from './atoms';

// ─── Upload state machine ────────────────────────────────────────────────────

type UploadPhase = 'idle' | 'dragging' | 'parsing' | 'error' | 'success';

function errorMessage(err: unknown): string {
  if (err instanceof MissingFilesError || err instanceof InvalidZipError ||
      err instanceof SchemaValidationError || err instanceof MixedFormatError)
    return (err as Error).message;
  if (err instanceof Error) return err.message;
  return 'Something went wrong. Make sure you uploaded the correct Instagram ZIP.';
}

// ─── HeroSection ────────────────────────────────────────────────────────────

export function HeroSection() {
  const router       = useRouter();
  const setSnapshot  = useSnapshotStore((s) => s.setSnapshot);
  const snapshots    = useSnapshotList();

  const [phase,   setPhase]   = useState<UploadPhase>('idle');
  const [progress, setProgress] = useState(0);
  const [errMsg,  setErrMsg]  = useState('');
  const [pending, setPending] = useState<ParsedSnapshot | null>(null);
  const [mounted, setMounted] = useState(false);

  const dropRef  = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [spot, setSpot] = useState({ x: 50, y: 50, on: false });

  useEffect(() => { setMounted(true); }, []);

  // ── Commit a parsed snapshot ──────────────────────────────────────────────
  const commit = useCallback(async (snap: ParsedSnapshot) => {
    await saveSnapshot(snap);
    setSnapshot(snap);
    router.push('/results');
  }, [router, setSnapshot]);

  // ── Process a dropped / selected file ────────────────────────────────────
  const processFile = useCallback(async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.zip') &&
        file.type !== 'application/zip' &&
        file.type !== 'application/x-zip-compressed') {
      setErrMsg('Please upload a .zip file — the one Instagram emailed you.');
      setPhase('error');
      return;
    }

    setPhase('parsing');
    setProgress(0);

    let tick = 0;
    const iv = setInterval(() => {
      tick += 1;
      setProgress(Math.min(85, tick * 3));
    }, 80);

    try {
      const snap = await parseInstagramZip(file);
      clearInterval(iv);
      setProgress(100);
      await new Promise(r => setTimeout(r, 300));

      if (snapshots.length >= FREE_SNAPSHOT_LIMIT) {
        setPhase('idle');
        setPending(snap);
      } else {
        await commit(snap);
      }
    } catch (err) {
      clearInterval(iv);
      setErrMsg(errorMessage(err));
      setPhase('error');
    }
  }, [snapshots.length, commit]);

  // ── Upgrade dialog callbacks ──────────────────────────────────────────────
  const handleDeleteOldest = useCallback(async () => {
    if (!pending) return;
    const oldest = [...snapshots].sort((a, b) => a.savedAt - b.savedAt)[0];
    if (oldest?.id != null) await deleteSnapshot(oldest.id);
    await commit(pending);
    setPending(null);
  }, [pending, snapshots, commit]);

  const handleUpgrade = useCallback(async () => {
    if (!pending) return;
    await commit(pending);
    setPending(null);
  }, [pending, commit]);

  // ── Drag / drop handlers ──────────────────────────────────────────────────
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
    else setPhase('idle');
  }, [processFile]);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (phase === 'idle' || phase === 'error') setPhase('dragging');
  }, [phase]);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node))
      setPhase(prev => prev === 'dragging' ? 'idle' : prev);
  }, []);

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  }, [processFile]);

  const oldest = [...snapshots].sort((a, b) => a.savedAt - b.savedAt)[0];
  const isProcessing = phase === 'parsing';

  const borderGradient = phase === 'dragging'
    ? `linear-gradient(135deg, ${T.tealLight}, ${T.tealMid})`
    : phase === 'error'
    ? `linear-gradient(135deg, rgba(168,75,47,0.8), rgba(168,75,47,0.3))`
    : `linear-gradient(135deg, rgba(2,136,143,0.5), rgba(244,240,232,0.08), rgba(168,75,47,0.3))`;

  return (
    <section style={{ position: 'relative', padding: '0 48px 48px' }}>
      {/* Portal for upgrade dialog */}
      {mounted && pending && oldest && createPortal(
        <UpgradeDialog
          oldestLabel={oldest.label}
          onDeleteOldest={handleDeleteOldest}
          onUpgrade={handleUpgrade}
          onClose={() => setPending(null)}
        />,
        document.body,
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept=".zip,application/zip,application/x-zip-compressed"
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
        onChange={onFileChange}
        disabled={isProcessing}
      />

      <GridBg opacity={0.05} />

      {/* Radial glow */}
      <div style={{
        position: 'absolute', left: '50%', top: '40%', transform: 'translate(-50%,-50%)',
        width: 800, height: 800, borderRadius: '50%',
        background: `radial-gradient(circle, ${T.tealGlow} 0%, transparent 60%)`,
        pointerEvents: 'none', filter: 'blur(40px)',
      }} />

      {/* Floating profile cards */}
      <div style={{ position: 'absolute', left: 60, top: 140, animation: 'drift-1 6s ease-in-out infinite', zIndex: 2 }}>
        <ProfileCard handle="@alex.studio" status="not_following_back" />
      </div>
      <div style={{ position: 'absolute', left: 28, top: 360, animation: 'drift-2 7.5s ease-in-out infinite', zIndex: 2 }}>
        <ProfileCard handle="@bloom.theory" status="mutual" small />
      </div>
      <div style={{ position: 'absolute', right: 60, top: 130, animation: 'drift-3 6.5s ease-in-out infinite', zIndex: 2 }}>
        <ProfileCard handle="@marco.visuals" status="not_following_back" />
      </div>
      <div style={{ position: 'absolute', right: 32, top: 380, animation: 'drift-4 8s ease-in-out infinite', zIndex: 2 }}>
        <ProfileCard handle="@sarah_creates" status="fan" small />
      </div>
      <div style={{ position: 'absolute', left: 200, top: 490, animation: 'drift-5 7s ease-in-out infinite', zIndex: 2, opacity: 0.75 }}>
        <ProfileCard handle="@wave.theory" status="not_following_back" small />
      </div>

      {/* Eyebrow badge */}
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 32, position: 'relative', zIndex: 5 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '7px 18px 7px 8px',
          border: `1px solid rgba(2,136,143,0.4)`,
          background: 'rgba(2,136,143,0.08)',
          borderRadius: 100,
          animation: 'fade-up 0.7s 0.0s cubic-bezier(0.16,1,0.3,1) both',
        }}>
          <div style={{ position: 'relative', width: 18, height: 18 }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `1px solid ${T.tealMid}`, animation: 'pulse-ring 2.4s ease-out infinite' }} />
            <div style={{ position: 'absolute', inset: 4, borderRadius: '50%', background: T.tealMid, boxShadow: `0 0 10px ${T.tealMid}` }} />
          </div>
          <span style={{ fontSize: 12, color: T.tealLight, fontWeight: 500, letterSpacing: '0.01em', whiteSpace: 'nowrap' }}>
            Beta&nbsp;·&nbsp;<span style={{ color: T.inkDim }}>Free during launch</span>
          </span>
        </div>
      </div>

      {/* Headline */}
      <h1 style={{
        fontFamily: T.serif, fontWeight: 400,
        fontSize: 'clamp(36px, 5.2vw, 72px)',
        lineHeight: 1.06, letterSpacing: '-0.03em',
        textAlign: 'center', marginTop: 18, position: 'relative', zIndex: 5,
        animation: 'fade-up 0.7s 0.1s cubic-bezier(0.16,1,0.3,1) both',
        color: T.ink,
      }}>
        <div style={{ marginBottom: 4 }}>See exactly who</div>
        <div style={{ marginBottom: 4 }}>
          <span style={{
            background: `linear-gradient(110deg, ${T.tealLight} 0%, ${T.cream} 30%, ${T.tealLight} 50%, ${T.cream} 70%, ${T.tealLight} 100%)`,
            backgroundSize: '200% 100%',
            WebkitBackgroundClip: 'text', backgroundClip: 'text',
            WebkitTextFillColor: 'transparent', color: 'transparent',
            animation: 'shimmer-text 5s linear infinite',
            fontStyle: 'italic', display: 'inline-block', paddingBottom: '0.1em',
          }}>{"doesn't follow you back."}</span>
        </div>
        <div>
          Without handing over{' '}
          <span style={{ position: 'relative', display: 'inline-block' }}>
            <s style={{ textDecorationColor: T.terra, textDecorationThickness: '5px' }}>your login.</s>
          </span>
        </div>
      </h1>

      {/* Subhead */}
      <p style={{
        textAlign: 'center', fontSize: 15, color: T.inkDim,
        maxWidth: 500, margin: '16px auto 0', lineHeight: 1.55,
        position: 'relative', zIndex: 5,
        animation: 'fade-up 0.7s 0.25s cubic-bezier(0.16,1,0.3,1) both',
      }}>
        Upload the data export Instagram already gave you. We read it on your device and show you
        every account you follow that{"doesn't follow you back."}
      </p>

      {/* ── Drop zone ──────────────────────────────────────────────────────── */}
      <div style={{
        maxWidth: 580, margin: '20px auto 0', position: 'relative', zIndex: 5,
        animation: 'fade-up 0.7s 0.4s cubic-bezier(0.16,1,0.3,1) both',
      }}>
        <div
          ref={dropRef}
          onMouseEnter={() => setSpot(s => ({ ...s, on: true }))}
          onMouseLeave={() => setSpot(s => ({ ...s, on: false }))}
          onMouseMove={(e) => {
            const r = dropRef.current!.getBoundingClientRect();
            setSpot({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100, on: true });
          }}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => !isProcessing && inputRef.current?.click()}
          style={{
            position: 'relative', borderRadius: 24, padding: 2,
            cursor: isProcessing ? 'default' : 'pointer',
            background: borderGradient,
            transition: 'all 0.3s',
          }}
        >
          <div style={{
            borderRadius: 22, background: T.bgCard, padding: '28px 32px',
            position: 'relative', overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {/* Cursor spotlight */}
            {spot.on && phase === 'idle' && (
              <div style={{
                position: 'absolute', left: `${spot.x}%`, top: `${spot.y}%`,
                width: 280, height: 280, transform: 'translate(-50%, -50%)',
                background: `radial-gradient(circle, ${T.tealGlow} 0%, transparent 70%)`,
                pointerEvents: 'none', transition: 'opacity 0.2s',
              }} />
            )}
            {/* Dotted inner grid */}
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: `radial-gradient(${T.tealLight}30 1px, transparent 1px)`,
              backgroundSize: '20px 20px',
              opacity: 0.18, pointerEvents: 'none',
            }} />

            {/* ── IDLE ── */}
            {(phase === 'idle' || phase === 'dragging') && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, position: 'relative', zIndex: 2 }}>
                <div style={{
                  width: 60, height: 60, borderRadius: 17,
                  background: phase === 'dragging'
                    ? `linear-gradient(135deg, ${T.tealLight}, ${T.tealMid})`
                    : `linear-gradient(135deg, ${T.tealMid}, ${T.teal})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 0 32px ${T.tealGlow}, inset 0 0 0 1px rgba(244,240,232,0.12)`,
                  animation: 'glow-soft 3s ease-in-out infinite',
                  transform: phase === 'dragging' ? 'scale(1.08)' : 'scale(1)',
                  transition: 'transform 0.2s',
                }}>
                  <Icon.upload size={24} color={phase === 'dragging' ? T.bg : T.cream} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: T.serif, fontSize: 28, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 6, color: T.ink }}>
                    {phase === 'dragging' ? 'Drop it here.' : 'Drop your Instagram export here.'}
                  </div>
                  <div style={{ fontSize: 13, color: T.inkDim, fontFamily: T.sans, maxWidth: 360, lineHeight: 1.5 }}>
                    The ZIP file Instagram sends you when you request your data.
                  </div>
                </div>
                {phase !== 'dragging' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <MagneticCTA primary onClick={() => inputRef.current?.click()}>Choose file</MagneticCTA>
                    <span style={{ fontSize: 12, color: T.inkMute }}>or drop anywhere</span>
                  </div>
                )}
              </div>
            )}

            {/* ── PARSING ── */}
            {phase === 'parsing' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, position: 'relative', zIndex: 2, animation: 'fade-in 0.3s both' }}>
                <div style={{ position: 'relative', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="80" height="80" viewBox="0 0 80 80" style={{ position: 'absolute', animation: 'ring-rotate 2.5s linear infinite' }}>
                    <circle cx="40" cy="40" r="36" fill="none" stroke={T.tealMid} strokeWidth="1.5" strokeDasharray="4 6" opacity="0.7"/>
                  </svg>
                  <svg width="60" height="60" viewBox="0 0 60 60" style={{ position: 'absolute', animation: 'ring-rotate-rev 2s linear infinite' }}>
                    <circle cx="30" cy="30" r="26" fill="none" stroke={T.tealLight} strokeWidth="1" strokeDasharray="2 4" opacity="0.4"/>
                  </svg>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: `linear-gradient(135deg, ${T.tealMid}, ${T.teal})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 24px ${T.tealGlow}` }}>
                    <Icon.bolt size={22} color={T.cream} />
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: T.serif, fontSize: 32, lineHeight: 1.05, letterSpacing: '-0.015em', color: T.ink }}>
                    Reading your data<span style={{ animation: 'blink 0.6s step-end infinite', color: T.tealLight }}>.</span>
                  </div>
                  <div style={{ fontSize: 13, color: T.inkMute, marginTop: 8 }}>Stays on your device. Nothing is uploaded.</div>
                </div>
                <div style={{ width: 340, height: 3, borderRadius: 3, background: 'rgba(244,240,232,0.06)', overflow: 'hidden', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${progress}%`, background: T.tealMid, transition: 'width 0.2s ease-out', borderRadius: 3 }} />
                </div>
              </div>
            )}

            {/* ── ERROR ── */}
            {phase === 'error' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, position: 'relative', zIndex: 2, animation: 'fade-up 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(168,75,47,0.2)', border: `1px solid ${T.terra}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M14 8 V15 M14 19 V20" stroke={T.terra} strokeWidth="2.4" strokeLinecap="round"/>
                  </svg>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: T.serif, fontSize: 28, lineHeight: 1.1, color: T.ink, marginBottom: 8 }}>Something went wrong.</div>
                  <div style={{ fontSize: 13, color: T.inkDim, maxWidth: 380, lineHeight: 1.5 }}>{errMsg}</div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setPhase('idle'); setErrMsg(''); }}
                  style={{ padding: '11px 22px', borderRadius: 10, border: `1px solid rgba(244,240,232,0.18)`, background: 'transparent', color: T.ink, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: T.sans }}
                >
                  Try again
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Trust line */}
        <div style={{
          marginTop: 14, textAlign: 'center',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 26, fontSize: 12, color: T.inkMute, fontFamily: T.mono, letterSpacing: '0.02em',
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon.shield size={13} color={T.tealMid} />no login required</span>
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: T.inkMute }} />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon.code size={13} color={T.tealMid} />open-source parser</span>
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: T.inkMute }} />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon.bolt size={13} color={T.tealMid} />runs in your browser</span>
        </div>
      </div>

      {/* Live counters */}
      <div style={{
        maxWidth: 680, margin: '32px auto 0',
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 0,
        background: 'rgba(244,240,232,0.02)', border: '1px solid rgba(244,240,232,0.06)',
        borderRadius: 16, overflow: 'hidden', position: 'relative', zIndex: 5,
        animation: 'fade-up 0.7s 0.55s cubic-bezier(0.16,1,0.3,1) both',
      }}>
        {([
          ['Snapshots parsed', 14823, ''],
          ['Avg non-followers',  187, ''],
          ['No login forms',       0, ''],
          ['Free during beta',   100, '%'],
        ] as [string, number, string][]).map(([label, val, suf], i) => (
          <div key={label} style={{ padding: '14px 12px', borderRight: i < 3 ? '1px solid rgba(244,240,232,0.05)' : 'none', textAlign: 'center' }}>
            <div style={{ fontFamily: T.serif, fontSize: 24, lineHeight: 1, color: i === 3 ? T.tealLight : T.ink, animation: `count-up 0.7s ${0.9+i*0.1}s both` }}>
              <CountUp to={val} suffix={suf} duration={1600} delay={900 + i * 120} />
            </div>
            <div style={{ fontSize: 10, color: T.inkMute, marginTop: 4, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
