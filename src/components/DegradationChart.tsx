import React, { useState } from 'react';

interface CurvePoint {
  day: number;
  theoretical: number;
  empirical: number;
}

interface DegradationChartProps {
  points: CurvePoint[];
  missionDays: number;
  status: 'nominal' | 'warning' | 'critical';
}

export const DegradationChart: React.FC<DegradationChartProps> = ({
  points,
  missionDays,
  status,
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const width = 640;
  const height = 220;
  const padLeft = 46;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 34;

  const plotWidth = width - padLeft - padRight;
  const plotHeight = height - padTop - padBottom;

  const minY = 20;
  const maxY = 100;

  const getX = (day: number) =>
    padLeft + (missionDays > 0 ? (day / missionDays) * plotWidth : 0);
  const getY = (val: number) =>
    padTop + ((maxY - Math.max(minY, Math.min(maxY, val))) / (maxY - minY)) * plotHeight;

  const theoreticalPath = points
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(p.day).toFixed(1)} ${getY(p.theoretical).toFixed(1)}`)
    .join(' ');

  const empiricalPath = points
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(p.day).toFixed(1)} ${getY(p.empirical).toFixed(1)}`)
    .join(' ');

  const empiricalAreaPath =
    empiricalPath +
    ` L ${getX(points[points.length - 1].day).toFixed(1)} ${(padTop + plotHeight).toFixed(1)}` +
    ` L ${getX(points[0].day).toFixed(1)} ${(padTop + plotHeight).toFixed(1)} Z`;

  const yTicks = [100, 80, 60, 40, 20];
  const activePoint = hoverIndex !== null ? points[hoverIndex] : points[points.length - 1];

  const empiricalStroke =
    status === 'critical' ? '#F43F5E' : status === 'warning' ? '#F59E0B' : '#38BDF8';

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">
            Curva de eficiencia y desgaste por radiación y polvo
          </h3>
          <p className="text-xs text-slate-400">
            Proyección a {missionDays} días lunares · Modelo nominal frente a estrés ambiental
          </p>
        </div>

        <div className="flex items-center gap-5 text-xs font-mono text-slate-300">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="inline-block w-4 h-0.5 bg-cyan-400" aria-hidden="true" />
            <span>Modelo teórico</span>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span
              className="inline-block w-4 h-0.5 border-t-2 border-dashed"
              style={{ borderColor: empiricalStroke }}
              aria-hidden="true"
            />
            <span>Desgaste simulado</span>
          </div>
        </div>
      </div>

      <div className="relative bg-[#090D14] border border-slate-800/90 rounded-md p-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto select-none cursor-crosshair"
          role="img"
          aria-label="Gráfico de degradación del equipo a lo largo de la misión"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="empiricalFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={empiricalStroke} stopOpacity="0.16" />
              <stop offset="100%" stopColor={empiricalStroke} stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid Lines */}
          {yTicks.map((tick) => {
            const y = getY(tick);
            return (
              <g key={tick}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke="#1E293B"
                  strokeWidth="1"
                />
                <text
                  x={padLeft - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  className="fill-slate-500 text-[10px] font-mono tabular-nums"
                >
                  {tick}%
                </text>
              </g>
            );
          })}

          {/* Vertical Axis Markers */}
          {points
            .filter((_, i) => i % 2 === 0)
            .map((p) => {
              const x = getX(p.day);
              return (
                <g key={p.day}>
                  <line
                    x1={x}
                    y1={padTop}
                    x2={x}
                    y2={padTop + plotHeight}
                    stroke="#1E293B"
                    strokeWidth="0.75"
                    strokeDasharray="2 3"
                  />
                  <text
                    x={x}
                    y={height - 10}
                    textAnchor="middle"
                    className="fill-slate-500 text-[10px] font-mono tabular-nums"
                  >
                    D{p.day}
                  </text>
                </g>
              );
            })}

          {/* Subtle gradient area under empirical line */}
          <path d={empiricalAreaPath} fill="url(#empiricalFill)" />

          {/* Theoretical Curve */}
          <path
            d={theoreticalPath}
            fill="none"
            stroke="#06B6D4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Empirical Curve */}
          <path
            d={empiricalPath}
            fill="none"
            stroke={empiricalStroke}
            strokeWidth="2"
            strokeDasharray="5 4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Active Crosshair */}
          {activePoint && (
            <g>
              <line
                x1={getX(activePoint.day)}
                y1={padTop}
                x2={getX(activePoint.day)}
                y2={padTop + plotHeight}
                stroke="#475569"
                strokeWidth="1"
              />
              <circle
                cx={getX(activePoint.day)}
                cy={getY(activePoint.theoretical)}
                r="3.5"
                fill="#07090E"
                stroke="#06B6D4"
                strokeWidth="2"
              />
              <circle
                cx={getX(activePoint.day)}
                cy={getY(activePoint.empirical)}
                r="3.5"
                fill="#07090E"
                stroke={empiricalStroke}
                strokeWidth="2"
              />
            </g>
          )}

          {/* Hover Hit Targets */}
          {points.map((p, idx) => {
            const x = getX(p.day);
            const sliceW = plotWidth / points.length;
            return (
              <rect
                key={p.day}
                x={x - sliceW / 2}
                y={padTop}
                width={sliceW}
                height={plotHeight}
                fill="transparent"
                onMouseEnter={() => setHoverIndex(idx)}
              />
            );
          })}
        </svg>

        {/* Compact Monospace HUD readout */}
        {activePoint && (
          <div className="flex flex-wrap items-center justify-between gap-3 px-2 py-1.5 border-t border-slate-800/80 text-xs font-mono tabular-nums text-slate-300">
            <span className="text-slate-400">
              Punto de inspección: <strong className="text-slate-100">Día {activePoint.day}</strong>
            </span>
            <div className="flex items-center gap-4">
              <span>
                Teórico: <strong className="text-cyan-400">{activePoint.theoretical.toFixed(1)}%</strong>
              </span>
              <span>
                Simulado:{' '}
                <strong
                  className={
                    status === 'critical'
                      ? 'text-rose-400'
                      : status === 'warning'
                      ? 'text-amber-400'
                      : 'text-sky-400'
                  }
                >
                  {activePoint.empirical.toFixed(1)}%
                </strong>
              </span>
              <span className="text-slate-400">
                Brecha: {(activePoint.theoretical - activePoint.empirical).toFixed(1)} pts
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
