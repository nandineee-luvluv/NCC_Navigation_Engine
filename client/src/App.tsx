import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ChecklistProvider } from "./contexts/ChecklistContext";
import Navigation from "./components/Navigation";

import Home from "./pages/Home";
import UnifiedView from "./pages/UnifiedView";



function Router() {
  return (
    <div className="pt-16 md:pt-16">
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/design"} component={UnifiedView} />
        <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ChecklistProvider>
        <ThemeProvider
          defaultTheme="light"
          // switchable
        >
          <TooltipProvider>
            <Navigation />
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </ChecklistProvider>
    </ErrorBoundary>
  );
}

export default App;
