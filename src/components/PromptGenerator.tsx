import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Zap, Copy, Download, AlertCircle, CheckCircle, Sparkles, Magic } from "lucide-react";

const PromptGenerator = () => {
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    userInput: '',
    context: '',
    constraints: '',
    outputFormat: ''
  });
  
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const categories = [
    { value: 'text-generation', label: '📝 Génération de Texte', color: 'from-blue-500 to-cyan-500' },
    { value: 'image-creation', label: '🎨 Création d\'Images', color: 'from-purple-500 to-pink-500' },
    { value: 'interactive-dialogue', label: '💬 Dialogue Interactif', color: 'from-emerald-500 to-teal-500' },
    { value: 'code-generation', label: '⚡ Génération de Code', color: 'from-orange-500 to-red-500' },
    { value: 'data-analysis', label: '📊 Analyse de Données', color: 'from-violet-500 to-purple-500' },
    { value: 'creative-writing', label: '✨ Écriture Créative', color: 'from-indigo-500 to-blue-500' }
  ];

  const outputFormats = [
    { value: 'structured', label: '📋 Réponse Structurée' },
    { value: 'conversational', label: '💭 Conversationnel' },
    { value: 'bullet-points', label: '• Points Clés' },
    { value: 'step-by-step', label: '🔢 Étape par Étape' },
    { value: 'json', label: '{ } Format JSON' }
  ];

  const validateForm = () => {
    const errors = {};
    if (!formData.category) errors.category = 'Catégorie requise';
    if (!formData.title) errors.title = 'Titre requis';
    if (!formData.description) errors.description = 'Description requise';
    if (!formData.userInput) errors.userInput = 'Spécification d\'entrée utilisateur requise';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const generatePrompt = () => {
    if (!validateForm()) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs requis.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    setTimeout(() => {
      const prompt = `
**Catégorie de Prompt**: ${formData.category.replace('-', ' ').toUpperCase()}

**Titre**: ${formData.title}

**Description**: ${formData.description}

**Instructions**:
${formData.context ? `Contexte: ${formData.context}\n` : ''}
Entrée Utilisateur: ${formData.userInput}
${formData.constraints ? `Contraintes: ${formData.constraints}\n` : ''}
${formData.outputFormat ? `Format de Sortie: ${formData.outputFormat}\n` : ''}

**Exemple d'Usage**:
Entrée: [L'utilisateur fournit son ${formData.userInput.toLowerCase()} spécifique]
Sortie: [Réponse générée suivant le format et les contraintes spécifiées]

**Règles de Validation**:
- S'assurer que toutes les entrées requises sont fournies
- Valider que le format d'entrée correspond aux attentes
- Vérifier la conformité aux directives de contenu appropriées
- Vérifier que la sortie respecte les contraintes spécifiées
      `.trim();

      setGeneratedPrompt(prompt);
      setIsGenerating(false);
      
      toast({
        title: "Prompt Généré!",
        description: "Votre prompt automatisé a été créé avec succès.",
      });
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    toast({
      title: "Copié!",
      description: "Prompt copié dans le presse-papiers.",
    });
  };

  const downloadPrompt = () => {
    const blob = new Blob([generatedPrompt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.title.replace(/\s+/g, '-').toLowerCase()}-prompt.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Téléchargé!",
      description: "Prompt sauvegardé sur votre appareil.",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Form */}
      <Card className="glass-card border-white/30 shadow-2xl hover-lift">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center space-x-3 text-2xl">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Magic className="h-5 w-5 text-white" />
            </div>
            <span className="gradient-text">Configuration du Prompt</span>
          </CardTitle>
          <CardDescription className="text-gray-600 font-medium">
            Configurez vos paramètres de génération automatique de prompts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-semibold text-gray-700">Catégorie *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger className={`animated-border transition-all duration-200 ${validationErrors.category ? 'border-red-400 shadow-red-100' : 'hover:shadow-lg'}`}>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/30">
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value} className="font-medium">
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {validationErrors.category && (
                <p className="text-sm text-red-500 flex items-center mt-2 font-medium">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {validationErrors.category}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="outputFormat" className="text-sm font-semibold text-gray-700">Format de Sortie</Label>
              <Select value={formData.outputFormat} onValueChange={(value) => setFormData({...formData, outputFormat: value})}>
                <SelectTrigger className="animated-border hover:shadow-lg transition-all duration-200">
                  <SelectValue placeholder="Sélectionner un format" />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/30">
                  {outputFormats.map((format) => (
                    <SelectItem key={format.value} value={format.value} className="font-medium">
                      {format.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-semibold text-gray-700">Titre du Prompt *</Label>
            <Input
              id="title"
              placeholder="ex: Générateur d'articles de blog"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className={`animated-border transition-all duration-200 font-medium ${validationErrors.title ? 'border-red-400 shadow-red-100' : 'hover:shadow-lg'}`}
            />
            {validationErrors.title && (
              <p className="text-sm text-red-500 flex items-center mt-2 font-medium">
                <AlertCircle className="h-3 w-3 mr-1" />
                {validationErrors.title}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold text-gray-700">Description *</Label>
            <Textarea
              id="description"
              placeholder="Décrivez ce que ce prompt accomplira..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className={`animated-border transition-all duration-200 font-medium resize-none ${validationErrors.description ? 'border-red-400 shadow-red-100' : 'hover:shadow-lg'}`}
              rows={3}
            />
            {validationErrors.description && (
              <p className="text-sm text-red-500 flex items-center mt-2 font-medium">
                <AlertCircle className="h-3 w-3 mr-1" />
                {validationErrors.description}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="userInput" className="text-sm font-semibold text-gray-700">Exigences d'Entrée Utilisateur *</Label>
            <Input
              id="userInput"
              placeholder="ex: sujet, mots-clés, public cible"
              value={formData.userInput}
              onChange={(e) => setFormData({...formData, userInput: e.target.value})}
              className={`animated-border transition-all duration-200 font-medium ${validationErrors.userInput ? 'border-red-400 shadow-red-100' : 'hover:shadow-lg'}`}
            />
            {validationErrors.userInput && (
              <p className="text-sm text-red-500 flex items-center mt-2 font-medium">
                <AlertCircle className="h-3 w-3 mr-1" />
                {validationErrors.userInput}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="context" className="text-sm font-semibold text-gray-700">Contexte Additionnel</Label>
            <Textarea
              id="context"
              placeholder="Toute information contextuelle ou d'arrière-plan supplémentaire..."
              value={formData.context}
              onChange={(e) => setFormData({...formData, context: e.target.value})}
              className="animated-border hover:shadow-lg transition-all duration-200 font-medium resize-none"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="constraints" className="text-sm font-semibold text-gray-700">Contraintes & Directives</Label>
            <Textarea
              id="constraints"
              placeholder="Toute contrainte spécifique, limite de mots, ou directive..."
              value={formData.constraints}
              onChange={(e) => setFormData({...formData, constraints: e.target.value})}
              className="animated-border hover:shadow-lg transition-all duration-200 font-medium resize-none"
              rows={2}
            />
          </div>

          <Button 
            onClick={generatePrompt} 
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 hover:from-violet-700 hover:via-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 glow-effect"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin h-5 w-5 mr-3 border-2 border-white border-t-transparent rounded-full"></div>
                Génération en cours...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-3" />
                Générer le Prompt
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Prompt Display */}
      <Card className="glass-card border-white/30 shadow-2xl hover-lift">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center justify-between text-2xl">
            <span className="gradient-text">Prompt Généré</span>
            {generatedPrompt && (
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard} className="hover-lift glass-card border-white/30">
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={downloadPrompt} className="hover-lift glass-card border-white/30">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardTitle>
          <CardDescription className="text-gray-600 font-medium">
            Votre prompt automatisé apparaîtra ici
          </CardDescription>
        </CardHeader>
        <CardContent>
          {generatedPrompt ? (
            <div className="glass-card border-white/30 p-6 rounded-xl">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
                {generatedPrompt}
              </pre>
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl flex items-center justify-center">
                <Zap className="h-8 w-8 text-violet-400" />
              </div>
              <p className="font-medium text-lg mb-2">Prêt à créer de la magie ✨</p>
              <p className="text-sm">Remplissez le formulaire et cliquez sur "Générer le Prompt" pour voir votre prompt automatisé ici.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PromptGenerator;
