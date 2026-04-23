package com.example.collaborationtool.service;

import com.example.collaborationtool.entity.Activity;
import com.example.collaborationtool.entity.User;
import com.example.collaborationtool.repository.ActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityService {
    private final ActivityRepository activityRepository;
    private final SimpMessagingTemplate messagingTemplate;
    
    public List<Activity> getRecentActivities() {
        return activityRepository.findTop50ByOrderByTimestampDesc();
    }
    
    public Activity logActivity(String message, User user, Long projectId, Long taskId) {
        Activity activity = new Activity();
        activity.setMessage(message);
        activity.setUser(user);
        activity.setProjectId(projectId);
        activity.setTaskId(taskId);
        Activity saved = activityRepository.save(activity);
        
        // Broadcast
        messagingTemplate.convertAndSend("/topic/activities", saved);
        
        return saved;
    }
}
