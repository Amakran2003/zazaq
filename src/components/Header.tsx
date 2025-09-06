import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    setIsMobileMenuOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/90 backdrop-blur-md shadow-medium' 
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <button
            onClick={() => scrollToSection('hero')}
            className="text-2xl md:text-3xl font-display font-bold text-primary hover:text-accent transition-smooth"
          >
            Zazaq
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('hero')}
              className="text-foreground hover:text-accent font-medium transition-smooth"
            >
              Accueil
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="text-foreground hover:text-accent font-medium transition-smooth"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection('references')}
              className="text-foreground hover:text-accent font-medium transition-smooth"
            >
              Références
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-foreground hover:text-accent font-medium transition-smooth"
            >
              À Propos
            </button>
            <Button
              onClick={() => scrollToSection('contact')}
              variant="default"
              className="bg-gradient-accent hover:opacity-90 shadow-soft hover:shadow-glow"
            >
              Contact
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-foreground hover:text-accent transition-smooth"
            aria-label="Menu"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 p-4 bg-background/95 backdrop-blur-md rounded-xl shadow-medium animate-slide-down">
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection('hero')}
                className="text-left text-foreground hover:text-accent font-medium transition-smooth py-2"
              >
                Accueil
              </button>
              <button
                onClick={() => scrollToSection('services')}
                className="text-left text-foreground hover:text-accent font-medium transition-smooth py-2"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection('references')}
                className="text-left text-foreground hover:text-accent font-medium transition-smooth py-2"
              >
                Références
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="text-left text-foreground hover:text-accent font-medium transition-smooth py-2"
              >
                À Propos
              </button>
              <Button
                onClick={() => scrollToSection('contact')}
                variant="default"
                className="bg-gradient-accent hover:opacity-90 shadow-soft hover:shadow-glow w-full"
              >
                Contact
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;