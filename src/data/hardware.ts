export interface SubsystemFocus {
  id: string;
  label: string;
  materialDetail: string;
  vulnerability: string;
  mitigation: string;
  /** Position on the 4:3 visual viewport in percentage */
  xPercent: number;
  yPercent: number;
  /** Sensitivity coefficients for simulation calculations */
  dustWeight: number;
  thermalWeight: number;
  loadWeight: number;
}

export interface MaterialRadarProfile {
  mechanicalStrength: number; // 0-100
  abrasionResistance: number; // 0-100
  thermalStability: number; // 0-100
  dustSealing: number; // 0-100
  strengthToWeight: number; // 0-100
}

export interface HardwareEquipment {
  id: 'rover' | 'solar' | 'habitat' | 'arm';
  code: string;
  name: string;
  shortName: string;
  category: string;
  focusSummary: string;
  primaryMaterial: string;
  secondaryMaterials: string;
  massKg: number;
  powerDemandW: number;
  operatingTempRange: string;
  imagePath: string;
  descriptionLines: [string, string, string];
  subsystems: [SubsystemFocus, SubsystemFocus];
  radarProfile: MaterialRadarProfile;
  baseDegradationPer100Days: number;
}

export const HARDWARE_CATALOG: HardwareEquipment[] = [
  {
    id: 'rover',
    code: 'EQ-01',
    name: 'Rover autónomo de exploración',
    shortName: 'Rover autónomo',
    category: 'Movilidad y prospección',
    focusSummary: 'Ruedas de aluminio y motores',
    primaryMaterial: 'Aluminio aeronáutico 7075-T6',
    secondaryMaterials: 'Titanio Ti-6Al-4V en ejes y rodamientos cerámicos',
    massKg: 420,
    powerDemandW: 850,
    operatingTempRange: '-170 °C a +115 °C',
    imagePath: '/src/assets/images/rover_exploration_1794684283380.jpg',
    descriptionLines: [
      'Vehículo móvil autónomo equipado con ruedas flexibles de aluminio aeronáutico ranurado para traccionar sobre regolito abrasivo.',
      'Integra motores eléctricos brushless sellados en cada cubo con reductores armónicos de alto par y control térmico activo.',
      'Diseñado para cartografía superficial, análisis mineralógico y transporte de muestras en pendientes lunares de hasta 28 grados.',
    ],
    subsystems: [
      {
        id: 'rover-wheels',
        label: 'Ruedas de aluminio ranurado',
        materialDetail: 'Banda elástica mecanizada en aluminio 7075-T6 con nervaduras de tracción',
        vulnerability: 'Abrasión progresiva del perfil exterior y fatiga por microimpactos de regolito vitrificado.',
        mitigation: 'Anodizado duro superficial de 50 µm y ranuras autolimpiantes de geometría helicoidal.',
        xPercent: 25,
        yPercent: 68,
        dustWeight: 0.48,
        thermalWeight: 0.22,
        loadWeight: 0.35,
      },
      {
        id: 'rover-motors',
        label: 'Motores de tracción en cubo',
        materialDetail: 'Estator de cobre encapsulado en carcasa de aluminio y sellos de PTFE',
        vulnerability: 'Sobrecalentamiento por pérdida de disipación y filtración de polvo fino en el entrehierro.',
        mitigation: 'Doble sello laberíntico presurizado y sensores térmicos integrados en bobinado.',
        xPercent: 52,
        yPercent: 78,
        dustWeight: 0.55,
        thermalWeight: 0.45,
        loadWeight: 0.42,
      },
    ],
    radarProfile: {
      mechanicalStrength: 88,
      abrasionResistance: 76,
      thermalStability: 80,
      dustSealing: 74,
      strengthToWeight: 92,
    },
    baseDegradationPer100Days: 4.6,
  },
  {
    id: 'solar',
    code: 'EQ-02',
    name: 'Panel solar flexible desplegable',
    shortName: 'Panel solar flexible',
    category: 'Generación energética',
    focusSummary: 'Circuitos y degradación por polvo',
    primaryMaterial: 'Polímeros de alta resistencia (Kapton)',
    secondaryMaterials: 'Celdas triple unión de GaAs y pistas de cobre laminado',
    massKg: 145,
    powerDemandW: -4200,
    operatingTempRange: '-185 °C a +130 °C',
    imagePath: '/src/assets/images/solar_array_1794684284060.jpg',
    descriptionLines: [
      'Manta fotovoltaica enrollable sobre polímero de alta resistencia que despliega circuitos impresos flexibles de gran densidad.',
      'Sus pistas conductoras y celdas de triple unión pierden eficiencia gradualmente por acumulación electrostática de polvo lunar.',
      'Incorpora una malla de limpieza electrodinámica para evitar sombreados parciales y puntos calientes en los circuitos.',
    ],
    subsystems: [
      {
        id: 'solar-circuits',
        label: 'Circuitos impresos flexibles',
        materialDetail: 'Pistas de cobre-níquel laminadas entre películas de poliimida Kapton HN',
        vulnerability: 'Microfisuras por fatiga térmica en soldaduras y puntos calientes cuando una celda queda sombreada.',
        mitigation: 'Diodos de derivación distribuidos y ruteo redundante en geometría serpentina.',
        xPercent: 34,
        yPercent: 64,
        dustWeight: 0.32,
        thermalWeight: 0.58,
        loadWeight: 0.25,
      },
      {
        id: 'solar-dust',
        label: 'Superficie fotovoltaica y polvo',
        materialDetail: 'Celdas GaAs protegidas con recubrimiento vítreo antirreflejo de cerio',
        vulnerability: 'Pérdida de transmitancia óptica de hasta un 35 % por adhesión electrostática de polvo fino.',
        mitigation: 'Escudo electrodinámico de onda viajera (EDS) que repele partículas de 5 a 80 µm.',
        xPercent: 64,
        yPercent: 33,
        dustWeight: 0.85,
        thermalWeight: 0.30,
        loadWeight: 0.15,
      },
    ],
    radarProfile: {
      mechanicalStrength: 62,
      abrasionResistance: 58,
      thermalStability: 84,
      dustSealing: 52,
      strengthToWeight: 96,
    },
    baseDegradationPer100Days: 7.4,
  },
  {
    id: 'habitat',
    code: 'EQ-03',
    name: 'Hábitat inflable presurizado',
    shortName: 'Hábitat presurizado',
    category: 'Infraestructura vital',
    focusSummary: 'Lona exterior y juntas de sellado',
    primaryMaterial: 'Polímeros de alta resistencia (Vectran)',
    secondaryMaterials: 'Elastómeros fluorosiliconados y anillos de aluminio-litio',
    massKg: 2850,
    powerDemandW: 1900,
    operatingTempRange: '-190 °C a +120 °C',
    imagePath: '/src/assets/images/inflatable_habitat_1794684284289.jpg',
    descriptionLines: [
      'Módulo habitable expandible cuya lona exterior multicapa de polímero tejido resiste impactos de micrometeoritos y abrasión.',
      'Conserva una atmósfera presurizada estable mediante juntas de sellado elastoméricas redundantes en sus anillos metálicos.',
      'Su diseño plegable reduce el volumen de transporte en un 60 % manteniendo una envolvente estructural hermética tras el inflado.',
    ],
    subsystems: [
      {
        id: 'habitat-shell',
        label: 'Lona exterior multicapa Vectran',
        materialDetail: 'Tejido estructural de polímero líquido cristalino Vectran con blindaje MLI',
        vulnerability: 'Degradación por radiación ultravioleta extrema y corte superficial ante granos angulares de regolito.',
        mitigation: 'Capa externa sacrificial de Nextel cerámico y mantas reflectantes aluminizadas.',
        xPercent: 52,
        yPercent: 25,
        dustWeight: 0.34,
        thermalWeight: 0.42,
        loadWeight: 0.50,
      },
      {
        id: 'habitat-seals',
        label: 'Juntas de sellado hermético',
        materialDetail: 'Doble junta tórica de fluorosilicona comprimida sobre brida de aluminio-litio',
        vulnerability: 'Pérdida de elasticidad en frío extremo y microfugas si el polvo contamina los labios de cierre.',
        mitigation: 'Calefactores perimetrales en brida y escobillas barredoras previas al acoplamiento.',
        xPercent: 23,
        yPercent: 64,
        dustWeight: 0.62,
        thermalWeight: 0.54,
        loadWeight: 0.60,
      },
    ],
    radarProfile: {
      mechanicalStrength: 90,
      abrasionResistance: 82,
      thermalStability: 91,
      dustSealing: 88,
      strengthToWeight: 85,
    },
    baseDegradationPer100Days: 2.9,
  },
  {
    id: 'arm',
    code: 'EQ-04',
    name: 'Brazo robótico articulado',
    shortName: 'Brazo robótico',
    category: 'Manipulación y mantenimiento',
    focusSummary: 'Uniones metálicas y fricción por polvo',
    primaryMaterial: 'Titanio aeroespacial Ti-6Al-4V',
    secondaryMaterials: 'Recubrimiento de carbono tipo diamante (DLC) y acero 440C',
    massKg: 195,
    powerDemandW: 620,
    operatingTempRange: '-175 °C a +125 °C',
    imagePath: '/src/assets/images/robotic_arm_1794684284787.jpg',
    descriptionLines: [
      'Manipulador de siete grados de libertad con uniones metálicas de titanio diseñadas para ensamblaje y mantenimiento externo.',
      'Sus articulaciones rotatorias sufren desgaste acelerado por fricción cuando el polvo lunar abrasivo penetra en los rodamientos.',
      'Integra sellos rotativos multicapa y lubricación sólida seca para mantener precisión submilimétrica bajo vacío extremo.',
    ],
    subsystems: [
      {
        id: 'arm-joints',
        label: 'Uniones metálicas de titanio',
        materialDetail: 'Eslabones y horquillas mecanizados en aleación Ti-6Al-4V con bujes endurecidos',
        vulnerability: 'Juego mecánico acumulado y soldadura en frío entre superficies metálicas sin óxido protector.',
        mitigation: 'Tratamiento superficial de carbono tipo diamante (DLC) y pares de apriete compensados.',
        xPercent: 32,
        yPercent: 32,
        dustWeight: 0.45,
        thermalWeight: 0.36,
        loadWeight: 0.56,
      },
      {
        id: 'arm-friction',
        label: 'Desgaste por fricción de polvo',
        materialDetail: 'Rodamientos de bolas híbridos con lubricante sólido de disulfuro de molibdeno',
        vulnerability: 'Aumento del par resistente hasta en un 40 % por intrusión de polvo silíceo en la muñeca articulada.',
        mitigation: 'Fuelles metálicos flexibles sellados y monitoreo continuo de corriente en actuadores.',
        xPercent: 69,
        yPercent: 52,
        dustWeight: 0.82,
        thermalWeight: 0.32,
        loadWeight: 0.48,
      },
    ],
    radarProfile: {
      mechanicalStrength: 95,
      abrasionResistance: 84,
      thermalStability: 88,
      dustSealing: 71,
      strengthToWeight: 82,
    },
    baseDegradationPer100Days: 5.8,
  },
];

export interface SimulationParams {
  dustIntensity: number; // 0 to 100 %
  thermalStress: number; // 0 to 100 %
  missionDays: number; // 30 to 500 days
  operationalLoad: number; // 20 to 100 %
}

export interface SimulationResult {
  efficiencyPct: number;
  materialIntegrityPct: number;
  degradationRatePer100Days: number;
  status: 'nominal' | 'warning' | 'critical';
  statusLabel: string;
  curvePoints: Array<{
    day: number;
    theoretical: number;
    empirical: number;
  }>;
}

export function computeEquipmentSimulation(
  equipment: HardwareEquipment,
  subsystem: SubsystemFocus,
  params: SimulationParams
): SimulationResult {
  const dustFactor = params.dustIntensity / 100;
  const thermalFactor = params.thermalStress / 100;
  const loadFactor = params.operationalLoad / 100;

  // Weighted stress multiplier based on active focus subsystem
  const combinedStress =
    dustFactor * subsystem.dustWeight * 1.45 +
    thermalFactor * subsystem.thermalWeight * 1.15 +
    loadFactor * subsystem.loadWeight * 0.95;

  const degradationRatePer100Days = Number(
    (equipment.baseDegradationPer100Days * (0.45 + combinedStress)).toFixed(2)
  );

  const totalLoss = (degradationRatePer100Days * params.missionDays) / 100;
  const efficiencyPct = Math.max(24, Number((100 - totalLoss * 0.92).toFixed(1)));
  const materialIntegrityPct = Math.max(30, Number((100 - totalLoss * 0.78).toFixed(1)));

  let status: 'nominal' | 'warning' | 'critical' = 'nominal';
  let statusLabel = '● Nominal';

  if (efficiencyPct < 68 || materialIntegrityPct < 72) {
    status = 'critical';
    statusLabel = '✖ Alerta crítica';
  } else if (efficiencyPct < 84 || materialIntegrityPct < 86) {
    status = 'warning';
    statusLabel = '▲ Desgaste moderado';
  }

  // Generate 11 curve points across 0..missionDays
  const steps = 10;
  const curvePoints = Array.from({ length: steps + 1 }, (_, i) => {
    const day = Math.round((params.missionDays / steps) * i);
    const progress = day / 100;
    const theoretical = Math.max(
      70,
      Number((100 - equipment.baseDegradationPer100Days * 0.35 * progress).toFixed(1))
    );
    // Slight non-linear acceleration due to abrasive particle accumulation
    const nonlinear = Math.pow(progress, 1.12);
    const empirical = Math.max(
      20,
      Number((100 - degradationRatePer100Days * nonlinear * 0.92).toFixed(1))
    );
    return { day, theoretical, empirical };
  });

  return {
    efficiencyPct,
    materialIntegrityPct,
    degradationRatePer100Days,
    status,
    statusLabel,
    curvePoints,
  };
}
