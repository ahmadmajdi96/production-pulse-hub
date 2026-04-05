// ==================== EA3: MAINTENANCE TECHNICIAN APP MOCK DATA ====================

export type WOPriority = 'IMMEDIATE' | 'SCHEDULED' | 'MANUAL';
export type WOStatus = 'OPEN' | 'IN-PROGRESS' | 'AWAITING-PARTS' | 'COMPLETED';
export type CycleType = 'FULL_WASH' | 'RINSE_ONLY' | 'ALLERGEN_CLEAN' | 'SIP';
export type LOTOStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'ACTIVE' | 'REMOVING' | 'COMPLETE';

export interface WorkOrder {
  id: string;
  assetName: string;
  assetId: string;
  line: string;
  bay: string;
  type: WOPriority;
  status: WOStatus;
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  assetHealthScore: number;
  description: string;
  timeRaised: string;
  slaMinutes: number;
  slaRemaining: number;
  requiresLOTO: boolean;
  hasPTW: boolean;
}

export interface CIPCycleExec {
  type: CycleType;
  label: string;
  expectedDuration: string;
  chemicals: string;
  asset: string;
  line: string;
  steps: { name: string; status: 'completed' | 'active' | 'pending' | 'failed'; elapsed: number; duration: number; result?: 'PASS' | 'FAIL' }[];
  tact: {
    temperature: { required: number; actual: number; unit: string; inRange: boolean };
    flow: { required: number; actual: number; unit: string; inRange: boolean };
    concentration: { required: number; actual: number; unit: string; inRange: boolean };
    contactTime: { required: number; actual: number; unit: string; inRange: boolean };
  };
  outcome: 'IN_PROGRESS' | 'PASS' | 'FAIL' | 'AWAITING_QA';
}

export interface LOTOStep {
  id: string;
  sourceType: 'electrical' | 'pneumatic' | 'hydraulic' | 'thermal' | 'chemical';
  description: string;
  method: string;
  confirmed: boolean;
  photoTaken: boolean;
  notes: string;
}

export interface LOTOProcedure {
  workOrderId: string;
  equipmentName: string;
  procedureRef: string;
  revisionDate: string;
  status: LOTOStatus;
  isolationSteps: LOTOStep[];
  verificationDone: boolean;
  removalSteps: LOTOStep[];
}

// ==================== WORK ORDERS ====================
export const workOrders: WorkOrder[] = [
  {
    id: 'WO-2026-0891', assetName: 'Conveyor Belt Motor', assetId: 'AST-L5-CONV-01', line: 'Line 5', bay: 'Bay 3',
    type: 'IMMEDIATE', status: 'OPEN', priority: 'P1', assetHealthScore: 12,
    description: 'Motor fault detected — abnormal vibration pattern. Conveyor stopped. Line 5 down.',
    timeRaised: '09:58', slaMinutes: 60, slaRemaining: 28, requiresLOTO: true, hasPTW: false,
  },
  {
    id: 'WO-2026-0890', assetName: 'Filler Nozzle #3', assetId: 'AST-L3-FILL-03', line: 'Line 3', bay: 'Bay 1',
    type: 'SCHEDULED', status: 'OPEN', priority: 'P2', assetHealthScore: 58,
    description: 'Intermittent drip from nozzle #3 — scheduled inspection during next planned stop.',
    timeRaised: '08:30', slaMinutes: 240, slaRemaining: 142, requiresLOTO: false, hasPTW: false,
  },
  {
    id: 'WO-2026-0887', assetName: 'Pasteurizer Heat Exchanger', assetId: 'AST-L3-PAST-01', line: 'Line 3', bay: 'Bay 2',
    type: 'SCHEDULED', status: 'AWAITING-PARTS', priority: 'P3', assetHealthScore: 72,
    description: 'Quarterly gasket replacement — preventive maintenance. Gaskets on order.',
    timeRaised: '2026-04-03', slaMinutes: 4320, slaRemaining: 2880, requiresLOTO: true, hasPTW: false,
  },
  {
    id: 'WO-2026-0885', assetName: 'Carton Magazine Feed', assetId: 'AST-L3-MAG-01', line: 'Line 3', bay: 'Bay 4',
    type: 'MANUAL', status: 'COMPLETED', priority: 'P4', assetHealthScore: 95,
    description: 'Sensor recalibration requested by operator — occasional miscount.',
    timeRaised: '2026-04-04', slaMinutes: 1440, slaRemaining: 0, requiresLOTO: false, hasPTW: false,
  },
];

// ==================== CIP CYCLE ====================
export const cipCycleExec: CIPCycleExec = {
  type: 'FULL_WASH', label: 'Full Wash', expectedDuration: '63 min',
  chemicals: 'NaOH 2% + HNO₃ 1.5%', asset: 'Pasteurizer Unit', line: 'Line 4',
  steps: [
    { name: 'Pre-Rinse', status: 'completed', elapsed: 10, duration: 10, result: 'PASS' },
    { name: 'Caustic Wash', status: 'completed', elapsed: 20, duration: 20, result: 'PASS' },
    { name: 'Intermediate Rinse', status: 'active', elapsed: 5, duration: 8 },
    { name: 'Acid Rinse', status: 'pending', elapsed: 0, duration: 15 },
    { name: 'Final Rinse', status: 'pending', elapsed: 0, duration: 10 },
  ],
  tact: {
    temperature: { required: 80, actual: 78.5, unit: '°C', inRange: true },
    flow: { required: 200, actual: 195, unit: 'L/min', inRange: true },
    concentration: { required: 2.0, actual: 1.95, unit: '%', inRange: true },
    contactTime: { required: 8, actual: 5, unit: 'min', inRange: false },
  },
  outcome: 'IN_PROGRESS',
};

// ==================== LOTO PROCEDURE ====================
export const lotoProcedure: LOTOProcedure = {
  workOrderId: 'WO-2026-0891',
  equipmentName: 'Conveyor Belt Motor — Line 5, Bay 3',
  procedureRef: 'LOTO-PROC-CONV-01 Rev 4',
  revisionDate: '2026-01-15',
  status: 'NOT_STARTED',
  isolationSteps: [
    { id: 'ls1', sourceType: 'electrical', description: 'Main disconnect — east wall panel, breaker CB-7', method: 'Lockout', confirmed: false, photoTaken: false, notes: '' },
    { id: 'ls2', sourceType: 'electrical', description: 'VFD power supply — control cabinet, isolator SW-3', method: 'Lockout', confirmed: false, photoTaken: false, notes: '' },
    { id: 'ls3', sourceType: 'pneumatic', description: 'Air supply valve — pneumatic manifold, valve V-12', method: 'Lockout + bleed', confirmed: false, photoTaken: false, notes: '' },
    { id: 'ls4', sourceType: 'hydraulic', description: 'Hydraulic tensioner — isolation valve HV-2', method: 'Lockout + depressurize', confirmed: false, photoTaken: false, notes: '' },
  ],
  verificationDone: false,
  removalSteps: [
    { id: 'rs1', sourceType: 'electrical', description: 'Remove lock from breaker CB-7', method: 'Unlock', confirmed: false, photoTaken: false, notes: '' },
    { id: 'rs2', sourceType: 'electrical', description: 'Remove lock from isolator SW-3', method: 'Unlock', confirmed: false, photoTaken: false, notes: '' },
    { id: 'rs3', sourceType: 'pneumatic', description: 'Remove lock from valve V-12, restore air', method: 'Unlock + restore', confirmed: false, photoTaken: false, notes: '' },
    { id: 'rs4', sourceType: 'hydraulic', description: 'Remove lock from valve HV-2, restore pressure', method: 'Unlock + restore', confirmed: false, photoTaken: false, notes: '' },
  ],
};
