import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AnimatedSection from '@/components/ui/animated-section';

const References = () => {
  // Exemple de visite virtuelle 360°
  const projects = [
    {
      id: 1,
      title: "Exemple de Visite Virtuelle 360°",
      description: "Voici un aperçu du type d'expérience immersive que nous pouvons créer pour votre espace",
      tags: ["Immersif", "Interactif", "Haute définition"],
      // krpano demo viewer, URL not shown anywhere
      iframeUrl: "https://krpano.com/releases/1.23/viewer/krpano.html?xml=examples/demotour-apartment/tour.xml",
      placeholder: false
    }
  ];

  const advantages = [
    {
      title: "Visibilité Augmentée",
      description: "Les visites virtuelles augmentent la visibilité de votre espace sur internet et captent l'attention en moyenne 10 fois plus longtemps qu'une simple photo.",
      icon: (
        <svg className="w-6 h-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )
    },
    {
      title: "Disponibilité 24/7",
      description: "Offrez des visites à distance à toute heure, optimisant votre temps et permettant aux clients de découvrir votre espace quand ils le souhaitent.",
      icon: (
        <svg className="w-6 h-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Retour Sur Investissement",
      description: "Augmentez les conversions avec un taux de 30% supérieur pour les annonces immobilières et commerciales incluant une visite virtuelle.",
      icon: (
        <svg className="w-6 h-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      title: "Expérience Unique",
      description: "Démarquez-vous de la concurrence en offrant une expérience immersive et mémorable qui laisse une forte impression.",
      icon: (
        <svg className="w-6 h-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
    {
      title: "Meilleur Référencement",
      description: "Google favorise les sites avec du contenu riche et interactif. Les visites virtuelles augmentent significativement votre SEO.",
      icon: (
        <svg className="w-6 h-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
    {
      title: "Multiplateforme",
      description: "Facilement intégrable sur votre site web, les réseaux sociaux, Google Maps et compatible avec la réalité virtuelle.",
      icon: (
        <svg className="w-6 h-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      )
    }
  ];

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <section id="references" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-6">
        <AnimatedSection animation="fade-up" className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            Explorez notre <span className="text-accent">Visite Virtuelle 360°</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Découvrez un exemple de ce que nous pouvons créer pour votre espace
          </p>
        </AnimatedSection>

        <div className="max-w-4xl mx-auto">
          {projects.map((project) => (
            <AnimatedSection 
              key={project.id}
              animation="zoom-in" 
              delay={200} 
            >
              <Card className="group hover-lift shadow-soft hover:shadow-strong transition-all duration-500 border-0 bg-gradient-to-br from-background to-muted/30 overflow-hidden">
                <CardHeader className="pb-4 relative">
                  <CardTitle className="text-xl md:text-2xl font-display font-bold text-foreground mb-2">
                    {project.title}
                  </CardTitle>
                  <p className="text-muted-foreground">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {project.tags?.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary" className="bg-primary/5 text-primary text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="aspect-[16/9] bg-gradient-to-b from-muted/20 to-muted/30 rounded-lg border border-muted/30 overflow-hidden shadow-lg">
                    {project.placeholder ? (
                      <div className="flex flex-col items-center justify-center h-full">
                        <svg className="w-16 h-16 text-muted-foreground/50 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm text-muted-foreground">Aperçu du projet à venir</p>
                      </div>
                    ) : (
                      <iframe
                        src={project.iframeUrl}
                        className="w-full h-full rounded-lg"
                        title={project.title}
                        frameBorder="0"
                        allowFullScreen
                      />
                    )}
                  </div>
                  <div className="mt-6 text-center">
                    <p className="text-muted-foreground italic">
                      Naviguez dans la visite virtuelle en utilisant votre souris ou en touchant l'écran
                    </p>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>

        {/* Pourquoi une visite virtuelle */}
        <AnimatedSection animation="fade-up" delay={300} className="mt-24 mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-display font-bold text-foreground mb-4">
              Pourquoi Opter Pour Une <span className="text-accent">Visite Virtuelle 360°</span> ?
            </h3>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Des avantages concrets pour votre activité professionnelle
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {advantages.map((advantage, index) => (
              <AnimatedSection
                key={index}
                animation="fade-up"
                delay={index * 100}
                className="bg-background rounded-xl p-6 shadow-soft hover:shadow-md transition-all border border-muted/20"
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    {advantage.icon}
                  </div>
                </div>
                <h4 className="text-xl font-display font-semibold text-foreground text-center mb-3">
                  {advantage.title}
                </h4>
                <p className="text-muted-foreground text-center">
                  {advantage.description}
                </p>
              </AnimatedSection>
            ))}
          </div>

          {/* Statistiques */}
          <AnimatedSection animation="zoom-in" delay={700} className="mt-16">
            <div className="bg-gradient-to-br from-accent/5 to-primary/5 rounded-2xl p-8 max-w-5xl mx-auto">
              <div className="text-center mb-8">
                <h4 className="text-2xl font-display font-bold text-foreground">
                  L'Impact des <span className="text-accent">Visites Virtuelles</span> en Chiffres
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-display font-bold text-primary mb-2">+40%</div>
                  <p className="text-sm text-muted-foreground">d'engagement sur les annonces immobilières</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-display font-bold text-primary mb-2">95%</div>
                  <p className="text-sm text-muted-foreground">des utilisateurs préfèrent les visites virtuelles</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-display font-bold text-primary mb-2">3x</div>
                  <p className="text-sm text-muted-foreground">plus de temps passé sur les pages avec visites virtuelles</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </AnimatedSection>

        {/* Call to Action */}
        <AnimatedSection animation="fade-up" delay={800} className="text-center mt-20">
          <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10 rounded-xl p-10 max-w-4xl mx-auto shadow-soft">
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
            </div>
            <h3 className="text-2xl font-display font-bold text-foreground mb-4">
              <span className="text-primary">Votre Espace</span>, Notre Expertise
            </h3>
            <p className="text-muted-foreground mb-8 text-lg max-w-2xl mx-auto">
              Transformez votre propriété en expérience virtuelle immersive et offrez à vos clients une visite à 360° accessible à tout moment
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#contact"
                className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-lg hover:opacity-90 transition-all shadow-soft hover:shadow-md"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('contact');
                }}
              >
                <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Démarrer Mon Projet
              </a>
              <a 
                href="#services"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/10 transition-all"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('services');
                }}
              >
                <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Explorer Nos Services
              </a>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default References;
