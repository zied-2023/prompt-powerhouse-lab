import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { usePrompts } from "@/hooks/usePrompts";
import { useMarketplace, type LicenseType } from "@/hooks/useMarketplace";
import { X } from "lucide-react";

interface NewPromptFormProps {
  onSuccess: () => void;
  licenseTypes: LicenseType[];
}

const NewPromptForm: React.FC<NewPromptFormProps> = ({ onSuccess, licenseTypes }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    description: '',
    category: '',
    tags: [] as string[],
    price: '',
    license: ''
  });
  const [currentTag, setCurrentTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { savePrompt } = usePrompts();
  const { publishPromptToMarketplace } = useMarketplace();

  const categories = [
    'Marketing',
    'Development',
    'Writing',
    'Design',
    'Business',
    'Education',
    'Entertainment',
    'Other'
  ];

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !formData.price || !formData.license) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // D'abord créer le prompt
      const promptData = {
        title: formData.title,
        content: formData.content,
        description: formData.description,
        category: formData.category,
        tags: formData.tags,
        isPublic: false // Les prompts créés pour la vente ne sont pas publics par défaut
      };

      const savedPrompt = await savePrompt(promptData);
      
      if (!savedPrompt) {
        throw new Error("Erreur lors de la création du prompt");
      }

      // Ensuite le publier sur le marketplace
      const marketplaceData = {
        prompt_id: savedPrompt.id,
        price: parseFloat(formData.price),
        license_type: formData.license
      };

      const result = await publishPromptToMarketplace(marketplaceData);

      if (result) {
        toast({
          title: "Succès",
          description: "Votre prompt a été créé et publié sur le marketplace"
        });
        onSuccess();
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la publication",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations du Prompt</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              placeholder="Ex: Prompt pour créer des posts LinkedIn engageants"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Décrivez brièvement ce que fait ce prompt et pour qui il est utile"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Contenu du Prompt *</Label>
            <Textarea
              id="content"
              placeholder="Écrivez ici le prompt complet..."
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              rows={8}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  placeholder="Ajouter un tag"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <Button type="button" onClick={handleAddTag} size="sm">
                  Ajouter
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Paramètres de Vente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Prix (USD) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="9.99"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="license">Type de licence *</Label>
              <Select value={formData.license} onValueChange={(value) => setFormData(prev => ({ ...prev, license: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une licence" />
                </SelectTrigger>
                <SelectContent>
                  {licenseTypes.map(license => (
                    <SelectItem key={license.id} value={license.name}>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{license.name}</span>
                        <span className="text-xs text-muted-foreground">{license.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onSuccess} className="flex-1">
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? "Création et publication..." : "Créer et Publier"}
        </Button>
      </div>
    </form>
  );
};

export default NewPromptForm;