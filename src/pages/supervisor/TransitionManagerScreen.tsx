import { useState } from "react";
import { ArrowLeft, Check, AlertTriangle, X, Camera, Fingerprint, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supervisorTransition } from "@/data/supervisorMockData";

const overrideReasons = [
  'Process not visually clear',
  'Await additional readings',
  'Product quality concern',
  'Other',
];

export default function TransitionManagerScreen() {
  const navigate = useNavigate();
  const t = supervisorTransition;
  const [showOverride, setShowOverride] = useState(false);
  const [overrideReason, setOverrideReason] = useState('');
  const [confirming, setConfirming] = useState(false);

  const handleConfirmSwitch = () => {
    setConfirming(true);
    setTimeout(() => {
      setConfirming(false);
      toast.success('Switch confirmed — transition complete');
      navigate('/supervisor');
    }, 1500);
  };

  const handleOverride = () => {
    if (!overrideReason) { toast.error('Select a reason'); return; }
    toast.warning(`Override recorded: ${overrideReason}`);
    setShowOverride(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/supervisor/run-detail')} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-foreground">Transition Manager</h1>
          <p className="text-xs text-muted-foreground">{t.outgoingProduct} → {t.incomingProduct}</p>
        </div>
      </div>

      {/* Switch recommendation */}
      {t.switchRecommended && !showOverride && (
        <div className="rounded-lg border-2 border-status-running bg-status-running/10 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Check className="h-5 w-5 text-status-running" />
            <span className="text-lg font-bold text-status-running">SWITCH RECOMMENDED</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">{t.recommendationBasis}</p>
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={handleConfirmSwitch} disabled={confirming} className="h-14 text-lg bg-status-running hover:bg-status-running/90">
              {confirming ? <><Loader2 className="h-5 w-5 animate-spin" /> Confirming...</> : <><Check className="h-5 w-5" /> Confirm Switch</>}
            </Button>
            <Button variant="outline" className="h-14 text-lg border-status-warning text-status-warning hover:bg-status-warning/10" onClick={() => setShowOverride(true)}>
              <AlertTriangle className="h-5 w-5" /> Override
            </Button>
          </div>
        </div>
      )}

      {/* Override modal inline */}
      {showOverride && (
        <div className="rounded-lg border border-status-warning bg-status-warning/10 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-status-warning">Override Reason</h3>
            <button onClick={() => setShowOverride(false)}><X className="h-4 w-4 text-muted-foreground" /></button>
          </div>
          <div className="space-y-2">
            {overrideReasons.map(r => (
              <button
                key={r}
                onClick={() => setOverrideReason(r)}
                className={cn(
                  "w-full rounded-lg border p-3 text-left text-sm transition-all",
                  overrideReason === r ? "border-status-warning bg-status-warning/20 text-foreground" : "border-border text-muted-foreground hover:border-status-warning/30"
                )}
              >
                {r}
              </button>
            ))}
          </div>
          <Button onClick={handleOverride} className="w-full bg-status-warning hover:bg-status-warning/90">
            <Fingerprint className="h-4 w-4" /> Submit Override
          </Button>
        </div>
      )}

      {/* Live quality comparison */}
      <div className="grid grid-cols-2 gap-3">
        {/* Outgoing */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 text-center">Outgoing</h3>
          <p className="text-xs text-center text-muted-foreground/60 mb-2">{t.outgoingProduct}</p>
          {t.params.map(p => (
            <div key={`out-${p.label}`} className="data-card mb-2 p-3 opacity-50">
              <p className="metric-label text-center">{p.label}</p>
              <p className="font-mono text-xl font-bold text-center text-muted-foreground">{p.outgoingValue}{p.unit}</p>
            </div>
          ))}
        </div>
        {/* Incoming */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 text-center">Incoming</h3>
          <p className="text-xs text-center text-foreground mb-2">{t.incomingProduct}</p>
          {t.params.map(p => (
            <div key={`in-${p.label}`} className={cn(
              "data-card mb-2 p-3",
              p.inSpec ? "border-status-running/30" : "border-status-warning/30"
            )}>
              <p className="metric-label text-center">{p.label}</p>
              <p className={cn("font-mono text-xl font-bold text-center", p.inSpec ? "text-status-running" : "text-status-warning")}>
                {p.currentValue}{p.unit}
              </p>
              <p className="text-[10px] text-center text-muted-foreground">
                Target: {p.incomingTarget}{p.unit} · {p.consecutiveOnSpec} on-spec
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Allergen clean-down checklist */}
      {t.allergenCleanDown.required && (
        <div className="data-card p-3">
          <h3 className="text-sm font-semibold text-foreground mb-2">Allergen Clean-Down Checklist</h3>
          {t.allergenCleanDown.steps.map(step => (
            <div key={step.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
              <div className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full",
                step.completed ? "bg-status-running" : "bg-muted"
              )}>
                {step.completed ? <Check className="h-3 w-3 text-background" /> : <span className="text-[10px] text-muted-foreground">—</span>}
              </div>
              <span className="text-sm text-foreground flex-1">{step.description}</span>
              {!step.completed && (
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  <Camera className="h-3 w-3 mr-1" /> Photo
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
