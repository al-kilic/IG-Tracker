import { NextResponse } from 'next/server';

// Simple in-memory rate limit: max 5 requests per IP per 10 minutes
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const WINDOW_MS  = 10 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now   = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  let body: { email?: unknown; csvFilename?: unknown };
  try { body = await req.json() as typeof body; } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const email       = typeof body.email       === 'string' ? body.email.trim()       : null;
  const csvFilename = typeof body.csvFilename === 'string' ? body.csvFilename.trim() : 'export.csv';

  // csvContent is intentionally NOT accepted — follower data must never reach the server
  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'WhoUnfollowed <hello@whounfollowed.app>',
          to:   [email],
          subject: `You exported: ${csvFilename}`,
          html: `
            <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
              <h2 style="font-size: 22px; font-weight: 400; margin-bottom: 8px;">Thanks for using WhoUnfollowed.</h2>
              <p style="color: #666; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
                Your CSV was downloaded directly to your device. We don't store your follower data on our servers.
              </p>
              <p style="color: #999; font-size: 12px;">
                You're receiving this because you entered your email on WhoUnfollowed.
                <a href="https://whounfollowed.app" style="color: #01696F;">whounfollowed.app</a>
              </p>
            </div>
          `,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error('[capture-email] Resend error:', err);
      }
    } catch (err) {
      console.error('[capture-email] Resend exception:', err);
    }
  }

  return NextResponse.json({ ok: true });
}
