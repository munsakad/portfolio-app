package com.portfolio.app.models;

public class Skill {
    private int id;
    private int userId;
    private String name;
    private String category;
    private String level;
    private int levelPercent;

    public Skill() {}

    public Skill(int userId, String name, String category, String level) {
        this.userId = userId;
        this.name = name;
        this.category = category;
        this.level = level;
        this.levelPercent = levelToPercent(level);
    }

    public static int levelToPercent(String level) {
        if (level == null) return 50;
        switch (level) {
            case "Expert": return 95;
            case "Advanced": return 75;
            case "Intermediate": return 55;
            case "Beginner": return 30;
            default: return 50;
        }
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }

    public String getName() { return name != null ? name : ""; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category != null ? category : "General"; }
    public void setCategory(String category) { this.category = category; }

    public String getLevel() { return level != null ? level : "Intermediate"; }
    public void setLevel(String level) {
        this.level = level;
        this.levelPercent = levelToPercent(level);
    }

    public int getLevelPercent() { return levelPercent; }
}
