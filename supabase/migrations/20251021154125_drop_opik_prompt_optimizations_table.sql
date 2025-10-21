/*
  # Suppression de la table opik_prompt_optimizations

  1. Suppression
    - Supprime la table `opik_prompt_optimizations` et toutes ses données
    - Supprime toutes les politiques RLS associées
    - Supprime tous les index associés

  2. Raison
    - Fonctionnalité d'optimisation réflexive retirée de l'application
    - La table n'est plus utilisée
*/

-- Suppression de la table (avec CASCADE pour supprimer automatiquement les politiques et index)
DROP TABLE IF EXISTS opik_prompt_optimizations CASCADE;
