import { SupervisorNav } from "./SupervisorNav";

export function SupervisorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-4 max-w-2xl mx-auto">
        {children}
      </div>
      <SupervisorNav />
    </div>
  );
}
