package com.portfolio.app.activities;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.MenuItem;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.portfolio.app.R;
import com.portfolio.app.database.DatabaseHelper;
import com.portfolio.app.models.User;

import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

public class MainActivity extends AppCompatActivity {

    BottomNavigationView bottomNav;
    int userId;
    DatabaseHelper db;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        db = DatabaseHelper.getInstance(this);
        SharedPreferences prefs = getSharedPreferences("portfolio_prefs", MODE_PRIVATE);
        userId = prefs.getInt("user_id", -1);

        if (userId == -1) {
            startActivity(new Intent(this, LoginActivity.class));
            finish();
            return;
        }

        loadHomeData();

        bottomNav = findViewById(R.id.bottomNav);
        bottomNav.setOnItemSelectedListener(item -> {
            int id = item.getItemId();
            if (id == R.id.nav_home) {
                // Already here
            } else if (id == R.id.nav_profile) {
                startActivity(new Intent(this, ProfileActivity.class));
            } else if (id == R.id.nav_projects) {
                startActivity(new Intent(this, ProjectsActivity.class));
            } else if (id == R.id.nav_analytics) {
                startActivity(new Intent(this, AnalyticsActivity.class));
            } else if (id == R.id.nav_contact) {
                startActivity(new Intent(this, ContactActivity.class));
            }
            return true;
        });
    }

    private void loadHomeData() {
        User user = db.getUserById(userId);
        if (user == null) return;

        TextView tvInitials = findViewById(R.id.tvInitials);
        TextView tvName = findViewById(R.id.tvName);
        TextView tvTitle = findViewById(R.id.tvTitle);
        TextView tvBio = findViewById(R.id.tvBio);
        TextView tvProjectCount = findViewById(R.id.tvProjectCount);
        TextView tvSkillCount = findViewById(R.id.tvSkillCount);
        TextView tvLocation = findViewById(R.id.tvLocation);

        tvInitials.setText(user.getInitials());
        tvName.setText(user.getName());
        tvTitle.setText(user.getTitle().isEmpty() ? "Add your title in Profile" : user.getTitle());
        tvBio.setText(user.getBio().isEmpty() ? "No bio yet. Edit your profile to add one." : user.getBio());
        tvProjectCount.setText(String.valueOf(db.getProjectCount(userId)));
        tvSkillCount.setText(String.valueOf(db.getSkillCount(userId)));
        tvLocation.setText(user.getLocation().isEmpty() ? "Location not set" : "📍 " + user.getLocation());

        findViewById(R.id.btnEditProfile).setOnClickListener(v ->
            startActivity(new Intent(this, ProfileActivity.class)));
        findViewById(R.id.btnViewProjects).setOnClickListener(v ->
            startActivity(new Intent(this, ProjectsActivity.class)));
        findViewById(R.id.btnViewAnalytics).setOnClickListener(v ->
            startActivity(new Intent(this, AnalyticsActivity.class)));
    }

    @Override
    protected void onResume() {
        super.onResume();
        loadHomeData();
        bottomNav.setSelectedItemId(R.id.nav_home);
    }
}
