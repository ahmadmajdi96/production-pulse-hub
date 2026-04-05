import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { alerts } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AlertTriangle, AlertCircle, Info, CheckCircle2, Wrench } from "lucide-react";

const severityConfig = {
  CRITICAL: { icon: AlertCircle, bg: 'bg-destructive', text: 'text-destructive-foreground', border: 'border-destructive' },
  HIGH: { icon: AlertTriangle, bg: 'bg-status-warning/15', text: 'text-status-warning', border: 'border-status-warning/30' },
  MEDIUM: { icon: Info, bg: 'bg-status-monitor/15', text: 'text-status-monitor', border: 'border-status-monitor/30' },
  LOW: { icon: Info, bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-border' },
};

export default function AlertScreen() {
  const navigate = useNavigate();
  const [alertList, setAlertList] = useState(alerts);

  const criticalAlert = alertList.find(a => a.severity === 'CRITICAL' && !a.acknowledged);
  const highAlert = alertList.find(a => a.severity === 'HIGH' && !a.acknowledged);

  const acknowledge = (id: string) => {
    setAlertList(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true, acknowledgedBy: 'Operator' } : a));
  };

  // Full-screen CRITICAL takeover
  if (criticalAlert) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-destructive animate-flash-red p-8">
        <AlertCircle className="h-20 w-20 text-destructive-foreground mb-6" />
        <h1 className="text-4xl font-bold text-destructive-foreground text-center mb-4">
          CRITICAL ALERT
        </h1>
        <p className="text-xl text-destructive-foreground/90 text-center max-w-2xl mb-2">{criticalAlert.message}</p>
        <p className="text-sm text-destructive-foreground/70 mb-8">Source: {criticalAlert.source} · {criticalAlert.timestamp}</p>
        <Button
          onClick={() => acknowledge(criticalAlert.id)}
          className="h-16 px-12 text-xl font-bold bg-destructive-foreground text-destructive hover:bg-destructive-foreground/90"
        >
          ACKNOWLEDGE
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-foreground">Alerts</h1>

      {/* HIGH alert banner */}
      {highAlert && (
        <div className="rounded-lg border border-status-warning/30 bg-status-warning/15 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-status-warning flex-shrink-0" />
            <div>
              <p className="font-semibold text-status-warning">{highAlert.message}</p>
              <p className="text-xs text-muted-foreground">{highAlert.source} · {highAlert.timestamp}</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => acknowledge(highAlert.id)} className="border-status-warning/30 text-status-warning shrink-0">
            ACKNOWLEDGE
          </Button>
        </div>
      )}

      {/* Alert history */}
      <div className="space-y-2">
        {alertList.map(alert => {
          const config = severityConfig[alert.severity];
          const Icon = config.icon;
          return (
            <div key={alert.id} className={cn("data-card flex items-center gap-4 border", config.border, alert.acknowledged && "opacity-60")}>
              <Icon className={cn("h-5 w-5 flex-shrink-0", config.text)} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={cn("status-badge text-[10px]", `status-${alert.severity === 'CRITICAL' ? 'down' : alert.severity === 'HIGH' ? 'warning' : alert.severity === 'MEDIUM' ? 'monitor' : 'idle'}`)}>
                    {alert.severity}
                  </span>
                  <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                </div>
                <p className="mt-1 text-sm text-foreground truncate">{alert.message}</p>
                <p className="text-xs text-muted-foreground">{alert.source}</p>
              </div>
              {alert.acknowledged ? (
                <div className="flex items-center gap-1 text-xs text-status-running">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{alert.acknowledgedBy}</span>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={() => acknowledge(alert.id)}>ACK</Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
