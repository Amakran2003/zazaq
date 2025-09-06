import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const goHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-subtle">
      <div className="text-center p-8 max-w-md mx-auto">
        <div className="text-6xl mb-6 animate-bounce-in">🔍</div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4 animate-slide-up">
          Page Introuvable
        </h1>
        <p className="text-lg text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Button
          onClick={goHome}
          className="bg-gradient-accent hover:opacity-90 shadow-soft hover:shadow-glow animate-scale-in"
          style={{ animationDelay: '0.4s' }}
        >
          Retour à l'Accueil
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
