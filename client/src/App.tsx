
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/generator" component={Index} />
          <Route path="/improvement" component={Index} />
          <Route path="/advanced" component={Index} />
          <Route path="/library" component={Index} />
          <Route path="/categories" component={Index} />
          <Route path="/integration" component={Index} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Router />
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
