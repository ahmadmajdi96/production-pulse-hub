// ==================== OEE DASHBOARD MOCK DATA ====================

export interface OEEPillar {
  availability: number;
  performance: number;
  quality: number;
  oee: number;
}

export interface SixBigLoss {
  name: string;
  minutes: number;
  pillar: 'availability' | 'performance' | 'quality';
}

export interface ShiftTimelineEvent {
  start: string; // HH:mm
  end: string;
  type: 'running' | 'planned-down' | 'unplanned-down' | 'reduced-speed' | 'idle';
  reason?: string;
}

export interface TrendPoint {
  shift: string;
  availability: number;
  performance: number;
  quality: number;
  oee: number;
}

export interface LineOEE {
  line: string;
  oee: number;
  availability: number;
  performance: number;
  quality: number;
  status: string;
  topLoss: string;
}

export interface ActiveDowntimeEvent {
  id: string;
  line: string;
  equipment: string;
  reason: string;
  startedAt: string;
  durationMin: number;
  technicianWO?: string;
}

export const oeeTargets = { oee: 85, availability: 90, performance: 95, quality: 99 };

export const currentOEE: OEEPillar = {
  availability: 91.2,
  performance: 94.8,
  quality: 98.6,
  oee: 85.3,
};

export const sixBigLosses: SixBigLoss[] = [
  { name: 'Breakdowns', minutes: 42, pillar: 'availability' },
  { name: 'Setup & Adjustments', minutes: 28, pillar: 'availability' },
  { name: 'Small Stops', minutes: 18, pillar: 'performance' },
  { name: 'Reduced Speed', minutes: 14, pillar: 'performance' },
  { name: 'Startup Rejects', minutes: 8, pillar: 'quality' },
  { name: 'Production Rejects', minutes: 5, pillar: 'quality' },
];

export const shiftTimeline: ShiftTimelineEvent[] = [
  { start: '06:00', end: '06:15', type: 'idle', reason: 'Shift handover' },
  { start: '06:15', end: '07:45', type: 'running' },
  { start: '07:45', end: '08:05', type: 'planned-down', reason: 'Scheduled break' },
  { start: '08:05', end: '08:47', type: 'running' },
  { start: '08:47', end: '09:12', type: 'unplanned-down', reason: 'Conveyor belt jam' },
  { start: '09:12', end: '09:55', type: 'reduced-speed', reason: 'Post-fault ramp-up' },
  { start: '09:55', end: '10:30', type: 'running' },
  { start: '10:30', end: '10:50', type: 'planned-down', reason: 'Changeover — SKU switch' },
  { start: '10:50', end: '11:45', type: 'running' },
  { start: '11:45', end: '12:15', type: 'planned-down', reason: 'Lunch break' },
  { start: '12:15', end: '13:20', type: 'running' },
  { start: '13:20', end: '13:35', type: 'unplanned-down', reason: 'Sensor fault — filler head' },
  { start: '13:35', end: '14:00', type: 'running' },
];

export const trendHistory: TrendPoint[] = [
  { shift: 'Mon AM', availability: 88.1, performance: 93.2, quality: 99.1, oee: 81.1 },
  { shift: 'Mon PM', availability: 92.4, performance: 95.1, quality: 98.8, oee: 86.8 },
  { shift: 'Tue AM', availability: 85.6, performance: 92.8, quality: 99.0, oee: 78.6 },
  { shift: 'Tue PM', availability: 93.1, performance: 96.2, quality: 98.5, oee: 88.2 },
  { shift: 'Wed AM', availability: 90.5, performance: 94.0, quality: 99.2, oee: 84.4 },
  { shift: 'Wed PM', availability: 89.3, performance: 95.5, quality: 98.9, oee: 84.3 },
  { shift: 'Thu AM', availability: 91.2, performance: 94.8, quality: 98.6, oee: 85.3 },
];

export const perLineOEE: LineOEE[] = [
  { line: 'Line 1', oee: 87.2, availability: 92.0, performance: 96.0, quality: 98.7, status: 'RUNNING', topLoss: 'Setup' },
  { line: 'Line 2', oee: 71.4, availability: 78.0, performance: 94.0, quality: 97.3, status: 'RUNNING', topLoss: 'Breakdowns' },
  { line: 'Line 3', oee: 89.1, availability: 94.5, performance: 95.8, quality: 98.4, status: 'RUNNING', topLoss: 'Small Stops' },
  { line: 'Line 4', oee: 0, availability: 0, performance: 0, quality: 0, status: 'CIP', topLoss: '—' },
  { line: 'Line 5', oee: 82.6, availability: 88.0, performance: 95.2, quality: 98.5, status: 'RUNNING', topLoss: 'Reduced Speed' },
];

export const activeDowntime: ActiveDowntimeEvent[] = [
  { id: 'DT-001', line: 'Line 2', equipment: 'Conveyor Motor #2', reason: 'Motor overtemperature trip', startedAt: '13:20', durationMin: 25, technicianWO: 'WO-2026-0893' },
  { id: 'DT-002', line: 'Line 5', equipment: 'Label Applicator', reason: 'Label roll changeover', startedAt: '13:40', durationMin: 8 },
];
