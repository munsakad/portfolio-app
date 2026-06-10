"""
Portfolio Analytics Runner
Run this script to generate a full analytics report from the SQLite database.

Usage:
    python run_analytics.py

Requirements:
    pip install tabulate
"""

import sqlite3
import os

try:
    from tabulate import tabulate
    TABULATE = True
except ImportError:
    TABULATE = False

DB_FILE = "portfolio_analytics.db"
SQL_SETUP = "schema_and_sample_data.sql"

# ─── Setup ─────────────────────────────────────────────────────

def setup_db():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    # Wipe and recreate for a clean demo run
    conn.execute("DROP TABLE IF EXISTS skills")
    conn.execute("DROP TABLE IF EXISTS projects")
    conn.execute("DROP TABLE IF EXISTS users")
    with open(SQL_SETUP, "r") as f:
        conn.executescript(f.read())
    conn.commit()
    return conn

def print_table(title, rows, headers=None):
    print(f"\n{'═'*60}")
    print(f"  {title}")
    print(f"{'═'*60}")
    if not rows:
        print("  (no data)")
        return
    if TABULATE:
        if headers:
            print(tabulate(rows, headers=headers, tablefmt="rounded_outline"))
        else:
            keys = rows[0].keys() if hasattr(rows[0], 'keys') else None
            print(tabulate([dict(r) for r in rows], headers="keys", tablefmt="rounded_outline"))
    else:
        if rows and hasattr(rows[0], 'keys'):
            keys = list(rows[0].keys())
            print("  " + " | ".join(f"{k:20}" for k in keys))
            print("  " + "-" * (23 * len(keys)))
            for row in rows:
                print("  " + " | ".join(f"{str(row[k]):20}" for k in keys))

# ─── Reports ───────────────────────────────────────────────────

def report_overview(conn):
    row = conn.execute("""
        SELECT
            (SELECT COUNT(*) FROM users)    AS total_users,
            (SELECT COUNT(*) FROM projects) AS total_projects,
            (SELECT COUNT(*) FROM skills)   AS total_skills
    """).fetchone()
    print(f"\n{'═'*60}")
    print(f"  PLATFORM OVERVIEW")
    print(f"{'═'*60}")
    print(f"  👤 Users:    {row['total_users']}")
    print(f"  📁 Projects: {row['total_projects']}")
    print(f"  🔧 Skills:   {row['total_skills']}")

def report_user_summary(conn):
    rows = conn.execute("""
        SELECT u.name, u.title, u.location,
               COUNT(DISTINCT p.id) AS projects,
               COUNT(DISTINCT s.id) AS skills
        FROM users u
        LEFT JOIN projects p ON p.user_id = u.id
        LEFT JOIN skills   s ON s.user_id = u.id
        GROUP BY u.id ORDER BY projects DESC
    """).fetchall()
    print_table("USER PROFILES — Projects & Skills", rows)

def report_skills_by_category(conn):
    rows = conn.execute("""
        SELECT category, COUNT(*) AS count,
               ROUND(COUNT(*)*100.0/(SELECT COUNT(*) FROM skills),1) AS pct
        FROM skills GROUP BY category ORDER BY count DESC
    """).fetchall()
    print_table("SKILLS DISTRIBUTION BY CATEGORY", rows)

def report_skills_by_level(conn):
    rows = conn.execute("""
        SELECT level, COUNT(*) AS count,
               ROUND(COUNT(*)*100.0/(SELECT COUNT(*) FROM skills),1) AS pct
        FROM skills GROUP BY level
        ORDER BY CASE level WHEN 'Expert' THEN 1 WHEN 'Advanced' THEN 2
                            WHEN 'Intermediate' THEN 3 ELSE 4 END
    """).fetchall()
    print_table("SKILLS DISTRIBUTION BY PROFICIENCY LEVEL", rows)

def report_top_skills(conn):
    rows = conn.execute("""
        SELECT name AS skill, COUNT(*) AS used_by_n_users
        FROM skills GROUP BY name ORDER BY used_by_n_users DESC LIMIT 10
    """).fetchall()
    print_table("TOP 10 MOST COMMON SKILLS", rows)

def report_projects_with_demo(conn):
    rows = conn.execute("""
        SELECT u.name AS developer, p.name AS project, p.tech_stack, p.live_url
        FROM projects p JOIN users u ON u.id=p.user_id
        WHERE p.live_url != '' ORDER BY u.name
    """).fetchall()
    print_table("PROJECTS WITH LIVE DEMO URLS", rows)

def report_completeness(conn):
    rows = conn.execute("""
        SELECT u.name,
            (CASE WHEN u.title!=''    THEN 1 ELSE 0 END +
             CASE WHEN u.bio!=''      THEN 1 ELSE 0 END +
             CASE WHEN u.location!='' THEN 1 ELSE 0 END +
             CASE WHEN u.github!=''   THEN 1 ELSE 0 END +
             CASE WHEN u.linkedin!='' THEN 1 ELSE 0 END +
             CASE WHEN (SELECT COUNT(*) FROM projects WHERE user_id=u.id)>=1 THEN 1 ELSE 0 END +
             CASE WHEN (SELECT COUNT(*) FROM projects WHERE user_id=u.id)>=3 THEN 1 ELSE 0 END +
             CASE WHEN (SELECT COUNT(*) FROM skills   WHERE user_id=u.id)>=3 THEN 1 ELSE 0 END +
             CASE WHEN (SELECT COUNT(*) FROM skills   WHERE user_id=u.id)>=8 THEN 1 ELSE 0 END
            ) AS score_out_of_9,
            (SELECT COUNT(*) FROM projects WHERE user_id=u.id) AS projects,
            (SELECT COUNT(*) FROM skills   WHERE user_id=u.id) AS skills
        FROM users u ORDER BY score_out_of_9 DESC
    """).fetchall()
    print_table("PORTFOLIO COMPLETENESS SCORES (/9)", rows)

# ─── Main ──────────────────────────────────────────────────────

if __name__ == "__main__":
    print("\n  PORTFOLIO MANAGEMENT SYSTEM — Analytics Report")
    print("  Powered by SQLite + Python")

    if not os.path.exists(SQL_SETUP):
        print(f"\n  ERROR: '{SQL_SETUP}' not found.")
        print("  Make sure you run this from the analytics/ folder.")
        exit(1)

    conn = setup_db()

    report_overview(conn)
    report_user_summary(conn)
    report_skills_by_category(conn)
    report_skills_by_level(conn)
    report_top_skills(conn)
    report_projects_with_demo(conn)
    report_completeness(conn)

    conn.close()
    print(f"\n{'═'*60}")
    print("  Report complete.")
    print(f"{'═'*60}\n")
