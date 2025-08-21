import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  structuredData?: object;
}

const SEOHead = ({
  title = "AutoPrompt - Plateforme IA de Génération de Prompts Professionnels",
  description = "Créez, améliorez et organisez vos prompts IA avec AutoPrompt. Plateforme professionnelle pour générer des prompts optimisés avec l'intelligence artificielle.",
  keywords = "prompt generator, IA, intelligence artificielle, automatisation, productivité, génération de contenu, ChatGPT, prompts optimisés",
  canonicalUrl = "https://yoursite.com",
  ogImage = "https://yoursite.com/og-image.jpg",
  structuredData
}: SEOHeadProps) => {
  
  useEffect(() => {
    // Mettre à jour le titre
    document.title = title;
    
    // Mettre à jour les meta tags
    const updateMetaTag = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.querySelector(`meta[name="${property}"]`) as HTMLMetaElement;
      }
      if (!element) {
        element = document.createElement('meta');
        if (property.startsWith('og:') || property.startsWith('twitter:')) {
          element.setAttribute('property', property);
        } else {
          element.setAttribute('name', property);
        }
        document.head.appendChild(element);
      }
      element.content = content;
    };

    // Meta tags de base
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    
    // Open Graph
    updateMetaTag('og:title', title);
    updateMetaTag('og:description', description);
    updateMetaTag('og:url', canonicalUrl);
    updateMetaTag('og:image', ogImage);
    updateMetaTag('og:type', 'website');
    updateMetaTag('og:locale', 'fr_FR');
    
    // Twitter
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', ogImage);
    
    // Canonical URL
    let canonicalElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalElement) {
      canonicalElement = document.createElement('link');
      canonicalElement.rel = 'canonical';
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.href = canonicalUrl;
    
    // Structured Data
    if (structuredData) {
      let scriptElement = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
      if (!scriptElement) {
        scriptElement = document.createElement('script');
        scriptElement.type = 'application/ld+json';
        document.head.appendChild(scriptElement);
      }
      scriptElement.textContent = JSON.stringify(structuredData);
    }
    
  }, [title, description, keywords, canonicalUrl, ogImage, structuredData]);

  return null;
};

export default SEOHead;