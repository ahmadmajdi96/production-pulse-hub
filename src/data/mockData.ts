// ==================== MOCK DATA FOR EA1: OPERATOR FLOOR DISPLAY ====================

export type RunStatus = 'RUNNING' | 'PAUSED' | 'TRANSITION' | 'CIP' | 'IDLE' | 'DOWN';

export interface ActiveRun {
  runId: string;
  productName: string;
  sku: string;
  batchId: string;
  status: RunStatus;
  startTime: string;
  elapsedMinutes: number;
  targetCasesPerHour: number;
  actualCasesPerHour: number;
  totalCasesProduced: number;
  targetCases: number;
}

export interface QualityGauge {
  id: string;
  label: string;
  unit: string;
  value: number;
  target: number;
  min: number;
  max: number;
  lsl: number;
  usl: number;
  status: 'normal' | 'monitor' | 'warning' | 'critical';
}

export interface WorkInstruction {
  stepNumber: number;
  totalSteps: number;
  title: string;
  instruction: string;
  acknowledged: boolean;
}

export interface Operator {
  id: string;
  name: string;
  role: string;
  clockedOnAt: string;
}

export interface CCPReading {
  id: string;
  name: string;
  parameter: string;
  unit: string;
  value: number;
  criticalLow: number;
  criticalHigh: number;
  trend: 'up' | 'down' | 'stable';
  status: 'normal' | 'monitor' | 'warning' | 'critical';
  lastRecordedAt: string;
}

export interface SPCDataPoint {
  subgroup: number;
  mean: number;
  range: number;
  timestamp: string;
  violation: boolean;
  violationRule?: string;
}

export interface Alert {
  id: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  message: string;
  source: string;
  timestamp: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
}

export interface TransitionData {
  outgoingProduct: string;
  incomingProduct: string;
  outgoingParams: { label: string; value: number; unit: string }[];
  incomingParams: { label: string; target: number; unit: string }[];
  transitionVolumeLiters: number;
  switchRecommended: boolean;
}

export interface CIPStep {
  name: string;
  status: 'completed' | 'active' | 'pending';
  durationMinutes: number;
  elapsedMinutes: number;
}

export interface CIPData {
  steps: CIPStep[];
  temperature: { required: number; actual: number; unit: string };
  flowRate: { required: number; actual: number; unit: string };
  concentration: { required: number; actual: number; unit: string };
  contactTime: { required: number; actual: number; unit: string };
  outcome: 'IN_PROGRESS' | 'VERIFIED' | 'FAILED' | null;
}

export interface ShiftEvent {
  id: string;
  time: string;
  type: 'production' | 'quality' | 'maintenance' | 'safety';
  description: string;
}

export interface ShiftData {
  outgoingShift: string;
  incomingShift: string;
  outgoingCrew: string;
  incomingCrew: string;
  unitsProduced: number;
  oee: number;
  downtimeMinutes: number;
  wasteKg: number;
  ncrCount: number;
  openIssues: { id: string; description: string; severity: 'RED' | 'AMBER' }[];
  events: ShiftEvent[];
}

export interface AndonCall {
  id: string;
  type: 'MATERIAL' | 'QUALITY' | 'EQUIPMENT' | 'PROCESS';
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
  raisedAt: string;
  slaMinutes: number;
  elapsedMinutes: number;
  description: string;
  line: string;
  station: string;
}

// ==================== ACTIVE RUN ====================
export const activeRun: ActiveRun = {
  runId: 'RUN-2026-0412',
  productName: 'Premium Orange Juice 1L',
  sku: 'OJ-PREM-1000',
  batchId: 'B-20260405-003',
  status: 'RUNNING',
  startTime: '2026-04-05T06:00:00Z',
  elapsedMinutes: 247,
  targetCasesPerHour: 480,
  actualCasesPerHour: 462,
  totalCasesProduced: 1892,
  targetCases: 3840,
};

// ==================== QUALITY GAUGES ====================
export const qualityGauges: QualityGauge[] = [
  { id: 'brix', label: 'Brix', unit: '°Bx', value: 11.4, target: 11.5, min: 10, max: 13, lsl: 11.0, usl: 12.0, status: 'normal' },
  { id: 'ph', label: 'pH', unit: '', value: 3.72, target: 3.70, min: 3.0, max: 4.5, lsl: 3.50, usl: 3.90, status: 'normal' },
  { id: 'temp', label: 'Temperature', unit: '°C', value: 4.2, target: 4.0, min: 0, max: 10, lsl: 2.0, usl: 6.0, status: 'normal' },
  { id: 'viscosity', label: 'Viscosity', unit: 'cP', value: 2.8, target: 3.0, min: 1, max: 5, lsl: 2.0, usl: 4.0, status: 'monitor' },
  { id: 'flow', label: 'Flow Rate', unit: 'L/min', value: 125, target: 130, min: 80, max: 160, lsl: 110, usl: 150, status: 'normal' },
];

// ==================== WORK INSTRUCTION ====================
export const currentWorkInstruction: WorkInstruction = {
  stepNumber: 4,
  totalSteps: 12,
  title: 'Verify Fill Volume',
  instruction: 'Take 5 sample cartons from the filler output. Measure fill volume using the graduated cylinder. Record each measurement. All samples must be within 990–1010 mL.',
  acknowledged: false,
};

// ==================== OPERATORS ====================
export const clockedOnOperators: Operator[] = [
  { id: 'op1', name: 'Maria Santos', role: 'Line Operator', clockedOnAt: '05:55' },
  { id: 'op2', name: 'James Chen', role: 'Filler Operator', clockedOnAt: '05:58' },
  { id: 'op3', name: 'Aisha Patel', role: 'QC Technician', clockedOnAt: '06:02' },
  { id: 'op4', name: 'Tom Wright', role: 'Packaging', clockedOnAt: '06:00' },
];

// ==================== CCP READINGS ====================
export const ccpReadings: CCPReading[] = [
  { id: 'ccp1', name: 'CCP-01', parameter: 'Pasteurization Temp', unit: '°C', value: 72.4, criticalLow: 72.0, criticalHigh: 78.0, trend: 'stable', status: 'normal', lastRecordedAt: '10:12' },
  { id: 'ccp2', name: 'CCP-02', parameter: 'Hold Time', unit: 's', value: 15.2, criticalLow: 15.0, criticalHigh: 20.0, trend: 'stable', status: 'monitor', lastRecordedAt: '10:12' },
  { id: 'ccp3', name: 'CCP-03', parameter: 'Fill Temperature', unit: '°C', value: 4.1, criticalLow: 1.0, criticalHigh: 7.0, trend: 'up', status: 'normal', lastRecordedAt: '10:10' },
  { id: 'ccp4', name: 'CCP-04', parameter: 'Metal Detection', unit: 'mm', value: 1.2, criticalLow: 0, criticalHigh: 2.5, trend: 'stable', status: 'normal', lastRecordedAt: '10:11' },
  { id: 'ccp5', name: 'CCP-05', parameter: 'Seal Integrity', unit: 'kPa', value: 285, criticalLow: 250, criticalHigh: 350, trend: 'down', status: 'normal', lastRecordedAt: '10:08' },
  { id: 'ccp6', name: 'CCP-06', parameter: 'Homogenizer Pressure', unit: 'bar', value: 198, criticalLow: 180, criticalHigh: 220, trend: 'stable', status: 'normal', lastRecordedAt: '10:09' },
];

// ==================== SPC DATA ====================
export const spcData: SPCDataPoint[] = Array.from({ length: 25 }, (_, i) => {
  const base = 11.5;
  const noise = (Math.sin(i * 0.7) * 0.15) + (Math.random() - 0.5) * 0.1;
  const value = base + noise;
  const isViolation = i === 18 || i === 22;
  return {
    subgroup: i + 1,
    mean: isViolation ? (i === 18 ? 12.05 : 11.02) : parseFloat(value.toFixed(2)),
    range: parseFloat((0.3 + Math.random() * 0.2).toFixed(2)),
    timestamp: `${String(6 + Math.floor(i * 10 / 60)).padStart(2, '0')}:${String((i * 10) % 60).padStart(2, '0')}`,
    violation: isViolation,
    violationRule: isViolation ? (i === 18 ? 'One point beyond 3σ (Rule 1)' : 'Two of three points beyond 2σ (Rule 2)') : undefined,
  };
});

export const spcLimits = {
  ucl: 12.0,
  lcl: 11.0,
  mean: 11.5,
  usl: 12.2,
  lsl: 10.8,
  cpk: 1.33,
};

// ==================== ALERTS ====================
export const alerts: Alert[] = [
  { id: 'al1', severity: 'HIGH', message: 'Pasteurizer hold time approaching lower limit — CCP-02 at 15.2s (limit: 15.0s)', source: 'CCP Monitor', timestamp: '10:12:34', acknowledged: false },
  { id: 'al2', severity: 'MEDIUM', message: 'Filler nozzle #3 drip detected — maintenance check recommended', source: 'Vision System', timestamp: '09:45:12', acknowledged: true, acknowledgedBy: 'M. Santos' },
  { id: 'al3', severity: 'LOW', message: 'Carton magazine stock below 500 units — replenishment soon', source: 'Material System', timestamp: '09:30:00', acknowledged: true, acknowledgedBy: 'T. Wright' },
];

// ==================== TRANSITION DATA ====================
export const transitionData: TransitionData = {
  outgoingProduct: 'Premium Orange Juice 1L',
  incomingProduct: 'Apple & Mango Blend 1L',
  outgoingParams: [
    { label: 'Brix', value: 11.5, unit: '°Bx' },
    { label: 'pH', value: 3.70, unit: '' },
    { label: 'Color', value: 28, unit: 'CU' },
  ],
  incomingParams: [
    { label: 'Brix', target: 12.8, unit: '°Bx' },
    { label: 'pH', target: 3.55, unit: '' },
    { label: 'Color', target: 18, unit: 'CU' },
  ],
  transitionVolumeLiters: 142,
  switchRecommended: true,
};

// ==================== CIP DATA ====================
export const cipData: CIPData = {
  steps: [
    { name: 'Pre-Rinse', status: 'completed', durationMinutes: 10, elapsedMinutes: 10 },
    { name: 'Caustic Wash', status: 'completed', durationMinutes: 20, elapsedMinutes: 20 },
    { name: 'Intermediate Rinse', status: 'active', durationMinutes: 8, elapsedMinutes: 5 },
    { name: 'Acid Wash', status: 'pending', durationMinutes: 15, elapsedMinutes: 0 },
    { name: 'Final Rinse', status: 'pending', durationMinutes: 10, elapsedMinutes: 0 },
  ],
  temperature: { required: 80, actual: 78.5, unit: '°C' },
  flowRate: { required: 200, actual: 195, unit: 'L/min' },
  concentration: { required: 2.0, actual: 1.95, unit: '%' },
  contactTime: { required: 8, actual: 5, unit: 'min' },
  outcome: 'IN_PROGRESS',
};

// ==================== IDLE/LINE READY ====================
export const lineStatus = {
  status: 'READY-FOR-RUN' as const,
  lastRun: {
    product: 'Premium Orange Juice 1L',
    duration: '4h 07m',
    oee: 87.2,
    batchId: 'B-20260405-002',
  },
  pendingActions: [
    { id: 'pa1', description: 'Confirm CIP cycle verified', completed: true },
    { id: 'pa2', description: 'Load carton blanks to magazine', completed: false },
    { id: 'pa3', description: 'Verify raw material lot receipt', completed: true },
    { id: 'pa4', description: 'Supervisor run authorization', completed: false },
  ],
};

// ==================== SHIFT DATA ====================
export const shiftData: ShiftData = {
  outgoingShift: 'Day Shift A',
  incomingShift: 'Day Shift B',
  outgoingCrew: 'Crew Alpha',
  incomingCrew: 'Crew Beta',
  unitsProduced: 3420,
  oee: 87.2,
  downtimeMinutes: 38,
  wasteKg: 12.4,
  ncrCount: 1,
  openIssues: [
    { id: 'oi1', description: 'Filler nozzle #3 intermittent drip — needs PM check', severity: 'AMBER' },
    { id: 'oi2', description: 'CCP-02 hold time trending low — monitor closely', severity: 'RED' },
  ],
  events: [
    { id: 'ev1', time: '06:00', type: 'production', description: 'Run RUN-2026-0411 started — Premium OJ 1L' },
    { id: 'ev2', time: '07:15', type: 'quality', description: 'CCP check passed — all parameters nominal' },
    { id: 'ev3', time: '08:30', type: 'maintenance', description: 'Filler nozzle #3 drip reported — work order raised' },
    { id: 'ev4', time: '09:00', type: 'production', description: 'Run paused — carton blank replenishment' },
    { id: 'ev5', time: '09:12', type: 'production', description: 'Run resumed' },
    { id: 'ev6', time: '10:05', type: 'quality', description: 'SPC Rule 1 violation at subgroup 19 — corrective action taken' },
    { id: 'ev7', time: '10:12', type: 'quality', description: 'CCP-02 hold time alert — approaching lower limit' },
    { id: 'ev8', time: '10:30', type: 'safety', description: 'Safety walk completed — no issues found' },
  ],
};

// ==================== ANDON ====================
export const andonCalls: AndonCall[] = [
  { id: 'an1', type: 'MATERIAL', status: 'RESOLVED', raisedAt: '09:00', slaMinutes: 10, elapsedMinutes: 8, description: 'Carton blanks needed at filler station', line: 'Line 3', station: 'Filler' },
  { id: 'an2', type: 'QUALITY', status: 'RESOLVED', raisedAt: '08:15', slaMinutes: 5, elapsedMinutes: 4, description: 'Fill volume out of spec on lane 2', line: 'Line 3', station: 'Filler' },
  { id: 'an3', type: 'EQUIPMENT', status: 'RESOLVED', raisedAt: '07:30', slaMinutes: 15, elapsedMinutes: 12, description: 'Conveyor belt slipping at packing station', line: 'Line 3', station: 'Packing' },
];
