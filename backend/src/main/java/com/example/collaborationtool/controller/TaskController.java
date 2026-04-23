package com.example.collaborationtool.controller;

import com.example.collaborationtool.entity.Activity;
import com.example.collaborationtool.entity.Task;
import com.example.collaborationtool.entity.User;
import com.example.collaborationtool.service.ActivityService;
import com.example.collaborationtool.service.TaskService;
import com.example.collaborationtool.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class TaskController {
    private final TaskService taskService;
    private final ActivityService activityService;
    private final UserService userService;
    
    @GetMapping
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }
    
    @GetMapping("/project/{projectId}")
    public List<Task> getTasksByProjectId(@PathVariable Long projectId) {
        return taskService.getTasksByProjectId(projectId);
    }
    
    @PostMapping
    public Task createTask(@RequestBody Task task, @RequestHeader(value="userId", required=false) Long userId) {
        Task created = taskService.createTask(task);
        if (userId != null) {
            User u = userService.getUserById(userId);
            activityService.logActivity(u.getName() + " created task: " + created.getTitle(), u, created.getProject() != null ? created.getProject().getId() : null, created.getId());
        }
        return created;
    }
    
    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task taskDetails, @RequestHeader(value="userId", required=false) Long userId) {
        Task oldTask = taskService.getTaskById(id);
        String oldStatus = oldTask.getStatus();
        
        Task updated = taskService.updateTask(id, taskDetails);
        
        if (userId != null && taskDetails.getStatus() != null && !taskDetails.getStatus().equals(oldStatus)) {
            User u = userService.getUserById(userId);
            activityService.logActivity(u.getName() + " moved task '" + updated.getTitle() + "' to " + updated.getStatus(), u, updated.getProject() != null ? updated.getProject().getId() : null, updated.getId());
        }
        
        return updated;
    }
}
