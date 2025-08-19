import { LucideIcon } from 'lucide-react';

export interface PromptData {
  aiModel: string;
  objective: string;
  context: string;
  audience: string;
  tone: string;
  constraints: string[];
  outputFormat: string;
  examples: string[];
  keywords: string[];
}

export interface StepConfig {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
  component: string;
  required: boolean;
  estimatedTime: string;
  tips: string[];
  examples?: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface Suggestion {
  id: string;
  text: string;
  type: 'improvement' | 'alternative' | 'addition';
  confidence: number;
  category: string;
}