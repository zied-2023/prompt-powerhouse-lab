import { llmRouter } from './llmRouter';

export interface FailureAnalysis {
  failureType: string;
  severity: number;
  recommendations: string[];
}

export interface ReflectiveIteration {
  iterationNumber: number;
  prompt: string;
  failureAnalysis: FailureAnalysis[];
  improvements: string[];
  qualityScore: number;
}

export interface HierarchicalOptimizationResult {
  finalPrompt: string;
  iterations: ReflectiveIteration[];
  totalImprovements: string[];
  convergenceScore: number;
  reflectiveInsights: string;
}

class HierarchicalReflectiveOptimizer {
  private maxIterations = 3;
  private convergenceThreshold = 8.5;

  async optimizeWithReflection(
    initialPrompt: string,
    failureContext: string,
    userHasCredits: boolean,
    isAuthenticated: boolean
  ): Promise<HierarchicalOptimizationResult> {
    console.log('🔄 Utilisation du HierarchicalReflectiveOptimizer');

    const iterations: ReflectiveIteration[] = [];
    let currentPrompt = initialPrompt;
    let iterationCount = 0;

    while (iterationCount < this.maxIterations) {
      iterationCount++;
      console.log(`🔍 Itération ${iterationCount}/${this.maxIterations}`);

      const failureAnalysis = await this.analyzeFailures(
        currentPrompt,
        failureContext,
        iterations,
        userHasCredits,
        isAuthenticated
      );

      if (failureAnalysis.length === 0) {
        console.log('✅ Aucun échec détecté, convergence atteinte');
        break;
      }

      const improvedPrompt = await this.applyReflectiveImprovements(
        currentPrompt,
        failureAnalysis,
        userHasCredits,
        isAuthenticated
      );

      const qualityScore = this.calculateQualityScore(improvedPrompt, failureAnalysis);

      iterations.push({
        iterationNumber: iterationCount,
        prompt: improvedPrompt,
        failureAnalysis,
        improvements: failureAnalysis.map(f => f.recommendations).flat(),
        qualityScore
      });

      currentPrompt = improvedPrompt;

      if (qualityScore >= this.convergenceThreshold) {
        console.log(`✅ Convergence atteinte avec score ${qualityScore}`);
        break;
      }
    }

    return {
      finalPrompt: currentPrompt,
      iterations,
      totalImprovements: this.aggregateImprovements(iterations),
      convergenceScore: iterations[iterations.length - 1]?.qualityScore || 7,
      reflectiveInsights: this.generateReflectiveInsights(iterations)
    };
  }

  private async analyzeFailures(
    prompt: string,
    failureContext: string,
    previousIterations: ReflectiveIteration[],
    userHasCredits: boolean,
    isAuthenticated: boolean
  ): Promise<FailureAnalysis[]> {
    const systemPrompt = `Tu es un analyseur expert qui identifie les faiblesses et échecs potentiels dans les prompts.

**MISSION**: Analyser un prompt et identifier ses faiblesses selon une hiérarchie de criticité.

**HIÉRARCHIE DES ÉCHECS**:
1. **Critique** (Sévérité 10): Ambiguïtés majeures, instructions contradictoires
2. **Important** (Sévérité 7-9): Manque de contexte, format flou
3. **Modéré** (Sévérité 4-6): Structure sous-optimale, verbosité
4. **Mineur** (Sévérité 1-3): Améliorations cosmétiques

**FORMAT DE SORTIE**:
\`\`\`json
{
  "failures": [
    {
      "failureType": "Type d'échec",
      "severity": 8,
      "recommendations": ["rec1", "rec2"]
    }
  ]
}
\`\`\``;

    let userPrompt = `**PROMPT À ANALYSER**:
${prompt}`;

    if (failureContext) {
      userPrompt += `\n\n**CONTEXTE D'ÉCHEC**: ${failureContext}`;
    }

    if (previousIterations.length > 0) {
      userPrompt += `\n\n**ITÉRATIONS PRÉCÉDENTES**: ${previousIterations.length} améliorations déjà appliquées`;
    }

    try {
      const llmConfig = await llmRouter.selectLLM(isAuthenticated, userHasCredits);

      const response = await llmRouter.callLLM(llmConfig, {
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.6,
        maxTokens: 4000
      });

      return this.parseFailureAnalysis(response.content || '');
    } catch (error) {
      console.error('Erreur analyse échecs:', error);
      return [];
    }
  }

  private parseFailureAnalysis(content: string): FailureAnalysis[] {
    try {
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[1]);
        return parsed.failures || [];
      }

      const failures: FailureAnalysis[] = [];
      const sections = content.split(/\*\*(?:ÉCHEC|FAILURE)\s*\d*\*\*/i);

      for (let i = 1; i < sections.length; i++) {
        const section = sections[i];
        const typeMatch = section.match(/Type:\s*(.+)/i);
        const severityMatch = section.match(/Sévérité:\s*(\d+)/i);
        const recsMatch = section.match(/Recommandations?:?\s*([\s\S]*?)(?=\*\*|$)/i);

        if (typeMatch) {
          failures.push({
            failureType: typeMatch[1].trim(),
            severity: severityMatch ? parseInt(severityMatch[1]) : 5,
            recommendations: this.extractRecommendations(recsMatch?.[1] || '')
          });
        }
      }

      return failures;
    } catch (error) {
      console.error('Erreur parsing failure analysis:', error);
      return [];
    }
  }

  private extractRecommendations(text: string): string[] {
    const recommendations: string[] = [];
    const lines = text.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.match(/^[-•*]\s+/)) {
        recommendations.push(trimmed.replace(/^[-•*]\s+/, ''));
      } else if (trimmed.match(/^\d+\.\s+/)) {
        recommendations.push(trimmed.replace(/^\d+\.\s+/, ''));
      }
    }

    return recommendations;
  }

  private async applyReflectiveImprovements(
    prompt: string,
    failures: FailureAnalysis[],
    userHasCredits: boolean,
    isAuthenticated: boolean
  ): Promise<string> {
    const sortedFailures = failures.sort((a, b) => b.severity - a.severity);

    const systemPrompt = `Tu es un expert en amélioration de prompts qui applique des corrections ciblées.

**MISSION**: Corriger les faiblesses identifiées tout en préservant l'intention originale.

**PRINCIPES**:
- Traiter les échecs par ordre de sévérité
- Appliquer des corrections précises et mesurables
- Préserver la structure existante quand elle est bonne
- Ne pas sur-corriger

Retourne UNIQUEMENT le prompt amélioré, sans commentaires.`;

    const userPrompt = `**PROMPT À AMÉLIORER**:
${prompt}

**FAIBLESSES IDENTIFIÉES** (par ordre de criticité):
${sortedFailures.map((f, idx) => `${idx + 1}. **${f.failureType}** (Sévérité: ${f.severity})
   Recommandations:
   ${f.recommendations.map(r => `   - ${r}`).join('\n')}`).join('\n\n')}

Applique les corrections nécessaires et retourne le prompt amélioré.`;

    try {
      const llmConfig = await llmRouter.selectLLM(isAuthenticated, userHasCredits);

      const response = await llmRouter.callLLM(llmConfig, {
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        maxTokens: 8000
      });

      return response.content?.trim() || prompt;
    } catch (error) {
      console.error('Erreur application améliorations:', error);
      return prompt;
    }
  }

  private calculateQualityScore(prompt: string, failures: FailureAnalysis[]): number {
    let baseScore = 10;

    for (const failure of failures) {
      baseScore -= failure.severity * 0.3;
    }

    const structureBonus = this.assessStructure(prompt);
    const clarityBonus = this.assessClarity(prompt);

    const finalScore = baseScore + structureBonus + clarityBonus;
    return Math.max(0, Math.min(10, finalScore));
  }

  private assessStructure(prompt: string): number {
    let score = 0;
    if (prompt.match(/\*\*[^*]+\*\*/g)?.length || 0 >= 3) score += 0.5;
    if (prompt.includes('\n\n')) score += 0.3;
    if (prompt.match(/^[-•*]/gm)?.length || 0 >= 2) score += 0.4;
    return score;
  }

  private assessClarity(prompt: string): number {
    let score = 0;
    if (prompt.length > 100 && prompt.length < 1000) score += 0.5;
    if (prompt.match(/objectif|goal|mission/i)) score += 0.3;
    if (prompt.match(/format|structure/i)) score += 0.3;
    return score;
  }

  private aggregateImprovements(iterations: ReflectiveIteration[]): string[] {
    const allImprovements = new Set<string>();
    for (const iteration of iterations) {
      for (const improvement of iteration.improvements) {
        allImprovements.add(improvement);
      }
    }
    return Array.from(allImprovements);
  }

  private generateReflectiveInsights(iterations: ReflectiveIteration[]): string {
    if (iterations.length === 0) {
      return 'Aucune itération effectuée';
    }

    const insights: string[] = [
      `${iterations.length} itération(s) réflexive(s) effectuée(s)`,
      `Score final: ${iterations[iterations.length - 1].qualityScore.toFixed(1)}/10`
    ];

    const criticalFailures = iterations[0].failureAnalysis.filter(f => f.severity >= 7);
    if (criticalFailures.length > 0) {
      insights.push(`${criticalFailures.length} problème(s) critique(s) corrigé(s)`);
    }

    const scoreImprovement = iterations.length > 1
      ? iterations[iterations.length - 1].qualityScore - iterations[0].qualityScore
      : 0;

    if (scoreImprovement > 0) {
      insights.push(`Amélioration du score: +${scoreImprovement.toFixed(1)} points`);
    }

    return insights.join(' | ');
  }
}

export const hierarchicalReflectiveOptimizer = new HierarchicalReflectiveOptimizer();
