package com.greenwood.studentms.repository;

import com.greenwood.studentms.model.PendingStudent;
import com.greenwood.studentms.model.Student;
import org.hibernate.query.spi.QueryOptionsAdapter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PendingStudentRepository extends JpaRepository<PendingStudent, Long> {
    List<PendingStudent> findByIsApprovedFalse();

    @Query("SELECT MAX(ps.id) FROM PendingStudent ps")
    Long getMaxId();

    @Query()
    Optional<PendingStudent> getPendingStudentById(Long id);

}
