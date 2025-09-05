-- Fix database functions security by adding proper search paths

-- Update all existing functions to have proper security settings
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.is_profile_owner(profile_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  RETURN auth.uid() = profile_user_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user_credits()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_credits (user_id, total_credits, used_credits)
  VALUES (NEW.id, 5, 0);
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.is_subscription_owner(subscription_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Enhanced validation for subscription access
  RETURN auth.uid() IS NOT NULL 
    AND auth.uid() = subscription_user_id 
    AND auth.role() = 'authenticated';
END;
$$;

CREATE OR REPLACE FUNCTION public.is_transaction_participant(transaction_buyer_id uuid, transaction_seller_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Enhanced validation for transaction access
  RETURN auth.uid() IS NOT NULL 
    AND auth.role() = 'authenticated'
    AND (auth.uid() = transaction_buyer_id OR auth.uid() = transaction_seller_id);
END;
$$;

CREATE OR REPLACE FUNCTION public.log_financial_access(table_name text, record_id uuid, access_type text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Log financial data access for security auditing
  INSERT INTO public.audit_logs (user_id, table_name, record_id, access_type, timestamp)
  VALUES (auth.uid(), table_name, record_id, access_type, now())
  ON CONFLICT DO NOTHING;
EXCEPTION
  WHEN OTHERS THEN
    -- Don't fail if audit table doesn't exist, but log to system
    RAISE NOTICE 'Audit logging failed: %', SQLERRM;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_safe_profile_data(profile_user_id uuid)
RETURNS TABLE(id uuid, user_id uuid, email_domain text, created_at timestamp with time zone, updated_at timestamp with time zone)
LANGUAGE plpgsql
STABLE SECURITY DEFINER SET search_path = public
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.get_user_email_safely()
RETURNS text
LANGUAGE plpgsql
STABLE SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_email text;
BEGIN
  -- Only return email for the authenticated user
  SELECT email INTO user_email 
  FROM public.profiles 
  WHERE user_id = auth.uid();
  
  RETURN user_email;
END;
$$;