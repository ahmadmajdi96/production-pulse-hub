import { useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Rocket, Calendar, Activity, ArrowRightLeft, FileWarning, BookOpen, Shield, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppSwitcher } from "./AppSwitcher";

const tabs = [
  { path: '/supervisor', label: 'Home', icon: LayoutDashboard },
  { path: '/supervisor/run-detail', label: 'Run', icon: Activity },
  { path: '/supervisor/run-start', label: 'Start', icon: Rocket },
  { path: '/supervisor/transition', label: 'Trans', icon: ArrowRightLeft },
  { path: '/supervisor/schedule', label: 'Sched', icon: Calendar },
  { path: '/supervisor/ncr', label: 'NCR', icon: FileWarning },
  { path: '/supervisor/logbook', label: 'Log', icon: BookOpen },
  { path: '/supervisor/ptw', label: 'PTW', icon: Shield },
  { path: '/supervisor/downtime', label: 'Down', icon: Clock },
];

export function SupervisorNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-sm">
      <div className="flex h-16">
        <AppSwitcher current="EA2" />
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
