import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
      description: "Notre service phare pour numériser vos espaces avec une qualité exceptionnelle",
      features: [
        "Technologie Insta360 X3 professionnelle",
        "Rendu haute qualité immersif",
        "Intégration web optimisée",
        "Tournage rapide de 10 minutes"
      ],
      pricing: [
        { size: "Petit Espace (jusqu'à 50m²)", price: "250 €" },
        { size: "Espace Moyen (jusqu'à 120m²)", price: "500 €" },
        { size: "Grand Espace (>120m²)", price: "750 €" }
      ],
      icon: "🎯",
      gradient: "from-accent to-accent-light"
    },
    {
      title: "Développement Web",
      description: "Sites web modernes et performants conçus pour convertir vos visiteurs",
      features: [
        "React & TypeScript moderne",
        "Design responsive professionnel",
        "Optimisation SEO avancée",
        "Performance et sécurité"
      ],
      pricing: [
        { size: "À partir de", price: "1 500 €" }
      ],
      icon: "💻",
      gradient: "from-primary to-primary-light"
    }
  ];

  return (
    <section id="services" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            Nos Services <span className="text-accent">Professionnels</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Solutions digitales complètes pour transformer votre présence en ligne et attirer plus de clients
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className={`group hover-lift shadow-soft hover:shadow-strong transition-all duration-500 border-0 bg-gradient-card animate-scale-in`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardHeader className="text-center pb-4">
                <div className="text-4xl mb-4 group-hover:animate-bounce transition-transform">
                  {service.icon}
                </div>
                <CardTitle className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
                  {service.title}
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground">
                  {service.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Features */}
                <div>
                  <h4 className="font-semibold text-lg text-secondary mb-3">Caractéristiques:</h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3 text-muted-foreground">
                        <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pricing */}
                <div className="bg-muted/50 rounded-xl p-4">
                  <h4 className="font-semibold text-lg text-secondary mb-3">Tarification (HT):</h4>
                  <div className="space-y-2">
                    {service.pricing.map((price, priceIndex) => (
                      <div key={priceIndex} className="flex justify-between items-center">
                        <span className="text-muted-foreground">{price.size}</span>
                        <span className={`font-bold text-xl bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent`}>
                          {price.price}
                        </span>
                      </div>
                    ))}
                  </div>
                  {service.title.includes("Web") && (
                    <p className="text-sm text-muted-foreground mt-2 italic">
                      Prix selon complexité et fonctionnalités requises
                    </p>
                  )}
                </div>

                <Button
                  onClick={scrollToContact}
                  className="w-full bg-gradient-accent hover:opacity-90 shadow-soft hover:shadow-glow font-semibold"
                  size="lg"
                >
                  Demander un Devis
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Services */}
        <div className="text-center mt-16 animate-fade-in">
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-display font-bold text-primary mb-4">
              Besoin d'un service personnalisé ?
            </h3>
            <p className="text-muted-foreground mb-6 text-lg">
              Nous adaptons nos solutions à vos besoins spécifiques. Contactez-nous pour discuter de votre projet unique.
            </p>
            <Button
              onClick={scrollToContact}
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Parlons de Votre Projet
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;