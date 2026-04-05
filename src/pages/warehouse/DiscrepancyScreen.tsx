import { useState } from "react";
import { ArrowLeft, Camera, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type DiscrepancyType = 'DAMAGE' | 'SHORT_DELIVERY' | 'TEMPERATURE' | 'WRONG_PRODUCT' | 'MISSING_DOCS';

const discrepancyTypes: { key: DiscrepancyType; label: string; icon: string }[] = [
  { key: 'DAMAGE', label: 'Damaged Packaging', icon: '📦' },
  { key: 'SHORT_DELIVERY', label: 'Short Delivery', icon: '📉' },
  { key: 'TEMPERATURE', label: 'Temperature Exceedance', icon: '🌡️' },
  { key: 'WRONG_PRODUCT', label: 'Wrong Product', icon: '❌' },
  { key: 'MISSING_DOCS', label: 'Missing Documentation', icon: '📋' },
];

export default function DiscrepancyScreen() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [type, setType] = useState<DiscrepancyType | null>(null);
  const [deliveryRef, setDeliveryRef] = useState('DN-2026-04890');
  const [supplier, setSupplier] = useState('Citrus Grove Farms');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [tempReading, setTempReading] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const addPhoto = () => {
    setPhotos(prev => [...prev, `damage_${Date.now()}.jpg`]);
    toast({ title: 'Photo captured' });
  };

  const handleSubmit = () => {
    if (!type || !description.trim()) return;
    setSubmitted(true);
    toast({ title: 'Discrepancy Report Filed', description: 'Supplier NCR initiated automatically' });
  };

  if (submitted) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/warehouse')} className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
            <ArrowLeft className="h-4 w-4 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Report Filed</h1>
        </div>
        <div className="rounded-xl bg-status-running/10 border border-status-running/30 p-6 text-center">
          <CheckCircle2 className="h-10 w-10 mx-auto mb-3 text-status-running" />
          <p className="text-lg font-bold text-status-running">Discrepancy Reported</p>
          <p className="text-sm text-muted-foreground mt-2">Delivery: {deliveryRef} · {supplier}</p>
          <p className="text-[10px] text-muted-foreground mt-1">Supplier NCR created · QA notified · {photos.length} photos attached</p>
          <button onClick={() => navigate('/warehouse')} className="mt-4 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/warehouse')} className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
          <ArrowLeft className="h-4 w-4 text-foreground" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-foreground">Delivery Discrepancy</h1>
          <p className="text-[10px] text-muted-foreground">Report damage, shorts, or temperature issues</p>
        </div>
      </div>

      {/* Delivery reference */}
      <div className="data-card p-3 space-y-2">
        <label className="text-[10px] text-muted-foreground">Delivery Note</label>
        <input value={deliveryRef} onChange={e => setDeliveryRef(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground font-mono" />
        <label className="text-[10px] text-muted-foreground">Supplier</label>
        <input value={supplier} onChange={e => setSupplier(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground" />
      </div>

      {/* Discrepancy type */}
      <div>
        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Issue Type</h3>
        <div className="grid grid-cols-2 gap-2">
          {discrepancyTypes.map(d => (
            <button key={d.key} onClick={() => setType(d.key)} className={cn(
              "rounded-xl p-3 text-left transition-all border",
              type === d.key ? 'bg-status-warning text-background border-transparent' : 'bg-muted border-border text-foreground'
            )}>
              <span className="text-lg">{d.icon}</span>
              <p className="text-xs font-medium mt-1">{d.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Temperature entry */}
      {type === 'TEMPERATURE' && (
        <div className="data-card p-3">
          <label className="text-[10px] text-muted-foreground">Recorded Temperature</label>
          <div className="flex items-center gap-2 mt-1">
            <input type="number" value={tempReading} onChange={e => setTempReading(e.target.value)}
              placeholder="e.g. 12.5" className="w-24 rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono text-foreground" />
            <span className="text-xs text-muted-foreground">°C</span>
            <span className="text-[10px] text-status-critical ml-auto">Limit: ≤ 4°C</span>
          </div>
        </div>
      )}

      {/* Description */}
      <div className="data-card p-3">
        <label className="text-[10px] text-muted-foreground">Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)}
          placeholder="Describe the issue in detail..."
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground min-h-[80px] mt-1" />
      </div>

      {/* Photos */}
      <div className="data-card p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-foreground">📷 Evidence Photos</h3>
          <button onClick={addPhoto} className="flex items-center gap-1 rounded-lg bg-muted px-3 py-1.5 text-[10px] font-medium text-foreground">
            <Camera className="h-3 w-3" /> Capture
          </button>
        </div>
        <div className="flex gap-2 flex-wrap">
          {photos.map((p, i) => (
            <div key={i} className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-[10px] text-muted-foreground">📸 {i + 1}</div>
          ))}
          {photos.length === 0 && <p className="text-[10px] text-muted-foreground">No photos yet — evidence recommended</p>}
        </div>
      </div>

      <button onClick={handleSubmit} disabled={!type || !description.trim()}
        className="w-full rounded-xl bg-status-warning py-3 text-sm font-bold text-background disabled:opacity-40">
        <AlertTriangle className="h-4 w-4 inline mr-2" />
        Submit Discrepancy Report
      </button>
    </div>
  );
}
