import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";

export default function Home() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header avec profil utilisateur */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user?.profileImageUrl} />
              <AvatarFallback>
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Bonjour, {user?.firstName || user?.email}!
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Bienvenue dans votre espace {t.title}
              </p>
            </div>
          </div>
          <Button 
            onClick={() => window.location.href = '/api/logout'}
            variant="outline"
          >
            Se déconnecter
          </Button>
        </div>

        {/* Navigation principale */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/generator">
            <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
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
                  Créez des prompts parfaits en quelques clics
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/improvement">
            <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
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
                  Améliorez vos prompts existants
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/advanced">
            <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
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
                  Architecture experte pour prompts complexes
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/library">
            <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-orange-600 dark:text-orange-400">
                  {t.library}
                </CardTitle>
                <CardDescription>
                  {t.browsePromptTemplates}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Gérez vos prompts sauvegardés
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/categories">
            <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-red-600 dark:text-red-400">
                  {t.categories}
                </CardTitle>
                <CardDescription>
                  Gestion des catégories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Organisez vos prompts par catégories
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/integration">
            <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-indigo-600 dark:text-indigo-400">
                  {t.integration}
                </CardTitle>
                <CardDescription>
                  Intégrations externes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Configurez vos intégrations API
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                Mes Prompts
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Gérez tous vos prompts créés
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                Sessions
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Historique de vos sessions
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                Favoris
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Vos templates préférés
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}