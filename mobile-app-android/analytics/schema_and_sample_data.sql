-- ══════════════════════════════════════════════════════════════
--  PORTFOLIO MANAGEMENT SYSTEM — Database Schema & Sample Data
--  Run this file to create tables and populate with demo data
-- ══════════════════════════════════════════════════════════════

-- Create Tables
CREATE TABLE IF NOT EXISTS users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    email       TEXT    UNIQUE NOT NULL,
    password    TEXT    NOT NULL,
    title       TEXT    DEFAULT '',
    bio         TEXT    DEFAULT '',
    github      TEXT    DEFAULT '',
    linkedin    TEXT    DEFAULT '',
    website     TEXT    DEFAULT '',
    location    TEXT    DEFAULT '',
    phone       TEXT    DEFAULT '',
    created_at  TEXT    DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS projects (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL,
    name        TEXT    NOT NULL,
    description TEXT    DEFAULT '',
    tech_stack  TEXT    DEFAULT '',
    live_url    TEXT    DEFAULT '',
    github_url  TEXT    DEFAULT '',
    created_at  TEXT    DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS skills (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL,
    name        TEXT    NOT NULL,
    category    TEXT    DEFAULT 'General',
    level       TEXT    DEFAULT 'Intermediate',
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ── Sample Users ──────────────────────────────────────────────
INSERT INTO users (name, email, password, title, bio, location, github, linkedin) VALUES
('Dingani Munsakad',  'munsakad@berea.edu',    'pass123',
 'Full Stack Developer',
 'Passionate developer skilled in web and mobile development. Love building clean, scalable apps.',
 'Berea, KY', 'https://github.com/munsakad', 'https://linkedin.com/in/munsakad'),

('Alex Johnson',      'alex@example.com',       'pass123',
 'Frontend Engineer',
 'UI/UX focused developer with 3 years of React experience.',
 'New York, NY', 'https://github.com/alexj', 'https://linkedin.com/in/alexj'),

('Priya Sharma',      'priya@example.com',      'pass123',
 'Backend Developer',
 'Java and Python specialist. Building robust REST APIs.',
 'Austin, TX', 'https://github.com/priyas', 'https://linkedin.com/in/priyas'),

('Marcus Brown',      'marcus@example.com',     'pass123',
 'Mobile Developer',
 'Android and iOS developer with expertise in React Native.',
 'Chicago, IL', 'https://github.com/marcusb', 'https://linkedin.com/in/marcusb'),

('Sara Kim',          'sara@example.com',       'pass123',
 'Data Analyst',
 'SQL and Python data analyst turning raw data into insights.',
 'Seattle, WA', 'https://github.com/sarak', 'https://linkedin.com/in/sarak');

-- ── Sample Projects ───────────────────────────────────────────
INSERT INTO projects (user_id, name, description, tech_stack, live_url, github_url) VALUES
(1, 'Portfolio CMS',        'Full-stack portfolio management system with auth and project tracking.', 'Next.js, SQLite, JWT, Tailwind CSS', 'https://portfolio.example.com', 'https://github.com/munsakad/portfolio'),
(1, 'E-Commerce Platform',  'Online store with cart, checkout, Stripe payments and admin panel.',    'React, Node.js, MongoDB, Stripe',   'https://shop.example.com',       'https://github.com/munsakad/ecommerce'),
(1, 'Task Manager App',     'Android task manager with reminders, categories and SQLite storage.',   'Java, Android, SQLite, Material UI','',                               'https://github.com/munsakad/tasks'),
(1, 'Weather Dashboard',    'Real-time weather with 5-day forecast using OpenWeather API.',          'Vue.js, REST API, Chart.js',        'https://weather.example.com',    'https://github.com/munsakad/weather'),
(1, 'Chat Application',     'Real-time chat rooms with file sharing and emoji reactions.',           'React, Node.js, Socket.io, MongoDB','',                               'https://github.com/munsakad/chat'),
(2, 'Design System',        'Component library built with Storybook and Tailwind.',                  'React, Storybook, Tailwind CSS',    'https://design.example.com',     'https://github.com/alexj/design'),
(2, 'Admin Dashboard',      'Analytics dashboard with recharts and real-time data.',                 'React, TypeScript, Recharts',       'https://admin.example.com',      'https://github.com/alexj/dashboard'),
(3, 'REST API Framework',   'Lightweight Express framework with JWT, rate limiting and caching.',    'Node.js, Express, Redis, JWT',      '',                               'https://github.com/priyas/api-fw'),
(3, 'Data Pipeline',        'ETL pipeline processing 1M+ records daily with error recovery.',       'Python, Apache Airflow, PostgreSQL','',                               'https://github.com/priyas/pipeline'),
(4, 'Fitness Tracker',      'Cross-platform fitness app with workout logging and progress charts.',  'React Native, Firebase, Chart.js',  '',                               'https://github.com/marcusb/fitness'),
(4, 'News Reader',          'Android RSS reader with offline mode and push notifications.',          'Java, Android, Room, WorkManager',  '',                               'https://github.com/marcusb/newsreader'),
(5, 'Sales Analytics',      'Interactive sales dashboard with drill-down filters.',                  'Python, Pandas, Plotly, SQL',       'https://analytics.example.com',  'https://github.com/sarak/sales'),
(5, 'Customer Segmentation','ML-based customer clustering using K-means on transaction data.',      'Python, Scikit-learn, SQL, Tableau','',                               'https://github.com/sarak/segments');

-- ── Sample Skills ─────────────────────────────────────────────
INSERT INTO skills (user_id, name, category, level) VALUES
(1,'Java','Mobile','Advanced'), (1,'Android SDK','Mobile','Advanced'),
(1,'React','Frontend','Expert'), (1,'Next.js','Frontend','Advanced'),
(1,'JavaScript','Frontend','Expert'), (1,'HTML & CSS','Frontend','Expert'),
(1,'Tailwind CSS','Frontend','Advanced'), (1,'Node.js','Backend','Advanced'),
(1,'REST APIs','Backend','Expert'), (1,'SQLite','Database','Advanced'),
(1,'MongoDB','Database','Intermediate'), (1,'SQL','Database','Advanced'),
(1,'Git & GitHub','DevOps','Advanced'), (1,'Figma','Design','Intermediate'),

(2,'React','Frontend','Expert'), (2,'TypeScript','Frontend','Advanced'),
(2,'CSS/SCSS','Frontend','Expert'), (2,'Figma','Design','Advanced'),
(2,'Vue.js','Frontend','Intermediate'), (2,'Jest','DevOps','Intermediate'),

(3,'Node.js','Backend','Expert'), (3,'Python','Backend','Expert'),
(3,'PostgreSQL','Database','Advanced'), (3,'Redis','Database','Advanced'),
(3,'Docker','DevOps','Advanced'), (3,'REST APIs','Backend','Expert'),

(4,'Java','Mobile','Expert'), (4,'React Native','Mobile','Advanced'),
(4,'Kotlin','Mobile','Intermediate'), (4,'Firebase','Backend','Advanced'),
(4,'Android SDK','Mobile','Expert'), (4,'iOS Swift','Mobile','Beginner'),

(5,'SQL','Database','Expert'), (5,'Python','Backend','Expert'),
(5,'Tableau','Design','Advanced'), (5,'Pandas','Backend','Advanced'),
(5,'Power BI','Design','Intermediate'), (5,'Excel','General','Expert');
