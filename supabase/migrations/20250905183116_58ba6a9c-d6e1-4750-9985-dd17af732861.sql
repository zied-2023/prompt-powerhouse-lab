-- Drop the problematic views and recreate without security definer issues
DROP VIEW IF EXISTS public.user_subscription_summary;
DROP VIEW IF EXISTS public.user_transaction_summary;

-- Create RLS-compliant views for financial data access
CREATE VIEW public.user_subscription_summary AS
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

CREATE VIEW public.user_transaction_summary AS
SELECT 
  id,
  buyer_id,
  seller_id,
  marketplace_prompt_id,
  payment_status,
  transaction_date,
  currency,
  CASE 
    WHEN payment_status = 'completed' THEN 'Completed'
    WHEN payment_status = 'pending' THEN 'Processing'
    WHEN payment_status = 'failed' THEN 'Failed'
    WHEN payment_status = 'refunded' THEN 'Refunded'
    ELSE 'Cancelled'
  END as status_display
FROM public.marketplace_transactions;

-- Enable RLS on views to inherit security from underlying tables
ALTER VIEW public.user_subscription_summary SET (security_barrier = true);
ALTER VIEW public.user_transaction_summary SET (security_barrier = true);

-- Grant permissions
GRANT SELECT ON public.user_subscription_summary TO authenticated;
GRANT SELECT ON public.user_transaction_summary TO authenticated;