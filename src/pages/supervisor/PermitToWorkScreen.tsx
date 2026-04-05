import { useState } from "react";
import { ArrowLeft, Check, Camera, Shield, Fingerprint, Loader2, Lock, Unlock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ChecklistItem {
  id: string;
  description: string;
  confirmed: boolean;
  photoTaken: boolean;
  required: boolean;
}

const isolationChecklist: ChecklistItem[] = [
  { id: 'iso1', description: 'Machine powered down and isolated at source', confirmed: false, photoTaken: false, required: true },
  { id: 'iso2', description: 'LOTO device applied at each isolation point', confirmed: false, photoTaken: false, required: true },
  { id: 'iso3', description: 'All affected operators cleared from work area', confirmed: false, photoTaken: false, required: true },
  { id: 'iso4', description: 'LOTO procedure reviewed and accessible to Technician', confirmed: false, photoTaken: false, required: true },
  { id: 'iso5', description: 'All energy sources isolated — electrical, pneumatic, hydraulic, chemical, thermal', confirmed: false, photoTaken: false, required: true },
];

const closeOutChecklist: ChecklistItem[] = [
  { id: 'co1', description: 'Technician has left the work area', confirmed: false, photoTaken: false, required: true },
  { id: 'co2', description: 'All tools and parts accounted for', confirmed: false, photoTaken: false, required: true },
  { id: 'co3', description: 'Guards and covers reinstalled', confirmed: false, photoTaken: false, required: true },
  { id: 'co4', description: 'LOTO devices removed', confirmed: false, photoTaken: false, required: true },
];

export default function PermitToWorkScreen() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<'issue' | 'active' | 'closeout'>('issue');
  const [items, setItems] = useState(isolationChecklist);
  const [closeItems, setCloseItems] = useState(closeOutChecklist);
  const [issuing, setIssuing] = useState(false);
  const [closing, setClosing] = useState(false);

  const allConfirmed = items.every(i => i.confirmed);
  const allCloseConfirmed = closeItems.every(i => i.confirmed);

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, confirmed: !i.confirmed } : i));
  };
  const toggleCloseItem = (id: string) => {
    setCloseItems(prev => prev.map(i => i.id === id ? { ...i, confirmed: !i.confirmed } : i));
  };
  const takePhoto = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, photoTaken: true } : i));
    toast.info('Photo captured');
  };

  const handleIssuePermit = () => {
    setIssuing(true);
    setTimeout(() => {
      setIssuing(false);
      setPhase('active');
      toast.success('PTW-2026-089 issued — transmitted to Maintenance Technician');
    }, 1500);
  };

  const handleClosePermit = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      toast.success('Permit closed — Line status → READY-FOR-PRODUCTION');
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
          <h1 className="text-xl font-bold text-foreground">Permit to Work</h1>
          <p className="text-xs text-muted-foreground">OSHA 29 CFR 1910.147 Compliance</p>
        </div>
      </div>

      {/* PTW Context */}
      <div className="rounded-lg bg-muted p-3 text-sm space-y-1">
        <div className="flex justify-between"><span className="text-muted-foreground">Work Order</span><span className="font-mono text-foreground">WO-2026-0891</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Equipment</span><span className="text-foreground">Conveyor Belt Motor — Line 5</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Work Type</span><span className="text-foreground">Electrical Isolation</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Technician</span><span className="text-foreground">R. Nakamura</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Planned Duration</span><span className="font-mono text-foreground">2h 00m</span></div>
      </div>

      {/* Phase: Issue */}
      {phase === 'issue' && (
        <>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Isolation Confirmation</h2>
            <div className="space-y-2">
              {items.map((item, idx) => (
                <div key={item.id} className={cn(
                  "rounded-lg border p-3 transition-all",
                  item.confirmed ? "border-status-running bg-status-running/5" : "border-border"
                )}>
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleItem(item.id)}
                      className={cn(
                        "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-all",
                        item.confirmed ? "border-status-running bg-status-running" : "border-muted-foreground"
                      )}
                    >
                      {item.confirmed && <Check className="h-3.5 w-3.5 text-background" />}
                    </button>
                    <div className="flex-1">
                      <p className={cn("text-sm", item.confirmed ? "text-foreground" : "text-muted-foreground")}>{item.description}</p>
                      {item.photoTaken && <span className="text-[10px] text-status-running">✓ Photo captured</span>}
                    </div>
                    <Button variant="outline" size="sm" className="h-7 text-xs shrink-0" onClick={() => takePhoto(item.id)}>
                      <Camera className="h-3 w-3 mr-1" /> Photo
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={handleIssuePermit}
            disabled={!allConfirmed || issuing}
            className="w-full h-14 text-lg bg-status-running hover:bg-status-running/90"
          >
            {issuing ? <><Loader2 className="h-5 w-5 animate-spin" /> Authenticating...</> : <><Fingerprint className="h-5 w-5" /> Issue Permit</>}
          </Button>
        </>
      )}

      {/* Phase: Active */}
      {phase === 'active' && (
        <div className="space-y-4">
          <div className="rounded-lg border-2 border-status-warning bg-status-warning/10 p-4 text-center">
            <Lock className="h-8 w-8 text-status-warning mx-auto mb-2" />
            <p className="text-lg font-bold text-status-warning">PERMIT ACTIVE</p>
            <p className="font-mono text-sm text-foreground mt-1">PTW-2026-089</p>
            <p className="text-xs text-muted-foreground mt-1">Issued to R. Nakamura · Conveyor Belt Motor</p>
          </div>
          <p className="text-sm text-center text-muted-foreground">Awaiting maintenance completion and Technician close-out notification...</p>
          <Button variant="outline" className="w-full" onClick={() => setPhase('closeout')}>
            <AlertTriangle className="h-4 w-4 mr-2" /> Proceed to Close-Out (Simulate)
          </Button>
        </div>
      )}

      {/* Phase: Close-out */}
      {phase === 'closeout' && (
        <>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Close-Out Verification</h2>
            <div className="space-y-2">
              {closeItems.map(item => (
                <div key={item.id} className={cn(
                  "rounded-lg border p-3 transition-all",
                  item.confirmed ? "border-status-running bg-status-running/5" : "border-border"
                )}>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleCloseItem(item.id)}
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-all",
                        item.confirmed ? "border-status-running bg-status-running" : "border-muted-foreground"
                      )}
                    >
                      {item.confirmed && <Check className="h-3.5 w-3.5 text-background" />}
                    </button>
                    <p className={cn("text-sm", item.confirmed ? "text-foreground" : "text-muted-foreground")}>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={handleClosePermit}
            disabled={!allCloseConfirmed || closing}
            className="w-full h-14 text-lg"
          >
            {closing ? <><Loader2 className="h-5 w-5 animate-spin" /> Closing...</> : <><Unlock className="h-5 w-5" /> Close Permit</>}
          </Button>
        </>
      )}
    </div>
  );
}
