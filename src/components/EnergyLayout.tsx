import { EnergyNav } from "./EnergyNav";

export function EnergyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="p-4">
        {children}
      </div>
      <EnergyNav />
    </div>
  );
}
