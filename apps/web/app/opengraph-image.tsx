import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'IG Tracker — See who unfollowed you. Privately.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        background: '#0b2426',
        padding: '80px 96px',
        fontFamily: 'sans-serif',
        position: 'relative',
      }}
    >
      {/* Background dot grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(1,105,111,0.2) 1.5px, transparent 1.5px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Background glow orbs */}
      <div
        style={{
          position: 'absolute',
          top: -120,
          left: -120,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: '#01696f',
          opacity: 0.08,
          filter: 'blur(80px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -80,
          right: -80,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: '#a84b2f',
          opacity: 0.06,
          filter: 'blur(80px)',
        }}
      />

      {/* Decorative network nodes (right side) */}
      <div style={{ position: 'absolute', right: 80, top: '50%', display: 'flex' }}>
        {[
          { x: 0, y: -120, r: 18, color: '#01696f', opacity: 0.9 },
          { x: 90, y: -50, r: 12, color: '#01696f', opacity: 0.7 },
          { x: 80, y: 60, r: 14, color: '#01696f', opacity: 0.8 },
          { x: -10, y: 110, r: 10, color: '#01696f', opacity: 0.6 },
          { x: -90, y: 50, r: 8, color: '#a84b2f', opacity: 0.7 },
          { x: -80, y: -70, r: 9, color: '#a84b2f', opacity: 0.6 },
          { x: 140, y: -10, r: 7, color: '#f4f0e8', opacity: 0.15 },
          { x: -140, y: 10, r: 6, color: '#f4f0e8', opacity: 0.12 },
        ].map((n, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 150 + n.x - n.r,
              top: -n.r + n.y,
              width: n.r * 2,
              height: n.r * 2,
              borderRadius: '50%',
              background: n.color,
              opacity: n.opacity,
            }}
          />
        ))}
        {/* Center node */}
        <div
          style={{
            position: 'absolute',
            left: 126,
            top: -24,
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: '#01696f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ color: '#f4f0e8', fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>
            YOU
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, maxWidth: 720, zIndex: 1 }}>
        {/* Label */}
        <div
          style={{
            color: '#01696f',
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: 24,
          }}
        >
          Privacy-first · No password · Open source
        </div>

        {/* Main headline */}
        <div
          style={{
            color: '#f4f0e8',
            fontSize: 72,
            fontWeight: 800,
            lineHeight: 1.0,
            letterSpacing: '-0.02em',
            marginBottom: 8,
          }}
        >
          See who unfollowed you.
        </div>
        <div
          style={{
            color: '#01696f',
            fontSize: 56,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            marginBottom: 32,
          }}
        >
          Privately.
        </div>

        {/* Subtext */}
        <div
          style={{
            color: 'rgba(244, 240, 232, 0.55)',
            fontSize: 22,
            lineHeight: 1.5,
            marginBottom: 48,
          }}
        >
          Upload your Instagram data export. We parse it in your browser. Nothing touches a server.
        </div>

        {/* URL badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'rgba(1,105,111,0.15)',
            border: '1px solid rgba(1,105,111,0.3)',
            borderRadius: 999,
            padding: '10px 20px',
            width: 'fit-content',
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#01696f' }} />
          <div style={{ color: '#01696f', fontSize: 16, fontWeight: 600 }}>igtracker.app</div>
        </div>
      </div>
    </div>,
    { ...size },
  );
}
