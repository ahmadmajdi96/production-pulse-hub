import { spcData, spcLimits } from "@/data/mockData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, Scatter, ScatterChart, ZAxis, ComposedChart } from "recharts";

export default function SPCScreen() {
  const violations = spcData.filter(d => d.violation);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">SPC — X̄ Control Chart</h1>
        <div className="data-card inline-flex items-center gap-2 py-2 px-4">
          <span className="metric-label">Cpk</span>
          <span className="font-mono text-xl font-bold text-status-running">{spcLimits.cpk}</span>
        </div>
      </div>

      {/* Violation banner */}
      {violations.length > 0 && (
        <div className="rounded-lg border border-status-warning/30 bg-status-warning/10 p-3">
          <p className="text-sm font-semibold text-status-warning">
            ⚠ Rule Violation Detected — {violations[violations.length - 1].violationRule}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Subgroup {violations[violations.length - 1].subgroup} at {violations[violations.length - 1].timestamp}
          </p>
        </div>
      )}

      {/* Chart */}
      <div className="data-card" style={{ height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={spcData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
            <XAxis
              dataKey="subgroup"
              tick={{ fill: 'hsl(215, 12%, 50%)', fontSize: 11 }}
              label={{ value: 'Subgroup', position: 'insideBottom', offset: -10, fill: 'hsl(215, 12%, 50%)' }}
            />
            <YAxis
              domain={[10.6, 12.4]}
              tick={{ fill: 'hsl(215, 12%, 50%)', fontSize: 11 }}
              label={{ value: 'Brix (°Bx)', angle: -90, position: 'insideLeft', fill: 'hsl(215, 12%, 50%)' }}
            />
            <Tooltip
              contentStyle={{ background: 'hsl(220, 18%, 10%)', border: '1px solid hsl(220, 14%, 18%)', borderRadius: 8 }}
              labelStyle={{ color: 'hsl(210, 20%, 90%)' }}
              itemStyle={{ color: 'hsl(210, 20%, 90%)' }}
            />
            {/* USL / LSL */}
            <ReferenceLine y={spcLimits.usl} stroke="hsl(0, 84%, 60%)" strokeDasharray="5 5" label={{ value: 'USL', fill: 'hsl(0, 84%, 60%)', fontSize: 10 }} />
            <ReferenceLine y={spcLimits.lsl} stroke="hsl(0, 84%, 60%)" strokeDasharray="5 5" label={{ value: 'LSL', fill: 'hsl(0, 84%, 60%)', fontSize: 10 }} />
            {/* UCL / LCL */}
            <ReferenceLine y={spcLimits.ucl} stroke="hsl(25, 95%, 53%)" strokeDasharray="3 3" label={{ value: 'UCL', fill: 'hsl(25, 95%, 53%)', fontSize: 10 }} />
            <ReferenceLine y={spcLimits.lcl} stroke="hsl(25, 95%, 53%)" strokeDasharray="3 3" label={{ value: 'LCL', fill: 'hsl(25, 95%, 53%)', fontSize: 10 }} />
            {/* Mean */}
            <ReferenceLine y={spcLimits.mean} stroke="hsl(210, 100%, 56%)" strokeDasharray="2 2" label={{ value: 'X̄', fill: 'hsl(210, 100%, 56%)', fontSize: 10 }} />

            <Line type="monotone" dataKey="mean" stroke="hsl(210, 100%, 56%)" strokeWidth={2} dot={(props: any) => {
              const { cx, cy, payload } = props;
              if (payload.violation) {
                return <circle key={payload.subgroup} cx={cx} cy={cy} r={6} fill="hsl(0, 84%, 60%)" stroke="hsl(0, 84%, 60%)" strokeWidth={2} />;
              }
              return <circle key={payload.subgroup} cx={cx} cy={cy} r={3} fill="hsl(210, 100%, 56%)" />;
            }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend + stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="data-card text-center">
          <div className="metric-label">Mean (X̄)</div>
          <div className="metric-value text-primary">{spcLimits.mean}</div>
        </div>
        <div className="data-card text-center">
          <div className="metric-label">UCL</div>
          <div className="metric-value text-status-warning">{spcLimits.ucl}</div>
        </div>
        <div className="data-card text-center">
          <div className="metric-label">LCL</div>
          <div className="metric-value text-status-warning">{spcLimits.lcl}</div>
        </div>
        <div className="data-card text-center">
          <div className="metric-label">Violations</div>
          <div className="metric-value text-status-critical">{violations.length}</div>
        </div>
      </div>
    </div>
  );
}
