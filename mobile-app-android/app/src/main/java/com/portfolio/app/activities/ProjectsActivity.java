package com.portfolio.app.activities;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.portfolio.app.R;
import com.portfolio.app.adapters.ProjectAdapter;
import com.portfolio.app.database.DatabaseHelper;
import com.portfolio.app.models.Project;
import java.util.List;

public class ProjectsActivity extends AppCompatActivity {
    RecyclerView rvProjects;
    FloatingActionButton fabAdd;
    TextView tvEmpty;
    DatabaseHelper db;
    int userId;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_projects);

        db = DatabaseHelper.getInstance(this);
        userId = getSharedPreferences("portfolio_prefs", MODE_PRIVATE).getInt("user_id", -1);

        rvProjects = findViewById(R.id.rvProjects);
        fabAdd = findViewById(R.id.fabAdd);
        tvEmpty = findViewById(R.id.tvEmpty);

        fabAdd.setOnClickListener(v -> startActivity(new Intent(this, AddProjectActivity.class)));

        BottomNavigationView bottomNav = findViewById(R.id.bottomNav);
        bottomNav.setSelectedItemId(R.id.nav_projects);
        bottomNav.setOnItemSelectedListener(item -> {
            int id = item.getItemId();
            if (id == R.id.nav_home) { startActivity(new Intent(this, MainActivity.class)); finish(); }
            else if (id == R.id.nav_profile) { startActivity(new Intent(this, ProfileActivity.class)); finish(); }
            else if (id == R.id.nav_analytics) { startActivity(new Intent(this, AnalyticsActivity.class)); finish(); }
            else if (id == R.id.nav_contact) { startActivity(new Intent(this, ContactActivity.class)); finish(); }
            return true;
        });
    }

    private void loadProjects() {
        List<Project> projects = db.getProjectsByUser(userId);
        if (projects.isEmpty()) {
            tvEmpty.setVisibility(View.VISIBLE);
            rvProjects.setVisibility(View.GONE);
        } else {
            tvEmpty.setVisibility(View.GONE);
            rvProjects.setVisibility(View.VISIBLE);
            rvProjects.setLayoutManager(new LinearLayoutManager(this));
            rvProjects.setAdapter(new ProjectAdapter(projects,
                project -> {
                    Intent i = new Intent(this, AddProjectActivity.class);
                    i.putExtra("project_id", project.getId());
                    startActivity(i);
                },
                project -> {
                    db.deleteProject(project.getId(), userId);
                    loadProjects();
                }
            ));
        }
    }

    @Override
    protected void onResume() { super.onResume(); loadProjects(); }
}
