package com.example.collaborationtool.service;

import com.example.collaborationtool.entity.Project;
import com.example.collaborationtool.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository projectRepository;
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
}
