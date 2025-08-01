
import { useLanguage } from '@/contexts/LanguageContext';
import translations, { TranslationKey } from '@/translations';

export const useTranslation = () => {
  const { language } = useLanguage();
  
  const t = (key: keyof TranslationKey | string): string => {
    return translations[language]?.[key as keyof TranslationKey] || translations.en?.[key as keyof TranslationKey] || key;
  };
  
  return { t };
};
