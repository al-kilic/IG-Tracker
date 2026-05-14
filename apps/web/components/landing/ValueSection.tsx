'use client';

import React, { useRef, useCallback } from 'react';
import { T } from './tokens';

// ─── Mock screens ─────────────────────────────────────────────────────────────

function MockList() {
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', borderBottom: '1px solid var(--t-surface2)' }}>
        {([['1,203','Following'],['847','Followers'],['246',"Don't follow back"],['535','Mutuals']] as [string,string][]).map(([v,l],i) => (
          <div key={l} style={{ padding: '14px 14px', borderRight: i < 3 ? '1px solid var(--t-surface2)' : 'none' }}>
            <div style={{ fontFamily: T.serif, fontSize: 22, color: i === 2 ? T.tealLight : T.ink }}>{v}</div>
            <div style={{ fontSize: 9, color: T.inkMute, marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', borderBottom: '1px solid var(--t-surface2)', padding: '0 12px' }}>
        {["Don't follow back (246)",'Fans (312)','Mutuals (535)'].map((t,i) => (
          <div key={t} style={{
            padding: '10px 14px', fontSize: 11, fontWeight: i === 0 ? 600 : 400,
            color: i === 0 ? T.ink : T.inkMute,
            borderBottom: `2px solid ${i === 0 ? T.tealMid : 'transparent'}`,
          }}>{t}</div>
        ))}
        <div style={{ marginLeft: 'auto', padding: '10px 0', display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: T.tealLight, padding: '4px 10px', border: `1px solid rgba(2,136,143,0.3)`, borderRadius: 6 }}>Export CSV</span>
        </div>
      </div>
      <div style={{ padding: '4px 6px' }}>
        {([
          ['@alex.studio',  '12.4k','following 2 years'],
          ['@marco.visuals','8.1k', 'following 11 months'],
          ['@sarah_creates','24.8k','following 3 years'],
          ['@the.luminary', '3.2k', 'following 6 months'],
          ['@wave.theory',  '47.1k','following 1 year'],
        ] as [string,string,string][]).map(([u,f,b],i) => (
          <div key={u} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: 6, animation: `fade-up 0.5s ${0.2+i*0.06}s both` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: `hsl(${i*47+160} 30% 38%)`, color: T.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>{u.charAt(1).toUpperCase()}</div>
              <div>
                <div style={{ fontSize: 13, color: T.ink, fontFamily: T.mono }}>{u}</div>
                <div style={{ fontSize: 10, color: T.inkMute, marginTop: 1 }}>{b}</div>
              </div>
            </div>
            <span style={{ fontSize: 10, color: T.inkMute, fontFamily: T.mono }}>{f} followers</span>
          </div>
        ))}
      </div>
    </>
  );
}

function MockCsv() {
  const points = [42,58,71,65,89,76,94,88,102,96,118,124];
  const max = Math.max(...points);
  const w = 200, h = 52;
  const step = w / (points.length - 1);
  const pathD = points.map((v,i) => `${i === 0 ? 'M' : 'L'} ${i*step} ${h - (v/max)*h}`).join(' ');
  const areaD = pathD + ` L ${(points.length-1)*step} ${h} L 0 ${h} Z`;

  // Wheel chart — health score ring
  const score = 78; const r = 28; const cx = 34; const cy = 34;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;

  return (
    <div style={{ padding: '14px 16px' }}>
      <div style={{ fontSize: 10, color: T.inkMute, fontFamily: T.mono, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Radar · Account Health</div>

      {/* Wheel + stats row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        {/* Health ring */}
        <svg width={68} height={68} viewBox="0 0 68 68" style={{ flexShrink: 0 }}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--t-border1)" strokeWidth={5}/>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={T.tealLight} strokeWidth={5}
            strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
            transform={`rotate(-90 ${cx} ${cy})`}/>
          <text x={cx} y={cy+5} textAnchor="middle" fontSize={14} fontFamily="serif" fill={T.tealLight} fontWeight="700">B</text>
        </svg>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, flex: 1 }}>
          {([
            ['+184','New followers',T.tealLight],
            ['−47','Unfollowed',T.terra],
            ['78/100','Health score',T.inkDim],
            ['1.35x','Follow ratio',T.inkDim],
          ] as [string,string,string][]).map(([v,l,c]) => (
            <div key={l} style={{ padding: '7px 10px', borderRadius: 7, background: 'rgba(244,240,232,0.025)', border: '1px solid var(--t-surface2)' }}>
              <div style={{ fontFamily: T.serif, fontSize: 15, color: c, letterSpacing: '-0.01em', lineHeight: 1 }}>{v}</div>
              <div style={{ fontSize: 8, color: T.inkMute, marginTop: 2, letterSpacing: '0.04em' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Line chart */}
      <div style={{ fontSize: 9, color: T.inkMute, fontFamily: T.mono, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Follower growth</div>
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: 'block' }}>
        <defs>
          <linearGradient id="lg-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={T.tealMid} stopOpacity={0.3}/>
            <stop offset="100%" stopColor={T.tealMid} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#lg-area)"/>
        <path d={pathD} fill="none" stroke={T.tealLight} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx={(points.length-1)*step} cy={h - (points[points.length-1]!/max)*h} r={3} fill={T.tealLight}/>
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 8, color: T.inkMute, fontFamily: T.mono, marginTop: 4 }}>
        <span>12 weeks ago</span><span style={{ color: T.tealLight }}>Now</span>
      </div>
    </div>
  );
}

function MockDiff() {
  const gained = 23, lost = 11;
  const total  = gained + lost;
  return (
    <div style={{ padding: '14px 14px' }}>
      <div style={{ fontSize: 10, color: T.inkMute, fontFamily: T.mono, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Snapshot comparison</div>

      {/* Period */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
        <span style={{ fontSize: 10, fontFamily: T.mono, padding: '3px 8px', borderRadius: 5, background: 'var(--t-surface2)', border: '1px solid var(--t-border2)', color: T.inkDim }}>Apr 1</span>
        <svg width="20" height="8" viewBox="0 0 20 8" fill="none"><path d="M0 4H16M16 4L13 1M16 4L13 7" stroke={T.tealMid} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <span style={{ fontSize: 10, fontFamily: T.mono, padding: '3px 8px', borderRadius: 5, background: 'rgba(2,136,143,0.08)', border: `1px solid rgba(2,136,143,0.25)`, color: T.tealLight }}>May 9</span>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 12 }}>
        <div style={{ padding: '9px 10px', borderRadius: 8, background: 'rgba(2,136,143,0.07)', border: '1px solid rgba(2,136,143,0.2)' }}>
          <div style={{ fontFamily: T.serif, fontSize: 20, color: T.tealLight, letterSpacing: '-0.02em' }}>+{gained}</div>
          <div style={{ fontSize: 9, color: T.inkMute, marginTop: 2, fontFamily: T.mono }}>gained</div>
        </div>
        <div style={{ padding: '9px 10px', borderRadius: 8, background: 'rgba(168,75,47,0.07)', border: '1px solid rgba(168,75,47,0.2)' }}>
          <div style={{ fontFamily: T.serif, fontSize: 20, color: T.terra, letterSpacing: '-0.02em' }}>-{lost}</div>
          <div style={{ fontSize: 9, color: T.inkMute, marginTop: 2, fontFamily: T.mono }}>unfollowed</div>
        </div>
      </div>

      {/* Balance bar */}
      <div style={{ height: 5, borderRadius: 3, overflow: 'hidden', background: 'var(--t-surface2)', marginBottom: 12, display: 'flex' }}>
        <div style={{ width: `${(gained/total)*100}%`, background: T.tealMid, borderRadius: '3px 0 0 3px' }} />
        <div style={{ width: `${(lost/total)*100}%`, background: T.terra, borderRadius: '0 3px 3px 0' }} />
      </div>

      {/* Diff list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {([
          ['+','@new.fan',       T.tealLight,'new follower'],
          ['-','@old.friend',    T.terra,    'unfollowed you'],
          ['-','@silent.account',T.terra,    'unfollowed you'],
          ['+','@nova.frames',   T.tealLight,'new follower'],
          ['-','@hello.frame',   T.terra,    'unfollowed you'],
        ] as [string,string,string,string][]).map(([s,u,c,l],i) => (
          <div key={u} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 7px', borderRadius: 6, background: s === '+' ? 'rgba(2,136,143,0.04)' : 'rgba(168,75,47,0.04)', animation: `fade-up 0.5s ${0.3+i*0.07}s both` }}>
            <span style={{ color: c, fontWeight: 700, fontSize: 11, width: 10, flexShrink: 0 }}>{s}</span>
            <span style={{ color: T.ink, fontSize: 11, fontFamily: T.mono, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u}</span>
            <span style={{ color: T.inkMute, fontSize: 9, flexShrink: 0 }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductMock({
  title,
  variant,
  featured = false,
  style,
}: {
  title: string;
  variant: 'list' | 'csv' | 'diff';
  featured?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{
      background: T.bgCard, borderRadius: 14, overflow: 'hidden',
      border: `1px solid ${featured ? 'rgba(2,136,143,0.3)' : 'var(--t-border2)'}`,
      boxShadow: featured
        ? '0 40px 100px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(2,136,143,0.2)'
        : '0 20px 60px rgba(0,0,0,0.4), 0 0 0 0.5px var(--t-surface2)',
      ...style,
    }}>
      <div style={{ background: T.bgPanel, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid var(--t-surface2)' }}>
        <div style={{ width: 9, height: 9, borderRadius: '50%', background: T.terra }} />
        <div style={{ width: 9, height: 9, borderRadius: '50%', background: 'rgba(244,240,232,0.1)' }} />
        <div style={{ width: 9, height: 9, borderRadius: '50%', background: 'rgba(244,240,232,0.1)' }} />
        <span style={{ marginLeft: 12, fontSize: 11, color: T.inkMute, fontFamily: T.mono }}>{title}</span>
      </div>
      {variant === 'list' && <MockList />}
      {variant === 'csv'  && <MockCsv />}
      {variant === 'diff' && <MockDiff />}
    </div>
  );
}

// ─── Panel label chip ────────────────────────────────────────────────────────

function PanelLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      marginBottom: 12, padding: '4px 10px', borderRadius: 20,
      background: 'rgba(2,136,143,0.08)', border: '1px solid rgba(2,136,143,0.2)',
      fontSize: 10, fontFamily: T.mono, color: T.tealMid, letterSpacing: '0.1em', textTransform: 'uppercase',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: T.tealMid }} />
      {children}
    </div>
  );
}

// ─── Value Section ────────────────────────────────────────────────────────────

export function ValueSection() {
  const containerRef  = useRef<HTMLDivElement>(null);
  const leftRef       = useRef<HTMLDivElement>(null);
  const centerRef     = useRef<HTMLDivElement>(null);
  const rightRef      = useRef<HTMLDivElement>(null);
  const glowRef       = useRef<HTMLDivElement>(null);
  const rafRef        = useRef<number>(0);

  // Update transforms directly on DOM — no React state, no re-renders
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const mx = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const my = (e.clientY - rect.top - rect.height / 2) / rect.height;
      if (leftRef.current)   leftRef.current.style.transform   = `rotate(-2deg) translate(${mx * -6}px, ${my * -4}px)`;
      if (centerRef.current) centerRef.current.style.transform = `rotate(0.4deg) translate(${mx * 14}px, ${my * 8}px)`;
      if (rightRef.current)  rightRef.current.style.transform  = `rotate(2deg) translate(${mx * 18}px, ${my * 10}px)`;
      if (glowRef.current)   glowRef.current.style.background  = `radial-gradient(600px circle at ${50 + mx * 80}% ${50 + my * 80}%, rgba(2,136,143,0.06), transparent 60%)`;
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    if (leftRef.current)   leftRef.current.style.transform   = 'rotate(-2deg) translate(0px, 0px)';
    if (centerRef.current) centerRef.current.style.transform = 'rotate(0.4deg) translate(0px, 0px)';
    if (rightRef.current)  rightRef.current.style.transform  = 'rotate(2deg) translate(0px, 0px)';
    if (glowRef.current)   glowRef.current.style.background  = 'none';
  }, []);

  return (
    <section style={{ padding: '120px 48px', position: 'relative' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 14 }}>
          <span style={{ fontFamily: T.mono, fontSize: 11, color: T.tealMid, letterSpacing: '0.18em' }}>02 / OUTPUT</span>
          <div style={{ flex: 1, height: 1, background: 'var(--t-border2)' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 32, marginBottom: 64, flexWrap: 'wrap' }}>
          <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 400, lineHeight: 1.0, letterSpacing: '-0.03em', color: T.ink, margin: 0 }}>
            2 seconds to parse.<br/>
            <span style={{ fontStyle: 'italic', color: T.tealLight }}>A full picture to act on.</span>
          </h2>
          <p style={{ fontSize: 15, color: T.inkDim, maxWidth: 380, lineHeight: 1.65, margin: 0 }}>
            Drop the ZIP. Your browser reads it locally and gives you the exact list of who does not follow you back, a Radar health score, and a growth timeline. Nothing leaves your device.
          </p>
        </div>

        {/* Mobile: stacked mocks */}
        <div className="flex flex-col gap-4 md:hidden" style={{ marginTop: 32 }}>
          <ProductMock title="whounfollowed.app · Non-followers" variant="list" featured />
          <ProductMock title="Radar · Account Health" variant="csv" />
          <ProductMock title="Radar · Compare snapshots" variant="diff" />
        </div>

        {/* Desktop: overlapping panels — mouse parallax */}
        <div
          className="hidden md:block"
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ position: 'relative', height: 520, cursor: 'default', perspective: '1200px' }}
        >
          {/* Mouse glow — updated via ref, no re-renders */}
          <div ref={glowRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }} />

          {/* Left */}
          <div ref={leftRef} style={{ position: 'absolute', top: 60, left: '2%', width: '46%', zIndex: 1, transform: 'rotate(-2deg) translate(0px,0px)', transition: 'transform 0.15s ease-out' }}>
            <PanelLabel>Radar · Account Health</PanelLabel>
            <ProductMock title="Radar · Account Health" variant="csv" style={{ opacity: 0.92 }} />
          </div>

          {/* Centre */}
          <div ref={centerRef} style={{ position: 'absolute', top: 0, left: '22%', width: '56%', zIndex: 3, transform: 'rotate(0.4deg) translate(0px,0px)', transition: 'transform 0.12s ease-out' }}>
            <PanelLabel>Results · Non-followers</PanelLabel>
            <ProductMock title="whounfollowed.app · Non-followers" variant="list" featured />
          </div>

          {/* Right */}
          <div ref={rightRef} style={{ position: 'absolute', top: 60, left: '60%', width: '40%', zIndex: 4, transform: 'rotate(2deg) translate(0px,0px)', transition: 'transform 0.18s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <PanelLabel>Radar · Compare</PanelLabel>
            </div>
            <ProductMock title="Radar · Compare snapshots" variant="diff" style={{ opacity: 0.92 }} />
          </div>

        </div>

        {/* Bottom stat row */}
        <div style={{ marginTop: 40, display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          {[
            { label: 'Parse time',      value: '~2s',        note: 'in your browser' },
            { label: 'Data leaves device', value: '0 bytes', note: 'nothing uploaded' },
            { label: 'Instagram API calls', value: '0',      note: 'uses your own export' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontFamily: T.serif, fontSize: 28, letterSpacing: '-0.02em', color: T.tealLight }}>{s.value}</span>
              <div>
                <div style={{ fontSize: 11, color: T.inkDim }}>{s.label}</div>
                <div style={{ fontSize: 10, color: T.inkMute, fontFamily: T.mono }}>{s.note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
