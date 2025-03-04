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
import { useState, useEffect } from 'react';
import { Router, Route } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomePage from './pages/home';
import PlansPage from './pages/plans';
import ProfilePage from './pages/profile';
import AuthPage from './pages/auth';
import Navbar from './components/navbar';
import { StaticModeToggle } from './components/StaticModeToggle';
import { Toaster } from './components/ui/toaster';
import { apiClient } from './api/client';

// Initialize React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const currentUser = await apiClient.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Auth check failed', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background text-foreground">
          <Navbar user={user} />
          
          <main className="container mx-auto p-4">
            <Route path="/">
              <HomePage />
            </Route>
            
            <Route path="/plans">
              <PlansPage user={user} />
            </Route>
            
            <Route path="/profile">
              {user ? <ProfilePage user={user} setUser={setUser} /> : <AuthPage setUser={setUser} />}
            </Route>
            
            <Route path="/auth">
              {user ? <ProfilePage user={user} setUser={setUser} /> : <AuthPage setUser={setUser} />}
            </Route>
          </main>
          
          {/* Toggle for GitHub Pages mode */}
          <StaticModeToggle />
        </div>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
