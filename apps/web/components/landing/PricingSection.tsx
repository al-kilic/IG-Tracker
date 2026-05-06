'use client';

import React from 'react';
import { T } from './tokens';
import { Icon } from './atoms';

type Billing = 'monthly' | 'annual';

function PricingBig() {
  const [billing, setBilling] = React.useState<Billing>('monthly');

  return (
    <div>
      {/* Billing toggle */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: 4, borderRadius: 100,
        background: 'rgba(244,240,232,0.04)',
        border: '1px solid rgba(244,240,232,0.06)',
        marginBottom: 32,
      }}>
        {(['monthly', 'annual'] as Billing[]).map(v => (
          <button key={v} onClick={() => setBilling(v)} style={{
            padding: '8px 18px', borderRadius: 100,
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
            fontFamily: T.sans, letterSpacing: '0.02em',
            background: billing === v ? T.cream : 'transparent',
            color: billing === v ? T.bgDeep : T.inkDim,
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.25fr 1fr', gap: 18, alignItems: 'stretch' }}>
        {/* FREE */}
        <div style={{
          position: 'relative', padding: '32px 28px', borderRadius: 20,
          background: 'rgba(244,240,232,0.02)', border: '1px solid rgba(244,240,232,0.06)',
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ fontSize: 11, color: T.inkMute, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 14, fontFamily: T.mono }}>Free</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
            <span style={{ fontFamily: T.serif, fontSize: 64, lineHeight: 1, letterSpacing: '-0.04em', color: T.ink }}>$0</span>
          </div>
          <div style={{ fontSize: 12, color: T.inkMute, marginBottom: 22 }}>forever, no signup</div>
          <p style={{ fontFamily: T.serif, fontSize: 16, fontStyle: 'italic', color: T.inkDim, lineHeight: 1.55, marginBottom: 28 }}>
            &ldquo;Run it once, get the list, move on with your day.&rdquo;
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginBottom: 28, flex: 1 }}>
            {['One snapshot at a time','Full non-followers list','CSV export','Up to 3 saved locally','No account needed'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: T.ink }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: T.tealMid, flexShrink: 0 }} />{f}
              </div>
            ))}
          </div>
          <button
            onClick={() => { const el = document.getElementById('upload'); if (el) { el.scrollIntoView({ behavior: 'smooth' }); } else { window.scrollTo({ top: 0, behavior: 'smooth' }); } }}
            style={{ width: '100%', padding: '13px 18px', borderRadius: 11, background: 'transparent', color: T.ink, border: '1px solid rgba(244,240,232,0.18)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: T.sans }}
          >
            Use it free
          </button>
        </div>

        {/* PRO */}
        <div style={{
          position: 'relative', padding: '40px 32px 32px', borderRadius: 22,
          background: `linear-gradient(180deg, rgba(2,136,143,0.16) 0%, rgba(2,136,143,0.04) 100%)`,
          border: `1px solid ${T.tealMid}`,
          boxShadow: `0 30px 80px rgba(2,136,143,0.18), inset 0 1px 0 rgba(244,240,232,0.08)`,
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -120, left: '50%', transform: 'translateX(-50%)', width: 320, height: 320, borderRadius: '50%', background: `radial-gradient(circle, ${T.tealGlow} 0%, transparent 60%)`, filter: 'blur(40px)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: 18, right: 18, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 11px', borderRadius: 100, background: T.tealMid, fontSize: 10, fontWeight: 700, color: T.cream, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: T.sans, animation: 'badge-fall 0.7s 0.3s cubic-bezier(0.16,1,0.3,1) both' }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: T.cream, animation: 'glow-soft 2s ease-in-out infinite' }} />
            Free during beta
          </div>
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ fontSize: 11, color: T.tealLight, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 14, fontFamily: T.mono }}>Pro</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
              <span style={{ fontSize: 22, color: T.inkMute, marginRight: -4 }}>$</span>
              <span style={{ fontFamily: T.serif, fontSize: 80, lineHeight: 1, letterSpacing: '-0.04em', color: T.ink }}>
                {billing === 'monthly' ? '4.99' : '3.74'}
              </span>
              <span style={{ fontSize: 13, color: T.inkMute }}>/month</span>
            </div>
            <div style={{ fontSize: 12, color: T.inkMute, marginBottom: 22 }}>
              {billing === 'monthly' ? 'billed monthly · cancel anytime' : 'billed annually · save $18/year'}
            </div>
            <p style={{ fontFamily: T.serif, fontSize: 17, fontStyle: 'italic', color: T.ink, lineHeight: 1.4, marginBottom: 28 }}>
              &ldquo;For creators who want to see the curve, not just the snapshot.&rdquo;
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginBottom: 28, flex: 1 }}>
              {['Everything in Free','Unlimited snapshot history','Alerts when someone unfollows','Follower timeline charts','New & lost follower detection','Encrypted cloud sync across devices'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: T.ink }}>
                  <Icon.check color={T.tealLight} size={15} />{f}
                </div>
              ))}
            </div>
            <button
              style={{ width: '100%', padding: '15px 22px', borderRadius: 12, background: T.teal, color: T.cream, border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: T.sans, boxShadow: `0 12px 32px ${T.tealGlow}, inset 0 1px 0 rgba(244,240,232,0.15)`, transition: 'transform 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Get Pro
            </button>
          </div>
        </div>

        {/* DESKTOP */}
        <div style={{
          position: 'relative', padding: '32px 28px', borderRadius: 20,
          background: 'rgba(244,240,232,0.02)', border: '1px solid rgba(244,240,232,0.06)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 18, right: 18, padding: '4px 10px', borderRadius: 100, background: 'rgba(244,240,232,0.06)', border: '1px solid rgba(244,240,232,0.1)', fontSize: 9, fontWeight: 700, color: T.inkDim, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: T.mono }}>Soon</div>
          <div style={{ fontSize: 11, color: T.inkMute, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 14, fontFamily: T.mono }}>Desktop</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
            <span style={{ fontFamily: T.serif, fontSize: 64, lineHeight: 1, letterSpacing: '-0.04em', color: T.ink }}>$19</span>
          </div>
          <div style={{ fontSize: 12, color: T.inkMute, marginBottom: 22 }}>one-time, lifetime</div>
          <p style={{ fontFamily: T.serif, fontSize: 16, fontStyle: 'italic', color: T.inkDim, lineHeight: 1.4, marginBottom: 28 }}>
            &ldquo;Pay once. Run forever. Even if we go away.&rdquo;
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginBottom: 28, flex: 1 }}>
            {['Everything in Pro','Mac · Windows · Linux','Fully offline','No subscription, ever','Lifetime updates'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: T.ink }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: T.tealMid, flexShrink: 0 }} />{f}
              </div>
            ))}
          </div>
          <button
            onClick={() => { window.location.href = 'mailto:aekilicc@gmail.com?subject=Notify%20me%20at%20WhoUnfollowed%20Desktop%20launch'; }}
            style={{ width: '100%', padding: '13px 18px', borderRadius: 11, background: 'transparent', color: T.ink, border: '1px solid rgba(244,240,232,0.18)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: T.sans }}
          >
            Notify me at launch
          </button>
        </div>
      </div>

      {/* Payment note */}
      <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, fontSize: 11, color: T.inkMute, fontFamily: T.mono }}>
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
    <section id="pricing" style={{ padding: '0 48px 120px', position: 'relative' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 14 }}>
          <span style={{ fontFamily: T.mono, fontSize: 11, color: T.tealMid, letterSpacing: '0.18em' }}>05 / PRICING</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(244,240,232,0.08)' }} />
        </div>
        <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 400, lineHeight: 1.0, letterSpacing: '-0.03em', marginBottom: 56, color: T.ink }}>
          Free is the answer<br/>
          <span style={{ fontStyle: 'italic', color: T.tealLight }}>for almost everyone.</span>
        </h2>
        <PricingBig />
      </div>
    </section>
  );
}
