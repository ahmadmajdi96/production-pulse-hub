import { cn } from "@/lib/utils";

interface CircularGaugeProps {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  lsl: number;
  usl: number;
  target: number;
  status: 'normal' | 'monitor' | 'warning' | 'critical';
  size?: number;
}

const statusColors: Record<string, string> = {
  normal: 'hsl(142, 71%, 45%)',
  monitor: 'hsl(48, 96%, 53%)',
  warning: 'hsl(25, 95%, 53%)',
  critical: 'hsl(0, 84%, 60%)',
};

const statusClasses: Record<string, string> = {
  normal: 'text-status-normal',
  monitor: 'text-status-monitor',
  warning: 'text-status-warning',
  critical: 'text-status-critical',
};

export function CircularGauge({ label, value, unit, min, max, lsl, usl, target, status, size = 140 }: CircularGaugeProps) {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius * 0.75; // 270 degree arc
  const range = max - min;
  const normalizedValue = Math.max(0, Math.min(1, (value - min) / range));
  const strokeDashoffset = circumference * (1 - normalizedValue);
  const color = statusColors[status];

  // Calculate zone arcs
  const lslNorm = (lsl - min) / range;
  const uslNorm = (usl - min) / range;

  return (
    <div className="data-card flex flex-col items-center gap-2 p-3">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-[135deg]">
        {/* Background arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(220, 14%, 18%)"
          strokeWidth={8}
          strokeDasharray={`${circumference} ${2 * Math.PI * radius * 0.25}`}
          strokeLinecap="round"
        />
        {/* Green zone (LSL to USL) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(142, 71%, 45%, 0.15)"
          strokeWidth={8}
          strokeDasharray={`${circumference * (uslNorm - lslNorm)} ${2 * Math.PI * radius - circumference * (uslNorm - lslNorm)}`}
          strokeDashoffset={-circumference * lslNorm}
          strokeLinecap="butt"
        />
        {/* Value arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeDasharray={`${circumference} ${2 * Math.PI * radius * 0.25}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      {/* Center text */}
      <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <span className={cn("font-mono text-xl font-bold", statusClasses[status])}>{value}</span>
        <span className="text-xs text-muted-foreground">{unit}</span>
      </div>
      <span className="metric-label text-center">{label}</span>
      <span className="text-[10px] text-muted-foreground">Target: {target}{unit}</span>
    </div>
  );
}
