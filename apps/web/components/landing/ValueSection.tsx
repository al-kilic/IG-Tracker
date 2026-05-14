import React from 'react';
import { T } from './tokens';

// ─── Mock screens ─────────────────────────────────────────────────────────────

function MockList() {
  return (
    <>
      {/* Stats — 2-col on mobile, 4-col on sm+ */}
      <div className="grid grid-cols-2 sm:grid-cols-4" style={{ borderBottom: '1px solid rgba(244,240,232,0.05)' }}>
        {([['1,203','Following'],['847','Followers'],['246',"Don't follow back"],['535','Mutuals']] as [string,string][]).map(([v,l],i) => (
          <div key={l} style={{
            padding: '12px 12px',
            borderRight: (i % 2 === 0) ? '1px solid rgba(244,240,232,0.04)' : 'none',
            borderBottom: i < 2 ? '1px solid rgba(244,240,232,0.04)' : 'none',
          }} className={i >= 2 ? 'sm:border-b-0' : ''}>
            <div style={{ fontFamily: T.serif, fontSize: 19, color: i === 2 ? T.tealLight : T.ink }}>{v}</div>
            <div style={{ fontSize: 8, color: T.inkMute, marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{l}</div>
          </div>
        ))}
      </div>
      {/* Tabs — scrollable on mobile */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(244,240,232,0.05)', padding: '0 12px', overflowX: 'auto' }}>
        {[["Don't follow back",'246'],['Fans','312'],['Mutuals','535']].map(([t,n],i) => (
          <div key={t} style={{
            padding: '9px 10px', fontSize: 10, fontWeight: i === 0 ? 600 : 400,
            color: i === 0 ? T.ink : T.inkMute,
            borderBottom: `2px solid ${i === 0 ? T.tealMid : 'transparent'}`,
            whiteSpace: 'nowrap', flexShrink: 0,
          }}>{t} <span style={{ opacity: 0.6 }}>({n})</span></div>
        ))}
        <div style={{ marginLeft: 'auto', padding: '9px 0', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: 9, color: T.tealLight, padding: '3px 8px', border: `1px solid rgba(2,136,143,0.3)`, borderRadius: 6 }}>CSV</span>
        </div>
      </div>
      <div style={{ padding: '4px 6px' }}>
        {([
          ['@alex.studio',  '12.4k','Photography'],
          ['@marco.visuals','8.1k', 'Director'],
          ['@sarah_creates','24.8k','Designer'],
          ['@the.luminary', '3.2k', 'Writer'],
          ['@wave.theory',  '47.1k','Music'],
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
  const bars = [42,58,71,65,89,76,94,88,102,96,118,124];
  const max  = Math.max(...bars);
  return (
    <div style={{ padding: '14px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 10, color: T.inkMute, fontFamily: T.mono, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Pro · Growth Report</div>
          <div style={{ fontFamily: T.serif, fontSize: 17, color: T.ink, marginTop: 2, letterSpacing: '-0.01em' }}>Last 12 weeks</div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['Week','Month','All'].map((t,i) => (
            <span key={t} style={{ fontSize: 9, padding: '3px 8px', borderRadius: 5, fontFamily: T.mono, color: i === 1 ? T.cream : T.inkMute, background: i === 1 ? T.tealMid : 'transparent', border: i === 1 ? 'none' : '1px solid rgba(244,240,232,0.08)' }}>{t}</span>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3" style={{ gap: 6, marginBottom: 14 }}>
        {([
          ['+184','New followers', T.tealLight,'↑'],
          ['−47', 'Unfollowed',   T.terra,     '↓'],
          ['+137','Net change',   T.cream,      '↑'],
        ] as [string,string,string,string][]).map(([v,l,c,arrow]) => (
          <div key={l} style={{ padding: '10px 12px', borderRadius: 8, background: 'rgba(244,240,232,0.025)', border: '1px solid rgba(244,240,232,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontFamily: T.serif, fontSize: 18, color: c, letterSpacing: '-0.01em' }}>{v}</span>
              <span style={{ fontSize: 9, color: c, opacity: 0.7 }}>{arrow}</span>
            </div>
            <div style={{ fontSize: 9, color: T.inkMute, marginTop: 1, letterSpacing: '0.04em' }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 64, marginBottom: 6 }}>
        {bars.map((v,i) => (
          <div key={i} style={{
            flex: 1, height: `${(v/max)*100}%`,
            background: `linear-gradient(180deg, ${i >= 8 ? T.tealLight : T.tealMid}, ${T.teal})`,
            borderRadius: '3px 3px 1px 1px', opacity: 0.85,
            animation: `bar-grow 0.7s ${0.4+i*0.04}s cubic-bezier(0.16,1,0.3,1) both`,
            transformOrigin: 'bottom',
          }} />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 8, color: T.inkMute, fontFamily: T.mono, letterSpacing: '0.06em' }}>
        <span>WK 1</span><span>WK 6</span><span style={{ color: T.tealLight }}>NOW</span>
      </div>
    </div>
  );
}

function MockDiff() {
  return (
    <div style={{ padding: 14 }}>
      <div style={{ fontSize: 11, color: T.inkMute, marginBottom: 10, fontFamily: T.mono }}>Snapshot A → Snapshot B</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {([
          ['+','@new.fan',       T.tealLight,'started following'],
          ['−','@old.friend',    T.terra,    'unfollowed'],
          ['−','@silent.account',T.terra,    'unfollowed'],
          ['+','@nova.frames',  T.tealLight,'started following'],
          ['−','@hello.frame',   T.terra,    'unfollowed'],
        ] as [string,string,string,string][]).map(([s,u,c,l],i) => (
          <div key={u} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontFamily: T.mono, animation: `fade-up 0.5s ${0.3+i*0.08}s both` }}>
            <span style={{ color: c, fontWeight: 700, width: 12 }}>{s}</span>
            <span style={{ color: T.ink, flex: 1 }}>{u}</span>
            <span style={{ color: T.inkMute, fontSize: 10 }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductMock({
  title,
  variant,
  style,
}: {
  title: string;
  variant: 'list' | 'csv' | 'diff';
  style?: React.CSSProperties;
}) {
  return (
    <div style={{
      background: T.bgCard, borderRadius: 14, overflow: 'hidden',
      border: '1px solid rgba(244,240,232,0.08)',
      boxShadow: '0 30px 80px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(244,240,232,0.04)',
      ...style,
    }}>
      <div style={{ background: T.bgPanel, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid rgba(244,240,232,0.05)' }}>
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

// ─── Value Section ────────────────────────────────────────────────────────────

export function ValueSection() {
  return (
    <section className="px-4 sm:px-12 py-20 sm:py-32 relative">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 14 }}>
          <span style={{ fontFamily: T.mono, fontSize: 11, color: T.tealMid, letterSpacing: '0.18em' }}>02 / VALUE</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(244,240,232,0.08)' }} />
        </div>
        <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 400, lineHeight: 1.0, letterSpacing: '-0.03em', marginBottom: 18, color: T.ink }}>
          What you actually get<br/>
          <span style={{ fontStyle: 'italic', color: T.tealLight }}>after one upload.</span>
        </h2>
        <p style={{ fontSize: 16, color: T.inkDim, maxWidth: 540, lineHeight: 1.55, marginBottom: 48 }}>
          Not a vague graph. Not a recommendation. The actual list of every account you follow that doesn&apos;t follow you back, plus a growth dashboard if you save snapshots over time.
        </p>

        {/* Desktop: layered absolute layout */}
        <div className="hidden md:block" style={{ position: 'relative', height: 540 }}>
          <ProductMock
            style={{ position: 'absolute', top: 40, left: '6%', width: '52%', transform: 'rotate(-1.2deg)', opacity: 0.85, zIndex: 1 }}
            title="Pro · Growth Dashboard"
            variant="csv"
          />
          <ProductMock
            style={{ position: 'absolute', top: 0, left: '24%', width: '60%', transform: 'rotate(0.6deg)', zIndex: 3 }}
            title="whounfollowed.app · Non-followers"
            variant="list"
          />
          <ProductMock
            style={{ position: 'absolute', top: 80, left: '60%', width: '36%', transform: 'rotate(2deg)', zIndex: 2 }}
            title="Compare snapshots"
            variant="diff"
          />
        </div>

        {/* Mobile: stacked single mocks */}
        <div className="flex flex-col gap-4 md:hidden">
          <ProductMock title="whounfollowed.app · Non-followers" variant="list" />
          <ProductMock title="Pro · Growth Dashboard" variant="csv" />
          <ProductMock title="Compare snapshots" variant="diff" />
        </div>
      </div>
    </section>
  );
}
