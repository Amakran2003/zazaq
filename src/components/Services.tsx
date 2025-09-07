import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AnimatedSection from '@/components/ui/animated-section';

const Services = () => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const services = [
    {
      title: "Visites Virtuelles 360°",
      description: "Transformez vos espaces en expériences virtuelles immersives accessibles à distance",
      features: [
        "Captation professionnelle 4K ultra haute définition",
        "Navigation interactive et fluide à 360 degrés",
        "Points d'intérêt et informations intégrées",
        "Compatible avec tous les appareils et navigateurs"
      ],
      benefits: [
        "Valorisez efficacement vos espaces",
        "Attirez plus de clients potentiels",
        "Offrez des visites à distance 24h/24",
        "Démarquez-vous de la concurrence"
      ],
      gradient: "from-accent to-accent-light"
    }
  ];

  return (
    <section id="services" className="py-28 bg-background">
      <div className="container mx-auto px-8">
        <AnimatedSection animation="fade-up" className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-6">
            Nos <span className="text-accent">Visites Virtuelles 360°</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Solutions immersives pour transformer vos espaces physiques en expériences virtuelles interactives
          </p>
        </AnimatedSection>

        <div className="max-w-3xl mx-auto">
          {services.map((service, index) => (
            <AnimatedSection 
              key={index}
              animation="zoom-in"
              delay={200}
            >
              <Card 
                className="group border-2 border-muted/30 rounded-xl bg-background shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="h-3 w-full rounded-t-xl bg-accent"></div>
                <CardHeader className="text-center pb-6 pt-10">
                  <div className="inline-flex mx-auto p-5 mb-6 rounded-full bg-muted/20 border-2 border-muted/30">
                    <svg className="w-12 h-12 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <CardTitle className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-lg text-muted-foreground">
                    {service.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-8 px-6">
                  {/* Features */}
                  <div className="pt-4">
                    <h4 className="font-medium text-lg text-accent mb-4 text-center">
                      Ce que nous proposons
                    </h4>
                    <div className="bg-muted/5 border-2 border-muted/20 rounded-lg p-6">
                      <ul className="grid grid-cols-1 gap-4 max-w-md mx-auto">
                        {service.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center gap-3 text-muted-foreground">
                            <svg className="w-4 h-4 text-accent flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="mt-8 pt-2">
                    <h4 className="font-medium text-lg text-accent mb-4 text-center">
                      Avantages
                    </h4>
                    <div className="bg-muted/5 border-2 border-muted/20 rounded-lg p-6">
                      <ul className="grid grid-cols-1 gap-4 max-w-md mx-auto">
                        {service.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-center gap-3 text-muted-foreground">
                            <svg className="w-4 h-4 text-accent flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-6 pb-2">
                    <Button
                      onClick={scrollToContact}
                      className="w-full bg-accent hover:bg-accent/90 text-white py-6 font-medium rounded-lg"
                      size="lg"
                    >
                      <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Demander un devis
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        
        </div>

        {/* Additional Services */}
        <AnimatedSection animation="fade-up" delay={300} className="text-center mt-20">
          <div className="bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/10 rounded-3xl p-4 sm:p-6 md:p-10 max-w-4xl mx-auto shadow-glow-sm">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white text-3xl shadow-glow">
                <svg className="w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-4 px-2">
              Une visite <span className="text-primary">virtuelle 360°</span> personnalisée ?
            </h3>
            <p className="text-muted-foreground mb-8 text-base sm:text-lg max-w-2xl mx-auto px-2 sm:px-4">
              Chaque espace est unique. Notre équipe d'experts est prête à créer une expérience immersive sur mesure qui répond parfaitement à vos besoins spécifiques.
            </p>
            <Button
              onClick={scrollToContact}
              variant="outline"
              size="lg"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-4 sm:px-8 py-5 sm:py-6 rounded-xl font-medium text-base sm:text-lg shadow-soft w-full sm:w-auto"
            >
              Demander un devis personnalisé
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default Services;
