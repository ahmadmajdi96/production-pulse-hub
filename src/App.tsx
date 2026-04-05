import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import { SupervisorLayout } from "@/components/SupervisorLayout";
import RunStatusScreen from "./pages/RunStatusScreen";
import CCPScreen from "./pages/CCPScreen";
import SPCScreen from "./pages/SPCScreen";
import AlertScreen from "./pages/AlertScreen";
import ShiftScreen from "./pages/ShiftScreen";
import TransitionScreen from "./pages/TransitionScreen";
import CIPScreen from "./pages/CIPScreen";
import IdleScreen from "./pages/IdleScreen";
import DashboardScreen from "./pages/supervisor/DashboardScreen";
import RunStartWizardScreen from "./pages/supervisor/RunStartWizardScreen";
import ScheduleScreen from "./pages/supervisor/ScheduleScreen";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<RunStatusScreen />} />
            <Route path="/ccp" element={<CCPScreen />} />
            <Route path="/spc" element={<SPCScreen />} />
            <Route path="/alerts" element={<AlertScreen />} />
            <Route path="/shift" element={<ShiftScreen />} />
            <Route path="/transition" element={<TransitionScreen />} />
            <Route path="/cip" element={<CIPScreen />} />
            <Route path="/idle" element={<IdleScreen />} />
          </Routes>
        </AppLayout>
        <Routes>
          <Route path="/supervisor" element={<SupervisorLayout><DashboardScreen /></SupervisorLayout>} />
          <Route path="/supervisor/run-start" element={<SupervisorLayout><RunStartWizardScreen /></SupervisorLayout>} />
          <Route path="/supervisor/schedule" element={<SupervisorLayout><ScheduleScreen /></SupervisorLayout>} />
        </Routes>
        <Routes>
          <Route path="*" element={null} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
