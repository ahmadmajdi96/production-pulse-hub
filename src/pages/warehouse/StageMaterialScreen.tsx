import { useState } from "react";
import { ArrowLeft, ScanLine, CheckCircle2, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface BOMItem {
  ingredient: string;
  required: number;
  unit: string;
  staged: number;
  lotCode: string | null;
}

const bomItems: BOMItem[] = [
  { ingredient: 'Orange Juice Concentrate', required: 500, unit: 'L', staged: 0, lotCode: null },
  { ingredient: 'Citric Acid', required: 12, unit: 'kg', staged: 0, lotCode: null },
  { ingredient: 'Ascorbic Acid', required: 3, unit: 'kg', staged: 0, lotCode: null },
  { ingredient: 'Filtered Water', required: 2000, unit: 'L', staged: 2000, lotCode: 'WTR-2026-0405' },
  { ingredient: 'Sugar Syrup 65°Bx', required: 180, unit: 'L', staged: 0, lotCode: null },
];

export default function StageMaterialScreen() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [items, setItems] = useState(bomItems);

  const scanItem = (idx: number) => {
    setItems(prev => prev.map((item, i) =>
      i === idx ? { ...item, staged: item.required, lotCode: `LOT-${Date.now().toString(36).toUpperCase()}` } : item
    ));
    toast({ title: 'Scanned & staged', description: `${items[idx].ingredient} confirmed` });
  };

  const totalRequired = items.length;
  const totalStaged = items.filter(i => i.staged >= i.required).length;
  const allStaged = totalStaged === totalRequired;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/warehouse')} className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
          <ArrowLeft className="h-4 w-4 text-foreground" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-foreground">Stage Material</h1>
          <p className="text-[10px] text-muted-foreground">RUN-2026-047 · Premium Orange Juice 1L</p>
        </div>
      </div>

      {/* Progress */}
      <div className="data-card p-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-foreground font-medium">BOM Staging Progress</p>
          <p className="text-[10px] text-muted-foreground">{totalStaged} of {totalRequired} ingredients staged</p>
        </div>
        <div className="text-right">
          <p className={cn("text-2xl font-bold font-mono", allStaged ? "text-status-running" : "text-foreground")}>
            {Math.round((totalStaged / totalRequired) * 100)}%
          </p>
        </div>
      </div>

      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div className={cn("h-full transition-all rounded-full", allStaged ? "bg-status-running" : "bg-primary")}
          style={{ width: `${(totalStaged / totalRequired) * 100}%` }} />
      </div>

      {/* BOM items */}
      <div className="space-y-2">
        {items.map((item, idx) => {
          const done = item.staged >= item.required;
          return (
            <div key={idx} className={cn("data-card p-3", done && "border-status-running/30")}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-foreground">{item.ingredient}</span>
                {done ? <CheckCircle2 className="h-4 w-4 text-status-running" /> : null}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-muted-foreground">
                    Required: {item.required} {item.unit} · Staged: {item.staged} {item.unit}
                  </p>
                  {item.lotCode && <p className="text-[10px] text-muted-foreground font-mono">Lot: {item.lotCode}</p>}
                </div>
                {!done && (
                  <button onClick={() => scanItem(idx)}
                    className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-[10px] font-bold text-primary-foreground">
                    <ScanLine className="h-3 w-3" /> Scan
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {allStaged && (
        <div className="rounded-xl bg-status-running/10 border border-status-running/30 p-4 text-center">
          <Package className="h-8 w-8 mx-auto mb-2 text-status-running" />
          <p className="text-sm font-bold text-status-running">All Materials Staged for RUN-2026-047</p>
          <p className="text-[10px] text-muted-foreground mt-1">Supervisor notified</p>
        </div>
      )}
    </div>
  );
}
