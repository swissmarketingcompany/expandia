-- Expandia Offer System Database Schema
-- This creates the offers table in PostgreSQL

CREATE TABLE IF NOT EXISTS offers (
    id VARCHAR(255) PRIMARY KEY,
    client_name VARCHAR(500) NOT NULL,
    title VARCHAR(500) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    password_plain VARCHAR(255) NOT NULL,
    html_content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_offers_created_at ON offers(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_offers_client_name ON offers(client_name);

-- Show success message
SELECT 'Database initialized successfully!' AS status;

