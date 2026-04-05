import { useState } from "react";
import { ArrowLeft, Camera, AlertTriangle, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { NCRSeverity, NCRType } from "@/data/supervisorMockData";

const severities: { value: NCRSeverity; color: string }[] = [
  { value: 'HIGH', color: 'border-status-critical bg-status-critical/10 text-status-critical' },
  { value: 'MEDIUM', color: 'border-status-warning bg-status-warning/10 text-status-warning' },
  { value: 'LOW', color: 'border-status-monitor bg-status-monitor/10 text-status-monitor' },
];

const ncrTypes: { value: NCRType; label: string }[] = [
  { value: 'process', label: 'Process' },
  { value: 'product', label: 'Product' },
  { value: 'equipment', label: 'Equipment' },
];

export default function NCRQuickCreateScreen() {
  const navigate = useNavigate();
  const [severity, setSeverity] = useState<NCRSeverity | null>(null);
  const [type, setType] = useState<NCRType | null>(null);
  const [description, setDescription] = useState('');
  const [affectedQty, setAffectedQty] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = severity && type && description.length > 5;

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success('NCR submitted — routed to QA Manager');
      navigate('/supervisor');
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/supervisor')} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-foreground">Raise NCR</h1>
          <p className="text-xs text-muted-foreground">Non-Conformance Record — Quick Create</p>
        </div>
      </div>

      {/* Auto-populated context */}
      <div className="rounded-lg bg-muted p-3 text-sm space-y-1">
        <div className="flex justify-between"><span className="text-muted-foreground">Run</span><span className="font-mono text-foreground">RUN-2026-0412</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Product</span><span className="text-foreground">Premium Orange Juice 1L</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Line</span><span className="text-foreground">Line 3</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span className="font-mono text-foreground">{new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span></div>
      </div>

      {/* Severity */}
      <div>
        <label className="text-sm font-semibold text-foreground mb-2 block">Severity</label>
        <div className="grid grid-cols-3 gap-2">
          {severities.map(s => (
            <button
              key={s.value}
              onClick={() => setSeverity(s.value)}
              className={cn(
                "rounded-lg border-2 p-3 text-center font-bold text-sm transition-all",
                severity === s.value ? s.color : "border-border text-muted-foreground hover:border-primary/30"
              )}
            >
              {s.value}
            </button>
          ))}
        </div>
      </div>

      {/* Type */}
      <div>
        <label className="text-sm font-semibold text-foreground mb-2 block">Type</label>
        <div className="grid grid-cols-3 gap-2">
          {ncrTypes.map(t => (
            <button
              key={t.value}
              onClick={() => setType(t.value)}
              className={cn(
                "rounded-lg border p-3 text-center text-sm transition-all",
                type === t.value ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground hover:border-primary/30"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-semibold text-foreground mb-2 block">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the non-conformance..."
          className="w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          rows={3}
        />
      </div>

      {/* Affected quantity */}
      <div>
        <label className="text-sm font-semibold text-foreground mb-2 block">Affected Quantity (units)</label>
        <input
          type="number"
          value={affectedQty}
          onChange={(e) => setAffectedQty(e.target.value)}
          placeholder="0"
          className="w-full rounded-lg border border-border bg-background p-3 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      {/* Photo capture */}
      <Button variant="outline" className="w-full h-12">
        <Camera className="h-4 w-4 mr-2" /> Capture Photo Evidence
      </Button>

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        disabled={!canSubmit || submitting}
        className="w-full h-14 text-lg"
      >
        {submitting ? (
          <><Loader2 className="h-5 w-5 animate-spin" /> Submitting...</>
        ) : (
          <><AlertTriangle className="h-5 w-5" /> Submit NCR</>
        )}
      </Button>
    </div>
  );
}
