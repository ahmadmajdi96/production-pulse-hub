import { useState } from "react";
import { Bell, Package, ShieldAlert, Wrench, HelpCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { andonCalls, type AndonCall } from "@/data/mockData";
import { toast } from "sonner";

const callTypes = [
  { type: 'MATERIAL', label: 'Material Needed', icon: Package, color: 'bg-status-idle' },
  { type: 'QUALITY', label: 'Quality Issue', icon: ShieldAlert, color: 'bg-status-critical' },
  { type: 'EQUIPMENT', label: 'Equipment Fault', icon: Wrench, color: 'bg-status-transition' },
  { type: 'PROCESS', label: 'Process Help', icon: HelpCircle, color: 'bg-primary' },
] as const;

export function AndonButton() {
  const [open, setOpen] = useState(false);
  const [activeCall, setActiveCall] = useState<AndonCall | null>(null);
  const [description, setDescription] = useState('');

  const handleRaiseCall = (type: string) => {
    setActiveCall({
      id: `an-${Date.now()}`,
      type: type as AndonCall['type'],
      status: 'ACTIVE',
      raisedAt: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      slaMinutes: type === 'QUALITY' ? 5 : type === 'EQUIPMENT' ? 15 : 10,
      elapsedMinutes: 0,
      description: description || `${type} call raised`,
      line: 'Line 3',
      station: 'Filler',
    });
    setDescription('');
    toast.success('Andon call raised successfully');
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-destructive shadow-lg shadow-destructive/30 transition-transform hover:scale-110 active:scale-95"
      >
        <Bell className="h-6 w-6 text-destructive-foreground" />
      </button>

      {/* Overlay panel */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Andon Call</h2>
              <button onClick={() => { setOpen(false); setActiveCall(null); }} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            {!activeCall ? (
              <>
                {/* Call type selector */}
                <div className="mb-6 grid grid-cols-2 gap-3">
                  {callTypes.map(({ type, label, icon: Icon, color }) => (
                    <button
                      key={type}
                      onClick={() => handleRaiseCall(type)}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-lg border border-border bg-secondary p-4 transition-all hover:border-primary/50 active:scale-95"
                      )}
                    >
                      <div className={cn("flex h-12 w-12 items-center justify-center rounded-full", color)}>
                        <Icon className="h-6 w-6 text-background" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{label}</span>
                    </button>
                  ))}
                </div>

                {/* Location info */}
                <div className="mb-4 rounded-lg bg-muted p-3 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Line</span><span className="text-foreground">Line 3</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Station</span><span className="text-foreground">Filler</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Product</span><span className="text-foreground">Premium OJ 1L</span></div>
                </div>

                {/* Detail entry */}
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add details (optional)..."
                  className="mb-4 w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  rows={2}
                />

                {/* Recent calls */}
                <div>
                  <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Recent Calls</h3>
                  <div className="space-y-2">
                    {andonCalls.slice(0, 3).map(call => (
                      <div key={call.id} className="flex items-center justify-between rounded-md bg-muted p-2 text-xs">
                        <span className="font-medium text-foreground">{call.type}</span>
                        <span className="text-muted-foreground">{call.raisedAt} · {call.elapsedMinutes}m</span>
                        <span className="status-badge status-running text-[10px]">RESOLVED</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* Active call display */
              <div className="space-y-4">
                <div className="rounded-lg border border-status-warning bg-status-warning/10 p-4 text-center">
                  <p className="text-lg font-semibold text-status-warning">Call Active</p>
                  <p className="text-2xl font-mono font-bold text-foreground mt-2">
                    SLA: {activeCall.slaMinutes}:00
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{activeCall.type} — {activeCall.line}, {activeCall.station}</p>
                </div>
                <Button
                  onClick={() => { setActiveCall(null); setOpen(false); toast.info('Call resolved'); }}
                  className="w-full"
                  variant="outline"
                >
                  Cancel Call
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
