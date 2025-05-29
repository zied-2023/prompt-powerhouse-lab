
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Zap, Copy, Sparkles, Wand2 } from "lucide-react";

const PromptGenerator = () => {
  const [formData, setFormData] = useState({
    category: '',
    description: ''
  });
  
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const categories = [
    { value: 'text-generation', label: '✍️ Écrire du texte', description: 'Articles, emails, histoires...' },
    { value: 'creative-writing', label: '🎨 Créer du contenu créatif', description: 'Poèmes, récits, scénarios...' },
    { value: 'image-creation', label: '🖼️ Décrire des images', description: 'Pour créer des images avec IA' },
    { value: 'code-generation', label: '💻 Coder', description: 'Programmes, scripts, sites web...' },
    { value: 'data-analysis', label: '📊 Analyser des données', description: 'Résumés, rapports, insights...' },
    { value: 'interactive-dialogue', label: '💬 Avoir une conversation', description: 'Assistant, coach, tuteur...' }
  ];

  const generatePrompt = () => {
    if (!formData.category || !formData.description) {
      toast({
        title: "Information manquante",
        description: "Veuillez choisir une catégorie et décrire ce que vous voulez.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    setTimeout(() => {
      const categoryLabel = categories.find(cat => cat.value === formData.category)?.label || '';
      
      const prompt = `Tu es un assistant IA spécialisé dans la ${categoryLabel.toLowerCase()}.

**Tâche** : ${formData.description}

**Instructions** :
- Sois précis et utile dans ta réponse
- Adapte ton style au contexte demandé
- Si tu as besoin de plus d'informations, pose des questions claires
- Fournis une réponse complète et bien structurée

**Format** : Réponds de manière claire et organisée, en utilisant des paragraphes ou des listes quand c'est approprié.`;

      setGeneratedPrompt(prompt);
      setIsGenerating(false);
      
      toast({
        title: "Prompt créé !",
        description: "Votre prompt est prêt à être utilisé.",
      });
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    toast({
      title: "Copié !",
      description: "Le prompt a été copié dans votre presse-papiers.",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Formulaire simplifié */}
      <Card className="glass-card border-white/30 shadow-2xl hover-lift">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center space-x-3 text-2xl">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Wand2 className="h-5 w-5 text-white" />
            </div>
            <span className="gradient-text">Créer un Prompt</span>
          </CardTitle>
          <CardDescription className="text-gray-600 font-medium">
            Décrivez simplement ce que vous voulez faire avec l'IA
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="category" className="text-sm font-semibold text-gray-700">
              Que voulez-vous faire ? *
            </Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
              <SelectTrigger className="animated-border hover:shadow-lg transition-all duration-200 bg-white">
                <SelectValue placeholder="Choisissez une option..." />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-xl z-50">
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value} className="font-medium py-3 px-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex flex-col">
                      <div className="font-semibold text-gray-800">{cat.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{cat.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
              Décrivez ce que vous voulez précisément *
            </Label>
            <Textarea
              id="description"
              placeholder="Exemple : Écris un email professionnel pour remercier un client après un achat..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="animated-border hover:shadow-lg transition-all duration-200 font-medium resize-none min-h-[120px] bg-white"
              rows={5}
            />
            <p className="text-xs text-gray-500">
              💡 Plus vous êtes précis, meilleur sera le résultat !
            </p>
          </div>

          <Button 
            onClick={generatePrompt} 
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 hover:from-violet-700 hover:via-purple-700 hover:to-blue-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 glow-effect text-lg"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin h-5 w-5 mr-3 border-2 border-white border-t-transparent rounded-full"></div>
                Création en cours...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-3" />
                Créer mon Prompt
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Résultat */}
      <Card className="glass-card border-white/30 shadow-2xl hover-lift">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center justify-between text-2xl">
            <span className="gradient-text">Votre Prompt</span>
            {generatedPrompt && (
              <Button variant="outline" size="sm" onClick={copyToClipboard} className="hover-lift glass-card border-white/30">
                <Copy className="h-4 w-4 mr-2" />
                Copier
              </Button>
            )}
          </CardTitle>
          <CardDescription className="text-gray-600 font-medium">
            Copiez et collez ce prompt dans votre IA préférée
          </CardDescription>
        </CardHeader>
        <CardContent>
          {generatedPrompt ? (
            <div className="glass-card border-white/30 p-6 rounded-xl">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
                {generatedPrompt}
              </pre>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700 font-medium">
                  📋 <strong>Comment utiliser :</strong> Copiez ce texte et collez-le dans ChatGPT, Claude, ou toute autre IA. Ensuite, ajoutez vos détails spécifiques !
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl flex items-center justify-center">
                <Zap className="h-8 w-8 text-violet-400" />
              </div>
              <p className="font-medium text-lg mb-2">Prêt à créer votre prompt ✨</p>
              <p className="text-sm">Remplissez le formulaire à gauche pour générer votre prompt personnalisé.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PromptGenerator;
