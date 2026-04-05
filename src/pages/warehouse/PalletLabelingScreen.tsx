import { useState } from "react";
import { Tag, Printer, MapPin, Check, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { pallets } from "@/data/warehouseMockData";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  LABELLED: 'text-status-running',
  UNLABELLED: 'text-status-warning',
  IN_TRANSIT: 'text-primary',
  STORED: 'text-muted-foreground',
};

export default function PalletLabelingScreen() {
  const [palletList, setPalletList] = useState(pallets);

  const handlePrint = (palletId: string) => {
    setPalletList(prev => prev.map(p =>
      p.id === palletId ? { ...p, labelPrinted: true, status: 'LABELLED' as const } : p
    ));
    toast.success('Label sent to printer');
  };

  const handleAssignLocation = (palletId: string) => {
    const locations = ['A-03-04', 'B-02-01', 'C-COLD-02', 'D-DRY-01'];
    const loc = locations[Math.floor(Math.random() * locations.length)];
    setPalletList(prev => prev.map(p =>
      p.id === palletId ? { ...p, location: loc, status: 'STORED' as const } : p
    ));
    toast.success(`Assigned to ${loc}`);
  };

  const unlabelled = palletList.filter(p => !p.labelPrinted).length;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Pallet Labeling</h1>
        <p className="text-sm text-muted-foreground">
          {palletList.length} pallets · {unlabelled > 0 && <span className="text-status-warning font-bold">{unlabelled} unlabelled</span>}
        </p>
      </div>

      <div className="space-y-2">
        {palletList.map(p => (
          <div key={p.id} className={cn(
            "data-card p-3",
            !p.labelPrinted && "border-status-warning/40"
          )}>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted shrink-0">
                <Package className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-semibold text-foreground">{p.material}</span>
                  <span className={cn("text-[10px] font-bold uppercase", statusColors[p.status])}>{p.status}</span>
                </div>
                <p className="text-[10px] text-muted-foreground font-mono">{p.id} · SSCC: ...{p.sscc.slice(-8)}</p>
                <div className="flex gap-4 mt-1 text-[10px] text-muted-foreground">
                  <span>Qty: <span className="font-mono text-foreground">{p.quantity} {p.unit}</span></span>
                  <span>Weight: <span className="font-mono text-foreground">{p.weight} kg</span></span>
                  <span>Exp: <span className="font-mono text-foreground">{p.expiryDate}</span></span>
                </div>
                {p.location && (
                  <div className="flex items-center gap-1 mt-1 text-[10px]">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="font-mono text-foreground">{p.location}</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1.5 shrink-0">
                {!p.labelPrinted && (
                  <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1 border-status-warning text-status-warning hover:bg-status-warning/10"
                    onClick={() => handlePrint(p.id)}>
                    <Printer className="h-3 w-3" /> Print
                  </Button>
                )}
                {p.labelPrinted && !p.location && (
                  <Button size="sm" className="h-7 text-[10px] gap-1"
                    onClick={() => handleAssignLocation(p.id)}>
                    <MapPin className="h-3 w-3" /> Assign
                  </Button>
                )}
                {p.labelPrinted && p.location && (
                  <Check className="h-5 w-5 text-status-running" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
