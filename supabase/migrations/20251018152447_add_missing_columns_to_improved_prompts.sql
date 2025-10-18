/*
  # Add missing columns to improved_prompts table

  1. Changes
    - Add `category` (text, nullable) - Category of the prompt
    - Add `title` (text, required) - Title of the prompt
    - Add `quality_score` (numeric) - Quality score from Opik (0-10)
    - Add `improvements` (jsonb) - List of improvements applied
    - Add `tokens_saved` (integer, nullable) - Number of tokens saved
    - Add `opik_trace_id` (text, nullable) - Opik trace ID

  2. Indexes
    - Add index on quality_score for filtering
    - Add index on category for filtering
*/

-- Add missing columns to improved_prompts table
DO $$
BEGIN
  -- Add category column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'improved_prompts' AND column_name = 'category'
  ) THEN
    ALTER TABLE improved_prompts ADD COLUMN category text;
  END IF;

  -- Add title column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'improved_prompts' AND column_name = 'title'
  ) THEN
    ALTER TABLE improved_prompts ADD COLUMN title text NOT NULL DEFAULT 'Untitled Prompt';
  END IF;

  -- Add quality_score column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'improved_prompts' AND column_name = 'quality_score'
  ) THEN
    ALTER TABLE improved_prompts ADD COLUMN quality_score numeric(3,1) CHECK (quality_score >= 0 AND quality_score <= 10);
  END IF;

  -- Add improvements column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'improved_prompts' AND column_name = 'improvements'
  ) THEN
    ALTER TABLE improved_prompts ADD COLUMN improvements jsonb DEFAULT '[]'::jsonb;
  END IF;

  -- Add tokens_saved column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'improved_prompts' AND column_name = 'tokens_saved'
  ) THEN
    ALTER TABLE improved_prompts ADD COLUMN tokens_saved integer;
  END IF;

  -- Add opik_trace_id column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'improved_prompts' AND column_name = 'opik_trace_id'
  ) THEN
    ALTER TABLE improved_prompts ADD COLUMN opik_trace_id text;
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_improved_prompts_quality_score ON improved_prompts(quality_score DESC);
CREATE INDEX IF NOT EXISTS idx_improved_prompts_category ON improved_prompts(category);