package com.portfolio.app.models;

public class Project {
    private int id;
    private int userId;
    private String title;
    private String description;
    private String techStack;
    private String liveUrl;
    private String githubUrl;
    private String createdAt;

    public Project() {}

    public Project(int userId, String title, String description, String techStack,
                   String liveUrl, String githubUrl) {
        this.userId = userId;
        this.title = title;
        this.description = description;
        this.techStack = techStack;
        this.liveUrl = liveUrl;
        this.githubUrl = githubUrl;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }

    public String getTitle() { return title != null ? title : ""; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description != null ? description : ""; }
    public void setDescription(String description) { this.description = description; }

    public String getTechStack() { return techStack != null ? techStack : ""; }
    public void setTechStack(String techStack) { this.techStack = techStack; }

    public String getLiveUrl() { return liveUrl != null ? liveUrl : ""; }
    public void setLiveUrl(String liveUrl) { this.liveUrl = liveUrl; }

    public String getGithubUrl() { return githubUrl != null ? githubUrl : ""; }
    public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }

    public String getCreatedAt() { return createdAt != null ? createdAt : ""; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String[] getTechArray() {
        if (techStack == null || techStack.isEmpty()) return new String[0];
        return techStack.split(",\\s*");
    }
}
