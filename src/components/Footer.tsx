const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div className="text-center md:text-left">
            <button
              onClick={scrollToTop}
              className="text-2xl font-display font-bold mb-4 hover:text-accent transition-smooth"
            >
              Zazaq
            </button>
            <p className="text-primary-foreground/80 leading-relaxed">
              Spécialiste français des visites virtuelles 360° et du développement web moderne pour les entreprises.
            </p>
          </div>

          {/* Services */}
          <div className="text-center">
            <h3 className="font-display font-bold text-lg mb-4">Nos Services</h3>
            <ul className="space-y-2 text-primary-foreground/80">
              <li>Visites Virtuelles 360°</li>
              <li>Développement Web React</li>
              <li>Sites WordPress</li>
              <li>Solutions Personnalisées</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center md:text-right">
            <h3 className="font-display font-bold text-lg mb-4">Contact</h3>
            <div className="space-y-2 text-primary-foreground/80">
              <p>
                <a 
                  href="mailto:contact@zazaq.fr"
                  className="hover:text-accent transition-smooth"
                >
                  contact@zazaq.fr
                </a>
              </p>
              <p>Réponse sous 24h</p>
              <p>Service en français</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/60 text-sm text-center md:text-left">
              &copy; {currentYear} Zazaq. Tous droits réservés. Made in France 🌟
            </p>
            
            <div className="flex items-center space-x-6 text-sm">
              <button
                onClick={scrollToTop}
                className="text-primary-foreground/60 hover:text-accent transition-smooth"
              >
                Haut de page
              </button>
              <span className="text-primary-foreground/60">•</span>
              <a 
                href="mailto:contact@zazaq.fr"
                className="text-primary-foreground/60 hover:text-accent transition-smooth"
              >
                Nous contacter
              </a>
            </div>
          </div>
        </div>

        {/* Technical Info */}
        <div className="mt-6 text-center">
          <p className="text-primary-foreground/40 text-xs">
            Site développé avec React, TypeScript & Tailwind CSS • Optimisé pour la performance et l'accessibilité
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;