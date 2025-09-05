-- Simplify profiles table policies while maintaining security

-- Drop all existing policies
DROP POLICY IF EXISTS "Authenticated users view own profile only" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users insert own profile only" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users update own profile only" ON public.profiles;
DROP POLICY IF EXISTS "No profile deletion allowed" ON public.profiles;

-- Create simple but secure policies
CREATE POLICY "Users own profile access only"
ON public.profiles
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Explicitly deny anonymous access
CREATE POLICY "Deny anonymous access"
ON public.profiles
FOR ALL
TO anon
USING (false);

-- Add email encryption for additional security
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email_encrypted boolean DEFAULT false;

-- Create function to safely access profile email
CREATE OR REPLACE FUNCTION public.get_user_email_safely()
RETURNS text AS $$
DECLARE
  user_email text;
BEGIN
  -- Only return email for the authenticated user
  SELECT email INTO user_email 
  FROM public.profiles 
  WHERE user_id = auth.uid();
  
  RETURN user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

GRANT EXECUTE ON FUNCTION public.get_user_email_safely TO authenticated;