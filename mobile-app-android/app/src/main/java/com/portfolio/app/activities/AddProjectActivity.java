package com.portfolio.app.activities;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.text.TextUtils;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.portfolio.app.R;
import com.portfolio.app.database.DatabaseHelper;
import com.portfolio.app.models.Project;

public class AddProjectActivity extends AppCompatActivity {
    EditText etTitle, etDescription, etTechStack, etLiveUrl, etGithubUrl;
    Button btnSave;
    DatabaseHelper db;
    int userId;
    int projectId = -1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_project);

        db = DatabaseHelper.getInstance(this);
        userId = getSharedPreferences("portfolio_prefs", MODE_PRIVATE).getInt("user_id", -1);
        projectId = getIntent().getIntExtra("project_id", -1);

        etTitle = findViewById(R.id.etTitle);
        etDescription = findViewById(R.id.etDescription);
        etTechStack = findViewById(R.id.etTechStack);
        etLiveUrl = findViewById(R.id.etLiveUrl);
        etGithubUrl = findViewById(R.id.etGithubUrl);
        btnSave = findViewById(R.id.btnSave);

        btnSave.setOnClickListener(v -> saveProject());
        findViewById(R.id.btnCancel).setOnClickListener(v -> finish());
    }

    private void saveProject() {
        String title = etTitle.getText().toString().trim();
        if (TextUtils.isEmpty(title)) { etTitle.setError("Title required"); return; }

        Project p = new Project(userId, title,
            etDescription.getText().toString().trim(),
            etTechStack.getText().toString().trim(),
            etLiveUrl.getText().toString().trim(),
            etGithubUrl.getText().toString().trim());

        long result = db.addProject(p);
        if (result > 0) {
            Toast.makeText(this, "Project saved!", Toast.LENGTH_SHORT).show();
            finish();
        } else {
            Toast.makeText(this, "Failed to save project.", Toast.LENGTH_SHORT).show();
        }
    }
}
