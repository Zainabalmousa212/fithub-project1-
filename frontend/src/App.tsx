 import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import MemberDashboard from "./pages/member/MemberDashboard";
import Workouts from "./pages/member/Workouts";
import Sessions from "./pages/member/Sessions";
import MemberProgress from "./pages/member/Progress";
import MemberProfile from "./pages/member/Profile";
import TrainerDashboard from "./pages/trainer/TrainerDashboard";
import TrainerMembers from "./pages/trainer/Members";
import TrainerSessions from "./pages/trainer/TrainerSessions";
import TrainerReports from "./pages/trainer/Reports";
import TrainerProfile from "./pages/trainer/TrainerProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
           
            <Route path="/member" element={<Navigate to="/auth?role=member" replace />} />
          <Route path="/member/login" element={<Navigate to="/auth?role=member" replace />} />
          <Route path="/trainer" element={<Navigate to="/auth?role=trainer" replace />} />
          <Route path="/trainer/login" element={<Navigate to="/auth?role=trainer" replace />} />

          {/* Member Routes */}
          <Route path="/member/dashboard" element={<MemberDashboard />} />
          <Route path="/member/workouts" element={<Workouts />} />
          <Route path="/member/sessions" element={<Sessions />} />
          <Route path="/member/progress" element={<MemberProgress />} />
          <Route path="/member/profile" element={<MemberProfile />} />
          
          {/* Trainer Routes */}
          <Route path="/trainer/dashboard" element={<TrainerDashboard />} />
          <Route path="/trainer/members" element={<TrainerMembers />} />
          <Route path="/trainer/sessions" element={<TrainerSessions />} />
          <Route path="/trainer/reports" element={<TrainerReports />} />
          <Route path="/trainer/profile" element={<TrainerProfile />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;