import { useState, useEffect } from "react";
import { ArrowLeft, Check, AlertTriangle, Droplets, Thermometer, Wind, FlaskConical, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cipCycleExec, type CIPCycleExec } from "@/data/maintenanceMockData";
import { jitter, advanceElapsed } from "@/hooks/useSimulation";

const stepStatusColors: Record<string, string> = {
  completed: 'bg-status-running',
  active: 'bg-primary animate-pulse',
  pending: 'bg-muted',
  failed: 'bg-status-critical',
};

export default function CIPMonitorScreen() {
  const navigate = useNavigate();
  const [c, setC] = useState<CIPCycleExec>(cipCycleExec);

  // Simulate CIP progress every 3s
  useEffect(() => {
    const id = setInterval(() => {
      setC(prev => {
        const steps = prev.steps.map(step => {
          if (step.status === 'active') {
            const newElapsed = advanceElapsed(step.elapsed, step.duration);
            if (newElapsed >= step.duration) {
              return { ...step, elapsed: step.duration, status: 'completed' as const, result: 'PASS' as const };
            }
            return { ...step, elapsed: newElapsed };
          }
          return step;
        });
        // Activate next pending step if current active just completed
        const hasActive = steps.some(s => s.status === 'active');
        if (!hasActive) {
          const nextPending = steps.findIndex(s => s.status === 'pending');
          if (nextPending !== -1) {
            steps[nextPending] = { ...steps[nextPending], status: 'active' };
          }
        }
        const allDone = steps.every(s => s.status === 'completed');
        return {
          ...prev,
          steps,
          outcome: allDone ? 'PASS' : prev.outcome,
          tact: {
            temperature: { ...prev.tact.temperature, actual: jitter(prev.tact.temperature.actual, 0.01) },
            flow: { ...prev.tact.flow, actual: jitter(prev.tact.flow.actual, 0.02) },
            concentration: { ...prev.tact.concentration, actual: jitter(prev.tact.concentration.actual, 0.01) },
            contactTime: { ...prev.tact.contactTime, actual: advanceElapsed(prev.tact.contactTime.actual, prev.tact.contactTime.required, 0.5) },
          },
        };
      });
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const totalElapsed = c.steps.reduce((s, step) => s + step.elapsed, 0);
  const totalDuration = c.steps.reduce((s, step) => s + step.duration, 0);

  const tactParams = [
    { label: 'Temperature', icon: Thermometer, ...c.tact.temperature },
    { label: 'Flow Rate', icon: Wind, ...c.tact.flow },
    { label: 'Concentration', icon: FlaskConical, ...c.tact.concentration },
    { label: 'Contact Time', icon: Clock, ...c.tact.contactTime },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/maintenance')} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-foreground">CIP Cycle Execution</h1>
          <p className="text-xs text-muted-foreground">{c.asset} · {c.line} · {c.label}</p>
        </div>
      </div>

      {/* Cycle info */}
      <div className="rounded-lg bg-muted p-3 text-sm flex gap-6">
        <div><span className="text-muted-foreground">Type:</span> <span className="text-foreground">{c.label}</span></div>
        <div><span className="text-muted-foreground">Duration:</span> <span className="font-mono text-foreground">{c.expectedDuration}</span></div>
        <div><span className="text-muted-foreground">Chemicals:</span> <span className="text-foreground">{c.chemicals}</span></div>
      </div>

      {/* Step progress */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Step Progress</h2>
        <div className="flex gap-1 mb-3">
          {c.steps.map((step, i) => (
            <div key={i} className="flex-1">
              <div className={cn("h-2 rounded-full", stepStatusColors[step.status])} />
              <p className="text-[9px] text-center mt-1 text-muted-foreground truncate">{step.name}</p>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          {c.steps.map((step, i) => (
            <div key={i} className={cn(
              "flex items-center gap-3 rounded-lg border p-2.5",
              step.status === 'active' ? "border-primary bg-primary/5" :
              step.status === 'completed' ? "border-status-running/20" :
              step.status === 'failed' ? "border-status-critical/30" :
              "border-border opacity-50"
            )}>
              <div className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full",
                step.status === 'completed' ? "bg-status-running" :
                step.status === 'active' ? "bg-primary" :
                step.status === 'failed' ? "bg-status-critical" :
                "bg-muted"
              )}>
                {step.status === 'completed' ? <Check className="h-3.5 w-3.5 text-background" /> :
                 step.status === 'failed' ? <AlertTriangle className="h-3.5 w-3.5 text-background" /> :
                 step.status === 'active' ? <Droplets className="h-3.5 w-3.5 text-primary-foreground" /> :
                 <span className="text-[10px] text-muted-foreground">{i + 1}</span>}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{step.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  {step.elapsed}/{step.duration} min
                  {step.result && <span className={cn("ml-2 font-bold", step.result === 'PASS' ? "text-status-running" : "text-status-critical")}>{step.result}</span>}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TACT gauges */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">TACT Parameters</h2>
        <div className="grid grid-cols-2 gap-2">
          {tactParams.map(p => {
            const Icon = p.icon;
            const pct = (p.actual / p.required) * 100;
            return (
              <div key={p.label} className={cn(
                "data-card p-3",
                !p.inRange && "border-status-critical/40"
              )}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={cn("h-4 w-4", p.inRange ? "text-status-running" : "text-status-critical")} />
                  <span className="metric-label">{p.label}</span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className={cn("font-mono text-2xl font-bold", p.inRange ? "text-foreground" : "text-status-critical")}>
                      {p.actual}
                    </p>
                    <p className="text-[10px] text-muted-foreground">/{p.required} {p.unit}</p>
                  </div>
                  <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
                    <div className={cn("h-full rounded-full", p.inRange ? "bg-status-running" : "bg-status-critical")}
                      style={{ width: `${Math.min(pct, 100)}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Outcome */}
      <div className={cn(
        "rounded-lg border-2 p-4 text-center",
        c.outcome === 'PASS' ? "border-status-running bg-status-running/10" :
        c.outcome === 'FAIL' ? "border-status-critical bg-status-critical/10" :
        "border-primary bg-primary/5"
      )}>
        <p className={cn("text-lg font-bold",
          c.outcome === 'PASS' ? "text-status-running" :
          c.outcome === 'FAIL' ? "text-status-critical" :
          "text-primary"
        )}>
          {c.outcome === 'IN_PROGRESS' ? 'CYCLE IN PROGRESS' : c.outcome}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {totalElapsed}/{totalDuration} min elapsed
        </p>
      </div>

      {c.outcome === 'PASS' && (
        <Button className="w-full h-12 bg-status-running hover:bg-status-running/90" onClick={() => toast.success('Line cleared for production')}>
          Line Cleared for Production
        </Button>
      )}
    </div>
  );
}
