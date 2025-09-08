import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import AnimatedSection from '@/components/ui/animated-section';

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
      // EmailJS réactivé
      const serviceId = 'service_3xj0898'; // à personnaliser
      const templateId = 'template_1gy1dap'; // à personnaliser
      const autoReplyTemplateId = 'template_pr6i63h';
      const publicKey = 'Golcv37AOhZNxZiCH'; // Clé publique EmailJS directement en dur

      // 1. Email vers l'entreprise
      await emailjs.send(serviceId, templateId, {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
      }, publicKey);

      // 2. Email auto-reply vers l'utilisateur
      await emailjs.send(serviceId, autoReplyTemplateId, {
        to_email: formData.email,
        to_name: formData.name,
        subject: formData.subject,
        message: formData.message,
      }, publicKey);

      toast({
        title: "Message envoyé !",
        description: "Votre demande a bien été envoyée. Nous vous répondrons rapidement.",
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi. Veuillez réessayer.",
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
      icon: (
        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      href: "mailto:contact@zazaq.fr"
    },
    {
      title: "Temps de Réponse",
      value: "< 24 heures",
      icon: (
        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      href: null
    },
    {
      title: "Disponibilité",
      value: "Lun-Ven 9h-18h",
      icon: (
        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      href: null
    }
  ];

  return (
    <section id="contact" className="py-12 bg-gradient-subtle">
      <div className="container mx-auto px-6">
        <AnimatedSection animation="fade-up" className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            Contactez-<span className="text-accent">nous</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Prêt à créer votre visite virtuelle 360° ? Contactez-nous pour un devis personnalisé adapté à votre espace.
          </p>
        </AnimatedSection>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <AnimatedSection animation="zoom-in" delay={200}>
          <Card className="shadow-medium hover:shadow-strong transition-all duration-300 border-0 bg-gradient-to-br from-background to-muted/20">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent rounded-t-lg"></div>
            <CardHeader className="pb-4 border-b border-muted/10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
                    <svg className="w-6 h-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    Demande de Devis
                  </CardTitle>
                  <CardDescription className="text-muted-foreground mt-1">
                    Remplissez ce formulaire et nous vous répondrons rapidement
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-3 pb-4">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
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
                  <div className="space-y-1">
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

                <div className="space-y-1">
                  <Label htmlFor="subject">Sujet</Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="transition-smooth focus:shadow-glow"
                    placeholder="Visite virtuelle 360°, Type de projet, Autres services..."
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    className="min-h-[80px] transition-smooth focus:shadow-glow"
                    placeholder="Décrivez votre projet, vos besoins, la taille de l'espace..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-soft hover:shadow-glow font-semibold text-white py-1.5"
                  size="default"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Envoi en cours...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Envoyer la Demande
                    </div>
                  )}
                </Button>
              </form>

              <div className="mt-4 p-4 bg-gradient-to-br from-accent/5 to-primary/5 rounded-xl border border-accent/10 shadow-soft">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-9 h-9 bg-accent/10 rounded-full flex items-center justify-center text-accent">
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <h3 className="font-display font-bold text-lg text-center text-accent mb-1">
                  Réponse Garantie
                </h3>
                <p className="text-muted-foreground text-center text-sm">
                  Nous nous engageons à répondre à toute demande dans les 24 heures ouvrées
                </p>
              </div>
            </CardContent>
          </Card>
          </AnimatedSection>

          {/* Contact Information */}
          <AnimatedSection animation="fade-up" delay={400} className="space-y-6">
            <Card className="shadow-soft hover-lift">
              <CardHeader>
                <CardTitle className="text-2xl font-display font-bold text-foreground">
                  Informations de Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/20 transition-colors">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      {info.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{info.title}</h4>
                      {info.href ? (
                        <a 
                          href={info.href}
                          className="text-accent hover:text-accent-light transition-smooth underline"
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
            <Card className="shadow-soft hover-lift bg-gradient-to-br from-background to-muted/20 border border-muted/10">
              <CardHeader className="pb-2">
                <div className="w-12 h-1 bg-gradient-to-r from-primary to-accent rounded-full mb-4"></div>
                <CardTitle className="text-xl font-display font-bold text-foreground">
                  Pourquoi Choisir Zazaq ?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 pt-4">
                <div className="flex items-start gap-4 group">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-primary/20 transition-colors">
                    <svg className="w-4 h-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Expertise 360°:</strong> Équipement de pointe et résultats professionnels
                  </p>
                </div>
                <div className="flex items-start gap-4 group">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-primary/20 transition-colors">
                    <svg className="w-4 h-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Service rapide:</strong> Projets livrés dans les délais convenus
                  </p>
                </div>
                
                <div className="flex items-start gap-4 group">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-primary/20 transition-colors">
                    <svg className="w-4 h-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Qualité garantie:</strong> Des résultats à la hauteur de vos attentes
                  </p>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default Contact;