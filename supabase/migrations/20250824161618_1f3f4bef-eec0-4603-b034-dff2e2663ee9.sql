-- Mettre à jour la fonction pour donner 10 crédits aux nouveaux utilisateurs
CREATE OR REPLACE FUNCTION public.handle_new_user_credits()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.user_credits (user_id, total_credits, used_credits)
  VALUES (NEW.id, 10, 0);
  RETURN NEW;
END;
$function$;

-- Mettre à jour la valeur par défaut dans la table user_credits
ALTER TABLE public.user_credits ALTER COLUMN total_credits SET DEFAULT 10;

-- Mettre à jour tous les utilisateurs existants pour qu'ils aient 10 crédits au lieu de 5
UPDATE public.user_credits 
SET total_credits = 10, 
    updated_at = now() 
WHERE total_credits = 5;