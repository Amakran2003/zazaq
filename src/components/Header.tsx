import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import logo from '@/assets/logo.png';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

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

  // Navigation items array for DRY code
  const navItems = [
    { id: 'hero', label: 'Accueil' },
    { id: 'services', label: 'Services' },
    { id: 'references', label: 'Références' },
    { id: 'about', label: 'À Propos' },
  ];

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 flex justify-center pt-2 sm:pt-3 md:pt-4"
    >
      {/* Main navigation bar */}
      <nav 
        className={`mx-auto rounded-full transition-all duration-300 nav-mobile-xs nav-mobile-sm nav-mobile-md w-[40%] max-w-full md:w-auto ${
          isScrolled 
            ? 'bg-primary/90 backdrop-blur-md shadow-lg' 
            : 'bg-primary/40 backdrop-blur-md shadow-lg shadow-white/10'
        }`}
      >
        <div className="w-full px-2 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => scrollToSection('hero')}
              className="flex items-center transition-smooth md:mr-10"
            >
              <img 
                src={logo} 
                alt="Zazaq Logo" 
                className={`h-5 sm:h-6 md:h-7 w-auto ${isScrolled ? 'brightness-125' : ''} transition-all duration-300`} 
              />
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="font-medium text-white hover:text-accent-light transition-smooth shadow-text-sm text-sm lg:text-base"
              >
                {item.label}
              </button>
            ))}
            <Button
              onClick={() => scrollToSection('contact')}
              variant="default"
              size="sm"
              className="bg-gradient-accent hover:opacity-90 shadow-soft hover:shadow-glow shadow-white/10 text-sm lg:text-base py-1"
            >
              Contact
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="block md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1 text-white hover:text-accent-light transition-smooth shadow-text-sm"
              aria-label="Menu"
            >
              <svg 
                className="w-5 h-5 menu-icon-xs" 
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
        </div>
      </nav>

      {/* Mobile Menu Fullscreen */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md animate-fade-in flex flex-col">
          {/* Close button top right */}
          <div className="flex justify-end p-4">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-foreground hover:text-accent transition-smooth"
              aria-label="Fermer le menu"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {/* Navigation items centered */}
          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-2xl font-bold text-foreground hover:text-accent transition-smooth py-2 px-6"
              >
                {item.label}
              </button>
            ))}
            <Button
              onClick={() => scrollToSection('contact')}
              variant="default"
              size="lg"
              className="bg-gradient-accent hover:opacity-90 shadow-soft hover:shadow-glow w-full max-w-xs text-xl py-2 mt-4"
            >
              Contact
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;