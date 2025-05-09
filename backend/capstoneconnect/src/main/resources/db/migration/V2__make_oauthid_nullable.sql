-- Migration: Make oauthId nullable for legacy web users
ALTER TABLE users ALTER COLUMN oauthid DROP NOT NULL;
