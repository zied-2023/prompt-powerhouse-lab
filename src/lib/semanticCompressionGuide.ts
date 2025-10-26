/**
 * Guide de compression sémantique en 8 étapes
 * Garantit des prompts complets, concis et non tronqués
 */

export const SEMANTIC_COMPRESSION_STEPS = `
MÉTHODE DE COMPRESSION SÉMANTIQUE (8 ÉTAPES) - Pour prompts complets et non tronqués:

┌─────┬─────────────────────────────────┬────────────────────────┐
│ Ét. │ Action                          │ Objectif               │
├─────┼─────────────────────────────────┼────────────────────────┤
│ 1   │ Identifier la valeur sémantique │ Supprimer le décor     │
│ 2   │ Fusionner contexte + action     │ Réduire les phrases    │
│ 3   │ Hiérarchiser en 3 blocs         │ Clarifier la structure │
│ 4   │ Compacter le langage            │ Augmenter la densité   │
│ 5   │ Standardiser modèle             │ Réutilisabilité        │
│ 6   │ Exemples courts                 │ Éviter la surcharge    │
│ 7   │ Vérifier impact                 │ Zéro perte de sens     │
│ 8   │ Modulariser                     │ Prompt flexible        │
└─────┴─────────────────────────────────┴────────────────────────┘

DÉTAILS DES 8 ÉTAPES:

ÉTAPE 1 - IDENTIFIER LA VALEUR SÉMANTIQUE
• Séparer contenu essentiel du décor linguistique
• Garder: contraintes, critères, actions concrètes
• Supprimer: formules de politesse, transitions, redondances
Exemple: "Je voudrais que tu puisses m'aider à créer" → "Créer"

ÉTAPE 2 - FUSIONNER CONTEXTE + ACTION
• Combiner phrases similaires en une seule
• Intégrer le contexte directement dans l'action
Exemple: "Le contexte est X. L'action à faire est Y." → "Action Y dans contexte X."

ÉTAPE 3 - HIÉRARCHISER EN 3 BLOCS
• Bloc 1: Rôle + Objectif (l'essence)
• Bloc 2: Instructions + Format (l'exécution)
• Bloc 3: Contraintes + Critères (la qualité)
Cette structure garantit la complétude tout en réduisant la verbosité.

ÉTAPE 4 - COMPACTER LE LANGAGE
• Utiliser termes précis vs phrases longues
• Remplacer "il faut que" par "doit"
• Remplacer "de manière à ce que" par "pour"
• Supprimer adverbes non critiques: très, vraiment, particulièrement
Exemple: "Tu dois vraiment faire très attention à" → "Attention à"

ÉTAPE 5 - STANDARDISER LE MODÈLE
• Format uniforme: # pour titres, • pour listes, | pour tableaux
• Pas d'étoiles ** sauf emphase critique
• Structure prévisible = réutilisable
Exemple: **TITRE** → # TITRE

ÉTAPE 6 - EXEMPLES COURTS MAIS SUBSTANTIELS
• 1 exemple vaut mieux que 3 redondants
• Minimum 3 lignes par exemple pour rester substantiel
• Tableaux: minimum 2-3 lignes de données (jamais vide)
Exemple: Garder 1 tableau complet vs 3 tableaux partiels

ÉTAPE 7 - VÉRIFIER ZÉRO PERTE DE SENS
Checklist finale:
✓ Toutes contraintes chiffrées préservées? (200 mots, 10s, 80%)
✓ Tous critères de succès présents?
✓ Actions concrètes identifiables?
✓ Format de sortie clair?
✓ Aucune phrase orpheline? (pas de "Exemple:" seul)

ÉTAPE 8 - MODULARISER
• Séparer sections réutilisables
• Chaque bloc doit être autonome
• Permet ajustement sans réécriture totale
Exemple: Bloc contraintes identique pour plusieurs prompts

RÉSULTAT ATTENDU:
• Réduction 30-40% tokens
• Complétude 100% (score ≥ 90%)
• Format propre et lisible
• Aucune troncation
`;

export const COMPRESSION_PRINCIPLES = {
  step1: {
    name: "Identifier la valeur sémantique",
    goal: "Supprimer le décor",
    rules: [
      "Garder: contraintes, critères, actions",
      "Supprimer: politesse, transitions, redondances"
    ]
  },
  step2: {
    name: "Fusionner contexte + action",
    goal: "Réduire les phrases",
    rules: [
      "Combiner phrases similaires",
      "Intégrer contexte dans action"
    ]
  },
  step3: {
    name: "Hiérarchiser en 3 blocs",
    goal: "Clarifier la structure",
    rules: [
      "Bloc 1: Rôle + Objectif",
      "Bloc 2: Instructions + Format",
      "Bloc 3: Contraintes + Critères"
    ]
  },
  step4: {
    name: "Compacter le langage",
    goal: "Augmenter la densité",
    rules: [
      "Termes précis vs phrases longues",
      "Supprimer adverbes non critiques",
      "'doit' au lieu de 'il faut que'"
    ]
  },
  step5: {
    name: "Standardiser modèle",
    goal: "Réutilisabilité",
    rules: [
      "Format uniforme: # titres, • listes",
      "Pas d'étoiles ** sauf critique",
      "Structure prévisible"
    ]
  },
  step6: {
    name: "Exemples courts",
    goal: "Éviter la surcharge",
    rules: [
      "1 bon exemple > 3 médiocres",
      "Minimum 3 lignes par exemple",
      "Tableaux: min 2-3 lignes données"
    ]
  },
  step7: {
    name: "Vérifier impact",
    goal: "Zéro perte de sens",
    rules: [
      "Contraintes chiffrées préservées",
      "Critères succès présents",
      "Actions identifiables",
      "Aucune phrase orpheline"
    ]
  },
  step8: {
    name: "Modulariser",
    goal: "Prompt flexible",
    rules: [
      "Sections réutilisables",
      "Blocs autonomes",
      "Ajustement sans réécriture"
    ]
  }
};

/**
 * Applique les principes de compression sémantique à un texte
 */
export function applySemanticCompression(text: string): string {
  let compressed = text;

  // Étape 1: Supprimer décor linguistique
  compressed = compressed.replace(/Je voudrais que tu (puisses )?/gi, '');
  compressed = compressed.replace(/Il faudrait que /gi, 'Doit ');
  compressed = compressed.replace(/de manière à ce que/gi, 'pour');

  // Étape 4: Supprimer adverbes non critiques
  compressed = compressed.replace(/\b(très|vraiment|particulièrement|extrêmement)\s+/gi, '');

  // Étape 5: Standardiser format
  compressed = compressed.replace(/\*\*([A-Z][A-Z\s]+)\*\*/g, '# $1');

  // Nettoyer espaces multiples
  compressed = compressed.replace(/\s{2,}/g, ' ');
  compressed = compressed.replace(/\n{3,}/g, '\n\n');

  return compressed.trim();
}

/**
 * Valide qu'un prompt suit les principes de compression sémantique
 */
export function validateSemanticCompression(prompt: string): {
  isValid: boolean;
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 100;

  // Vérifier étape 5: Pas trop d'étoiles
  const asteriskCount = (prompt.match(/\*\*/g) || []).length;
  if (asteriskCount > 20) {
    feedback.push("⚠️ Trop d'étoiles ** (étape 5)");
    score -= 10;
  }

  // Vérifier étape 6: Tableaux complets
  const tableHeaders = (prompt.match(/\|[^|]+\|/g) || []).length;
  const tableRows = prompt.split('\n').filter(line =>
    line.includes('|') && !line.includes('---')
  ).length;

  if (tableHeaders > 0 && tableRows < 4) {
    feedback.push("⚠️ Tableau incomplet - minimum 3 lignes données (étape 6)");
    score -= 15;
  }

  // Vérifier étape 7: Contraintes chiffrées
  const hasNumbers = /\d+/.test(prompt);
  if (!hasNumbers && prompt.length > 200) {
    feedback.push("ℹ️ Aucune contrainte chiffrée détectée (étape 7)");
    score -= 5;
  }

  // Vérifier étape 7: Phrases orphelines
  if (prompt.match(/:\s*\n\s*\n/)) {
    feedback.push("⚠️ Phrases orphelines détectées (étape 7)");
    score -= 10;
  }

  if (score >= 80) {
    feedback.push("✅ Compression sémantique correcte");
  }

  return {
    isValid: score >= 80,
    score,
    feedback
  };
}
