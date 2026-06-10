import Database from 'better-sqlite3'
import path from 'path'

let db

function getDb() {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'portfolio.db')
    db = new Database(dbPath)
    db.pragma('journal_mode = WAL')
    initDb(db)
  }
  return db
}

function initDb(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      title TEXT DEFAULT '',
      bio TEXT DEFAULT '',
      github TEXT DEFAULT '',
      linkedin TEXT DEFAULT '',
      website TEXT DEFAULT '',
      location TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      tech_stack TEXT DEFAULT '',
      live_url TEXT DEFAULT '',
      github_url TEXT DEFAULT '',
      image_url TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      category TEXT DEFAULT 'General',
      level TEXT DEFAULT 'Intermediate',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `)

  // Migrate: add image_url to existing projects table if missing
  try {
    db.exec(`ALTER TABLE projects ADD COLUMN image_url TEXT DEFAULT ''`)
  } catch {
    // Column already exists — safe to ignore
  }
}

export default getDb
