/**
 * Capture-history database (SQLite via better-sqlite3).
 *
 * v0.1 — stub. Implemented in milestone v0.2 as part of the history view.
 *
 * Schema (planned):
 *   captures(id PK, file_path, captured_at, mode, width, height, uploaded_url NULL, deleted_at NULL)
 *   uploads(id PK, capture_id FK, provider, remote_url, uploaded_at)
 */
export {};
