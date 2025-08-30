-- Fix foreign key relationships for marketplace_prompts
ALTER TABLE public.marketplace_prompts 
ADD CONSTRAINT fk_marketplace_prompts_seller_id 
FOREIGN KEY (seller_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.marketplace_prompts 
ADD CONSTRAINT fk_marketplace_prompts_prompt_id 
FOREIGN KEY (prompt_id) REFERENCES public.prompts(id) ON DELETE CASCADE;