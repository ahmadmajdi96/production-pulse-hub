import { useNavigate } from "react-router-dom";
import { Monitor, UserCog, Wrench, Package, Activity, ShieldCheck, Rocket, ClipboardList, ScanLine, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const edgeApps = [
  {
    id: 'ea1', label: 'EA1: Operator Floor Display', path: '/',
    icon: Monitor, color: 'bg-primary/15 border-primary/30 text-primary',
    description: 'Wall-mounted HMI for production monitoring — run status, CCP, SPC, alerts, CIP, and shift handover.',
    screens: 8, status: 'RUNNING',
    quickLinks: [
      { label: 'Run Status', path: '/' },
      { label: 'CCP', path: '/ccp' },
      { label: 'Alerts', path: '/alerts' },
      { label: 'CIP', path: '/cip' },
    ],
  },
  {
    id: 'ea2', label: 'EA2: Supervisor Mobile', path: '/supervisor',
    icon: UserCog, color: 'bg-status-running/15 border-status-running/30 text-status-running',
    description: 'Supervisor tablet app — dashboard, run start wizard, scheduling, NCR creation, shift logbook, and permits.',
    screens: 9, status: 'ACTIVE',
    quickLinks: [
      { label: 'Dashboard', path: '/supervisor' },
      { label: 'Run Start', path: '/supervisor/run-start' },
      { label: 'Schedule', path: '/supervisor/schedule' },
      { label: 'Logbook', path: '/supervisor/logbook' },
    ],
  },
  {
    id: 'ea3', label: 'EA3: Maintenance Tech', path: '/maintenance',
    icon: Wrench, color: 'bg-status-warning/15 border-status-warning/30 text-status-warning',
    description: 'Maintenance technician handheld — work order queue, CIP cycle execution, and LOTO procedures.',
    screens: 3, status: 'ACTIVE',
    quickLinks: [
      { label: 'Work Orders', path: '/maintenance' },
      { label: 'CIP Monitor', path: '/maintenance/cip' },
      { label: 'LOTO', path: '/maintenance/loto' },
    ],
  },
  {
    id: 'ea4', label: 'EA4: Warehouse / Receiving', path: '/warehouse',
    icon: Package, color: 'bg-accent/15 border-accent/30 text-accent',
    description: 'Goods receiving handheld — lot scanning, pallet labeling, and FEFO compliance monitoring.',
    screens: 3, status: 'ACTIVE',
    quickLinks: [
      { label: 'Receiving', path: '/warehouse' },
      { label: 'Pallets', path: '/warehouse/pallets' },
      { label: 'FEFO', path: '/warehouse/fefo' },
    ],
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Production Pulse</h1>
          <p className="text-sm text-muted-foreground mt-1">Edge Application Suite — 4 apps · 23 screens</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {edgeApps.map(app => {
            const Icon = app.icon;
            return (
              <div
                key={app.id}
                className={cn("rounded-xl border p-5 cursor-pointer transition-all hover:scale-[1.01]", app.color)}
                onClick={() => navigate(app.path)}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background/50">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-foreground">{app.label}</h2>
                    <p className="text-xs text-muted-foreground">{app.screens} screens · {app.status}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground mt-1" />
                </div>
                <p className="text-sm text-muted-foreground mb-4">{app.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {app.quickLinks.map(link => (
                    <button
                      key={link.path}
                      onClick={(e) => { e.stopPropagation(); navigate(link.path); }}
                      className="rounded-full bg-background/60 px-3 py-1 text-[10px] font-medium text-foreground hover:bg-background transition-colors"
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
