'use client';

import React from 'react';
import Link from 'next/link';
import { T } from '@/components/landing/tokens';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LandingFooter } from '@/components/landing/FinalCTA';

export const POSTS = [
  {
    slug: 'how-to-see-who-unfollowed-you-on-instagram',
    title: 'How to See Who Unfollowed You on Instagram (Without Getting Banned)',
    excerpt: 'Every popular "who unfollowed me" tool works the same way: they ask for your Instagram password, then use it to call Instagram\'s API on your behalf. That\'s a TOS violation. Here\'s the safe alternative.',
    date: 'May 15, 2026',
    readTime: '4 min',
    tag: 'Guide',
  },
  {
    slug: 'instagram-follow-ratio-what-it-means-how-to-improve-it',
    title: 'Your Instagram Follow Ratio: What It Means and How to Actually Improve It',
    excerpt: 'Your follow ratio is a single number that signals a lot about your account\'s health, to the algorithm and to anyone who visits your profile. Most creators don\'t know what theirs is.',
    date: 'May 15, 2026',
    readTime: '4 min',
    tag: 'Growth',
  },
  {
    slug: 'why-instagram-follower-trackers-ask-for-your-password',
    title: 'Why Instagram Follower Trackers Ask for Your Password (It\'s Not an Accident)',
    excerpt: 'The follower tracking apps that ask for your Instagram password aren\'t doing it because it\'s the easiest technical solution. It\'s because your credentials have value to them.',
    date: 'May 15, 2026',
    readTime: '5 min',
    tag: 'Privacy',
  },
];

const TAG_COLORS: Record<string, { color: string; bg: string }> = {
  Guide:   { color: T.tealMid,  bg: 'rgba(2,136,143,0.1)' },
  Growth:  { color: '#a0956b',  bg: 'rgba(160,149,107,0.1)' },
  Privacy: { color: T.terra,    bg: 'rgba(168,75,47,0.1)' },
};

export default function BlogPage() {
  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: T.sans }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: `1px solid ${T.border1}`, position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(14px)', background: T.navBg }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="/logo.png" alt="WhoUnfollowed" width={26} height={26} style={{ borderRadius: 7, objectFit: 'contain' }} />
          <span style={{ fontFamily: T.serif, fontSize: 17, color: T.ink }}>WhoUnfollowed</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/" style={{ fontSize: 13, color: T.inkDim, textDecoration: 'none' }}>Home</Link>
          <ThemeToggle />
        </div>
      </nav>

      <main className="px-4 sm:px-8" style={{ maxWidth: 760, margin: '0 auto', paddingTop: 56, paddingBottom: 80 }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 10, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 14 }}>Blog</div>
          <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 400, letterSpacing: '-0.03em', color: T.ink, marginBottom: 12 }}>
            Guides on Instagram, privacy, and follower tracking.
          </h1>
          <p style={{ fontSize: 15, color: T.inkDim, lineHeight: 1.6 }}>
            Honest takes. No growth hacks. Nothing that gets your account banned.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {POSTS.map((post, i) => {
            const tag = TAG_COLORS[post.tag] ?? TAG_COLORS['Guide']!;
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                style={{ textDecoration: 'none', display: 'block', padding: '24px', borderRadius: 16, background: T.surface1, border: `1px solid ${T.border1}`, transition: 'border-color 0.15s' }}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.style.borderColor = T.border3}
                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.style.borderColor = T.border1}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 10, fontFamily: T.mono, padding: '2px 8px', borderRadius: 20, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: tag.color, background: tag.bg }}>
                    {post.tag}
                  </span>
                  <span style={{ fontSize: 12, color: T.inkMute, fontFamily: T.mono }}>{post.date}</span>
                  <span style={{ fontSize: 12, color: T.inkMute, fontFamily: T.mono }}>{post.readTime} read</span>
                </div>
                <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(18px, 3vw, 22px)', fontWeight: 400, color: T.ink, lineHeight: 1.25, letterSpacing: '-0.01em', marginBottom: 10 }}>
                  {post.title}
                </h2>
                <p style={{ fontSize: 14, color: T.inkDim, lineHeight: 1.6, margin: 0 }}>{post.excerpt}</p>
                <div style={{ marginTop: 14, fontSize: 13, color: T.tealLight, fontWeight: 500 }}>Read more →</div>
              </Link>
            );
          })}
        </div>

        <div style={{ marginTop: 56, paddingTop: 28, borderTop: `1px solid ${T.border1}` }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: T.inkDim, textDecoration: 'none' }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M11 7 H3 M3 7 L6 4 M3 7 L6 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Back to WhoUnfollowed
          </Link>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}

import React from 'react';
