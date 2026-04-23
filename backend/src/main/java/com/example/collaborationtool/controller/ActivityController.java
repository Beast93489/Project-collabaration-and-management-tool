package com.example.collaborationtool.controller;

import com.example.collaborationtool.entity.Activity;
import com.example.collaborationtool.service.ActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ActivityController {
    private final ActivityService activityService;
    
    @GetMapping
    public List<Activity> getRecentActivities() {
        return activityService.getRecentActivities();
    }
}
