package com.portfolio.app.adapters;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.portfolio.app.R;
import com.portfolio.app.models.Skill;
import java.util.List;

public class SkillAdapter extends RecyclerView.Adapter<SkillAdapter.ViewHolder> {
    public interface OnDeleteClick { void onDelete(int skillId); }

    private final List<Skill> skills;
    private final OnDeleteClick deleteClick;

    public SkillAdapter(List<Skill> skills, OnDeleteClick deleteClick) {
        this.skills = skills;
        this.deleteClick = deleteClick;
    }

    @NonNull @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_skill, parent, false);
        return new ViewHolder(v);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder h, int pos) {
        Skill s = skills.get(pos);
        h.tvName.setText(s.getName());
        h.tvCategory.setText(s.getCategory());
        h.tvLevel.setText(s.getLevel());
        h.progressBar.setProgress(s.getLevelPercent());
        h.btnDelete.setOnClickListener(v -> deleteClick.onDelete(s.getId()));
    }

    @Override public int getItemCount() { return skills.size(); }

    static class ViewHolder extends RecyclerView.ViewHolder {
        TextView tvName, tvCategory, tvLevel, btnDelete;
        ProgressBar progressBar;
        ViewHolder(View v) {
            super(v);
            tvName = v.findViewById(R.id.tvSkillName);
            tvCategory = v.findViewById(R.id.tvCategory);
            tvLevel = v.findViewById(R.id.tvLevel);
            progressBar = v.findViewById(R.id.progressBar);
            btnDelete = v.findViewById(R.id.btnDelete);
        }
    }
}
