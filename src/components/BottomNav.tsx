import { useLocation, useNavigate } from "react-router-dom";
import { Activity, ShieldCheck, BarChart3, AlertTriangle, Clock, ArrowLeftRight, Droplets, PauseCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { path: '/', label: 'Run Status', icon: Activity },
  { path: '/ccp', label: 'CCP', icon: ShieldCheck },
  { path: '/spc', label: 'SPC', icon: BarChart3 },
  { path: '/alerts', label: 'Alerts', icon: AlertTriangle },
  { path: '/shift', label: 'Shift', icon: Clock },
  { path: '/transition', label: 'Transition', icon: ArrowLeftRight },
  { path: '/cip', label: 'CIP', icon: Droplets },
  { path: '/idle', label: 'Idle', icon: PauseCircle },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-sm">
      <div className="flex h-16">
        {tabs.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive && "drop-shadow-[0_0_6px_hsl(210,100%,56%)]")} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
