package com.greenwood.studentms.controller;

import com.greenwood.studentms.model.PendingStudent;
import com.greenwood.studentms.model.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.greenwood.studentms.repository.PendingStudentRepository;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4000")
public class SharedController {

//    GET NEW STUDENT OBJ FROM CLIENT AND SAVE INTO PENDING STUDENTS
//    FURTHER APPROVAL

    @Autowired
    PendingStudentRepository pendingStudentRepository;

    @PostMapping("/create-request")
    public ResponseEntity<?> handleCreateStudentRequest(@RequestBody PendingStudent newStudentObject){

        // In your controller before saving
        long nextId = pendingStudentRepository.getMaxId() + 1;
        newStudentObject.setId(nextId);
        pendingStudentRepository.save(newStudentObject);

        return ResponseEntity.ok(Map.of(
                "message", "New student request has been sent",
                "requestId", nextId
        ));
    }
}
