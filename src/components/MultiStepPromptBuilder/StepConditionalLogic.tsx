import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/hooks/useTranslation";
import { Plus, X, GitBranch, Code2, Zap } from "lucide-react";

interface Condition {
  id: string;
  variable: string;
  operator: 'equals' | 'contains' | 'greater' | 'less' | 'not_empty';
  value: string;
  action: 'include' | 'exclude' | 'replace';
  content: string;
  description: string;
}

interface StepConditionalLogicProps {
  conditions: Condition[];
  availableVariables: string[];
  onConditionsChange: (conditions: Condition[]) => void;
}

const StepConditionalLogic: React.FC<StepConditionalLogicProps> = ({
  conditions,
  availableVariables,
  onConditionsChange
}) => {
  const { t } = useTranslation();
  const [isAddingCondition, setIsAddingCondition] = useState(false);
  const [newCondition, setNewCondition] = useState<Partial<Condition>>({
    variable: '',
    operator: 'equals',
    value: '',
    action: 'include',
    content: '',
    description: ''
  });

  const operators = [
    { value: 'equals', label: 'Est égal à' },
    { value: 'contains', label: 'Contient' },
    { value: 'greater', label: 'Plus grand que' },
    { value: 'less', label: 'Plus petit que' },
    { value: 'not_empty', label: 'N\'est pas vide' }
  ];

  const actions = [
    { value: 'include', label: 'Inclure du contenu' },
    { value: 'exclude', label: 'Exclure du contenu' },
    { value: 'replace', label: 'Remplacer du contenu' }
  ];

  const handleAddCondition = () => {
    if (!newCondition.variable || !newCondition.content) return;

    const condition: Condition = {
      id: Date.now().toString(),
      variable: newCondition.variable!,
      operator: newCondition.operator!,
      value: newCondition.value || '',
      action: newCondition.action!,
      content: newCondition.content!,
      description: newCondition.description || ''
    };

    onConditionsChange([...conditions, condition]);
    setNewCondition({
      variable: '',
      operator: 'equals',
      value: '',
      action: 'include',
      content: '',
      description: ''
    });
    setIsAddingCondition(false);
  };

  const handleRemoveCondition = (id: string) => {
    onConditionsChange(conditions.filter(c => c.id !== id));
  };

  const getActionColor = (action: string) => {
    const colors = {
      'include': 'bg-green-100 text-green-800 border-green-200',
      'exclude': 'bg-red-100 text-red-800 border-red-200',
      'replace': 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[action] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getOperatorSymbol = (operator: string) => {
    const symbols = {
      'equals': '=',
      'contains': '⊃',
      'greater': '>',
      'less': '<',
      'not_empty': '≠∅'
    };
    return symbols[operator] || '=';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Logique Conditionnelle
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Ajoutez des conditions pour adapter dynamiquement le contenu de votre prompt.
          </p>
        </div>
        <Button 
          onClick={() => setIsAddingCondition(true)}
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Ajouter Condition
        </Button>
      </div>

      {/* Ajout de nouvelle condition */}
      {isAddingCondition && (
        <Card className="glass-card border-white/30 dark:border-gray-700/30 border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Code2 className="h-4 w-4" />
              Nouvelle Condition
            </CardTitle>
            <CardDescription>
              Définissez une condition basée sur une variable pour modifier le comportement du prompt.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Description (optionnel)</Label>
              <Input
                value={newCondition.description}
                onChange={(e) => setNewCondition({...newCondition, description: e.target.value})}
                placeholder="Décrivez cette condition..."
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Variable</Label>
                <select
                  value={newCondition.variable}
                  onChange={(e) => setNewCondition({...newCondition, variable: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800"
                >
                  <option value="">Sélectionner...</option>
                  {availableVariables.map((variable) => (
                    <option key={variable} value={variable}>{variable}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Opérateur</Label>
                <select
                  value={newCondition.operator}
                  onChange={(e) => setNewCondition({...newCondition, operator: e.target.value as Condition['operator']})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800"
                >
                  {operators.map((op) => (
                    <option key={op.value} value={op.value}>{op.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Valeur</Label>
                <Input
                  value={newCondition.value}
                  onChange={(e) => setNewCondition({...newCondition, value: e.target.value})}
                  placeholder="Valeur à comparer"
                  disabled={newCondition.operator === 'not_empty'}
                />
              </div>
            </div>

            <div>
              <Label>Action</Label>
              <select
                value={newCondition.action}
                onChange={(e) => setNewCondition({...newCondition, action: e.target.value as Condition['action']})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800"
              >
                {actions.map((action) => (
                  <option key={action.value} value={action.value}>{action.label}</option>
                ))}
              </select>
            </div>

            <div>
              <Label>Contenu</Label>
              <Textarea
                value={newCondition.content}
                onChange={(e) => setNewCondition({...newCondition, content: e.target.value})}
                placeholder="Contenu à inclure/exclure/remplacer selon la condition..."
                className="min-h-[100px]"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddCondition} size="sm">
                Ajouter Condition
              </Button>
              <Button 
                onClick={() => setIsAddingCondition(false)} 
                variant="outline" 
                size="sm"
              >
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des conditions */}
      <div className="space-y-4">
        {conditions.map((condition, index) => (
          <Card key={condition.id} className="glass-card border-white/30 dark:border-gray-700/30">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs font-mono">
                      {condition.variable} {getOperatorSymbol(condition.operator)} {condition.value}
                    </Badge>
                    <Badge variant="secondary" className={`${getActionColor(condition.action)} text-xs`}>
                      {actions.find(a => a.value === condition.action)?.label}
                    </Badge>
                  </div>
                  
                  {condition.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      {condition.description}
                    </p>
                  )}
                  
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Contenu conditionnel:</div>
                    <div className="text-sm font-mono whitespace-pre-wrap">
                      {condition.content}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => handleRemoveCondition(condition.id)}
                  variant="ghost"
                  size="sm"
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {conditions.length === 0 && !isAddingCondition && (
        <Card className="glass-card border-white/30 dark:border-gray-700/30">
          <CardContent className="text-center py-8">
            <GitBranch className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Aucune condition définie
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Ajoutez des conditions pour créer des prompts adaptatifs et intelligents.
            </p>
            <Button onClick={() => setIsAddingCondition(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Créer une condition
            </Button>
          </CardContent>
        </Card>
      )}

      {conditions.length > 0 && (
        <Card className="glass-card border-white/30 dark:border-gray-700/30 bg-blue-50/50 dark:bg-blue-900/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-blue-500" />
              <span className="font-medium text-blue-900 dark:text-blue-100">Aperçu de la logique</span>
            </div>
            <div className="text-sm text-blue-800 dark:text-blue-200">
              Votre prompt s'adaptera automatiquement en fonction de {conditions.length} condition{conditions.length > 1 ? 's' : ''} définie{conditions.length > 1 ? 's' : ''}.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StepConditionalLogic;