import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Zap, Copy, Sparkles, Wand2, Save } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { usePrompts } from "@/hooks/usePrompts";
import { supabase } from "@/integrations/supabase/client";

const PromptGeneratorSupabase = () => {
  const { t } = useTranslation();
  const { savePrompt, isSaving } = usePrompts();
  
  const [formData, setFormData] = useState({
    domain: '',
    specialization: '',
    description: '',
    objective: '',
    targetAudience: '',
    format: '',
    tone: '',
    length: ''
  });
  
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Configuration des domaines et spécialisations
  const domains = [
    { value: 'marketing', label: 'Marketing' },
    { value: 'development', label: 'Développement' },
    { value: 'design', label: 'Design' },
    { value: 'content-creation', label: 'Création de Contenu' },
    { value: 'education', label: 'Éducation' },
    { value: 'sales', label: 'Vente' },
    { value: 'customer-service', label: 'Service Client' },
    { value: 'hr', label: 'Ressources Humaines' },
    { value: 'finance', label: 'Finance' },
    { value: 'research', label: 'Recherche' }
  ];

  const specializations = {
    'marketing': [
      { value: 'seo', label: 'SEO' },
      { value: 'social-media', label: 'Réseaux Sociaux' },
      { value: 'email-marketing', label: 'Email Marketing' },
      { value: 'content-marketing', label: 'Marketing de Contenu' },
      { value: 'paid-ads', label: 'Publicité Payante' }
    ],
    'development': [
      { value: 'frontend', label: 'Frontend' },
      { value: 'backend', label: 'Backend' },
      { value: 'mobile', label: 'Mobile' },
      { value: 'devops', label: 'DevOps' },
      { value: 'ai-ml', label: 'IA/ML' }
    ],
    'content-creation': [
      { value: 'copywriting', label: 'Copywriting' },
      { value: 'storytelling', label: 'Storytelling' },
      { value: 'technical-writing', label: 'Rédaction Technique' },
      { value: 'creative-writing', label: 'Écriture Créative' },
      { value: 'journalism', label: 'Journalisme' }
    ]
  };

  const outputFormats = [
    { value: 'structured', label: 'Format structuré avec sections' },
    { value: 'bullet-points', label: 'Points clés / Puces' },
    { value: 'narrative', label: 'Format narratif' },
    { value: 'qa', label: 'Questions-Réponses' },
    { value: 'checklist', label: 'Liste de vérification' },
    { value: 'template', label: 'Modèle réutilisable' }
  ];

  const toneOptions = [
    { value: 'professional', label: 'Professionnel' },
    { value: 'friendly', label: 'Amical' },
    { value: 'authoritative', label: 'Autoritaire' },
    { value: 'casual', label: 'Décontracté' },
    { value: 'enthusiastic', label: 'Enthousiaste' },
    { value: 'empathetic', label: 'Empathique' }
  ];

  const lengthOptions = [
    { value: 'short', label: 'Court (50-100 mots)' },
    { value: 'medium', label: 'Moyen (100-200 mots)' },
    { value: 'long', label: 'Long (200-300 mots)' },
    { value: 'very-long', label: 'Très long (300+ mots)' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      // Reset specialization when domain changes
      ...(field === 'domain' ? { specialization: '' } : {})
    }));
  };

  const generatePrompt = async () => {
    if (!formData.domain || !formData.description) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un domaine et fournir une description.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const systemPrompt = `Tu es un expert en création de prompts pour l'intelligence artificielle. Crée un prompt détaillé et structuré.

Format requis:
**RÔLE**: [rôle expert spécialisé]
**MISSION**: [mission précise et claire]
**OBJECTIFS**: [objectifs détaillés et mesurables]
**MÉTHODOLOGIE**: [approche structurée]
**CONTRAINTES**: [contraintes techniques et contextuelles]
**LIVRABLES**: [résultats attendus avec format spécifique]
**STYLE**: [ton et style de communication]`;

      const domainLabel = domains.find(d => d.value === formData.domain)?.label;
      const subcategoryLabel = formData.specialization ? 
        specializations[formData.domain as keyof typeof specializations]?.find(s => s.value === formData.specialization)?.label : '';

      let userPrompt = `Crée un prompt expert pour:
- Domaine: ${domainLabel}
${subcategoryLabel ? `- Spécialisation: ${subcategoryLabel}` : ''}
- Description: ${formData.description}`;

      if (formData.objective) userPrompt += `\n- Objectif: ${formData.objective}`;
      if (formData.targetAudience) userPrompt += `\n- Public cible: ${formData.targetAudience}`;
      if (formData.format) userPrompt += `\n- Format souhaité: ${outputFormats.find(f => f.value === formData.format)?.label}`;
      if (formData.tone) userPrompt += `\n- Ton: ${toneOptions.find(t => t.value === formData.tone)?.label}`;
      if (formData.length) userPrompt += `\n- Longueur: ${lengthOptions.find(l => l.value === formData.length)?.label}`;

      // Call the Supabase edge function
      const { data, error } = await supabase.functions.invoke('chat-with-openai', {
        body: {
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: userPrompt
            }
          ],
          model: 'gpt-4o-mini',
          max_tokens: 1000,
          temperature: 0.7,
          provider: 'openai'
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.choices && data.choices[0]?.message?.content) {
        setGeneratedPrompt(data.choices[0].message.content);
        toast({
          title: "Prompt généré !",
          description: "Votre prompt expert a été créé avec succès.",
        });
      } else {
        throw new Error('Réponse invalide de l\'API');
      }

    } catch (error) {
      console.error('Erreur génération:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de générer le prompt. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    toast({
      title: "Copié !",
      description: "Le prompt a été copié dans le presse-papiers.",
    });
  };

  const handleSavePrompt = async () => {
    if (!generatedPrompt) {
      toast({
        title: "Erreur",
        description: "Aucun prompt à sauvegarder.",
        variant: "destructive",
      });
      return;
    }

    const domainLabel = domains.find(d => d.value === formData.domain)?.label;
    const subcategoryLabel = formData.specialization ? 
      specializations[formData.domain as keyof typeof specializations]?.find(s => s.value === formData.specialization)?.label : '';

    const title = `Prompt ${domainLabel}${subcategoryLabel ? ` - ${subcategoryLabel}` : ''}`;
    
    await savePrompt({
      title,
      content: generatedPrompt,
      description: formData.description,
      category: formData.domain,
      tags: [formData.domain, ...(formData.specialization ? [formData.specialization] : [])],
      is_public: false
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <Card className="glass-card border-white/30 dark:border-gray-700/30 shadow-xl">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold gradient-text flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6" />
            Générateur de Prompts Expert - OpenAI
          </CardTitle>
          <CardDescription className="text-lg">
            Créez des prompts optimisés avec l'API OpenAI stockée dans Supabase
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Domaine */}
            <div className="space-y-2">
              <Label htmlFor="domain">Domaine d'expertise *</Label>
              <Select value={formData.domain} onValueChange={(value) => handleInputChange('domain', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un domaine" />
                </SelectTrigger>
                <SelectContent>
                  {domains.map((domain) => (
                    <SelectItem key={domain.value} value={domain.value}>
                      {domain.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Spécialisation */}
            {formData.domain && specializations[formData.domain as keyof typeof specializations] && (
              <div className="space-y-2">
                <Label htmlFor="specialization">Spécialisation</Label>
                <Select value={formData.specialization} onValueChange={(value) => handleInputChange('specialization', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une spécialisation" />
                  </SelectTrigger>
                  <SelectContent>
                    {specializations[formData.domain as keyof typeof specializations].map((spec) => (
                      <SelectItem key={spec.value} value={spec.value}>
                        {spec.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Public cible */}
            <div className="space-y-2">
              <Label htmlFor="audience">Public cible</Label>
              <Select value={formData.targetAudience} onValueChange={(value) => handleInputChange('targetAudience', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Qui utilisera ce prompt ?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginners">Débutants</SelectItem>
                  <SelectItem value="intermediate">Niveau intermédiaire</SelectItem>
                  <SelectItem value="experts">Experts</SelectItem>
                  <SelectItem value="general">Grand public</SelectItem>
                  <SelectItem value="professionals">Professionnels</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Format de sortie */}
            <div className="space-y-2">
              <Label htmlFor="format">Format de sortie</Label>
              <Select value={formData.format} onValueChange={(value) => handleInputChange('format', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Comment structurer la réponse ?" />
                </SelectTrigger>
                <SelectContent>
                  {outputFormats.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      {format.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Ton */}
            <div className="space-y-2">
              <Label htmlFor="tone">Ton de communication</Label>
              <Select value={formData.tone} onValueChange={(value) => handleInputChange('tone', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Quel ton adopter ?" />
                </SelectTrigger>
                <SelectContent>
                  {toneOptions.map((tone) => (
                    <SelectItem key={tone.value} value={tone.value}>
                      {tone.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Longueur */}
            <div className="space-y-2">
              <Label htmlFor="length">Longueur souhaitée</Label>
              <Select value={formData.length} onValueChange={(value) => handleInputChange('length', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Quelle longueur ?" />
                </SelectTrigger>
                <SelectContent>
                  {lengthOptions.map((length) => (
                    <SelectItem key={length.value} value={length.value}>
                      {length.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description du besoin *</Label>
            <Textarea
              id="description"
              placeholder="Décrivez précisément ce que vous voulez accomplir avec ce prompt..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* Objectif spécifique */}
          <div className="space-y-2">
            <Label htmlFor="objective">Objectif spécifique (optionnel)</Label>
            <Textarea
              id="objective"
              placeholder="Quel résultat concret attendez-vous ? (ex: augmenter le taux de conversion, améliorer l'engagement...)"
              value={formData.objective}
              onChange={(e) => handleInputChange('objective', e.target.value)}
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* Bouton de génération */}
          <Button 
            onClick={generatePrompt}
            disabled={isLoading || !formData.domain || !formData.description}
            className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white font-medium py-3 h-auto"
          >
            {isLoading ? (
              <>
                <Wand2 className="h-5 w-5 mr-2 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Zap className="h-5 w-5 mr-2" />
                Générer le Prompt Expert
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Résultat */}
      {generatedPrompt && (
        <Card className="glass-card border-white/30 dark:border-gray-700/30 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="gradient-text">Prompt Généré</span>
              <div className="flex gap-2">
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="sm"
                  className="border-white/30 dark:border-gray-700/30"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copier
                </Button>
                <Button
                  onClick={handleSavePrompt}
                  variant="outline"
                  size="sm"
                  className="border-white/30 dark:border-gray-700/30"
                  disabled={isSaving}
                >
                  <Save className="h-4 w-4 mr-1" />
                  {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-lg border border-white/20 dark:border-gray-700/20">
              <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono">
                {generatedPrompt}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PromptGeneratorSupabase;