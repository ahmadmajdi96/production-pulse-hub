import { AlertTriangle, Check, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { fefoItems, type FEFOCompliance } from "@/data/warehouseMockData";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const complianceConfig: Record<FEFOCompliance, { label: string; color: string; bg: string; icon: typeof Check }> = {
  COMPLIANT: { label: 'Compliant', color: 'text-status-running', bg: 'bg-status-running/10 border-status-running/20', icon: Check },
  AT_RISK: { label: 'At Risk', color: 'text-status-warning', bg: 'bg-status-warning/10 border-status-warning/30', icon: Clock },
  NON_COMPLIANT: { label: 'Non-Compliant', color: 'text-status-critical', bg: 'bg-status-critical/10 border-status-critical/30', icon: AlertTriangle },
};

export default function FEFOScreen() {
  const nonCompliantCount = fefoItems.filter(i => i.compliance === 'NON_COMPLIANT').length;
  const atRiskCount = fefoItems.filter(i => i.compliance === 'AT_RISK').length;

  // Sort: non-compliant first, then at-risk, then compliant
  const sorted = [...fefoItems].sort((a, b) => {
    const order: Record<FEFOCompliance, number> = { NON_COMPLIANT: 0, AT_RISK: 1, COMPLIANT: 2 };
    return order[a.compliance] - order[b.compliance];
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">FEFO Compliance</h1>
        <p className="text-sm text-muted-foreground">First Expired, First Out · {fefoItems.length} tracked items</p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-2">
        <div className="data-card p-3 text-center border-status-critical/30">
          <p className="font-mono text-2xl font-bold text-status-critical">{nonCompliantCount}</p>
          <p className="metric-label">Non-Compliant</p>
        </div>
        <div className="data-card p-3 text-center border-status-warning/30">
          <p className="font-mono text-2xl font-bold text-status-warning">{atRiskCount}</p>
          <p className="metric-label">At Risk</p>
        </div>
        <div className="data-card p-3 text-center border-status-running/30">
          <p className="font-mono text-2xl font-bold text-status-running">{fefoItems.length - nonCompliantCount - atRiskCount}</p>
          <p className="metric-label">Compliant</p>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-2">
        {sorted.map(item => {
          const cc = complianceConfig[item.compliance];
          const Icon = cc.icon;
          return (
            <div key={item.id} className={cn("rounded-lg border p-3", cc.bg)}>
              <div className="flex items-start gap-3">
                <Icon className={cn("h-5 w-5 mt-0.5 shrink-0", cc.color)} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-foreground">{item.material}</span>
                    <span className={cn("text-[10px] font-bold", cc.color)}>{cc.label}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-mono">{item.materialCode} · Lot: {item.lotNumber}</p>
                  <div className="flex gap-4 mt-1 text-[10px] text-muted-foreground">
                    <span>Location: <span className="font-mono text-foreground">{item.location}</span></span>
                    <span>Qty: <span className="font-mono text-foreground">{item.quantity} {item.unit}</span></span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={cn("font-mono text-sm font-bold", item.daysToExpiry <= 7 ? "text-status-critical" : item.daysToExpiry <= 30 ? "text-status-warning" : "text-foreground")}>
                      {item.daysToExpiry}d to expiry
                    </span>
                    <span className="text-[10px] text-muted-foreground">({item.expiryDate})</span>
                  </div>
                  {item.compliance !== 'COMPLIANT' && (
                    <div className="flex items-center gap-2 mt-2">
                      <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                      <span className="text-xs text-foreground">{item.suggestedAction}</span>
                      <Button size="sm" variant="outline" className="h-6 text-[10px] ml-auto shrink-0"
                        onClick={() => toast.info(`Action logged for ${item.material}`)}>
                        Act
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
