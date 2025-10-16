# Intégration Analytics pour les Générateurs de Prompts Avancés

## Problème Résolu

Les prompts créés dans les sections avancées (Advanced Builder, Multi-Step Builder, Advanced Templates) n'apparaissaient pas dans la section Analytics.

## Solution Implémentée

Tous les générateurs de prompts avancés enregistrent maintenant automatiquement leurs traces dans la table `opik_prompt_traces` via le service `opikService`.

### Composants Modifiés

#### 1. AdvancedPromptBuilder (`src/components/AdvancedPromptBuilder/index.tsx`)
- ✅ Import de `useAuth` et `opikService`
- ✅ Enregistrement de trace lors de la génération de prompt
- ✅ Capture des métadonnées : modèle IA, contraintes, mots-clés, format de sortie
- ✅ Tags : `source: 'advanced-builder'`

**Données enregistrées** :
- Input : Description des paramètres du prompt (objectif, contexte, audience, ton)
- Output : Prompt généré complet
- Model : Modèle IA sélectionné ou 'advanced-builder'
- Latency : Temps de génération en ms
- Tokens : Estimation basée sur la longueur du prompt
- Tags : source, contraintes, mots-clés, format

#### 2. MultiStepPromptBuilder (`src/components/MultiStepPromptBuilder.tsx`)
- ✅ Import de `useAuth` et `opikService`
- ✅ Enregistrement de trace lors de la génération
- ✅ Capture des métadonnées : industrie, audience, ton, contraintes, sections
- ✅ Tags : `source: 'multi-step-builder'`

**Données enregistrées** :
- Input : Objectif principal + audience + industrie
- Output : Prompt structuré complet avec sections
- Model : 'multi-step-builder'
- Latency : Temps de génération
- Tokens : Estimation
- Tags : source, industrie, audience, ton, présence de contraintes/sections

#### 3. AdvancedTemplates (`src/components/AdvancedTemplates.tsx`)
- ✅ Import de `useAuth` et `opikService`
- ✅ Enregistrement de trace lors de la génération
- ✅ Capture des métadonnées : template utilisé, variables, catégorie, difficulté
- ✅ Tags : `source: 'advanced-template'`

**Données enregistrées** :
- Input : Nom du template + variables utilisées
- Output : Prompt généré à partir du template
- Model : 'advanced-template'
- Latency : Temps de traitement
- Tokens : Estimation
- Tags : source, templateId, nom, catégorie, difficulté, nombre de variables

## Fonctionnement

### Enregistrement Automatique

Lorsqu'un utilisateur **connecté** génère un prompt dans n'importe quel générateur avancé :

1. **Création de trace** : Un ID unique est généré
2. **Capture des données** : Input, output, métadonnées
3. **Enregistrement** : Insertion dans `opik_prompt_traces`
4. **Confirmation** : Log console `✅ Trace créée dans Analytics`

### Affichage dans Analytics

Les traces apparaissent automatiquement dans la section **Analytics** avec :
- 📊 Statistiques agrégées (latence moyenne, tokens totaux, coût)
- 📋 Liste des traces récentes avec détails
- ⭐ Score automatique basé sur la qualité
- 🔄 Possibilité d'améliorer ou tester les prompts
- 📈 Métriques d'évaluation

### Filtrage et Identification

Chaque source a un tag spécifique permettant de filtrer :
- `source: 'advanced-builder'` → Générateur Avancé
- `source: 'multi-step-builder'` → Multi-Step Builder
- `source: 'advanced-template'` → Templates Avancés

## Vérification

Pour vérifier que les traces sont bien enregistrées :

1. **Connectez-vous** à l'application
2. **Générez un prompt** dans une section avancée
3. **Ouvrez la console** du navigateur → Vérifiez le log `✅ Trace créée`
4. **Accédez à Analytics** → La trace devrait apparaître immédiatement
5. **Vérifiez les détails** → Input, output, tags doivent être présents

## Base de Données

### Table `opik_prompt_traces`

Structure utilisée :
```sql
CREATE TABLE opik_prompt_traces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  trace_id TEXT UNIQUE NOT NULL,
  prompt_input TEXT NOT NULL,
  prompt_output TEXT,
  model TEXT,
  latency_ms INTEGER,
  tokens_used INTEGER,
  cost DECIMAL,
  feedback_score DECIMAL,
  tags JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Politique RLS

Les utilisateurs ne voient que leurs propres traces :
```sql
CREATE POLICY "Users can view own traces"
  ON opik_prompt_traces FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
```

## Notes Importantes

- ✅ Les traces sont enregistrées **uniquement pour les utilisateurs connectés**
- ✅ L'enregistrement est **asynchrone** et n'impacte pas l'UX
- ✅ En cas d'erreur d'enregistrement, la génération de prompt **continue normalement**
- ✅ Les scores de feedback sont **calculés automatiquement** si non fournis
- ✅ Les tags permettent une **analyse granulaire** des performances par source

## Prochaines Améliorations Possibles

1. Ajout de métriques d'évaluation spécifiques (clarté, complétude, pertinence)
2. Tableau de bord comparatif entre les différentes sources
3. Recommandations basées sur l'historique d'utilisation
4. Export des traces pour analyse externe
5. Alertes sur les prompts à faible performance
