'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Clock } from 'lucide-react';
import { T } from '@/components/landing/tokens';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LandingFooter } from '@/components/landing/FinalCTA';

const POSTS = [
  {
    slug: 'how-to-see-who-unfollowed-you-on-instagram',
    title: 'How to See Who Unfollowed You on Instagram (Without Getting Banned)',
    excerpt: 'Every popular "who unfollowed me" tool works the same way: they ask for your Instagram password, then use it to call Instagram\'s API. That\'s a TOS violation. Here\'s the safe alternative.',
    date: 'May 15, 2026',
    readTime: '4 min',
    tag: 'Guide',
    gradient: 'linear-gradient(135deg, #014d52 0%, #01696f 50%, #02888f 100%)',
    accent: '#5fc4c8',
    icon: '🔒',
  },
  {
    slug: 'instagram-follow-ratio-what-it-means-how-to-improve-it',
    title: 'Your Instagram Follow Ratio: What It Means and How to Actually Improve It',
    excerpt: 'Your follow ratio is a single number that signals a lot about your account\'s health, to the algorithm and to anyone who visits your profile. Most creators don\'t know what theirs is.',
    date: 'May 15, 2026',
    readTime: '4 min',
    tag: 'Growth',
    gradient: 'linear-gradient(135deg, #2d1f0a 0%, #6b4c14 50%, #a0956b 100%)',
    accent: '#c8a96e',
    icon: '📈',
  },
  {
    slug: 'why-instagram-follower-trackers-ask-for-your-password',
    title: 'Why Instagram Follower Trackers Ask for Your Password (It\'s Not an Accident)',
    excerpt: 'The follower tracking apps that ask for your Instagram password aren\'t doing it because it\'s the easiest technical solution. It\'s because your credentials have value to them.',
    date: 'May 15, 2026',
    readTime: '5 min',
    tag: 'Privacy',
    gradient: 'linear-gradient(135deg, #2d0c08 0%, #6b1a10 50%, #a84b2f 100%)',
    accent: '#d4735a',
    icon: '⚠️',
  },
];

const TAG_COLORS: Record<string, { color: string; bg: string }> = {
  Guide:   { color: '#5fc4c8', bg: 'rgba(2,136,143,0.15)' },
  Growth:  { color: '#c8a96e', bg: 'rgba(160,149,107,0.15)' },
  Privacy: { color: '#d4735a', bg: 'rgba(168,75,47,0.15)' },
};

function BlogCard({ post, index }: { post: typeof POSTS[0]; index: number }) {
  const [hovered, setHovered] = React.useState(false);
  const tag = TAG_COLORS[post.tag] ?? TAG_COLORS['Guide']!;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            borderRadius: 20,
            overflow: 'hidden',
            border: `1px solid ${hovered ? 'rgba(2,136,143,0.45)' : T.border1}`,
            background: T.bgCard,
            boxShadow: hovered ? `0 20px 60px rgba(0,0,0,0.2), 0 0 0 1px rgba(2,136,143,0.1)` : '0 2px 12px rgba(0,0,0,0.06)',
            transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
            transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
          }}
        >
          {/* Visual header */}
          <div style={{ position: 'relative', height: 160, background: post.gradient, overflow: 'hidden' }}>
            {/* Noise texture overlay */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.06) 0%, transparent 50%)' }} />
            {/* Big icon */}
            <div style={{ position: 'absolute', right: 20, bottom: 16, fontSize: 52, opacity: 0.25, lineHeight: 1 }}>{post.icon}</div>
            {/* Tag badge */}
            <div style={{ position: 'absolute', top: 14, left: 14 }}>
              <span style={{ fontSize: 10, fontFamily: T.mono, padding: '4px 10px', borderRadius: 20, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: tag.color, background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)', border: `1px solid ${tag.color}40` }}>
                {post.tag}
              </span>
            </div>
            {/* Hover read overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(3px)',
              opacity: hovered ? 1 : 0,
              transition: 'opacity 0.25s ease',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#01696f', color: '#f4f0e8', padding: '10px 20px', borderRadius: 100, fontSize: 13, fontWeight: 600, fontFamily: T.sans, boxShadow: '0 4px 20px rgba(1,105,111,0.5)' }}>
                <BookOpen size={15} />
                Read Article
              </div>
            </div>
          </div>

          {/* Content */}
          <div style={{ padding: '20px 22px 22px' }}>
            <h2 style={{ fontFamily: T.serif, fontSize: 18, fontWeight: 400, color: T.ink, lineHeight: 1.3, letterSpacing: '-0.01em', marginBottom: 10, transition: 'color 0.2s' }}>
              {post.title}
            </h2>
            <p style={{ fontSize: 13, color: T.inkDim, lineHeight: 1.65, marginBottom: 18, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {post.excerpt}
            </p>

            {/* Footer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${T.border1}`, paddingTop: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: `linear-gradient(135deg, #014d52, #01696f)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#f4f0e8', fontFamily: T.serif, flexShrink: 0 }}>A</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: T.ink, lineHeight: 1.2 }}>Alan Kilic</div>
                  <div style={{ fontSize: 11, color: T.inkMute }}>{post.date}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: T.inkMute }}>
                <Clock size={11} />
                {post.readTime} read
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

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

      <main className="px-4 sm:px-8" style={{ maxWidth: 900, margin: '0 auto', paddingTop: 56, paddingBottom: 80 }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 10, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 12 }}>Blog</div>
          <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 400, letterSpacing: '-0.03em', color: T.ink, marginBottom: 10 }}>
            Guides on Instagram, privacy, and follower tracking.
          </h1>
          <p style={{ fontSize: 15, color: T.inkDim, lineHeight: 1.6 }}>
            Honest takes. No growth hacks. Nothing that gets your account banned.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 20 }}>
          {POSTS.map((post, i) => <BlogCard key={post.slug} post={post} index={i} />)}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ marginTop: 48, paddingTop: 28, borderTop: `1px solid ${T.border1}` }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: T.inkDim, textDecoration: 'none' }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M11 7 H3 M3 7 L6 4 M3 7 L6 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Back to WhoUnfollowed
          </Link>
        </motion.div>
      </main>

      <LandingFooter />
    </div>
  );
}
