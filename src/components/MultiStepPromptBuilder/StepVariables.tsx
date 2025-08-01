import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/hooks/useTranslation";
import { Plus, X, Settings, Code } from "lucide-react";

interface Variable {
  id: string;
  name: string;
  type: 'text' | 'number' | 'select' | 'textarea';
  description: string;
  defaultValue: string;
  options?: string[];
  placeholder: string;
  required: boolean;
}

interface StepVariablesProps {
  variables: Variable[];
  onVariablesChange: (variables: Variable[]) => void;
  onVariableValuesChange: (values: { [key: string]: string }) => void;
}

const StepVariables: React.FC<StepVariablesProps> = ({ 
  variables, 
  onVariablesChange, 
  onVariableValuesChange 
}) => {
  const { t } = useTranslation();
  const [variableValues, setVariableValues] = useState<{ [key: string]: string }>({});
  const [isAddingVariable, setIsAddingVariable] = useState(false);
  const [newVariable, setNewVariable] = useState<Partial<Variable>>({
    name: '',
    type: 'text',
    description: '',
    defaultValue: '',
    placeholder: '',
    required: false
  });

  const handleAddVariable = () => {
    if (!newVariable.name) return;
    
    const variable: Variable = {
      id: Date.now().toString(),
      name: newVariable.name,
      type: newVariable.type || 'text',
      description: newVariable.description || '',
      defaultValue: newVariable.defaultValue || '',
      placeholder: newVariable.placeholder || '',
      required: newVariable.required || false,
      options: newVariable.type === 'select' ? ['Option 1', 'Option 2'] : undefined
    };

    onVariablesChange([...variables, variable]);
    setNewVariable({
      name: '',
      type: 'text',
      description: '',
      defaultValue: '',
      placeholder: '',
      required: false
    });
    setIsAddingVariable(false);
  };

  const handleRemoveVariable = (id: string) => {
    onVariablesChange(variables.filter(v => v.id !== id));
    const newValues = { ...variableValues };
    delete newValues[id];
    setVariableValues(newValues);
    onVariableValuesChange(newValues);
  };

  const handleVariableValueChange = (id: string, value: string) => {
    const newValues = { ...variableValues, [id]: value };
    setVariableValues(newValues);
    onVariableValuesChange(newValues);
  };

  const renderVariableInput = (variable: Variable) => {
    const value = variableValues[variable.id] || variable.defaultValue;

    switch (variable.type) {
      case 'textarea':
        return (
          <Textarea
            value={value}
            onChange={(e) => handleVariableValueChange(variable.id, e.target.value)}
            placeholder={variable.placeholder}
            className="min-h-[80px]"
          />
        );
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleVariableValueChange(variable.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800"
          >
            <option value="">Sélectionner...</option>
            {variable.options?.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        );
      case 'number':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => handleVariableValueChange(variable.id, e.target.value)}
            placeholder={variable.placeholder}
          />
        );
      default:
        return (
          <Input
            value={value}
            onChange={(e) => handleVariableValueChange(variable.id, e.target.value)}
            placeholder={variable.placeholder}
          />
        );
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'text': 'bg-blue-100 text-blue-800 border-blue-200',
      'number': 'bg-green-100 text-green-800 border-green-200',
      'select': 'bg-purple-100 text-purple-800 border-purple-200',
      'textarea': 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Variables de Prompt
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Définissez des variables réutilisables pour personnaliser vos prompts.
          </p>
        </div>
        <Button 
          onClick={() => setIsAddingVariable(true)}
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Ajouter Variable
        </Button>
      </div>

      {/* Ajout de nouvelle variable */}
      {isAddingVariable && (
        <Card className="glass-card border-white/30 dark:border-gray-700/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Code className="h-4 w-4" />
              Nouvelle Variable
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nom de la variable</Label>
                <Input
                  value={newVariable.name}
                  onChange={(e) => setNewVariable({...newVariable, name: e.target.value})}
                  placeholder="nom_variable"
                />
              </div>
              <div>
                <Label>Type</Label>
                <select
                  value={newVariable.type}
                  onChange={(e) => setNewVariable({...newVariable, type: e.target.value as Variable['type']})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800"
                >
                  <option value="text">Texte</option>
                  <option value="number">Nombre</option>
                  <option value="select">Sélection</option>
                  <option value="textarea">Texte long</option>
                </select>
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={newVariable.description}
                onChange={(e) => setNewVariable({...newVariable, description: e.target.value})}
                placeholder="Description de la variable"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Valeur par défaut</Label>
                <Input
                  value={newVariable.defaultValue}
                  onChange={(e) => setNewVariable({...newVariable, defaultValue: e.target.value})}
                  placeholder="Valeur par défaut"
                />
              </div>
              <div>
                <Label>Placeholder</Label>
                <Input
                  value={newVariable.placeholder}
                  onChange={(e) => setNewVariable({...newVariable, placeholder: e.target.value})}
                  placeholder="Texte d'aide"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newVariable.required}
                  onChange={(e) => setNewVariable({...newVariable, required: e.target.checked})}
                />
                <span className="text-sm">Requis</span>
              </label>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddVariable} size="sm">
                Ajouter
              </Button>
              <Button 
                onClick={() => setIsAddingVariable(false)} 
                variant="outline" 
                size="sm"
              >
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des variables */}
      <div className="space-y-4">
        {variables.map((variable) => (
          <Card key={variable.id} className="glass-card border-white/30 dark:border-gray-700/30">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Label className="font-medium">{variable.name}</Label>
                    <Badge variant="secondary" className={`${getTypeColor(variable.type)} text-xs`}>
                      {variable.type}
                    </Badge>
                    {variable.required && (
                      <Badge variant="destructive" className="text-xs">
                        Requis
                      </Badge>
                    )}
                  </div>
                  {variable.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      {variable.description}
                    </p>
                  )}
                  {renderVariableInput(variable)}
                </div>
                <Button
                  onClick={() => handleRemoveVariable(variable.id)}
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

      {variables.length === 0 && !isAddingVariable && (
        <Card className="glass-card border-white/30 dark:border-gray-700/30">
          <CardContent className="text-center py-8">
            <Code className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Aucune variable définie
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Ajoutez des variables pour rendre vos prompts plus flexibles et réutilisables.
            </p>
            <Button onClick={() => setIsAddingVariable(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Créer une variable
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StepVariables;