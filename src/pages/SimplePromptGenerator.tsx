import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Copy, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SimplePromptGenerator = () => {
  const [objective, setObjective] = useState('');
  const [tone, setTone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const { toast } = useToast();

  const toneOptions = [
    { value: 'professional', label: 'Professionnel' },
    { value: 'casual', label: 'Décontracté' },
    { value: 'friendly', label: 'Amical' },
    { value: 'formal', label: 'Formel' },
    { value: 'creative', label: 'Créatif' },
    { value: 'persuasive', label: 'Persuasif' },
    { value: 'technical', label: 'Technique' },
    { value: 'educational', label: 'Éducatif' }
  ];

  const generatePrompt = async () => {
    if (!objective.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez renseigner votre objectif",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulation d'appel API - remplacer par votre vraie logique
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const toneText = tone ? ` avec un ton ${tone}` : '';
      const generatedPrompt = `Créez un contenu détaillé pour atteindre l'objectif suivant : "${objective}"${toneText}. 

Assurez-vous d'inclure :
- Une introduction engageante
- Des points clés structurés
- Des exemples concrets
- Une conclusion actionnable

Adaptez le style et le niveau de détail selon le contexte et l'audience cible.`;

      setResult(generatedPrompt);
      
      toast({
        title: "Succès",
        description: "Prompt généré avec succès !",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result);
      toast({
        title: "Copié",
        description: "Le prompt a été copié dans le presse-papiers",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le texte",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* En-tête */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Générateur de Prompt Simple</h1>
          <p className="text-muted-foreground">
            Créez des prompts efficaces en quelques clics
          </p>
        </div>

        {/* Formulaire de génération */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-foreground">Paramètres du Prompt</CardTitle>
            <CardDescription>
              Décrivez votre objectif et sélectionnez un style optionnel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Zone objectif */}
            <div className="space-y-2">
              <Label htmlFor="objective" className="text-sm font-medium text-foreground">
                Quel est votre objectif ? *
              </Label>
              <Textarea
                id="objective"
                placeholder="Décrivez ce que vous souhaitez accomplir avec ce prompt..."
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="min-h-[120px] bg-input text-foreground border-border"
                disabled={isLoading}
              />
            </div>

            {/* Sélecteur de ton/style */}
            <div className="space-y-2">
              <Label htmlFor="tone" className="text-sm font-medium text-foreground">
                Ton/Style (optionnel)
              </Label>
              <Select value={tone} onValueChange={setTone} disabled={isLoading}>
                <SelectTrigger className="bg-input text-foreground border-border">
                  <SelectValue placeholder="Sélectionnez un ton" />
                </SelectTrigger>
                <SelectContent>
                  {toneOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Bouton générer */}
            <Button 
              onClick={generatePrompt}
              disabled={isLoading || !objective.trim()}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                'Générer le Prompt'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Zone de résultat */}
        {(result || isLoading) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-foreground">
                {result && <CheckCircle className="h-5 w-5 text-green-500" />}
                Résultat
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="text-muted-foreground">Génération de votre prompt personnalisé...</span>
                  </div>
                </div>
              ) : result ? (
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg border">
                    <pre className="whitespace-pre-wrap text-sm text-foreground font-mono leading-relaxed">
                      {result}
                    </pre>
                  </div>
                  <Button 
                    onClick={copyToClipboard}
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copier le Prompt
                  </Button>
                </div>
              ) : null}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SimplePromptGenerator;