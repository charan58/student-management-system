package com.greenwood.studentms.repository;

import com.greenwood.studentms.model.Enrollment;
import com.greenwood.studentms.model.EnrollmentId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, EnrollmentId> {

    @Query("""
    SELECT e FROM Enrollment e
    JOIN FETCH e.student s
    JOIN FETCH e.course c
    WHERE c.teacher.id = :teacherId
""")
    List<Enrollment> findEnrollmentsByTeacherId(@Param("teacherId") Long teacherId);

    @Query("SELECT e FROM Enrollment e JOIN FETCH e.course WHERE e.studentId = :studentId")
    List<Enrollment> findStudentCoursesById(@Param("studentId") Long studentId);

    @Query("""
    SELECT t.id, t.name, COUNT(DISTINCT s.id)
    FROM Enrollment e
    JOIN e.course c
    JOIN c.teacher t
    JOIN e.student s
    WHERE t.id = :teacherId
    GROUP BY t.id, t.name
""")
    List<Object[]> getStudentCountsPerTeacher(@Param("teacherId") Long teacherId);



}
