import { lineStatus } from "@/data/mockData";
import { StatusBadge } from "@/components/StatusBadge";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function IdleScreen() {
  const { status, lastRun, pendingActions } = lineStatus;
  const allComplete = pendingActions.every(a => a.completed);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-foreground">Line Status</h1>

      {/* Large status badge */}
      <div className="data-card flex flex-col items-center justify-center py-12">
        <StatusBadge status={status} className="text-xl px-6 py-3" />
        {allComplete && (
          <p className="mt-4 text-sm text-status-running font-medium">All pre-run checks complete — ready to start</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Last run summary */}
        <div className="data-card">
          <div className="metric-label mb-3">Last Run Summary</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Product</span><span className="text-foreground">{lastRun.product}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span className="font-mono text-foreground">{lastRun.duration}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">OEE</span><span className="font-mono text-status-running">{lastRun.oee}%</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Batch</span><span className="font-mono text-foreground">{lastRun.batchId}</span></div>
          </div>
        </div>

        {/* Pending actions */}
        <div className="data-card">
          <div className="metric-label mb-3">Pending Actions</div>
          <div className="space-y-2">
            {pendingActions.map(action => (
              <div key={action.id} className="flex items-center gap-3 text-sm">
                {action.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-status-running flex-shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                )}
                <span className={cn(action.completed ? "text-muted-foreground line-through" : "text-foreground")}>
                  {action.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
