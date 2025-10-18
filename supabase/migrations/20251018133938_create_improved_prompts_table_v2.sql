/*
  # Create improved_prompts table

  1. New Tables
    - `improved_prompts`
      - `id` (uuid, primary key) - Unique identifier for each improved prompt
      - `user_id` (uuid, foreign key) - Links to auth.users
      - `original_prompt` (text, required) - The original user prompt
      - `improved_prompt` (text, required) - The AI-improved version
      - `quality_score` (numeric, optional) - Quality score between 0-10
      - `improvements` (jsonb, optional) - JSON array of improvement details
      - `category` (text, optional) - Category of the prompt
      - `title` (text, required) - Title/description of the prompt
      - `tokens_saved` (integer, optional) - Number of tokens saved
      - `opik_trace_id` (text, optional) - Opik analytics trace ID
      - `created_at` (timestamptz) - When the prompt was created
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `improved_prompts` table
    - Add policy for authenticated users to read their own prompts
    - Add policy for authenticated users to insert their own prompts
    - Add policy for authenticated users to update their own prompts
    - Add policy for authenticated users to delete their own prompts

  3. Performance
    - Create indexes for user_id and created_at for faster queries
*/

-- Drop table if exists (for clean creation)
DROP TABLE IF EXISTS improved_prompts CASCADE;

-- Create the improved_prompts table
CREATE TABLE improved_prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  original_prompt text NOT NULL,
  improved_prompt text NOT NULL,
  quality_score numeric CHECK (quality_score >= 0 AND quality_score <= 10),
  improvements jsonb DEFAULT '[]'::jsonb,
  category text,
  title text NOT NULL,
  tokens_saved integer,
  opik_trace_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE improved_prompts ENABLE ROW LEVEL SECURITY;

-- Create policies for SELECT
CREATE POLICY "Users can view own improved prompts"
  ON improved_prompts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for INSERT
CREATE POLICY "Users can insert own improved prompts"
  ON improved_prompts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create policies for UPDATE
CREATE POLICY "Users can update own improved prompts"
  ON improved_prompts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for DELETE
CREATE POLICY "Users can delete own improved prompts"
  ON improved_prompts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX idx_improved_prompts_user_id ON improved_prompts(user_id);
CREATE INDEX idx_improved_prompts_created_at ON improved_prompts(created_at DESC);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_improved_prompts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function
CREATE TRIGGER trigger_update_improved_prompts_updated_at
  BEFORE UPDATE ON improved_prompts
  FOR EACH ROW
  EXECUTE FUNCTION update_improved_prompts_updated_at();