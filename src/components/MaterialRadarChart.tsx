import React from 'react';
import { MaterialRadarProfile } from '../data/hardware';

interface MaterialRadarChartProps {
  profile: MaterialRadarProfile;
  materialName: string;
}

const AXES: Array<{ key: keyof MaterialRadarProfile; label: string }> = [
  { key: 'mechanicalStrength', label: 'Resistencia' },
  { key: 'abrasionResistance', label: 'Anti-abrasión' },
  { key: 'thermalStability', label: 'Térmica' },
  { key: 'dustSealing', label: 'Sellado polvo' },
  { key: 'strengthToWeight', label: 'Fuerza / peso' },
];

export const MaterialRadarChart: React.FC<MaterialRadarChartProps> = ({
  profile,
  materialName,
}) => {
  const size = 280;
  const cx = size / 2;
  const cy = size / 2 + 4;
  const maxR = 82;
  const levels = [25, 50, 75, 100];

  const getCoords = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / AXES.length - Math.PI / 2;
    const r = (value / 100) * maxR;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  const dataPolygon = AXES.map((axis, idx) => {
    const { x, y } = getCoords(idx, profile[axis.key]);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h3 className="text-sm font-semibold text-slate-100">
          Perfil estructural del material
        </h3>
        <p className="text-xs text-slate-400 truncate" title={materialName}>
          {materialName}
        </p>
      </div>

      <div className="bg-[#090D14] border border-slate-800/90 rounded-md p-2 flex flex-col items-center">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full max-w-[260px] h-auto"
          role="img"
          aria-label={`Diagrama radial de propiedades para ${materialName}`}
        >
          {/* Concentric Polygon Grids */}
          {levels.map((lvl) => {
            const poly = AXES.map((_, idx) => {
              const { x, y } = getCoords(idx, lvl);
              return `${x.toFixed(1)},${y.toFixed(1)}`;
            }).join(' ');
            return (
              <polygon
                key={lvl}
                points={poly}
                fill="none"
                stroke="#1E293B"
                strokeWidth="1"
              />
            );
          })}

          {/* Radial Axis Lines + Vertex Labels */}
          {AXES.map((axis, idx) => {
            const outer = getCoords(idx, 100);
            const labelPos = getCoords(idx, 124);
            const val = profile[axis.key];
            return (
              <g key={axis.key}>
                <line
                  x1={cx}
                  y1={cy}
                  x2={outer.x}
                  y2={outer.y}
                  stroke="#1E293B"
                  strokeWidth="1"
                />
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-slate-400 text-[9.5px] font-mono"
                >
                  {axis.label}
                </text>
                <text
                  x={labelPos.x}
                  y={labelPos.y + 11}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-cyan-400 text-[9.5px] font-mono tabular-nums font-medium"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Data Area Polygon */}
          <polygon
            points={dataPolygon}
            fill="rgba(6, 182, 212, 0.18)"
            stroke="#06B6D4"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Data Vertices */}
          {AXES.map((axis, idx) => {
            const { x, y } = getCoords(idx, profile[axis.key]);
            return (
              <circle
                key={axis.key}
                cx={x}
                cy={y}
                r="3"
                fill="#07090E"
                stroke="#22D3EE"
                strokeWidth="1.5"
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
};
