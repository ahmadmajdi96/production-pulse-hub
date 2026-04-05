import { cn } from "@/lib/utils";

type StatusType = 'RUNNING' | 'PAUSED' | 'TRANSITION' | 'CIP' | 'IDLE' | 'DOWN' | 'READY-FOR-RUN' | 'CIP-REQUIRED' | 'MAINTENANCE';

const statusMap: Record<string, string> = {
  RUNNING: 'status-running',
  PAUSED: 'status-idle',
  TRANSITION: 'status-transition',
  CIP: 'status-monitor',
  IDLE: 'status-idle',
  DOWN: 'status-down',
  'READY-FOR-RUN': 'status-running',
  'CIP-REQUIRED': 'status-warning',
  MAINTENANCE: 'status-transition',
};

export function StatusBadge({ status, className }: { status: StatusType | string; className?: string }) {
  return (
    <span className={cn('status-badge', statusMap[status] || 'status-idle', className)}>
      <span className={cn('pulse-dot', {
        'bg-status-running': status === 'RUNNING' || status === 'READY-FOR-RUN',
        'bg-status-idle': status === 'PAUSED' || status === 'IDLE',
        'bg-status-transition': status === 'TRANSITION' || status === 'MAINTENANCE',
        'bg-status-monitor': status === 'CIP',
        'bg-status-warning': status === 'CIP-REQUIRED',
        'bg-status-down': status === 'DOWN',
      })} />
      {status}
    </span>
  );
}
