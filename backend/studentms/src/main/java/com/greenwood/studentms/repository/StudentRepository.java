package com.greenwood.studentms.repository;

import com.greenwood.studentms.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUserId(Long userId);
    Long countByIsApprovedTrue();
    Long countByIsApprovedFalse();


    List<Student> findByIsApprovedTrue();

    @Query("SELECT MAX(s.id) FROM Student s")
    Optional<Long> findMaxId();


}
