/*
  # Permettre user_id NULL pour clés API système

  1. Modifications
    - Modifier la colonne user_id pour accepter NULL
    - Permet de créer des clés API système partagées entre tous les utilisateurs
  
  2. Notes
    - Les clés avec user_id=NULL sont des clés système accessibles par tous
    - Les clés avec user_id spécifique restent privées à l'utilisateur
*/

-- Permettre NULL sur user_id pour les clés API système
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'api_keys' AND column_name = 'user_id' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE api_keys ALTER COLUMN user_id DROP NOT NULL;
  END IF;
END $$;
