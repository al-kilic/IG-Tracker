import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  let body: { email?: unknown; csvFilename?: unknown; csvContent?: unknown };
  try { body = await req.json() as typeof body; } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const email       = typeof body.email       === 'string' ? body.email.trim()       : null;
  const csvFilename = typeof body.csvFilename === 'string' ? body.csvFilename.trim() : 'export.csv';
  const csvContent  = typeof body.csvContent  === 'string' ? body.csvContent         : '';

  if (!email || !email.includes('@') || csvContent.length > 5_000_000) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  // Send via Resend if API key is present
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
          subject: `Your export: ${csvFilename}`,
          html: `
            <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
              <h2 style="font-size: 22px; font-weight: 400; margin-bottom: 8px;">Your CSV is attached.</h2>
              <p style="color: #666; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
                Here's the export you requested from WhoUnfollowed. Upload a new export anytime to see what changed.
              </p>
              <p style="color: #999; font-size: 12px;">
                You're receiving this because you entered your email on WhoUnfollowed.
                <a href="https://whounfollowed.app" style="color: #01696F;">whounfollowed.app</a>
              </p>
            </div>
          `,
          attachments: [{
            filename: csvFilename,
            content:  Buffer.from(csvContent).toString('base64'),
          }],
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error('[capture-email] Resend error:', err);
        // Still return success — email was captured even if send failed
      }
    } catch (err) {
      console.error('[capture-email] Resend exception:', err);
    }
  } else {
    // No Resend key — log capture only (replace with DB write when ready)
    console.log(`[capture-email] ${new Date().toISOString()} | ${email} | ${csvFilename}`);
  }

  return NextResponse.json({ ok: true });
}
