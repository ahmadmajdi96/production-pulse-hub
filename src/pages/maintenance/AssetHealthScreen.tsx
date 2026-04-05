import { useState } from "react";
import { ArrowLeft, Activity, ThermometerSun, Gauge, Zap, TrendingDown } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { workOrders } from "@/data/maintenanceMockData";
import { useSimulation, jitter } from "@/hooks/useSimulation";

interface SensorReading {
  label: string;
  icon: typeof Activity;
  value: number;
  unit: string;
  baseline: [number, number];
}

const baseSensors: SensorReading[] = [
  { label: 'Vibration', icon: Activity, value: 4.2, unit: 'mm/s', baseline: [0, 5.0] },
  { label: 'Temperature', icon: ThermometerSun, value: 62, unit: '°C', baseline: [40, 75] },
  { label: 'Motor Current', icon: Zap, value: 12.4, unit: 'A', baseline: [8, 15] },
  { label: 'Pressure', icon: Gauge, value: 3.8, unit: 'bar', baseline: [2.5, 4.5] },
];

const anomalies = [
  { sensor: 'Vibration', value: '6.8 mm/s', baseline: '0–5.0 mm/s', severity: 'WARNING' },
  { sensor: 'Temperature', value: '78 °C', baseline: '40–75 °C', severity: 'MONITOR' },
];

const cipHistory = [
  { date: '2026-04-04', type: 'Full Wash', result: 'PASS' },
  { date: '2026-04-01', type: 'Rinse Only', result: 'PASS' },
  { date: '2026-03-28', type: 'Full Wash', result: 'FAIL' },
  { date: '2026-03-25', type: 'Allergen Clean', result: 'PASS' },
  { date: '2026-03-21', type: 'Full Wash', result: 'PASS' },
];

export default function AssetHealthScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const assetId = searchParams.get('asset') || workOrders[0].assetId;
  const asset = workOrders.find(w => w.assetId === assetId) || workOrders[0];

  const sensors = useSimulation(baseSensors, prev =>
    prev.map(s => ({ ...s, value: jitter(s.value, 0.03) })), 5000
  );

  const failureProb = useSimulation(asset.assetHealthScore > 50 ? 35 : 78, prev =>
    Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 4)), 5000
  );

  const probColor = failureProb < 40 ? 'text-status-running' : failureProb < 65 ? 'text-status-monitor' : failureProb < 85 ? 'text-status-warning' : 'text-status-critical';

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
          <ArrowLeft className="h-4 w-4 text-foreground" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-foreground">{asset.assetName}</h1>
          <p className="text-[10px] text-muted-foreground font-mono">{asset.assetId} · {asset.line}, {asset.bay}</p>
        </div>
      </div>

      {/* Failure probability gauge */}
      <div className="data-card p-4 text-center">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Failure Probability</p>
        <div className="relative flex items-center justify-center">
          <div className={cn("text-5xl font-bold font-mono", probColor)}>{Math.round(failureProb)}</div>
          <span className="text-sm text-muted-foreground ml-1">%</span>
        </div>
        <div className="flex justify-center gap-4 mt-3 text-[10px]">
          <span className="text-status-running">0–40 Normal</span>
          <span className="text-status-monitor">40–65 Monitor</span>
          <span className="text-status-warning">65–85 Warning</span>
          <span className="text-status-critical">85–100 Critical</span>
        </div>
      </div>

      {/* Live sensor readings */}
      <div>
        <h2 className="text-xs font-bold text-foreground mb-2">Live Sensor Readings</h2>
        <div className="grid grid-cols-2 gap-2">
          {sensors.map(s => {
            const Icon = s.icon;
            const inRange = s.value >= s.baseline[0] && s.value <= s.baseline[1];
            return (
              <div key={s.label} className={cn("data-card p-3", !inRange && "border-status-warning/40")}>
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className="h-3 w-3 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">{s.label}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className={cn("text-xl font-bold font-mono", inRange ? "text-foreground" : "text-status-warning")}>{s.value.toFixed(1)}</span>
                  <span className="text-[10px] text-muted-foreground">{s.unit}</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">Range: {s.baseline[0]}–{s.baseline[1]} {s.unit}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Anomaly flags */}
      <div>
        <h2 className="text-xs font-bold text-foreground mb-2">Active Anomaly Flags</h2>
        {anomalies.map((a, i) => (
          <div key={i} className="data-card p-3 mb-2 border-status-warning/30">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-foreground">{a.sensor}</span>
                <p className="text-[10px] text-muted-foreground">Detected: {a.value} (baseline: {a.baseline})</p>
              </div>
              <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold",
                a.severity === 'WARNING' ? 'bg-status-warning/20 text-status-warning' : 'bg-status-monitor/20 text-status-monitor'
              )}>{a.severity}</span>
            </div>
          </div>
        ))}
      </div>

      {/* CIP history */}
      <div>
        <h2 className="text-xs font-bold text-foreground mb-2">CIP History (Last 5)</h2>
        <div className="data-card divide-y divide-border">
          {cipHistory.map((c, i) => (
            <div key={i} className="flex items-center justify-between px-3 py-2">
              <div>
                <span className="text-xs text-foreground">{c.type}</span>
                <p className="text-[10px] text-muted-foreground">{c.date}</p>
              </div>
              <span className={cn("text-[10px] font-bold",
                c.result === 'PASS' ? 'text-status-running' : 'text-status-critical'
              )}>{c.result}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
