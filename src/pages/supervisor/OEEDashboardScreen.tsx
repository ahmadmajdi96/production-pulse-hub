import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, TrendingDown, Minus, Clock, Wrench, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  currentOEE, oeeTargets, sixBigLosses, shiftTimeline, trendHistory, perLineOEE, activeDowntime,
  type OEEPillar, type ActiveDowntimeEvent,
} from "@/data/oeeMockData";

// Simple OEE gauge component
function OEEGauge({ label, value, target, size = 120 }: { label: string; value: number; target: number; size?: number }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius * 0.75;
  const normalizedValue = Math.min(1, value / 100);
  const strokeDashoffset = circumference * (1 - normalizedValue);
  const color = value >= target ? 'hsl(142, 71%, 45%)' : value >= target - 10 ? 'hsl(48, 96%, 53%)' : 'hsl(0, 84%, 60%)';
  const textClass = value >= target ? 'text-status-running' : value >= target - 10 ? 'text-status-warning' : 'text-status-critical';

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-[135deg]">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(220, 14%, 18%)" strokeWidth={7}
            strokeDasharray={`${circumference} ${2 * Math.PI * radius * 0.25}`} strokeLinecap="round" />
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={7}
            strokeDasharray={`${circumference} ${2 * Math.PI * radius * 0.25}`} strokeDashoffset={strokeDashoffset}
            strokeLinecap="round" className="transition-all duration-700" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-mono text-xl font-bold", textClass)}>{value.toFixed(1)}</span>
          <span className="text-[10px] text-muted-foreground">%</span>
        </div>
      </div>
      <span className="text-xs font-semibold text-foreground">{label}</span>
      <span className="text-[10px] text-muted-foreground">Target: {target}%</span>
    </div>
  );
}

const pillarColors: Record<string, string> = {
  availability: 'bg-primary',
  performance: 'bg-status-warning',
  quality: 'bg-status-running',
};

const timelineColors: Record<string, string> = {
  running: 'bg-status-running',
  'planned-down': 'bg-primary',
  'unplanned-down': 'bg-status-critical',
  'reduced-speed': 'bg-status-warning',
  idle: 'bg-muted',
};

const timelineLabels: Record<string, string> = {
  running: 'Running',
  'planned-down': 'Planned',
  'unplanned-down': 'Unplanned',
  'reduced-speed': 'Slow',
  idle: 'Idle',
};

function toMinutes(t: string) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

export default function OEEDashboardScreen() {
  const navigate = useNavigate();
  const [oee, setOee] = useState<OEEPillar>(currentOEE);
  const [downtimeEvents, setDowntimeEvents] = useState<ActiveDowntimeEvent[]>(activeDowntime);

  // Simulate jitter on OEE values
  useEffect(() => {
    const id = setInterval(() => {
      setOee(prev => {
        const jitter = () => +(Math.random() * 0.6 - 0.3).toFixed(1);
        const a = Math.min(100, Math.max(0, prev.availability + jitter()));
        const p = Math.min(100, Math.max(0, prev.performance + jitter()));
        const q = Math.min(100, Math.max(0, prev.quality + jitter()));
        return { availability: a, performance: p, quality: q, oee: +((a * p * q) / 10000).toFixed(1) };
      });
    }, 10000);
    return () => clearInterval(id);
  }, []);

  // Count up active downtime
  useEffect(() => {
    const id = setInterval(() => {
      setDowntimeEvents(prev => prev.map(e => ({ ...e, durationMin: e.durationMin + 1 })));
    }, 60000);
    return () => clearInterval(id);
  }, []);

  const totalLossMin = sixBigLosses.reduce((s, l) => s + l.minutes, 0);
  const shiftStart = 6 * 60; // 06:00
  const shiftEnd = 14 * 60; // 14:00
  const shiftDuration = shiftEnd - shiftStart;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">OEE Dashboard</h1>
        <p className="text-sm text-muted-foreground">Shift A · 06:00–14:00 · All Lines</p>
      </div>

      {/* Section 1: KPI Gauges */}
      <div className="grid grid-cols-4 gap-2">
        <div className="data-card flex items-center justify-center p-3">
          <OEEGauge label="OEE" value={oee.oee} target={oeeTargets.oee} size={130} />
        </div>
        <div className="data-card flex items-center justify-center p-3">
          <OEEGauge label="Availability" value={oee.availability} target={oeeTargets.availability} />
        </div>
        <div className="data-card flex items-center justify-center p-3">
          <OEEGauge label="Performance" value={oee.performance} target={oeeTargets.performance} />
        </div>
        <div className="data-card flex items-center justify-center p-3">
          <OEEGauge label="Quality" value={oee.quality} target={oeeTargets.quality} />
        </div>
      </div>

      {/* Section 2: Six Big Losses Pareto */}
      <div className="data-card p-4">
        <h2 className="text-sm font-bold text-foreground mb-3">Six Big Losses</h2>
        <div className="space-y-2">
          {sixBigLosses
            .sort((a, b) => b.minutes - a.minutes)
            .map(loss => {
              const pct = totalLossMin > 0 ? (loss.minutes / totalLossMin) * 100 : 0;
              return (
                <div key={loss.name} className="flex items-center gap-3">
                  <span className="w-32 text-xs text-muted-foreground truncate">{loss.name}</span>
                  <div className="flex-1 h-5 rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all duration-500", pillarColors[loss.pillar])}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-12 text-right font-mono text-xs text-foreground">{loss.minutes}m</span>
                  <span className="w-10 text-right font-mono text-[10px] text-muted-foreground">{pct.toFixed(0)}%</span>
                </div>
              );
            })}
        </div>
        <div className="flex items-center gap-4 mt-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" /> Availability</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-status-warning" /> Performance</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-status-running" /> Quality</span>
        </div>
      </div>

      {/* Section 3: Shift Timeline */}
      <div className="data-card p-4">
        <h2 className="text-sm font-bold text-foreground mb-3">Shift Timeline</h2>
        <div className="flex h-8 rounded-lg overflow-hidden gap-px">
          {shiftTimeline.map((event, i) => {
            const startMin = toMinutes(event.start) - shiftStart;
            const endMin = toMinutes(event.end) - shiftStart;
            const widthPct = ((endMin - startMin) / shiftDuration) * 100;
            return (
              <div
                key={i}
                className={cn("relative group cursor-default", timelineColors[event.type])}
                style={{ width: `${widthPct}%` }}
                title={`${event.start}–${event.end}: ${event.reason || event.type}`}
              >
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 hidden group-hover:block z-10 whitespace-nowrap rounded bg-background border border-border px-2 py-1 text-[10px] text-foreground shadow-lg">
                  {event.start}–{event.end} · {event.reason || event.type}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-1 text-[10px] text-muted-foreground font-mono">
          <span>06:00</span><span>08:00</span><span>10:00</span><span>12:00</span><span>14:00</span>
        </div>
        <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground flex-wrap">
          {Object.entries(timelineLabels).map(([key, label]) => (
            <span key={key} className="flex items-center gap-1">
              <span className={cn("h-2 w-2 rounded-sm", timelineColors[key])} /> {label}
            </span>
          ))}
        </div>
      </div>

      {/* Section 4: 7-Shift Trend */}
      <div className="data-card p-4">
        <h2 className="text-sm font-bold text-foreground mb-3">7-Shift Trend</h2>
        <div className="grid grid-cols-7 gap-1">
          {trendHistory.map((point, i) => {
            const prev = i > 0 ? trendHistory[i - 1].oee : point.oee;
            const trend = point.oee > prev ? 'up' : point.oee < prev ? 'down' : 'stable';
            const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
            const trendColor = trend === 'up' ? 'text-status-running' : trend === 'down' ? 'text-status-critical' : 'text-muted-foreground';
            const isLast = i === trendHistory.length - 1;
            return (
              <div key={point.shift} className={cn("rounded-lg p-2 text-center", isLast ? "bg-primary/10 border border-primary/30" : "bg-muted/50")}>
                <p className="text-[10px] text-muted-foreground mb-1 truncate">{point.shift}</p>
                <p className={cn("font-mono text-sm font-bold", point.oee >= oeeTargets.oee ? "text-status-running" : point.oee >= 75 ? "text-status-warning" : "text-status-critical")}>
                  {point.oee}%
                </p>
                <TrendIcon className={cn("h-3 w-3 mx-auto mt-0.5", trendColor)} />
                <div className="mt-1 space-y-0.5">
                  <div className="flex justify-between text-[8px]">
                    <span className="text-muted-foreground">A</span>
                    <span className="font-mono text-foreground">{point.availability}</span>
                  </div>
                  <div className="flex justify-between text-[8px]">
                    <span className="text-muted-foreground">P</span>
                    <span className="font-mono text-foreground">{point.performance}</span>
                  </div>
                  <div className="flex justify-between text-[8px]">
                    <span className="text-muted-foreground">Q</span>
                    <span className="font-mono text-foreground">{point.quality}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 5: Per-Line Comparison */}
      <div className="data-card p-4">
        <h2 className="text-sm font-bold text-foreground mb-3">Per-Line OEE</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-muted-foreground border-b border-border">
                <th className="text-left py-2 font-medium">Line</th>
                <th className="text-right py-2 font-medium">OEE</th>
                <th className="text-right py-2 font-medium">Avail</th>
                <th className="text-right py-2 font-medium">Perf</th>
                <th className="text-right py-2 font-medium">Qual</th>
                <th className="text-left py-2 pl-3 font-medium">Status</th>
                <th className="text-left py-2 font-medium">Top Loss</th>
              </tr>
            </thead>
            <tbody>
              {perLineOEE.map(line => (
                <tr key={line.line} className="border-b border-border/50 hover:bg-muted/30 cursor-pointer" onClick={() => navigate('/operator')}>
                  <td className="py-2 font-semibold text-foreground">{line.line}</td>
                  <td className={cn("py-2 text-right font-mono font-bold",
                    line.oee === 0 ? "text-muted-foreground" :
                    line.oee >= oeeTargets.oee ? "text-status-running" :
                    line.oee >= 75 ? "text-status-warning" : "text-status-critical"
                  )}>{line.oee > 0 ? `${line.oee}%` : '—'}</td>
                  <td className="py-2 text-right font-mono text-muted-foreground">{line.availability > 0 ? `${line.availability}%` : '—'}</td>
                  <td className="py-2 text-right font-mono text-muted-foreground">{line.performance > 0 ? `${line.performance}%` : '—'}</td>
                  <td className="py-2 text-right font-mono text-muted-foreground">{line.quality > 0 ? `${line.quality}%` : '—'}</td>
                  <td className="py-2 pl-3">
                    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold",
                      line.status === 'RUNNING' ? 'bg-status-running/20 text-status-running' :
                      line.status === 'CIP' ? 'bg-status-transition/20 text-status-transition' :
                      'bg-muted text-muted-foreground'
                    )}>{line.status}</span>
                  </td>
                  <td className="py-2 text-muted-foreground">{line.topLoss}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 6: Active Downtime */}
      <div className="data-card p-4">
        <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-status-critical" /> Active Downtime Events
        </h2>
        {downtimeEvents.length > 0 ? (
          <div className="space-y-2">
            {downtimeEvents.map(event => (
              <div key={event.id} className="rounded-lg border border-status-critical/30 bg-status-critical/5 p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{event.equipment}</p>
                    <p className="text-[10px] text-muted-foreground">{event.line} · Started {event.startedAt}</p>
                    <p className="text-xs text-muted-foreground mt-1">{event.reason}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-lg font-bold text-status-critical">{event.durationMin}m</span>
                    {event.technicianWO && (
                      <p className="text-[10px] text-primary cursor-pointer hover:underline mt-0.5"
                        onClick={(e) => { e.stopPropagation(); navigate(`/maintenance/wo?id=${event.technicianWO}`); }}>
                        <Wrench className="h-3 w-3 inline mr-0.5" />{event.technicianWO}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">No active downtime events</p>
        )}
      </div>
    </div>
  );
}
