package com.example.collaborationtool.controller;

import com.example.collaborationtool.entity.Project;
import com.example.collaborationtool.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService projectService;
    
    @GetMapping
    public List<Project> getAllProjects() {
        return projectService.getAllProjects();
    }
    
    @GetMapping("/{id}")
    public Project getProjectById(@PathVariable Long id) {
        return projectService.getProjectById(id);
    }
    
    @PostMapping
    public Project createProject(@RequestBody Project project) {
        return projectService.createProject(project);
    }
}
