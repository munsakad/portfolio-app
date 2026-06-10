package com.portfolio.app.activities;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.text.TextUtils;
import android.widget.*;
import androidx.appcompat.app.AppCompatActivity;
import com.portfolio.app.R;
import com.portfolio.app.database.DatabaseHelper;
import com.portfolio.app.models.Skill;

public class AddSkillActivity extends AppCompatActivity {
    EditText etSkillName;
    Spinner spCategory, spLevel;
    Button btnSave;
    DatabaseHelper db;
    int userId;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_skill);

        db = DatabaseHelper.getInstance(this);
        userId = getSharedPreferences("portfolio_prefs", MODE_PRIVATE).getInt("user_id", -1);

        etSkillName = findViewById(R.id.etSkillName);
        spCategory = findViewById(R.id.spCategory);
        spLevel = findViewById(R.id.spLevel);
        btnSave = findViewById(R.id.btnSave);

        String[] categories = {"Frontend", "Backend", "Mobile", "Database", "DevOps", "Design", "General"};
        String[] levels = {"Beginner", "Intermediate", "Advanced", "Expert"};
        spCategory.setAdapter(new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, categories));
        spLevel.setAdapter(new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, levels));
        spLevel.setSelection(1);

        btnSave.setOnClickListener(v -> saveSkill());
        findViewById(R.id.btnCancel).setOnClickListener(v -> finish());
    }

    private void saveSkill() {
        String name = etSkillName.getText().toString().trim();
        if (TextUtils.isEmpty(name)) { etSkillName.setError("Skill name required"); return; }
        Skill skill = new Skill(userId, name, spCategory.getSelectedItem().toString(),
            spLevel.getSelectedItem().toString());
        long result = db.addSkill(skill);
        if (result > 0) { Toast.makeText(this, "Skill added!", Toast.LENGTH_SHORT).show(); finish(); }
        else Toast.makeText(this, "Failed to add skill.", Toast.LENGTH_SHORT).show();
    }
}
