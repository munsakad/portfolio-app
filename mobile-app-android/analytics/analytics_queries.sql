-- ══════════════════════════════════════════════════════════════
--  PORTFOLIO ANALYTICS — SQL Query Library
--  All queries work with the schema in schema_and_sample_data.sql
-- ══════════════════════════════════════════════════════════════

-- ── 1. OVERVIEW STATS ─────────────────────────────────────────

-- Total users, projects, and skills on the platform
SELECT
    (SELECT COUNT(*) FROM users)    AS total_users,
    (SELECT COUNT(*) FROM projects) AS total_projects,
    (SELECT COUNT(*) FROM skills)   AS total_skills;

-- ── 2. USER PROFILE ANALYTICS ────────────────────────────────

-- Projects and skills count per user
SELECT
    u.name,
    u.title,
    u.location,
    COUNT(DISTINCT p.id) AS project_count,
    COUNT(DISTINCT s.id) AS skill_count
FROM users u
LEFT JOIN projects p ON p.user_id = u.id
LEFT JOIN skills   s ON s.user_id = u.id
GROUP BY u.id
ORDER BY project_count DESC;

-- ── 3. SKILLS ANALYSIS ────────────────────────────────────────

-- Skills distribution by category (platform-wide)
SELECT
    category,
    COUNT(*) AS skill_count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM skills), 1) AS percentage
FROM skills
GROUP BY category
ORDER BY skill_count DESC;

-- Skills distribution by proficiency level
SELECT
    level,
    COUNT(*) AS count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM skills), 1) AS percentage
FROM skills
GROUP BY level
ORDER BY CASE level
    WHEN 'Expert'       THEN 1
    WHEN 'Advanced'     THEN 2
    WHEN 'Intermediate' THEN 3
    WHEN 'Beginner'     THEN 4
END;

-- Top 10 most common skills across all users
SELECT
    name        AS skill,
    COUNT(*)    AS users_with_skill
FROM skills
GROUP BY name
ORDER BY users_with_skill DESC
LIMIT 10;

-- Skills for a specific user (user_id = 1)
SELECT
    name, category, level,
    CASE level
        WHEN 'Expert'       THEN 95
        WHEN 'Advanced'     THEN 75
        WHEN 'Intermediate' THEN 55
        WHEN 'Beginner'     THEN 30
    END AS proficiency_score
FROM skills
WHERE user_id = 1
ORDER BY category, proficiency_score DESC;

-- Average proficiency score per category per user
SELECT
    u.name AS user_name,
    s.category,
    ROUND(AVG(CASE s.level
        WHEN 'Expert'       THEN 95
        WHEN 'Advanced'     THEN 75
        WHEN 'Intermediate' THEN 55
        WHEN 'Beginner'     THEN 30
    END), 1) AS avg_proficiency
FROM skills s
JOIN users u ON u.id = s.user_id
GROUP BY u.id, s.category
ORDER BY u.name, avg_proficiency DESC;

-- ── 4. PROJECT ANALYSIS ───────────────────────────────────────

-- Projects per user with tech diversity score
SELECT
    u.name,
    COUNT(p.id) AS projects,
    LENGTH(GROUP_CONCAT(DISTINCT p.tech_stack)) -
        LENGTH(REPLACE(GROUP_CONCAT(DISTINCT p.tech_stack), ',', '')) + 1
        AS approx_tech_diversity
FROM users u
LEFT JOIN projects p ON p.user_id = u.id
GROUP BY u.id
ORDER BY projects DESC;

-- Projects that have a live demo URL
SELECT
    u.name AS developer,
    p.name AS project,
    p.tech_stack,
    p.live_url
FROM projects p
JOIN users u ON u.id = p.user_id
WHERE p.live_url != ''
ORDER BY u.name;

-- Most used technologies across all projects
WITH RECURSIVE tech_split AS (
    SELECT
        id,
        TRIM(SUBSTR(tech_stack, 1,
            CASE WHEN INSTR(tech_stack, ',') = 0
                 THEN LENGTH(tech_stack)
                 ELSE INSTR(tech_stack, ',') - 1
            END)) AS tech,
        CASE WHEN INSTR(tech_stack, ',') = 0
             THEN ''
             ELSE SUBSTR(tech_stack, INSTR(tech_stack, ',') + 1)
        END AS rest
    FROM projects WHERE tech_stack != ''
    UNION ALL
    SELECT
        id,
        TRIM(SUBSTR(rest, 1,
            CASE WHEN INSTR(rest, ',') = 0
                 THEN LENGTH(rest)
                 ELSE INSTR(rest, ',') - 1
            END)),
        CASE WHEN INSTR(rest, ',') = 0 THEN '' ELSE SUBSTR(rest, INSTR(rest, ',') + 1) END
    FROM tech_split WHERE rest != ''
)
SELECT tech, COUNT(*) AS usage_count
FROM tech_split
WHERE tech != ''
GROUP BY tech
ORDER BY usage_count DESC
LIMIT 15;

-- ── 5. COMPLETENESS SCORE ─────────────────────────────────────

-- How complete is each user's portfolio? (score out of 10)
SELECT
    u.name,
    (
        CASE WHEN u.title    != '' THEN 1 ELSE 0 END +
        CASE WHEN u.bio      != '' THEN 1 ELSE 0 END +
        CASE WHEN u.location != '' THEN 1 ELSE 0 END +
        CASE WHEN u.github   != '' THEN 1 ELSE 0 END +
        CASE WHEN u.linkedin != '' THEN 1 ELSE 0 END +
        CASE WHEN u.website  != '' THEN 1 ELSE 0 END +
        CASE WHEN (SELECT COUNT(*) FROM projects WHERE user_id = u.id) >= 1 THEN 1 ELSE 0 END +
        CASE WHEN (SELECT COUNT(*) FROM projects WHERE user_id = u.id) >= 3 THEN 1 ELSE 0 END +
        CASE WHEN (SELECT COUNT(*) FROM skills   WHERE user_id = u.id) >= 3 THEN 1 ELSE 0 END +
        CASE WHEN (SELECT COUNT(*) FROM skills   WHERE user_id = u.id) >= 8 THEN 1 ELSE 0 END
    ) AS completeness_score,
    (SELECT COUNT(*) FROM projects WHERE user_id = u.id) AS projects,
    (SELECT COUNT(*) FROM skills   WHERE user_id = u.id) AS skills
FROM users u
ORDER BY completeness_score DESC;
