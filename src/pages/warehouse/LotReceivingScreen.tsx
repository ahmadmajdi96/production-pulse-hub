import { useState } from "react";
import { ScanLine, Check, XCircle, Thermometer, FileCheck, AlertTriangle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { inboundLots, type InboundLot } from "@/data/warehouseMockData";
import { toast } from "sonner";

const statusConfig: Record<string, { label: string; color: string }> = {
  PENDING_QA: { label: 'Pending QA', color: 'bg-status-monitor text-background' },
  QA_PASS: { label: 'QA Pass', color: 'bg-status-running text-background' },
  QA_FAIL: { label: 'QA Fail', color: 'bg-status-critical text-background' },
  RELEASED: { label: 'Released', color: 'bg-primary text-primary-foreground' },
  ON_HOLD: { label: 'On Hold', color: 'bg-status-warning text-background' },
};

export default function LotReceivingScreen() {
  const [lots, setLots] = useState(inboundLots);
  const [selectedLot, setSelectedLot] = useState<InboundLot | null>(null);

  const handleRelease = (lotId: string) => {
    setLots(prev => prev.map(l => l.id === lotId ? { ...l, status: 'RELEASED' as const } : l));
    setSelectedLot(null);
    toast.success('Lot released to warehouse');
  };

  const handleHold = (lotId: string) => {
    setLots(prev => prev.map(l => l.id === lotId ? { ...l, status: 'ON_HOLD' as const } : l));
    setSelectedLot(null);
    toast.warning('Lot placed on hold');
  };

  if (selectedLot) {
    const lot = lots.find(l => l.id === selectedLot.id)!;
    const sc = statusConfig[lot.status];
    return (
      <div className="space-y-4">
        <button onClick={() => setSelectedLot(null)} className="text-sm text-primary flex items-center gap-1">← Back to list</button>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">{lot.material}</h1>
          <span className={cn("text-[10px] font-bold px-2 py-1 rounded", sc.color)}>{sc.label}</span>
        </div>
        <div className="rounded-lg bg-muted p-3 text-sm space-y-1">
          <div className="flex justify-between"><span className="text-muted-foreground">PO</span><span className="font-mono text-foreground">{lot.poNumber}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Supplier</span><span className="text-foreground">{lot.supplier}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Lot #</span><span className="font-mono text-foreground">{lot.lotNumber}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Quantity</span><span className="font-mono text-foreground">{lot.quantity} {lot.unit}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Expiry</span><span className="font-mono text-foreground">{lot.expiryDate}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Received</span><span className="font-mono text-foreground">{lot.receivedAt}</span></div>
        </div>

        {/* Checks */}
        <div className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Receiving Checks</h2>
          {lot.temperature !== undefined && (
            <div className={cn("flex items-center gap-3 rounded-lg border p-3", lot.temperatureOk ? "border-status-running/20" : "border-status-critical/40")}>
              <Thermometer className={cn("h-5 w-5", lot.temperatureOk ? "text-status-running" : "text-status-critical")} />
              <div className="flex-1">
                <p className="text-sm text-foreground">Temperature</p>
                <p className="font-mono text-lg font-bold">{lot.temperature}°C</p>
              </div>
              {lot.temperatureOk
                ? <Check className="h-5 w-5 text-status-running" />
                : <AlertTriangle className="h-5 w-5 text-status-critical" />}
            </div>
          )}
          <div className={cn("flex items-center gap-3 rounded-lg border p-3", lot.coaReceived ? "border-status-running/20" : "border-status-warning/30")}>
            <FileCheck className={cn("h-5 w-5", lot.coaReceived ? "text-status-running" : "text-status-warning")} />
            <div className="flex-1">
              <p className="text-sm text-foreground">Certificate of Analysis</p>
              <p className="text-xs text-muted-foreground">{lot.coaReceived ? 'Received & attached' : 'Not received'}</p>
            </div>
            {lot.coaReceived ? <Check className="h-5 w-5 text-status-running" /> : <XCircle className="h-5 w-5 text-status-warning" />}
          </div>
        </div>

        {lot.inspectionNotes && (
          <div className="rounded-lg bg-muted p-3">
            <p className="text-xs text-muted-foreground mb-1">Notes</p>
            <p className="text-sm text-foreground">{lot.inspectionNotes}</p>
          </div>
        )}

        {lot.status === 'PENDING_QA' || lot.status === 'QA_PASS' ? (
          <div className="grid grid-cols-2 gap-3">
            <Button className="h-12 bg-status-running hover:bg-status-running/90 text-background" onClick={() => handleRelease(lot.id)}>
              <Check className="h-4 w-4 mr-1" /> Release
            </Button>
            <Button variant="outline" className="h-12 border-status-warning text-status-warning hover:bg-status-warning/10" onClick={() => handleHold(lot.id)}>
              <AlertTriangle className="h-4 w-4 mr-1" /> Hold
            </Button>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Goods Receiving</h1>
          <p className="text-sm text-muted-foreground">Inbound lots · {lots.length} deliveries today</p>
        </div>
        <Button variant="outline" size="sm" className="gap-1">
          <ScanLine className="h-4 w-4" /> Scan
        </Button>
      </div>

      <div className="space-y-2">
        {lots.map(lot => {
          const sc = statusConfig[lot.status];
          return (
            <div
              key={lot.id}
              onClick={() => setSelectedLot(lot)}
              className={cn(
                "data-card p-3 cursor-pointer hover:border-primary/30 transition-all",
                lot.status === 'ON_HOLD' && "border-status-warning/40"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-foreground">{lot.material}</span>
                    <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded", sc.color)}>{sc.label}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-mono">{lot.poNumber} · {lot.supplier}</p>
                  <div className="flex gap-4 mt-1 text-[10px] text-muted-foreground">
                    <span>Lot: <span className="font-mono text-foreground">{lot.lotNumber}</span></span>
                    <span>Qty: <span className="font-mono text-foreground">{lot.quantity} {lot.unit}</span></span>
                    <span>Exp: <span className="font-mono text-foreground">{lot.expiryDate}</span></span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
