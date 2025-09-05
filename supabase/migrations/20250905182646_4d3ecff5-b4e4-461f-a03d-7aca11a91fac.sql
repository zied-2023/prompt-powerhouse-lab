-- Create a security definer function to safely check profile ownership
CREATE OR REPLACE FUNCTION public.is_profile_owner(profile_user_id uuid)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.uid() = profile_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Drop existing policies
DROP POLICY IF EXISTS "Les utilisateurs peuvent voir leur propre profil" ON public.profiles;
DROP POLICY IF EXISTS "Les utilisateurs peuvent insérer leur propre profil" ON public.profiles;
DROP POLICY IF EXISTS "Les utilisateurs peuvent mettre à jour leur propre profil" ON public.profiles;

-- Create enhanced RLS policies with additional security checks
CREATE POLICY "Users can view only their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id 
  AND public.is_profile_owner(user_id)
);

CREATE POLICY "Users can insert only their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id 
  AND public.is_profile_owner(user_id)
);

CREATE POLICY "Users can update only their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id 
  AND public.is_profile_owner(user_id)
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id 
  AND public.is_profile_owner(user_id)
);

-- Ensure no DELETE policy exists (profiles should not be deletable by users)
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;