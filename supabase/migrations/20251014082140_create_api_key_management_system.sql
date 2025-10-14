/*
  # API Key Management System

  1. New Tables
    - `api_keys`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `provider` (text) - openai, anthropic, openrouter, etc.
      - `api_key_encrypted` (text) - encrypted API key
      - `nickname` (text) - user-friendly name
      - `is_active` (boolean) - whether this key is active
      - `priority` (integer) - selection priority (higher = preferred)
      - `usage_count` (integer) - number of times used
      - `last_used_at` (timestamptz) - last usage timestamp
      - `context_tags` (jsonb) - tags for context-based selection
      - `rate_limit_per_minute` (integer) - rate limit
      - `cost_per_token` (numeric) - cost tracking
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `api_key_usage_logs`
      - `id` (uuid, primary key)
      - `api_key_id` (uuid, references api_keys)
      - `user_id` (uuid, references auth.users)
      - `context` (jsonb) - request context
      - `success` (boolean) - whether request succeeded
      - `tokens_used` (integer) - tokens consumed
      - `cost` (numeric) - actual cost
      - `response_time_ms` (integer) - response time
      - `error_message` (text) - error if failed
      - `created_at` (timestamptz)
    
    - `api_key_selection_rules`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text) - rule name
      - `conditions` (jsonb) - selection conditions
      - `preferred_provider` (text) - provider to use
      - `is_active` (boolean)
      - `priority` (integer) - rule priority
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own keys
    - Secure policies for logging and analytics

  3. Important Notes
    - API keys are stored encrypted
    - Usage tracking for cost optimization
    - Intelligent selection based on context and rules
    - Rate limiting and cost tracking built-in
*/

-- Create api_keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  provider text NOT NULL,
  api_key_encrypted text NOT NULL,
  nickname text,
  is_active boolean DEFAULT true,
  priority integer DEFAULT 0,
  usage_count integer DEFAULT 0,
  last_used_at timestamptz,
  context_tags jsonb DEFAULT '[]'::jsonb,
  rate_limit_per_minute integer,
  cost_per_token numeric(10, 6),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create api_key_usage_logs table
CREATE TABLE IF NOT EXISTS api_key_usage_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id uuid REFERENCES api_keys(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  context jsonb DEFAULT '{}'::jsonb,
  success boolean NOT NULL,
  tokens_used integer DEFAULT 0,
  cost numeric(10, 6),
  response_time_ms integer,
  error_message text,
  created_at timestamptz DEFAULT now()
);

-- Create api_key_selection_rules table
CREATE TABLE IF NOT EXISTS api_key_selection_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  conditions jsonb NOT NULL,
  preferred_provider text NOT NULL,
  is_active boolean DEFAULT true,
  priority integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_key_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_key_selection_rules ENABLE ROW LEVEL SECURITY;

-- Policies for api_keys
CREATE POLICY "Users can view own API keys"
  ON api_keys FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own API keys"
  ON api_keys FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own API keys"
  ON api_keys FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own API keys"
  ON api_keys FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for api_key_usage_logs
CREATE POLICY "Users can view own usage logs"
  ON api_key_usage_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage logs"
  ON api_key_usage_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies for api_key_selection_rules
CREATE POLICY "Users can view own selection rules"
  ON api_key_selection_rules FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own selection rules"
  ON api_key_selection_rules FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own selection rules"
  ON api_key_selection_rules FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own selection rules"
  ON api_key_selection_rules FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_provider ON api_keys(provider);
CREATE INDEX IF NOT EXISTS idx_api_keys_is_active ON api_keys(is_active);
CREATE INDEX IF NOT EXISTS idx_api_key_usage_logs_user_id ON api_key_usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_api_key_usage_logs_api_key_id ON api_key_usage_logs(api_key_id);
CREATE INDEX IF NOT EXISTS idx_api_key_usage_logs_created_at ON api_key_usage_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_api_key_selection_rules_user_id ON api_key_selection_rules(user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_api_keys_updated_at'
  ) THEN
    CREATE TRIGGER update_api_keys_updated_at
      BEFORE UPDATE ON api_keys
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;