import { cn } from "@/lib/utils";
import { useSimulation, jitter } from "@/hooks/useSimulation";
import { Zap, Droplets, AlertTriangle } from "lucide-react";

interface LineEnergy {
  line: string;
  kwhPerKg: number;
  target: number;
}

const baseData = {
  totalKwh: 12450,
  targetKwh: 14000,
  totalWater: 8200,
  targetWater: 9500,
  lines: [
    { line: 'Line 1', kwhPerKg: 0.42, target: 0.45 },
    { line: 'Line 2', kwhPerKg: 0.51, target: 0.45 },
    { line: 'Line 3', kwhPerKg: 0.38, target: 0.45 },
    { line: 'Line 4', kwhPerKg: 0.44, target: 0.45 },
    { line: 'Line 5', kwhPerKg: 0.55, target: 0.45 },
  ] as LineEnergy[],
  anomalies: [
    { line: 'Line 2', product: 'Mango Smoothie 500ml', excess: '+14%' },
    { line: 'Line 5', product: 'Vanilla Yogurt 200g', excess: '+22%' },
  ],
};

export default function EnergyDashboardScreen() {
  const data = useSimulation(baseData, prev => ({
    ...prev,
    totalKwh: Math.round(jitter(prev.totalKwh, 0.005)),
    totalWater: Math.round(jitter(prev.totalWater, 0.003)),
    lines: prev.lines.map(l => ({ ...l, kwhPerKg: parseFloat(jitter(l.kwhPerKg, 0.02).toFixed(2)) })),
  }), 5000);

  const kwhVariance = ((data.totalKwh - data.targetKwh) / data.targetKwh * 100);
  const waterVariance = ((data.totalWater - data.targetWater) / data.targetWater * 100);
  const kwhColor = kwhVariance <= 0 ? 'text-status-running' : kwhVariance < 15 ? 'text-status-warning' : 'text-status-critical';
  const waterColor = waterVariance <= 0 ? 'text-status-running' : waterVariance < 15 ? 'text-status-warning' : 'text-status-critical';

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Energy Dashboard</h1>
        <p className="text-sm text-muted-foreground">Ambient Display · Today's Performance</p>
      </div>

      {/* Headlines */}
      <div className="grid grid-cols-2 gap-3">
        <div className="data-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-status-warning" />
            <span className="text-[10px] text-muted-foreground uppercase">Energy</span>
          </div>
          <p className="text-3xl font-bold font-mono text-foreground">{data.totalKwh.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">kWh / {data.targetKwh.toLocaleString()} target</p>
          <p className={cn("text-sm font-bold font-mono mt-1", kwhColor)}>{kwhVariance > 0 ? '+' : ''}{kwhVariance.toFixed(1)}%</p>
        </div>
        <div className="data-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="h-4 w-4 text-primary" />
            <span className="text-[10px] text-muted-foreground uppercase">Water</span>
          </div>
          <p className="text-3xl font-bold font-mono text-foreground">{data.totalWater.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">L / {data.targetWater.toLocaleString()} target</p>
          <p className={cn("text-sm font-bold font-mono mt-1", waterColor)}>{waterVariance > 0 ? '+' : ''}{waterVariance.toFixed(1)}%</p>
        </div>
      </div>

      {/* Per-line energy bars */}
      <div>
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Energy per kg by Line</h2>
        <div className="space-y-2">
          {data.lines.map(l => {
            const pct = Math.min(100, (l.kwhPerKg / 0.7) * 100);
            const over = l.kwhPerKg > l.target;
            return (
              <div key={l.line} className="data-card p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-foreground">{l.line}</span>
                  <span className={cn("text-xs font-bold font-mono", over ? "text-status-warning" : "text-status-running")}>
                    {l.kwhPerKg} kWh/kg
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all", over ? "bg-status-warning" : "bg-status-running")}
                    style={{ width: `${pct}%` }} />
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">Target: {l.target} kWh/kg</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Anomalies */}
      {data.anomalies.length > 0 && (
        <div>
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Energy Anomalies</h2>
          {data.anomalies.map((a, i) => (
            <div key={i} className="data-card p-3 mb-2 border-status-warning/30">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-status-warning shrink-0" />
                <div>
                  <p className="text-xs font-bold text-foreground">{a.line} · {a.product}</p>
                  <p className="text-[10px] text-status-warning">Energy per unit {a.excess} above baseline</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
