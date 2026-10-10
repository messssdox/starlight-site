-- "Share your thoughts": praise, feedback and contact messages, plus a small
-- table that remembers how often someone has posted, to slow down spam.

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  kind TEXT NOT NULL CHECK (kind IN ('praise', 'feedback', 'contact')),
  email TEXT NOT NULL,                              -- private: only ever shown on the admin page
  first_name TEXT NOT NULL DEFAULT '',
  star_sign TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL,
  show_publicly INTEGER NOT NULL DEFAULT 0,         -- 1 = praise the sender is happy to have shown
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'approved', 'hidden', 'read')),
  approved_at TEXT
);
CREATE INDEX IF NOT EXISTS messages_wall ON messages (kind, status, show_publicly, approved_at);

-- One row per visitor per time window. Visitors are stored as a scrambled code, never as an IP address.
CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  hits INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
