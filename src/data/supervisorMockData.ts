// ==================== EA2: SUPERVISOR MOBILE APP MOCK DATA ====================

export type LineStatus = 'RUNNING' | 'IDLE' | 'TRANSITION' | 'CIP' | 'DOWN' | 'ALERT';
export type ScheduleStatus = 'ON-TRACK' | 'DELAYED' | 'AT-RISK' | 'COMPLETED';
export type CheckStatus = 'PASSED' | 'FAILED' | 'PENDING' | 'NOT-APPLICABLE';
export type QualificationStatus = 'QUALIFIED' | 'NOT-QUALIFIED' | 'EXPIRING';
export type BOMStatus = 'AVAILABLE' | 'EXPIRING' | 'ON-HOLD' | 'INSUFFICIENT';
export type AllergenRisk = 'LOW' | 'MEDIUM' | 'HIGH';

export interface SupervisorLine {
  id: string;
  name: string;
  currentProduct: string;
  status: LineStatus;
  oee: number;
  throughputTarget: number;
  throughputActual: number;
  throughputTrend: 'up' | 'down' | 'stable';
  activeAlertCount: number;
  runId: string | null;
}

export interface SupervisorAlert {
  id: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  message: string;
  line: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface ShiftMetrics {
  totalUnitsProduced: number;
  oeeAverage: number;
  wasteEvents: number;
  ncrsRaised: number;
  lastWeekUnits: number;
  lastWeekOee: number;
}

export interface UpcomingAction {
  id: string;
  type: 'run_start' | 'cip_window' | 'maintenance';
  description: string;
  scheduledTime: string;
  preStartComplete: boolean;
}

export interface ScheduledRun {
  id: string;
  product: string;
  sku: string;
  line: string;
  plannedStart: string;
  plannedDuration: string;
  targetQuantity: number;
  status: ScheduleStatus;
  recipeVersion: string;
}

export interface WizardProduct {
  id: string;
  name: string;
  sku: string;
  targetQuantity: number;
  recipeVersion: string;
  estimatedDuration: string;
  line: string;
}

export interface LabelValidation {
  status: CheckStatus;
  details?: string;
}

export interface CIPVerification {
  status: 'VERIFIED' | 'REQUIRED' | 'NOT-APPLICABLE';
  lastCycleDate?: string;
  lastCycleType?: string;
}

export interface AllergenCheck {
  riskLevel: AllergenRisk;
  cleanDownRequired: boolean;
  cleanDownStatus: 'COMPLETED' | 'PENDING' | 'NOT-REQUIRED';
}

export interface BOMItem {
  ingredient: string;
  lotCode: string;
  quantityAvailable: number;
  quantityRequired: number;
  unit: string;
  expiryDate: string;
  status: BOMStatus;
}

export interface AssignableOperator {
  id: string;
  name: string;
  role: string;
  qualification: QualificationStatus;
  qualificationExpiry?: string;
}

// ==================== NEW: Run Detail ====================
export interface RunDetail {
  runId: string;
  product: string;
  sku: string;
  line: string;
  status: 'RUNNING' | 'PAUSED';
  oee: number;
  throughputTarget: number;
  throughputActual: number;
  elapsedTime: string;
  unitsProduced: number;
  costPerUnit: number;
  costPerUnitTarget: number;
  qualityTrend: { time: string; brix: number; ph: number; temp: number }[];
  wasteEvents: { id: string; type: string; volumeKg: number; timestamp: string }[];
  wasteTotalKg: number;
}

// ==================== NEW: Transition Manager ====================
export interface TransitionParam {
  label: string;
  outgoingValue: number;
  incomingTarget: number;
  currentValue: number;
  unit: string;
  inSpec: boolean;
  consecutiveOnSpec: number;
}

export interface SupervisorTransition {
  outgoingProduct: string;
  incomingProduct: string;
  switchRecommended: boolean;
  recommendationBasis: string;
  params: TransitionParam[];
  allergenCleanDown: { required: boolean; steps: { id: string; description: string; completed: boolean }[] };
}

// ==================== NEW: NCR Quick-Create ====================
export type NCRSeverity = 'HIGH' | 'MEDIUM' | 'LOW';
export type NCRType = 'process' | 'product' | 'equipment';

// ==================== NEW: Shift Logbook ====================
export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'observation' | 'instruction' | 'visitor' | 'safety' | 'equipment' | 'quality' | 'auto_downtime' | 'auto_alert' | 'auto_ncr';
  description: string;
  author: string;
  isAutomatic: boolean;
  linkedRecord?: string;
}

// ==================== LINE STATUS CARDS ====================
export const supervisorLines: SupervisorLine[] = [
  { id: 'line-1', name: 'Line 1', currentProduct: 'Whole Milk 2L', status: 'RUNNING', oee: 91.3, throughputTarget: 520, throughputActual: 508, throughputTrend: 'stable', activeAlertCount: 0, runId: 'RUN-2026-0408' },
  { id: 'line-2', name: 'Line 2', currentProduct: 'Greek Yoghurt 500g', status: 'TRANSITION', oee: 78.5, throughputTarget: 360, throughputActual: 0, throughputTrend: 'down', activeAlertCount: 1, runId: 'RUN-2026-0410' },
  { id: 'line-3', name: 'Line 3', currentProduct: 'Premium Orange Juice 1L', status: 'RUNNING', oee: 87.2, throughputTarget: 480, throughputActual: 462, throughputTrend: 'up', activeAlertCount: 1, runId: 'RUN-2026-0412' },
  { id: 'line-4', name: 'Line 4', currentProduct: '—', status: 'CIP', oee: 0, throughputTarget: 0, throughputActual: 0, throughputTrend: 'stable', activeAlertCount: 0, runId: null },
  { id: 'line-5', name: 'Line 5', currentProduct: 'Apple & Mango Blend 1L', status: 'DOWN', oee: 0, throughputTarget: 400, throughputActual: 0, throughputTrend: 'down', activeAlertCount: 2, runId: 'RUN-2026-0413' },
];

export const supervisorAlerts: SupervisorAlert[] = [
  { id: 'sa1', severity: 'HIGH', message: 'Line 3: CCP-02 hold time approaching lower limit (15.2s / 15.0s min)', line: 'Line 3', timestamp: '10:12', acknowledged: false },
  { id: 'sa2', severity: 'CRITICAL', message: 'Line 5: Conveyor belt motor fault — line stopped', line: 'Line 5', timestamp: '09:58', acknowledged: false },
  { id: 'sa3', severity: 'HIGH', message: 'Line 5: Downstream packing accumulation full', line: 'Line 5', timestamp: '09:59', acknowledged: false },
  { id: 'sa4', severity: 'MEDIUM', message: 'Line 2: Transition in progress — monitor quality parameters', line: 'Line 2', timestamp: '10:05', acknowledged: true },
];

export const shiftMetrics: ShiftMetrics = {
  totalUnitsProduced: 8420, oeeAverage: 85.7, wasteEvents: 3, ncrsRaised: 1, lastWeekUnits: 7890, lastWeekOee: 83.2,
};

export const upcomingActions: UpcomingAction[] = [
  { id: 'ua1', type: 'run_start', description: 'Apple & Mango Blend 1L — Line 2', scheduledTime: '11:00', preStartComplete: false },
  { id: 'ua2', type: 'cip_window', description: 'CIP cycle due — Line 1', scheduledTime: '12:30', preStartComplete: true },
  { id: 'ua3', type: 'maintenance', description: 'PM-0234: Filler nozzle inspection — Line 3', scheduledTime: '11:45', preStartComplete: true },
  { id: 'ua4', type: 'run_start', description: 'Skimmed Milk 1L — Line 4', scheduledTime: '13:00', preStartComplete: false },
];

export const scheduledRuns: ScheduledRun[] = [
  { id: 'sr1', product: 'Whole Milk 2L', sku: 'WM-2000', line: 'Line 1', plannedStart: '06:00', plannedDuration: '6h 00m', targetQuantity: 5200, status: 'ON-TRACK', recipeVersion: 'v3.2' },
  { id: 'sr2', product: 'Premium Orange Juice 1L', sku: 'OJ-PREM-1000', line: 'Line 3', plannedStart: '06:00', plannedDuration: '8h 00m', targetQuantity: 3840, status: 'ON-TRACK', recipeVersion: 'v2.1' },
  { id: 'sr3', product: 'Apple & Mango Blend 1L', sku: 'AM-BLEND-1000', line: 'Line 2', plannedStart: '11:00', plannedDuration: '5h 00m', targetQuantity: 2400, status: 'DELAYED', recipeVersion: 'v1.4' },
  { id: 'sr4', product: 'Skimmed Milk 1L', sku: 'SM-1000', line: 'Line 4', plannedStart: '13:00', plannedDuration: '5h 30m', targetQuantity: 2800, status: 'AT-RISK', recipeVersion: 'v4.0' },
  { id: 'sr5', product: 'Vanilla Yoghurt 150g', sku: 'VY-150', line: 'Line 2', plannedStart: '16:30', plannedDuration: '4h 00m', targetQuantity: 6000, status: 'ON-TRACK', recipeVersion: 'v2.0' },
  { id: 'sr6', product: 'Whole Milk 2L', sku: 'WM-2000', line: 'Line 1', plannedStart: '13:00', plannedDuration: '5h 00m', targetQuantity: 4200, status: 'ON-TRACK', recipeVersion: 'v3.2' },
];

export const wizardProducts: WizardProduct[] = [
  { id: 'wp1', name: 'Apple & Mango Blend 1L', sku: 'AM-BLEND-1000', targetQuantity: 2400, recipeVersion: 'v1.4', estimatedDuration: '5h 00m', line: 'Line 2' },
  { id: 'wp2', name: 'Skimmed Milk 1L', sku: 'SM-1000', targetQuantity: 2800, recipeVersion: 'v4.0', estimatedDuration: '5h 30m', line: 'Line 4' },
];

export const labelValidation: LabelValidation = { status: 'PASSED' };

export const cipVerification: CIPVerification = {
  status: 'VERIFIED', lastCycleDate: '2026-04-05 05:30', lastCycleType: 'Full CIP (Caustic + Acid)',
};

export const allergenCheck: AllergenCheck = {
  riskLevel: 'LOW', cleanDownRequired: false, cleanDownStatus: 'NOT-REQUIRED',
};

export const bomItems: BOMItem[] = [
  { ingredient: 'Apple Juice Concentrate', lotCode: 'AJC-20260401-A', quantityAvailable: 1200, quantityRequired: 800, unit: 'L', expiryDate: '2026-06-15', status: 'AVAILABLE' },
  { ingredient: 'Mango Puree', lotCode: 'MP-20260328-B', quantityAvailable: 400, quantityRequired: 350, unit: 'L', expiryDate: '2026-05-10', status: 'EXPIRING' },
  { ingredient: 'Citric Acid', lotCode: 'CA-20260315-C', quantityAvailable: 50, quantityRequired: 12, unit: 'kg', expiryDate: '2027-03-15', status: 'AVAILABLE' },
  { ingredient: 'Ascorbic Acid', lotCode: 'AA-20260320-A', quantityAvailable: 25, quantityRequired: 5, unit: 'kg', expiryDate: '2027-01-20', status: 'AVAILABLE' },
  { ingredient: 'Carton Blanks (1L)', lotCode: 'CB-20260403-D', quantityAvailable: 2800, quantityRequired: 2400, unit: 'pcs', expiryDate: 'N/A', status: 'AVAILABLE' },
];

export const assignableOperators: AssignableOperator[] = [
  { id: 'ao1', name: 'Maria Santos', role: 'Line Operator', qualification: 'QUALIFIED' },
  { id: 'ao2', name: 'James Chen', role: 'Filler Operator', qualification: 'QUALIFIED' },
  { id: 'ao3', name: 'Aisha Patel', role: 'QC Technician', qualification: 'QUALIFIED' },
  { id: 'ao4', name: 'Tom Wright', role: 'Packaging', qualification: 'QUALIFIED' },
  { id: 'ao5', name: 'David Kim', role: 'Line Operator', qualification: 'EXPIRING', qualificationExpiry: '2026-04-12' },
  { id: 'ao6', name: 'Sarah Jones', role: 'Filler Operator', qualification: 'NOT-QUALIFIED' },
];

// ==================== RUN DETAIL DATA ====================
export const runDetailData: RunDetail = {
  runId: 'RUN-2026-0412',
  product: 'Premium Orange Juice 1L',
  sku: 'OJ-PREM-1000',
  line: 'Line 3',
  status: 'RUNNING',
  oee: 87.2,
  throughputTarget: 480,
  throughputActual: 462,
  elapsedTime: '4h 07m',
  unitsProduced: 1892,
  costPerUnit: 0.83,
  costPerUnitTarget: 0.80,
  qualityTrend: Array.from({ length: 12 }, (_, i) => ({
    time: `${String(6 + Math.floor(i * 20 / 60)).padStart(2, '0')}:${String((i * 20) % 60).padStart(2, '0')}`,
    brix: 11.5 + (Math.sin(i * 0.5) * 0.15) + (Math.random() - 0.5) * 0.08,
    ph: 3.70 + (Math.sin(i * 0.3) * 0.05) + (Math.random() - 0.5) * 0.03,
    temp: 4.0 + (Math.sin(i * 0.4) * 0.3) + (Math.random() - 0.5) * 0.15,
  })),
  wasteEvents: [
    { id: 'we1', type: 'Start-up waste', volumeKg: 4.2, timestamp: '06:08' },
    { id: 'we2', type: 'Fill overshoot', volumeKg: 1.8, timestamp: '07:34' },
    { id: 'we3', type: 'Label misprint', volumeKg: 0.9, timestamp: '08:52' },
    { id: 'we4', type: 'Carton jam', volumeKg: 3.1, timestamp: '09:15' },
    { id: 'we5', type: 'SPC adjustment', volumeKg: 2.4, timestamp: '10:06' },
  ],
  wasteTotalKg: 12.4,
};

// ==================== TRANSITION DATA ====================
export const supervisorTransition: SupervisorTransition = {
  outgoingProduct: 'Greek Yoghurt 500g',
  incomingProduct: 'Apple & Mango Blend 1L',
  switchRecommended: true,
  recommendationBasis: '5 consecutive on-spec readings for Brix, pH, Color',
  params: [
    { label: 'Brix', outgoingValue: 14.2, incomingTarget: 12.8, currentValue: 12.9, unit: '°Bx', inSpec: true, consecutiveOnSpec: 5 },
    { label: 'pH', outgoingValue: 4.10, incomingTarget: 3.55, currentValue: 3.57, unit: '', inSpec: true, consecutiveOnSpec: 5 },
    { label: 'Color', outgoingValue: 12, incomingTarget: 18, currentValue: 17.5, unit: 'CU', inSpec: true, consecutiveOnSpec: 5 },
    { label: 'Viscosity', outgoingValue: 4.8, incomingTarget: 2.8, currentValue: 3.0, unit: 'cP', inSpec: false, consecutiveOnSpec: 3 },
  ],
  allergenCleanDown: {
    required: false,
    steps: [],
  },
};

// ==================== SHIFT LOGBOOK DATA ====================
export const shiftLogEntries: LogEntry[] = [
  { id: 'log1', timestamp: '06:00', type: 'auto_downtime', description: 'Shift started — Day Shift A, Crew Alpha', author: 'System', isAutomatic: true },
  { id: 'log2', timestamp: '06:05', type: 'observation', description: 'All lines pre-checked and ready. Line 4 CIP scheduled for 12:30.', author: 'J. Rodriguez', isAutomatic: false },
  { id: 'log3', timestamp: '06:15', type: 'auto_alert', description: 'Run RUN-2026-0412 started — Premium OJ 1L on Line 3', author: 'System', isAutomatic: true, linkedRecord: 'RUN-2026-0412' },
  { id: 'log4', timestamp: '07:15', type: 'quality', description: 'CCP check passed — all parameters nominal across all lines', author: 'A. Patel', isAutomatic: false },
  { id: 'log5', timestamp: '08:30', type: 'equipment', description: 'Filler nozzle #3 drip reported on Line 3 — work order WO-0891 raised', author: 'J. Rodriguez', isAutomatic: false, linkedRecord: 'WO-0891' },
  { id: 'log6', timestamp: '09:00', type: 'auto_downtime', description: 'Line 3 paused — carton blank replenishment (12 min)', author: 'System', isAutomatic: true },
  { id: 'log7', timestamp: '09:12', type: 'auto_downtime', description: 'Line 3 resumed', author: 'System', isAutomatic: true },
  { id: 'log8', timestamp: '09:30', type: 'visitor', description: 'QA auditor (external) arrived — GFSI surveillance visit. Escorted to Line 1.', author: 'J. Rodriguez', isAutomatic: false },
  { id: 'log9', timestamp: '09:58', type: 'auto_alert', description: 'CRITICAL: Line 5 conveyor belt motor fault — line stopped', author: 'System', isAutomatic: true, linkedRecord: 'ALERT-SA2' },
  { id: 'log10', timestamp: '10:05', type: 'quality', description: 'SPC Rule 1 violation at subgroup 19 on Line 3 — corrective action taken, adjusted filler head pressure', author: 'A. Patel', isAutomatic: false },
  { id: 'log11', timestamp: '10:12', type: 'auto_alert', description: 'HIGH: CCP-02 hold time approaching lower limit on Line 3', author: 'System', isAutomatic: true, linkedRecord: 'ALERT-SA1' },
  { id: 'log12', timestamp: '10:20', type: 'instruction', description: 'Verbal instruction from Plant Manager: prioritize Line 5 repair, defer Line 4 CIP if needed', author: 'J. Rodriguez', isAutomatic: false },
  { id: 'log13', timestamp: '10:30', type: 'safety', description: 'Safety walk completed — no issues found. Fire extinguisher check OK.', author: 'J. Rodriguez', isAutomatic: false },
  { id: 'log14', timestamp: '10:45', type: 'auto_ncr', description: 'NCR-2026-047 raised — process deviation on Line 3 SPC violation', author: 'System', isAutomatic: true, linkedRecord: 'NCR-2026-047' },
];
