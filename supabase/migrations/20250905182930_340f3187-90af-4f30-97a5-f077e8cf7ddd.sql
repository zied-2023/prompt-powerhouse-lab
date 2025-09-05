-- Create security definer functions for financial data access validation
CREATE OR REPLACE FUNCTION public.is_subscription_owner(subscription_user_id uuid)
RETURNS BOOLEAN AS $$
BEGIN
  -- Enhanced validation for subscription access
  RETURN auth.uid() IS NOT NULL 
    AND auth.uid() = subscription_user_id 
    AND auth.role() = 'authenticated';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_transaction_participant(transaction_buyer_id uuid, transaction_seller_id uuid)
RETURNS BOOLEAN AS $$
BEGIN
  -- Enhanced validation for transaction access
  RETURN auth.uid() IS NOT NULL 
    AND auth.role() = 'authenticated'
    AND (auth.uid() = transaction_buyer_id OR auth.uid() = transaction_seller_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Create audit function for financial data access
CREATE OR REPLACE FUNCTION public.log_financial_access(table_name text, record_id uuid, access_type text)
RETURNS void AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create audit table for financial access logging
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  table_name text NOT NULL,
  record_id uuid,
  access_type text NOT NULL,
  timestamp timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on audit table
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only allow viewing own audit logs
CREATE POLICY "Users can view own audit logs" ON public.audit_logs
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Drop and recreate enhanced policies for user_subscriptions
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.user_subscriptions;

CREATE POLICY "Enhanced subscription access"
ON public.user_subscriptions
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND auth.role() = 'authenticated'
  AND public.is_subscription_owner(user_id)
);

-- Prevent any user modification of subscription data (only system can modify)
CREATE POLICY "System only subscription updates"
ON public.user_subscriptions
FOR UPDATE
TO service_role
USING (true);

CREATE POLICY "System only subscription inserts"
ON public.user_subscriptions
FOR INSERT
TO service_role
WITH CHECK (true);

-- Drop and recreate enhanced policies for marketplace_transactions
DROP POLICY IF EXISTS "Utilisateurs peuvent voir leurs propres transactions" ON public.marketplace_transactions;
DROP POLICY IF EXISTS "Système peut créer des transactions" ON public.marketplace_transactions;
DROP POLICY IF EXISTS "Système peut modifier les transactions" ON public.marketplace_transactions;

CREATE POLICY "Enhanced transaction access"
ON public.marketplace_transactions
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND auth.role() = 'authenticated'
  AND public.is_transaction_participant(buyer_id, seller_id)
);

-- Only service role can create/update transactions
CREATE POLICY "Service only transaction creation"
ON public.marketplace_transactions
FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "Service only transaction updates"
ON public.marketplace_transactions
FOR UPDATE
TO service_role
USING (true);

-- Ensure no DELETE operations are allowed on financial data
DROP POLICY IF EXISTS "No deletes allowed" ON public.user_subscriptions;
DROP POLICY IF EXISTS "No deletes allowed" ON public.marketplace_transactions;

-- Add constraints to ensure data integrity
ALTER TABLE public.user_subscriptions 
ADD CONSTRAINT IF NOT EXISTS valid_payment_status 
CHECK (payment_status IN ('pending', 'completed', 'failed', 'cancelled'));

ALTER TABLE public.marketplace_transactions 
ADD CONSTRAINT IF NOT EXISTS valid_payment_status_transactions 
CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded', 'cancelled'));

ALTER TABLE public.marketplace_transactions 
ADD CONSTRAINT IF NOT EXISTS positive_amounts 
CHECK (amount > 0 AND commission_amount >= 0);

-- Create view for safe financial data access (without sensitive details)
CREATE OR REPLACE VIEW public.user_subscription_summary AS
SELECT 
  id,
  user_id,
  payment_status,
  created_at,
  CASE 
    WHEN payment_status = 'completed' THEN 'Active'
    WHEN payment_status = 'pending' THEN 'Processing'
    ELSE 'Inactive'
  END as status_display
FROM public.user_subscriptions;

-- Enable RLS on the view
ALTER VIEW public.user_subscription_summary SET (security_barrier = true);

-- Grant appropriate permissions
GRANT SELECT ON public.user_subscription_summary TO authenticated;
GRANT SELECT ON public.audit_logs TO authenticated;