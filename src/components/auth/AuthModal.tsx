import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle } from "lucide-react";
import { useTranslation } from '@/hooks/useTranslation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'signin' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultTab = 'signin' }) => {
  const { signIn, signUp, resetPassword, loading } = useAuth();
  const { t } = useTranslation();
  
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Formulaire de connexion
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });
  
  // Formulaire d'inscription
  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  
  // Formulaire de réinitialisation
  const [resetEmail, setResetEmail] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateEmail(signInData.email)) {
      setError('Veuillez entrer une adresse email valide');
      return;
    }

    if (!signInData.password) {
      setError('Veuillez entrer votre mot de passe');
      return;
    }

    const { error } = await signIn(signInData.email, signInData.password);
    
    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        setError('Email ou mot de passe incorrect');
      } else if (error.message.includes('Email not confirmed')) {
        setError('Veuillez confirmer votre email avant de vous connecter');
      } else {
        setError(error.message);
      }
    } else {
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      });
      onClose();
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateEmail(signUpData.email)) {
      setError('Veuillez entrer une adresse email valide');
      return;
    }

    if (!validatePassword(signUpData.password)) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (!signUpData.firstName || !signUpData.lastName) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const { error } = await signUp(signUpData.email, signUpData.password, {
      first_name: signUpData.firstName,
      last_name: signUpData.lastName,
      full_name: `${signUpData.firstName} ${signUpData.lastName}`
    });
    
    if (error) {
      if (error.message.includes('User already registered')) {
        setError('Un compte existe déjà avec cette adresse email');
      } else {
        setError(error.message);
      }
    } else {
      setSuccess('Inscription réussie ! Vérifiez votre email pour confirmer votre compte.');
      setSignUpData({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: ''
      });
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateEmail(resetEmail)) {
      setError('Veuillez entrer une adresse email valide');
      return;
    }

    const { error } = await resetPassword(resetEmail);
    
    if (error) {
      setError(error.message);
    } else {
      setSuccess('Un email de réinitialisation a été envoyé à votre adresse');
      setResetEmail('');
    }
  };

  const resetForm = () => {
    setError(null);
    setSuccess(null);
    setSignInData({ email: '', password: '' });
    setSignUpData({ email: '', password: '', confirmPassword: '', firstName: '', lastName: '' });
    setResetEmail('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'signin' | 'signup');
    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold gradient-text">
            Prompt Powerhouse Lab
          </DialogTitle>
          <DialogDescription className="text-center">
            Accédez à votre compte pour sauvegarder vos prompts
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Connexion</TabsTrigger>
            <TabsTrigger value="signup">Inscription</TabsTrigger>
          </TabsList>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mt-4 border-green-200 bg-green-50 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <TabsContent value="signin" className="space-y-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="votre@email.com"
                    value={signInData.email}
                    onChange={(e) => setSignInData({...signInData, email: e.target.value})}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signin-password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="signin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={signInData.password}
                    onChange={(e) => setSignInData({...signInData, password: e.target.value})}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Connexion..." : "Se connecter"}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setActiveTab('reset')}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Mot de passe oublié ?
                </button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Prénom"
                      value={signUpData.firstName}
                      onChange={(e) => setSignUpData({...signUpData, firstName: e.target.value})}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Nom"
                    value={signUpData.lastName}
                    onChange={(e) => setSignUpData({...signUpData, lastName: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="votre@email.com"
                    value={signUpData.email}
                    onChange={(e) => setSignUpData({...signUpData, email: e.target.value})}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={signUpData.password}
                    onChange={(e) => setSignUpData({...signUpData, password: e.target.value})}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500">Au moins 8 caractères</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={signUpData.confirmPassword}
                    onChange={(e) => setSignUpData({...signUpData, confirmPassword: e.target.value})}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Inscription..." : "S'inscrire"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="reset" className="space-y-4">
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="votre@email.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Envoi..." : "Réinitialiser le mot de passe"}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setActiveTab('signin')}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Retour à la connexion
                </button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;