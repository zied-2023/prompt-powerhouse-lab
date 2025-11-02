
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Globe } from 'lucide-react';

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();

  return (
    <div className="flex items-center space-x-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select value={language} onValueChange={(value: 'fr' | 'ar' | 'en') => setLanguage(value)}>
        <SelectTrigger className="w-32 text-gray-900 dark:text-gray-100">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border shadow-lg">
          <SelectItem value="fr">{t('french')}</SelectItem>
          <SelectItem value="ar">{t('arabic')}</SelectItem>
          <SelectItem value="en">{t('english')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
