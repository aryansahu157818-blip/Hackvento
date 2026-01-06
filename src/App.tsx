import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

import Index from "./pages/Index";
import GhostVault from "./pages/GhostVault";
import GhostProject from "./pages/GhostProject";
import ProjectDetails from "./pages/ProjectDetails";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import AddProject from "./pages/AddProject";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/vault" element={<GhostVault />} />
            <Route path="/ghost" element={<GhostProject />} />
            <Route path="/project/:id" element={<ProjectDetails />} />
            <Route path="/auth" element={<Auth />} />

            {/* ✅ Add project goes here INSIDE Routes */}
            <Route path="/add-project" element={<AddProject />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
