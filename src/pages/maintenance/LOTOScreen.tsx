import { useState } from "react";
import { ArrowLeft, Check, Camera, Lock, Unlock, Zap, Wind, Droplets, Flame, FlaskConical, AlertTriangle, Loader2, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { lotoProcedure, type LOTOStep } from "@/data/maintenanceMockData";

const sourceIcons: Record<string, typeof Zap> = {
  electrical: Zap,
  pneumatic: Wind,
  hydraulic: Droplets,
  thermal: Flame,
  chemical: FlaskConical,
};

const sourceColors: Record<string, string> = {
  electrical: 'text-status-warning bg-status-warning/20',
  pneumatic: 'text-primary bg-primary/20',
  hydraulic: 'text-status-critical bg-status-critical/20',
  thermal: 'text-status-transition bg-status-transition/20',
  chemical: 'text-status-monitor bg-status-monitor/20',
};

export default function LOTOScreen() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<'isolate' | 'verify' | 'active' | 'remove'>('isolate');
  const [steps, setSteps] = useState<LOTOStep[]>(lotoProcedure.isolationSteps);
  const [removalSteps, setRemovalSteps] = useState<LOTOStep[]>(lotoProcedure.removalSteps);
  const [verified, setVerified] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const allIsolated = steps.every(s => s.confirmed && s.photoTaken);
  const allRemoved = removalSteps.every(s => s.confirmed && s.photoTaken);

  const confirmStep = (id: string) => {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, confirmed: true } : s));
  };
  const photoStep = (id: string) => {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, photoTaken: true } : s));
    toast.info('Photo captured');
  };
  const confirmRemoval = (id: string) => {
    setRemovalSteps(prev => prev.map(s => s.id === id ? { ...s, confirmed: true, photoTaken: true } : s));
  };

  const handleVerify = () => {
    setVerified(true);
    toast.success('Verification complete — machine confirmed de-energized');
  };

  const handleRequestPTW = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setPhase('active');
      toast.success('PTW received from Supervisor — LOTO active');
    }, 1500);
  };

  const handleComplete = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success('LOTO procedure complete — PTW close-out requested');
      navigate('/maintenance');
    }, 1500);
  };

  const renderStep = (step: LOTOStep, onConfirm: (id: string) => void, onPhoto?: (id: string) => void) => {
    const Icon = sourceIcons[step.sourceType] || Zap;
    const color = sourceColors[step.sourceType] || 'text-muted-foreground bg-muted';
    return (
      <div key={step.id} className={cn(
        "rounded-lg border p-3 transition-all",
        step.confirmed ? "border-status-running/30 bg-status-running/5" : "border-border"
      )}>
        <div className="flex items-start gap-3">
          <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", color.split(' ')[1])}>
            <Icon className={cn("h-4 w-4", color.split(' ')[0])} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-bold uppercase text-muted-foreground">{step.sourceType}</span>
              <span className="text-[10px] text-muted-foreground">· {step.method}</span>
            </div>
            <p className="text-sm text-foreground">{step.description}</p>
            {step.confirmed && step.photoTaken && <span className="text-[10px] text-status-running">✓ Confirmed & photographed</span>}
          </div>
          <div className="flex flex-col gap-1 shrink-0">
            {!step.confirmed && (
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => onConfirm(step.id)}>
                <Check className="h-3 w-3" />
              </Button>
            )}
            {onPhoto && !step.photoTaken && step.confirmed && (
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => onPhoto(step.id)}>
                <Camera className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/maintenance')} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-foreground">LOTO Procedure</h1>
          <p className="text-xs text-muted-foreground">{lotoProcedure.procedureRef}</p>
        </div>
      </div>

      {/* Context */}
      <div className="rounded-lg bg-muted p-3 text-sm space-y-1">
        <div className="flex justify-between"><span className="text-muted-foreground">Work Order</span><span className="font-mono text-foreground">{lotoProcedure.workOrderId}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Equipment</span><span className="text-foreground">{lotoProcedure.equipmentName}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Isolation Points</span><span className="font-mono text-foreground">{steps.length}</span></div>
      </div>

      {/* Phase tabs */}
      <div className="flex gap-1">
        {[
          { key: 'isolate', label: 'Isolate', icon: Lock },
          { key: 'verify', label: 'Verify', icon: AlertTriangle },
          { key: 'active', label: 'Active', icon: Lock },
          { key: 'remove', label: 'Remove', icon: Unlock },
        ].map(p => (
          <button
            key={p.key}
            onClick={() => {
              if (p.key === 'verify' && !allIsolated) return;
              if (p.key === 'active' && !verified) return;
              if (p.key === 'remove' && phase !== 'active' && phase !== 'remove') return;
              setPhase(p.key as typeof phase);
            }}
            className={cn(
              "flex-1 flex items-center justify-center gap-1 rounded-lg py-2 text-xs font-medium transition-all",
              phase === p.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}
          >
            <p.icon className="h-3 w-3" /> {p.label}
          </button>
        ))}
      </div>

      {/* Isolation phase */}
      {phase === 'isolate' && (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-foreground">Energy Source Isolation</h2>
          <p className="text-xs text-muted-foreground">Confirm each isolation point and photograph your personal lock in place.</p>
          {steps.map(s => renderStep(s, confirmStep, photoStep))}
          {allIsolated && (
            <Button className="w-full mt-2" onClick={() => setPhase('verify')}>
              Proceed to Verification →
            </Button>
          )}
        </div>
      )}

      {/* Verification phase */}
      {phase === 'verify' && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Verification Test</h2>
          <div className={cn("data-card p-4", verified ? "border-status-running/30" : "border-status-warning/30")}>
            <p className="text-sm text-foreground mb-2">1. Attempt to restart the machine — confirm it does NOT start</p>
            <p className="text-sm text-foreground mb-4">2. Confirm all stored energy is released</p>
            <Button
              onClick={handleVerify}
              disabled={verified}
              className={cn("w-full", verified ? "bg-status-running" : "bg-status-warning hover:bg-status-warning/90")}
            >
              {verified ? <><Check className="h-4 w-4" /> Verified — Machine De-Energized</> : 'Confirm Verification'}
            </Button>
          </div>
          {verified && (
            <Button onClick={handleRequestPTW} disabled={submitting} className="w-full h-12 bg-status-running hover:bg-status-running/90">
              {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Requesting PTW...</> : <><Fingerprint className="h-4 w-4" /> Request PTW from Supervisor</>}
            </Button>
          )}
        </div>
      )}

      {/* Active phase */}
      {phase === 'active' && (
        <div className="space-y-4">
          <div className="rounded-lg border-2 border-status-warning bg-status-warning/10 p-4 text-center">
            <Lock className="h-8 w-8 text-status-warning mx-auto mb-2" />
            <p className="text-lg font-bold text-status-warning">LOTO ACTIVE</p>
            <p className="text-sm text-foreground mt-1">R. Nakamura · {steps.length} locks applied</p>
            <p className="text-xs text-muted-foreground mt-1">{lotoProcedure.equipmentName}</p>
          </div>
          <Button variant="outline" className="w-full" onClick={() => setPhase('remove')}>
            Begin LOTO Removal →
          </Button>
        </div>
      )}

      {/* Removal phase */}
      {phase === 'remove' && (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-foreground">LOTO Removal</h2>
          <p className="text-xs text-muted-foreground">Remove locks in reverse order. Photograph each lock removed.</p>
          {removalSteps.map(s => renderStep(s, (id) => confirmRemoval(id)))}
          {allRemoved && (
            <Button onClick={handleComplete} disabled={submitting} className="w-full h-12 mt-2">
              {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Completing...</> : <><Unlock className="h-4 w-4" /> Complete LOTO & Notify Supervisor</>}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
