-- Insurance knowledge base
CREATE TABLE IF NOT EXISTS insurance_knowledge (
  id        bigserial PRIMARY KEY,
  topic     text NOT NULL,
  content   text NOT NULL,
  keywords  text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Stored Opus-generated master prompt template
CREATE TABLE IF NOT EXISTS prompt_template (
  id         bigserial PRIMARY KEY,
  template   text NOT NULL,
  version    int DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Prompt generation log (training data + edge case queue)
CREATE TABLE IF NOT EXISTS prompt_log (
  id               bigserial PRIMARY KEY,
  timestamp        timestamptz DEFAULT now(),
  user_question    text NOT NULL,
  generated_prompt text NOT NULL,
  prompt_type      text NOT NULL CHECK (prompt_type IN ('initial', 'refinement')),
  session_id       text,
  flagged          boolean DEFAULT false
);

-- Index for admin log view
CREATE INDEX IF NOT EXISTS prompt_log_timestamp_idx ON prompt_log (timestamp DESC);
CREATE INDEX IF NOT EXISTS prompt_log_flagged_idx ON prompt_log (flagged) WHERE flagged = true;
