import { cipData } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { CheckCircle2, Loader2, Circle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function CIPScreen() {
  const { steps, temperature, flowRate, concentration, contactTime, outcome } = cipData;
  const totalDuration = steps.reduce((s, st) => s + st.durationMinutes, 0);
  const totalElapsed = steps.reduce((s, st) => s + st.elapsedMinutes, 0);
  const overallPct = Math.round((totalElapsed / totalDuration) * 100);

  const tactParams = [
    { label: 'Temperature', ...temperature },
    { label: 'Flow Rate (Action)', ...flowRate },
    { label: 'Concentration', ...concentration },
    { label: 'Contact Time', ...contactTime },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">CIP/SIP Monitor</h1>
        {outcome === 'IN_PROGRESS' && (
          <div className="status-badge status-monitor"><Loader2 className="h-3 w-3 animate-spin" /> In Progress</div>
        )}
        {outcome === 'VERIFIED' && (
          <div className="rounded-lg bg-status-running/15 border border-status-running/30 px-4 py-2 text-lg font-bold text-status-running">✓ VERIFIED</div>
        )}
        {outcome === 'FAILED' && (
          <div className="rounded-lg bg-destructive px-4 py-2 text-lg font-bold text-destructive-foreground">✗ FAILED</div>
        )}
      </div>

      {/* Step progress */}
      <div className="data-card">
        <div className="flex items-center justify-between mb-3">
          <span className="metric-label">Cycle Progress</span>
          <span className="font-mono text-sm text-foreground">{overallPct}%</span>
        </div>
        <Progress value={overallPct} className="h-3 mb-4" />
        <div className="flex gap-2">
          {steps.map((step, i) => {
            const StepIcon = step.status === 'completed' ? CheckCircle2 : step.status === 'active' ? Loader2 : Circle;
            return (
              <div key={i} className={cn(
                "flex-1 rounded-lg border p-3 text-center transition-all",
                step.status === 'completed' && "border-status-running/30 bg-status-running/10",
                step.status === 'active' && "border-primary/50 bg-primary/10",
                step.status === 'pending' && "border-border bg-muted/30",
              )}>
                <StepIcon className={cn(
                  "h-5 w-5 mx-auto mb-1",
                  step.status === 'completed' && "text-status-running",
                  step.status === 'active' && "text-primary animate-spin",
                  step.status === 'pending' && "text-muted-foreground",
                )} />
                <p className={cn(
                  "text-xs font-medium",
                  step.status === 'pending' ? "text-muted-foreground" : "text-foreground",
                )}>{step.name}</p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {step.status === 'active' ? `${step.elapsedMinutes}/${step.durationMinutes}m` : `${step.durationMinutes}m`}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* TACT gauges */}
      <div className="grid grid-cols-4 gap-3">
        {tactParams.map(param => {
          const pct = Math.round((param.actual / param.required) * 100);
          const isOk = pct >= 90 && pct <= 110;
          return (
            <div key={param.label} className="data-card text-center">
              <div className="metric-label mb-2">{param.label}</div>
              <div className="flex items-end justify-center gap-1">
                <span className={cn("font-mono text-2xl font-bold", isOk ? "text-status-running" : "text-status-warning")}>
                  {param.actual}
                </span>
                <span className="text-sm text-muted-foreground">{param.unit}</span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">Required: {param.required} {param.unit}</div>
              <Progress value={Math.min(100, pct)} className="mt-2 h-2" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
