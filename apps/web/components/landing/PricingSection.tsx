'use client';

import React from 'react';
import { T } from './tokens';
import { Icon } from './atoms';

type Billing = 'monthly' | 'annual';

type MobileTab = 'free' | 'pro' | 'mobile';

function PricingMobileTabs({ billing, mobileEmail, setMobileEmail, mobileStatus, handleMobileNotify }: {
  billing: Billing;
  mobileEmail: string;
  setMobileEmail: (v: string) => void;
  mobileStatus: 'idle' | 'sent' | 'error';
  handleMobileNotify: () => void;
}) {
  const [tab, setTab] = React.useState<MobileTab>('pro');

  return (
    <div className="sm:hidden">
      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: 4, padding: 4, borderRadius: 14, background: T.surface1, border: `1px solid ${T.border1}`, marginBottom: 16 }}>
        {(['free', 'pro', 'mobile'] as MobileTab[]).map(t => {
          const active = tab === t;
          const labels: Record<MobileTab, string> = { free: 'Free', pro: 'Pro', mobile: 'Mobile' };
          return (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: '10px 8px', borderRadius: 10, cursor: 'pointer',
              background: active ? (t === 'pro' ? 'rgba(2,136,143,0.18)' : T.surface2) : 'transparent',
              border: `1px solid ${active ? (t === 'pro' ? T.tealMid : T.border2) : 'transparent'}`,
              color: active ? T.ink : T.inkDim,
              fontSize: 13, fontWeight: active ? 600 : 400, fontFamily: T.sans, transition: 'all 0.2s',
            }}>
              {labels[t]}
            </button>
          );
        })}
      </div>

      {/* Free */}
      {tab === 'free' && (
        <div style={{ padding: '24px', borderRadius: 18, background: T.surface1, border: `1px solid ${T.border1}` }}>
          <div style={{ fontSize: 10, color: T.inkMute, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 8, fontFamily: T.mono }}>Free</div>
          <div style={{ fontFamily: T.serif, fontSize: 52, lineHeight: 1, letterSpacing: '-0.04em', color: T.ink, marginBottom: 4 }}>$0</div>
          <div style={{ fontSize: 12, color: T.inkMute, marginBottom: 16 }}>forever, no signup</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            {['One snapshot at a time','Full non-followers list','CSV export','No account needed'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: T.ink }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: T.tealMid, flexShrink: 0 }} />{f}
              </div>
            ))}
          </div>
          <button onClick={() => { const el = document.getElementById('upload'); if (el) el.scrollIntoView({ behavior: 'smooth' }); else window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ width: '100%', padding: '14px', borderRadius: 12, background: 'transparent', color: T.ink, border: `1px solid ${T.border3}`, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: T.sans }}>Use it free</button>
        </div>
      )}

      {/* Pro */}
      {tab === 'pro' && (
        <div style={{ padding: '28px 24px', borderRadius: 20, background: `linear-gradient(180deg, rgba(2,136,143,0.16) 0%, rgba(2,136,143,0.04) 100%)`, border: `1px solid ${T.tealMid}`, boxShadow: `0 20px 60px rgba(2,136,143,0.18)`, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 14, right: 14, display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 100, background: T.tealMid, fontSize: 9, fontWeight: 700, color: T.cream, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: T.sans }}>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: T.cream }} />Free during beta
          </div>
          <div style={{ fontSize: 10, color: T.tealLight, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 8, fontFamily: T.mono }}>Pro</div>
          <div style={{ fontFamily: T.serif, fontSize: 52, lineHeight: 1, letterSpacing: '-0.04em', color: T.ink, marginBottom: 4 }}>
            ${billing === 'monthly' ? '4.99' : '3.74'}<span style={{ fontSize: 16, color: T.inkMute, fontFamily: T.sans, fontWeight: 400 }}>/mo</span>
          </div>
          <div style={{ fontSize: 12, color: T.inkMute, marginBottom: 16 }}>{billing === 'monthly' ? 'billed monthly' : 'billed annually · save $18/year'}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            {['Everything in Free','Unlimited snapshot history','Radar: follow age, health score','Compare snapshots','Follower growth charts','Triage workflow','Cloud sync (coming soon)'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: T.ink }}>
                <Icon.check color={T.tealLight} size={13} />{f}
              </div>
            ))}
          </div>
          <button style={{ width: '100%', padding: '14px', borderRadius: 12, background: T.teal, color: T.cream, border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: T.sans, boxShadow: `0 8px 24px ${T.tealGlow}` }}>Joining soon. Reserve your spot</button>
        </div>
      )}

      {/* Mobile App */}
      {tab === 'mobile' && (
        <div style={{ padding: '24px', borderRadius: 18, background: T.surface1, border: `1px solid ${T.border1}` }}>
          <div style={{ fontSize: 10, color: T.inkMute, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 10, fontFamily: T.mono }}>
            Mobile App <span style={{ marginLeft: 6, padding: '2px 8px', borderRadius: 20, background: T.surface2, border: `1px solid ${T.border1}`, fontSize: 8, letterSpacing: '0.08em' }}>Soon</span>
          </div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
            {['iOS','Android'].map(p => <span key={p} style={{ padding: '5px 12px', borderRadius: 20, border: `1px solid ${T.border2}`, fontSize: 11, fontFamily: T.mono, color: T.inkDim }}>{p}</span>)}
          </div>
          <p style={{ fontSize: 12, color: T.tealMid, fontFamily: T.mono, marginBottom: 12 }}>Included with your Pro subscription</p>
          <p style={{ fontFamily: T.serif, fontSize: 15, fontStyle: 'italic', color: T.inkDim, lineHeight: 1.4, marginBottom: 16 }}>&ldquo;Your full Radar, in your pocket. No browser needed.&rdquo;</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {['Everything in Pro','Native iOS and Android','Works offline','Share results as an image','Included with your Pro subscription'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: T.ink }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: T.tealMid, flexShrink: 0 }} />{f}
              </div>
            ))}
          </div>
          {mobileStatus === 'sent' ? (
            <div style={{ padding: '13px', borderRadius: 11, background: 'rgba(2,136,143,0.1)', border: '1px solid rgba(2,136,143,0.25)', textAlign: 'center', fontSize: 13, color: T.tealLight }}>You are on the list.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input type="email" placeholder="your@email.com" value={mobileEmail} onChange={e => { setMobileEmail(e.target.value); }} style={{ width: '100%', padding: '11px 14px', borderRadius: 10, boxSizing: 'border-box', border: `1px solid ${mobileStatus === 'error' ? 'rgba(168,75,47,0.4)' : T.border2}`, background: T.surface1, color: T.ink, fontSize: 13, fontFamily: T.sans, outline: 'none' }} />
              <button onClick={handleMobileNotify} disabled={!mobileEmail.includes('@')} style={{ width: '100%', padding: '13px', borderRadius: 11, cursor: mobileEmail.includes('@') ? 'pointer' : 'not-allowed', background: 'transparent', color: mobileEmail.includes('@') ? T.ink : T.inkMute, border: `1px solid ${mobileEmail.includes('@') ? T.border3 : T.border1}`, fontSize: 13, fontWeight: 600, fontFamily: T.sans }}>Notify me at launch</button>
              {mobileStatus === 'error' && <p style={{ fontSize: 11, color: T.terra, margin: 0, fontFamily: T.mono }}>Something went wrong. Try again.</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PricingBig() {
  const [billing, setBilling] = React.useState<Billing>('monthly');
  const [mobileEmail, setMobileEmail] = React.useState('');
  const [mobileStatus, setMobileStatus] = React.useState<'idle' | 'sent' | 'error'>('idle');

  async function handleMobileNotify() {
    if (!mobileEmail.includes('@')) return;
    try {
      const res = await fetch('/api/capture-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: mobileEmail, csvFilename: 'mobile-app-waitlist', csvContent: '' }),
      });
      setMobileStatus(res.ok ? 'sent' : 'error');
    } catch { setMobileStatus('error'); }
  }

  return (
    <div>
      {/* Billing toggle */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: 4, borderRadius: 100,
        background: T.surface2,
        border: `1px solid ${T.border1}`,
        marginBottom: 32,
      }}>
        {(['monthly', 'annual'] as Billing[]).map(v => (
          <button key={v} onClick={() => setBilling(v)} style={{
            padding: '8px 18px', borderRadius: 100,
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
            fontFamily: T.sans, letterSpacing: '0.02em',
            background: billing === v ? T.toggleActiveBg : 'transparent',
            color: billing === v ? T.toggleActiveText : T.inkDim,
            border: 'none',
            transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
            textTransform: 'capitalize',
          }}>
            {v}
            {v === 'annual' && (
              <span style={{
                marginLeft: 6, fontSize: 9, padding: '2px 6px', borderRadius: 6,
                background: billing === 'annual' ? T.terra : 'rgba(168,75,47,0.2)',
                color: billing === 'annual' ? T.cream : T.terra,
                fontWeight: 700,
              }}>−25%</span>
            )}
          </button>
        ))}
      </div>

      {/* Desktop: 3-card grid */}
      <div className="hidden sm:grid" style={{ gridTemplateColumns: '1fr 1.2fr 1fr', gap: 14, alignItems: 'stretch' }}>
        {/* FREE */}
        <div style={{
          position: 'relative', padding: '22px 22px', borderRadius: 16,
          background: T.surface1, border: `1px solid ${T.border1}`,
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ fontSize: 10, color: T.inkMute, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 10, fontFamily: T.mono }}>Free</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
            <span style={{ fontFamily: T.serif, fontSize: 44, lineHeight: 1, letterSpacing: '-0.03em', color: T.ink }}>$0</span>
          </div>
          <div style={{ fontSize: 11, color: T.inkMute, marginBottom: 16 }}>forever, no signup</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20, flex: 1 }}>
            {['One snapshot at a time','Full non-followers list','CSV export','No account needed'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: T.ink }}>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: T.tealMid, flexShrink: 0 }} />{f}
              </div>
            ))}
          </div>
          <button
            onClick={() => { const el = document.getElementById('upload'); if (el) el.scrollIntoView({ behavior: 'smooth' }); else window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            style={{ width: '100%', padding: '10px 14px', borderRadius: 9, background: 'transparent', color: T.ink, border: `1px solid ${T.border3}`, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: T.sans }}
          >
            Use it free
          </button>
        </div>

        {/* PRO */}
        <div style={{
          position: 'relative', padding: '24px 24px 22px', borderRadius: 18,
          background: `linear-gradient(180deg, rgba(2,136,143,0.14) 0%, rgba(2,136,143,0.03) 100%)`,
          border: `1px solid ${T.tealMid}`,
          boxShadow: `0 16px 48px rgba(2,136,143,0.14)`,
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 14, right: 14, display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 9px', borderRadius: 100, background: T.tealMid, fontSize: 9, fontWeight: 700, color: T.cream, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: T.sans }}>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: T.cream, animation: 'glow-soft 2s ease-in-out infinite' }} />
            Free during beta
          </div>
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ fontSize: 10, color: T.tealLight, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 10, fontFamily: T.mono }}>Pro</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
              <span style={{ fontSize: 16, color: T.inkMute, marginRight: -2 }}>$</span>
              <span style={{ fontFamily: T.serif, fontSize: 52, lineHeight: 1, letterSpacing: '-0.03em', color: T.ink }}>
                {billing === 'monthly' ? '4.99' : '3.74'}
              </span>
              <span style={{ fontSize: 12, color: T.inkMute }}>/month</span>
            </div>
            <div style={{ fontSize: 11, color: T.inkMute, marginBottom: 16 }}>
              {billing === 'monthly' ? 'billed monthly · cancel anytime' : 'billed annually · save $18/year'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20, flex: 1 }}>
              {['Everything in Free','Unlimited snapshot history','Radar: health score, follow age, pending','Compare snapshots, see who unfollowed','Follower growth charts','Triage workflow','Cloud sync (coming soon)'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: T.ink }}>
                  <Icon.check color={T.tealLight} size={13} />{f}
                </div>
              ))}
            </div>
            <button
              style={{ width: '100%', padding: '11px 18px', borderRadius: 10, background: T.teal, color: T.cream, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: T.sans, boxShadow: `0 6px 20px ${T.tealGlow}`, transition: 'transform 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Joining soon. Reserve your spot
            </button>
          </div>
        </div>

        {/* MOBILE APP */}
        <div style={{
          position: 'relative', padding: '22px 22px', borderRadius: 16,
          background: T.surface1, border: `1px solid ${T.border1}`,
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 14, right: 14, padding: '3px 8px', borderRadius: 100, background: T.surface2, border: `1px solid ${T.border2}`, fontSize: 8, fontWeight: 700, color: T.inkDim, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: T.mono }}>Soon</div>
          <div style={{ fontSize: 10, color: T.inkMute, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 10, fontFamily: T.mono }}>Mobile App</div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
            {[
              { label: 'iOS', icon: <svg width="10" height="12" viewBox="0 0 384 512" fill="currentColor" opacity={.7}><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-16.9 75.8-16.9 31.8 0 48.3 16.9 76.4 16.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg> },
              { label: 'Android', icon: <svg width="11" height="12" viewBox="0 0 576 512" fill="currentColor" opacity={.7}><path d="M420.55 301.93a24 24 0 1 1 24-24 24 24 0 0 1-24 24m-265.1 0a24 24 0 1 1 24-24 24 24 0 0 1-24 24m273.7-144.48 47.94-83a10 10 0 1 0-17.27-10h0l-48.54 84.07a301.25 301.25 0 0 0-246.56 0L116.18 64.45a10 10 0 1 0-17.27 10h0l47.94 83C64.53 202.22 8.24 285.55 0 384h576c-8.24-98.45-64.54-181.78-146.85-226.55"/></svg> },
            ].map(p => (
              <span key={p.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, border: `1px solid ${T.border2}`, background: T.surface1, fontSize: 11, fontFamily: T.mono, color: T.inkDim }}>
                {p.icon}{p.label}
              </span>
            ))}
          </div>
          <p style={{ fontSize: 11, color: T.tealMid, fontFamily: T.mono, marginBottom: 14 }}>Included with Pro</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20, flex: 1 }}>
            {['Everything in Pro','Native iOS and Android','Works offline','Share results as an image'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: T.ink }}>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: T.tealMid, flexShrink: 0 }} />{f}
              </div>
            ))}
          </div>
          {mobileStatus === 'sent' ? (
            <div style={{ padding: '13px', borderRadius: 11, background: 'rgba(2,136,143,0.1)', border: '1px solid rgba(2,136,143,0.25)', textAlign: 'center', fontSize: 13, color: T.tealLight, fontFamily: T.sans }}>
              You are on the list.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input
                type="email"
                placeholder="your@email.com"
                value={mobileEmail}
                onChange={e => { setMobileEmail(e.target.value); setMobileStatus('idle'); }}
                style={{ width: '100%', padding: '11px 14px', borderRadius: 10, boxSizing: 'border-box', border: `1px solid ${mobileStatus === 'error' ? 'rgba(168,75,47,0.4)' : T.border3}`, background: T.surface1, color: T.ink, fontSize: 13, fontFamily: T.sans, outline: 'none' }}
              />
              <button
                onClick={() => void handleMobileNotify()}
                disabled={!mobileEmail.includes('@')}
                style={{ width: '100%', padding: '12px', borderRadius: 11, cursor: mobileEmail.includes('@') ? 'pointer' : 'not-allowed', background: 'transparent', color: mobileEmail.includes('@') ? T.ink : T.inkMute, border: `1px solid ${mobileEmail.includes('@') ? T.border3 : T.border1}`, fontSize: 13, fontWeight: 600, fontFamily: T.sans, transition: 'all 0.15s' }}
              >
                Notify me at launch
              </button>
              {mobileStatus === 'error' && <p style={{ fontSize: 11, color: T.terra, margin: 0, fontFamily: T.mono }}>Something went wrong. Try again.</p>}
            </div>
          )}
        </div>
      </div>

      {/* Mobile: single merged card with tab switcher */}
      <PricingMobileTabs billing={billing} mobileEmail={mobileEmail} setMobileEmail={setMobileEmail} mobileStatus={mobileStatus} handleMobileNotify={handleMobileNotify} />

      {/* Payment note */}
      <div className="hidden sm:flex" style={{ marginTop: 24, alignItems: 'center', justifyContent: 'center', gap: 18, fontSize: 11, color: T.inkMute, fontFamily: T.mono }}>
        {['Stripe checkout','SCA compliant','EU VAT included'].map(l => (
          <span key={l} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Icon.check size={11} color={T.tealMid} />{l}
          </span>
        ))}
      </div>
    </div>
  );
}

export function PricingSection() {
  return (
    <section id="pricing" className="px-4 sm:px-12 pb-24 sm:pb-32 relative">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 14 }}>
          <span style={{ fontFamily: T.mono, fontSize: 11, color: T.tealMid, letterSpacing: '0.18em' }}>05 / PRICING</span>
          <div style={{ flex: 1, height: 1, background: T.border2 }} />
        </div>
        <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 400, lineHeight: 1.0, letterSpacing: '-0.03em', marginBottom: 40, color: T.ink }}>
          Free is the answer<br/>
          <span style={{ fontStyle: 'italic', color: T.tealLight }}>for almost everyone.</span>
        </h2>
        <PricingBig />
      </div>
    </section>
  );
}
