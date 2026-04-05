import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import RunStatusScreen from "./pages/RunStatusScreen";
import CCPScreen from "./pages/CCPScreen";
import SPCScreen from "./pages/SPCScreen";
import AlertScreen from "./pages/AlertScreen";
import ShiftScreen from "./pages/ShiftScreen";
import TransitionScreen from "./pages/TransitionScreen";
import CIPScreen from "./pages/CIPScreen";
import IdleScreen from "./pages/IdleScreen";
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
