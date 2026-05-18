import type { FlowNode } from '@/data/automationProjects';

const NODE_W = 176;
const NODE_H = 60;
const COL_GAP = 72;
const ROW_GAP = 28;

type EdgePair = [string, string];

type LayoutResult = {
  pos: Record<string, { x: number; y: number }>;
  width: number;
  height: number;
  byId: Record<string, FlowNode>;
};

function computeLayout(flow: FlowNode[], edges: EdgePair[]): LayoutResult {
  const byId = Object.fromEntries(flow.map((n) => [n.id, n]));
  const incoming: Record<string, string[]> = {};
  const outgoing: Record<string, string[]> = {};
  flow.forEach((n) => { incoming[n.id] = []; outgoing[n.id] = []; });
  edges.forEach(([a, b]) => { outgoing[a].push(b); incoming[b].push(a); });

  const depth: Record<string, number> = {};
  const compute = (id: string): number => {
    if (depth[id] !== undefined) return depth[id];
    if (incoming[id].length === 0) return (depth[id] = 0);
    depth[id] = 1 + Math.max(...incoming[id].map(compute));
    return depth[id];
  };
  flow.forEach((n) => compute(n.id));

  const cols: Record<number, FlowNode[]> = {};
  flow.forEach((n) => {
    const d = depth[n.id];
    (cols[d] = cols[d] || []).push(n);
  });

  const colKeys = Object.keys(cols).map(Number).sort((a, b) => a - b);
  const maxRows = Math.max(...colKeys.map((k) => cols[k].length));

  const pos: Record<string, { x: number; y: number }> = {};
  colKeys.forEach((d, ci) => {
    const colNodes = cols[d];
    const rowOffset = (maxRows - colNodes.length) / 2;
    colNodes.forEach((n, ri) => {
      pos[n.id] = {
        x: ci * (NODE_W + COL_GAP) + 20,
        y: (ri + rowOffset) * (NODE_H + ROW_GAP) + 24,
      };
    });
  });

  const width = colKeys.length * (NODE_W + COL_GAP) - COL_GAP + 40;
  const height = maxRows * (NODE_H + ROW_GAP) - ROW_GAP + 48;
  return { pos, width, height, byId };
}

const NODE_STYLE: Record<string, { color: string; glyph: string }> = {
  trigger: { color: '#a8ffd4', glyph: '▶' },
  step:    { color: '#4fc3f7', glyph: '✦' },
  branch:  { color: '#ffb55a', glyph: '◆' },
  wait:    { color: '#94a3b8', glyph: '◐' },
  action:  { color: '#00e5ff', glyph: '→' },
};

type Props = {
  flow: FlowNode[];
  edges: [string, string][];
};

export const WorkflowDiagram = ({ flow, edges }: Props) => {
  const { pos, width, height } = computeLayout(flow, edges);
  const viewBox = `0 0 ${width} ${height}`;

  return (
    <div className="workflow-diagram-wrap">
      <svg
        viewBox={viewBox}
        style={{ width: '100%', height: 'auto', display: 'block', position: 'relative', zIndex: 1 }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L6,4 L0,8 z" fill="rgba(0, 229, 255, 0.6)" />
          </marker>
          <linearGradient id="edgeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"  stopColor="rgba(0, 229, 255, 0.15)" />
            <stop offset="100%" stopColor="rgba(0, 229, 255, 0.7)" />
          </linearGradient>
        </defs>

        {edges.map(([from, to], i) => {
          const a = pos[from];
          const b = pos[to];
          if (!a || !b) return null;
          const x1 = a.x + NODE_W;
          const y1 = a.y + NODE_H / 2;
          const x2 = b.x;
          const y2 = b.y + NODE_H / 2;
          const mx = (x1 + x2) / 2;
          const path = `M ${x1},${y1} C ${mx},${y1} ${mx},${y2} ${x2},${y2}`;
          return (
            <g key={i}>
              <path d={path} fill="none" stroke="url(#edgeGrad)" strokeWidth="1.5"
                    markerEnd="url(#arrowhead)" />
              <circle r="2.5" fill="#a8ffd4">
                <animateMotion dur={`${2 + (i % 4) * 0.4}s`} repeatCount="indefinite" path={path} />
              </circle>
            </g>
          );
        })}

        {flow.map((n) => {
          const p = pos[n.id];
          const s = NODE_STYLE[n.type] || NODE_STYLE.step;
          return (
            <g key={n.id} transform={`translate(${p.x},${p.y})`}>
              <rect width={NODE_W} height={NODE_H} rx="7"
                    fill="#0d1320" stroke={s.color} strokeOpacity="0.5" strokeWidth="1" />
              <rect x="0" y="0" width="3" height={NODE_H} fill={s.color} opacity="0.9" rx="1" />
              <text x="12" y="20" fill={s.color} fontSize="10"
                    fontFamily='"JetBrains Mono", monospace' opacity="0.85">
                {s.glyph}{' '}
                <tspan fill="#5b6478" fontSize="9">{n.type.toUpperCase()}</tspan>
              </text>
              <text x="12" y="38" fill="#e6f1ff" fontSize="12"
                    fontFamily='"JetBrains Mono", monospace' fontWeight="600">
                {n.label}
              </text>
              <text x="12" y="52" fill="#94a3b8" fontSize="10"
                    fontFamily='"JetBrains Mono", monospace'>
                {n.sublabel}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="flex items-center justify-between mt-4 text-xs font-mono tracking-widest uppercase text-muted-foreground/50">
        <span>// architecture · {flow.length} nodes · {edges.length} edges</span>
        <span className="text-secondary/80">● running</span>
      </div>
    </div>
  );
};
