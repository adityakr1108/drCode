
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import WhatsAppIntegration from "./pages/WhatsAppIntegration";
import Learn from "./pages/Learn";
import NotFound from "./pages/NotFound";
import EmailHistory from "./pages/EmailHistory";
import UserMessages from "./pages/UserMessages";
import EmailCampaign from "./pages/EmailCampaign";
import AdminCalendar from "./pages/AdminCalendar";
import AdminTeam from "./pages/AdminTeam";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/whatsapp-integration" element={<WhatsAppIntegration />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/email-history" element={<EmailHistory />} />
          <Route path="/user-messages" element={<UserMessages />} />
          <Route path="/email-campaign" element={<EmailCampaign />} />
          <Route path="/admin-calendar" element={<AdminCalendar />} />
          <Route path="/admin-team" element={<AdminTeam />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
