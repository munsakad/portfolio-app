package com.portfolio.app.adapters;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.portfolio.app.R;
import com.portfolio.app.models.Project;
import java.util.List;

public class ProjectAdapter extends RecyclerView.Adapter<ProjectAdapter.ViewHolder> {
    public interface OnEditClick { void onEdit(Project p); }
    public interface OnDeleteClick { void onDelete(Project p); }

    private final List<Project> projects;
    private final OnEditClick editClick;
    private final OnDeleteClick deleteClick;

    public ProjectAdapter(List<Project> projects, OnEditClick edit, OnDeleteClick delete) {
        this.projects = projects;
        this.editClick = edit;
        this.deleteClick = delete;
    }

    @NonNull @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_project, parent, false);
        return new ViewHolder(v);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder h, int pos) {
        Project p = projects.get(pos);
        h.tvTitle.setText(p.getTitle());
        h.tvDescription.setText(p.getDescription().isEmpty() ? "No description" : p.getDescription());
        h.tvTechStack.setText(p.getTechStack().isEmpty() ? "—" : p.getTechStack());
        h.tvLiveUrl.setVisibility(p.getLiveUrl().isEmpty() ? View.GONE : View.VISIBLE);
        h.tvLiveUrl.setText("🌐 " + p.getLiveUrl());
        h.tvGithubUrl.setVisibility(p.getGithubUrl().isEmpty() ? View.GONE : View.VISIBLE);
        h.tvGithubUrl.setText("🐙 " + p.getGithubUrl());
        h.btnEdit.setOnClickListener(v -> editClick.onEdit(p));
        h.btnDelete.setOnClickListener(v -> deleteClick.onDelete(p));
    }

    @Override public int getItemCount() { return projects.size(); }

    static class ViewHolder extends RecyclerView.ViewHolder {
        TextView tvTitle, tvDescription, tvTechStack, tvLiveUrl, tvGithubUrl, btnEdit, btnDelete;
        ViewHolder(View v) {
            super(v);
            tvTitle = v.findViewById(R.id.tvTitle);
            tvDescription = v.findViewById(R.id.tvDescription);
            tvTechStack = v.findViewById(R.id.tvTechStack);
            tvLiveUrl = v.findViewById(R.id.tvLiveUrl);
            tvGithubUrl = v.findViewById(R.id.tvGithubUrl);
            btnEdit = v.findViewById(R.id.btnEdit);
            btnDelete = v.findViewById(R.id.btnDelete);
        }
    }
}
