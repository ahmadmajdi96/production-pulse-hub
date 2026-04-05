import { useState } from "react";
import { ArrowLeft, ScanLine, ArrowRightLeft, CheckCircle2, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface WIPBatch {
  id: string;
  product: string;
  currentStage: string;
  nextStage: string;
  location: string;
  holdTimeMax: number;
  holdTimeElapsed: number;
}

const stages = ['Mixing', 'Pasteurizing', 'Cooling', 'Filling', 'Packaging', 'Palletizing'];

export default function WIPMovementScreen() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [scanned, setScanned] = useState<WIPBatch | null>(null);
  const [moved, setMoved] = useState(false);

  const handleScan = () => {
    setScanned({
      id: 'WIP-2026-0405-003',
      product: 'Premium Orange Juice 1L',
      currentStage: 'Cooling',
      nextStage: 'Filling',
      location: 'Cooling Tank CT-2',
      holdTimeMax: 120,
      holdTimeElapsed: 85,
    });
    setMoved(false);
  };

  const handleMove = () => {
    if (!scanned) return;
    setScanned(prev => prev ? { ...prev, currentStage: prev.nextStage, location: 'Filler Line 3' } : null);
    setMoved(true);
    toast({ title: 'Batch moved', description: `${scanned.id} → ${scanned.nextStage}` });
  };

  const holdWarning = scanned && scanned.holdTimeElapsed > scanned.holdTimeMax * 0.8;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/warehouse')} className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
          <ArrowLeft className="h-4 w-4 text-foreground" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-foreground">WIP Batch Movement</h1>
          <p className="text-[10px] text-muted-foreground">Scan to advance WIP through stages</p>
        </div>
      </div>

      {/* Scan prompt */}
      {!scanned && (
        <div className="data-card p-8 text-center">
          <ScanLine className="h-12 w-12 mx-auto mb-3 text-primary animate-pulse" />
          <p className="text-sm text-foreground font-medium mb-4">Scan WIP Batch Barcode</p>
          <button onClick={handleScan} className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground">
            Simulate Scan
          </button>
        </div>
      )}

      {scanned && (
        <>
          {/* Batch info */}
          <div className="data-card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-foreground">{scanned.product}</h2>
              <span className="rounded-full bg-primary/20 px-3 py-0.5 text-[10px] font-bold text-primary">{scanned.id}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] text-muted-foreground">Current Stage</p>
                <p className="text-xs font-bold text-foreground">{scanned.currentStage}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Location</p>
                <p className="text-xs font-bold text-foreground">{scanned.location}</p>
              </div>
            </div>

            {holdWarning && !moved && (
              <div className="flex items-center gap-2 rounded-lg bg-status-warning/10 border border-status-warning/30 px-3 py-2">
                <AlertTriangle className="h-4 w-4 text-status-warning shrink-0" />
                <p className="text-[10px] text-status-warning">
                  Hold time {scanned.holdTimeElapsed}m / {scanned.holdTimeMax}m — approaching max
                </p>
              </div>
            )}
          </div>

          {/* Stage flow */}
          <div className="data-card p-3">
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Production Flow</h3>
            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              {stages.map((s, i) => {
                const isCurrent = s === scanned.currentStage;
                const isPast = stages.indexOf(s) < stages.indexOf(scanned.currentStage);
                return (
                  <div key={s} className="flex items-center gap-1">
                    <div className={cn("rounded-full px-2 py-1 text-[10px] font-medium whitespace-nowrap",
                      isCurrent ? 'bg-primary text-primary-foreground' :
                      isPast ? 'bg-status-running/20 text-status-running' :
                      'bg-muted text-muted-foreground'
                    )}>{s}</div>
                    {i < stages.length - 1 && <span className="text-muted-foreground text-[10px]">→</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Move action */}
          {!moved ? (
            <button onClick={handleMove} className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground">
              <ArrowRightLeft className="h-4 w-4" /> Move to {scanned.nextStage}
            </button>
          ) : (
            <div className="rounded-xl bg-status-running/10 border border-status-running/30 p-4 text-center">
              <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-status-running" />
              <p className="text-sm font-bold text-status-running">Batch Moved Successfully</p>
              <button onClick={() => { setScanned(null); setMoved(false); }}
                className="mt-3 rounded-lg bg-muted px-4 py-2 text-xs font-medium text-foreground">
                Scan Next Batch
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
