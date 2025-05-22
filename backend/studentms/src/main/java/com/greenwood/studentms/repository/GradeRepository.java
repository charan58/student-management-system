package com.greenwood.studentms.repository;

import com.greenwood.studentms.model.Grade;
import com.greenwood.studentms.model.GradeId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GradeRepository extends JpaRepository<Grade, GradeId> {
    List<Grade> findByStudent_Id(Long studentId);
}
