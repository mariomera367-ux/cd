import React, { useMemo, useState } from 'react';
import { Download, RotateCcw, Check, Plus } from 'lucide-react';
import {
  HARDWARE_CATALOG,
  HardwareEquipment,
  SimulationParams,
  computeEquipmentSimulation,
} from './data/hardware';
import { HardwareViewport } from './components/HardwareViewport';
import { DegradationChart } from './components/DegradationChart';
import { MaterialRadarChart } from './components/MaterialRadarChart';
import { HardwareCatalogSection } from './components/HardwareCatalogSection';

const DEFAULT_PARAMS: SimulationParams = {
  dustIntensity: 45,
  thermalStress: 50,
  missionDays: 180,
  operationalLoad: 65,
};

export default function App() {
  const [activeId, setActiveId] = useState<HardwareEquipment['id']>('rover');
  const [activeSubsystems, setActiveSubsystems] = useState<Record<string, string>>({
    rover: 'rover-wheels',
    solar: 'solar-dust',
    habitat: 'habitat-shell',
    arm: 'arm-friction',
  });
  const [manifestIds, setManifestIds] = useState<HardwareEquipment['id'][]>([
    'rover',
    'solar',
    'habitat',
    'arm',
  ]);
  const [params, setParams] = useState<SimulationParams>(DEFAULT_PARAMS);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const activeEquipment = useMemo(
    () => HARDWARE_CATALOG.find((item) => item.id === activeId) ?? HARDWARE_CATALOG[0],
    [activeId]
  );

  const activeSubsystem = useMemo(() => {
    const subId = activeSubsystems[activeEquipment.id];
    return (
      activeEquipment.subsystems.find((s) => s.id === subId) ??
      activeEquipment.subsystems[0]
    );
  }, [activeEquipment, activeSubsystems]);

  const simulation = useMemo(
    () => computeEquipmentSimulation(activeEquipment, activeSubsystem, params),
    [activeEquipment, activeSubsystem, params]
  );

  const manifestStats = useMemo(() => {
    const selected = HARDWARE_CATALOG.filter((item) => manifestIds.includes(item.id));
    const totalMass = selected.reduce((acc, item) => acc + item.massKg, 0);
    // powerDemandW is negative for generation (solar panel), positive for consumption
    const netPower = selected.reduce((acc, item) => acc - item.powerDemandW, 0);
    return { count: selected.length, totalMass, netPower };
  }, [manifestIds]);

  const handleSelectSubsystem = (subId: string) => {
    setActiveSubsystems((prev) => ({
      ...prev,
      [activeEquipment.id]: subId,
    }));
  };

  const handleToggleManifest = (id: HardwareEquipment['id']) => {
    setManifestIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const applyPreset = (preset: 'nominal' | 'dust' | 'thermal') => {
    if (preset === 'nominal') {
      setParams({ dustIntensity: 25, thermalStress: 35, missionDays: 180, operationalLoad: 55 });
    } else if (preset === 'dust') {
      setParams({ dustIntensity: 88, thermalStress: 55, missionDays: 240, operationalLoad: 75 });
    } else {
      setParams({ dustIntensity: 55, thermalStress: 92, missionDays: 320, operationalLoad: 85 });
    }
  };

  const handleExportReport = () => {
    const selectedItems = HARDWARE_CATALOG.filter((item) => manifestIds.includes(item.id));
    const lines: string[] = [
      'BASE LUNAR SELENE — FICHA TÉCNICA DE EQUIPOS Y HARDWARE',
      '=======================================================',
      `Equipos seleccionados en manifiesto: ${selectedItems.length} de ${HARDWARE_CATALOG.length}`,
      `Masa total estimada: ${manifestStats.totalMass} kg`,
      `Balance energético neto: ${manifestStats.netPower >= 0 ? '+' : ''}${manifestStats.netPower} W`,
      '',
      'PARÁMETROS DE SIMULACIÓN ACTIVOS',
      `- Exposición a polvo lunar: ${params.dustIntensity}%`,
      `- Amplitud térmica: ${params.thermalStress}%`,
      `- Carga operativa: ${params.operationalLoad}%`,
      `- Duración de misión: ${params.missionDays} días`,
      '',
      'DETALLE DE EQUIPOS CRÍTICOS',
      '---------------------------',
      ...HARDWARE_CATALOG.map((eq) => {
        const included = manifestIds.includes(eq.id) ? 'INCLUIDO EN BASE' : 'EN RESERVA';
        return [
          `[${eq.code}] ${eq.name} (${included})`,
          `Material principal: ${eq.primaryMaterial}`,
          `Enfoque: ${eq.focusSummary}`,
          `Descripción:`,
          `  1. ${eq.descriptionLines[0]}`,
          `  2. ${eq.descriptionLines[1]}`,
          `  3. ${eq.descriptionLines[2]}`,
          '',
        ].join('\n');
      }),
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ficha-hardware-base-espacial.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportNotice('Ficha técnica descargada');
    window.setTimeout(() => setExportNotice(null), 2600);
  };

  const isActiveInManifest = manifestIds.includes(activeEquipment.id);

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col">
      {/* Top Bar Contract: 3 exact zones separated by gap-8 */}
      <header className="sticky top-0 z-30 bg-[#07090E]/95 backdrop-blur-sm border-b border-slate-800/90">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <a
            href="#equipos"
            className="text-base font-semibold tracking-tight text-slate-100 whitespace-nowrap shrink-0"
          >
            Base Lunar Selene
          </a>

          {/* Zone 2: 4 concise single-line nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <a
              href="#equipos"
              className="hover:text-slate-100 transition-colors whitespace-nowrap shrink-0"
            >
              Equipos
            </a>
            <a
              href="#simulador"
              className="hover:text-slate-100 transition-colors whitespace-nowrap shrink-0"
            >
              Simulador
            </a>
            <a
              href="#propiedades"
              className="hover:text-slate-100 transition-colors whitespace-nowrap shrink-0"
            >
              Propiedades
            </a>
            <a
              href="#especificaciones"
              className="hover:text-slate-100 transition-colors whitespace-nowrap shrink-0"
            >
              Especificaciones
            </a>
          </nav>

          {/* Zone 3: 1 primary CTA */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleExportReport}
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{exportNotice ?? 'Exportar ficha'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-8 flex flex-col gap-10">
        {/* Hero / Equipment Selector Section */}
        <section id="equipos" className="flex flex-col gap-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <div className="text-xs font-mono text-cyan-400 mb-2">
                Selector de Equipos y Hardware · Arquitectura de Superficie Lunar
              </div>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-100 [text-wrap:balance]">
                Equipos críticos y análisis de materiales para base espacial
              </h1>
              <p className="mt-2.5 text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl">
                Selecciona cualquiera de los cuatro sistemas críticos para inspeccionar su material estructural principal, su descripción técnica y su comportamiento frente a polvo abrasivo y ciclos térmicos.
              </p>
            </div>

            {/* Compact Base Manifest Metrics Strip */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 px-4 py-3 rounded-md border border-slate-800 bg-[#0A0E17] shrink-0">
              <div>
                <div className="text-[11px] font-mono text-slate-400">Equipos base</div>
                <div className="text-lg font-mono font-semibold tabular-nums text-slate-100 mt-0.5">
                  {manifestStats.count} / {HARDWARE_CATALOG.length}
                </div>
              </div>
              <div className="border-l border-slate-800 pl-4">
                <div className="text-[11px] font-mono text-slate-400">Masa total</div>
                <div className="text-lg font-mono font-semibold tabular-nums text-slate-100 mt-0.5">
                  {manifestStats.totalMass} <span className="text-xs text-slate-400 font-normal">kg</span>
                </div>
              </div>
              <div className="border-l border-slate-800 pl-4">
                <div className="text-[11px] font-mono text-slate-400">Balance neto</div>
                <div
                  className={`text-lg font-mono font-semibold tabular-nums mt-0.5 ${
                    manifestStats.netPower >= 0 ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {manifestStats.netPower >= 0 ? '+' : ''}
                  {manifestStats.netPower} <span className="text-xs text-slate-400 font-normal">W</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4-Hardware Interactive Selector Tabs */}
          <div
            role="tablist"
            aria-label="Selector de equipos críticos"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 p-1.5 rounded-md border border-slate-800 bg-[#0A0E17]"
          >
            {HARDWARE_CATALOG.map((item) => {
              const isSelected = item.id === activeId;
              const inBase = manifestIds.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveId(item.id)}
                  className={`text-left px-3.5 py-2.5 rounded transition-colors cursor-pointer flex flex-col gap-1 ${
                    isSelected
                      ? 'bg-[#121B2B] border border-cyan-500/60 text-slate-100'
                      : 'border border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#0E1420]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 w-full">
                    <span className="text-xs font-mono text-cyan-400">{item.code}</span>
                    <span className="text-[11px] font-mono text-slate-400 whitespace-nowrap">
                      {inBase ? 'En base' : 'Reserva'}
                    </span>
                  </div>
                  <span className="text-sm font-semibold truncate w-full">
                    {item.name}
                  </span>
                  <span className="text-xs text-slate-400 truncate w-full">
                    {item.focusSummary}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Asymmetric Split Console: Left Control & Spec Column + Right Visual Viewport */}
        <section
          id="simulador"
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
        >
          {/* Left Control & Parameter Column */}
          <aside className="lg:col-span-4 flex flex-col gap-5 p-5 rounded-md border border-slate-800 bg-[#0A0E17]">
            {/* Equipment Identity & 3-Line Description */}
            <div className="pb-5 border-b border-slate-800/90">
              <div className="flex items-center justify-between gap-2 text-xs font-mono text-slate-400 mb-1.5">
                <span>{activeEquipment.code} · {activeEquipment.category}</span>
                <span className="tabular-nums">{activeEquipment.massKg} kg</span>
              </div>
              <h2 className="text-xl font-semibold text-slate-100 mb-3">
                {activeEquipment.name}
              </h2>

              {/* Exact 3-line description */}
              <div className="space-y-1.5 text-sm text-slate-300 leading-relaxed mb-4">
                {activeEquipment.descriptionLines.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>

              <div className="space-y-2.5 pt-3 border-t border-slate-800/70 text-xs">
                <div>
                  <span className="text-slate-400 block">Material principal</span>
                  <span className="font-mono text-cyan-300 font-medium">
                    {activeEquipment.primaryMaterial}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Componentes complementarios</span>
                  <span className="text-slate-200">
                    {activeEquipment.secondaryMaterials}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-400">Rango operativo</span>
                  <span className="font-mono tabular-nums text-slate-200">
                    {activeEquipment.operatingTempRange}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => handleToggleManifest(activeEquipment.id)}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded text-xs font-medium border transition-colors whitespace-nowrap cursor-pointer ${
                    isActiveInManifest
                      ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/20'
                      : 'bg-slate-900 border-slate-700 text-slate-200 hover:border-slate-500'
                  }`}
                >
                  {isActiveInManifest ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Seleccionado en manifiesto de base</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Incluir equipo en manifiesto</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Environmental Stress Simulation Controls */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-slate-100">
                  Parámetros ambientales
                </h3>
                <button
                  type="button"
                  onClick={() => setParams(DEFAULT_PARAMS)}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-400 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Restablecer</span>
                </button>
              </div>

              {/* Quick Scenario Presets */}
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => applyPreset('nominal')}
                  className="px-2 py-1.5 rounded text-[11px] font-medium border border-slate-800 bg-[#07090E] text-slate-300 hover:border-cyan-500/60 hover:text-slate-100 transition-colors whitespace-nowrap truncate cursor-pointer"
                >
                  Nominal
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('dust')}
                  className="px-2 py-1.5 rounded text-[11px] font-medium border border-slate-800 bg-[#07090E] text-slate-300 hover:border-amber-500/60 hover:text-slate-100 transition-colors whitespace-nowrap truncate cursor-pointer"
                >
                  Polvo severo
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('thermal')}
                  className="px-2 py-1.5 rounded text-[11px] font-medium border border-slate-800 bg-[#07090E] text-slate-300 hover:border-rose-500/60 hover:text-slate-100 transition-colors whitespace-nowrap truncate cursor-pointer"
                >
                  Térmico extremo
                </button>
              </div>

              {/* Slider 1: Dust */}
              <label className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Exposición a polvo lunar</span>
                  <span className="font-mono tabular-nums text-cyan-400 font-medium">
                    {params.dustIntensity}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={params.dustIntensity}
                  onChange={(e) =>
                    setParams((p) => ({ ...p, dustIntensity: Number(e.target.value) }))
                  }
                  className="telemetry-slider w-full"
                />
              </label>

              {/* Slider 2: Thermal Stress */}
              <label className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Amplitud térmica extrema</span>
                  <span className="font-mono tabular-nums text-cyan-400 font-medium">
                    {params.thermalStress}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={params.thermalStress}
                  onChange={(e) =>
                    setParams((p) => ({ ...p, thermalStress: Number(e.target.value) }))
                  }
                  className="telemetry-slider w-full"
                />
              </label>

              {/* Slider 3: Operational Load */}
              <label className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Carga mecánica y uso</span>
                  <span className="font-mono tabular-nums text-cyan-400 font-medium">
                    {params.operationalLoad}%
                  </span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={100}
                  value={params.operationalLoad}
                  onChange={(e) =>
                    setParams((p) => ({ ...p, operationalLoad: Number(e.target.value) }))
                  }
                  className="telemetry-slider w-full"
                />
              </label>

              {/* Slider 4: Mission Duration */}
              <label className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Duración de simulación</span>
                  <span className="font-mono tabular-nums text-cyan-400 font-medium">
                    {params.missionDays} días
                  </span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={500}
                  step={10}
                  value={params.missionDays}
                  onChange={(e) =>
                    setParams((p) => ({ ...p, missionDays: Number(e.target.value) }))
                  }
                  className="telemetry-slider w-full"
                />
              </label>
            </div>
          </aside>

          {/* Main Viewport Stage */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            {/* 4-Column Precision Telemetry Readout */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-md border border-slate-800 bg-[#0A0E17]">
                <div className="text-[11px] font-mono text-slate-400">
                  Eficiencia estimada
                </div>
                <div className="text-2xl font-mono font-semibold tabular-nums text-slate-100 mt-1">
                  {simulation.efficiencyPct.toFixed(1)}
                  <span className="text-xs text-slate-400 ml-1">%</span>
                </div>
              </div>

              <div className="p-3.5 rounded-md border border-slate-800 bg-[#0A0E17]">
                <div className="text-[11px] font-mono text-slate-400">
                  Integridad material
                </div>
                <div className="text-2xl font-mono font-semibold tabular-nums text-slate-100 mt-1">
                  {simulation.materialIntegrityPct.toFixed(1)}
                  <span className="text-xs text-slate-400 ml-1">%</span>
                </div>
              </div>

              <div className="p-3.5 rounded-md border border-slate-800 bg-[#0A0E17]">
                <div className="text-[11px] font-mono text-slate-400">
                  Tasa de desgaste
                </div>
                <div className="text-2xl font-mono font-semibold tabular-nums text-slate-100 mt-1">
                  {simulation.degradationRatePer100Days.toFixed(2)}
                  <span className="text-xs text-slate-400 ml-1">%/100d</span>
                </div>
              </div>

              <div className="p-3.5 rounded-md border border-slate-800 bg-[#0A0E17]">
                <div className="text-[11px] font-mono text-slate-400">
                  Estado operativo
                </div>
                <div
                  className={`text-sm font-mono font-semibold mt-2 ${
                    simulation.status === 'critical'
                      ? 'text-rose-400'
                      : simulation.status === 'warning'
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {simulation.statusLabel}
                </div>
              </div>
            </div>

            {/* Interactive Hardware Inspection Viewport */}
            <HardwareViewport
              equipment={activeEquipment}
              activeSubsystemId={activeSubsystem.id}
              onSelectSubsystem={handleSelectSubsystem}
              dustIntensity={params.dustIntensity}
            />
          </div>
        </section>

        {/* Bottom Telemetry & Material Analysis Row */}
        <section
          id="propiedades"
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-5 rounded-md border border-slate-800 bg-[#0A0E17]"
        >
          <div className="lg:col-span-8">
            <DegradationChart
              points={simulation.curvePoints}
              missionDays={params.missionDays}
              status={simulation.status}
            />
          </div>
          <div className="lg:col-span-4 lg:border-l lg:border-slate-800 lg:pl-6">
            <MaterialRadarChart
              profile={activeEquipment.radarProfile}
              materialName={activeEquipment.primaryMaterial}
            />
          </div>
        </section>

        {/* Complete Deliverable Catalog & Comparative Specification Matrix */}
        <HardwareCatalogSection
          catalog={HARDWARE_CATALOG}
          activeId={activeId}
          manifestIds={manifestIds}
          onInspect={setActiveId}
          onToggleManifest={handleToggleManifest}
        />
      </main>

      <footer className="border-t border-slate-800/90 mt-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span>Base Lunar Selene · Selector de Equipos y Hardware Espacial</span>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={handleExportReport}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Descargar ficha técnica
            </button>
            <button
              type="button"
              onClick={() => {
                setParams(DEFAULT_PARAMS);
                setManifestIds(['rover', 'solar', 'habitat', 'arm']);
              }}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Restaurar selección por defecto
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
