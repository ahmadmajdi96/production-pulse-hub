import { cn } from "@/lib/utils";
import { useSimulation, jitter } from "@/hooks/useSimulation";
import { Leaf, TrendingDown, Thermometer, Award } from "lucide-react";

const baseData = {
  co2Today: 2.34,
  co2Target: 2.8,
  co2Intensity: 0.048,
  co2IntensityPrev: 0.052,
  refrigerants: [
    { type: 'R-134a', ytdKg: 12.4, baselineKg: 25, limit: 50 },
    { type: 'R-404A', ytdKg: 3.2, baselineKg: 15, limit: 50 },
    { type: 'R-717 (NH₃)', ytdKg: 0, baselineKg: 5, limit: 20 },
  ],
  initiatives: [
    { name: '15% steam reduction on Line 3', progress: 68 },
    { name: 'LED lighting retrofit — Warehouse', progress: 92 },
    { name: 'Compressed air leak elimination', progress: 45 },
  ],
};

export default function EmissionsScreen() {
  const data = useSimulation(baseData, prev => ({
    ...prev,
    co2Today: parseFloat(jitter(prev.co2Today, 0.01).toFixed(2)),
    co2Intensity: parseFloat(jitter(prev.co2Intensity, 0.015).toFixed(3)),
  }), 10000);

  const co2Color = data.co2Today <= data.co2Target ? 'text-status-running' : 'text-status-critical';
  const trendDown = data.co2Intensity < data.co2IntensityPrev;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Scope 1 Emissions</h1>
        <p className="text-sm text-muted-foreground">Sustainability Live Display</p>
      </div>

      {/* CO2e today */}
      <div className="data-card p-5 text-center">
        <Leaf className="h-6 w-6 mx-auto mb-2 text-status-running" />
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">CO₂e Today (Scope 1)</p>
        <p className={cn("text-4xl font-bold font-mono mt-1", co2Color)}>{data.co2Today}</p>
        <p className="text-xs text-muted-foreground">tonnes / {data.co2Target} target</p>
        <p className={cn("text-xs font-bold mt-2", co2Color)}>
          {data.co2Today <= data.co2Target ? '✅ Within target' : '⚠️ Above target'}
        </p>
      </div>

      {/* Intensity */}
      <div className="data-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase">Emissions Intensity (7-day avg)</p>
            <p className="text-2xl font-bold font-mono text-foreground">{data.co2Intensity}</p>
            <p className="text-[10px] text-muted-foreground">kg CO₂e / kg product</p>
          </div>
          <div className="text-right">
            <div className={cn("flex items-center gap-1", trendDown ? "text-status-running" : "text-status-warning")}>
              <TrendingDown className={cn("h-4 w-4", !trendDown && "rotate-180")} />
              <span className="text-xs font-bold">{trendDown ? 'Improving' : 'Rising'}</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">Prev: {data.co2IntensityPrev}</p>
          </div>
        </div>
      </div>

      {/* Refrigerant tracker */}
      <div>
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
          <Thermometer className="h-3 w-3 inline mr-1" />Refrigerant Consumption (YTD)
        </h2>
        <div className="space-y-2">
          {data.refrigerants.map(r => {
            const pct = (r.ytdKg / r.limit) * 100;
            const warning = pct > 60;
            return (
              <div key={r.type} className="data-card p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-foreground">{r.type}</span>
                  <span className={cn("text-xs font-bold font-mono", warning ? "text-status-warning" : "text-foreground")}>
                    {r.ytdKg} kg
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all", warning ? "bg-status-warning" : "bg-status-running")}
                    style={{ width: `${pct}%` }} />
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">Baseline: {r.baselineKg} kg · EPA limit: {r.limit} kg</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Initiatives */}
      <div>
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
          <Award className="h-3 w-3 inline mr-1" />Active Sustainability Initiatives
        </h2>
        <div className="space-y-2">
          {data.initiatives.map((init, i) => (
            <div key={i} className="data-card p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-foreground">{init.name}</span>
                <span className={cn("text-xs font-bold font-mono",
                  init.progress >= 80 ? "text-status-running" : "text-foreground"
                )}>{init.progress}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${init.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
