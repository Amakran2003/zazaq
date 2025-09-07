import AnimatedSection from '@/components/ui/animated-section';

const About = () => {
  const stats = [
    { 
      number: "4K", 
      label: "Qualité Ultra HD",
      icon: (
        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    { 
      number: "360°", 
      label: "Vue Panoramique",
      icon: (
        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      number: "24h", 
      label: "Temps de Réponse",
      icon: (
        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  const values = [
    {
      title: "Qualité Immersive",
      description: "Nous capturons vos espaces en haute définition 4K pour une expérience virtuelle ultra-réaliste",
      icon: (
        <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      title: "Accessibilité Universelle",
      description: "Vos visites virtuelles fonctionnent parfaitement sur tous les appareils et navigateurs",
      icon: (
        <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: "Interactivité",
      description: "Des visites enrichies de points d'intérêt interactifs pour une exploration engageante",
      icon: (
        <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
      )
    }
  ];

  return (
    <section id="about" className="py-28 bg-background">
      <div className="container mx-auto px-8">
        <AnimatedSection animation="fade-up" className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-6">
            À Propos de <span className="text-accent">Zazaq</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Spécialiste des visites virtuelles 360° immersives
          </p>
        </AnimatedSection>

        {/* Company Story */}
        <AnimatedSection animation="zoom-in" delay={200} className="max-w-4xl mx-auto mb-24">
          <div className="bg-background rounded-lg p-10 md:p-14 relative overflow-hidden">
            <div className="w-20 h-1 bg-accent mx-auto mb-10"></div>
            <div className="text-center mb-10">
              <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
                Notre <span className="text-accent">Mission</span>
              </h3>
            </div>
            <div className="space-y-8">
              <p className="text-lg text-muted-foreground leading-relaxed text-center">
                <strong className="text-foreground">Zazaq</strong> se spécialise dans la création de visites virtuelles 360° immersives pour les professionnels de l'immobilier, du commerce et de l'hôtellerie. Notre mission est de transformer vos espaces physiques en expériences virtuelles qui captivent l'attention et attirent de nouveaux clients.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed text-center">
                Nous combinons <strong className="text-accent">technologie 360°</strong> et <strong className="text-accent">expertise photographique</strong> pour créer des visites virtuelles interactives de haute qualité, avec un objectif clair : valoriser vos espaces et maximiser votre impact.
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-24">
          {stats.map((stat, index) => (
            <AnimatedSection
              key={index}
              animation="zoom-in"
              delay={index * 150}
              className="text-center p-8 bg-background rounded-lg"
            >
              <div className="flex items-center justify-center mb-6">
                <div className="w-14 h-14 rounded-full bg-accent/5 flex items-center justify-center text-accent">
                  {stat.icon}
                </div>
              </div>
              <div className="text-2xl md:text-4xl font-display font-bold text-accent mb-2">
                {stat.number}
              </div>
              <div className="text-sm md:text-base text-muted-foreground font-medium">
                {stat.label}
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {values.map((value, index) => (
            <AnimatedSection
              key={index}
              animation="fade-up"
              delay={index * 200}
              className="p-8"
            >
              <div className="flex flex-col items-center mb-6">
                <div className="w-12 h-12 flex items-center justify-center mb-6 text-primary">
                  {value.icon}
                </div>
                <h4 className="text-xl font-display font-bold text-foreground mb-4">
                  {value.title}
                </h4>
              </div>
              <p className="text-muted-foreground leading-relaxed text-center">
                {value.description}
              </p>
            </AnimatedSection>
          ))}
        </div>

      </div>
    </section>
  );
};

export default About;