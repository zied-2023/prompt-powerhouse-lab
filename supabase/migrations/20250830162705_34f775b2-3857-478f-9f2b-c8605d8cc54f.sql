-- Supprimer la contrainte automatique en conflit
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'marketplace_prompts_prompt_id_fkey'
    ) THEN
        ALTER TABLE public.marketplace_prompts 
        DROP CONSTRAINT marketplace_prompts_prompt_id_fkey;
    END IF;
END $$;

-- Créer une contrainte pour seller_id vers auth.users si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_marketplace_prompts_seller_id'
    ) THEN
        ALTER TABLE public.marketplace_prompts 
        ADD CONSTRAINT fk_marketplace_prompts_seller_id 
        FOREIGN KEY (seller_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;