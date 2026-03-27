import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { AnimatePresence } from "framer-motion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Rooms from "@/pages/Rooms";
import Gallery from "@/pages/Gallery";
import Reviews from "@/pages/Reviews";
import Contact from "@/pages/Contact";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

function AnimatedRoutes() {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Switch key={location} location={location}>
        <Route path="/" component={Home} />
        <Route path="/rooms" component={Rooms} />
        <Route path="/gallery" component={Gallery} />
        <Route path="/reviews" component={Reviews} />
        <Route path="/contact" component={Contact} />
        <Route>
          <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
            <div className="text-center">
              <h1 className="text-5xl font-serif font-bold text-primary mb-4">404</h1>
              <p className="text-foreground/70 mb-6">Page not found</p>
              <a href="/" className="text-primary hover:underline">Return Home</a>
            </div>
          </div>
        </Route>
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AnimatedRoutes />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
