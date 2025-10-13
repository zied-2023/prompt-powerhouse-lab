/*
  # Opik Integration Tables

  1. New Tables
    - `opik_prompt_traces`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `trace_id` (text) - Opik trace identifier
      - `prompt_input` (text) - Input prompt text
      - `prompt_output` (text) - Generated output
      - `model` (text) - AI model used
      - `latency_ms` (integer) - Response time in milliseconds
      - `tokens_used` (integer) - Total tokens consumed
      - `cost` (numeric) - Estimated cost
      - `feedback_score` (numeric) - User feedback score (0-1)
      - `tags` (jsonb) - Additional metadata tags
      - `created_at` (timestamptz)
      
    - `opik_evaluation_metrics`
      - `id` (uuid, primary key)
      - `trace_id` (uuid, foreign key to opik_prompt_traces)
      - `metric_name` (text) - Name of the metric (e.g., 'accuracy', 'relevance')
      - `metric_value` (numeric) - Metric score
      - `metadata` (jsonb) - Additional metric data
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Users can only access their own traces
    - Authenticated users can create and read their traces
    - Authenticated users can create and read evaluation metrics for their traces
*/

CREATE TABLE IF NOT EXISTS opik_prompt_traces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  trace_id text UNIQUE NOT NULL,
  prompt_input text NOT NULL,
  prompt_output text,
  model text DEFAULT 'gpt-3.5-turbo',
  latency_ms integer DEFAULT 0,
  tokens_used integer DEFAULT 0,
  cost numeric(10,6) DEFAULT 0.0,
  feedback_score numeric(3,2),
  tags jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS opik_evaluation_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trace_id uuid REFERENCES opik_prompt_traces(id) ON DELETE CASCADE NOT NULL,
  metric_name text NOT NULL,
  metric_value numeric(10,4) NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE opik_prompt_traces ENABLE ROW LEVEL SECURITY;
ALTER TABLE opik_evaluation_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own prompt traces"
  ON opik_prompt_traces FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own prompt traces"
  ON opik_prompt_traces FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own prompt traces"
  ON opik_prompt_traces FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view evaluation metrics for own traces"
  ON opik_evaluation_metrics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM opik_prompt_traces
      WHERE opik_prompt_traces.id = opik_evaluation_metrics.trace_id
      AND opik_prompt_traces.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert evaluation metrics for own traces"
  ON opik_evaluation_metrics FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM opik_prompt_traces
      WHERE opik_prompt_traces.id = opik_evaluation_metrics.trace_id
      AND opik_prompt_traces.user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_opik_traces_user_id ON opik_prompt_traces(user_id);
CREATE INDEX IF NOT EXISTS idx_opik_traces_created_at ON opik_prompt_traces(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_opik_traces_trace_id ON opik_prompt_traces(trace_id);
CREATE INDEX IF NOT EXISTS idx_opik_metrics_trace_id ON opik_evaluation_metrics(trace_id);