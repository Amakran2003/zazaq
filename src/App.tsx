import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SplashScreen from "./components/SplashScreen";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [appReady, setAppReady] = useState(false);
  
  // Gestion du localStorage pour ne montrer le splash screen qu'une fois par jour
  useEffect(() => {
    // Vérifier si le splash screen a déjà été montré récemment
    const lastShown = localStorage.getItem('splashScreenShown');
    
    if (lastShown) {
      const lastShownDate = new Date(lastShown);
      const now = new Date();
      const hoursSinceLastShown = (now.getTime() - lastShownDate.getTime()) / (1000 * 60 * 60);
      
      // Si le splash screen a été montré dans les dernières 24 heures, ne pas le montrer
      if (hoursSinceLastShown < 24) {
        setShowSplash(false);
        setAppReady(true);
      }
    }
  }, []);

  const handleSplashComplete = () => {
    // Stocker la date et l'heure actuelles comme dernier affichage du splash screen
    localStorage.setItem('splashScreenShown', new Date().toISOString());
    setAppReady(true);
    setShowSplash(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="scroll-smooth">
          <Toaster />
          <Sonner />
          {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
          
          <AnimatePresence mode="wait">
            {appReady && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="w-full h-full"
              >
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Préchargement avec fond bleu pour éviter le flash blanc */}
          <div 
            className={`fixed inset-0 z-40 bg-blue-600 transition-opacity duration-1000 ${
              appReady ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
