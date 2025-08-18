import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LoginForm } from "./LoginForm";
import { SignUpForm } from "./SignUpForm";
import { useState } from "react";

export const AuthButtons = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  return (
    <div className="flex items-center space-x-2">
      {/* Bouton Se connecter */}
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm">
            Se connecter
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connexion</DialogTitle>
            <DialogDescription>
              Connectez-vous à votre compte PromptCraft
            </DialogDescription>
          </DialogHeader>
          <LoginForm onSuccess={() => setIsLoginOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Bouton S'inscrire */}
      <Dialog open={isSignUpOpen} onOpenChange={setIsSignUpOpen}>
        <DialogTrigger asChild>
          <Button 
            size="sm"
            className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white"
          >
            S'inscrire
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Créer un compte</DialogTitle>
            <DialogDescription>
              Rejoignez PromptCraft et commencez à créer
            </DialogDescription>
          </DialogHeader>
          <SignUpForm onSuccess={() => setIsSignUpOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};