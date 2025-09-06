import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create mailto link
      const subject = encodeURIComponent(formData.subject || 'Demande de contact - Zazaq');
      const body = encodeURIComponent(
        `Bonjour,\n\n${formData.message}\n\nCordialement,\n${formData.name}\nEmail: ${formData.email}`
      );
      const mailtoLink = `mailto:contact@zazaq.fr?subject=${subject}&body=${body}`;
      
      window.location.href = mailtoLink;
      
      toast({
        title: "Message envoyé !",
        description: "Votre client email va s'ouvrir. Nous vous répondrons rapidement.",
      });

      // Reset form
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      title: "Email",
      value: "contact@zazaq.fr",
      icon: "📧",
      href: "mailto:contact@zazaq.fr"
    },
    {
      title: "Temps de Réponse",
      value: "< 24 heures",
      icon: "⚡",
      href: null
    },
    {
      title: "Disponibilité",
      value: "Lun-Ven 9h-18h",
      icon: "🕐",
      href: null
    }
  ];

  return (
    <section id="contact" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            Contactez-<span className="text-accent">nous</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Prêt à transformer votre espace ? Contactez-nous pour un devis personnalisé ou pour discuter de votre projet.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="shadow-medium hover:shadow-strong transition-smooth animate-scale-in">
            <CardHeader>
              <CardTitle className="text-2xl font-display font-bold text-foreground">
                Demande de Devis
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Remplissez ce formulaire et nous vous répondrons rapidement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="transition-smooth focus:shadow-glow"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="transition-smooth focus:shadow-glow"
                      placeholder="votre@email.fr"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Sujet</Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="transition-smooth focus:shadow-glow"
                    placeholder="Visite virtuelle, Site web, Autre..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    className="min-h-[120px] transition-smooth focus:shadow-glow"
                    placeholder="Décrivez votre projet, vos besoins, la taille de l'espace..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-accent hover:opacity-90 shadow-soft hover:shadow-glow font-semibold"
                  size="lg"
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer la Demande'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Card className="shadow-soft hover-lift">
              <CardHeader>
                <CardTitle className="text-2xl font-display font-bold text-foreground">
                  Informations de Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="text-2xl">{info.icon}</div>
                    <div>
                      <h4 className="font-semibold text-foreground">{info.title}</h4>
                      {info.href ? (
                        <a 
                          href={info.href}
                          className="text-accent hover:text-accent-light transition-smooth"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-muted-foreground">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Why Choose Us */}
            <Card className="shadow-soft hover-lift bg-gradient-card">
              <CardHeader>
                <CardTitle className="text-xl font-display font-bold text-foreground">
                  Pourquoi Choisir Zazaq ?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Expertise technique:</strong> Technologies de pointe et rendu professionnel
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Service rapide:</strong> Projets livrés dans les délais convenus
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Support français:</strong> Accompagnement personnalisé en français
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Prix transparents:</strong> Devis clairs sans surprises
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="text-center p-6 bg-accent/5 rounded-xl border border-accent/10">
              <h3 className="font-display font-bold text-lg text-accent mb-2">
                Réponse Garantie
              </h3>
              <p className="text-muted-foreground">
                Nous nous engageons à répondre à toute demande dans les 24 heures ouvrées
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;