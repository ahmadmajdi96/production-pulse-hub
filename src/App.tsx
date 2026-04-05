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
import RunDetailScreen from "./pages/supervisor/RunDetailScreen";
import TransitionManagerScreen from "./pages/supervisor/TransitionManagerScreen";
import NCRQuickCreateScreen from "./pages/supervisor/NCRQuickCreateScreen";
import ShiftLogbookScreen from "./pages/supervisor/ShiftLogbookScreen";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* EA1: Operator Floor Display */}
          <Route path="/" element={<AppLayout><RunStatusScreen /></AppLayout>} />
          <Route path="/ccp" element={<AppLayout><CCPScreen /></AppLayout>} />
          <Route path="/spc" element={<AppLayout><SPCScreen /></AppLayout>} />
          <Route path="/alerts" element={<AppLayout><AlertScreen /></AppLayout>} />
          <Route path="/shift" element={<AppLayout><ShiftScreen /></AppLayout>} />
          <Route path="/transition" element={<AppLayout><TransitionScreen /></AppLayout>} />
          <Route path="/cip" element={<AppLayout><CIPScreen /></AppLayout>} />
          <Route path="/idle" element={<AppLayout><IdleScreen /></AppLayout>} />

          {/* EA2: Supervisor Mobile App */}
          <Route path="/supervisor" element={<SupervisorLayout><DashboardScreen /></SupervisorLayout>} />
          <Route path="/supervisor/run-detail" element={<SupervisorLayout><RunDetailScreen /></SupervisorLayout>} />
          <Route path="/supervisor/run-start" element={<SupervisorLayout><RunStartWizardScreen /></SupervisorLayout>} />
          <Route path="/supervisor/transition" element={<SupervisorLayout><TransitionManagerScreen /></SupervisorLayout>} />
          <Route path="/supervisor/schedule" element={<SupervisorLayout><ScheduleScreen /></SupervisorLayout>} />
          <Route path="/supervisor/ncr" element={<SupervisorLayout><NCRQuickCreateScreen /></SupervisorLayout>} />
          <Route path="/supervisor/logbook" element={<SupervisorLayout><ShiftLogbookScreen /></SupervisorLayout>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
