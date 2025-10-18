/*
  # Create improved_prompts table

  1. New Tables
    - `improved_prompts`
      - `id` (uuid, primary key) - Unique identifier
      - `user_id` (uuid, foreign key) - References auth.users
      - `original_prompt` (text, required) - The original prompt text
      - `improved_prompt` (text, required) - The AI-improved version
      - `improvement_notes` (text, optional) - Notes about the improvements
      - `model_used` (text, optional) - Which AI model was used
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `improved_prompts` table
    - Add policy for users to read their own improved prompts
    - Add policy for users to insert their own improved prompts
    - Add policy for users to update their own improved prompts
    - Add policy for users to delete their own improved prompts

  3. Indexes
    - Index on user_id for faster queries
    - Index on created_at for sorting
*/

-- Create the improved_prompts table
CREATE TABLE IF NOT EXISTS improved_prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  original_prompt text NOT NULL CHECK (length(TRIM(BOTH FROM original_prompt)) > 0),
  improved_prompt text NOT NULL CHECK (length(TRIM(BOTH FROM improved_prompt)) > 0),
  improvement_notes text,
  model_used text DEFAULT 'gpt-3.5-turbo',
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE improved_prompts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own improved prompts"
  ON improved_prompts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own improved prompts"
  ON improved_prompts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own improved prompts"
  ON improved_prompts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own improved prompts"
  ON improved_prompts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_improved_prompts_user_id ON improved_prompts(user_id);
CREATE INDEX IF NOT EXISTS idx_improved_prompts_created_at ON improved_prompts(created_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_improved_prompts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS trigger_update_improved_prompts_updated_at ON improved_prompts;
CREATE TRIGGER trigger_update_improved_prompts_updated_at
  BEFORE UPDATE ON improved_prompts
  FOR EACH ROW
  EXECUTE FUNCTION update_improved_prompts_updated_at();