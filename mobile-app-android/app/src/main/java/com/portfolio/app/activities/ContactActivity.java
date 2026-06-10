package com.portfolio.app.activities;

import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.widget.*;
import androidx.appcompat.app.AppCompatActivity;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.portfolio.app.R;
import com.portfolio.app.database.DatabaseHelper;
import com.portfolio.app.models.User;

public class ContactActivity extends AppCompatActivity {
    DatabaseHelper db;
    int userId;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_contact);

        db = DatabaseHelper.getInstance(this);
        userId = getSharedPreferences("portfolio_prefs", MODE_PRIVATE).getInt("user_id", -1);

        User user = db.getUserById(userId);
        if (user != null) {
            TextView tvInitials = findViewById(R.id.tvInitials);
            TextView tvName = findViewById(R.id.tvName);
            TextView tvTitle = findViewById(R.id.tvTitle);
            TextView tvEmail = findViewById(R.id.tvEmail);
            TextView tvLocation = findViewById(R.id.tvLocation);
            TextView tvPhone = findViewById(R.id.tvPhone);

            tvInitials.setText(user.getInitials());
            tvName.setText(user.getName());
            tvTitle.setText(user.getTitle().isEmpty() ? "Developer" : user.getTitle());
            tvEmail.setText(user.getEmail());
            tvLocation.setText(user.getLocation().isEmpty() ? "Not set" : user.getLocation());
            tvPhone.setText(user.getPhone().isEmpty() ? "Not set" : user.getPhone());

            if (!user.getGithub().isEmpty()) {
                findViewById(R.id.btnGithub).setOnClickListener(v ->
                    startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(user.getGithub()))));
            }
            if (!user.getLinkedin().isEmpty()) {
                findViewById(R.id.btnLinkedin).setOnClickListener(v ->
                    startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(user.getLinkedin()))));
            }
            if (!user.getWebsite().isEmpty()) {
                findViewById(R.id.btnWebsite).setOnClickListener(v ->
                    startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(user.getWebsite()))));
            }

            findViewById(R.id.btnEmail).setOnClickListener(v -> {
                Intent emailIntent = new Intent(Intent.ACTION_SENDTO);
                emailIntent.setData(Uri.parse("mailto:" + user.getEmail()));
                startActivity(Intent.createChooser(emailIntent, "Send Email"));
            });
        }

        BottomNavigationView bottomNav = findViewById(R.id.bottomNav);
        bottomNav.setSelectedItemId(R.id.nav_contact);
        bottomNav.setOnItemSelectedListener(item -> {
            int id = item.getItemId();
            if (id == R.id.nav_home) { startActivity(new Intent(this, MainActivity.class)); finish(); }
            else if (id == R.id.nav_profile) { startActivity(new Intent(this, ProfileActivity.class)); finish(); }
            else if (id == R.id.nav_projects) { startActivity(new Intent(this, ProjectsActivity.class)); finish(); }
            else if (id == R.id.nav_analytics) { startActivity(new Intent(this, AnalyticsActivity.class)); finish(); }
            return true;
        });
    }
}
