import { BottomNav } from "./BottomNav";
import { AndonButton } from "./AndonButton";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="p-4">
        {children}
      </div>
      <BottomNav />
      <AndonButton />
    </div>
  );
}
