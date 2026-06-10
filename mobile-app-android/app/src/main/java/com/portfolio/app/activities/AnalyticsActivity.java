package com.portfolio.app.activities;

import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Bundle;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import com.github.mikephil.charting.charts.BarChart;
import com.github.mikephil.charting.charts.PieChart;
import com.github.mikephil.charting.data.*;
import com.github.mikephil.charting.utils.ColorTemplate;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.portfolio.app.R;
import com.portfolio.app.database.DatabaseHelper;
import java.util.ArrayList;
import java.util.List;

public class AnalyticsActivity extends AppCompatActivity {
    DatabaseHelper db;
    int userId;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_analytics);

        db = DatabaseHelper.getInstance(this);
        userId = getSharedPreferences("portfolio_prefs", MODE_PRIVATE).getInt("user_id", -1);

        loadAnalytics();

        BottomNavigationView bottomNav = findViewById(R.id.bottomNav);
        bottomNav.setSelectedItemId(R.id.nav_analytics);
        bottomNav.setOnItemSelectedListener(item -> {
            int id = item.getItemId();
            if (id == R.id.nav_home) { startActivity(new Intent(this, MainActivity.class)); finish(); }
            else if (id == R.id.nav_profile) { startActivity(new Intent(this, ProfileActivity.class)); finish(); }
            else if (id == R.id.nav_projects) { startActivity(new Intent(this, ProjectsActivity.class)); finish(); }
            else if (id == R.id.nav_contact) { startActivity(new Intent(this, ContactActivity.class)); finish(); }
            return true;
        });
    }

    private void loadAnalytics() {
        int projectCount = db.getProjectCount(userId);
        int skillCount = db.getSkillCount(userId);

        ((TextView) findViewById(R.id.tvTotalProjects)).setText(String.valueOf(projectCount));
        ((TextView) findViewById(R.id.tvTotalSkills)).setText(String.valueOf(skillCount));

        // Skills by Category — Pie Chart
        List<String[]> byCategory = db.getSkillsByCategory(userId);
        setupPieChart(byCategory);

        // Skills by Level — Bar Chart
        List<String[]> byLevel = db.getSkillsByLevel(userId);
        setupBarChart(byLevel);
    }

    private void setupPieChart(List<String[]> data) {
        PieChart chart = findViewById(R.id.pieChart);
        chart.setUsePercentValues(true);
        chart.getDescription().setEnabled(false);
        chart.setHoleColor(Color.parseColor("#1A1A2E"));
        chart.setHoleRadius(40f);
        chart.setEntryLabelColor(Color.WHITE);
        chart.getLegend().setTextColor(Color.WHITE);

        List<PieEntry> entries = new ArrayList<>();
        for (String[] row : data) entries.add(new PieEntry(Float.parseFloat(row[1]), row[0]));

        PieDataSet ds = new PieDataSet(entries, "Skills by Category");
        ds.setColors(ColorTemplate.MATERIAL_COLORS);
        ds.setValueTextColor(Color.WHITE);
        ds.setValueTextSize(12f);
        chart.setData(new PieData(ds));
        chart.invalidate();
    }

    private void setupBarChart(List<String[]> data) {
        BarChart chart = findViewById(R.id.barChart);
        chart.getDescription().setEnabled(false);
        chart.getXAxis().setTextColor(Color.WHITE);
        chart.getAxisLeft().setTextColor(Color.WHITE);
        chart.getAxisRight().setEnabled(false);
        chart.getLegend().setTextColor(Color.WHITE);
        chart.setFitBars(true);

        List<BarEntry> entries = new ArrayList<>();
        List<String> labels = new ArrayList<>();
        for (int i = 0; i < data.size(); i++) {
            entries.add(new BarEntry(i, Float.parseFloat(data.get(i)[1])));
            labels.add(data.get(i)[0]);
        }

        BarDataSet ds = new BarDataSet(entries, "Skills by Level");
        ds.setColors(new int[]{
            Color.parseColor("#00B4D8"),
            Color.parseColor("#0077B6"),
            Color.parseColor("#48CAE4"),
            Color.parseColor("#90E0EF")
        });
        ds.setValueTextColor(Color.WHITE);
        chart.setData(new BarData(ds));

        com.github.mikephil.charting.formatter.IndexAxisValueFormatter formatter =
            new com.github.mikephil.charting.formatter.IndexAxisValueFormatter(labels);
        chart.getXAxis().setValueFormatter(formatter);
        chart.getXAxis().setGranularity(1f);
        chart.invalidate();
    }
}
