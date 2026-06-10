package com.portfolio.app.database;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

import com.portfolio.app.models.Project;
import com.portfolio.app.models.Skill;
import com.portfolio.app.models.User;

import java.util.ArrayList;
import java.util.List;

public class DatabaseHelper extends SQLiteOpenHelper {

    private static final String DB_NAME = "portfolio.db";
    private static final int DB_VERSION = 1;

    // Table names
    public static final String TABLE_USERS = "users";
    public static final String TABLE_PROJECTS = "projects";
    public static final String TABLE_SKILLS = "skills";

    // Users columns
    public static final String COL_ID = "id";
    public static final String COL_NAME = "name";
    public static final String COL_EMAIL = "email";
    public static final String COL_PASSWORD = "password";
    public static final String COL_TITLE = "title";
    public static final String COL_BIO = "bio";
    public static final String COL_GITHUB = "github";
    public static final String COL_LINKEDIN = "linkedin";
    public static final String COL_WEBSITE = "website";
    public static final String COL_LOCATION = "location";
    public static final String COL_PHONE = "phone";

    // Projects columns
    public static final String COL_USER_ID = "user_id";
    public static final String COL_DESCRIPTION = "description";
    public static final String COL_TECH_STACK = "tech_stack";
    public static final String COL_LIVE_URL = "live_url";
    public static final String COL_GITHUB_URL = "github_url";
    public static final String COL_CREATED_AT = "created_at";

    // Skills columns
    public static final String COL_CATEGORY = "category";
    public static final String COL_LEVEL = "level";

    private static DatabaseHelper instance;

    public static synchronized DatabaseHelper getInstance(Context context) {
        if (instance == null) {
            instance = new DatabaseHelper(context.getApplicationContext());
        }
        return instance;
    }

    private DatabaseHelper(Context context) {
        super(context, DB_NAME, null, DB_VERSION);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        db.execSQL("CREATE TABLE " + TABLE_USERS + " (" +
                COL_ID + " INTEGER PRIMARY KEY AUTOINCREMENT, " +
                COL_NAME + " TEXT NOT NULL, " +
                COL_EMAIL + " TEXT UNIQUE NOT NULL, " +
                COL_PASSWORD + " TEXT NOT NULL, " +
                COL_TITLE + " TEXT DEFAULT '', " +
                COL_BIO + " TEXT DEFAULT '', " +
                COL_GITHUB + " TEXT DEFAULT '', " +
                COL_LINKEDIN + " TEXT DEFAULT '', " +
                COL_WEBSITE + " TEXT DEFAULT '', " +
                COL_LOCATION + " TEXT DEFAULT '', " +
                COL_PHONE + " TEXT DEFAULT ''" +
                ")");

        db.execSQL("CREATE TABLE " + TABLE_PROJECTS + " (" +
                COL_ID + " INTEGER PRIMARY KEY AUTOINCREMENT, " +
                COL_USER_ID + " INTEGER NOT NULL, " +
                COL_NAME + " TEXT NOT NULL, " +
                COL_DESCRIPTION + " TEXT DEFAULT '', " +
                COL_TECH_STACK + " TEXT DEFAULT '', " +
                COL_LIVE_URL + " TEXT DEFAULT '', " +
                COL_GITHUB_URL + " TEXT DEFAULT '', " +
                COL_CREATED_AT + " TEXT DEFAULT (datetime('now')), " +
                "FOREIGN KEY(" + COL_USER_ID + ") REFERENCES " + TABLE_USERS + "(" + COL_ID + ")" +
                ")");

        db.execSQL("CREATE TABLE " + TABLE_SKILLS + " (" +
                COL_ID + " INTEGER PRIMARY KEY AUTOINCREMENT, " +
                COL_USER_ID + " INTEGER NOT NULL, " +
                COL_NAME + " TEXT NOT NULL, " +
                COL_CATEGORY + " TEXT DEFAULT 'General', " +
                COL_LEVEL + " TEXT DEFAULT 'Intermediate', " +
                "FOREIGN KEY(" + COL_USER_ID + ") REFERENCES " + TABLE_USERS + "(" + COL_ID + ")" +
                ")");
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_SKILLS);
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_PROJECTS);
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_USERS);
        onCreate(db);
    }

    // ─── USER OPERATIONS ────────────────────────────────────────────────────

    public long registerUser(String name, String email, String password) {
        SQLiteDatabase db = getWritableDatabase();
        ContentValues cv = new ContentValues();
        cv.put(COL_NAME, name);
        cv.put(COL_EMAIL, email);
        cv.put(COL_PASSWORD, password);
        return db.insert(TABLE_USERS, null, cv);
    }

    public User loginUser(String email, String password) {
        SQLiteDatabase db = getReadableDatabase();
        Cursor cursor = db.query(TABLE_USERS, null,
                COL_EMAIL + "=? AND " + COL_PASSWORD + "=?",
                new String[]{email, password}, null, null, null);
        if (cursor.moveToFirst()) {
            User user = cursorToUser(cursor);
            cursor.close();
            return user;
        }
        cursor.close();
        return null;
    }

    public boolean emailExists(String email) {
        SQLiteDatabase db = getReadableDatabase();
        Cursor cursor = db.query(TABLE_USERS, new String[]{COL_ID},
                COL_EMAIL + "=?", new String[]{email}, null, null, null);
        boolean exists = cursor.getCount() > 0;
        cursor.close();
        return exists;
    }

    public User getUserById(int id) {
        SQLiteDatabase db = getReadableDatabase();
        Cursor cursor = db.query(TABLE_USERS, null,
                COL_ID + "=?", new String[]{String.valueOf(id)}, null, null, null);
        if (cursor.moveToFirst()) {
            User user = cursorToUser(cursor);
            cursor.close();
            return user;
        }
        cursor.close();
        return null;
    }

    public boolean updateUser(User user) {
        SQLiteDatabase db = getWritableDatabase();
        ContentValues cv = new ContentValues();
        cv.put(COL_NAME, user.getName());
        cv.put(COL_TITLE, user.getTitle());
        cv.put(COL_BIO, user.getBio());
        cv.put(COL_GITHUB, user.getGithub());
        cv.put(COL_LINKEDIN, user.getLinkedin());
        cv.put(COL_WEBSITE, user.getWebsite());
        cv.put(COL_LOCATION, user.getLocation());
        cv.put(COL_PHONE, user.getPhone());
        int rows = db.update(TABLE_USERS, cv, COL_ID + "=?",
                new String[]{String.valueOf(user.getId())});
        return rows > 0;
    }

    private User cursorToUser(Cursor c) {
        User user = new User();
        user.setId(c.getInt(c.getColumnIndexOrThrow(COL_ID)));
        user.setName(c.getString(c.getColumnIndexOrThrow(COL_NAME)));
        user.setEmail(c.getString(c.getColumnIndexOrThrow(COL_EMAIL)));
        user.setPassword(c.getString(c.getColumnIndexOrThrow(COL_PASSWORD)));
        user.setTitle(c.getString(c.getColumnIndexOrThrow(COL_TITLE)));
        user.setBio(c.getString(c.getColumnIndexOrThrow(COL_BIO)));
        user.setGithub(c.getString(c.getColumnIndexOrThrow(COL_GITHUB)));
        user.setLinkedin(c.getString(c.getColumnIndexOrThrow(COL_LINKEDIN)));
        user.setWebsite(c.getString(c.getColumnIndexOrThrow(COL_WEBSITE)));
        user.setLocation(c.getString(c.getColumnIndexOrThrow(COL_LOCATION)));
        user.setPhone(c.getString(c.getColumnIndexOrThrow(COL_PHONE)));
        return user;
    }

    // ─── PROJECT OPERATIONS ──────────────────────────────────────────────────

    public long addProject(Project p) {
        SQLiteDatabase db = getWritableDatabase();
        ContentValues cv = new ContentValues();
        cv.put(COL_USER_ID, p.getUserId());
        cv.put(COL_NAME, p.getTitle());
        cv.put(COL_DESCRIPTION, p.getDescription());
        cv.put(COL_TECH_STACK, p.getTechStack());
        cv.put(COL_LIVE_URL, p.getLiveUrl());
        cv.put(COL_GITHUB_URL, p.getGithubUrl());
        return db.insert(TABLE_PROJECTS, null, cv);
    }

    public List<Project> getProjectsByUser(int userId) {
        List<Project> list = new ArrayList<>();
        SQLiteDatabase db = getReadableDatabase();
        Cursor cursor = db.query(TABLE_PROJECTS, null,
                COL_USER_ID + "=?", new String[]{String.valueOf(userId)},
                null, null, COL_CREATED_AT + " DESC");
        while (cursor.moveToNext()) list.add(cursorToProject(cursor));
        cursor.close();
        return list;
    }

    public boolean updateProject(Project p) {
        SQLiteDatabase db = getWritableDatabase();
        ContentValues cv = new ContentValues();
        cv.put(COL_NAME, p.getTitle());
        cv.put(COL_DESCRIPTION, p.getDescription());
        cv.put(COL_TECH_STACK, p.getTechStack());
        cv.put(COL_LIVE_URL, p.getLiveUrl());
        cv.put(COL_GITHUB_URL, p.getGithubUrl());
        return db.update(TABLE_PROJECTS, cv, COL_ID + "=? AND " + COL_USER_ID + "=?",
                new String[]{String.valueOf(p.getId()), String.valueOf(p.getUserId())}) > 0;
    }

    public boolean deleteProject(int projectId, int userId) {
        SQLiteDatabase db = getWritableDatabase();
        return db.delete(TABLE_PROJECTS, COL_ID + "=? AND " + COL_USER_ID + "=?",
                new String[]{String.valueOf(projectId), String.valueOf(userId)}) > 0;
    }

    private Project cursorToProject(Cursor c) {
        Project p = new Project();
        p.setId(c.getInt(c.getColumnIndexOrThrow(COL_ID)));
        p.setUserId(c.getInt(c.getColumnIndexOrThrow(COL_USER_ID)));
        p.setTitle(c.getString(c.getColumnIndexOrThrow(COL_NAME)));
        p.setDescription(c.getString(c.getColumnIndexOrThrow(COL_DESCRIPTION)));
        p.setTechStack(c.getString(c.getColumnIndexOrThrow(COL_TECH_STACK)));
        p.setLiveUrl(c.getString(c.getColumnIndexOrThrow(COL_LIVE_URL)));
        p.setGithubUrl(c.getString(c.getColumnIndexOrThrow(COL_GITHUB_URL)));
        p.setCreatedAt(c.getString(c.getColumnIndexOrThrow(COL_CREATED_AT)));
        return p;
    }

    // ─── SKILL OPERATIONS ───────────────────────────────────────────────────

    public long addSkill(Skill s) {
        SQLiteDatabase db = getWritableDatabase();
        ContentValues cv = new ContentValues();
        cv.put(COL_USER_ID, s.getUserId());
        cv.put(COL_NAME, s.getName());
        cv.put(COL_CATEGORY, s.getCategory());
        cv.put(COL_LEVEL, s.getLevel());
        return db.insert(TABLE_SKILLS, null, cv);
    }

    public List<Skill> getSkillsByUser(int userId) {
        List<Skill> list = new ArrayList<>();
        SQLiteDatabase db = getReadableDatabase();
        Cursor cursor = db.query(TABLE_SKILLS, null,
                COL_USER_ID + "=?", new String[]{String.valueOf(userId)},
                null, null, COL_CATEGORY + ", " + COL_NAME);
        while (cursor.moveToNext()) list.add(cursorToSkill(cursor));
        cursor.close();
        return list;
    }

    public boolean deleteSkill(int skillId, int userId) {
        SQLiteDatabase db = getWritableDatabase();
        return db.delete(TABLE_SKILLS, COL_ID + "=? AND " + COL_USER_ID + "=?",
                new String[]{String.valueOf(skillId), String.valueOf(userId)}) > 0;
    }

    // ─── ANALYTICS QUERIES ──────────────────────────────────────────────────

    public int getProjectCount(int userId) {
        SQLiteDatabase db = getReadableDatabase();
        Cursor c = db.rawQuery("SELECT COUNT(*) FROM " + TABLE_PROJECTS +
                " WHERE " + COL_USER_ID + "=?", new String[]{String.valueOf(userId)});
        int count = 0;
        if (c.moveToFirst()) count = c.getInt(0);
        c.close();
        return count;
    }

    public int getSkillCount(int userId) {
        SQLiteDatabase db = getReadableDatabase();
        Cursor c = db.rawQuery("SELECT COUNT(*) FROM " + TABLE_SKILLS +
                " WHERE " + COL_USER_ID + "=?", new String[]{String.valueOf(userId)});
        int count = 0;
        if (c.moveToFirst()) count = c.getInt(0);
        c.close();
        return count;
    }

    public List<String[]> getSkillsByCategory(int userId) {
        List<String[]> result = new ArrayList<>();
        SQLiteDatabase db = getReadableDatabase();
        Cursor c = db.rawQuery(
                "SELECT " + COL_CATEGORY + ", COUNT(*) as cnt FROM " + TABLE_SKILLS +
                " WHERE " + COL_USER_ID + "=? GROUP BY " + COL_CATEGORY +
                " ORDER BY cnt DESC",
                new String[]{String.valueOf(userId)});
        while (c.moveToNext()) result.add(new String[]{c.getString(0), String.valueOf(c.getInt(1))});
        c.close();
        return result;
    }

    public List<String[]> getSkillsByLevel(int userId) {
        List<String[]> result = new ArrayList<>();
        SQLiteDatabase db = getReadableDatabase();
        Cursor c = db.rawQuery(
                "SELECT " + COL_LEVEL + ", COUNT(*) as cnt FROM " + TABLE_SKILLS +
                " WHERE " + COL_USER_ID + "=? GROUP BY " + COL_LEVEL +
                " ORDER BY cnt DESC",
                new String[]{String.valueOf(userId)});
        while (c.moveToNext()) result.add(new String[]{c.getString(0), String.valueOf(c.getInt(1))});
        c.close();
        return result;
    }

    private Skill cursorToSkill(Cursor c) {
        Skill s = new Skill();
        s.setId(c.getInt(c.getColumnIndexOrThrow(COL_ID)));
        s.setUserId(c.getInt(c.getColumnIndexOrThrow(COL_USER_ID)));
        s.setName(c.getString(c.getColumnIndexOrThrow(COL_NAME)));
        s.setCategory(c.getString(c.getColumnIndexOrThrow(COL_CATEGORY)));
        s.setLevel(c.getString(c.getColumnIndexOrThrow(COL_LEVEL)));
        return s;
    }

    // ─── SAMPLE DATA ────────────────────────────────────────────────────────

    public void loadSampleData(int userId) {
        // Sample Projects
        String[][] sampleProjects = {
            {"E-Commerce Platform", "Full-stack online store with cart, checkout & admin panel.", "React, Node.js, MongoDB, Stripe", "https://shop.example.com", "https://github.com/user/ecommerce"},
            {"Portfolio CMS", "A content management system for portfolio websites.", "Next.js, SQLite, JWT, Tailwind CSS", "https://portfolio.example.com", "https://github.com/user/portfolio-cms"},
            {"Task Manager App", "Mobile-first task manager with reminders and categories.", "Java, Android, SQLite, Material UI", "", "https://github.com/user/task-manager"},
            {"Weather Dashboard", "Real-time weather app using OpenWeather API.", "Vue.js, REST API, Chart.js", "https://weather.example.com", "https://github.com/user/weather-app"},
            {"Chat Application", "Real-time chat with rooms, emojis and file sharing.", "React, Node.js, Socket.io, MongoDB", "", "https://github.com/user/chat-app"},
        };
        for (String[] p : sampleProjects) {
            Project project = new Project(userId, p[0], p[1], p[2], p[3], p[4]);
            addProject(project);
        }

        // Sample Skills
        String[][] sampleSkills = {
            {"Java", "Mobile", "Advanced"},
            {"Android SDK", "Mobile", "Advanced"},
            {"React", "Frontend", "Expert"},
            {"Next.js", "Frontend", "Advanced"},
            {"JavaScript", "Frontend", "Expert"},
            {"HTML & CSS", "Frontend", "Expert"},
            {"Tailwind CSS", "Frontend", "Advanced"},
            {"Node.js", "Backend", "Advanced"},
            {"REST APIs", "Backend", "Expert"},
            {"SQLite", "Database", "Advanced"},
            {"MongoDB", "Database", "Intermediate"},
            {"SQL", "Database", "Advanced"},
            {"Git & GitHub", "DevOps", "Advanced"},
            {"Figma", "Design", "Intermediate"},
        };
        for (String[] s : sampleSkills) {
            Skill skill = new Skill(userId, s[0], s[1], s[2]);
            addSkill(skill);
        }
    }
}
