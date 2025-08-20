import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Search, Copy, Trash2, Eye, Calendar, Tag, Filter } from "lucide-react";
import { usePrompts } from "@/hooks/usePrompts";
import { useTranslation } from "@/hooks/useTranslation";

const PromptHistory = () => {
  const [prompts, setPrompts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const { getUserPrompts, isLoading } = usePrompts();
  const { t } = useTranslation();

  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = async () => {
    const userPrompts = await getUserPrompts();
    setPrompts(userPrompts);
  };

  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (prompt.description && prompt.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !selectedCategory || prompt.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const copyPrompt = async (prompt) => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      toast({
        title: "Prompt copié",
        description: "Le prompt a été copié dans le presse-papiers",
      });
    } catch (err) {
      toast({
        title: "Erreur de copie",
        description: "Impossible de copier le prompt",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const categories = [...new Set(prompts.map(p => p.category).filter(Boolean))];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Chargement de votre historique...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold gradient-text">Historique des Prompts</h2>
          <p className="text-muted-foreground">Gérez et réutilisez vos prompts sauvegardés</p>
        </div>
        <Badge variant="secondary" className="bg-primary/10 text-primary">
          {prompts.length} prompts sauvegardés
        </Badge>
      </div>

      {/* Filtres */}
      <Card className="glass-card border-white/30">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Rechercher
              </Label>
              <Input
                id="search"
                placeholder="Rechercher par titre, contenu ou description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/50 dark:bg-gray-800/50"
              />
            </div>
            {categories.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="category" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Catégorie
                </Label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-input bg-white/50 dark:bg-gray-800/50 text-foreground"
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Liste des prompts */}
      {filteredPrompts.length === 0 ? (
        <Card className="glass-card border-white/30">
          <CardContent className="pt-6 text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              {prompts.length === 0 ? "Aucun prompt sauvegardé" : "Aucun résultat trouvé"}
            </h3>
            <p className="text-muted-foreground">
              {prompts.length === 0 
                ? "Commencez par créer et sauvegarder votre premier prompt"
                : "Essayez de modifier vos critères de recherche"
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredPrompts.map((prompt) => (
            <Card key={prompt.id} className="glass-card border-white/30 hover:shadow-lg transition-all duration-300 hover-lift">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-semibold">{prompt.title}</CardTitle>
                    {prompt.description && (
                      <CardDescription className="text-sm">{prompt.description}</CardDescription>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedPrompt(prompt)}
                          className="hover:bg-primary/10"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{prompt.title}</DialogTitle>
                          {prompt.description && (
                            <DialogDescription>{prompt.description}</DialogDescription>
                          )}
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="bg-muted/50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">Contenu du prompt :</h4>
                            <pre className="whitespace-pre-wrap text-sm">{prompt.content}</pre>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {formatDate(prompt.created_at)}
                              </span>
                              {prompt.category && (
                                <span className="flex items-center gap-1">
                                  <Tag className="h-4 w-4" />
                                  {prompt.category}
                                </span>
                              )}
                            </div>
                            <Button onClick={() => copyPrompt(prompt)} className="gap-2">
                              <Copy className="h-4 w-4" />
                              Copier
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyPrompt(prompt)}
                      className="hover:bg-primary/10"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(prompt.created_at)}
                    </span>
                    {prompt.category && (
                      <Badge variant="secondary" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {prompt.category}
                      </Badge>
                    )}
                    {prompt.is_public && (
                      <Badge variant="outline" className="text-xs">
                        Public
                      </Badge>
                    )}
                  </div>
                  {prompt.tags && prompt.tags.length > 0 && (
                    <div className="flex gap-1">
                      {prompt.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {prompt.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{prompt.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PromptHistory;