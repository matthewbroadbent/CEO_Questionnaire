/*
  # Add first_name field to CEO AI responses

  1. Changes
    - Add `first_name` column to `ceo_ai_responses` table
    - Column is optional (nullable) to maintain compatibility with existing data

  2. Notes
    - This allows capturing the user's first name for personalization
    - Existing records will have NULL for this field
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ceo_ai_responses' AND column_name = 'first_name'
  ) THEN
    ALTER TABLE ceo_ai_responses ADD COLUMN first_name text;
  END IF;
END $$;