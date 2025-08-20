-- Supprimer l'ancienne contrainte de clé étrangère
ALTER TABLE prompts DROP CONSTRAINT IF EXISTS prompts_user_id_fkey;

-- Créer une nouvelle contrainte qui référence directement auth.users
ALTER TABLE prompts 
ADD CONSTRAINT prompts_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;