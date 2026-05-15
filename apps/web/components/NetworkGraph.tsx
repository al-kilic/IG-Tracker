// Pure SVG network graph — server component, no JS needed.
// Visualizes a follower graph: center (you), mutual nodes (inner ring),
// non-follower nodes (outer ring), fan nodes (isolated).

const CX = 200;
const CY = 200;

const mutuals = [
  { x: 288, y: 200, d: '0.25s' },
  { x: 244, y: 276, d: '0.4s' },
  { x: 156, y: 276, d: '0.55s' },
  { x: 112, y: 200, d: '0.7s' },
  { x: 156, y: 124, d: '0.85s' },
  { x: 244, y: 124, d: '1.0s' },
];

const nonFollowers = [
  { x: 337, y: 257, d: '1.15s' },
  { x: 143, y: 337, d: '1.3s' },
  { x: 63, y: 143, d: '1.45s' },
  { x: 257, y: 63, d: '1.6s' },
];

const fans = [
  { x: 355, y: 88 },
  { x: 44, y: 88 },
  { x: 200, y: 372 },
  { x: 355, y: 316 },
];

export function NetworkGraph() {
  return (
    <div className="relative w-72 h-72 sm:w-80 sm:h-80 select-none">
      {/* Soft glow behind the graph */}
      <div className="absolute inset-0 rounded-full bg-[#01696f] opacity-5 blur-3xl scale-110" />

      {/* Outer pulse rings on center */}
      <div
        className="absolute rounded-full border border-[#01696f]/30 animate-pulse-ring"
        style={{ inset: '38%', animationDuration: '2.6s' }}
      />
      <div
        className="absolute rounded-full border border-[#01696f]/20 animate-pulse-ring"
        style={{ inset: '38%', animationDelay: '1s', animationDuration: '2.6s' }}
      />

      <svg
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        aria-hidden="true"
      >
        {/* Dashed guide rings */}
        <circle
          cx={CX}
          cy={CY}
          r="88"
          stroke="#01696f"
          strokeWidth="0.6"
          strokeOpacity="0.2"
          strokeDasharray="4 8"
        />
        <circle
          cx={CX}
          cy={CY}
          r="148"
          stroke="#01696f"
          strokeWidth="0.6"
          strokeOpacity="0.12"
          strokeDasharray="4 8"
        />

        {/* Mutual edges - solid teal */}
        {mutuals.map((n, i) => (
          <line
            key={`me${i}`}
            x1={CX}
            y1={CY}
            x2={n.x}
            y2={n.y}
            stroke="#01696f"
            strokeWidth="1.2"
            strokeOpacity="0.55"
            strokeDasharray="260"
            style={{
              animation: `ig-draw-edge 0.7s cubic-bezier(0.16,1,0.3,1) ${n.d} both`,
            }}
          />
        ))}

        {/* Non-follower edges - dashed terra */}
        {nonFollowers.map((n, i) => (
          <line
            key={`nfe${i}`}
            x1={CX}
            y1={CY}
            x2={n.x}
            y2={n.y}
            stroke="#a84b2f"
            strokeWidth="1"
            strokeOpacity="0.4"
            strokeDasharray="6 5"
            style={{
              animation: `ig-draw-edge 0.7s cubic-bezier(0.16,1,0.3,1) ${n.d} both`,
            }}
          />
        ))}

        {/* Mutual nodes - teal */}
        {mutuals.map((n, i) => (
          <g key={`mn${i}`} style={{ animation: `ig-fade-in 0.5s ease ${n.d} both` }}>
            <circle cx={n.x} cy={n.y} r="14" fill="#01696f" fillOpacity="0.12" />
            <circle cx={n.x} cy={n.y} r="9" fill="#01696f" fillOpacity="0.9" />
            <circle cx={n.x} cy={n.y} r="4" fill="#f4f0e8" fillOpacity="0.6" />
          </g>
        ))}

        {/* Non-follower nodes - terra with pulse */}
        {nonFollowers.map((n, i) => (
          <g key={`nfn${i}`} style={{ animation: `ig-fade-in 0.5s ease ${n.d} both` }}>
            <circle
              cx={n.x}
              cy={n.y}
              r="14"
              fill="#a84b2f"
              fillOpacity="0.1"
              style={{
                animation: `ig-pulse-ring 2.8s ease-out ${String(i * 0.5)}s infinite`,
              }}
            />
            <circle cx={n.x} cy={n.y} r="8" fill="#a84b2f" fillOpacity="0.75" />
          </g>
        ))}

        {/* Fan nodes - light, no edges */}
        {fans.map((n, i) => (
          <circle
            key={`fn${i}`}
            cx={n.x}
            cy={n.y}
            r="5"
            fill="#f4f0e8"
            fillOpacity="0.18"
            style={{ animation: `ig-fade-in 0.5s ease 2s both` }}
          />
        ))}

        {/* Center "YOU" node */}
        <circle cx={CX} cy={CY} r="32" fill="#01696f" fillOpacity="0.12" />
        <circle cx={CX} cy={CY} r="24" fill="#01696f" />
        <circle cx={CX} cy={CY} r="12" fill="#f4f0e8" fillOpacity="0.15" />
        <text
          x={CX}
          y={CY + 3}
          textAnchor="middle"
          fill="#f4f0e8"
          fontSize="7.5"
          fontWeight="700"
          letterSpacing="1"
          fontFamily="Satoshi, sans-serif"
        >
          YOU
        </text>
      </svg>

      {/* Legend */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-4 text-[10px] text-[#f4f0e8]/40 whitespace-nowrap">
        <span className="flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-full bg-[#01696f]" />
          mutual
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-full bg-[#a84b2f]" />
          not following back
        </span>
      </div>
    </div>
  );
}
