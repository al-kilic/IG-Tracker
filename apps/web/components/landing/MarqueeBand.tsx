import React from 'react';
import { T } from './tokens';

export function MarqueeBand() {
  return (
    <section style={{
      marginTop: 100, padding: '32px 0',
      borderTop: `1px solid rgba(244,240,232,0.05)`,
      borderBottom: `1px solid rgba(244,240,232,0.05)`,
      background: 'rgba(244,240,232,0.015)', overflow: 'hidden',
    }}>
      <div style={{
        overflow: 'hidden',
        maskImage: 'linear-gradient(90deg, transparent, black 10%, black 90%, transparent)',
        WebkitMaskImage: 'linear-gradient(90deg, transparent, black 10%, black 90%, transparent)',
      }}>
        <div style={{
          display: 'flex', gap: 56, width: 'max-content',
          animation: 'scroll-x 32s linear infinite',
          fontFamily: T.serif, fontSize: 56, lineHeight: 1, letterSpacing: '-0.02em',
          color: T.inkDim,
        }}>
          {[0, 1].map((dup) => (
            <span key={dup} style={{ display: 'flex', alignItems: 'center', gap: 56, flexShrink: 0 }}>
              <span>See who{"doesn't"} follow back</span>
              <span style={{ color: T.tealMid }}>✶</span>
              <span style={{ fontStyle: 'italic', color: T.tealLight }}>no login needed</span>
              <span style={{ color: T.tealMid }}>✶</span>
              <span>runs in your browser</span>
              <span style={{ color: T.tealMid }}>✶</span>
              <span style={{ fontStyle: 'italic', color: T.tealLight }}>open-source</span>
              <span style={{ color: T.tealMid }}>✶</span>
              <span>your data stays yours</span>
              <span style={{ color: T.tealMid }}>✶</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
