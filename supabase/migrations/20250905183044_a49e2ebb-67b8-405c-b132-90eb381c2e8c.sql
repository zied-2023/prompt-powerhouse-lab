-- Add data integrity constraints for financial tables
DO $$ 
BEGIN
  -- Add payment status constraint for user_subscriptions if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'valid_payment_status' 
    AND table_name = 'user_subscriptions'
  ) THEN
    ALTER TABLE public.user_subscriptions 
    ADD CONSTRAINT valid_payment_status 
    CHECK (payment_status IN ('pending', 'completed', 'failed', 'cancelled'));
  END IF;

  -- Add payment status constraint for marketplace_transactions if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'valid_payment_status_transactions' 
    AND table_name = 'marketplace_transactions'
  ) THEN
    ALTER TABLE public.marketplace_transactions 
    ADD CONSTRAINT valid_payment_status_transactions 
    CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded', 'cancelled'));
  END IF;

  -- Add positive amounts constraint if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'positive_amounts' 
    AND table_name = 'marketplace_transactions'
  ) THEN
    ALTER TABLE public.marketplace_transactions 
    ADD CONSTRAINT positive_amounts 
    CHECK (amount > 0 AND commission_amount >= 0);
  END IF;
END $$;

-- Create secure view for subscription summary (without sensitive payment details)
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
FROM public.user_subscriptions
WHERE auth.uid() = user_id;

-- Create secure view for transaction summary (without sensitive payment details)
CREATE OR REPLACE VIEW public.user_transaction_summary AS
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
FROM public.marketplace_transactions
WHERE auth.uid() = buyer_id OR auth.uid() = seller_id;

-- Create audit logging function
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

-- Grant permissions for the secure views
GRANT SELECT ON public.user_subscription_summary TO authenticated;
GRANT SELECT ON public.user_transaction_summary TO authenticated;