import { useState } from "react";
import { ArrowLeft, Camera, CheckCircle2, XCircle, MinusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface PMItem {
  id: string;
  description: string;
  category: string;
  type: 'qualitative' | 'quantitative';
  acceptance?: string;
  unit?: string;
  result: 'PASS' | 'FAIL' | 'N/A' | null;
  measurement?: number;
  photoTaken: boolean;
}

const initialItems: PMItem[] = [
  { id: 'pm1', description: 'Belt tension within spec', category: 'Drive Components', type: 'quantitative', unit: 'N/m', acceptance: '150–220 N/m', result: null, photoTaken: false },
  { id: 'pm2', description: 'Chain lubrication grade check', category: 'Drive Components', type: 'qualitative', result: null, photoTaken: false },
  { id: 'pm3', description: 'Motor winding temperature', category: 'Electrical', type: 'quantitative', unit: '°C', acceptance: '< 85 °C', result: null, photoTaken: false },
  { id: 'pm4', description: 'Terminal tightness verified', category: 'Electrical', type: 'qualitative', result: null, photoTaken: false },
  { id: 'pm5', description: 'Bearing lubrication applied', category: 'Lubrication', type: 'qualitative', result: null, photoTaken: false },
  { id: 'pm6', description: 'Seals and gaskets — visual inspection', category: 'Seals & Gaskets', type: 'qualitative', result: null, photoTaken: false },
  { id: 'pm7', description: 'Safety guard position and latching', category: 'Safety', type: 'qualitative', result: null, photoTaken: false },
  { id: 'pm8', description: 'Food-grade lubricant applied to contact surfaces', category: 'Hygiene', type: 'qualitative', result: null, photoTaken: false },
];

type ConditionAssessment = 'GOOD' | 'MONITORING' | 'ACTION' | 'URGENT' | null;

export default function PMChecklistScreen() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [items, setItems] = useState(initialItems);
  const [condition, setCondition] = useState<ConditionAssessment>(null);
  const [measurements, setMeasurements] = useState<Record<string, string>>({});

  const setResult = (id: string, result: 'PASS' | 'FAIL' | 'N/A') => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, result } : item));
  };

  const takePhoto = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, photoTaken: true } : item));
    toast({ title: 'Photo captured' });
  };

  const allDone = items.every(i => i.result !== null);
  const failCount = items.filter(i => i.result === 'FAIL').length;
  const categories = [...new Set(items.map(i => i.category))];

  const handleSubmit = () => {
    if (!condition) return;
    toast({
      title: 'PM Checklist Submitted',
      description: `Assessment: ${condition} · ${failCount} failures noted`,
    });
    navigate('/maintenance');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/maintenance')} className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
          <ArrowLeft className="h-4 w-4 text-foreground" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-foreground">PM Checklist</h1>
          <p className="text-[10px] text-muted-foreground">Conveyor Belt Motor · Weekly Inspection</p>
        </div>
      </div>

      {/* Context */}
      <div className="data-card p-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-foreground font-medium">AST-L5-CONV-01 · Line 5, Bay 3</p>
          <p className="text-[10px] text-muted-foreground">Frequency: Weekly · Est. 25 min</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold font-mono text-foreground">{items.filter(i => i.result).length}/{items.length}</p>
          <p className="text-[10px] text-muted-foreground">completed</p>
        </div>
      </div>

      {/* Progress */}
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div className="h-full bg-primary transition-all rounded-full" style={{ width: `${(items.filter(i => i.result).length / items.length) * 100}%` }} />
      </div>

      {/* Items by category */}
      {categories.map(cat => (
        <div key={cat}>
          <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">{cat}</h3>
          {items.filter(i => i.category === cat).map(item => (
            <div key={item.id} className={cn("data-card p-3 mb-2", item.result === 'FAIL' && "border-status-critical/30")}>
              <p className="text-xs text-foreground mb-1">{item.description}</p>
              {item.type === 'quantitative' && (
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="number"
                    placeholder={item.acceptance}
                    value={measurements[item.id] || ''}
                    onChange={e => setMeasurements(prev => ({ ...prev, [item.id]: e.target.value }))}
                    className="w-24 rounded-lg border border-border bg-background px-2 py-1 text-xs font-mono text-foreground"
                  />
                  <span className="text-[10px] text-muted-foreground">{item.unit}</span>
                  <span className="text-[10px] text-muted-foreground ml-auto">{item.acceptance}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                {(['PASS', 'FAIL', 'N/A'] as const).map(r => (
                  <button key={r} onClick={() => setResult(item.id, r)} className={cn(
                    "rounded-lg px-3 py-1.5 text-[10px] font-bold transition-all",
                    item.result === r
                      ? r === 'PASS' ? 'bg-status-running text-background' : r === 'FAIL' ? 'bg-status-critical text-background' : 'bg-muted text-foreground'
                      : 'bg-muted/50 text-muted-foreground'
                  )}>{r}</button>
                ))}
                {item.result === 'FAIL' && (
                  <button onClick={() => takePhoto(item.id)} className={cn(
                    "ml-auto flex items-center gap-1 rounded-lg px-2 py-1.5 text-[10px] font-medium",
                    item.photoTaken ? "bg-status-running/20 text-status-running" : "bg-status-critical/20 text-status-critical"
                  )}>
                    <Camera className="h-3 w-3" />
                    {item.photoTaken ? 'Done' : 'Photo Required'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Condition assessment */}
      {allDone && (
        <div className="data-card p-4 space-y-3">
          <h3 className="text-xs font-bold text-foreground">Asset Condition Assessment</h3>
          <div className="grid grid-cols-2 gap-2">
            {([
              { key: 'GOOD' as const, label: 'Good', desc: 'No issues', color: 'bg-status-running' },
              { key: 'MONITORING' as const, label: 'Monitor', desc: 'Minor wear', color: 'bg-status-monitor' },
              { key: 'ACTION' as const, label: 'Action Req.', desc: 'Defect found', color: 'bg-status-warning' },
              { key: 'URGENT' as const, label: 'Urgent', desc: 'Cannot run', color: 'bg-status-critical' },
            ]).map(c => (
              <button key={c.key} onClick={() => setCondition(c.key)} className={cn(
                "rounded-xl p-3 text-left transition-all border",
                condition === c.key ? `${c.color} text-background border-transparent` : 'bg-muted border-border text-foreground'
              )}>
                <p className="text-xs font-bold">{c.label}</p>
                <p className="text-[10px] opacity-80">{c.desc}</p>
              </button>
            ))}
          </div>
          <button onClick={handleSubmit} disabled={!condition}
            className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground disabled:opacity-40">
            Submit PM Record
          </button>
        </div>
      )}
    </div>
  );
}
