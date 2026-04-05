import { EnergyNav } from "./EnergyNav";

export function EnergyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-4 max-w-2xl mx-auto">
        {children}
      </div>
      <EnergyNav />
    </div>
  );
}
