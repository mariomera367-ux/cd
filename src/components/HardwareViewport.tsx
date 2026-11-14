import React, { useState } from 'react';
import { Crosshair, Eye, EyeOff, ShieldAlert, Wrench } from 'lucide-react';
import { HardwareEquipment, SubsystemFocus } from '../data/hardware';

interface HardwareViewportProps {
  equipment: HardwareEquipment;
  activeSubsystemId: string;
  onSelectSubsystem: (subsystemId: string) => void;
  dustIntensity: number;
}

export const HardwareViewport: React.FC<HardwareViewportProps> = ({
  equipment,
  activeSubsystemId,
  onSelectSubsystem,
  dustIntensity,
}) => {
  const [imgError, setImgError] = useState(false);
  const [showPins, setShowPins] = useState(true);
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);

  const activeSubsystem: SubsystemFocus =
    equipment.subsystems.find((s) => s.id === activeSubsystemId) ?? equipment.subsystems[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setCoords({ x, y });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main Visual Stage */}
      <div
        className="relative aspect-[4/3] w-full overflow-hidden rounded-md border border-slate-800 bg-[#05070B] cursor-crosshair select-none"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setCoords(null)}
      >
        {!imgError ? (
          <img
            key={equipment.imagePath}
            src={equipment.imagePath}
            alt={`Vista técnica de ${equipment.name}`}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-opacity duration-200"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-[#090D14] text-slate-400 p-6 text-center">
            <Wrench className="w-8 h-8 text-cyan-500/80" />
            <div className="text-sm font-medium text-slate-200">{equipment.name}</div>
            <div className="text-xs font-mono text-slate-400">{equipment.primaryMaterial}</div>
          </div>
        )}

        {/* Subtle Regolith Dust Atmospheric Veil proportional to dustIntensity */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-200"
          style={{
            background:
              'radial-gradient(circle at 50% 80%, rgba(148, 163, 184, 0.22), rgba(15, 23, 42, 0.1) 70%)',
            opacity: Math.min(0.65, (dustIntensity / 100) * 0.65),
          }}
        />

        {/* Subtle Scrim at Top & Bottom for Legibility */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#07090E]/85 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#07090E]/90 via-[#07090E]/50 to-transparent" />

        {/* Top Overlay Controls */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-200 bg-[#07090E]/80 border border-slate-800 px-2.5 py-1.5 rounded">
            <span className="text-cyan-400 font-semibold">{equipment.code}</span>
            <span aria-hidden="true" className="text-slate-600">/</span>
            <span>{equipment.category}</span>
          </div>

          <button
            type="button"
            onClick={() => setShowPins((prev) => !prev)}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-200 bg-[#07090E]/85 hover:bg-slate-800 border border-slate-700/80 px-2.5 py-1.5 rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {showPins ? <EyeOff className="w-3.5 h-3.5 text-cyan-400" /> : <Eye className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{showPins ? 'Ocultar puntos' : 'Mostrar puntos'}</span>
          </button>
        </div>

        {/* Interactive Focus Hotspots */}
        {showPins &&
          equipment.subsystems.map((sub, idx) => {
            const isSelected = sub.id === activeSubsystem.id;
            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => onSelectSubsystem(sub.id)}
                style={{ left: `${sub.xPercent}%`, top: `${sub.yPercent}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 px-2.5 py-1.5 rounded border text-xs font-medium transition-all duration-150 whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-950/95 border-cyan-400 text-cyan-100 shadow-lg'
                    : 'bg-[#07090E]/85 border-slate-700 text-slate-200 hover:border-cyan-500/70'
                }`}
                aria-pressed={isSelected}
              >
                <span className="font-mono text-[11px] text-cyan-400">0{idx + 1}</span>
                <span>{sub.label}</span>
              </button>
            );
          })}

        {/* Bottom Crosshair Coordinate & Focus Indicator */}
        <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3 text-[11px] font-mono tabular-nums text-slate-300">
          <div className="flex items-center gap-2 bg-[#07090E]/80 border border-slate-800 px-2.5 py-1 rounded">
            <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              {coords ? `X:${coords.x.toString().padStart(2, '0')}%  Y:${coords.y.toString().padStart(2, '0')}%` : 'POS: --%  --%'}
            </span>
          </div>
          <div className="bg-[#07090E]/80 border border-slate-800 px-2.5 py-1 rounded text-slate-300 truncate max-w-[60%]">
            Enfoque activo: {activeSubsystem.label}
          </div>
        </div>
      </div>

      {/* Subsystem Focus Selector + Technical Diagnosis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {equipment.subsystems.map((sub, idx) => {
          const isSelected = sub.id === activeSubsystem.id;
          return (
            <button
              key={sub.id}
              type="button"
              onClick={() => onSelectSubsystem(sub.id)}
              className={`text-left p-3.5 rounded-md border transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-[#0E1623] border-cyan-500/70'
                  : 'bg-[#0A0E17] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-mono text-cyan-400">
                  Subcomponente 0{idx + 1}
                </span>
                <span className="text-xs font-mono text-slate-400 tabular-nums">
                  Sens. polvo {Math.round(sub.dustWeight * 100)}%
                </span>
              </div>
              <div className="text-sm font-semibold text-slate-100 mb-1">
                {sub.label}
              </div>
              <div className="text-xs text-slate-400 leading-relaxed">
                {sub.materialDetail}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Subsystem Vulnerability & Mitigation Readout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-md border border-slate-800 bg-[#0B0F18]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1.5">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
            <span>Vector de desgaste y fallo</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {activeSubsystem.vulnerability}
          </p>
        </div>
        <div className="md:border-l md:border-slate-800 md:pl-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1.5">
            <Wrench className="w-3.5 h-3.5 shrink-0" />
            <span>Solución de ingeniería</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {activeSubsystem.mitigation}
          </p>
        </div>
      </div>
    </div>
  );
};
