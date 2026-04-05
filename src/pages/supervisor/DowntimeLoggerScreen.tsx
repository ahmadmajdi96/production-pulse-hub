import { useState } from "react";
import { ArrowLeft, Clock, Plus, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface DowntimeEvent {
  id: string;
  line: string;
  startTime: string;
  endTime: string | null;
  durationMinutes: number | null;
  reasonCode: string;
  reasonCategory: string;
  operator: string;
  notes: string;
}

const reasonCategories = [
  { category: 'Mechanical', codes: ['Belt failure', 'Motor fault', 'Bearing wear', 'Conveyor jam'] },
  { category: 'Electrical', codes: ['Sensor failure', 'PLC fault', 'Wiring issue', 'Power outage'] },
  { category: 'Process', codes: ['Material shortage', 'Changeover', 'CIP required', 'Quality hold'] },
  { category: 'Operational', codes: ['Break', 'Shift change', 'No orders', 'Training'] },
];

const existingEvents: DowntimeEvent[] = [
  { id: 'dt1', line: 'Line 3', startTime: '09:00', endTime: '09:12', durationMinutes: 12, reasonCode: 'Material shortage', reasonCategory: 'Process', operator: 'M. Santos', notes: 'Carton blank replenishment' },
  { id: 'dt2', line: 'Line 5', startTime: '09:58', endTime: null, durationMinutes: null, reasonCode: 'Motor fault', reasonCategory: 'Mechanical', operator: 'System', notes: 'Conveyor belt motor fault — line stopped' },
];

export default function DowntimeLoggerScreen() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<DowntimeEvent[]>(existingEvents);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedLine, setSelectedLine] = useState('Line 3');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCode, setSelectedCode] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const totalDowntime = events.reduce((sum, e) => sum + (e.durationMinutes || 0), 0);
  const activeEvents = events.filter(e => !e.endTime);

  const handleAddEvent = () => {
    if (!selectedCode) { toast.error('Select a reason code'); return; }
    setSubmitting(true);
    setTimeout(() => {
      const newEvent: DowntimeEvent = {
        id: `dt-${Date.now()}`,
        line: selectedLine,
        startTime: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        endTime: null,
        durationMinutes: null,
        reasonCode: selectedCode,
        reasonCategory: selectedCategory,
        operator: 'J. Rodriguez',
        notes,
      };
      setEvents([newEvent, ...events]);
      setShowAdd(false);
      setSelectedCategory('');
      setSelectedCode('');
      setNotes('');
      setSubmitting(false);
      toast.success('Downtime event logged');
    }, 800);
  };

  const resolveEvent = (id: string) => {
    setEvents(prev => prev.map(e =>
      e.id === id ? { ...e, endTime: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }), durationMinutes: Math.floor(Math.random() * 20) + 5 } : e
    ));
    toast.info('Downtime event resolved');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/supervisor')} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-foreground">Downtime Logger</h1>
          <p className="text-xs text-muted-foreground">Structured reason coding · {events.length} events this shift</p>
        </div>
        <Button size="sm" onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? <X className="h-4 w-4" /> : <><Plus className="h-4 w-4 mr-1" /> Log</>}
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="data-card p-3 text-center">
          <p className="metric-label">Total Downtime</p>
          <p className="font-mono text-xl font-bold text-status-warning">{totalDowntime}m</p>
        </div>
        <div className="data-card p-3 text-center">
          <p className="metric-label">Events</p>
          <p className="font-mono text-xl font-bold text-foreground">{events.length}</p>
        </div>
        <div className="data-card p-3 text-center">
          <p className="metric-label">Active</p>
          <p className={cn("font-mono text-xl font-bold", activeEvents.length > 0 ? "text-status-critical" : "text-status-running")}>
            {activeEvents.length}
          </p>
        </div>
      </div>

      {/* Add event */}
      {showAdd && (
        <div className="data-card p-4 space-y-3 border-primary/30">
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">Line</label>
            <div className="flex gap-2">
              {['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5'].map(l => (
                <button key={l} onClick={() => setSelectedLine(l)} className={cn(
                  "rounded px-3 py-1.5 text-xs font-medium transition-all",
                  selectedLine === l ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>{l}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">Category</label>
            <div className="flex flex-wrap gap-1.5">
              {reasonCategories.map(c => (
                <button key={c.category} onClick={() => { setSelectedCategory(c.category); setSelectedCode(''); }} className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-all",
                  selectedCategory === c.category ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>{c.category}</button>
              ))}
            </div>
          </div>

          {selectedCategory && (
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Reason Code</label>
              <div className="grid grid-cols-2 gap-1.5">
                {reasonCategories.find(c => c.category === selectedCategory)?.codes.map(code => (
                  <button key={code} onClick={() => setSelectedCode(code)} className={cn(
                    "rounded border p-2 text-xs text-left transition-all",
                    selectedCode === code ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground hover:border-primary/30"
                  )}>{code}</button>
                ))}
              </div>
            </div>
          )}

          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Additional notes..." className="w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" rows={2} />

          <Button onClick={handleAddEvent} disabled={!selectedCode || submitting} className="w-full">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Log Downtime Event'}
          </Button>
        </div>
      )}

      {/* Event list */}
      <div className="space-y-2">
        {events.map(event => (
          <div key={event.id} className={cn(
            "data-card p-3",
            !event.endTime && "border-status-critical/30 animate-pulse"
          )}>
            <div className="flex items-start justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <Clock className={cn("h-4 w-4", event.endTime ? "text-muted-foreground" : "text-status-critical")} />
                <span className="text-sm font-semibold text-foreground">{event.line}</span>
                <span className="text-[10px] rounded px-1.5 py-0.5 bg-muted text-muted-foreground">{event.reasonCategory}</span>
              </div>
              <div className="text-right">
                <span className="font-mono text-xs text-muted-foreground">{event.startTime}{event.endTime ? ` – ${event.endTime}` : ''}</span>
                {event.durationMinutes && <span className="block font-mono text-xs font-bold text-foreground">{event.durationMinutes}m</span>}
              </div>
            </div>
            <p className="text-sm text-foreground">{event.reasonCode}</p>
            {event.notes && <p className="text-xs text-muted-foreground mt-0.5">{event.notes}</p>}
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] text-muted-foreground">{event.operator}</span>
              {!event.endTime && (
                <Button size="sm" variant="outline" className="h-6 text-[10px]" onClick={() => resolveEvent(event.id)}>
                  Resolve
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
