import React from 'react';
import { Check, Plus, ArrowUpRight } from 'lucide-react';
import { HardwareEquipment } from '../data/hardware';

interface HardwareCatalogSectionProps {
  catalog: HardwareEquipment[];
  activeId: string;
  manifestIds: string[];
  onInspect: (id: HardwareEquipment['id']) => void;
  onToggleManifest: (id: HardwareEquipment['id']) => void;
}

export const HardwareCatalogSection: React.FC<HardwareCatalogSectionProps> = ({
  catalog,
  activeId,
  manifestIds,
  onInspect,
  onToggleManifest,
}) => {
  return (
    <section id="especificaciones" className="pt-10 border-t border-slate-800/90 flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-100 [text-wrap:balance]">
            Catálogo de equipos críticos y materiales principales
          </h2>
          <p className="mt-1.5 text-sm text-slate-400 leading-relaxed">
            Ficha técnica de los cuatro sistemas seleccionados para la base espacial, con su descripción operativa de tres líneas, enfoque de desgaste y material estructural dominante.
          </p>
        </div>
        <div className="text-xs font-mono tabular-nums text-slate-400 shrink-0">
          Equipos en manifiesto activo: <strong className="text-cyan-400">{manifestIds.length}</strong> / {catalog.length}
        </div>
      </div>

      {/* 2x2 Grid with exact 3-line descriptions & primary material */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {catalog.map((item) => {
          const isInspecting = item.id === activeId;
          const inManifest = manifestIds.includes(item.id);

          return (
            <article
              key={item.id}
              className={`flex flex-col justify-between p-6 rounded-md border transition-colors ${
                isInspecting
                  ? 'bg-[#0E1522] border-cyan-500/60'
                  : 'bg-[#0A0E17] border-slate-800'
              }`}
            >
              <div>
                {/* Unboxed metadata header */}
                <div className="flex items-center justify-between gap-3 text-xs font-mono text-slate-400 mb-2">
                  <span>
                    {item.code} <span aria-hidden="true">·</span> {item.category}
                  </span>
                  <span className="tabular-nums text-slate-300">
                    {item.massKg} kg
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-slate-100 mb-3">
                  {item.name}
                </h3>

                {/* Exact 3-line description */}
                <div className="space-y-1.5 text-sm text-slate-300 leading-relaxed mb-5">
                  {item.descriptionLines.map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/90 flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="text-slate-400 mb-0.5">Material principal</div>
                    <div className="font-mono text-cyan-300 font-medium">
                      {item.primaryMaterial}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400 mb-0.5">Enfoque de simulación</div>
                    <div className="text-slate-200 font-medium">
                      {item.focusSummary}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => onToggleManifest(item.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded text-xs font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      inManifest
                        ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/20'
                        : 'bg-[#07090E] border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    {inManifest ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Incluido en base</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Añadir a base</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onInspect(item.id);
                      document.getElementById('simulador')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded text-xs font-medium text-slate-100 bg-slate-800 hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Simular equipo</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Comparative Specification Table */}
      <div className="overflow-x-auto rounded-md border border-slate-800 bg-[#0A0E17]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-xs font-mono text-slate-400">
              <th className="py-3 px-4 font-medium">Código</th>
              <th className="py-3 px-4 font-medium">Equipo crítico</th>
              <th className="py-3 px-4 font-medium">Material principal</th>
              <th className="py-3 px-4 font-medium">Rango térmico</th>
              <th className="py-3 px-4 font-medium text-right">Masa</th>
              <th className="py-3 px-4 font-medium text-right">Balance eléctrico</th>
              <th className="py-3 px-4 font-medium text-right">Estado en base</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-sm">
            {catalog.map((item) => {
              const inManifest = manifestIds.includes(item.id);
              const powerLabel =
                item.powerDemandW < 0
                  ? `+${Math.abs(item.powerDemandW)} W`
                  : `-${item.powerDemandW} W`;

              return (
                <tr
                  key={item.id}
                  onClick={() => onInspect(item.id)}
                  className={`transition-colors cursor-pointer ${
                    item.id === activeId ? 'bg-[#0E1623]' : 'hover:bg-[#0D121C]'
                  }`}
                >
                  <td className="py-3 px-4 font-mono text-xs text-cyan-400 whitespace-nowrap">
                    {item.code}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-100 whitespace-nowrap">
                    {item.name}
                  </td>
                  <td className="py-3 px-4 text-xs font-mono text-slate-300">
                    {item.primaryMaterial}
                  </td>
                  <td className="py-3 px-4 text-xs font-mono tabular-nums text-slate-400 whitespace-nowrap">
                    {item.operatingTempRange}
                  </td>
                  <td className="py-3 px-4 text-xs font-mono tabular-nums text-slate-200 text-right whitespace-nowrap">
                    {item.massKg} kg
                  </td>
                  <td
                    className={`py-3 px-4 text-xs font-mono tabular-nums text-right whitespace-nowrap ${
                      item.powerDemandW < 0 ? 'text-emerald-400' : 'text-slate-300'
                    }`}
                  >
                    {powerLabel}
                  </td>
                  <td className="py-3 px-4 text-xs font-mono text-right whitespace-nowrap">
                    {inManifest ? (
                      <span className="text-cyan-400">● Seleccionado</span>
                    ) : (
                      <span className="text-slate-500">○ En reserva</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
