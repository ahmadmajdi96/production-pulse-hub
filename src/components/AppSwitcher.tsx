import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Monitor, UserCog, Wrench, Package, Zap, Grid3X3 } from "lucide-react";
import { cn } from "@/lib/utils";

const apps = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/operator', label: 'EA1', icon: Monitor, desc: 'Operator' },
  { path: '/supervisor', label: 'EA2', icon: UserCog, desc: 'Supervisor' },
  { path: '/maintenance', label: 'EA3', icon: Wrench, desc: 'Maintenance' },
  { path: '/warehouse', label: 'EA4', icon: Package, desc: 'Warehouse' },
  { path: '/energy', label: 'EA5', icon: Zap, desc: 'Energy' },
];

export function AppSwitcher({ current }: { current: string }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex flex-col items-center justify-center gap-0.5 px-3 py-2 text-[9px] font-medium text-muted-foreground hover:text-foreground transition-colors min-w-[48px] min-h-[48px]"
      >
        <Grid3X3 className="h-4 w-4" />
        <span>Apps</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-50" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full left-0 mb-2 z-50 rounded-xl border border-border bg-card/98 backdrop-blur-md shadow-xl p-2 min-w-[180px]">
            {apps
              .filter(a => a.label !== current)
              .map(({ path, label, icon: Icon, desc }) => (
                <button
                  key={path}
                  onClick={() => { navigate(path); setOpen(false); }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground hover:bg-muted transition-colors min-h-[44px]"
                >
                  <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="text-left">
                    <span className="font-medium">{label}</span>
                    {desc && <span className="text-muted-foreground ml-1.5 text-xs">{desc}</span>}
                  </div>
                </button>
              ))}
          </div>
        </>
      )}
    </div>
  );
}
