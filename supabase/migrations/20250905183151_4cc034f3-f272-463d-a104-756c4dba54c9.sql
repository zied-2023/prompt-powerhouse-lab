-- Remove views that are causing security definer issues
DROP VIEW IF EXISTS public.user_subscription_summary CASCADE;
DROP VIEW IF EXISTS public.user_transaction_summary CASCADE;

-- The underlying tables are already properly secured with RLS policies
-- Applications should query the tables directly with proper authentication