import { Button } from '@/components/ui/button';

const Hero = () => {
  const scrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero"
    >
      {/* Enhanced Background Animations */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/15 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-2/3 left-2/3 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float-slow"></div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:30px_30px]"></div>
        
        {/* Animated particles */}
        <div className="particle-container absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white/40"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.7 + 0.3,
                animation: `float-random ${Math.random() * 10 + 10}s infinite ease-in-out`,
                animationDelay: `${Math.random() * 5}s`
              }}
            ></div>
          ))}
        </div>
        
        {/* Subtle light rays */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-accent/20 to-transparent opacity-30 blur-3xl"></div>
      </div>

      {/* SVG geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute top-1/4 -left-24 w-64 h-64 text-white/5 animate-spin-slow" viewBox="0 0 100 100" fill="none">
          <polygon points="50,0 100,50 50,100 0,50" stroke="currentColor" strokeWidth="1" fill="none"/>
        </svg>
        <svg className="absolute bottom-1/3 -right-12 w-48 h-48 text-white/5 animate-spin-reverse" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1" fill="none"/>
        </svg>
        <svg className="absolute top-1/2 left-1/3 w-32 h-32 text-white/5 animate-pulse-slow" viewBox="0 0 100 100" fill="none">
          <rect x="20" y="20" width="60" height="60" stroke="currentColor" strokeWidth="1" fill="none"/>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center text-white navbar-spacing-fix pt-16 sm:pt-20">
        <div className="max-w-5xl mx-auto">
          <div className="inline-block mb-6 mt-2 sm:mt-4 md:mt-0 animate-fade-in hero-badge">
            <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs sm:text-sm font-medium text-accent-light">
              Solutions immersives pour professionnels
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-8 animate-slide-up">
            Donnez Vie à Vos Espaces avec{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-accent-light to-accent bg-clip-text text-transparent">
                l'Immersion Virtuelle
              </span>
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-accent-light to-accent rounded-full transform scale-x-100 origin-bottom"></span>
            </span>
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto mb-10 text-white/90 leading-relaxed animate-fade-in" style={{ animationDelay: '0.3s' }}>
            Spécialistes des <strong className="text-accent-light">visites virtuelles 360°</strong> qui transforment 
            vos espaces physiques en expériences digitales interactives accessibles partout, à tout moment.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <Button
              onClick={scrollToServices}
              size="lg"
              className="bg-gradient-to-r from-accent to-accent-light hover:opacity-90 shadow-lg font-medium text-lg px-8 py-6 transition-all duration-300 ease-in-out hover:shadow-accent/20 hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Découvrir Notre Service
            </Button>
            
            <Button
              onClick={scrollToContact}
              variant="outline"
              size="lg"
              className="bg-white/10 text-white border border-white/30 hover:bg-white/20 hover:border-white/50 font-medium text-lg px-8 py-6 backdrop-blur-sm transition-all duration-300 ease-in-out hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Demander une Consultation
            </Button>
          </div>

          {/* Key Benefits */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 mt-10 md:mt-16 mb-14 sm:mb-10 animate-fade-in benefits-container" style={{ animationDelay: '0.9s' }}>
            <div className="flex items-center gap-3 text-white/90">
              <svg className="w-5 h-5 text-accent-light flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm md:text-base">Visites virtuelles immersives</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <svg className="w-5 h-5 text-accent-light flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm md:text-base">Compatibilité tous appareils</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <svg className="w-5 h-5 text-accent-light flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm md:text-base">Livraison rapide en 48h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - With TailwindCSS bounce animation */}
      <div className="absolute bottom-4 left-0 right-0 mx-auto w-32 opacity-90">
        <a href="#about" className="text-white hover:text-accent-light transition-colors flex flex-col items-center" onClick={(e) => {
          e.preventDefault();
          document.getElementById('about')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }}>
          <span className="text-xs mb-1 tracking-wider font-medium text-white/80">DÉCOUVRIR</span>
          <div className="animate-bounce">
            <svg className="w-5 h-5 text-accent-light"
                 xmlns="http://www.w3.org/2000/svg" 
                 fill="none" 
                 viewBox="0 0 24 24" 
                 stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;