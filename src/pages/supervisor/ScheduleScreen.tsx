import { Calendar, Clock, AlertTriangle, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { scheduledRuns } from "@/data/supervisorMockData";

const statusStyles: Record<string, string> = {
  'ON-TRACK': 'bg-status-running/20 text-status-running border-status-running/30',
  'DELAYED': 'bg-status-warning/20 text-status-warning border-status-warning/30',
  'AT-RISK': 'bg-status-critical/20 text-status-critical border-status-critical/30',
  'COMPLETED': 'bg-muted text-muted-foreground border-border',
};

export default function ScheduleScreen() {
  const delayed = scheduledRuns.filter(r => r.status === 'DELAYED' || r.status === 'AT-RISK');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Production Schedule</h1>
          <p className="text-sm text-muted-foreground">Next 12 hours · Read-only view</p>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span className="text-sm">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
        </div>
      </div>

      {/* Disruption alerts */}
      {delayed.length > 0 && (
        <div className="rounded-lg border border-status-warning bg-status-warning/10 p-3">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-status-warning" />
            <span className="text-sm font-semibold text-status-warning">Schedule Disruption</span>
          </div>
          <p className="text-xs text-foreground">
            {delayed.length} run{delayed.length > 1 ? 's' : ''} affected: {delayed.map(r => `${r.product} (${r.line})`).join(', ')}
          </p>
        </div>
      )}

      {/* Timeline */}
      <div className="relative space-y-0">
        {scheduledRuns.map((run, i) => (
          <div key={run.id} className="relative flex gap-4">
            {/* Timeline line */}
            <div className="flex flex-col items-center">
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border-2 z-10",
                run.status === 'ON-TRACK' ? 'border-status-running bg-status-running/20' :
                run.status === 'DELAYED' ? 'border-status-warning bg-status-warning/20' :
                run.status === 'AT-RISK' ? 'border-status-critical bg-status-critical/20' :
                'border-muted bg-muted'
              )}>
                <Clock className={cn("h-3.5 w-3.5",
                  run.status === 'ON-TRACK' ? 'text-status-running' :
                  run.status === 'DELAYED' ? 'text-status-warning' :
                  run.status === 'AT-RISK' ? 'text-status-critical' :
                  'text-muted-foreground'
                )} />
              </div>
              {i < scheduledRuns.length - 1 && (
                <div className="w-px flex-1 bg-border min-h-[16px]" />
              )}
            </div>

            {/* Card */}
            <div className={cn("flex-1 mb-3 rounded-lg border p-3", statusStyles[run.status])}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-foreground text-sm">{run.product}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">{run.sku} · {run.recipeVersion}</p>
                </div>
                <span className={cn(
                  "text-[10px] font-bold rounded px-1.5 py-0.5",
                  run.status === 'ON-TRACK' ? 'bg-status-running/30 text-status-running' :
                  run.status === 'DELAYED' ? 'bg-status-warning/30 text-status-warning' :
                  run.status === 'AT-RISK' ? 'bg-status-critical/30 text-status-critical' :
                  'bg-muted text-muted-foreground'
                )}>
                  {run.status}
                </span>
              </div>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {run.line}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {run.plannedStart} · {run.plannedDuration}
                </div>
                <div>
                  Target: <span className="font-mono text-foreground">{run.targetQuantity.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
