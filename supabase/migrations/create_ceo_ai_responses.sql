/*
  # Create CEO AI Responses Table

  1. New Tables
    - `ceo_ai_responses`
      - `id` (uuid, primary key)
      - `timestamp` (timestamptz, when response was submitted)
      - `ai_importance_rating` (integer, 1-5 scale)
      - `ai_current_approach` (jsonb, array of selected approaches)
      - `initial_ai_focus` (jsonb, array of selected focus areas)
      - `initial_ai_focus_other` (text, custom focus area if "Other" selected)
      - `has_ai_strategy` (text, "Yes", "No", or "Partially")
      - `strategy_prioritisation` (jsonb, array of prioritisation methods)
      - `strategy_prioritisation_other` (text, custom prioritisation if "Other" selected)
      - `hypothetical_impact` (text, response to impact question)
      - `future_strategy_confidence` (integer, 1-5 scale)
      - `ip_address` (text, for basic analytics)
      - `email` (text, optional for PDF summary)
      - `created_at` (timestamptz, auto-generated)

  2. Security
    - Enable RLS on `ceo_ai_responses` table
    - Add policy for public insert (anonymous users can submit responses)
    - Add policy for authenticated users to read all data (for admin access)
*/

CREATE TABLE IF NOT EXISTS ceo_ai_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz DEFAULT now(),
  ai_importance_rating integer NOT NULL CHECK (ai_importance_rating >= 1 AND ai_importance_rating <= 5),
  ai_current_approach jsonb NOT NULL DEFAULT '[]'::jsonb,
  initial_ai_focus jsonb NOT NULL DEFAULT '[]'::jsonb,
  initial_ai_focus_other text,
  has_ai_strategy text NOT NULL CHECK (has_ai_strategy IN ('Yes', 'No', 'Partially')),
  strategy_prioritisation jsonb DEFAULT '[]'::jsonb,
  strategy_prioritisation_other text,
  hypothetical_impact text NOT NULL,
  future_strategy_confidence integer NOT NULL CHECK (future_strategy_confidence >= 1 AND future_strategy_confidence <= 5),
  ip_address text,
  email text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ceo_ai_responses ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert responses
CREATE POLICY "Allow anonymous insert"
  ON ceo_ai_responses
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to read all responses (for admin access)
CREATE POLICY "Allow authenticated read"
  ON ceo_ai_responses
  FOR SELECT
  TO authenticated
  USING (true);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_ceo_ai_responses_created_at ON ceo_ai_responses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ceo_ai_responses_ai_importance ON ceo_ai_responses(ai_importance_rating);
CREATE INDEX IF NOT EXISTS idx_ceo_ai_responses_has_strategy ON ceo_ai_responses(has_ai_strategy);