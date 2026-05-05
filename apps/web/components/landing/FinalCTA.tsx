import React from 'react';
import Link from 'next/link';
import { T } from './tokens';
import { Icon, GridBg, MagneticCTA } from './atoms';

export function FinalCTA() {
  return (
    <section style={{ padding: '40px 48px 96px', position: 'relative' }}>
      <div style={{
        maxWidth: 1240, margin: '0 auto',
        position: 'relative', overflow: 'hidden', borderRadius: 32,
        background: `linear-gradient(135deg, #0c1e22 0%, #0a1518 60%, #08272a 100%)`,
        border: '1px solid rgba(2,136,143,0.3)',
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.5 }}>
          <GridBg opacity={0.06} />
        </div>
        <div style={{ position: 'absolute', top: -120, right: -120, width: 480, height: 480, borderRadius: '50%', background: `radial-gradient(circle, ${T.tealGlow} 0%, transparent 65%)`, filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -180, left: -100, width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,75,47,0.18) 0%, transparent 60%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <div style={{ position: 'absolute', right: 32, top: 32, bottom: 32, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontFamily: T.mono, fontSize: 10, color: T.inkMute, letterSpacing: '0.18em', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
          <span>SEC.07 · CTA</span>
          <span>IGTRACKER · 2026</span>
        </div>

        <div style={{ position: 'relative', zIndex: 2, padding: '88px 96px 80px', display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 64, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 100, background: 'rgba(2,136,143,0.12)', border: '1px solid rgba(2,136,143,0.25)', marginBottom: 24 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.tealLight, animation: 'glow-soft 2s ease-in-out infinite' }} />
              <span style={{ fontSize: 11, color: T.tealLight, fontFamily: T.mono, letterSpacing: '0.08em', fontWeight: 600 }}>READY WHEN YOU ARE</span>
            </div>
            <h3 style={{ fontFamily: T.serif, fontSize: 'clamp(48px, 6vw, 88px)', fontWeight: 400, lineHeight: 0.95, letterSpacing: '-0.04em', marginBottom: 24, color: T.ink }}>
              You already<br/>have the<br/>
              <span style={{ fontStyle: 'italic', color: T.tealLight }}>answer.</span>
            </h3>
            <p style={{ fontSize: 17, color: T.inkDim, lineHeight: 1.5, marginBottom: 32, maxWidth: 460 }}>
              Instagram already handed you the data. We just put it through a parser they{"didn't"} bother to write. One drop, one list, your account stays untouched.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
              <MagneticCTA primary>Drop your export</MagneticCTA>
              <Link href="/how-to-export" style={{ background: 'transparent', color: T.ink, border: '1px solid rgba(244,240,232,0.18)', padding: '14px 22px', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: T.sans, display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                <Icon.code size={14} color={T.tealMid} />
                How to request your data
              </Link>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 12, color: T.inkMute, fontFamily: T.mono, letterSpacing: '0.04em' }}>
              {[['shield','no login'],['bolt','runs in browser'],['code','open source']] .map(([icon, label]) => (
                <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  {icon === 'shield' && <Icon.shield size={13} color={T.tealMid} />}
                  {icon === 'bolt'   && <Icon.bolt   size={13} color={T.tealMid} />}
                  {icon === 'code'   && <Icon.code   size={13} color={T.tealMid} />}
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Preview card */}
          <div style={{ position: 'relative' }}>
            <div style={{ background: 'rgba(20,33,38,0.85)', backdropFilter: 'blur(8px)', border: '1px solid rgba(244,240,232,0.08)', borderRadius: 18, padding: '20px 22px', boxShadow: '0 30px 80px rgba(0,0,0,0.5)', transform: 'rotate(-1.5deg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ fontFamily: T.mono, fontSize: 10, color: T.inkMute, letterSpacing: '0.1em' }}>YOUR RESULT (PREVIEW)</div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {[0,1,2].map(i => <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(244,240,232,0.2)' }} />)}
                </div>
              </div>
              <div style={{ fontFamily: T.serif, fontSize: 36, lineHeight: 1, letterSpacing: '-0.02em', marginBottom: 4 }}>
                <span style={{ color: T.tealLight }}>246</span>
                <span style={{ color: T.inkMute, fontSize: 22 }}>/1,203</span>
              </div>
              <div style={{ fontSize: 12, color: T.inkDim, marginBottom: 16 }}>accounts you follow that{"don't"} follow you back</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                {(['@alex.studio','@marco.visuals','@sarah_creates','+ 243 more'] as string[]).map((u,i) => (
                  <div key={u} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: 6, background: i === 3 ? 'transparent' : 'rgba(244,240,232,0.025)', fontSize: 12, color: i === 3 ? T.tealLight : T.ink, fontFamily: T.mono, fontStyle: i === 3 ? 'italic' : 'normal' }}>
                    {i < 3 && <span style={{ width: 18, height: 18, borderRadius: '50%', background: `hsl(${i*80+200} 30% 40%)` }} />}
                    {u}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <span style={{ flex: 1, padding: '8px 10px', borderRadius: 8, background: T.tealMid, color: T.cream, fontSize: 11, fontWeight: 600, textAlign: 'center', fontFamily: T.sans }}>Export CSV</span>
                <span style={{ flex: 1, padding: '8px 10px', borderRadius: 8, background: 'rgba(244,240,232,0.04)', border: '1px solid rgba(244,240,232,0.08)', color: T.ink, fontSize: 11, fontWeight: 600, textAlign: 'center', fontFamily: T.sans }}>Save snapshot</span>
              </div>
            </div>
            <div style={{ position: 'absolute', top: -16, right: -8, fontFamily: T.serif, fontSize: 14, fontStyle: 'italic', color: T.terra, opacity: 0.7, padding: '4px 10px', border: `1px solid ${T.terra}`, borderRadius: 100, transform: 'rotate(8deg)', background: 'rgba(168,75,47,0.08)' }}>
              example only
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LandingFooter() {
  return (
    <footer style={{ padding: '64px 48px 48px', borderTop: '1px solid rgba(244,240,232,0.05)', position: 'relative' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 48, marginBottom: 56 }}>
          <div>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, textDecoration: 'none' }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: `linear-gradient(135deg, ${T.tealMid}, ${T.teal})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon.shield size={16} color={T.cream} />
              </div>
              <span style={{ fontFamily: T.serif, fontSize: 22, color: T.ink, letterSpacing: '-0.01em' }}>IG Tracker</span>
            </Link>
            <p style={{ fontFamily: T.serif, fontSize: 18, fontStyle: 'italic', color: T.inkDim, lineHeight: 1.4, maxWidth: 320, marginBottom: 20 }}>
              A simple tool that respects what every other one of these tools quietly violated.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, color: T.inkMute, fontFamily: T.mono, letterSpacing: '0.04em' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#5fbb73' }} />
              All systems operational
            </div>
          </div>

          {[
            { title: 'Product', items: [
              { label: 'How to request your data', href: '/how-to-export' },
              { label: 'Privacy approach',         href: '/privacy' },
              { label: 'Source code',              href: 'https://github.com/al-kilic/IG-Tracker' },
              { label: 'Changelog',                href: '#' },
            ]},
            { title: 'Company', items: [
              { label: 'About',     href: '#' },
              { label: 'Contact',   href: 'mailto:aekilicc@gmail.com' },
            ]},
            { title: 'Legal', items: [
              { label: 'Privacy policy',   href: '/privacy' },
              { label: 'Refund policy',    href: '/refund' },
              { label: 'Cookie policy',    href: '/cookies' },
              { label: 'Terms of service', href: '/terms' },
            ]},
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontSize: 11, color: T.inkMute, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 16, fontFamily: T.mono, fontWeight: 600 }}>{col.title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                {col.items.map(l => (
                  <a
                    key={l.label}
                    href={l.href}
                    style={{ fontSize: 14, color: T.inkDim, cursor: 'pointer', textDecoration: 'none', transition: 'color 0.2s', fontFamily: T.sans }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = T.ink; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = T.inkDim; }}
                  >{l.label}</a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, paddingTop: 24, borderTop: '1px solid rgba(244,240,232,0.05)' }}>
          <div style={{ fontSize: 12, color: T.inkMute, fontFamily: T.mono, letterSpacing: '0.04em' }}>
            © 2026 IG Tracker · Independent · Not affiliated with Instagram or Meta
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {[
              { name: 'GitHub', href: 'https://github.com/al-kilic/IG-Tracker', icon: <Icon.gh size={16} color={T.inkDim} /> },
              { name: 'Email',  href: 'mailto:aekilicc@gmail.com', icon: (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="1.5" y="3" width="13" height="10" rx="1.5" stroke={T.inkDim} strokeWidth="1.3"/>
                  <path d="M2 4 L8 9 L14 4" stroke={T.inkDim} strokeWidth="1.3" fill="none" strokeLinecap="round"/>
                </svg>
              )},
              { name: 'RSS',    href: '#', icon: (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 11.5 a1 1 0 1 1 0.001 0" fill={T.inkDim}/>
                  <path d="M2 7 a5 5 0 0 1 5 5" stroke={T.inkDim} strokeWidth="1.3" fill="none" strokeLinecap="round"/>
                  <path d="M2 3 a9 9 0 0 1 9 9" stroke={T.inkDim} strokeWidth="1.3" fill="none" strokeLinecap="round"/>
                </svg>
              )},
            ].map(s => (
              <a
                key={s.name}
                title={s.name}
                href={s.href}
                style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(244,240,232,0.08)', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(244,240,232,0.2)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(244,240,232,0.08)'; }}
              >{s.icon}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
