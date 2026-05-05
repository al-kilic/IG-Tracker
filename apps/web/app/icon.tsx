import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        background: '#0b2426',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      {/* Outer ring */}
      <div
        style={{
          position: 'absolute',
          width: 20,
          height: 20,
          borderRadius: '50%',
          border: '1.5px solid rgba(1,105,111,0.4)',
        }}
      />
      {/* Center node */}
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: '#01696f',
        }}
      />
      {/* Satellite node */}
      <div
        style={{
          position: 'absolute',
          top: 4,
          right: 4,
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: '#a84b2f',
          opacity: 0.8,
        }}
      />
    </div>,
    { ...size },
  );
}
