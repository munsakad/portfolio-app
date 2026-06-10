package com.portfolio.app.models;

public class User {
    private int id;
    private String name;
    private String email;
    private String password;
    private String title;
    private String bio;
    private String github;
    private String linkedin;
    private String website;
    private String location;
    private String phone;

    public User() {}

    public User(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    // Getters and setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getTitle() { return title != null ? title : ""; }
    public void setTitle(String title) { this.title = title; }

    public String getBio() { return bio != null ? bio : ""; }
    public void setBio(String bio) { this.bio = bio; }

    public String getGithub() { return github != null ? github : ""; }
    public void setGithub(String github) { this.github = github; }

    public String getLinkedin() { return linkedin != null ? linkedin : ""; }
    public void setLinkedin(String linkedin) { this.linkedin = linkedin; }

    public String getWebsite() { return website != null ? website : ""; }
    public void setWebsite(String website) { this.website = website; }

    public String getLocation() { return location != null ? location : ""; }
    public void setLocation(String location) { this.location = location; }

    public String getPhone() { return phone != null ? phone : ""; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getInitials() {
        if (name == null || name.isEmpty()) return "?";
        String[] parts = name.trim().split("\\s+");
        if (parts.length >= 2) return String.valueOf(parts[0].charAt(0)).toUpperCase()
                + String.valueOf(parts[1].charAt(0)).toUpperCase();
        return String.valueOf(name.charAt(0)).toUpperCase();
    }
}
