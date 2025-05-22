package com.greenwood.studentms.repository;

import com.greenwood.studentms.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // Optional because the user might not exist
    Optional<User> findById(Long id);


    @Query("SELECT MAX(u.id) FROM User u WHERE u.role = 'STUDENT'")
    Optional<Long> findMaxStudentId();

    @Query("SELECT MAX(u.id) FROM User u WHERE u.role = 'TEACHER'")
    Optional<Long> getMaxTeacherId();

}
