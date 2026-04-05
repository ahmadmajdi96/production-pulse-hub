import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Clock, Camera, Wrench, Play, Pause, CheckCircle2, AlertTriangle, Package, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { workOrders, type WorkOrder } from "@/data/maintenanceMockData";
import { useToast } from "@/hooks/use-toast";

const statusFlow: Record<string, string> = {
  OPEN: 'IN-PROGRESS',
  'IN-PROGRESS': 'COMPLETED',
  'AWAITING-PARTS': 'IN-PROGRESS',
};

export default function WorkOrderDetailScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const woId = searchParams.get('id') || workOrders[0].id;
  const { toast } = useToast();

  const [wo, setWo] = useState<WorkOrder>(() => workOrders.find(w => w.id === woId) || workOrders[0]);
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [parts, setParts] = useState<{ name: string; qty: number }[]>([]);
  const [partName, setPartName] = useState('');

  const advanceStatus = () => {
    const next = statusFlow[wo.status];
    if (!next) return;
    if (wo.requiresLOTO && wo.status === 'OPEN') {
      navigate('/maintenance/loto');
      return;
    }
    setWo(prev => ({ ...prev, status: next as any }));
    toast({ title: `Status → ${next}`, description: `Work order ${wo.id} updated` });
  };

  const addPhoto = () => {
    setPhotos(prev => [...prev, `photo_${Date.now()}.jpg`]);
    toast({ title: 'Photo captured', description: 'Fault photo added to work order' });
  };

  const addPart = () => {
    if (!partName.trim()) return;
    setParts(prev => [...prev, { name: partName.trim(), qty: 1 }]);
    setPartName('');
    toast({ title: 'Part logged', description: `${partName} added` });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/maintenance')} className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
          <ArrowLeft className="h-4 w-4 text-foreground" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-foreground">{wo.assetName}</h1>
          <p className="text-[10px] text-muted-foreground font-mono">{wo.id} · {wo.line}, {wo.bay}</p>
        </div>
        <span className={cn(
          "rounded-full px-3 py-1 text-[10px] font-bold",
          wo.status === 'OPEN' ? 'bg-status-warning/20 text-status-warning' :
          wo.status === 'IN-PROGRESS' ? 'bg-primary/20 text-primary' :
          wo.status === 'COMPLETED' ? 'bg-status-running/20 text-status-running' :
          'bg-status-monitor/20 text-status-monitor'
        )}>{wo.status}</span>
      </div>

      {/* Context card */}
      <div className="data-card p-4 space-y-3">
        <p className="text-sm text-foreground">{wo.description}</p>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-[10px] text-muted-foreground">Priority</p>
            <span className={cn("rounded px-2 py-0.5 text-xs font-bold",
              wo.priority === 'P1' ? 'bg-status-critical text-background' :
              wo.priority === 'P2' ? 'bg-status-warning text-background' :
              'bg-muted text-muted-foreground'
            )}>{wo.priority}</span>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Health Score</p>
            <span className={cn("font-mono text-lg font-bold",
              wo.assetHealthScore < 30 ? "text-status-critical" :
              wo.assetHealthScore < 60 ? "text-status-warning" :
              "text-status-running"
            )}>{wo.assetHealthScore}</span>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">SLA</p>
            <span className={cn("font-mono text-lg font-bold",
              wo.slaRemaining < 30 ? "text-status-critical" : "text-foreground"
            )}>{wo.slaRemaining}m</span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Raised {wo.timeRaised}</span>
          {wo.requiresLOTO && <span className="text-status-warning">🔒 LOTO Required</span>}
          {wo.hasPTW && <span className="text-status-running">✅ PTW Issued</span>}
        </div>
      </div>

      {/* Status controls */}
      {wo.status !== 'COMPLETED' && (
        <div className="flex gap-2">
          <button onClick={advanceStatus} className={cn(
            "flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all",
            wo.status === 'OPEN' ? 'bg-primary text-primary-foreground' :
            wo.status === 'IN-PROGRESS' ? 'bg-status-running text-background' :
            'bg-status-monitor text-background'
          )}>
            {wo.status === 'OPEN' && <><Play className="h-4 w-4" /> Start Work</>}
            {wo.status === 'IN-PROGRESS' && <><CheckCircle2 className="h-4 w-4" /> Complete</>}
            {wo.status === 'AWAITING-PARTS' && <><Package className="h-4 w-4" /> Parts Arrived</>}
          </button>
          {wo.status === 'IN-PROGRESS' && (
            <button onClick={() => setWo(prev => ({ ...prev, status: 'AWAITING-PARTS' }))}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-status-monitor/20 px-4 py-3 text-xs font-bold text-status-monitor">
              <Pause className="h-4 w-4" /> Awaiting Parts
            </button>
          )}
        </div>
      )}

      {/* Photo capture */}
      <div className="data-card p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-foreground">📷 Fault Photos</h3>
          <button onClick={addPhoto} className="flex items-center gap-1 rounded-lg bg-muted px-3 py-1.5 text-[10px] font-medium text-foreground">
            <Camera className="h-3 w-3" /> Capture
          </button>
        </div>
        {photos.length > 0 ? (
          <div className="flex gap-2 flex-wrap">
            {photos.map((p, i) => (
              <div key={i} className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-[10px] text-muted-foreground">📸 {i + 1}</div>
            ))}
          </div>
        ) : (
          <p className="text-[10px] text-muted-foreground">No photos captured yet</p>
        )}
      </div>

      {/* Parts consumed */}
      <div className="data-card p-3">
        <h3 className="text-xs font-bold text-foreground mb-2">🔧 Parts Consumed</h3>
        <div className="flex gap-2 mb-2">
          <input value={partName} onChange={e => setPartName(e.target.value)} placeholder="Part name or scan..."
            className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground" />
          <button onClick={addPart} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground">Add</button>
        </div>
        {parts.map((p, i) => (
          <div key={i} className="flex items-center justify-between rounded-lg bg-muted px-3 py-1.5 mb-1 text-xs text-foreground">
            <span>{p.name}</span><span className="text-muted-foreground">×{p.qty}</span>
          </div>
        ))}
      </div>

      {/* Notes */}
      <div className="data-card p-3">
        <h3 className="text-xs font-bold text-foreground mb-2">📝 Technician Notes</h3>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Describe findings, actions taken..."
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground min-h-[80px]" />
      </div>

      {wo.status === 'COMPLETED' && (
        <div className="rounded-xl bg-status-running/10 border border-status-running/30 p-4 text-center">
          <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-status-running" />
          <p className="text-sm font-bold text-status-running">Work Order Completed</p>
          <p className="text-[10px] text-muted-foreground mt-1">{photos.length} photos · {parts.length} parts logged</p>
        </div>
      )}
    </div>
  );
}
