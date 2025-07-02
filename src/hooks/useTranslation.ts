
import { useLanguage } from '@/contexts/LanguageContext';
import translations, { TranslationKey } from '@/translations';

export const useTranslation = () => {
  const { language } = useLanguage();
  
  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations.fr[key];
  };
  
  return { t };
};
