package com.greenwood.studentms.controller;

import com.greenwood.studentms.model.*;
import com.greenwood.studentms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.swing.text.html.Option;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:4000")
public class AdminController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private GradeRepository gradeRepository;
    private static final Map<String, Double> GRADE_TO_GPA = Map.of(
            "A", 5.0,
            "B", 3.5,
            "C", 2.0,
            "F", 0.0

    );

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PendingStudentRepository pendingStudentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

//    GET TOTAL STUDENTS
    @GetMapping("/students/count")
    public ResponseEntity<Long> getTotalStudents(){
        Long count = studentRepository.count();
        return ResponseEntity.ok(count);
    }

//    GET ALL STUDENTS
    @GetMapping("/students")
    public ResponseEntity<List<Student>> getPendingApprovals(){
        List<Student> theStudents = studentRepository.findAll();

        return ResponseEntity.ok(theStudents);
    }

//    GET PENDING REQUESTS COUNT
    @GetMapping("/requests/count")
    public ResponseEntity<Long> getPendingRequestsCount(){
        Long requestsCount = pendingStudentRepository.count();

        return ResponseEntity.ok(requestsCount);
    }

//    TOTAL COURSES
    @GetMapping("/courses/count")
    public ResponseEntity<Long> getTotalCourses(){
        Long coursesCount = courseRepository.count();
        return ResponseEntity.ok(coursesCount);
    }

//    TOTAL TEACHERS
    @GetMapping("/teachers/count")
    public ResponseEntity<Long> getTeachersCount(){
        Long count = teacherRepository.count();

        return ResponseEntity.ok(count);
    }

//    Get Pending Student LIST
    @GetMapping("/students/pending")
    public ResponseEntity<List<PendingStudent>> getPendingStudents(){
        System.out.println("In the route of retrieving the pending students");
        List<PendingStudent> pendingStudents = pendingStudentRepository.findByIsApprovedFalse();

        return ResponseEntity.ok(pendingStudents);
    }

//    APPROVE THE STUDENT BY ADMIN ROUTE
    @PutMapping("/approve-student/{id}")
    public ResponseEntity<?> handleApproveStudent(@PathVariable Long id) {
        Optional<PendingStudent> pendingStudentOptional = pendingStudentRepository.findById(id);

        if (pendingStudentOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Pending student not found by that id");
        }

        PendingStudent pendingStudent = pendingStudentOptional.get();

        // Step 1: Determine next available ID starting from 5120001
        Optional<Long> maxStudentUserId = userRepository.findMaxStudentId();
        long newId = maxStudentUserId.map(uid -> uid + 1).orElse(5120001L);

        // Step 2: Generate new username and password
        String username = "student"+ (newId-5120000);
        String password = "studepass"+ (newId - 5120000);
        String encodedPassword = passwordEncoder.encode(password);

        // save user
        User newUser = new User();
        newUser.setId(newId);
        newUser.setUsername(username);
        newUser.setPassword(encodedPassword);
        newUser.setRole("STUDENT");
        userRepository.save(newUser);
        System.out.println("THE NEW STUDENT USER SAVED INTO THE TABLE WITH ID "+newId+" AND PASSWORD");

        // save student

        Student approvedStudent = new Student();
        approvedStudent.setId(newId);
        approvedStudent.setFullName(pendingStudent.getFullName());
        approvedStudent.setEmail(pendingStudent.getEmail());
        approvedStudent.setGender(pendingStudent.getGender());
        approvedStudent.setDateOfBirth(pendingStudent.getDateOfBirth());
        approvedStudent.setContactNumber(pendingStudent.getContactNumber());
        approvedStudent.setParentName(pendingStudent.getParentName());
        approvedStudent.setUserId(newId);
        approvedStudent.setApproved(true);
        studentRepository.save(approvedStudent);

        // Step 5: Delete from pending
        pendingStudentRepository.deleteById(id);

        return ResponseEntity.ok(Map.of(
                "message", "Student approved successfully",
                "studentId", newId,
                "username", username,
                "password",password
        ));

    }


    @DeleteMapping("/reject-student/{id}")
    public ResponseEntity<?> handleRejectStudent(@PathVariable Long id){
        Optional<PendingStudent> pendingStudentOptional = pendingStudentRepository.getPendingStudentById(id);

        if(pendingStudentOptional.isPresent()){

            Long pendingStudentId = pendingStudentOptional.get().getId();
            pendingStudentRepository.deleteById(pendingStudentId);

            return ResponseEntity.ok(Map.of(
                    "message", "Student was rejected.",
                    "name", pendingStudentOptional.get().getFullName()
            ));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "message", "there was an error while rejecting the student"
        ));
    }

    @GetMapping("/get-students")
    public ResponseEntity<List<Student>> getAllStudents(){
        List<Student> students = studentRepository.findByIsApprovedTrue();
        return ResponseEntity.ok(students);
    }

    @GetMapping("/get-teachers")
    public ResponseEntity<List<Teacher>> getAllTeachers(){
        List<Teacher> teachers = teacherRepository.findAll();

        return ResponseEntity.ok(teachers);
    }

    @PostMapping("/register-teacher")
    public ResponseEntity<?> handleRegisterTeacher(@RequestBody Teacher newTeacherObject){

        Optional<Long> maxTeacherUserId = userRepository.getMaxTeacherId();

        long newID = maxTeacherUserId.map(uid -> uid + 1).orElse(3123000L);

        String teacherUsername = "teacher" + (newID - 3123000);
        String teacherPassword = "teachpass" + (newID - 3123000);
        String encodedTeacherPassword = passwordEncoder.encode(teacherPassword);

//        CREATE NEW USER
        User newTeacherUser = new User();
        newTeacherUser.setId(newID);
        newTeacherUser.setUsername(teacherUsername);
        newTeacherUser.setPassword(encodedTeacherPassword);
        newTeacherUser.setRole("TEACHER");
        userRepository.save(newTeacherUser);
        System.out.println("NEW TEACHER HAS BEEN SAVED INTO THE USER TABLE WITH USERNAME AND PASSWORD, "+teacherUsername+ " "+ teacherPassword);

        Teacher newTeacher = new Teacher();
        newTeacher.setId(newID);
        newTeacher.setName(newTeacherObject.getName());
        newTeacher.setEmail(newTeacherObject.getEmail());
        newTeacher.setDepartment(newTeacherObject.getDepartment());
        newTeacher.setUserId(newID);
        teacherRepository.save(newTeacher);
        System.out.println("NEW TEACHER HAS BEEN SAVED INTO TEACHER TABLE WITH ID "+ newID);


        return ResponseEntity.ok(Map.of(
           "message", "New teacher was registered into ur DB",
            "teacherID", newTeacher.getId()
        ));
    }

    @PostMapping("/create-course")
    public ResponseEntity<String> handleCreateCourse(@RequestBody Course course){
        System.out.println(course.getName());
        try {
            // Save the course, which will auto-generate the ID
            Course savedCourse = courseRepository.save(course);

            // Return the generated course ID in the response
            return ResponseEntity.ok("Course created successfully with ID: " + savedCourse.getId());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create course");
        }
    }


    //    Get Teachers ID and Department
    @GetMapping("/get-teacher-id-dept")
    public ResponseEntity<Map<Long, String>> handleTeacherIds(){
        List<Object[]> teacherData = teacherRepository.getAllTeacherIdAndDepartments();
        Map<Long, String> teacherMap = new HashMap<>();

        for(Object[] data: teacherData){
            Long id = (Long) data[0];
            String department = (String) data[1];
            teacherMap.put(id, department);
        }
        return ResponseEntity.ok(teacherMap);
    }
//    REMOVE STUDENT FROM OUR DATABASE
    @DeleteMapping("/remove-student/{id}")
    public ResponseEntity<?> handleRemoveStudent(@PathVariable Long id){
        Optional<Student> studentOptional = studentRepository.findById(id);
        Optional<User> userOptional = userRepository.findById(id);

        studentOptional.ifPresent(student -> studentRepository.deleteById(student.getId()));
        userOptional.ifPresent(user -> userRepository.deleteById(user.getId()));

        return ResponseEntity.ok(Map.of(
                "message", "Student has been deleted from the database",
                "name", studentOptional.get().getFullName()
        ));

    }

//    GET ALL GRADES BY STUDENT ID
    @GetMapping("/get-grades")
    public List<Grade> getAllGrades(){
        return gradeRepository.findAll();
    }

    @GetMapping("/student/{studentId}")
    public List<Grade> getGradesByStudent(@PathVariable Long studentId) {
        return gradeRepository.findByStudent_Id(studentId);
    }



//    Summary Chart Data
    @GetMapping("/dashboard-summary")
    public ResponseEntity<Map<String, Object>> getDashboardSummary(){
        List<Grade> grades = gradeRepository.findAll();

//        GRADE COUNTS
        Map<String, Long> gradeCounts = grades.stream()
                .collect(Collectors.groupingBy(Grade::getGrade, Collectors.counting()));

//        GPA PER STUDENT
        Map<Long, List<Double>> studentGpas = new HashMap<>();

        for(Grade grade: grades){
            long studentId = grade.getStudent().getId();
            Double Gpa = GRADE_TO_GPA.getOrDefault(grade.getGrade(), 0.0);
            studentGpas.computeIfAbsent(studentId, k-> new ArrayList<>()).add(Gpa);
        }

        // Calculate average GPA per student
        Map<Long, Double> studentAverageGpas = new HashMap<>();
        for (Map.Entry<Long, List<Double>> entry : studentGpas.entrySet()) {
            double avg = entry.getValue().stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
            studentAverageGpas.put(entry.getKey(), avg);
        }

//        OVERALL GPA AVERAGE
        double overallAvgGpa = studentAverageGpas.values().stream().mapToDouble(Double::doubleValue).average().orElse(0.0);

        // Final response map
        Map<String, Object> response = new HashMap<>();
        response.put("gradeCounts", gradeCounts);
        response.put("studentAverageGpas", studentAverageGpas);
        response.put("overallAverageGpa", overallAvgGpa);

        return ResponseEntity.ok(response);

    }

}
