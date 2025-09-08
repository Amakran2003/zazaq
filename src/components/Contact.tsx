import { useState, useEffect, useRef } from 'react';
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
    message: '',
    captchaInput: '' // Added for OpenCaptcha input
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailJSError, setEmailJSError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<boolean>(false);
  const [captchaImage, setCaptchaImage] = useState<string | null>(null);
  const [captchaText, setCaptchaText] = useState<string>(''); // The text used to generate the captcha (server-side only)
  const { toast } = useToast();

  // Initialiser EmailJS et OpenCaptcha au chargement du composant
  useEffect(() => {
    const publicKey = 'Golcv37AOhZNxZiCH';
    
    try {
      // Utiliser la méthode d'initialisation la plus récente pour EmailJS
      emailjs.init({
        publicKey: publicKey,
        blockHeadless: false, // Permettre les tests en mode headless
        limitRate: {
          throttle: 3000 // Limitation d'envoi pour éviter les erreurs de rate-limit
        }
      });
      
      // Générer un nouveau CAPTCHA dès le chargement
      generateCaptcha();
    } catch (error) {
      console.error("Erreur d'initialisation:", error);
    }
  }, []);

  // Fonction pour générer un CAPTCHA avec l'API OpenCaptcha
  const generateCaptcha = async () => {
    try {
      // Générer un texte aléatoire pour le CAPTCHA (5-6 caractères)
      const randomText = Math.random().toString(36).substring(2, 8);
      setCaptchaText(randomText);

      // Appel à l'API OpenCaptcha pour générer l'image
      const response = await fetch('https://api.opencaptcha.io/captcha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: randomText,
          width: 300,  // Taille adaptée à notre formulaire
          height: 80,  // Taille adaptée à notre formulaire
          difficulty: 1 // Difficulté moyenne (valeurs possibles: 0, 1, 2, 3)
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur OpenCaptcha: ${response.status}`);
      }

      // L'API retourne directement l'image JPEG, pas de JSON
      const imageBlob = await response.blob();
      
      // Convertir le Blob en base64 pour l'affichage
      const reader = new FileReader();
      reader.onloadend = () => {
        // Extraire la partie base64 de la chaîne data URL
        const base64String = reader.result?.toString().split(',')[1];
        setCaptchaImage(base64String || null);
      };
      reader.readAsDataURL(imageBlob);
      
    } catch (error) {
      console.error('Erreur lors de la génération du CAPTCHA:', error);
      setCaptchaError(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Réinitialiser les messages d'erreur quand l'utilisateur modifie le formulaire
    if (emailJSError) {
      setEmailJSError(null);
    }
    
    if (captchaError) {
      setCaptchaError(false);
    }
    
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Fonction pour vérifier le captcha saisi par l'utilisateur
  const verifyCaptcha = async (): Promise<string | null> => {
    try {
      // Vérifier que l'utilisateur a bien saisi le texte du CAPTCHA
      if (!formData.captchaInput) {
        setCaptchaError(true);
        return null;
      }

      // Vérifier que le texte saisi correspond au CAPTCHA généré
      // Dans une implémentation complète, cette vérification se ferait côté serveur
      if (formData.captchaInput.toLowerCase() === captchaText.toLowerCase()) {
        // La vérification est réussie, générer un token de validation
        const token = `opencaptcha-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
        setCaptchaToken(token);
        setCaptchaError(false);
        return token;
      } else {
        // La vérification a échoué
        setCaptchaError(true);
        // Générer un nouveau CAPTCHA après une erreur
        generateCaptcha();
        return null;
      }
    } catch (error) {
      console.error('Erreur Captcha:', error);
      setCaptchaError(true);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérifier si l'email est valide avant de soumettre
    if (!formData.email || !formData.email.includes('@') || formData.email.trim() === '') {
      setEmailJSError('Veuillez entrer une adresse e-mail valide.');
      toast({
        title: "Validation",
        description: "Veuillez entrer une adresse e-mail valide.",
        variant: "destructive",
      });
      return;
    }
    
    // Vérifier avec OpenCaptcha
    const token = await verifyCaptcha();
    if (!token) {
      setCaptchaError(true);
      toast({
        title: "Erreur de vérification",
        description: "La vérification de sécurité a échoué. Veuillez réessayer.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Configuration EmailJS
      const serviceId = 'service_3xj0898'; // Assurez-vous que cet ID correspond à votre service EmailJS
      const templateId = 'template_1gy1dap'; // Template pour la notification à l'entreprise
      const autoReplyTemplateId = 'template_pr6i63h'; // Template pour l'auto-réponse
      const publicKey = 'Golcv37AOhZNxZiCH';
      
      // Vérifier que les configurations sont définies
      if (!serviceId || !templateId || !autoReplyTemplateId || !publicKey) {
        throw new Error('Configuration EmailJS incomplète. Veuillez vérifier les IDs de service et templates.');
      }

      // Préparation des données pour le template
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject || 'Demande de contact Zazaq',
        message: formData.message,
        reply_to: formData.email, // Important pour pouvoir répondre
      };
      
      // Préparation des données pour l'auto-réponse
      const autoReplyParams = {
        user_name: formData.name,
        user_email: formData.email,
        to_name: formData.name,
        to_email: formData.email, 
        from_name: 'Zazaq',
        from_email: 'contact@zazaq.fr',
        subject: `Re: ${formData.subject || 'Votre demande de contact Zazaq'}`,
        message: formData.message,
        reply_to: 'contact@zazaq.fr',
        // Ajout d'autres champs possibles pour assurer la compatibilité
        email: formData.email,
        name: formData.name
      };

      // Tests séparés pour identifier le problème
      try {
        // 1. Email vers l'entreprise
        const responseEntreprise = await emailjs.send(
          serviceId, 
          templateId, 
          templateParams, 
          {
            publicKey: publicKey
          }
        );
        
        // Si on arrive ici, le premier email a réussi
        toast({
          title: "Message envoyé",
          description: "Votre demande a bien été transmise à notre équipe. Vous recevrez une confirmation par email (pensez à vérifier vos spams).",
        });
        
        // On réinitialise le formulaire et le captcha après l'envoi réussi du premier email
        setFormData({ name: '', email: '', subject: '', message: '', captchaInput: '' });
        setCaptchaToken(null);
        // Générer un nouveau CAPTCHA pour la prochaine utilisation
        generateCaptcha();
        
        // On essaie maintenant l'auto-réponse mais on ne bloque pas le processus s'il échoue
        try {
          
          // Pour l'auto-réponse avec un formatage anti-spam amélioré
          const autoReplyData = {
            // Format standard EmailJS
            to_email: formData.email,
            from_email: 'contact@zazaq.fr',
            to_name: formData.name,
            from_name: 'Zazaq - Service Client',
            message: `Bonjour ${formData.name},

Nous vous confirmons la réception de votre demande concernant "${formData.subject || 'votre projet'}".

Notre équipe est déjà au travail pour étudier votre demande et vous répondra dans un délai maximum de 24 heures ouvrées.

Si vous avez besoin d'informations complémentaires dans l'intervalle, n'hésitez pas à nous contacter directement à contact@zazaq.fr

Cordialement,

L'équipe Zazaq
https://zazaq.fr
--
Zazaq - Votre vision, en 360°
contact@zazaq.fr
Ceci est un message automatique, merci de ne pas y répondre directement.
`,
            subject: `Reçu: Votre demande de ${formData.subject || 'contact'} a bien été enregistrée`,
            reply_to: 'contact@zazaq.fr',
            company_name: 'Zazaq',
            company_address: 'France',
            company_website: 'https://zazaq.fr',
            company_legal: 'Zazaq - Tous droits réservés',
            
            // Formats alternatifs pour différentes configurations de template
            email: formData.email,
            name: formData.name,
            recipient: formData.email,
            recipient_name: formData.name,
            user_email: formData.email,
            user_name: formData.name,
            client_email: formData.email,
            client_name: formData.name,
            
            // Informations pour HTML email avec logo en WebP pour meilleure performance
            logoUrl: 'https://zazaq.fr/assets/logo1.webp', // Utilisation du format WebP optimisé
            backgroundColor: '#ffffff',
            textColor: '#333333',
            accentColor: '#2563eb'
          };
          
          const responseAutoReply = await emailjs.send(
            serviceId, 
            autoReplyTemplateId, 
            autoReplyData, 
            {
              publicKey: publicKey
            }
          );
        } catch (autoReplyError: any) {
          // On ne fait pas échouer le processus entier
          
          // Essayons une dernière tentative avec une configuration différente
          try {
            
            // Version optimisée pour éviter les spams
            const minimalParams = {
              to: formData.email,
              from_name: 'Zazaq Service Client',
              subject: 'Confirmation de votre demande | Zazaq',
              message: `Bonjour ${formData.name},

Nous confirmons la bonne réception de votre demande. 
Référence: ZQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}

Cordialement,
L'équipe Zazaq
contact@zazaq.fr | https://zazaq.fr`,
              logoUrl: 'https://zazaq.fr/assets/logo1.webp' // Ajout du logo WebP pour cette version aussi
            };
            
            // Essayons un service général d'EmailJS
            await emailjs.send(
              serviceId, 
              autoReplyTemplateId,
              minimalParams,
              publicKey
            );
          } catch (finalError) {
            // Ignore l'erreur silencieusement
          }
        }
        
        // On sort avec succès car le premier email a été envoyé
        return;
        
      } catch (innerError: any) {
        throw innerError; // On remonte l'erreur au bloc catch principal
      }
      toast({
        title: "Message envoyé !",
        description: "Votre demande a bien été envoyée. Nous vous avons envoyé une confirmation par email (vérifiez vos spams si nécessaire).",
      });
      setFormData({ name: '', email: '', subject: '', message: '', captchaInput: '' });
    } catch (error: any) {
      // Récupérer des détails d'erreur plus précis
      let errorMessage = 'Erreur inconnue';
      if (error.text) {
        errorMessage = error.text;
      } else if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error.status) {
        // Erreurs avec code HTTP
        errorMessage = `Erreur ${error.status}: ${error.text || 'Problème de serveur'}`;
      }
      
      setEmailJSError(errorMessage);
      toast({
        title: "Erreur d'envoi",
        description: `Une erreur est survenue: ${errorMessage}`,
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

                {/* OpenCaptcha - affiche l'image CAPTCHA et demande à l'utilisateur de saisir le texte */}
                <div className="w-full my-4">
                  <Label htmlFor="captchaInput" className="font-semibold mb-2">Vérification de sécurité *</Label>
                  
                  <div className="flex flex-col md:flex-row items-center gap-4 mt-2">
                    {/* Image CAPTCHA */}
                    <div className="relative bg-gray-50 p-2 rounded-lg border border-muted/30 w-full md:w-auto">
                      {captchaImage ? (
                        <img 
                          src={`data:image/jpeg;base64,${captchaImage}`} 
                          alt="OpenCaptcha verification" 
                          className="h-16 object-contain mx-auto"
                        />
                      ) : (
                        <div className="h-16 w-48 animate-pulse bg-gray-200 rounded"></div>
                      )}
                      
                      {/* Bouton pour régénérer le CAPTCHA */}
                      <button 
                        type="button" 
                        onClick={() => generateCaptcha()} 
                        className="absolute -top-2 -right-2 bg-accent/10 hover:bg-accent/20 text-accent p-1 rounded-full"
                        title="Générer un nouveau CAPTCHA"
                      >
                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Champ de saisie du CAPTCHA */}
                    <div className="flex-grow w-full md:w-auto">
                      <Input
                        id="captchaInput"
                        name="captchaInput"
                        type="text"
                        required
                        value={formData.captchaInput}
                        onChange={handleInputChange}
                        className="transition-smooth focus:shadow-glow"
                        placeholder="Saisissez le texte de l'image"
                        autoComplete="off"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Saisissez les caractères affichés dans l'image ci-dessus
                      </p>
                    </div>
                  </div>
                  
                 
                </div>
                
                {captchaError && (
                  <div className="p-3 mb-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-600">
                    <div className="font-semibold mb-1">Erreur de vérification OpenCaptcha:</div>
                    <div>Le texte saisi ne correspond pas à l'image. Veuillez réessayer ou générer un nouveau CAPTCHA.</div>
                  </div>
                )}

                {emailJSError && (
                  <div className="p-3 mb-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                    <div className="font-semibold mb-1">Erreur lors de l'envoi:</div>
                    <div>{emailJSError}</div>
                  </div>
                )}
                
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
                
                <div className="text-center mt-2 text-xs text-muted-foreground space-y-1">
                  <p>Vous recevrez une confirmation par email. Pensez à vérifier vos spams.</p>
                </div>
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