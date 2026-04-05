import { useNavigate, useLocation } from "react-router-dom";
import { Home, Monitor, UserCog, Wrench, Package } from "lucide-react";
import { cn } from "@/lib/utils";

const apps = [
  { path: '/home', label: 'Home', icon: Home },
  { path: '/', label: 'EA1', icon: Monitor },
  { path: '/supervisor', label: 'EA2', icon: UserCog },
  { path: '/maintenance', label: 'EA3', icon: Wrench },
  { path: '/warehouse', label: 'EA4', icon: Package },
];

export function AppSwitcher({ current }: { current: string }) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-0.5 border-r border-border pr-1">
      {apps
        .filter(a => a.label !== current)
        .map(({ path, label, icon: Icon }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="flex flex-col items-center justify-center gap-0.5 px-2 py-1 text-[9px] font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{label}</span>
          </button>
        ))}
    </div>
  );
}
