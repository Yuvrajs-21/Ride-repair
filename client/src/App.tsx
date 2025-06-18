import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/layout";
import Dashboard from "@/pages/dashboard";
import Services from "@/pages/services";
import History from "@/pages/history";
import Profile from "@/pages/profile";
import MechanicProfile from "@/pages/mechanic-profile";
import RequestService from "@/pages/request-service";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/services" component={Services} />
        <Route path="/history" component={History} />
        <Route path="/profile" component={Profile} />
        <Route path="/mechanic/:id" component={MechanicProfile} />
        <Route path="/request-service" component={RequestService} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
