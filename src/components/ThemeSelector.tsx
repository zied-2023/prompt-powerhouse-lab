
import React from 'react';
import { Button } from "@/components/ui/button";
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Sun, Moon } from 'lucide-react';

const ThemeSelector = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="bg-white/80 border-white/30 hover:bg-white/90 text-gray-700 dark:bg-gray-800/80 dark:border-gray-600/40 dark:hover:bg-gray-700/90 dark:text-gray-200"
      title={theme === 'light' ? t('darkMode') : t('lightMode')}
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </Button>
  );
};

export default ThemeSelector;
