// ==================== EA4: GOODS RECEIVING / WAREHOUSE HANDHELD APP ====================

export type LotStatus = 'PENDING_QA' | 'QA_PASS' | 'QA_FAIL' | 'RELEASED' | 'ON_HOLD';
export type PalletStatus = 'LABELLED' | 'UNLABELLED' | 'IN_TRANSIT' | 'STORED';
export type FEFOCompliance = 'COMPLIANT' | 'AT_RISK' | 'NON_COMPLIANT';

export interface InboundLot {
  id: string;
  poNumber: string;
  supplier: string;
  material: string;
  materialCode: string;
  quantity: number;
  unit: string;
  lotNumber: string;
  expiryDate: string;
  receivedAt: string;
  status: LotStatus;
  temperature?: number;
  temperatureOk?: boolean;
  coaReceived: boolean;
  inspectionNotes: string;
}

export interface Pallet {
  id: string;
  sscc: string;
  lotId: string;
  material: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  location: string;
  status: PalletStatus;
  labelPrinted: boolean;
  weight: number;
}

export interface FEFOItem {
  id: string;
  material: string;
  materialCode: string;
  location: string;
  lotNumber: string;
  expiryDate: string;
  daysToExpiry: number;
  quantity: number;
  unit: string;
  compliance: FEFOCompliance;
  suggestedAction: string;
}

// ==================== INBOUND LOTS ====================
export const inboundLots: InboundLot[] = [
  {
    id: 'LOT-001', poNumber: 'PO-2026-4412', supplier: 'FreshCo Ingredients', material: 'Orange Concentrate',
    materialCode: 'RM-OC-500', quantity: 2400, unit: 'kg', lotNumber: 'FC-26-08821',
    expiryDate: '2026-10-15', receivedAt: '09:12', status: 'PENDING_QA',
    temperature: 4.2, temperatureOk: true, coaReceived: true, inspectionNotes: '',
  },
  {
    id: 'LOT-002', poNumber: 'PO-2026-4413', supplier: 'PackRight Ltd', material: 'Tetra Pak Cartons (1L)',
    materialCode: 'PM-TP-1L', quantity: 15000, unit: 'pcs', lotNumber: 'PR-26-33104',
    expiryDate: '2028-06-01', receivedAt: '09:45', status: 'RELEASED',
    coaReceived: true, inspectionNotes: '',
  },
  {
    id: 'LOT-003', poNumber: 'PO-2026-4410', supplier: 'ChemSupply AG', material: 'Citric Acid (Food Grade)',
    materialCode: 'RM-CA-25', quantity: 500, unit: 'kg', lotNumber: 'CS-26-7790',
    expiryDate: '2027-03-20', receivedAt: '08:30', status: 'QA_PASS',
    coaReceived: true, inspectionNotes: 'Passed pH and purity checks.',
  },
  {
    id: 'LOT-004', poNumber: 'PO-2026-4414', supplier: 'DairyFresh Inc', material: 'Cream (40% fat)',
    materialCode: 'RM-CR-40', quantity: 800, unit: 'L', lotNumber: 'DF-26-1155',
    expiryDate: '2026-04-12', receivedAt: '10:05', status: 'ON_HOLD',
    temperature: 7.8, temperatureOk: false, coaReceived: false, inspectionNotes: 'Temperature excursion — above 6°C threshold.',
  },
];

// ==================== PALLETS ====================
export const pallets: Pallet[] = [
  { id: 'PAL-001', sscc: '00312345678901234567', lotId: 'LOT-001', material: 'Orange Concentrate', quantity: 600, unit: 'kg', expiryDate: '2026-10-15', location: 'A-03-02', status: 'LABELLED', labelPrinted: true, weight: 625 },
  { id: 'PAL-002', sscc: '00312345678901234568', lotId: 'LOT-001', material: 'Orange Concentrate', quantity: 600, unit: 'kg', expiryDate: '2026-10-15', location: 'A-03-03', status: 'LABELLED', labelPrinted: true, weight: 623 },
  { id: 'PAL-003', sscc: '00312345678901234569', lotId: 'LOT-001', material: 'Orange Concentrate', quantity: 600, unit: 'kg', expiryDate: '2026-10-15', location: '', status: 'UNLABELLED', labelPrinted: false, weight: 620 },
  { id: 'PAL-004', sscc: '00312345678901234570', lotId: 'LOT-002', material: 'Tetra Pak Cartons (1L)', quantity: 5000, unit: 'pcs', expiryDate: '2028-06-01', location: 'B-01-01', status: 'STORED', labelPrinted: true, weight: 310 },
  { id: 'PAL-005', sscc: '00312345678901234571', lotId: 'LOT-004', material: 'Cream (40% fat)', quantity: 400, unit: 'L', expiryDate: '2026-04-12', location: 'C-COLD-01', status: 'IN_TRANSIT', labelPrinted: true, weight: 430 },
];

// ==================== FEFO ITEMS ====================
export const fefoItems: FEFOItem[] = [
  { id: 'FEFO-001', material: 'Cream (40% fat)', materialCode: 'RM-CR-40', location: 'C-COLD-01', lotNumber: 'DF-26-1155', expiryDate: '2026-04-12', daysToExpiry: 7, quantity: 400, unit: 'L', compliance: 'AT_RISK', suggestedAction: 'Prioritise for next production run' },
  { id: 'FEFO-002', material: 'Strawberry Puree', materialCode: 'RM-SP-10', location: 'C-COLD-03', lotNumber: 'BP-26-4401', expiryDate: '2026-04-08', daysToExpiry: 3, quantity: 200, unit: 'kg', compliance: 'NON_COMPLIANT', suggestedAction: 'Escalate to QA — nearing expiry' },
  { id: 'FEFO-003', material: 'Orange Concentrate', materialCode: 'RM-OC-500', location: 'A-03-02', lotNumber: 'FC-26-08821', expiryDate: '2026-10-15', daysToExpiry: 193, quantity: 1200, unit: 'kg', compliance: 'COMPLIANT', suggestedAction: 'No action required' },
  { id: 'FEFO-004', material: 'Citric Acid (Food Grade)', materialCode: 'RM-CA-25', location: 'D-DRY-05', lotNumber: 'CS-26-7790', expiryDate: '2027-03-20', daysToExpiry: 349, quantity: 500, unit: 'kg', compliance: 'COMPLIANT', suggestedAction: 'No action required' },
  { id: 'FEFO-005', material: 'Vanilla Extract', materialCode: 'RM-VE-05', location: 'D-DRY-02', lotNumber: 'VN-25-9002', expiryDate: '2026-04-10', daysToExpiry: 5, quantity: 50, unit: 'L', compliance: 'AT_RISK', suggestedAction: 'Move to front of pick face' },
];
