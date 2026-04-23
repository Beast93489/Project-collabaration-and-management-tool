package com.example.collaborationtool.service;

import com.example.collaborationtool.entity.Project;
import com.example.collaborationtool.entity.Task;
import com.example.collaborationtool.repository.ProjectRepository;
import com.example.collaborationtool.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final ActivityService activityService;
    
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }
    
    public Project getProjectById(Long id) {
        return projectRepository.findById(id).orElseThrow();
    }
    
    public Project createProject(Project project) {
        Project saved = projectRepository.save(project);
        activityService.logActivity("New project created: " + saved.getTitle(), null, saved.getId(), null);
        return saved;
    }

    public Project updateProject(Long id, Project projectDetails) {
        Project project = projectRepository.findById(id).orElseThrow();
        if (projectDetails.getTitle() != null) project.setTitle(projectDetails.getTitle());
        if (projectDetails.getDescription() != null) project.setDescription(projectDetails.getDescription());
        if (projectDetails.getDeadline() != null) project.setDeadline(projectDetails.getDeadline());
        if (projectDetails.getPriority() != null) project.setPriority(projectDetails.getPriority());
        Project saved = projectRepository.save(project);
        activityService.logActivity("Project updated: " + saved.getTitle(), null, saved.getId(), null);
        return saved;
    }

    @Transactional
    public void deleteProject(Long id) {
        Project project = projectRepository.findById(id).orElseThrow();
        // Delete all tasks in this project first to avoid FK constraints
        List<Task> tasks = taskRepository.findByProjectId(id);
        taskRepository.deleteAll(tasks);
        activityService.logActivity("Project deleted: " + project.getTitle(), null, id, null);
        projectRepository.deleteById(id);
    }
}
