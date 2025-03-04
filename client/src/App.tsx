import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useTranslation } from "react-i18next";
import "./lib/i18n";

import Navbar from "@/components/navbar";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Auth from "@/pages/auth";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/auth" component={Auth} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/profile" component={Profile} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  const { i18n } = useTranslation();
  
  // Set default language to Estonian
  if (i18n.language !== "et") {
    i18n.changeLanguage("et");
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
