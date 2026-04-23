package com.example.collaborationtool.service;

import com.example.collaborationtool.entity.Task;
import com.example.collaborationtool.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final ActivityService activityService;
    
    public List<Task> getTasksByProjectId(Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }
    
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }
    
    public Task createTask(Task task) {
        Task saved = taskRepository.save(task);
        Long projectId = saved.getProject() != null ? saved.getProject().getId() : null;
        activityService.logActivity("New task added: " + saved.getTitle(), saved.getAssignee(), projectId, saved.getId());
        messagingTemplate.convertAndSend("/topic/tasks", saved);
        return saved;
    }
    
    public Task updateTask(Long id, Task taskDetails) {
        Task task = taskRepository.findById(id).orElseThrow();
        if (taskDetails.getTitle() != null) task.setTitle(taskDetails.getTitle());
        if (taskDetails.getDescription() != null) task.setDescription(taskDetails.getDescription());
        if (taskDetails.getStatus() != null) task.setStatus(taskDetails.getStatus());
        if (taskDetails.getPriority() != null) task.setPriority(taskDetails.getPriority());
        if (taskDetails.getAssignee() != null) task.setAssignee(taskDetails.getAssignee());
        if (taskDetails.getDueDate() != null) task.setDueDate(taskDetails.getDueDate());
        
        Task saved = taskRepository.save(task);
        Long projectId = saved.getProject() != null ? saved.getProject().getId() : null;
        activityService.logActivity("Task updated: " + saved.getTitle(), saved.getAssignee(), projectId, saved.getId());
        messagingTemplate.convertAndSend("/topic/tasks", saved);
        return saved;
    }
    
    public Task getTaskById(Long id) {
        return taskRepository.findById(id).orElseThrow();
    }

    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id).orElseThrow();
        Long projectId = task.getProject() != null ? task.getProject().getId() : null;
        activityService.logActivity("Task deleted: " + task.getTitle(), task.getAssignee(), projectId, id);
        taskRepository.deleteById(id);
        messagingTemplate.convertAndSend("/topic/task-deleted", id);
    }
}
