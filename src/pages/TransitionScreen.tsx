import { transitionData } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function TransitionScreen() {
  const { outgoingProduct, incomingProduct, outgoingParams, incomingParams, transitionVolumeLiters, switchRecommended } = transitionData;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-foreground">Transition Monitor</h1>

      {/* Switch recommendation */}
      {switchRecommended && (
        <div className="rounded-lg border border-status-running/30 bg-status-running/10 p-4 flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-status-running">✓ SWITCH RECOMMENDED</p>
            <p className="text-sm text-muted-foreground">Parameters have stabilized. Safe to switch to incoming product.</p>
          </div>
          <div className="flex gap-2">
            <Button style={{ background: 'hsl(142, 71%, 45%)', color: 'hsl(220, 20%, 7%)' }}>CONFIRM SWITCH</Button>
            <Button variant="outline">OVERRIDE</Button>
          </div>
        </div>
      )}

      {/* Dual spec display */}
      <div className="grid grid-cols-2 gap-4">
        {/* Outgoing */}
        <div className="data-card opacity-60">
          <div className="metric-label mb-2">Outgoing Product</div>
          <h3 className="text-lg font-semibold text-foreground">{outgoingProduct}</h3>
          <div className="mt-4 space-y-3">
            {outgoingParams.map(p => (
              <div key={p.label} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{p.label}</span>
                <span className="font-mono text-lg text-foreground">{p.value} {p.unit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Incoming */}
        <div className="data-card border-primary/30">
          <div className="metric-label mb-2">Incoming Product</div>
          <h3 className="text-lg font-semibold text-primary">{incomingProduct}</h3>
          <div className="mt-4 space-y-3">
            {incomingParams.map(p => (
              <div key={p.label} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{p.label}</span>
                <span className="font-mono text-lg text-primary">{p.target} {p.unit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Arrow indicator */}
      <div className="flex justify-center">
        <ArrowRight className="h-8 w-8 text-primary animate-pulse" />
      </div>

      {/* Transition loss counter */}
      <div className="data-card text-center">
        <div className="metric-label mb-2">Transition Buffer Volume</div>
        <div className="metric-value text-status-warning text-4xl">{transitionVolumeLiters} L</div>
        <p className="text-sm text-muted-foreground mt-1">Product in transition — not yet at specification</p>
      </div>
    </div>
  );
}
