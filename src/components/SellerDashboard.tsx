import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { 
  DollarSign, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  BarChart3, 
  TrendingUp, 
  Star, 
  Package,
  ShoppingCart,
  Clock,
  Award
} from "lucide-react";
import { useMarketplace, type MarketplacePrompt, type LicenseType } from "@/hooks/useMarketplace";
import { usePrompts } from "@/hooks/usePrompts";

const SellerDashboard = () => {
  const [marketplacePrompts, setMarketplacePrompts] = useState<MarketplacePrompt[]>([]);
  const [userPrompts, setUserPrompts] = useState<any[]>([]);
  const [licenseTypes, setLicenseTypes] = useState<LicenseType[]>([]);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalSales: 0,
    totalPrompts: 0,
    averageRating: 0
  });
  
  // État pour le formulaire de publication
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [price, setPrice] = useState("");
  const [selectedLicense, setSelectedLicense] = useState("");
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);

  // État pour l'édition
  const [editingPrompt, setEditingPrompt] = useState<MarketplacePrompt | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [editLicense, setEditLicense] = useState("");
  const [editForSale, setEditForSale] = useState(false);

  const { 
    getSellerPrompts, 
    publishPromptToMarketplace, 
    updateMarketplacePrompt,
    getLicenseTypes,
    isLoading, 
    isSaving 
  } = useMarketplace();
  
  const { getUserPrompts } = usePrompts();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [marketplacePrompts]);

  const loadData = async () => {
    try {
      const [marketplace, prompts, licenses] = await Promise.all([
        getSellerPrompts(),
        getUserPrompts(),
        getLicenseTypes()
      ]);
      
      setMarketplacePrompts(marketplace);
      setUserPrompts(prompts);
      setLicenseTypes(licenses);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    }
  };

  const calculateStats = () => {
    const totalEarnings = marketplacePrompts.reduce((sum, prompt) => 
      sum + (prompt.sales_count * prompt.price * (1 - prompt.commission_rate)), 0
    );
    
    const totalSales = marketplacePrompts.reduce((sum, prompt) => sum + prompt.sales_count, 0);
    
    const allReviews = marketplacePrompts.flatMap(prompt => prompt.marketplace_reviews || []);
    const averageRating = allReviews.length > 0 
      ? allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length 
      : 0;

    setStats({
      totalEarnings,
      totalSales,
      totalPrompts: marketplacePrompts.length,
      averageRating
    });
  };

  const handlePublishPrompt = async () => {
    if (!selectedPrompt || !price || !selectedLicense) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    const result = await publishPromptToMarketplace({
      prompt_id: selectedPrompt,
      price: parseFloat(price),
      license_type: selectedLicense
    });

    if (result) {
      setPublishDialogOpen(false);
      setSelectedPrompt("");
      setPrice("");
      setSelectedLicense("");
      loadData();
    }
  };

  const handleUpdatePrompt = async () => {
    if (!editingPrompt) return;

    const updates: any = {};
    if (editPrice) updates.price = parseFloat(editPrice);
    if (editLicense) updates.license_type = editLicense;
    updates.is_for_sale = editForSale;

    const result = await updateMarketplacePrompt(editingPrompt.id, updates);

    if (result) {
      setEditingPrompt(null);
      setEditPrice("");
      setEditLicense("");
      setEditForSale(false);
      loadData();
    }
  };

  const formatPrice = (price: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getAverageRating = (reviews: any[]) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  // Filtrer les prompts non encore publiés sur le marketplace
  const availablePrompts = userPrompts.filter(prompt => 
    !marketplacePrompts.some(mp => mp.prompt_id === prompt.id)
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Chargement de votre tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold gradient-text">Tableau de Bord Vendeur</h2>
          <p className="text-muted-foreground">Gérez vos prompts sur le marketplace</p>
        </div>
        
        <Dialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Publier un Prompt
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Publier sur le Marketplace</DialogTitle>
              <DialogDescription>
                Sélectionnez un prompt et définissez ses conditions de vente
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt-select">Prompt à publier *</Label>
                <Select value={selectedPrompt} onValueChange={setSelectedPrompt}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un prompt" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePrompts.map(prompt => (
                      <SelectItem key={prompt.id} value={prompt.id}>
                        {prompt.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Prix (USD) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="9.99"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="license">Type de licence *</Label>
                <Select value={selectedLicense} onValueChange={setSelectedLicense}>
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

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setPublishDialogOpen(false)} className="flex-1">
                  Annuler
                </Button>
                <Button onClick={handlePublishPrompt} disabled={isSaving} className="flex-1">
                  {isSaving ? "Publication..." : "Publier"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card border-white/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gains Totaux</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.totalEarnings)}</div>
            <p className="text-xs text-muted-foreground">
              Commission déduite
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventes Totales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSales}</div>
            <p className="text-xs text-muted-foreground">
              Tous prompts confondus
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prompts Publiés</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPrompts}</div>
            <p className="text-xs text-muted-foreground">
              {availablePrompts.length} disponibles
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Note Moyenne</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '-'}
            </div>
            <p className="text-xs text-muted-foreground">
              Sur 5 étoiles
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Contenu principal */}
      <Tabs defaultValue="prompts" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="prompts">Mes Prompts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reviews">Avis</TabsTrigger>
        </TabsList>

        <TabsContent value="prompts">
          {marketplacePrompts.length === 0 ? (
            <Card className="glass-card border-white/30">
              <CardContent className="pt-6 text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                  Aucun prompt publié
                </h3>
                <p className="text-muted-foreground mb-4">
                  Commencez par publier votre premier prompt sur le marketplace
                </p>
                <Button onClick={() => setPublishDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Publier un Prompt
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {marketplacePrompts.map((prompt) => {
                const averageRating = getAverageRating(prompt.marketplace_reviews || []);
                const reviewCount = prompt.marketplace_reviews?.length || 0;
                const earnings = prompt.sales_count * prompt.price * (1 - prompt.commission_rate);

                return (
                  <Card key={prompt.id} className="glass-card border-white/30 hover:shadow-lg transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <CardTitle className="text-lg font-semibold">
                            {prompt.prompts?.title}
                          </CardTitle>
                          {prompt.prompts?.description && (
                            <CardDescription className="text-sm line-clamp-2">
                              {prompt.prompts?.description}
                            </CardDescription>
                          )}
                        </div>
                        <div className="flex flex-col gap-1">
                          {prompt.is_featured && (
                            <Badge className="bg-yellow-500 hover:bg-yellow-600">
                              <Award className="w-3 h-3 mr-1" />
                              Vedette
                            </Badge>
                          )}
                          <Badge variant={prompt.is_for_sale ? "default" : "secondary"}>
                            {prompt.is_for_sale ? "En vente" : "Hors ligne"}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Prix et performances */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Prix:</span>
                          <span className="font-semibold">{formatPrice(prompt.price, prompt.currency)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Ventes:</span>
                          <span className="font-semibold">{prompt.sales_count}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Gains:</span>
                          <span className="font-semibold text-green-600">{formatPrice(earnings)}</span>
                        </div>
                        {averageRating > 0 && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Note:</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="font-semibold">{averageRating.toFixed(1)}</span>
                              <span className="text-sm text-muted-foreground">({reviewCount})</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Métadonnées */}
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>Licence: {prompt.license_type}</div>
                        <div>Publié: {formatDate(prompt.created_at)}</div>
                        {prompt.prompts?.category && (
                          <div>Catégorie: {prompt.prompts.category}</div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1"
                              onClick={() => {
                                setEditingPrompt(prompt);
                                setEditPrice(prompt.price.toString());
                                setEditLicense(prompt.license_type);
                                setEditForSale(prompt.is_for_sale);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Modifier
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Modifier le prompt</DialogTitle>
                              <DialogDescription>
                                Modifiez les paramètres de vente de votre prompt
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-price">Prix (USD)</Label>
                                <Input
                                  id="edit-price"
                                  type="number"
                                  step="0.01"
                                  value={editPrice}
                                  onChange={(e) => setEditPrice(e.target.value)}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="edit-license">Type de licence</Label>
                                <Select value={editLicense} onValueChange={setEditLicense}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {licenseTypes.map(license => (
                                      <SelectItem key={license.id} value={license.name}>
                                        {license.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="edit-for-sale"
                                  checked={editForSale}
                                  onCheckedChange={setEditForSale}
                                />
                                <Label htmlFor="edit-for-sale">Disponible à la vente</Label>
                              </div>

                              <div className="flex gap-2 pt-4">
                                <Button variant="outline" onClick={() => setEditingPrompt(null)} className="flex-1">
                                  Annuler
                                </Button>
                                <Button onClick={handleUpdatePrompt} disabled={isSaving} className="flex-1">
                                  {isSaving ? "Sauvegarde..." : "Sauvegarder"}
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="glass-card border-white/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Analytics de Performance
              </CardTitle>
              <CardDescription>
                Analysez les performances de vos prompts sur le marketplace
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                <p>Analytics détaillées à venir dans une prochaine version</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card className="glass-card border-white/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Avis de vos Clients
              </CardTitle>
              <CardDescription>
                Consultez les retours de vos acheteurs
              </CardDescription>
            </CardHeader>
            <CardContent>
              {marketplacePrompts.some(p => p.marketplace_reviews && p.marketplace_reviews.length > 0) ? (
                <div className="space-y-4">
                  {marketplacePrompts.map(prompt => 
                    prompt.marketplace_reviews && prompt.marketplace_reviews.length > 0 ? (
                      <div key={prompt.id} className="space-y-3">
                        <h4 className="font-semibold">{prompt.prompts?.title}</h4>
                        {prompt.marketplace_reviews.map(review => (
                          <div key={review.id} className="bg-background/50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {formatDate(review.created_at)}
                              </span>
                              {review.is_verified_purchase && (
                                <Badge variant="outline" className="text-xs">
                                  Achat vérifié
                                </Badge>
                              )}
                            </div>
                            {review.comment && (
                              <p className="text-sm">{review.comment}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : null
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Star className="h-12 w-12 mx-auto mb-4" />
                  <p>Aucun avis pour le moment</p>
                  <p className="text-sm">Les avis apparaîtront ici quand vos clients évalueront vos prompts</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SellerDashboard;