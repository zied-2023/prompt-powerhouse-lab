import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Mail, Heart } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: "Générateur Simple", href: "/generator" },
      { name: "Mode Avancé", href: "/app" },
      { name: "Bibliothèque", href: "/app" },
      { name: "Historique", href: "/app" }
    ],
    company: [
      { name: "À propos", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Carrières", href: "#" },
      { name: "Contact", href: "#" }
    ],
    support: [
      { name: "Documentation", href: "#" },
      { name: "Support", href: "#" },
      { name: "FAQ", href: "#" },
      { name: "Communauté", href: "#" }
    ],
    legal: [
      { name: "Confidentialité", href: "#" },
      { name: "Conditions", href: "#" },
      { name: "Cookies", href: "#" },
      { name: "Mentions légales", href: "#" }
    ]
  };

  const socialLinks = [
    { name: "Twitter", href: "#", icon: Twitter },
    { name: "GitHub", href: "#", icon: Github },
    { name: "LinkedIn", href: "#", icon: Linkedin },
    { name: "Email", href: "mailto:contact@autoprompt.com", icon: Mail }
  ];

  return (
    <footer className="bg-card/60 backdrop-blur-sm border-t border-border/50 mt-24">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Logo et description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/lovable-uploads/4bfcbfae-c46b-471e-8938-d07bd52b4db2.png" 
                alt="AutoPrompt Logo" 
                className="h-10 w-10 object-contain"
              />
              <span className="text-xl font-display font-bold gradient-text">AutoPrompt</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-sm leading-relaxed">
              La plateforme professionnelle pour créer, améliorer et organiser vos prompts IA. 
              Optimisez votre productivité avec l'intelligence artificielle.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="p-2 text-muted-foreground hover:text-primary transition-colors duration-200 hover:bg-accent rounded-lg"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Liens produit */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Produit</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Liens entreprise */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Entreprise</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Liens support */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Liens légaux */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Légal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-border/50 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>© {currentYear} AutoPrompt. Tous droits réservés.</span>
              <span className="hidden md:inline">•</span>
              <span className="flex items-center space-x-1">
                <span>Créé avec</span>
                <Heart className="h-4 w-4 text-red-500 fill-current" />
                <span>en France</span>
              </span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <span className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Tous systèmes opérationnels</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;