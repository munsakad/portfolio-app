package com.portfolio.app.activities;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.text.TextUtils;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.portfolio.app.R;
import com.portfolio.app.database.DatabaseHelper;

public class RegisterActivity extends AppCompatActivity {
    EditText etName, etEmail, etPassword, etConfirm;
    Button btnRegister;
    TextView tvLogin;
    DatabaseHelper db;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);
        db = DatabaseHelper.getInstance(this);

        etName = findViewById(R.id.etName);
        etEmail = findViewById(R.id.etEmail);
        etPassword = findViewById(R.id.etPassword);
        etConfirm = findViewById(R.id.etConfirm);
        btnRegister = findViewById(R.id.btnRegister);
        tvLogin = findViewById(R.id.tvLogin);

        btnRegister.setOnClickListener(v -> attemptRegister());
        tvLogin.setOnClickListener(v -> finish());
    }

    private void attemptRegister() {
        String name = etName.getText().toString().trim();
        String email = etEmail.getText().toString().trim();
        String password = etPassword.getText().toString().trim();
        String confirm = etConfirm.getText().toString().trim();

        if (TextUtils.isEmpty(name)) { etName.setError("Name required"); return; }
        if (TextUtils.isEmpty(email)) { etEmail.setError("Email required"); return; }
        if (TextUtils.isEmpty(password)) { etPassword.setError("Password required"); return; }
        if (password.length() < 6) { etPassword.setError("Minimum 6 characters"); return; }
        if (!password.equals(confirm)) { etConfirm.setError("Passwords do not match"); return; }
        if (db.emailExists(email)) { etEmail.setError("Email already registered"); return; }

        long id = db.registerUser(name, email, password);
        if (id > 0) {
            // Load sample data for new user
            db.loadSampleData((int) id);
            SharedPreferences.Editor editor = getSharedPreferences("portfolio_prefs", MODE_PRIVATE).edit();
            editor.putInt("user_id", (int) id);
            editor.putString("user_name", name);
            editor.apply();
            Toast.makeText(this, "Welcome, " + name + "!", Toast.LENGTH_SHORT).show();
            startActivity(new Intent(this, MainActivity.class));
            finishAffinity();
        } else {
            Toast.makeText(this, "Registration failed. Try again.", Toast.LENGTH_SHORT).show();
        }
    }
}
