const About = () => {
  const stats = [
    { number: "50+", label: "Projets Réalisés", icon: "🚀" },
    { number: "98%", label: "Clients Satisfaits", icon: "😊" },
    { number: "24h", label: "Temps de Réponse", icon: "⚡" },
    { number: "100%", label: "Made in France", icon: "🇫🇷" }
  ];

  const values = [
    {
      title: "Excellence Technique",
      description: "Nous utilisons les dernières technologies pour garantir des résultats de qualité supérieure",
      icon: "🔧"
    },
    {
      title: "Service Client",
      description: "Support réactif et accompagnement personnalisé tout au long de votre projet",
      icon: "💬"
    },
    {
      title: "Innovation",
      description: "Toujours à la pointe des tendances digitales pour vous offrir les meilleures solutions",
      icon: "💡"
    }
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            À Propos de <span className="text-accent">Zazaq</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Spécialiste français des solutions digitales immersives depuis 2024
          </p>
        </div>

        {/* Company Story */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-gradient-card rounded-2xl p-8 md:p-12 shadow-soft animate-scale-in">
            <h3 className="text-2xl md:text-3xl font-display font-bold text-primary mb-6 text-center">
              Notre Mission
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed text-center mb-8">
              <strong className="text-foreground">Zazaq</strong> est une entreprise française spécialisée dans la création de solutions visuelles et immersives pour les entreprises. Notre mission est de simplifier votre présence en ligne en offrant des outils qui mettent en valeur vos espaces et attirent de nouveaux clients.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed text-center">
              Nous combinons <strong className="text-accent">expertise technique</strong> et <strong className="text-accent">créativité</strong> pour transformer vos idées en réalités digitales performantes, avec un objectif clair : faire croître votre activité.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center p-6 bg-gradient-card rounded-xl shadow-soft hover-lift animate-bounce-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl md:text-3xl font-display font-bold text-accent mb-1">
                {stat.number}
              </div>
              <div className="text-sm md:text-base text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div 
              key={index}
              className="text-center p-6 hover-lift animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="text-4xl mb-4 hover-scale inline-block">
                {value.icon}
              </div>
              <h4 className="text-xl font-display font-bold text-foreground mb-3">
                {value.title}
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>

        {/* Technology Stack */}
        <div className="mt-16 text-center animate-slide-up">
          <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-8">
            Technologies de Pointe
          </h3>
          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {[
              "React", "TypeScript", "Insta360 X3", "Next.js", "Tailwind CSS", 
              "WordPress", "Vercel", "Git", "Figma", "Adobe Suite"
            ].map((tech, index) => (
              <span 
                key={index}
                className="px-4 py-2 bg-muted/50 text-muted-foreground rounded-full text-sm font-medium hover:bg-accent/10 hover:text-accent transition-smooth hover-scale"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;