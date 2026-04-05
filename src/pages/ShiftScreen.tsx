import { useState } from "react";
import { shiftData } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

export default function ShiftScreen() {
  const [acknowledged, setAcknowledged] = useState(false);
  const data = shiftData;

  const eventTypeColors: Record<string, string> = {
    production: 'bg-primary',
    quality: 'bg-status-monitor',
    maintenance: 'bg-status-warning',
    safety: 'bg-status-running',
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-foreground">Shift Handover</h1>

      {/* Shift header */}
      <div className="data-card">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="metric-label mb-1">Outgoing</div>
            <p className="text-lg font-semibold text-foreground">{data.outgoingShift}</p>
            <p className="text-sm text-muted-foreground">{data.outgoingCrew}</p>
          </div>
          <div>
            <div className="metric-label mb-1">Incoming</div>
            <p className="text-lg font-semibold text-primary">{data.incomingShift}</p>
            <p className="text-sm text-muted-foreground">{data.incomingCrew}</p>
          </div>
        </div>
      </div>

      {/* Performance snapshot */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: 'Units Produced', value: data.unitsProduced.toLocaleString(), color: 'text-foreground' },
          { label: 'OEE', value: `${data.oee}%`, color: 'text-status-running' },
          { label: 'Downtime', value: `${data.downtimeMinutes}m`, color: 'text-status-warning' },
          { label: 'Waste', value: `${data.wasteKg} kg`, color: 'text-status-monitor' },
          { label: 'NCRs', value: data.ncrCount.toString(), color: data.ncrCount > 0 ? 'text-status-critical' : 'text-status-running' },
        ].map(m => (
          <div key={m.label} className="data-card text-center">
            <div className="metric-label">{m.label}</div>
            <div className={cn("metric-value mt-1", m.color)}>{m.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Open issues */}
        <div className="data-card">
          <div className="metric-label mb-3">Open Issues</div>
          <div className="space-y-2">
            {data.openIssues.map(issue => (
              <div key={issue.id} className={cn(
                "rounded-md border p-3 text-sm",
                issue.severity === 'RED' ? "border-status-critical/30 bg-status-critical/10 text-status-critical" : "border-status-warning/30 bg-status-warning/10 text-status-warning"
              )}>
                <div className="flex items-center gap-2">
                  <span className={cn("status-badge text-[10px]", issue.severity === 'RED' ? 'status-down' : 'status-warning')}>{issue.severity}</span>
                </div>
                <p className="mt-1 text-foreground">{issue.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Event chronology */}
        <div className="data-card">
          <div className="metric-label mb-3">Shift Events</div>
          <ScrollArea className="h-[240px] scrollbar-thin">
            <div className="space-y-3 pr-2">
              {data.events.map(event => (
                <div key={event.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={cn("h-2.5 w-2.5 rounded-full mt-1.5", eventTypeColors[event.type])} />
                    <div className="w-px flex-1 bg-border" />
                  </div>
                  <div className="pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">{event.time}</span>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{event.type}</span>
                    </div>
                    <p className="text-sm text-foreground">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Acknowledge button */}
      <div className="data-card flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">Handover Acknowledgement</p>
          <p className="text-xs text-muted-foreground">Incoming shift must acknowledge receipt of handover</p>
        </div>
        <Button
          disabled={acknowledged}
          onClick={() => { setAcknowledged(true); toast.success('Shift handover acknowledged'); }}
          className="h-12 px-8 text-lg font-bold"
          style={!acknowledged ? { background: 'hsl(142, 71%, 45%)', color: 'hsl(220, 20%, 7%)' } : undefined}
        >
          {acknowledged ? '✓ ACKNOWLEDGED' : '🔒 ACKNOWLEDGE HANDOVER'}
        </Button>
      </div>
    </div>
  );
}
