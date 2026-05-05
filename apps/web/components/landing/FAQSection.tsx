'use client';

import React from 'react';
import { T } from './tokens';
import { Icon } from './atoms';

type CategoryId = 'privacy' | 'product' | 'billing';

const CATEGORIES: { id: CategoryId; label: string; count: number }[] = [
  { id: 'privacy', label: 'Privacy & data',  count: 3 },
  { id: 'product', label: 'How it works',    count: 3 },
  { id: 'billing', label: 'Plans & billing', count: 2 },
];

const ITEMS: Record<CategoryId, [string, string][]> = {
  privacy: [
    ['Do I need to give you my Instagram password?',
     'No. We literally cannot accept it, there is no login form anywhere on the site. You upload your own data export, a ZIP file Instagram emails to you on request.'],
    ['Where does my data go after I upload it?',
     "On the Free plan, nowhere. The ZIP is read by JavaScript inside your browser tab and discarded when you close the page. On Pro, snapshots you choose to save are stored encrypted in our cloud so you can compare them across devices."],
    ['Will Instagram ban me for using this?',
     "No. The data export is a feature Instagram offers to comply with GDPR. You're using their official tool, not scraping their API or violating any terms."],
  ],
  product: [
    ['How accurate are the results?',
     "Exact. We compare your Followers list against your Following list directly. If a username appears in one and not the other, that is the truth, not an estimate or a probability."],
    ['Can I track changes over time?',
     "Yes, on Pro. Each upload becomes a snapshot. You can compare any two snapshots to see who started following, who unfollowed, and who quietly came back."],
    ['What file format do you need?',
     "The ZIP file Instagram sends you when you request your data. Just request followers and following, you don't need the whole archive."],
  ],
  billing: [
    ['Why is Pro free during beta?',
     "Because we want feedback, not your money yet. When the product is solid, Pro will be $4.99/month. Anyone who joined during beta keeps free Pro for the lifetime of their account."],
    ["What happens if I cancel Pro?",
     "You can cancel anytime from your account. Your saved snapshots export to CSV anytime, even after cancellation. Free plan remains available with no data loss."],
  ],
};

export function FAQSection() {
  const [activeCat, setActiveCat] = React.useState<CategoryId>('privacy');
  const [openIdx,   setOpenIdx]   = React.useState(0);

  React.useEffect(() => { setOpenIdx(0); }, [activeCat]);

  return (
    <section style={{ padding: '0 48px 120px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 14 }}>
          <span style={{ fontFamily: T.mono, fontSize: 11, color: T.tealMid, letterSpacing: '0.18em' }}>06 / QUESTIONS</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(244,240,232,0.08)' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 64, alignItems: 'flex-start' }}>
          {/* Left: sticky sidebar */}
          <div style={{ position: 'sticky', top: 80 }}>
            <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(40px, 4.5vw, 56px)', fontWeight: 400, lineHeight: 1.0, letterSpacing: '-0.03em', marginBottom: 18, color: T.ink }}>
              The honest<br/>
              <span style={{ fontStyle: 'italic', color: T.tealLight }}>answers.</span>
            </h2>
            <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.55, marginBottom: 32, maxWidth: 320 }}>
              Not the marketing ones. If something here doesn&apos;t address what you actually want to know, the contact link is real.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 28 }}>
              {CATEGORIES.map(c => {
                const active = activeCat === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveCat(c.id)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '12px 14px', borderRadius: 10,
                      background: active ? 'rgba(2,136,143,0.1)' : 'transparent',
                      border: `1px solid ${active ? 'rgba(2,136,143,0.3)' : 'transparent'}`,
                      color: active ? T.ink : T.inkDim,
                      fontSize: 14, fontWeight: active ? 600 : 400,
                      fontFamily: T.sans, cursor: 'pointer', textAlign: 'left',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ width: 4, height: 18, borderRadius: 2, background: active ? T.tealLight : 'transparent', transition: 'background 0.2s' }} />
                      {c.label}
                    </span>
                    <span style={{ fontSize: 11, color: T.inkMute, fontFamily: T.mono }}>{c.count}</span>
                  </button>
                );
              })}
            </div>

            <div style={{ padding: '18px', background: 'rgba(244,240,232,0.025)', border: '1px solid rgba(244,240,232,0.06)', borderRadius: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: T.tealLight, animation: 'glow-soft 2s ease-in-out infinite' }} />
                <span style={{ fontSize: 12, color: T.tealLight, fontWeight: 600, fontFamily: T.mono, letterSpacing: '0.04em' }}>Still wondering?</span>
              </div>
              <p style={{ fontSize: 13, color: T.inkDim, lineHeight: 1.5, marginBottom: 12 }}>
                Email us.
              </p>
              <a href="mailto:aekilicc@gmail.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: T.tealLight, fontWeight: 600, textDecoration: 'none' }}>
                aekilicc@gmail.com
                <Icon.arrow size={12} color={T.tealLight} />
              </a>
            </div>
          </div>

          {/* Right: accordion */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ITEMS[activeCat].map(([q, a], i) => {
              const open = openIdx === i;
              return (
                <div
                  key={`${activeCat}-${i}`}
                  style={{
                    borderRadius: 14,
                    background: open ? 'rgba(2,136,143,0.05)' : 'rgba(244,240,232,0.02)',
                    border: `1px solid ${open ? 'rgba(2,136,143,0.2)' : 'rgba(244,240,232,0.06)'}`,
                    overflow: 'hidden',
                    transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                    animation: `fade-up 0.5s ${0.06*i}s cubic-bezier(0.16,1,0.3,1) both`,
                  }}
                >
                  <button
                    onClick={() => setOpenIdx(open ? -1 : i)}
                    style={{ width: '100%', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                  >
                    <span style={{ fontFamily: T.serif, fontSize: 20, lineHeight: 1.25, letterSpacing: '-0.01em', color: T.ink }}>{q}</span>
                    <span style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: open ? T.tealMid : 'rgba(244,240,232,0.06)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      transition: 'all 0.3s',
                      transform: open ? 'rotate(45deg)' : 'rotate(0)',
                    }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M7 2 V12 M2 7 H12" stroke={open ? T.cream : T.ink} strokeWidth="1.6" strokeLinecap="round"/>
                      </svg>
                    </span>
                  </button>
                  <div style={{ maxHeight: open ? 240 : 0, opacity: open ? 1 : 0, overflow: 'hidden', transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
                    <div style={{ padding: '0 64px 24px 24px', fontSize: 14, color: T.inkDim, lineHeight: 1.65 }}>{a}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
