/*
  # Ajouter politique pour clés API système

  1. Modifications
    - Ajoute une politique SELECT pour permettre aux utilisateurs authentifiés d'accéder aux clés API système
    - Les clés API système sont celles où user_id IS NULL
    - Permet à tous les utilisateurs d'utiliser les clés API partagées
  
  2. Sécurité
    - Seules les clés avec user_id=NULL sont accessibles par tous
    - Les clés avec user_id spécifique restent privées (politique existante)
    - Les utilisateurs ne peuvent pas modifier les clés système
*/

-- Supprimer la politique si elle existe déjà
DROP POLICY IF EXISTS "Anyone can view system API keys" ON api_keys;

-- Ajouter une politique pour permettre la lecture des clés API système (user_id IS NULL)
CREATE POLICY "Anyone can view system API keys"
  ON api_keys
  FOR SELECT
  TO authenticated
  USING (user_id IS NULL AND is_active = true);
