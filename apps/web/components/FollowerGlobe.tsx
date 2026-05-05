'use client';

import { useEffect, useRef } from 'react';

// ─── Math ─────────────────────────────────────────────────────────────────────

function rotY(x: number, y: number, z: number, a: number): [number, number, number] {
  return [Math.cos(a) * x + Math.sin(a) * z, y, -Math.sin(a) * x + Math.cos(a) * z];
}
function rotX(x: number, y: number, z: number, a: number): [number, number, number] {
  return [x, Math.cos(a) * y - Math.sin(a) * z, Math.sin(a) * y + Math.cos(a) * z];
}
function project(
  x: number,
  y: number,
  z: number,
  fov: number,
  cx: number,
  cy: number,
): [number, number, number] {
  const s = fov / (fov + z);
  return [cx + x * s, cy + y * s, s];
}

// ─── Ring config ──────────────────────────────────────────────────────────────

interface OrbitalRing {
  radius: number;
  // Plane tilt: the ring's local Y axis direction in 3D
  tiltX: number;
  tiltZ: number;
  speed: number; // rad / frame
  count: number;
  kind: 'mutual' | 'nonfollower';
  phaseShift: number;
}

const RING_DEFS: OrbitalRing[] = [
  { radius: 82, tiltX: 0.38, tiltZ: 0.12, speed: 0.01, count: 9, kind: 'mutual', phaseShift: 0 },
  {
    radius: 138,
    tiltX: -0.28,
    tiltZ: -0.18,
    speed: -0.006,
    count: 13,
    kind: 'mutual',
    phaseShift: 0.4,
  },
  {
    radius: 190,
    tiltX: 0.15,
    tiltZ: 0.25,
    speed: 0.004,
    count: 8,
    kind: 'nonfollower',
    phaseShift: 0.8,
  },
];

// Precompute node angles
interface NodeState {
  angle: number;
  ring: OrbitalRing;
  size: number;
}
function makeNodes(rings: OrbitalRing[]): NodeState[] {
  const nodes: NodeState[] = [];
  for (const ring of rings) {
    for (let i = 0; i < ring.count; i++) {
      nodes.push({
        angle: (i / ring.count) * Math.PI * 2 + ring.phaseShift,
        ring,
        size: ring.kind === 'nonfollower' ? 3.8 + Math.random() * 1.8 : 2.8 + Math.random() * 2,
      });
    }
  }
  return nodes;
}

// Get 3D position of a node on its ring
function nodePos(node: NodeState): [number, number, number] {
  const { ring, angle } = node;
  const R = ring.radius;
  // Start in ring plane: (R*cos, 0, R*sin)
  const lx = R * Math.cos(angle);
  const lz = R * Math.sin(angle);
  // Tilt ring around X
  const [tx, ty, tz] = rotX(lx, 0, lz, ring.tiltX);
  // Tilt ring around Z
  const cz = Math.cos(ring.tiltZ),
    sz = Math.sin(ring.tiltZ);
  return [cz * tx - sz * ty, sz * tx + cz * ty, tz];
}

// ─── Component ────────────────────────────────────────────────────────────────

export function FollowerGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx2d = canvas.getContext('2d');
    if (!ctx2d) return;
    const ctx: CanvasRenderingContext2D = ctx2d;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = container.offsetWidth;
    let H = container.offsetHeight;

    function resize() {
      W = container!.offsetWidth;
      H = container!.offsetHeight;
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      canvas!.style.width = W + 'px';
      canvas!.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    const FOV = 520;

    // State
    let viewRX = 0.18; // current view tilt X
    let viewRY = 0.05; // current view tilt Y
    let targetRX = 0.18; // mouse-driven target
    let targetRY = 0.05;
    let autoAngle = 0; // slow auto Y rotation

    const nodes = makeNodes(RING_DEFS);
    let pulse = 0; // for glow pulse

    // ─── Draw ────────────────────────────────────────────────────────────────

    function applyView(x: number, y: number, z: number): [number, number, number] {
      const [ax, ay, az] = rotY(x, y, z, viewRY + autoAngle);
      return rotX(ax, ay, az, viewRX);
    }

    function drawRingPath(ring: OrbitalRing) {
      const STEPS = 120;
      ctx.beginPath();
      for (let i = 0; i <= STEPS; i++) {
        const a = (i / STEPS) * Math.PI * 2;
        const fake: NodeState = { angle: a, ring, size: 0 };
        const [wx, wy, wz] = applyView(...nodePos(fake));
        const [sx, sy, sc] = project(wx, wy, wz, FOV, W / 2, H / 2);
        const depth01 = (sc - 0.2) / 0.8;
        if (depth01 < 0) continue;
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.strokeStyle =
        ring.kind === 'nonfollower' ? 'rgba(168,75,47,0.08)' : 'rgba(1,105,111,0.1)';
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }

    function draw() {
      const CX = W / 2,
        CY = H / 2;
      ctx.clearRect(0, 0, W, H);

      // Deep background glow
      const bg = ctx.createRadialGradient(CX, CY, 0, CX, CY, Math.min(W, H) * 0.55);
      bg.addColorStop(0, 'rgba(1,105,111,0.07)');
      bg.addColorStop(1, 'rgba(1,105,111,0)');
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.arc(CX, CY, Math.min(W, H) * 0.55, 0, Math.PI * 2);
      ctx.fill();

      // Draw ring paths
      for (const ring of RING_DEFS) drawRingPath(ring);

      // Transform & sort nodes
      type RN = { sx: number; sy: number; sc: number; depth: number; node: NodeState };
      const rns: RN[] = nodes.map((n) => {
        const [wx, wy, wz] = applyView(...nodePos(n));
        const [sx, sy, sc] = project(wx, wy, wz, FOV, CX, CY);
        return { sx, sy, sc, depth: wz, node: n };
      });
      rns.sort((a, b) => a.depth - b.depth);

      // Draw nodes
      for (const { sx, sy, sc, node } of rns) {
        const d = Math.max(0, Math.min(1, (sc - 0.25) / 0.75));
        if (d < 0.06) continue;
        const nr = node.size * sc;

        if (node.ring.kind === 'mutual') {
          // Soft outer glow
          if (d > 0.4) {
            const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, nr * 5);
            g.addColorStop(0, `rgba(1,105,111,${(d * 0.16).toFixed(2)})`);
            g.addColorStop(1, 'rgba(1,105,111,0)');
            ctx.beginPath();
            ctx.arc(sx, sy, nr * 5, 0, Math.PI * 2);
            ctx.fillStyle = g;
            ctx.fill();
          }
          // Ring border
          ctx.beginPath();
          ctx.arc(sx, sy, nr + 1.4, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(77,184,187,${(d * 0.55).toFixed(2)})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();
          // Core
          const cg = ctx.createRadialGradient(sx - nr * 0.3, sy - nr * 0.3, 0, sx, sy, nr);
          cg.addColorStop(0, `rgba(100,220,220,${(0.2 + d * 0.8).toFixed(2)})`);
          cg.addColorStop(1, `rgba(1,105,111,${(0.15 + d * 0.75).toFixed(2)})`);
          ctx.beginPath();
          ctx.arc(sx, sy, nr, 0, Math.PI * 2);
          ctx.fillStyle = cg;
          ctx.fill();
        } else {
          // Non-follower — terra / coral
          const pulseFactor = 1 + Math.sin(pulse + sx * 0.05) * 0.15;
          if (d > 0.35) {
            const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, nr * 4.5 * pulseFactor);
            g.addColorStop(0, `rgba(200,90,50,${(d * 0.2).toFixed(2)})`);
            g.addColorStop(1, 'rgba(168,75,47,0)');
            ctx.beginPath();
            ctx.arc(sx, sy, nr * 4.5 * pulseFactor, 0, Math.PI * 2);
            ctx.fillStyle = g;
            ctx.fill();
          }
          ctx.beginPath();
          ctx.arc(sx, sy, nr + 1.2, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(220,100,60,${(d * 0.4).toFixed(2)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
          const rg = ctx.createRadialGradient(sx - nr * 0.3, sy - nr * 0.3, 0, sx, sy, nr);
          rg.addColorStop(0, `rgba(220,100,60,${(0.3 + d * 0.6).toFixed(2)})`);
          rg.addColorStop(1, `rgba(168,75,47,${(0.15 + d * 0.65).toFixed(2)})`);
          ctx.beginPath();
          ctx.arc(sx, sy, nr, 0, Math.PI * 2);
          ctx.fillStyle = rg;
          ctx.fill();
        }
      }

      // YOU — center node
      const YR = 22;
      const pulseOuter = 1 + Math.sin(pulse * 0.7) * 0.08;
      // Layered glows
      for (const [r, a] of [
        [YR * 4.5 * pulseOuter, 0.12],
        [YR * 2.8, 0.22],
        [YR * 1.7, 0.16],
      ] as [number, number][]) {
        const g = ctx.createRadialGradient(CX, CY, 0, CX, CY, r);
        g.addColorStop(0, `rgba(1,105,111,${a})`);
        g.addColorStop(1, 'rgba(1,105,111,0)');
        ctx.beginPath();
        ctx.arc(CX, CY, r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }
      // Dashed orbit ring
      ctx.beginPath();
      ctx.arc(CX, CY, YR + 7, 0, Math.PI * 2);
      ctx.setLineDash([4, 5]);
      ctx.strokeStyle = 'rgba(77,184,187,0.22)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);
      // Disc
      const dc = ctx.createRadialGradient(CX - 8, CY - 8, 0, CX, CY, YR);
      dc.addColorStop(0, '#6dd5d8');
      dc.addColorStop(0.6, '#01a8af');
      dc.addColorStop(1, '#014d52');
      ctx.beginPath();
      ctx.arc(CX, CY, YR, 0, Math.PI * 2);
      ctx.fillStyle = dc;
      ctx.fill();
      // Person silhouette icon — head + shoulders
      ctx.fillStyle = 'rgba(244,240,232,0.92)';
      // Head
      ctx.beginPath();
      ctx.arc(CX, CY - 5.5, 6, 0, Math.PI * 2);
      ctx.fill();
      // Shoulders / body arc
      ctx.beginPath();
      ctx.arc(CX, CY + 9, 11.5, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
    }

    // ─── Loop ────────────────────────────────────────────────────────────────

    let raf = 0;
    function tick() {
      // Smooth tilt toward mouse target
      viewRX += (targetRX - viewRX) * 0.045;
      viewRY += (targetRY - viewRY) * 0.045;
      autoAngle += 0.0022;
      pulse += 0.04;

      // Advance node angles
      for (const n of nodes) n.angle += n.ring.speed;

      draw();
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    // ─── Mouse hover → parallax tilt ─────────────────────────────────────────

    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      const mx = (e.clientX - rect.left) / W - 0.5; // -0.5 to 0.5
      const my = (e.clientY - rect.top) / H - 0.5;
      targetRY = mx * 0.65; // max ±0.32 rad horizontal tilt
      targetRX = my * 0.45 + 0.18; // max ±0.22 rad vertical tilt + base
    }

    function onMouseLeave() {
      // Drift back to default
      targetRX = 0.18;
      targetRY = 0.05;
    }

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);

    const ro = new ResizeObserver(() => resize());
    ro.observe(container);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full select-none" style={{ height: 430 }}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
