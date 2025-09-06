import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-bg.jpg';

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
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(135deg, hsl(225 83% 20% / 0.95) 0%, hsl(217 91% 60% / 0.9) 100%), url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-light/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-accent-light/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center text-white">
        <div className="max-w-5xl mx-auto animate-slide-up">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6">
            Transformez Vos Espaces en{' '}
            <span className="bg-gradient-to-r from-accent-light to-accent bg-clip-text text-transparent">
              Expériences Digitales
            </span>
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto mb-8 text-white/90 leading-relaxed animate-fade-in" style={{ animationDelay: '0.3s' }}>
            Nous créons des <strong>visites virtuelles 360° immersives</strong> et des <strong>sites web professionnels</strong> pour les musées, l'immobilier, les écoles et les entreprises françaises.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-bounce-in" style={{ animationDelay: '0.6s' }}>
            <Button
              onClick={scrollToServices}
              size="lg"
              className="bg-gradient-accent hover:opacity-90 shadow-glow hover-lift font-semibold text-lg px-8 py-3"
            >
              Découvrir Nos Services
            </Button>
            
            <Button
              onClick={scrollToContact}
              variant="secondary"
              size="lg"
              className="bg-white/20 text-white border border-white/40 hover:bg-white/30 hover:border-white/60 font-semibold text-lg px-8 py-3 backdrop-blur-sm"
            >
              Obtenir un Devis
            </Button>
          </div>

          {/* Key Benefits */}
          <div className="flex flex-wrap justify-center gap-6 mt-12 animate-scale-in" style={{ animationDelay: '0.9s' }}>
            <div className="flex items-center gap-2 text-white/80">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span className="text-sm md:text-base">Technologie 360° de pointe</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span className="text-sm md:text-base">Sites web modernes React</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span className="text-sm md:text-base">Service clients français</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;