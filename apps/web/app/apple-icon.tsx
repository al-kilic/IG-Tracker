import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: 180,
        height: 180,
        borderRadius: 40,
        background: '#0b2426',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 40,
          background: 'radial-gradient(circle at 40% 40%, rgba(1,105,111,0.2) 0%, transparent 70%)',
        }}
      />
      {/* Outer ring */}
      <div
        style={{
          position: 'absolute',
          width: 110,
          height: 110,
          borderRadius: '50%',
          border: '2px solid rgba(1,105,111,0.25)',
        }}
      />
      {/* Mid ring */}
      <div
        style={{
          position: 'absolute',
          width: 72,
          height: 72,
          borderRadius: '50%',
          border: '1.5px solid rgba(1,105,111,0.15)',
        }}
      />
      {/* Center node */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: '#01696f',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ color: '#f4f0e8', fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>IG</div>
      </div>
      {/* Satellite nodes */}
      <div
        style={{
          position: 'absolute',
          top: 28,
          right: 28,
          width: 16,
          height: 16,
          borderRadius: '50%',
          background: '#01696f',
          opacity: 0.85,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 32,
          left: 32,
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: '#a84b2f',
          opacity: 0.75,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 28,
          right: 44,
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: '#01696f',
          opacity: 0.6,
        }}
      />
    </div>,
    { ...size },
  );
}
