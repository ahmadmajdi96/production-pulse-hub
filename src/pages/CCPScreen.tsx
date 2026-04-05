import { useState } from "react";
import { TrendingUp, TrendingDown, Minus, X } from "lucide-react";
import { ccpReadings } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function CCPScreen() {
  const [showKeypad, setShowKeypad] = useState(false);
  const [selectedCCP, setSelectedCCP] = useState<string | null>(null);
  const [keypadValue, setKeypadValue] = useState('');
  const [deviationCCP, setDeviationCCP] = useState<string | null>(null);

  const TrendIcon = ({ trend }: { trend: string }) => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-status-warning" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-status-monitor" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const handleKeypadPress = (key: string) => {
    if (key === 'C') { setKeypadValue(''); return; }
    if (key === '⌫') { setKeypadValue(v => v.slice(0, -1)); return; }
    if (key === 'ENTER') {
      setShowKeypad(false);
      setKeypadValue('');
      setSelectedCCP(null);
      return;
    }
    setKeypadValue(v => v + key);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-foreground">CCP Monitoring</h1>

      {/* Deviation banner */}
      {deviationCCP && (
        <div className="animate-flash-red rounded-lg bg-destructive p-4 text-center">
          <p className="text-lg font-bold text-destructive-foreground">⚠ CCP DEVIATION — {deviationCCP}</p>
          <p className="text-sm text-destructive-foreground/80">Critical limit breach detected. Immediate action required.</p>
          <Button variant="outline" className="mt-2 border-destructive-foreground/30 text-destructive-foreground" onClick={() => setDeviationCCP(null)}>
            ACKNOWLEDGE
          </Button>
        </div>
      )}

      {/* CCP Grid */}
      <div className="grid grid-cols-3 gap-3">
        {ccpReadings.map(ccp => {
          const pctInRange = ((ccp.value - ccp.criticalLow) / (ccp.criticalHigh - ccp.criticalLow)) * 100;
          return (
            <div
              key={ccp.id}
              className={cn(
                "data-card cursor-pointer transition-all",
                ccp.status === 'critical' && "border-status-critical/50 bg-status-critical/5",
                ccp.status === 'warning' && "border-status-warning/50 bg-status-warning/5",
                ccp.status === 'monitor' && "border-status-monitor/50 bg-status-monitor/5",
              )}
              onClick={() => { setSelectedCCP(ccp.id); setShowKeypad(true); }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{ccp.name}</span>
                <TrendIcon trend={ccp.trend} />
              </div>
              <p className="mt-1 text-sm text-foreground">{ccp.parameter}</p>
              <div className="mt-3 flex items-end gap-2">
                <span className={cn(
                  "font-mono text-3xl font-bold",
                  ccp.status === 'normal' && "text-status-normal",
                  ccp.status === 'monitor' && "text-status-monitor",
                  ccp.status === 'warning' && "text-status-warning",
                  ccp.status === 'critical' && "text-status-critical",
                )}>
                  {ccp.value}
                </span>
                <span className="text-sm text-muted-foreground">{ccp.unit}</span>
              </div>
              {/* Range bar */}
              <div className="relative mt-3 h-2 rounded-full bg-muted">
                <div
                  className="absolute h-full rounded-full bg-status-normal/30"
                  style={{ left: '0%', width: '100%' }}
                />
                <div
                  className={cn(
                    "absolute h-full w-1.5 -translate-x-1/2 rounded-full",
                    ccp.status === 'normal' ? "bg-status-normal" : ccp.status === 'monitor' ? "bg-status-monitor" : "bg-status-critical"
                  )}
                  style={{ left: `${Math.max(2, Math.min(98, pctInRange))}%` }}
                />
              </div>
              <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                <span>{ccp.criticalLow}{ccp.unit}</span>
                <span>{ccp.criticalHigh}{ccp.unit}</span>
              </div>
              <div className="mt-2 text-[10px] text-muted-foreground">Last: {ccp.lastRecordedAt}</div>
            </div>
          );
        })}
      </div>

      {/* Numeric keypad overlay */}
      {showKeypad && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-80 rounded-xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Manual CCP Entry</h3>
              <button onClick={() => { setShowKeypad(false); setKeypadValue(''); }}><X className="h-5 w-5 text-muted-foreground" /></button>
            </div>
            <div className="mb-4 rounded-lg bg-muted p-3 text-right font-mono text-2xl text-foreground min-h-[48px]">
              {keypadValue || '—'}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {['7','8','9','4','5','6','1','2','3','C','0','.'].map(key => (
                <button
                  key={key}
                  onClick={() => handleKeypadPress(key)}
                  className="flex h-12 items-center justify-center rounded-lg bg-secondary text-lg font-semibold text-foreground transition-colors hover:bg-muted active:bg-border"
                >
                  {key}
                </button>
              ))}
              <button onClick={() => handleKeypadPress('⌫')} className="col-span-1 flex h-12 items-center justify-center rounded-lg bg-secondary text-foreground hover:bg-muted">⌫</button>
              <button onClick={() => handleKeypadPress('ENTER')} className="col-span-2 flex h-12 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90">RECORD</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
