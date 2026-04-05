import { useState } from "react";
import { AlertTriangle, Clock, Wrench, Filter, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { workOrders, type WorkOrder } from "@/data/maintenanceMockData";

type FilterType = 'IMMEDIATE' | 'TODAY' | 'ALL';

const priorityColors: Record<string, string> = {
  P1: 'bg-status-critical text-background',
  P2: 'bg-status-warning text-background',
  P3: 'bg-status-monitor text-background',
  P4: 'bg-muted text-muted-foreground',
};

const statusColors: Record<string, string> = {
  OPEN: 'text-status-warning',
  'IN-PROGRESS': 'text-primary',
  'AWAITING-PARTS': 'text-status-monitor',
  COMPLETED: 'text-status-running',
};

export default function WorkOrderQueueScreen() {
  const [filter, setFilter] = useState<FilterType>('IMMEDIATE');

  const filtered = filter === 'IMMEDIATE'
    ? workOrders.filter(wo => wo.type === 'IMMEDIATE')
    : filter === 'TODAY'
    ? workOrders.filter(wo => wo.status !== 'COMPLETED')
    : workOrders;

  const immediateCount = workOrders.filter(w => w.type === 'IMMEDIATE').length;
  const todayCount = workOrders.filter(w => w.status !== 'COMPLETED').length;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Work Orders</h1>
        <p className="text-sm text-muted-foreground">Maintenance Technician · {workOrders.length} orders</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {[
          { key: 'IMMEDIATE' as FilterType, label: 'Immediate', count: immediateCount },
          { key: 'TODAY' as FilterType, label: 'Today', count: todayCount },
          { key: 'ALL' as FilterType, label: 'All', count: workOrders.length },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition-all",
              filter === f.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}
          >
            {f.label}
            <span className={cn(
              "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
              filter === f.key ? "bg-primary-foreground/20 text-primary-foreground" : "bg-background text-muted-foreground"
            )}>{f.count}</span>
          </button>
        ))}
      </div>

      {/* Work order cards */}
      <div className="space-y-2">
        {filtered.map(wo => (
          <div key={wo.id} className={cn(
            "data-card p-3 cursor-pointer hover:border-primary/30 transition-all",
            wo.type === 'IMMEDIATE' && wo.status === 'OPEN' && "border-status-critical/40"
          )}>
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center gap-1">
                <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-bold", priorityColors[wo.priority])}>
                  {wo.priority}
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  <span className={cn("font-mono text-xs font-bold",
                    wo.assetHealthScore < 30 ? "text-status-critical" :
                    wo.assetHealthScore < 60 ? "text-status-warning" :
                    "text-status-running"
                  )}>{wo.assetHealthScore}</span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-sm text-foreground">{wo.assetName}</span>
                  <span className={cn("text-[10px] font-bold uppercase", statusColors[wo.status])}>{wo.status}</span>
                </div>
                <p className="text-[10px] text-muted-foreground font-mono">{wo.id} · {wo.line}, {wo.bay}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{wo.description}</p>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" /> {wo.timeRaised}</span>
                  {wo.slaRemaining > 0 && (
                    <span className={cn("flex items-center gap-0.5 font-mono font-bold",
                      wo.slaRemaining < 30 ? "text-status-critical" : "text-muted-foreground"
                    )}>
                      SLA: {wo.slaRemaining}m
                    </span>
                  )}
                  {wo.requiresLOTO && <span className="flex items-center gap-0.5 text-status-warning">🔒 LOTO</span>}
                </div>
              </div>

              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Wrench className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No work orders in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}
