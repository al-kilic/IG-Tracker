import React from 'react';
import { T } from './tokens';
import { Icon } from './atoms';

const US_ITEMS = [
  'You upload your own data export, never your password',
  'ZIP is parsed in your browser tab',
  'No account, no email, no signup',
  'Parser source code is public · MIT-licensed',
  'Built on a feature Instagram offers under GDPR',
];

const THEM_ITEMS = [
  'Demands your Instagram username + password',
  'Stores your credentials and full account graph',
  'Requires signup and often payment',
  'Closed-source · you trust their word for it',
  'TOS-violating · accounts get flagged or banned',
];

function CompareGrid() {
  return (
    <div style={{ borderRadius: 18, overflow: 'hidden', border: '1px solid rgba(244,240,232,0.06)' }}>
      <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 0 }}>
        <div style={{ padding: '28px', background: 'rgba(2,136,143,0.06)', borderBottom: '1px solid rgba(244,240,232,0.06)' }}
          className="sm:border-b-0 sm:border-r sm:border-r-[rgba(244,240,232,0.06)]">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: T.teal, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon.shield size={16} color={T.cream}/>
            </div>
            <div>
              <div style={{ fontSize: 11, color: T.tealLight, letterSpacing: '0.14em', fontFamily: T.mono }}>WhoUnfollowed</div>
              <div style={{ fontFamily: T.serif, fontSize: 20, lineHeight: 1.1, color: T.ink }}>Your data, your device.</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {US_ITEMS.map((line, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ flexShrink: 0, marginTop: 3, width: 16, height: 16, borderRadius: '50%', background: T.tealMid, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon.check size={10} color={T.cream}/>
                </div>
                <span style={{ fontSize: 13, color: T.ink, lineHeight: 1.5 }}>{line}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '28px', background: 'rgba(168,75,47,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(168,75,47,0.2)', border: `1px solid ${T.terra}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: T.serif, fontSize: 18, color: T.terra, fontStyle: 'italic' }}>x</span>
            </div>
            <div>
              <div style={{ fontSize: 11, color: T.terra, letterSpacing: '0.14em', fontFamily: T.mono }}>EVERYONE ELSE</div>
              <div style={{ fontFamily: T.serif, fontSize: 20, lineHeight: 1.1, color: T.inkDim }}>Hostage transaction.</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {THEM_ITEMS.map((line, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ flexShrink: 0, marginTop: 3, width: 16, height: 16, borderRadius: '50%', background: 'rgba(168,75,47,0.15)', border: `1px solid ${T.terra}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon.x size={9} color={T.terra}/>
                </div>
                <span style={{ fontSize: 13, color: T.inkDim, lineHeight: 1.5 }}>{line}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CompareSection() {
  return (
    <section id="privacy" className="px-4 sm:px-12 pb-24 sm:pb-32">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 14 }}>
          <span style={{ fontFamily: T.mono, fontSize: 11, color: T.terra, letterSpacing: '0.18em' }}>04 / WHY US</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(244,240,232,0.08)' }} />
        </div>
        <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 400, lineHeight: 1.0, letterSpacing: '-0.03em', marginBottom: 18, color: T.ink }}>
          Every other tool<br/>
          <span style={{ position: 'relative' }}>
            <s style={{ textDecorationColor: T.terra, textDecorationThickness: '5px' }}>asks for your password.</s>
          </span>
        </h2>
        <p style={{ fontSize: 16, color: T.inkDim, maxWidth: 600, marginBottom: 56, lineHeight: 1.55 }}>
          Handing over your Instagram password to a third-party app isn&apos;t just risky. It violates Instagram&apos;s own Terms of Service and puts your account at permanent risk of suspension. Dozens of these tools have already been caught storing or selling those credentials. Your account, your audience, your income, handed to a stranger for a follower list.
        </p>
        <CompareGrid />
      </div>
    </section>
  );
}
