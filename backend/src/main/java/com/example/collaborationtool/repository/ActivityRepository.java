package com.example.collaborationtool.repository;

import com.example.collaborationtool.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findTop50ByOrderByTimestampDesc();
}
