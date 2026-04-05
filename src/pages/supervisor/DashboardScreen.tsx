import { Activity, AlertTriangle, ArrowDown, ArrowUp, Minus, TrendingUp, TrendingDown, Package, Wrench, Rocket, Droplets } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { cn } from "@/lib/utils";
import {
  supervisorLines,
  supervisorAlerts,
  shiftMetrics,
  upcomingActions,
} from "@/data/supervisorMockData";
import { useNavigate } from "react-router-dom";

const trendIcon = { up: ArrowUp, down: ArrowDown, stable: Minus };
const actionIcons = { run_start: Rocket, cip_window: Droplets, maintenance: Wrench };

export default function DashboardScreen() {
  const navigate = useNavigate();
  const criticalAlerts = supervisorAlerts.filter(a => a.severity === 'CRITICAL' && !a.acknowledged);
  const highAlerts = supervisorAlerts.filter(a => a.severity === 'HIGH' && !a.acknowledged);

  const unitsDelta = ((shiftMetrics.totalUnitsProduced - shiftMetrics.lastWeekUnits) / shiftMetrics.lastWeekUnits * 100).toFixed(1);
  const oeeDelta = (shiftMetrics.oeeAverage - shiftMetrics.lastWeekOee).toFixed(1);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Supervisor Dashboard</h1>
          <p className="text-sm text-muted-foreground">Day Shift A · Crew Alpha · 5 Lines</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-lg font-bold text-foreground">
            {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
          </p>
          <p className="text-xs text-muted-foreground">
            {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Critical alerts */}
      {criticalAlerts.map(alert => (
        <div key={alert.id} className="rounded-lg border-2 border-status-critical bg-status-critical/10 p-3 animate-pulse">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-status-critical" />
            <span className="text-sm font-semibold text-status-critical">CRITICAL</span>
            <span className="text-xs text-muted-foreground ml-auto">{alert.timestamp}</span>
          </div>
          <p className="mt-1 text-sm text-foreground">{alert.message}</p>
        </div>
      ))}

      {/* High alerts */}
      {highAlerts.map(alert => (
        <div key={alert.id} className="rounded-lg border border-status-warning bg-status-warning/10 p-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-status-warning" />
            <span className="text-xs font-semibold text-status-warning">HIGH</span>
            <span className="flex-1 text-xs text-foreground truncate">{alert.message}</span>
            <span className="text-[10px] text-muted-foreground">{alert.timestamp}</span>
          </div>
        </div>
      ))}

      {/* Shift summary metrics */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Units Produced', value: shiftMetrics.totalUnitsProduced.toLocaleString(), delta: `${unitsDelta}%`, positive: Number(unitsDelta) >= 0 },
          { label: 'OEE Average', value: `${shiftMetrics.oeeAverage}%`, delta: `${oeeDelta}%`, positive: Number(oeeDelta) >= 0 },
          { label: 'Waste Events', value: shiftMetrics.wasteEvents.toString(), delta: null, positive: true },
          { label: 'NCRs Raised', value: shiftMetrics.ncrsRaised.toString(), delta: null, positive: true },
        ].map(m => (
          <div key={m.label} className="data-card p-3">
            <p className="metric-label">{m.label}</p>
            <p className="metric-value text-xl">{m.value}</p>
            {m.delta && (
              <p className={cn("text-[10px] flex items-center gap-0.5 mt-1", m.positive ? "text-status-running" : "text-status-critical")}>
                {m.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                vs last week
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Line status cards */}
      <div>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Production Lines</h2>
        <div className="space-y-2">
          {supervisorLines.map(line => {
            const TrendIcon = trendIcon[line.throughputTrend];
            const throughputPct = line.throughputTarget > 0 ? ((line.throughputActual / line.throughputTarget) * 100).toFixed(0) : '—';
            return (
              <div
                key={line.id}
                onClick={() => navigate('/supervisor/run-detail')}
                className="data-card flex items-center gap-4 p-3 cursor-pointer hover:border-primary/30 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-foreground">{line.name}</span>
                    <StatusBadge status={line.status} className="text-[10px]" />
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{line.currentProduct}</p>
                </div>
                <div className="text-center">
                  <p className="font-mono text-lg font-bold text-foreground">{line.oee > 0 ? `${line.oee}%` : '—'}</p>
                  <p className="metric-label">OEE</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-sm font-bold text-foreground">{throughputPct}%</span>
                    <TrendIcon className={cn("h-3 w-3", line.throughputTrend === 'up' ? 'text-status-running' : line.throughputTrend === 'down' ? 'text-status-critical' : 'text-muted-foreground')} />
                  </div>
                  <p className="metric-label">Throughput</p>
                </div>
                {line.activeAlertCount > 0 && (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-status-critical text-[10px] font-bold text-background">
                    {line.activeAlertCount}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming actions */}
      <div>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Upcoming (Next 2 Hours)</h2>
        <div className="space-y-2">
          {upcomingActions.map(action => {
            const ActionIcon = actionIcons[action.type];
            return (
              <div key={action.id} className="data-card flex items-center gap-3 p-3">
                <div className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg",
                  action.type === 'run_start' ? 'bg-primary/20 text-primary' :
                  action.type === 'cip_window' ? 'bg-status-monitor/20 text-status-monitor' :
                  'bg-status-transition/20 text-status-transition'
                )}>
                  <ActionIcon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{action.description}</p>
                  <p className="text-[10px] text-muted-foreground">{action.scheduledTime}</p>
                </div>
                {action.type === 'run_start' && (
                  <span className={cn(
                    "text-[10px] font-medium rounded px-1.5 py-0.5",
                    action.preStartComplete ? "bg-status-running/20 text-status-running" : "bg-status-warning/20 text-status-warning"
                  )}>
                    {action.preStartComplete ? 'READY' : 'CHECKS PENDING'}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
