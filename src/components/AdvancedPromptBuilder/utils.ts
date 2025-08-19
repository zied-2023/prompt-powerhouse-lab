import { PromptData } from './types';

export function validateStep(stepIndex: number, data: PromptData): string[] {
  // Plus de validations bloquantes - tout est maintenant optionnel ou suggéré
  return [];
}

export function getStepSuggestions(stepIndex: number, data: PromptData): string[] {
  const suggestions: string[] = [];
  
  switch (stepIndex) {
    case 0: // Objectif
      if (!data.objective.trim()) {
        suggestions.push("Un objectif principal aiderait à créer un prompt plus précis");
      } else if (data.objective.length < 5) {
        suggestions.push("Détailler davantage l'objectif améliorera la qualité du prompt");
      }
      break;
      
    case 1: // Contexte
      if (!data.context.trim()) {
        suggestions.push("Ajouter du contexte permettra une réponse plus adaptée");
      }
      break;
      
    case 2: // Audience
      if (!data.audience.trim()) {
        suggestions.push("Définir votre audience aidera à adapter le ton");
      }
      break;
      
    case 3: // Ton
      if (!data.tone) {
        suggestions.push("Choisir un ton améliorera la cohérence de la réponse");
      }
      if (!data.outputFormat) {
        suggestions.push("Spécifier un format de sortie structurera mieux la réponse");
      }
      break;
      
    case 4: // Contraintes
      if (data.constraints.length === 0 && data.keywords.length === 0) {
        suggestions.push("Ajouter des contraintes ou mots-clés affinera le résultat");
      }
      break;
      
    default:
      break;
  }
  
  return suggestions;
}

export function calculateOverallProgress(completedSteps: Set<number>, totalSteps: number): number {
  return (completedSteps.size / totalSteps) * 100;
}

export function calculateStepProgress(stepIndex: number, data: PromptData): number {
  const requiredFields = getRequiredFieldsForStep(stepIndex);
  const completedFields = requiredFields.filter(field => {
    const value = getFieldValue(data, field);
    return value && (typeof value === 'string' ? value.trim() : value);
  });
  
  return requiredFields.length > 0 ? (completedFields.length / requiredFields.length) * 100 : 0;
}

function getRequiredFieldsForStep(stepIndex: number): string[] {
  // Plus de champs obligatoires - tout est maintenant optionnel
  return [];
}

function getFieldValue(data: PromptData, field: string): any {
  return (data as any)[field];
}

export function generatePromptPreview(data: PromptData): string {
  if (!data.objective) return '';
  
  let preview = `🎯 ${data.objective}`;
  
  if (data.audience) {
    preview += `\n👥 Pour: ${data.audience}`;
  }
  
  if (data.tone) {
    preview += `\n🎨 Ton: ${data.tone}`;
  }
  
  if (data.outputFormat) {
    preview += `\n📄 Format: ${data.outputFormat}`;
  }
  
  return preview;
}