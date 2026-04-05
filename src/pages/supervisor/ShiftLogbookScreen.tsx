import { useState } from "react";
import { ArrowLeft, Plus, Bot, User, AlertTriangle, Wrench, Eye, Shield, Zap, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { shiftLogEntries, type LogEntry } from "@/data/supervisorMockData";

const typeIcons: Record<string, typeof AlertTriangle> = {
  observation: Eye,
  instruction: FileText,
  visitor: User,
  safety: Shield,
  equipment: Wrench,
  quality: AlertTriangle,
  auto_downtime: Zap,
  auto_alert: AlertTriangle,
  auto_ncr: FileText,
};

const typeColors: Record<string, string> = {
  observation: 'text-primary',
  instruction: 'text-status-monitor',
  visitor: 'text-muted-foreground',
  safety: 'text-status-running',
  equipment: 'text-status-transition',
  quality: 'text-status-warning',
  auto_downtime: 'text-status-idle',
  auto_alert: 'text-status-critical',
  auto_ncr: 'text-status-critical',
};

const entryTypes = [
  { value: 'observation', label: 'Observation' },
  { value: 'instruction', label: 'Instruction' },
  { value: 'visitor', label: 'Visitor' },
  { value: 'safety', label: 'Safety' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'quality', label: 'Quality' },
];

export default function ShiftLogbookScreen() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<LogEntry[]>(shiftLogEntries);
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [newType, setNewType] = useState('observation');
  const [newText, setNewText] = useState('');

  const handleAddEntry = () => {
    if (!newText.trim()) { toast.error('Enter a description'); return; }
    const entry: LogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      type: newType as LogEntry['type'],
      description: newText,
      author: 'J. Rodriguez',
      isAutomatic: false,
    };
    setEntries([entry, ...entries]);
    setNewText('');
    setShowAddEntry(false);
    toast.success('Log entry added');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/supervisor')} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-foreground">Shift Logbook</h1>
          <p className="text-xs text-muted-foreground">Day Shift A · {entries.length} entries</p>
        </div>
        <Button size="sm" onClick={() => setShowAddEntry(!showAddEntry)}>
          {showAddEntry ? <X className="h-4 w-4" /> : <><Plus className="h-4 w-4 mr-1" /> Entry</>}
        </Button>
      </div>

      {/* Add entry panel */}
      {showAddEntry && (
        <div className="data-card p-4 space-y-3 border-primary/30">
          <div className="flex flex-wrap gap-1.5">
            {entryTypes.map(t => (
              <button
                key={t.value}
                onClick={() => setNewType(t.value)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-all",
                  newType === t.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Describe the event or observation..."
            className="w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            rows={2}
            autoFocus
          />
          <Button onClick={handleAddEntry} className="w-full">Add Entry</Button>
        </div>
      )}

      {/* Log feed */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[18px] top-0 bottom-0 w-px bg-border" />

        <div className="space-y-0">
          {[...entries].sort((a, b) => b.timestamp.localeCompare(a.timestamp)).map(entry => {
            const Icon = typeIcons[entry.type] || Eye;
            const color = typeColors[entry.type] || 'text-muted-foreground';

            return (
              <div key={entry.id} className="relative flex gap-3 py-2">
                {/* Icon */}
                <div className={cn(
                  "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border",
                  entry.isAutomatic ? "border-border bg-muted" : "border-primary/30 bg-card"
                )}>
                  {entry.isAutomatic
                    ? <Bot className="h-3.5 w-3.5 text-muted-foreground" />
                    : <Icon className={cn("h-3.5 w-3.5", color)} />
                  }
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-xs text-muted-foreground">{entry.timestamp}</span>
                    <span className={cn("text-[10px] font-medium uppercase", color)}>
                      {entry.type.replace('auto_', '').replace('_', ' ')}
                    </span>
                    {entry.linkedRecord && (
                      <span className="text-[10px] font-mono text-primary">{entry.linkedRecord}</span>
                    )}
                  </div>
                  <p className="text-sm text-foreground leading-snug">{entry.description}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{entry.author}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
