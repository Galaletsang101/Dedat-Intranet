-- Backing table for the real forgot-password / admin-invite flow, replacing
-- the dead-end resetPassword() stub in src/services/authService.js. Tokens
-- are stored as a salted hash, never in plaintext.

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL,
    purpose TEXT NOT NULL DEFAULT 'reset' CHECK (purpose IN ('reset', 'invite')),
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS password_reset_tokens_user_id_idx
    ON password_reset_tokens(user_id);
