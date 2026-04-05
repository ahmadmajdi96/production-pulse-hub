import { useState, useEffect } from "react";
import { Pause, Play } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { CircularGauge } from "@/components/CircularGauge";
import { activeRun, qualityGauges, currentWorkInstruction, clockedOnOperators } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function RunStatusScreen() {
  const [run, setRun] = useState(activeRun);
  const [instruction, setInstruction] = useState(currentWorkInstruction);
  const [gauges, setGauges] = useState(qualityGauges);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setGauges(prev => prev.map(g => ({
        ...g,
        value: parseFloat((g.value + (Math.random() - 0.5) * (g.max - g.min) * 0.01).toFixed(2)),
      })));
      setRun(prev => ({
        ...prev,
        elapsedMinutes: prev.elapsedMinutes + 1,
        actualCasesPerHour: Math.round(prev.actualCasesPerHour + (Math.random() - 0.5) * 5),
        totalCasesProduced: prev.totalCasesProduced + Math.round(prev.actualCasesPerHour / 60),
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const elapsed = `${Math.floor(run.elapsedMinutes / 60)}h ${run.elapsedMinutes % 60}m`;
  const throughputPct = Math.round((run.actualCasesPerHour / run.targetCasesPerHour) * 100);
  const completionPct = Math.round((run.totalCasesProduced / run.targetCases) * 100);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="data-card flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-4xl">{run.productName}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span>SKU: <span className="font-mono text-foreground">{run.sku}</span></span>
            <span>Run: <span className="font-mono text-foreground">{run.runId}</span></span>
            <span>Batch: <span className="font-mono text-foreground">{run.batchId}</span></span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={run.status} className="text-sm px-4 py-1.5" />
          <span className="font-mono text-lg text-foreground">{elapsed}</span>
          <Button variant="outline" size="icon" onClick={() => setRun(r => ({ ...r, status: r.status === 'RUNNING' ? 'PAUSED' : 'RUNNING' }))}>
            {run.status === 'RUNNING' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Quality Gauges */}
      <div className="grid grid-cols-5 gap-3">
        {gauges.map(g => (
          <div key={g.id} className="relative">
            <CircularGauge {...g} />
          </div>
        ))}
      </div>

      {/* Throughput + Completion */}
      <div className="grid grid-cols-2 gap-3">
        <div className="data-card">
          <div className="metric-label mb-2">Throughput Rate</div>
          <div className="flex items-end gap-3">
            <span className="metric-value">{run.actualCasesPerHour}</span>
            <span className="text-sm text-muted-foreground">/ {run.targetCasesPerHour} cases/hr</span>
            <span className={`ml-auto text-sm font-semibold ${throughputPct >= 95 ? 'text-status-running' : throughputPct >= 85 ? 'text-status-monitor' : 'text-status-critical'}`}>
              {throughputPct}%
            </span>
          </div>
          <Progress value={throughputPct} className="mt-2 h-3" />
        </div>
        <div className="data-card">
          <div className="metric-label mb-2">Run Completion</div>
          <div className="flex items-end gap-3">
            <span className="metric-value">{run.totalCasesProduced.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground">/ {run.targetCases.toLocaleString()} cases</span>
            <span className="ml-auto text-sm font-semibold text-primary">{completionPct}%</span>
          </div>
          <Progress value={completionPct} className="mt-2 h-3" />
        </div>
      </div>

      {/* Work Instruction + Operators */}
      <div className="grid grid-cols-3 gap-3">
        <div className="data-card col-span-2">
          <div className="metric-label mb-2">Work Instruction — Step {instruction.stepNumber}/{instruction.totalSteps}</div>
          <h3 className="text-lg font-semibold text-foreground">{instruction.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{instruction.instruction}</p>
          <Button
            className="mt-3"
            onClick={() => setInstruction(i => ({ ...i, acknowledged: true }))}
            disabled={instruction.acknowledged}
            style={!instruction.acknowledged ? { background: 'hsl(142, 71%, 45%)', color: 'hsl(220, 20%, 7%)' } : undefined}
          >
            {instruction.acknowledged ? '✓ Acknowledged' : 'ACKNOWLEDGE'}
          </Button>
        </div>
        <div className="data-card">
          <div className="metric-label mb-3">Operators On Shift</div>
          <div className="space-y-2">
            {clockedOnOperators.map(op => (
              <div key={op.id} className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-medium text-foreground">{op.name}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{op.role}</span>
                </div>
                <span className="font-mono text-xs text-muted-foreground">{op.clockedOnAt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
