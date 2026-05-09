import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import AppHeader from "@/components/AppHeader";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UploadPage from "./pages/UploadPage";
import ViewDetails from "./pages/ViewDetails";
import UserManagement from "./pages/UserManagement";
import ActivityLog from "./pages/ActivityLog";
import ClientForms from "./pages/ClientForms";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login' || location.pathname === '/';

  return (
    <>
      {!isLoginPage && <AppHeader />}
      <main className={isLoginPage ? '' : 'min-h-[calc(100vh-4rem)]'}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/details/:id" element={<ViewDetails />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/activity-log" element={<ActivityLog />} />
          <Route path="/client-forms/:id" element={<ClientForms />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
