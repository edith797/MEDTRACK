import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import AddMedication from "@/pages/add-medication";
import EditMedication from "@/pages/edit-medication";
import NavBar from "@/components/nav-bar";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";

function Router() {
  const { user, checkAuth } = useAuth();
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/auth" component={Login} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard" component={user ? Dashboard : Login} />
      <Route path="/add-medication" component={user ? AddMedication : Login} />
      <Route path="/edit-medication/:id" component={user ? EditMedication : Login} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {user && <NavBar />}
      <Router />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="medtrack-theme">
        <TooltipProvider>
          <Toaster />
          <AppContent />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
