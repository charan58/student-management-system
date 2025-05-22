package com.greenwood.studentms.repository;

import com.greenwood.studentms.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {
    @Query("SELECT c FROM Course c WHERE c.teacher.id = :teacherId")
    List<Course> findCoursesByTeacherId(@Param("teacherId") Long teacherId);

    @Query("""
    SELECT t.id, COUNT(c.id)
    FROM Course c
    JOIN c.teacher t
    WHERE t.id = :teacherId
    GROUP BY t.id
""")
    List<Object[]> getCourseCountsPerTeacher(@Param("teacherId") Long teacherId);



}
