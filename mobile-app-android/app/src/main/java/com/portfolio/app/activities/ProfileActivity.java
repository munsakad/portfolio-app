package com.portfolio.app.activities;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.*;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.portfolio.app.R;
import com.portfolio.app.adapters.SkillAdapter;
import com.portfolio.app.database.DatabaseHelper;
import com.portfolio.app.models.Skill;
import com.portfolio.app.models.User;
import java.util.List;

public class ProfileActivity extends AppCompatActivity {
    EditText etName, etTitle, etBio, etLocation, etPhone, etGithub, etLinkedin, etWebsite;
    Button btnSave;
    TextView tvInitials, tvEmail;
    RecyclerView rvSkills;
    DatabaseHelper db;
    int userId;
    User currentUser;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile);

        db = DatabaseHelper.getInstance(this);
        userId = getSharedPreferences("portfolio_prefs", MODE_PRIVATE).getInt("user_id", -1);

        etName = findViewById(R.id.etName);
        etTitle = findViewById(R.id.etTitle);
        etBio = findViewById(R.id.etBio);
        etLocation = findViewById(R.id.etLocation);
        etPhone = findViewById(R.id.etPhone);
        etGithub = findViewById(R.id.etGithub);
        etLinkedin = findViewById(R.id.etLinkedin);
        etWebsite = findViewById(R.id.etWebsite);
        btnSave = findViewById(R.id.btnSave);
        tvInitials = findViewById(R.id.tvInitials);
        tvEmail = findViewById(R.id.tvEmail);
        rvSkills = findViewById(R.id.rvSkills);

        loadProfile();

        btnSave.setOnClickListener(v -> saveProfile());

        BottomNavigationView bottomNav = findViewById(R.id.bottomNav);
        bottomNav.setSelectedItemId(R.id.nav_profile);
        bottomNav.setOnItemSelectedListener(item -> {
            int id = item.getItemId();
            if (id == R.id.nav_home) { startActivity(new Intent(this, MainActivity.class)); finish(); }
            else if (id == R.id.nav_projects) { startActivity(new Intent(this, ProjectsActivity.class)); finish(); }
            else if (id == R.id.nav_analytics) { startActivity(new Intent(this, AnalyticsActivity.class)); finish(); }
            else if (id == R.id.nav_contact) { startActivity(new Intent(this, ContactActivity.class)); finish(); }
            return true;
        });

        findViewById(R.id.btnAddSkill).setOnClickListener(v ->
            startActivity(new Intent(this, AddSkillActivity.class)));
    }

    private void loadProfile() {
        currentUser = db.getUserById(userId);
        if (currentUser == null) return;

        tvInitials.setText(currentUser.getInitials());
        tvEmail.setText(currentUser.getEmail());
        etName.setText(currentUser.getName());
        etTitle.setText(currentUser.getTitle());
        etBio.setText(currentUser.getBio());
        etLocation.setText(currentUser.getLocation());
        etPhone.setText(currentUser.getPhone());
        etGithub.setText(currentUser.getGithub());
        etLinkedin.setText(currentUser.getLinkedin());
        etWebsite.setText(currentUser.getWebsite());

        List<Skill> skills = db.getSkillsByUser(userId);
        rvSkills.setLayoutManager(new LinearLayoutManager(this));
        rvSkills.setAdapter(new SkillAdapter(skills, skillId -> {
            db.deleteSkill(skillId, userId);
            loadProfile();
        }));
    }

    private void saveProfile() {
        currentUser.setName(etName.getText().toString().trim());
        currentUser.setTitle(etTitle.getText().toString().trim());
        currentUser.setBio(etBio.getText().toString().trim());
        currentUser.setLocation(etLocation.getText().toString().trim());
        currentUser.setPhone(etPhone.getText().toString().trim());
        currentUser.setGithub(etGithub.getText().toString().trim());
        currentUser.setLinkedin(etLinkedin.getText().toString().trim());
        currentUser.setWebsite(etWebsite.getText().toString().trim());

        if (db.updateUser(currentUser)) {
            tvInitials.setText(currentUser.getInitials());
            Toast.makeText(this, "Profile saved!", Toast.LENGTH_SHORT).show();
        } else {
            Toast.makeText(this, "Failed to save profile.", Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    protected void onResume() { super.onResume(); loadProfile(); }
}
