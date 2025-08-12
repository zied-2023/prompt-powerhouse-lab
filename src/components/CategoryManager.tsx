
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { useTranslation } from '@/hooks/useTranslation';

const CategoryManager = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: t('textGeneration'),
      description: t('textGenerationDesc'),
      examples: [t('blogPostGenerator'), 'Email templates', 'Product descriptions', 'Social media content'],
      color: 'blue'
    },
    {
      id: 2,
      name: t('imageCreation'),
      description: t('imageCreationDesc'),
      examples: ['Product photography', 'Digital art', 'Logo design', 'Infographics'],
      color: 'green'
    },
    {
      id: 3,
      name: t('interactiveDialogue'),
      description: t('interactiveDialogueDesc'),
      examples: [t('customerSupportChatbot'), 'Educational tutoring', 'Sales conversations', 'FAQ systems'],
      color: 'purple'
    },
    {
      id: 4,
      name: t('codeGeneration'),
      description: t('codeGenerationDesc'),
      examples: [t('reactComponentGenerator'), 'API endpoints', 'Database queries', 'Algorithm implementations'],
      color: 'orange'
    },
    {
      id: 5,
      name: t('dataAnalysis'),
      description: t('dataAnalysisDesc'),
      examples: ['Statistical analysis', 'Trend identification', 'Report generation', 'Data visualization'],
      color: 'red'
    },
    {
      id: 6,
      name: t('creativeWriting'),
      description: t('creativeWritingDesc'),
      examples: ['Short stories', 'Character profiles', 'Plot development', 'Poetry'],
      color: 'indigo'
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    examples: '',
    color: 'blue'
  });

  const colorOptions = [
    { value: 'blue', label: t('blue'), class: 'bg-primary/10 text-primary border-primary/20' },
    { value: 'green', label: t('green'), class: 'bg-green-500/10 text-green-700 border-green-500/20 dark:bg-green-400/10 dark:text-green-300 dark:border-green-400/20' },
    { value: 'purple', label: t('purple'), class: 'bg-purple-500/10 text-purple-700 border-purple-500/20 dark:bg-purple-400/10 dark:text-purple-300 dark:border-purple-400/20' },
    { value: 'orange', label: t('orange'), class: 'bg-orange-500/10 text-orange-700 border-orange-500/20 dark:bg-orange-400/10 dark:text-orange-300 dark:border-orange-400/20' },
    { value: 'red', label: t('red'), class: 'bg-red-500/10 text-red-700 border-red-500/20 dark:bg-red-400/10 dark:text-red-300 dark:border-red-400/20' },
    { value: 'indigo', label: t('indigo'), class: 'bg-indigo-500/10 text-indigo-700 border-indigo-500/20 dark:bg-indigo-400/10 dark:text-indigo-300 dark:border-indigo-400/20' }
  ];

  const getColorClass = (color) => {
    return colorOptions.find(option => option.value === color)?.class || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', examples: '', color: 'blue' });
    setIsCreating(false);
    setEditingId(null);
  };

  const handleCreate = () => {
    if (!formData.name || !formData.description) {
      toast({
        title: t('validationError'),
        description: t('nameDescriptionRequired'),
        variant: "destructive"
      });
      return;
    }

    const newCategory = {
      id: Math.max(...categories.map(c => c.id)) + 1,
      name: formData.name,
      description: formData.description,
      examples: formData.examples.split(',').map(ex => ex.trim()).filter(ex => ex),
      color: formData.color
    };

    setCategories([...categories, newCategory]);
    resetForm();
    
    toast({
      title: t('categoryCreated'),
      description: `"${newCategory.name}" ${t('categoryCreated').toLowerCase()}.`
    });
  };

  const handleEdit = (category) => {
    setFormData({
      name: category.name,
      description: category.description,
      examples: category.examples.join(', '),
      color: category.color
    });
    setEditingId(category.id);
  };

  const handleUpdate = () => {
    if (!formData.name || !formData.description) {
      toast({
        title: t('validationError'),
        description: t('nameDescriptionRequired'),
        variant: "destructive"
      });
      return;
    }

    setCategories(categories.map(cat => 
      cat.id === editingId 
        ? {
            ...cat,
            name: formData.name,
            description: formData.description,
            examples: formData.examples.split(',').map(ex => ex.trim()).filter(ex => ex),
            color: formData.color
          }
        : cat
    ));

    resetForm();
    
    toast({
      title: t('categoryUpdated'),
      description: t('categoryUpdated')
    });
  };

  const handleDelete = (id) => {
    setCategories(categories.filter(cat => cat.id !== id));
    toast({
      title: t('categoryDeleted'),
      description: t('categoryDeleted')
    });
  };

  return (
    <div className="space-y-6">
      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <Card className="bg-card/80 backdrop-blur-sm border border-border shadow-lg">
          <CardHeader>
            <CardTitle>
              {editingId ? t('editCategory') : t('createNewCategory')}
            </CardTitle>
            <CardDescription>
              {editingId ? 'Modify the category details below' : 'Add a new category for organizing prompts'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">{t('categoryName')}</Label>
                <Input
                  id="name"
                  placeholder="e.g., Marketing Content"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="color">{t('colorTheme')}</Label>
                <select
                  id="color"
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                  className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {colorOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">{t('categoryDescription')}</Label>
              <Textarea
                id="description"
                placeholder="Describe what types of prompts belong in this category..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="examples">{t('exampleUseCases')} (comma-separated)</Label>
              <Input
                id="examples"
                placeholder="e.g., Ad copy, Landing pages, Email campaigns"
                value={formData.examples}
                onChange={(e) => setFormData({...formData, examples: e.target.value})}
              />
            </div>

            <div className="flex space-x-2">
              <Button onClick={editingId ? handleUpdate : handleCreate}>
                <Save className="h-4 w-4 mr-2" />
                {editingId ? t('update') : t('create')} {t('categories')}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                <X className="h-4 w-4 mr-2" />
                {t('cancel')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Categories Overview */}
      <Card className="bg-card/80 backdrop-blur-sm border border-border shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('categories')}</CardTitle>
              <CardDescription>
                Manage and organize your prompt categories for better organization
              </CardDescription>
            </div>
            {!isCreating && !editingId && (
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {t('addCategory')}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Card key={category.id} className="border-2 hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge className={getColorClass(category.color)}>
                      {category.name}
                    </Badge>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(category)}
                        disabled={isCreating || editingId}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(category.id)}
                        disabled={isCreating || editingId}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-3">
                    {category.description}
                  </p>
                  
                  {category.examples.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">{t('exampleUseCases')}:</p>
                      <div className="flex flex-wrap gap-1">
                        {category.examples.slice(0, 3).map((example, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {example}
                          </Badge>
                        ))}
                        {category.examples.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{category.examples.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryManager;
