package com.greenwood.studentms.controller;


import com.greenwood.studentms.dto.LoginRequest;
import com.greenwood.studentms.exception.IdNotFoundException;
import com.greenwood.studentms.exception.IncorrectPasswordException;
import com.greenwood.studentms.model.Admin;
import com.greenwood.studentms.model.Student;
import com.greenwood.studentms.model.Teacher;
import com.greenwood.studentms.model.User;
import com.greenwood.studentms.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import com.greenwood.studentms.repository.UserRepository;
import com.greenwood.studentms.repository.TeacherRepository;
import com.greenwood.studentms.repository.StudentRepository;
import com.greenwood.studentms.util.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:4000")
public class AuthController {

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // controller/AuthController.java
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        User user = userRepository.findById(request.getId())
                .orElseThrow(()-> new IdNotFoundException("Invalid ID"));


        if(!passwordEncoder.matches(request.getPassword().trim(), user.getPassword())){
            throw new IncorrectPasswordException("Incorrect Password");
        }

        System.out.println("Creds from client "+request.getId()+ " "+ request.getPassword());

        String token = jwtUtil.generateToken(user.getId().toString(), user.getRole());

        String fullName = null;

        if(user.getRole().equals("TEACHER")){
            fullName = teacherRepository.findByUserId(user.getId()).map(Teacher::getName).orElse(null);
        }else if(user.getRole().equals("STUDENT")){
            fullName = studentRepository.findByUserId(user.getId()).map(Student::getFullName).orElse(null);
        }else {
            fullName = adminRepository.findByUserId(user.getId()).map(Admin::getUserName).orElse(null);
        }

        assert fullName != null;
        return ResponseEntity.ok(Map.of(
                "message","Login Success",
                "token", token,
                "loggedUserDetails", Map.of(
                        "id", user.getId(),
                        "role", user.getRole(),
                        "fullName", fullName
                )
        ));
    }

}
