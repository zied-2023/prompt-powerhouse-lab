import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Utilitaire pour gérer automatiquement les classes RTL
 */
export const useRTLClasses = () => {
  const { isRTL } = useLanguage();

  /**
   * Applique automatiquement les classes RTL appropriées
   */
  const rtlClass = (ltrClass: string, rtlClass?: string): string => {
    if (!isRTL) return ltrClass;
    
    // Mapping automatique des classes courantes
    const autoMappings: Record<string, string> = {
      'text-left': 'text-right',
      'text-right': 'text-left',
      'ml-auto': 'mr-auto',
      'mr-auto': 'ml-auto',
      'pl-4': 'pr-4',
      'pr-4': 'pl-4',
      'pl-6': 'pr-6',
      'pr-6': 'pl-6',
      'left-0': 'right-0',
      'right-0': 'left-0',
      'left-4': 'right-4',
      'right-4': 'left-4',
      'border-l': 'border-r',
      'border-r': 'border-l',
      'justify-start': 'justify-end',
      'justify-end': 'justify-start',
      'items-start': 'items-end',
      'items-end': 'items-start',
      'origin-top-right': 'origin-top-left',
      'origin-top-left': 'origin-top-right'
    };

    // Si une classe RTL spécifique est fournie, l'utiliser
    if (rtlClass) return rtlClass;

    // Appliquer le mapping automatique
    const classes = ltrClass.split(' ');
    const mappedClasses = classes.map(cls => autoMappings[cls] || cls);
    
    return mappedClasses.join(' ');
  };

  /**
   * Ajoute la classe rtl-flip pour les icônes qui doivent être retournées
   */
  const iconClass = (baseClass: string = ''): string => {
    return isRTL ? `${baseClass} rtl-flip`.trim() : baseClass;
  };

  /**
   * Classes pour les espaces entre éléments en RTL
   */
  const spaceClass = (spacing: string): string => {
    if (!isRTL) return spacing;
    
    const spaceXMappings: Record<string, string> = {
      'space-x-2': 'space-x-2 space-x-reverse',
      'space-x-4': 'space-x-4 space-x-reverse',
      'space-x-6': 'space-x-6 space-x-reverse'
    };

    return spaceXMappings[spacing] || spacing;
  };

  /**
   * Classes pour la direction du flexbox
   */
  const flexDirection = (): string => {
    return isRTL ? 'flex-row-reverse' : 'flex-row';
  };

  return {
    rtlClass,
    iconClass,
    spaceClass,
    flexDirection,
    isRTL
  };
};

/**
 * Hook pour les polices arabes
 */
export const useArabicFont = () => {
  const { language } = useLanguage();
  
  const getFontClass = (): string => {
    return language === 'ar' ? 'font-arabic' : '';
  };

  const getHeadingFontClass = (): string => {
    return language === 'ar' ? 'font-arabic-serif' : 'font-display';
  };

  return {
    getFontClass,
    getHeadingFontClass
  };
};