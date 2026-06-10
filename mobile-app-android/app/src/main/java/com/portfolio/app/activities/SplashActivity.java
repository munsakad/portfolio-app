package com.portfolio.app.activities;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.Handler;
import androidx.appcompat.app.AppCompatActivity;
import com.portfolio.app.R;

public class SplashActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);

        new Handler().postDelayed(() -> {
            SharedPreferences prefs = getSharedPreferences("portfolio_prefs", MODE_PRIVATE);
            int userId = prefs.getInt("user_id", -1);
            Intent intent = userId != -1
                ? new Intent(this, MainActivity.class)
                : new Intent(this, LoginActivity.class);
            startActivity(intent);
            finish();
        }, 1800);
    }
}
