import { useState, useEffect } from "react";
import { ArrowLeft, Pause, XOctagon, ArrowRightLeft, TrendingUp, TrendingDown, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { runDetailData } from "@/data/supervisorMockData";
import { jitter } from "@/hooks/useSimulation";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

export default function RunDetailScreen() {
  const navigate = useNavigate();
  const [run, setRun] = useState(runDetailData);
  const [paused, setPaused] = useState(run.status === 'PAUSED');

  // Live quality trend updates every 5s
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setRun(prev => {
        const lastPoint = prev.qualityTrend[prev.qualityTrend.length - 1];
        const newPoint = {
          time: `+${prev.qualityTrend.length}m`,
          brix: jitter(lastPoint.brix, 0.02),
          ph: jitter(lastPoint.ph, 0.01),
          temp: jitter(lastPoint.temp, 0.01),
        };
        return {
          ...prev,
          qualityTrend: [...prev.qualityTrend.slice(-11), newPoint],
          unitsProduced: prev.unitsProduced + Math.round(prev.throughputActual / 12),
          oee: Math.min(100, jitter(prev.oee, 0.005)),
        };
      });
    }, 5000);
    return () => clearInterval(id);
  }, [paused]);

  const throughputPct = ((run.throughputActual / run.throughputTarget) * 100).toFixed(1);
  const costVariance = ((run.costPerUnit - run.costPerUnitTarget) / run.costPerUnitTarget * 100).toFixed(1);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/supervisor')} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-foreground">{run.product}</h1>
            <StatusBadge status={paused ? 'PAUSED' : 'RUNNING'} className="text-[10px]" />
          </div>
          <p className="text-xs text-muted-foreground">{run.runId} · {run.sku} · {run.line}</p>
        </div>
      </div>

      {/* Metrics strip */}
      <div className="grid grid-cols-5 gap-2">
        {[
          { label: 'OEE', value: `${run.oee}%`, color: run.oee >= 85 ? 'text-status-running' : 'text-status-warning' },
          { label: 'Throughput', value: `${throughputPct}%`, color: Number(throughputPct) >= 95 ? 'text-status-running' : 'text-status-warning' },
          { label: 'Elapsed', value: run.elapsedTime, color: 'text-foreground' },
          { label: 'Units', value: run.unitsProduced.toLocaleString(), color: 'text-foreground' },
          { label: '$/Unit', value: `$${run.costPerUnit}`, color: Number(costVariance) <= 0 ? 'text-status-running' : 'text-status-warning' },
        ].map(m => (
          <div key={m.label} className="data-card p-2 text-center">
            <p className="metric-label">{m.label}</p>
            <p className={cn("font-mono text-lg font-bold", m.color)}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* Quality timeline sparklines */}
      <div className="data-card p-3">
        <h2 className="text-sm font-semibold text-foreground mb-2">Quality Trend (Live)</h2>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={run.qualityTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'hsl(220, 10%, 50%)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(220, 10%, 50%)' }} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(220, 20%, 12%)', border: '1px solid hsl(220, 14%, 20%)', borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="brix" stroke="hsl(210, 100%, 56%)" strokeWidth={2} dot={false} name="Brix" isAnimationActive={false} />
              <Line type="monotone" dataKey="ph" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={false} name="pH" isAnimationActive={false} />
              <Line type="monotone" dataKey="temp" stroke="hsl(48, 96%, 53%)" strokeWidth={2} dot={false} name="Temp" isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Waste event log */}
      <div className="data-card p-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-foreground">Waste Events</h2>
          <span className="font-mono text-sm font-bold text-status-warning">{run.wasteTotalKg} kg total</span>
        </div>
        <div className="space-y-1.5">
          {run.wasteEvents.map(w => (
            <div key={w.id} className="flex items-center justify-between rounded bg-muted px-2 py-1.5 text-xs">
              <div className="flex items-center gap-2">
                <Trash2 className="h-3 w-3 text-status-warning" />
                <span className="text-foreground">{w.type}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-foreground">{w.volumeKg} kg</span>
                <span className="text-muted-foreground">{w.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-3 gap-3">
        <Button
          variant="outline"
          className={cn("h-12 border-status-warning text-status-warning hover:bg-status-warning/10", paused && "bg-status-warning/20")}
          onClick={() => { setPaused(!paused); toast.info(paused ? 'Run resumed' : 'Run paused'); }}
        >
          <Pause className="h-4 w-4 mr-1" /> {paused ? 'Resume' : 'Pause'}
        </Button>
        <Button
          variant="outline"
          className="h-12 border-status-critical text-status-critical hover:bg-status-critical/10"
          onClick={() => toast.error('Abort requires biometric confirmation')}
        >
          <XOctagon className="h-4 w-4 mr-1" /> Abort
        </Button>
        <Button
          className="h-12"
          onClick={() => navigate('/supervisor/transition')}
        >
          <ArrowRightLeft className="h-4 w-4 mr-1" /> Transition
        </Button>
      </div>
    </div>
  );
}
