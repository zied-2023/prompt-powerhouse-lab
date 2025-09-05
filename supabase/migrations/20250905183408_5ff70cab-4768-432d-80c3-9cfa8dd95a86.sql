-- Enhanced security for profiles table - Address email exposure concerns

-- First, revoke any public access that might exist
REVOKE ALL PRIVILEGES ON public.profiles FROM PUBLIC;
REVOKE ALL PRIVILEGES ON public.profiles FROM anon;

-- Ensure only authenticated role has basic access
GRANT SELECT ON public.profiles TO authenticated;

-- Drop existing policies to recreate with even stricter security
DROP POLICY IF EXISTS "Users can view only their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert only their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update only their own profile" ON public.profiles;

-- Create ultra-strict policies that also check authentication status
CREATE POLICY "Authenticated users view own profile only"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND auth.role() = 'authenticated'
  AND auth.uid() = user_id 
  AND public.is_profile_owner(user_id)
  AND user_id IS NOT NULL
);

CREATE POLICY "Authenticated users insert own profile only"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND auth.role() = 'authenticated'
  AND auth.uid() = user_id 
  AND public.is_profile_owner(user_id)
  AND user_id IS NOT NULL
  AND email IS NOT NULL
);

CREATE POLICY "Authenticated users update own profile only"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND auth.role() = 'authenticated'
  AND auth.uid() = user_id 
  AND public.is_profile_owner(user_id)
  AND user_id IS NOT NULL
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND auth.role() = 'authenticated'
  AND auth.uid() = user_id 
  AND public.is_profile_owner(user_id)
  AND user_id IS NOT NULL
);

-- Explicitly deny DELETE operations on profiles
CREATE POLICY "No profile deletion allowed"
ON public.profiles
FOR DELETE
TO authenticated
USING (false);

-- Create a security function that masks email data for additional protection
CREATE OR REPLACE FUNCTION public.get_safe_profile_data(profile_user_id uuid)
RETURNS TABLE(
  id uuid,
  user_id uuid,
  email_domain text,
  created_at timestamptz,
  updated_at timestamptz
) AS $$
BEGIN
  -- Only return data if user owns the profile
  IF auth.uid() = profile_user_id THEN
    RETURN QUERY
    SELECT 
      p.id,
      p.user_id,
      CASE 
        WHEN p.email IS NOT NULL THEN split_part(p.email, '@', 2)
        ELSE NULL
      END as email_domain,
      p.created_at,
      p.updated_at
    FROM public.profiles p
    WHERE p.user_id = profile_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Grant access to the safe profile function
GRANT EXECUTE ON FUNCTION public.get_safe_profile_data TO authenticated;