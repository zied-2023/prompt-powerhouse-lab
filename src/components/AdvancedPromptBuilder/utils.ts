import { PromptData } from './types';

export function validateStep(stepIndex: number, data: PromptData): string[] {
  const errors: string[] = [];
  
  switch (stepIndex) {
    case 0: // Objectif
      if (!data.objective.trim()) {
        errors.push("L'objectif principal est obligatoire");
      } else if (data.objective.length < 10) {
        errors.push("L'objectif doit être plus détaillé (minimum 10 caractères)");
      }
      break;
      
    case 1: // Contexte (maintenant optionnel)
      // Plus d'erreur obligatoire
      break;
      
    case 2: // Audience (maintenant optionnel)
      // Plus d'erreur obligatoire
      break;
      
    case 3: // Ton (maintenant optionnel)
      // Plus d'erreur obligatoire
      break;
      
    case 4: // Contraintes
      if (data.constraints.length === 0) {
        // Optionnel, pas d'erreur
      }
      break;
      
    default:
      break;
  }
  
  return errors;
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
  switch (stepIndex) {
    case 0: return ['objective'];
    case 1: return []; // Plus obligatoire
    case 2: return []; // Plus obligatoire
    case 3: return []; // Plus obligatoire
    case 4: return []; // Optionnel
    case 5: return []; // Optionnel
    default: return [];
  }
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