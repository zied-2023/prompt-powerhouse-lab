-- Remove the duplicate constraint that was automatically created
ALTER TABLE public.marketplace_prompts 
DROP CONSTRAINT IF EXISTS marketplace_prompts_prompt_id_fkey;

-- Keep only the explicitly named constraint
-- (The fk_marketplace_prompts_prompt_id constraint we created is the one we want to keep)

-- Add unique constraint to prevent duplicate prompt publications
ALTER TABLE public.marketplace_prompts 
ADD CONSTRAINT unique_prompt_per_seller UNIQUE (prompt_id, seller_id);