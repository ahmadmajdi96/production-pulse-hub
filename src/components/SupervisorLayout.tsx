import { SupervisorNav } from "./SupervisorNav";

export function SupervisorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="p-4">
        {children}
      </div>
      <SupervisorNav />
    </div>
  );
}
