import { useNavigate } from "react-router-dom";
import { ScanLine, Package, ArrowRightLeft, Tags, AlertTriangle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { inboundLots } from "@/data/warehouseMockData";

const actions = [
  { label: 'Receive Ingredient Lot', icon: ScanLine, path: '/warehouse/receive', color: 'bg-primary text-primary-foreground', desc: 'Scan supplier pallet label' },
  { label: 'Stage Material for Run', icon: Package, path: '/warehouse/stage', color: 'bg-status-running text-background', desc: 'Stage ingredients for production' },
  { label: 'Move WIP Batch', icon: ArrowRightLeft, path: '/warehouse/wip', color: 'bg-status-monitor text-background', desc: 'Track WIP between stages' },
  { label: 'Print Pallet Label', icon: Tags, path: '/warehouse/pallets', color: 'bg-accent text-accent-foreground', desc: 'GS1 finished goods labels' },
];

export default function ReceivingHomeScreen() {
  const navigate = useNavigate();
  const pending = inboundLots.filter(l => l.status === 'PENDING' || l.status === 'IN_INSPECTION');

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Receiving</h1>
        <p className="text-sm text-muted-foreground">Goods Receiving Handheld · Shift A</p>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3">
        {actions.map(a => {
          const Icon = a.icon;
          return (
            <button key={a.label} onClick={() => navigate(a.path)}
              className={cn("rounded-xl p-4 text-left transition-all hover:scale-[1.02]", a.color)}>
              <Icon className="h-6 w-6 mb-2" />
              <p className="text-sm font-bold">{a.label}</p>
              <p className="text-[10px] opacity-80 mt-0.5">{a.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Quick links */}
      <div className="flex gap-2">
        <button onClick={() => navigate('/warehouse/fefo')} className="flex-1 rounded-xl bg-muted p-3 text-left">
          <p className="text-xs font-bold text-foreground">FEFO Check</p>
          <p className="text-[10px] text-muted-foreground">Lot rotation compliance</p>
        </button>
        <button onClick={() => navigate('/warehouse/discrepancy')} className="flex-1 rounded-xl bg-muted p-3 text-left">
          <p className="text-xs font-bold text-foreground">Report Damage</p>
          <p className="text-[10px] text-muted-foreground">Log delivery issues</p>
        </button>
      </div>

      {/* Pending receipts */}
      <div>
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Expected Deliveries Today</h2>
        <div className="space-y-2">
          {pending.map(lot => (
            <div key={lot.id} onClick={() => navigate(`/warehouse/receive?lot=${lot.id}`)}
              className="data-card p-3 cursor-pointer hover:border-primary/30 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">{lot.materialName}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">{lot.supplier} · PO {lot.poNumber}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Qty: {lot.quantity} {lot.unit} · Exp: {lot.expiryDate}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
