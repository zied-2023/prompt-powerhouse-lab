import { llmRouter } from './llmRouter';

export interface MetaOptimizationResult {
  optimizedPrompt: string;
  improvements: string[];
  metaReasoning: string;
  qualityScore: number;
  confidence: number;
}

class MetaPromptOptimizer {
  async optimizeWithMetaPrompt(
    originalPrompt: string,
    objective: string,
    userHasCredits: boolean,
    isAuthenticated: boolean
  ): Promise<MetaOptimizationResult> {
    console.log('🎯 Utilisation du MetaPromptOptimizer');

    const metaSystemPrompt = this.buildMetaSystemPrompt();
    const metaUserPrompt = this.buildMetaUserPrompt(originalPrompt, objective);

    try {
      const llmConfig = await llmRouter.selectLLM(isAuthenticated, userHasCredits);

      const response = await llmRouter.callLLM(llmConfig, {
        messages: [
          { role: 'system', content: metaSystemPrompt },
          { role: 'user', content: metaUserPrompt }
        ],
        temperature: 0.8,
        maxTokens: 8000
      });

      if (!response.content) {
        throw new Error('Réponse vide du modèle');
      }

      return this.parseMetaResponse(response.content);
    } catch (error) {
      console.error('Erreur MetaPromptOptimizer:', error);
      throw error;
    }
  }

  private buildMetaSystemPrompt(): string {
    return `Tu es un expert en ingénierie de prompts avec une compréhension profonde de la psychologie des modèles de langage.

**TA MISSION**: Analyser et optimiser des prompts en utilisant une approche méta-cognitive.

**PROCESSUS META-COGNITIF**:
1. **Décomposition**: Identifier les composants du prompt (rôle, contexte, tâche, format, contraintes)
2. **Analyse des faiblesses**: Détecter ambiguïtés, manques de clarté, instructions conflictuelles
3. **Restructuration cognitive**: Réorganiser pour aligner avec le fonctionnement des LLMs
4. **Enrichissement**: Ajouter des éléments manquants sans diluer l'objectif principal
5. **Validation**: Vérifier la cohérence et la complétude

**PRINCIPES D'OPTIMISATION**:
- Clarté > Longueur: Privilégier la précision à la verbosité
- Structure hiérarchique: Organiser l'information du général au spécifique
- Instructions explicites: Éviter les sous-entendus
- Exemples concrets: Intégrer des exemples quand nécessaire
- Contraintes mesurables: Définir des critères vérifiables

**FORMAT DE SORTIE REQUIS**:
\`\`\`json
{
  "optimizedPrompt": "Le prompt optimisé complet",
  "metaReasoning": "Explication du raisonnement meta-cognitif appliqué",
  "improvements": ["amélioration 1", "amélioration 2", ...],
  "qualityScore": 8.5,
  "confidence": 0.9
}
\`\`\``;
  }

  private buildMetaUserPrompt(originalPrompt: string, objective: string): string {
    let userPrompt = `**PROMPT À OPTIMISER**:
${originalPrompt}

**ANALYSE REQUISE**:
1. Identifie les composants présents et manquants
2. Détecte les ambiguïtés et faiblesses
3. Propose une version optimisée
4. Explique ton raisonnement meta-cognitif`;

    if (objective) {
      userPrompt += `\n\n**OBJECTIF SPÉCIFIQUE**: ${objective}`;
    }

    return userPrompt;
  }

  private parseMetaResponse(content: string): MetaOptimizationResult {
    try {
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[1]);
        return {
          optimizedPrompt: parsed.optimizedPrompt,
          improvements: parsed.improvements || [],
          metaReasoning: parsed.metaReasoning,
          qualityScore: parsed.qualityScore || 7,
          confidence: parsed.confidence || 0.8
        };
      }

      const optimizedMatch = content.match(/\*\*PROMPT OPTIMISÉ\*\*:?\s*([\s\S]*?)(?=\*\*|$)/i);
      const reasoningMatch = content.match(/\*\*RAISONNEMENT\*\*:?\s*([\s\S]*?)(?=\*\*|$)/i);
      const improvementsMatch = content.match(/\*\*AMÉLIORATIONS\*\*:?\s*([\s\S]*?)(?=\*\*|$)/i);

      return {
        optimizedPrompt: optimizedMatch?.[1].trim() || content,
        improvements: this.extractImprovements(improvementsMatch?.[1] || ''),
        metaReasoning: reasoningMatch?.[1].trim() || 'Optimisation basée sur les principes d\'ingénierie de prompts',
        qualityScore: 7.5,
        confidence: 0.85
      };
    } catch (error) {
      console.error('Erreur parsing meta response:', error);
      return {
        optimizedPrompt: content,
        improvements: ['Optimisation appliquée'],
        metaReasoning: 'Optimisation basique effectuée',
        qualityScore: 6,
        confidence: 0.7
      };
    }
  }

  private extractImprovements(text: string): string[] {
    const improvements: string[] = [];
    const lines = text.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.match(/^[-•*]\s+/)) {
        improvements.push(trimmed.replace(/^[-•*]\s+/, ''));
      } else if (trimmed.match(/^\d+\.\s+/)) {
        improvements.push(trimmed.replace(/^\d+\.\s+/, ''));
      }
    }

    return improvements.length > 0 ? improvements : ['Structure améliorée', 'Clarté optimisée'];
  }
}

export const metaPromptOptimizer = new MetaPromptOptimizer();
