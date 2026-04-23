package com.example.collaborationtool.config;

import com.example.collaborationtool.entity.Project;
import com.example.collaborationtool.entity.Task;
import com.example.collaborationtool.entity.User;
import com.example.collaborationtool.repository.ProjectRepository;
import com.example.collaborationtool.repository.TaskRepository;
import com.example.collaborationtool.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) return;

        User u1 = new User(null, "Rahul Sharma", "rahul@example.com", "Admin", "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul");
        User u2 = new User(null, "Divyanshu Sharma", "divyanshu@example.com", "Team Member", "https://api.dicebear.com/7.x/avataaars/svg?seed=Divyanshu");
        User u3 = new User(null, "Priya Patel", "priya@example.com", "Team Member", "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya");

        userRepository.save(u1);
        userRepository.save(u2);
        userRepository.save(u3);

        Project p1 = new Project();
        p1.setTitle("Website Redesign");
        p1.setDescription("Revamp the main corporate website with modern UI/UX");
        p1.setDeadline(LocalDate.now().plusDays(30));
        p1.setPriority("High");
        p1.setMembers(new HashSet<>(Set.of(u1, u2)));
        projectRepository.save(p1);

        Project p2 = new Project();
        p2.setTitle("Mobile App Launch");
        p2.setDescription("Launch the new iOS and Android apps");
        p2.setDeadline(LocalDate.now().plusDays(60));
        p2.setPriority("Medium");
        p2.setMembers(new HashSet<>(Set.of(u1, u3)));
        projectRepository.save(p2);

        Task t1 = new Task();
        t1.setTitle("Design Mockups");
        t1.setDescription("Create Figma mockups for the homepage");
        t1.setProject(p1);
        t1.setAssignee(u1);
        t1.setDueDate(LocalDate.now().plusDays(5));
        t1.setPriority("High");
        t1.setStatus("Completed");
        taskRepository.save(t1);

        Task t2 = new Task();
        t2.setTitle("Implement Header");
        t2.setDescription("Code the new responsive header");
        t2.setProject(p1);
        t2.setAssignee(u2);
        t2.setDueDate(LocalDate.now().plusDays(10));
        t2.setPriority("Medium");
        t2.setStatus("In Progress");
        taskRepository.save(t2);

        Task t3 = new Task();
        t3.setTitle("API Integration");
        t3.setDescription("Connect mobile app to backend REST API");
        t3.setProject(p2);
        t3.setAssignee(u3);
        t3.setDueDate(LocalDate.now().plusDays(15));
        t3.setPriority("High");
        t3.setStatus("To Do");
        taskRepository.save(t3);
    }
}
