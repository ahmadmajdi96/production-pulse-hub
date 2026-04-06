import { MaintenanceNav } from "./MaintenanceNav";

export function MaintenanceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-4">
        {children}
      </div>
      <MaintenanceNav />
    </div>
  );
}
