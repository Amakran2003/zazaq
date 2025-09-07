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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-14 inset-x-0 animate-fade-in z-50">
          <div className="bg-background/95 backdrop-blur-md rounded-xl shadow-medium border border-white/10 mx-auto nav-mobile-xs nav-mobile-sm nav-mobile-md w-[40%] max-w-[220px] min-w-[140px] overflow-hidden">
            <div className="flex flex-col divide-y divide-border/10">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-center text-foreground hover:text-accent font-medium transition-smooth py-2 w-full px-1 hover:bg-white/5 text-xs sm:text-sm"
                >
                  {item.label}
                </button>
              ))}
              <div className="p-2">
                <Button
                  onClick={() => scrollToSection('contact')}
                  variant="default"
                  size="sm"
                  className="bg-gradient-accent hover:opacity-90 shadow-soft hover:shadow-glow w-full text-xs py-1"
                >
                  Contact
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;