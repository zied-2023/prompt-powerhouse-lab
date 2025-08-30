import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Eye, 
  Calendar, 
  Tag, 
  Filter,
  Search,
  DollarSign,
  Shield,
  Users,
  TrendingUp,
  Award
} from "lucide-react";
import { useMarketplace, type MarketplacePrompt } from "@/hooks/useMarketplace";

interface MarketplacePromptGridProps {
  showFilters?: boolean;
  sellerId?: string;
  title?: string;
  description?: string;
}

const MarketplacePromptGrid: React.FC<MarketplacePromptGridProps> = ({
  showFilters = true,
  sellerId,
  title = "Marketplace de Prompts",
  description = "Découvrez et achetez des prompts optimisés créés par la communauté"
}) => {
  const [prompts, setPrompts] = useState<MarketplacePrompt[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<MarketplacePrompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<MarketplacePrompt | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState<'created_at' | 'price' | 'sales_count'>('created_at');
  const [licenseFilter, setLicenseFilter] = useState("all");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  const { 
    getMarketplacePrompts, 
    getSellerPrompts,
    addToFavorites, 
    removeFromFavorites,
    isLoading 
  } = useMarketplace();

  useEffect(() => {
    loadPrompts();
  }, [sellerId]);

  useEffect(() => {
    applyFilters();
  }, [prompts, searchTerm, selectedCategory, priceRange, sortBy, licenseFilter, showFeaturedOnly]);

  const loadPrompts = async () => {
    try {
      let data;
      if (sellerId) {
        data = await getSellerPrompts(sellerId);
      } else {
        data = await getMarketplacePrompts();
      }
      setPrompts(data);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...prompts];

    // Filtrage par recherche
    if (searchTerm) {
      filtered = filtered.filter(prompt =>
        prompt.prompts?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.prompts?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.prompts?.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrage par catégorie
    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter(prompt => prompt.prompts?.category === selectedCategory);
    }

    // Filtrage par prix
    if (priceRange.min) {
      filtered = filtered.filter(prompt => prompt.price >= parseFloat(priceRange.min));
    }
    if (priceRange.max) {
      filtered = filtered.filter(prompt => prompt.price <= parseFloat(priceRange.max));
    }

    // Filtrage par licence
    if (licenseFilter && licenseFilter !== "all") {
      filtered = filtered.filter(prompt => prompt.license_type === licenseFilter);
    }

    // Filtrage par prompts vedettes
    if (showFeaturedOnly) {
      filtered = filtered.filter(prompt => prompt.is_featured);
    }

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'sales_count':
          return b.sales_count - a.sales_count;
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    setFilteredPrompts(filtered);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(price);
  };

  const getAverageRating = (reviews: any[]) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  const getLicenseBadgeColor = (licenseType: string) => {
    switch (licenseType.toLowerCase()) {
      case 'standard':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'premium':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'extended':
        return 'bg-gold-100 text-gold-800 dark:bg-gold-900 dark:text-gold-200';
      case 'personal':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const categories = [...new Set(prompts.map(p => p.prompts?.category).filter(Boolean))];
  const licenseTypes = [...new Set(prompts.map(p => p.license_type))];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Chargement du marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold gradient-text">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {filteredPrompts.length} prompts
          </Badge>
          {showFeaturedOnly && (
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
              <Award className="w-3 h-3 mr-1" />
              Vedettes
            </Badge>
          )}
        </div>
      </div>

      {/* Filtres */}
      {showFilters && (
        <Card className="glass-card border-white/30">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Recherche */}
              <div className="space-y-2">
                <Label htmlFor="search" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Recherche
                </Label>
                <Input
                  id="search"
                  placeholder="Titre, description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white/50 dark:bg-gray-800/50"
                />
              </div>

              {/* Catégorie */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Catégorie
                </Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-white/50 dark:bg-gray-800/50">
                    <SelectValue placeholder="Toutes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Prix */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Fourchette de prix
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({...prev, min: e.target.value}))}
                    className="bg-white/50 dark:bg-gray-800/50"
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({...prev, max: e.target.value}))}
                    className="bg-white/50 dark:bg-gray-800/50"
                  />
                </div>
              </div>

              {/* Tri */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Trier par
                </Label>
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="bg-white/50 dark:bg-gray-800/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at">Plus récent</SelectItem>
                    <SelectItem value="price">Prix croissant</SelectItem>
                    <SelectItem value="sales_count">Plus vendu</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Licence - Filtre additionnel */}
              {licenseTypes.length > 0 && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Licence
                  </Label>
                  <Select value={licenseFilter} onValueChange={setLicenseFilter}>
                    <SelectTrigger className="bg-white/50 dark:bg-gray-800/50">
                      <SelectValue placeholder="Toutes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les licences</SelectItem>
                      {licenseTypes.map(license => (
                        <SelectItem key={license} value={license}>{license}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Filtres supplémentaires */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Button
                variant={showFeaturedOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
                className="h-8"
              >
                <Award className="w-3 h-3 mr-1" />
                Vedettes
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grille des prompts */}
      {filteredPrompts.length === 0 ? (
        <Card className="glass-card border-white/30">
          <CardContent className="pt-6 text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              Aucun prompt trouvé
            </h3>
            <p className="text-muted-foreground">
              Essayez de modifier vos critères de recherche
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPrompts.map((prompt) => {
            const averageRating = getAverageRating(prompt.marketplace_reviews || []);
            const reviewCount = prompt.marketplace_reviews?.length || 0;

            return (
              <Card key={prompt.id} className="glass-card border-white/30 hover:shadow-lg transition-all duration-300 hover-lift relative overflow-hidden group">
                {/* Badges de statut */}
                <div className="absolute top-4 right-4 flex flex-col gap-1 z-10">
                  {prompt.is_featured && (
                    <Badge className="bg-yellow-500/90 hover:bg-yellow-600 text-white">
                      <Award className="w-3 h-3 mr-1" />
                      Vedette
                    </Badge>
                  )}
                  {prompt.is_verified && (
                    <Badge className="bg-emerald-500/90 hover:bg-emerald-600 text-white">
                      <Shield className="w-3 h-3 mr-1" />
                      Vérifié
                    </Badge>
                  )}
                </div>

                <CardHeader className="pb-3">
                  <div className="space-y-2">
                    <CardTitle className="text-lg font-semibold pr-16 group-hover:text-primary transition-colors">
                      {prompt.prompts?.title}
                    </CardTitle>
                    {prompt.prompts?.description && (
                      <CardDescription className="text-sm line-clamp-2">
                        {prompt.prompts?.description}
                      </CardDescription>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Prix et licence */}
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-primary">
                      {formatPrice(prompt.price, prompt.currency)}
                    </div>
                    <Badge className={getLicenseBadgeColor(prompt.license_type)}>
                      {prompt.license_type}
                    </Badge>
                  </div>

                  {/* Métadonnées */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(prompt.created_at)}
                      </span>
                      {prompt.prompts?.category && (
                        <span className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {prompt.prompts.category}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Évaluations et ventes */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {averageRating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{averageRating.toFixed(1)}</span>
                          <span className="text-sm text-muted-foreground">({reviewCount})</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        {prompt.sales_count} ventes
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  {prompt.prompts?.tags && prompt.prompts.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {prompt.prompts.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {prompt.prompts.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{prompt.prompts.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => setSelectedPrompt(prompt)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Aperçu
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center justify-between">
                            {selectedPrompt?.prompts?.title}
                            <div className="flex items-center gap-2">
                              <Badge className={getLicenseBadgeColor(selectedPrompt?.license_type || '')}>
                                {selectedPrompt?.license_type}
                              </Badge>
                              <div className="text-2xl font-bold text-primary">
                                {selectedPrompt && formatPrice(selectedPrompt.price, selectedPrompt.currency)}
                              </div>
                            </div>
                          </DialogTitle>
                          {selectedPrompt?.prompts?.description && (
                            <DialogDescription>
                              {selectedPrompt.prompts.description}
                            </DialogDescription>
                          )}
                        </DialogHeader>
                        {selectedPrompt && (
                          <div className="space-y-6">
                            {/* Contenu du prompt */}
                            <div className="bg-muted/50 p-6 rounded-lg">
                              <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <Eye className="h-4 w-4" />
                                Aperçu du contenu
                              </h4>
                              <div className="prose prose-sm dark:prose-invert max-w-none">
                                <pre className="whitespace-pre-wrap text-sm bg-background/50 p-4 rounded border">
                                  {selectedPrompt.prompts?.content.substring(0, 500)}
                                  {(selectedPrompt.prompts?.content.length || 0) > 500 && '...'}
                                </pre>
                              </div>
                            </div>

                            {/* Informations détaillées */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <h4 className="font-semibold">Informations</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Vendeur:</span>
                                    <span>{selectedPrompt.profiles?.email}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Date de création:</span>
                                    <span>{formatDate(selectedPrompt.created_at)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Ventes:</span>
                                    <span>{selectedPrompt.sales_count}</span>
                                  </div>
                                  {selectedPrompt.prompts?.category && (
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Catégorie:</span>
                                      <span>{selectedPrompt.prompts.category}</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="space-y-4">
                                <h4 className="font-semibold">Évaluations</h4>
                                {selectedPrompt.marketplace_reviews && selectedPrompt.marketplace_reviews.length > 0 ? (
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                                      <span className="font-medium">
                                        {getAverageRating(selectedPrompt.marketplace_reviews).toFixed(1)}
                                      </span>
                                      <span className="text-muted-foreground">
                                        ({selectedPrompt.marketplace_reviews.length} avis)
                                      </span>
                                    </div>
                                    <div className="space-y-2 max-h-40 overflow-y-auto">
                                      {selectedPrompt.marketplace_reviews.slice(0, 3).map((review) => (
                                        <div key={review.id} className="bg-background/50 p-3 rounded text-sm">
                                          <div className="flex items-center gap-1 mb-1">
                                            {[...Array(5)].map((_, i) => (
                                              <Star 
                                                key={i} 
                                                className={`w-3 h-3 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                                              />
                                            ))}
                                            {review.is_verified_purchase && (
                                              <Badge variant="outline" className="text-xs ml-1">
                                                Achat vérifié
                                              </Badge>
                                            )}
                                          </div>
                                          {review.comment && (
                                            <p className="text-muted-foreground">{review.comment}</p>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-muted-foreground text-sm">Aucun avis pour le moment</p>
                                )}
                              </div>
                            </div>

                            {/* Actions d'achat */}
                            <div className="flex gap-3 pt-4 border-t">
                              <Button className="flex-1" size="lg">
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Acheter maintenant
                              </Button>
                              <Button 
                                variant="outline" 
                                size="lg"
                                onClick={() => addToFavorites(selectedPrompt.id)}
                              >
                                <Heart className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    <Button variant="outline" size="sm" onClick={() => addToFavorites(prompt.id)}>
                      <Heart className="h-4 w-4" />
                    </Button>
                    
                    <Button size="sm" className="gap-1">
                      <ShoppingCart className="h-4 w-4" />
                      Acheter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MarketplacePromptGrid;