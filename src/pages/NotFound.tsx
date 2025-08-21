import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-emerald-50 dark:from-violet-950/20 dark:via-blue-950/20 dark:to-emerald-950/20 flex items-center justify-center p-4">
      <main className="text-center max-w-lg mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img 
            src="/lovable-uploads/4bfcbfae-c46b-471e-8938-d07bd52b4db2.png" 
            alt="AutoPrompt Logo" 
            className="h-16 w-16 object-contain"
          />
        </div>

        {/* Error Code */}
        <h1 className="text-8xl md:text-9xl font-bold gradient-text mb-4 animate-fade-in">
          404
        </h1>
        
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-6 animate-fade-in">
          Page non trouvée
        </h2>
        
        {/* Description */}
        <p className="text-muted-foreground mb-8 leading-relaxed animate-fade-in">
          Oups ! Il semble que la page que vous recherchez n'existe pas ou a été déplacée. 
          Ne vous inquiétez pas, vous pouvez retourner à l'accueil et explorer nos outils de génération de prompts.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
          <Button 
            asChild
            size="lg"
            className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white border-0 shadow-lg"
          >
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Link>
          </Button>
          
          <Button 
            asChild
            variant="outline"
            size="lg"
            className="border-violet-200 dark:border-violet-700 hover:bg-violet-50 dark:hover:bg-violet-900/20"
          >
            <Link to="/generator">
              <Search className="mr-2 h-4 w-4" />
              Générateur de prompts
            </Link>
          </Button>
        </div>

        {/* Help Links */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <p className="text-sm text-muted-foreground mb-4">Besoin d'aide ?</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/app" className="text-primary hover:underline">
              Mode Avancé
            </Link>
            <span className="text-muted-foreground">•</span>
            <a href="#" className="text-primary hover:underline">
              Documentation
            </a>
            <span className="text-muted-foreground">•</span>
            <a href="#" className="text-primary hover:underline">
              Support
            </a>
          </div>
        </div>
      </main>

      {/* Floating Elements */}
      <div className="fixed top-1/4 left-8 animate-float">
        <div className="w-12 h-12 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full opacity-20 blur-xl"></div>
      </div>
      <div className="fixed bottom-1/4 right-12 animate-float" style={{ animationDelay: '1s' }}>
        <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full opacity-20 blur-xl"></div>
      </div>
    </div>
  );
};

export default NotFound;
