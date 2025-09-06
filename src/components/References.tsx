import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const References = () => {
  // Projects will be added by the user
  const projects = [
    {
      id: 1,
      title: "Exemple de Visite Virtuelle",
      description: "Visite virtuelle 360° d'un espace commercial moderne",
      category: "Visite Virtuelle",
      iframeUrl: "", // User will add their iframe URL here
      placeholder: true
    },
    {
      id: 2,
      title: "Exemple de Site Web",
      description: "Site web professionnel développé sur mesure",
      category: "Site Web",
      iframeUrl: "", // User will add their iframe URL here
      placeholder: true
    }
  ];

  return (
    <section id="references" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            Nos <span className="text-accent">Réalisations</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Découvrez quelques exemples de nos projets réalisés pour nos clients
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {projects.map((project, index) => (
            <Card 
              key={project.id} 
              className="group hover-lift shadow-soft hover:shadow-strong transition-all duration-500 border-0 bg-gradient-card animate-scale-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardHeader className="text-center pb-4">
                <div className="inline-block px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full mb-3">
                  {project.category}
                </div>
                <CardTitle className="text-xl md:text-2xl font-display font-bold text-foreground mb-2">
                  {project.title}
                </CardTitle>
                <p className="text-muted-foreground">
                  {project.description}
                </p>
              </CardHeader>

              <CardContent>
                <div className="aspect-video bg-muted/30 rounded-lg border-2 border-dashed border-muted/50 flex items-center justify-center">
                  {project.placeholder ? (
                    <div className="text-center text-muted-foreground">
                      <div className="text-4xl mb-2">📁</div>
                      <p className="text-sm">Aperçu du projet à venir</p>
                      <p className="text-xs mt-1">iframe sera ajouté ici</p>
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
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 animate-fade-in">
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-display font-bold text-primary mb-4">
              Votre Projet Sera le Prochain
            </h3>
            <p className="text-muted-foreground mb-6 text-lg">
              Rejoignez nos clients satisfaits et donnez vie à votre vision digitale
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-accent text-white font-semibold rounded-lg hover:opacity-90 transition-all shadow-soft hover:shadow-glow"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('contact')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  });
                }}
              >
                Démarrer Mon Projet
              </a>
              <a 
                href="#services"
                className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-primary-foreground transition-all"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('services')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  });
                }}
              >
                Voir Nos Services
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default References;