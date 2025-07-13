import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Landing() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            {t.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            {t.subtitle}
          </p>
          <Button 
            onClick={() => window.location.href = '/api/login'}
            size="lg"
            className="px-8 py-3 text-lg"
          >
            Se connecter avec Replit
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-blue-600 dark:text-blue-400">
                {t.generator}
              </CardTitle>
              <CardDescription>
                {t.promptGeneratorDesc}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Créez des prompts parfaits en quelques clics avec notre assistant intelligent.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-green-600 dark:text-green-400">
                {t.improvement}
              </CardTitle>
              <CardDescription>
                {t.improvementDesc}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Améliorez vos prompts existants avec des suggestions intelligentes.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-purple-600 dark:text-purple-400">
                {t.advanced}
              </CardTitle>
              <CardDescription>
                Construction avancée de prompts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Utilisez notre architecture experte pour créer des prompts complexes.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}