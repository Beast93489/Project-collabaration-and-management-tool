package com.example.collaborationtool.service;

import com.example.collaborationtool.entity.Project;
import com.example.collaborationtool.entity.Task;
import com.example.collaborationtool.entity.User;
import com.example.collaborationtool.repository.ProjectRepository;
import com.example.collaborationtool.repository.TaskRepository;
import com.example.collaborationtool.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow();
    }
    
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public User save(User user) {
        if (user.getAvatarUrl() == null || user.getAvatarUrl().isEmpty()) {
            user.setAvatarUrl("https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.getName().replaceAll(" ", ""));
        }
        return userRepository.save(user);
    }

    public User updateUser(Long id, User userDetails) {
        User user = getUserById(id);
        user.setName(userDetails.getName());
        user.setEmail(userDetails.getEmail());
        user.setRole(userDetails.getRole());
        if (userDetails.getAvatarUrl() != null && !userDetails.getAvatarUrl().isEmpty()) {
            user.setAvatarUrl(userDetails.getAvatarUrl());
        }
        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = getUserById(id);
        
        List<Task> assignedTasks = taskRepository.findByAssigneeId(id);
        for (Task task : assignedTasks) {
            task.setAssignee(null);
            taskRepository.save(task);
        }
        
        List<Project> allProjects = projectRepository.findAll();
        for (Project project : allProjects) {
            if (project.getMembers().contains(user)) {
                project.getMembers().remove(user);
                projectRepository.save(project);
            }
        }
        
        userRepository.delete(user);
    }
}
