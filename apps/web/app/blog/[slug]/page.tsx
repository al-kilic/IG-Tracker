'use client';

import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { T } from '@/components/landing/tokens';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LandingFooter } from '@/components/landing/FinalCTA';
import { getPost, BLOG_POSTS } from '../posts';

const TAG_COLORS: Record<string, { color: string; bg: string }> = {
  Guide:   { color: T.tealMid,  bg: 'rgba(2,136,143,0.1)' },
  Growth:  { color: '#a0956b',  bg: 'rgba(160,149,107,0.1)' },
  Privacy: { color: T.terra,    bg: 'rgba(168,75,47,0.1)' },
};

function renderBody(body: string) {
  const paragraphs = body.split('\n\n');
  return paragraphs.map((para, i) => {
    if (para.startsWith('## ')) {
      return (
        <h2 key={i} style={{ fontFamily: T.serif, fontSize: 'clamp(20px, 3.5vw, 26px)', fontWeight: 400, color: T.ink, letterSpacing: '-0.02em', marginTop: 40, marginBottom: 12 }}>
          {para.replace('## ', '')}
        </h2>
      );
    }
    if (para.startsWith('- ')) {
      const items = para.split('\n').filter(l => l.startsWith('- '));
      return (
        <ul key={i} style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {items.map((item, j) => (
            <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 15, color: T.inkDim }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: T.tealMid, flexShrink: 0, marginTop: 8 }} />
              {item.replace('- ', '')}
            </li>
          ))}
        </ul>
      );
    }
    // Replace [text](url) links with styled anchors
    const withLinks = para.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) => {
      if (url === '/') return `<a href="/" style="color:${T.tealLight};text-decoration:none">${text}</a>`;
      return `<a href="${url}" style="color:${T.tealLight};text-decoration:none" ${url.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''}>${text}</a>`;
    });
    return (
      <p key={i} style={{ fontSize: 15, color: T.inkDim, lineHeight: 1.75, marginBottom: 20 }}
        dangerouslySetInnerHTML={{ __html: withLinks }}
      />
    );
  });
}

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const post = getPost(slug);
  if (!post) notFound();

  const tag = TAG_COLORS[post.tag] ?? TAG_COLORS['Guide']!;
  const otherPosts = BLOG_POSTS.filter(p => p.slug !== post.slug).slice(0, 2);

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: T.sans }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: `1px solid ${T.border1}`, position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(14px)', background: T.navBg }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="/logo.png" alt="WhoUnfollowed" width={26} height={26} style={{ borderRadius: 7, objectFit: 'contain' }} />
          <span style={{ fontFamily: T.serif, fontSize: 17, color: T.ink }}>WhoUnfollowed</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/blog" style={{ fontSize: 13, color: T.inkDim, textDecoration: 'none' }}>Blog</Link>
          <ThemeToggle />
        </div>
      </nav>

      <main className="px-4 sm:px-8" style={{ maxWidth: 680, margin: '0 auto', paddingTop: 56, paddingBottom: 80 }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <span style={{ fontSize: 10, fontFamily: T.mono, padding: '3px 10px', borderRadius: 20, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: tag.color, background: tag.bg }}>
              {post.tag}
            </span>
            <span style={{ fontSize: 12, color: T.inkMute, fontFamily: T.mono }}>{post.date}</span>
            <span style={{ fontSize: 12, color: T.inkMute, fontFamily: T.mono }}>{post.readTime} read</span>
          </div>
          <p style={{ fontSize: 11, fontFamily: T.mono, color: T.inkMute, letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 10px' }}>
            WhoUnfollowed Blog
          </p>
          <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(30px, 5vw, 52px)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.03em', color: T.ink, marginBottom: 18 }}>
            {post.title}
          </h1>
          <p style={{ fontSize: 16, color: T.inkDim, lineHeight: 1.65 }}>{post.excerpt}</p>
        </div>

        {/* Body */}
        <article style={{ borderTop: `1px solid ${T.border1}`, paddingTop: 32 }}>
          {renderBody(post.body)}
        </article>

        {/* CTA */}
        <div style={{ marginTop: 48, padding: '28px', borderRadius: 16, background: T.surface1, border: `1px solid ${T.border1}`, textAlign: 'center' }}>
          <p style={{ fontFamily: T.serif, fontSize: 17, fontStyle: 'italic', color: T.inkDim, marginBottom: 16 }}>
            See your own list. Takes 2 minutes.
          </p>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', borderRadius: 11, background: T.teal, color: T.cream, fontSize: 13, fontWeight: 600, textDecoration: 'none', fontFamily: T.sans, boxShadow: `0 6px 20px ${T.tealGlow}` }}>
            Upload your Instagram export
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M3 7H11M11 7L8 4M11 7L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>

        {/* More posts */}
        {otherPosts.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <div style={{ fontSize: 10, color: T.inkMute, fontFamily: T.mono, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16 }}>More from the blog</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {otherPosts.map(p => (
                <Link key={p.slug} href={`/blog/${p.slug}`} style={{ textDecoration: 'none', padding: '16px 18px', borderRadius: 12, background: T.surface1, border: `1px solid ${T.border1}`, display: 'block', transition: 'border-color 0.15s' }}
                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.style.borderColor = T.border3}
                  onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.style.borderColor = T.border1}>
                  <div style={{ fontFamily: T.serif, fontSize: 16, color: T.ink, marginBottom: 4 }}>{p.title}</div>
                  <div style={{ fontSize: 12, color: T.tealLight, fontWeight: 500 }}>Read →</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: 40, paddingTop: 24, borderTop: `1px solid ${T.border1}` }}>
          <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: T.inkDim, textDecoration: 'none' }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M11 7 H3 M3 7 L6 4 M3 7 L6 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            All posts
          </Link>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
