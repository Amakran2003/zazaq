import logo from '@/assets/logo.png';

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
              className="flex justify-center md:justify-start items-center mb-4 hover:opacity-90 transition-smooth"
            >
              <img 
                src={logo} 
                alt="Zazaq Logo" 
                className="h-7 w-auto brightness-200" 
              />
            </button>
            <p className="text-primary-foreground/80 leading-relaxed">
              Entreprise spécialisée dans les visites virtuelles immersives en 360° pour valoriser vos espaces et attirer plus de clients.
            </p>
          </div>

          {/* Services */}
          <div className="text-center">
            <h3 className="font-display font-bold text-lg mb-4">Nos Services</h3>
            <ul className="space-y-2 text-primary-foreground/80">
              <li>Visites Virtuelles 360°</li>
              <li>Capture Photographique HD</li>
              <li>Points d'Intérêt Interactifs</li>
              <li>Intégration Sur Mesure</li>
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
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/60 text-sm text-center md:text-left">
              &copy; {currentYear} Zazaq. Tous droits réservés.
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
      </div>
    </footer>
  );
};

export default Footer;