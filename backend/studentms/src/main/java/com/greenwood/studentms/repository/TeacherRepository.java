package com.greenwood.studentms.repository;

import com.greenwood.studentms.model.Course;
import com.greenwood.studentms.model.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    Optional<Teacher> findByUserId(Long userId);

    @Query("SELECT t.id, t.department FROM Teacher t")
    List<Object[]> getAllTeacherIdAndDepartments();

    @Query("SELECT MAX(t.id) FROM Teacher t")
    Teacher getMaxIdTeacher();




}
